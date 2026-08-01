FROM python:3.10-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    OMP_NUM_THREADS=1 \
    MKL_NUM_THREADS=1 \
    TORCH_NUM_THREADS=1 \
    DISABLE_HEAVY_EMBEDDER=true

WORKDIR /app

# Install system dependencies for file parsing & WeasyPrint PDF export
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    gdk-pixbuf2.0-0 \
    libffi-dev \
    shared-mime-info \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    python -m spacy download en_core_web_sm

# Copy application source
COPY . .

# Expose port (default 8000)
EXPOSE 8000

# Start FastAPI server with Uvicorn
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
