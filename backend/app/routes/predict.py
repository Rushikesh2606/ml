"""
Prediction route.

POST /api/predict
  - Accepts multipart form: file (image) + model_id (str)
  - Validates file type and size
  - Delegates to InferenceService
  - Returns PredictionResponse
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, Form, HTTPException, UploadFile

from app.config import settings
from app.schemas.prediction import PredictionResponse
from app.services.inference import inference_service
from app.services.model_registry import MODEL_DEFINITIONS

logger = logging.getLogger(__name__)

router = APIRouter(tags=["predict"])

_ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png"}
_ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}


@router.post(
    "/predict",
    response_model=PredictionResponse,
    summary="Run inference on an uploaded leaf image",
)
async def predict(
    file: UploadFile,
    model_id: str = Form(..., description="ID of the model to use for inference"),
) -> PredictionResponse:
    """
    Accept a leaf image and run crop-disease inference with the chosen model.

    Parameters
    ----------
    file:
        JPEG or PNG image of a crop leaf.
    model_id:
        One of ``custom_cnn``, ``resnet``, or ``efficientnet``.

    Returns
    -------
    PredictionResponse
        On success: top-5 class predictions with confidence scores.
        On pending model: ``status="unavailable"`` with an informative message.
        On error: ``status="error"`` with an error description.

    Raises
    ------
    400
        When the uploaded file is not an accepted image type or exceeds the
        size limit.
    404
        When *model_id* does not match any registered model.
    """
    # ----------------------------------------------------------------
    # Validate model_id
    # ----------------------------------------------------------------
    if model_id not in MODEL_DEFINITIONS:
        raise HTTPException(
            status_code=404,
            detail=f"Unknown model_id '{model_id}'. "
                   f"Valid ids: {list(MODEL_DEFINITIONS.keys())}",
        )

    # ----------------------------------------------------------------
    # Validate content type
    # ----------------------------------------------------------------
    content_type = (file.content_type or "").lower()
    if content_type not in _ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Unsupported file type '{content_type}'. "
                "Only image/jpeg and image/png are accepted."
            ),
        )

    # ----------------------------------------------------------------
    # Read bytes and validate size
    # ----------------------------------------------------------------
    image_bytes = await file.read()
    size_mb = len(image_bytes) / (1024 * 1024)
    if size_mb > settings.MAX_IMAGE_SIZE_MB:
        raise HTTPException(
            status_code=400,
            detail=(
                f"File size {size_mb:.2f} MB exceeds the maximum allowed "
                f"{settings.MAX_IMAGE_SIZE_MB} MB."
            ),
        )

    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # ----------------------------------------------------------------
    # Run inference
    # ----------------------------------------------------------------
    logger.info("Received prediction request: model_id='%s', file='%s'", model_id, file.filename)
    result = inference_service.predict(model_id=model_id, image_bytes=image_bytes)

    # Map inference status to HTTP codes
    if result.status == "unavailable":
        raise HTTPException(status_code=503, detail=result.message)
    if result.status == "error":
        raise HTTPException(status_code=500, detail=result.message)

    return result
