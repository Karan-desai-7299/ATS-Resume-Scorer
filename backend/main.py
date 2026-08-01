import os
import sys
import gc

# Memory optimizations for low-RAM cloud instances (e.g. Render 512MB free tier)
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["VECLIB_MAXIMUM_THREADS"] = "1"
os.environ["NUMEXPR_NUM_THREADS"] = "1"
os.environ["TORCH_NUM_THREADS"] = "1"

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.core.config import(
    ALLOWED_ORIGINS, 
    APP_DESCRIPTION, 
    APP_TITLE, 
    APP_VERSION, 
    SPACY_MODEL_PRIMARY, 
    SPACY_MODEL_SECONDARY, SENTENCE_TRANSFORMER_MODEL
)
from backend.api.routes import router

logger = logging.getLogger('ats_resume_scorer')

def get_nlp(app: FastAPI):
    """Lazy getter for spaCy model to keep startup RAM under 50MB."""
    if not hasattr(app.state, 'nlp') or app.state.nlp is None:
        import spacy
        nlp_obj = None
        for model_name in [SPACY_MODEL_SECONDARY, "en_core_web_sm", SPACY_MODEL_PRIMARY]:
            try:
                logger.info(f"Lazy loading spaCy model: {model_name}")
                nlp_obj = spacy.load(model_name)
                logger.info(f"Loaded spaCy model: {model_name}")
                break
            except Exception as e:
                logger.warning(f"Could not load spaCy model {model_name}: {e}")
        if nlp_obj is None:
            logger.warning("Falling back to blank 'en' spaCy model")
            nlp_obj = spacy.blank('en')
        app.state.nlp = nlp_obj
        gc.collect()
    return app.state.nlp

def get_embedder(app: FastAPI):
    """Lazy getter for SentenceTransformer to keep startup RAM under 50MB."""
    if not hasattr(app.state, 'embedder') or app.state.embedder is None:
        logger.info(f"Lazy loading SentenceTransformer: {SENTENCE_TRANSFORMER_MODEL}")
        import torch
        torch.set_num_threads(1)
        from sentence_transformers import SentenceTransformer
        app.state.embedder = SentenceTransformer(SENTENCE_TRANSFORMER_MODEL)
        logger.info(f"Loaded SentenceTransformer: {SENTENCE_TRANSFORMER_MODEL}")
        gc.collect()
    return app.state.embedder

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info('Starting ATS Resume Analyzer API (Lazy Loading Mode)...')

    from backend.core.config import SUPABASE_URL, SUPABASE_KEY
    if SUPABASE_URL and SUPABASE_KEY:
        logger.info(f"Supabase configured: URL is set ({SUPABASE_URL}), KEY is set (Length: {len(SUPABASE_KEY)})")
    else:
        logger.warning("Supabase NOT configured: SUPABASE_URL or SUPABASE_KEY environment variable is empty!")

    # Pre-initialize app state variables as None for lazy loading
    app.state.nlp = None
    app.state.embedder = None
    app.state.get_nlp = get_nlp
    app.state.get_embedder = get_embedder

    logger.info('FastAPI initialization complete (~45MB RAM). API is ready to serve requests.')
    yield
    logger.info('Shutting down API...')

app = FastAPI(
    title=APP_TITLE, 
    description=APP_DESCRIPTION, 
    version=APP_VERSION, 
    lifespan=lifespan,
    docs_url='/docs',
    redoc_url='/redoc'
)

app.add_middleware(
    CORSMiddleware, 
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True, 
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(router)

@app.get('/')
async def root():
    return {
        'name': 'ATS Resume Analyzer API',
        'version': '2.0.0',
        'status': 'healthy',
        'endpoints': {
            'POST   /api/v1/analyze-resume': 'Analyze a resume',
            'GET    /api/v1/history': 'Get user history',
            'DELETE /api/v1/history/:id': 'Delete a history entry',
            'GET    /api/v1/health': 'Health check',
            'POST   /api/v1/generate-pdf': 'Generate PDF report from data',
        },
    }

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(
        'backend.main:app',
        host='0.0.0.0',
        port=8000,
        reload=True,
    )
