import sys
import os
import traceback
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
