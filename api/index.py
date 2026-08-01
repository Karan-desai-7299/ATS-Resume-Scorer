import os
import sys

# Ensure project root is in Python path for backend imports on Vercel
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

# Set memory/thread constraints before any heavy imports
os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("MKL_NUM_THREADS", "1")
os.environ.setdefault("TORCH_NUM_THREADS", "1")
os.environ.setdefault("DISABLE_HEAVY_EMBEDDER", "true")

# Module-level singletons (Vercel reuses the same Lambda container between warm requests)
_nlp = None
_embedder = None

def _get_nlp():
    global _nlp
    if _nlp is None:
        import spacy
        try:
            _nlp = spacy.load("en_core_web_sm")
        except Exception:
            _nlp = spacy.blank("en")
    return _nlp

def _get_embedder():
    """Always returns None on Vercel — RapidFuzz handles matching instead."""
    return None

# Patch FastAPI app state to use module-level singletons
from backend.main import app

# Override the lazy getter functions so app.state.get_nlp / get_embedder
# route to module-level singletons that survive across Vercel warm calls.
@app.on_event("startup")
async def _set_state():
    app.state.nlp = None
    app.state.embedder = None
    app.state.embedder_disabled = True
    app.state.get_nlp = lambda _app: _get_nlp()
    app.state.get_embedder = lambda _app: _get_embedder()
