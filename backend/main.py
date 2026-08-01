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

logger=logging.getLogger('ats_resume_scorer')

@asynccontextmanager
async def lifespan(app:FastAPI):
    logger.info('Starting ATS Resume Analyzer API...')

    from backend.core.config import SUPABASE_URL, SUPABASE_KEY
    if SUPABASE_URL and SUPABASE_KEY:
        logger.info(f"Supabase configured: URL is set ({SUPABASE_URL}), KEY is set (Length: {len(SUPABASE_KEY)})")
    else:
        logger.warning("Supabase NOT configured: SUPABASE_URL or SUPABASE_KEY environment variable is empty!")

    import spacy
    # Try small model first on cloud servers to prevent RAM OOM, or primary model
    spacy_models_to_try = [SPACY_MODEL_SECONDARY, SPACY_MODEL_PRIMARY, "en_core_web_sm"]
    nlp_loaded = False
    for model_name in spacy_models_to_try:
        try:
            logger.info(f'Attempting to load spaCy model: {model_name}')
            app.state.nlp = spacy.load(model_name)
            logger.info(f'Successfully loaded spaCy model: {model_name}')
            nlp_loaded = True
            break
        except OSError:
            continue

    if not nlp_loaded:
        logger.error('No spaCy model could be loaded! Creating blank en model fallback.')
        app.state.nlp = spacy.blank('en')

    logger.info(f'Loading SentenceTransformer: {SENTENCE_TRANSFORMER_MODEL}')
    import torch
    torch.set_num_threads(1)
    from sentence_transformers import SentenceTransformer
    app.state.embedder = SentenceTransformer(SENTENCE_TRANSFORMER_MODEL)
    logger.info(f'Loaded {SENTENCE_TRANSFORMER_MODEL}')

    # Force memory cleanup after model initialization
    gc.collect()
    logger.info('All models initialized with memory optimizations. Ready to serve requests.')

    yield

    logger.info('Shutting down API...')

app=FastAPI(
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
    allow_methods     = ['*'],
    allow_headers     = ['*'],

)

app.include_router(router)

@app.get('/')
async def root():
    return {
        'name':      'ATS Resume Analyzer API',
        'version':   '2.0.0',
        'endpoints': {
            'POST   /api/v1/analyze-resume': 'Analyze a resume',
            'GET    /api/v1/history':        'Get user history',
            'DELETE /api/v1/history/:id':    'Delete a history entry',
            'GET    /api/v1/health':         'Health check',
            'POST   /api/v1/generate-pdf':   'Generate PDF report from data',
        },
    }

if __name__=='__main__':
    import uvicorn
    uvicorn.run(
        'backend.main:app',
        host    = '0.0.0.0',
        port    = 8000,
        reload  = True,    # Auto-restart on code changes (dev only)
    )
