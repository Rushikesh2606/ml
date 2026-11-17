"""
Model listing route.

GET /api/models → List[ModelInfo]
"""

from __future__ import annotations

from typing import List

from fastapi import APIRouter

from app.schemas.prediction import ModelInfo
from app.services.model_registry import model_registry

router = APIRouter(tags=["models"])


@router.get("/models", response_model=List[ModelInfo], summary="List all registered models")
async def list_models() -> List[ModelInfo]:
    """
    Return metadata and availability status for every registered model.

    Model status reflects whether the model weights file is present on disk.
    ``PENDING`` means no weights have been uploaded yet — no inference is
    possible for those models.
    """
    return model_registry.get_all_model_info()
