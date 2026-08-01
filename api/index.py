"""
Vercel Serverless entrypoint for ATS Resume Scorer FastAPI backend.
All heavy / native-binary imports are stubbed out for the Vercel Lambda environment.
"""
import os
import sys
import types
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ats_vercel")

# ── 1. Env defaults (BEFORE any other import) ────────────────────────────────
os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("MKL_NUM_THREADS", "1")
os.environ.setdefault("OPENBLAS_NUM_THREADS", "1")
os.environ.setdefault("TORCH_NUM_THREADS", "1")
os.environ.setdefault("DISABLE_HEAVY_EMBEDDER", "true")

# ── 2. Add project root to sys.path ──────────────────────────────────────────
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

# ── 3. Stub packages that need native/system libraries unavailable on Vercel ──
def _stub(name: str, **attrs):
    """Register a lightweight fake module so imports don't crash."""
    mod = types.ModuleType(name)
    mod.__spec__ = None
    for k, v in attrs.items():
        setattr(mod, k, v)
    sys.modules[name] = mod
    return mod

# weasyprint needs libcairo2, libpango — not on Vercel Lambda
_stub("weasyprint", HTML=None, CSS=None)

# sentence_transformers needs torch/CUDA — too large for Vercel bundle
_stub("sentence_transformers", SentenceTransformer=None)
_stub("torch", set_num_threads=lambda n: None)

logger.info("Stubs registered. Importing FastAPI application…")

# ── 4. Import the FastAPI app ─────────────────────────────────────────────────
try:
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    from contextlib import asynccontextmanager

    @asynccontextmanager
    async def lifespan(application: FastAPI):
        # Inject lazy getters — embedder always None (RapidFuzz handles matching)
        application.state.nlp             = None
        application.state.embedder        = None
        application.state.embedder_disabled = True
        application.state.get_nlp         = lambda _app: _get_nlp()
        application.state.get_embedder    = lambda _app: None
        yield

    from backend.core.config import (
        ALLOWED_ORIGINS, APP_TITLE, APP_DESCRIPTION, APP_VERSION,
    )
    from backend.api.routes import router

    app = FastAPI(
        title=APP_TITLE,
        description=APP_DESCRIPTION,
        version=APP_VERSION,
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc",
    )

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
            "version": APP_VERSION,
            "status": "healthy",
        }

    logger.info("FastAPI app created successfully.")

except Exception as _boot_exc:
    logger.exception(f"BOOT ERROR — could not create FastAPI app: {_boot_exc}")

    # Fallback: return a minimal ASGI app that explains the boot failure
    from fastapi import FastAPI as _FastAPI
    app = _FastAPI()

    @app.get("/{path:path}")
    async def _error(path: str):
        return {"status": "boot_error", "error": str(_boot_exc)}


# ── 5. Module-level NLP singleton (survives warm Lambda reuse) ────────────────
_nlp = None

def _get_nlp():
    global _nlp
    if _nlp is None:
        try:
            import spacy
            _nlp = spacy.blank("en")
            logger.info("spaCy blank('en') model loaded.")
        except Exception as exc:
            logger.warning(f"spaCy unavailable: {exc}")
            _nlp = None
    return _nlp
