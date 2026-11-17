"""
Evaluation routes.

GET /api/evaluation                              → EvaluationResponse (all models)
GET /api/evaluation/{model_id}                  → MetricsResponse
GET /api/evaluation/{model_id}/confusion_matrix → ConfusionMatrixResponse
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.schemas.prediction import (
    ConfusionMatrixResponse,
    EvaluationResponse,
    MetricsResponse,
)
from app.services.evaluation_service import evaluation_service
from app.services.model_registry import MODEL_DEFINITIONS

router = APIRouter(tags=["evaluation"])


@router.get(
    "/evaluation",
    response_model=EvaluationResponse,
    summary="Get evaluation metrics for all models",
)
async def get_all_evaluation() -> EvaluationResponse:
    """
    Return evaluation metrics for every registered model.

    Models whose weights have not yet been uploaded will have
    ``status=PENDING`` and ``metrics=null``.
    """
    return evaluation_service.get_all_metrics()


@router.get(
    "/evaluation/{model_id}",
    response_model=MetricsResponse,
    summary="Get evaluation metrics for a single model",
)
async def get_model_evaluation(model_id: str) -> MetricsResponse:
    """
    Return evaluation metrics for the model identified by *model_id*.

    Raises 404 if *model_id* is not a registered model.
    """
    if model_id not in MODEL_DEFINITIONS:
        raise HTTPException(
            status_code=404,
            detail=f"Model '{model_id}' is not registered. "
                   f"Valid ids: {list(MODEL_DEFINITIONS.keys())}",
        )
    return evaluation_service.get_model_metrics(model_id)


@router.get(
    "/evaluation/{model_id}/confusion_matrix",
    response_model=ConfusionMatrixResponse,
    summary="Get confusion matrix for a single model",
)
async def get_confusion_matrix(model_id: str) -> ConfusionMatrixResponse:
    """
    Return the confusion matrix for the model identified by *model_id*.

    Raises 404 if *model_id* is not a registered model.
    """
    if model_id not in MODEL_DEFINITIONS:
        raise HTTPException(
            status_code=404,
            detail=f"Model '{model_id}' is not registered. "
                   f"Valid ids: {list(MODEL_DEFINITIONS.keys())}",
        )
    return evaluation_service.get_confusion_matrix(model_id)
