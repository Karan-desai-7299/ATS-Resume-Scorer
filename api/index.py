"""
Vercel Serverless entrypoint for ATS Resume Scorer FastAPI backend.

On Vercel, weasyprint/cairo binaries are unavailable. We guard all heavy
imports and replace them with lightweight stubs so the app starts cleanly.
"""
import os
import sys

# ── Environment – set BEFORE any other import ──────────────────────────────
os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("MKL_NUM_THREADS", "1")
os.environ.setdefault("OPENBLAS_NUM_THREADS", "1")
os.environ.setdefault("TORCH_NUM_THREADS", "1")
os.environ.setdefault("DISABLE_HEAVY_EMBEDDER", "true")

# Add project root to sys.path
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

# ── Stub out modules that need native binaries unavailable on Vercel ────────
import types

def _make_stub(name):
    mod = types.ModuleType(name)
    mod.__spec__ = None
    sys.modules[name] = mod
    return mod

# Stub weasyprint (requires libcairo2 — not on Vercel Lambda)
_wp = _make_stub("weasyprint")
_wp.HTML = None
_wp.CSS = None

# ── Module-level NLP singleton (warm Lambda reuse) ──────────────────────────
_nlp = None

def _get_nlp():
    global _nlp
    if _nlp is None:
        try:
            import spacy
            _nlp = spacy.blank("en")   # blank model — no download needed
        except Exception:
            _nlp = None
    return _nlp

# ── Build the FastAPI app ────────────────────────────────────────────────────
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

import gc

@asynccontextmanager
async def lifespan(application: FastAPI):
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
        "endpoints": {
            "POST /api/v1/analyze-resume": "Analyze a resume",
            "GET  /api/v1/history":        "Get user history",
            "GET  /api/v1/health":         "Health check",
        },
    }
