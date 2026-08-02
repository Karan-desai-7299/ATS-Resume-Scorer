import sys
import os
import traceback

# Add project root to sys.path
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

# Ensure single thread & disabled heavy embedder
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["TORCH_NUM_THREADS"] = "1"
os.environ["DISABLE_HEAVY_EMBEDDER"] = "true"

try:
    from backend.main import app
    handler = app
except Exception as e:
    err_tb = traceback.format_exc()
    from fastapi import FastAPI
    app = FastAPI()
    @app.get("/{path:path}")
    async def catch_all(path: str):
        return {"status": "error", "error": str(e), "traceback": err_tb.splitlines()}
    @app.post("/{path:path}")
    async def catch_all_post(path: str):
        return {"status": "error", "error": str(e), "traceback": err_tb.splitlines()}
    handler = app
