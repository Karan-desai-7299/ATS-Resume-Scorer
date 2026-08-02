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

# ── 2. Unconditional top-level app assignment for Vercel AST scanner ────────
app = FastAPI(title="ATS Resume Scorer Backend", docs_url="/docs", redoc_url="/redoc")

# Initialize app state attributes for serverless requests
app.state.nlp = None
app.state.embedder = None
app.state.embedder_disabled = True

def _get_nlp_vercel(_app):
    if getattr(_app.state, 'nlp', None) is None:
        try:
            import spacy
            _app.state.nlp = spacy.blank("en")
        except Exception:
            _app.state.nlp = None
    return _app.state.nlp

def _get_embedder_vercel(_app):
    return None

app.state.get_nlp = _get_nlp_vercel
app.state.get_embedder = _get_embedder_vercel

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled exception on {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"status": "error", "message": str(exc), "type": type(exc).__name__, "path": request.url.path}
    )

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
        return {
            "name": "ATS Resume Analyzer API",
            "status": "healthy",
            "environment": "Vercel Serverless",
        }

except Exception as e:
    err_tb = traceback.format_exc()
    @app.get("/{path:path}")
    async def catch_all_err(path: str):
        return {"status": "boot_error", "error": str(e), "traceback": err_tb.splitlines()}

handler = app
