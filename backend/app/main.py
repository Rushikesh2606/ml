"""
Main entry point for the PhytoTurboNet FastAPI application.

Provides REST endpoints for:
- Health checks: GET /api/health
- Model registry & availability: GET /api/models
- Evaluation metrics & confusion matrices: GET /api/evaluation
- Live disease inference: POST /api/predict
"""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes import evaluation, health, models, predict
from app.services.model_registry import model_registry

logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("phytoturbonet")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Log model availability at startup."""
    logger.info("Initializing PhytoTurboNet API...")
    for model_info in model_registry.get_all_model_info():
        logger.info(
            "Model registered: %s [%s] -> Status: %s (%s)",
            model_info.name,
            model_info.model_id,
            model_info.status.value,
            model_info.status_message,
        )
    yield
    logger.info("Shutting down PhytoTurboNet API...")


app = FastAPI(
    title="PhytoTurboNet API",
    description=(
        "Research platform API for Comparative Analysis of Custom CNN and "
        "Transfer Learning Architectures for Crop Leaf Disease Detection."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes with /api prefix
app.include_router(health.router, prefix="/api")
app.include_router(models.router, prefix="/api")
app.include_router(evaluation.router, prefix="/api")
app.include_router(predict.router, prefix="/api")


@app.get("/", summary="Root status and information")
async def root():
    return {
        "project": "Comparative Analysis of Deep Learning Architectures for Crop Leaf Disease Detection",
        "api": "PhytoTurboNet API",
        "status": "online",
        "docs_url": "/docs",
        "models_url": "/api/models",
        "evaluation_url": "/api/evaluation",
    }
