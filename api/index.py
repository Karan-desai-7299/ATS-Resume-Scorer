import sys
import os
import traceback
import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ats_vercel")

# ── 1. Root path setup ───────────────────────────────────────────────────────
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["TORCH_NUM_THREADS"] = "1"
os.environ["DISABLE_HEAVY_EMBEDDER"] = "true"

# ── 2. Unconditional top-level app for Vercel AST scanner ───────────────────
app = FastAPI(title="ATS Resume Scorer Backend", docs_url="/docs", redoc_url="/redoc")

# Set state attributes that routes depend on (no lifespan needed for serverless)
app.state.nlp               = None
app.state.embedder          = None
app.state.embedder_disabled = True

def _get_nlp_vercel(_a):
    s = getattr(_a, 'state', _a)
    if getattr(s, 'nlp', None) is None:
        try:
            import spacy
            s.nlp = spacy.blank("en")
        except Exception:
            s.nlp = None
    return getattr(s, 'nlp', None)

app.state.get_nlp     = _get_nlp_vercel
app.state.get_embedder = lambda _a: None

@app.exception_handler(Exception)
async def global_exc(request: Request, exc: Exception):
    logger.exception(f"Unhandled: {exc}")
    return JSONResponse(
        status_code=500,
        content={"status": "error", "error": str(exc), "type": type(exc).__name__}
    )

# ── 3. Load backend routes ───────────────────────────────────────────────────
_boot_error_msg  = None
_boot_error_tb   = None

try:
    from backend.core.config import ALLOWED_ORIGINS
    from backend.api.routes import router

    app.add_middleware(
        CORSMiddleware,
        allow_origins=ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(router)

    @app.get("/")
    async def root():
        return {"name": "ATS Resume Analyzer API", "status": "healthy"}

    logger.info("Backend routes loaded successfully.")

except Exception as _exc:
    # Store error OUTSIDE the except scope so Python 3 scoping doesn't clear it
    _boot_error_msg = str(_exc)
    _boot_error_tb  = traceback.format_exc()
    logger.error(f"Backend boot error: {_boot_error_msg}\n{_boot_error_tb}")

    @app.get("/{path:path}")
    async def _boot_err_get(path: str):
        return JSONResponse(
            status_code=503,
            content={
                "status": "boot_error",
                "error": _boot_error_msg,
                "traceback": _boot_error_tb.splitlines() if _boot_error_tb else [],
            }
        )

    @app.post("/{path:path}")
    async def _boot_err_post(path: str):
        return JSONResponse(
            status_code=503,
            content={
                "status": "boot_error",
                "error": _boot_error_msg,
                "traceback": _boot_error_tb.splitlines() if _boot_error_tb else [],
            }
        )

handler = app
