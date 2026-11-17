"""
Pydantic v2 schemas for prediction, model info, evaluation, and health responses.
"""

from __future__ import annotations

from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Enumerations
# ---------------------------------------------------------------------------


class ModelStatus(str, Enum):
    """Lifecycle status of a model."""

    AVAILABLE = "AVAILABLE"
    PENDING = "PENDING"
    ERROR = "ERROR"


# ---------------------------------------------------------------------------
# Model information
# ---------------------------------------------------------------------------


class ModelInfo(BaseModel):
    """Metadata about a single registered model."""

    model_id: str
    name: str
    framework: str
    file_format: str
    status: ModelStatus
    status_message: str
    params_millions: Optional[float] = None


# ---------------------------------------------------------------------------
# Prediction
# ---------------------------------------------------------------------------


class TopPrediction(BaseModel):
    """A single entry in the top-k prediction list."""

    class_index: int
    class_label: str
    confidence: float


class PredictionRequest(BaseModel):
    """Minimal request body for the prediction endpoint (supplemented by file upload)."""

    model_id: str


class PredictionResponse(BaseModel):
    """Full response returned by the prediction endpoint."""

    model_id: str
    model_name: str
    predicted_class: Optional[str] = None
    predicted_index: Optional[int] = None
    confidence: Optional[float] = None
    top_predictions: Optional[List[TopPrediction]] = None
    status: str  # "success" | "unavailable" | "error"
    message: str
    processing_time_ms: float


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------


class HealthResponse(BaseModel):
    """API health-check response."""

    status: str
    version: str
    timestamp: str


# ---------------------------------------------------------------------------
# Evaluation / metrics
# ---------------------------------------------------------------------------


class MetricsResponse(BaseModel):
    """Evaluation metrics for a single model."""

    model_id: str
    model_name: str
    status: ModelStatus
    metrics: Optional[Dict[str, Any]] = None
    per_class_metrics: Optional[Dict[str, Any]] = None
    evaluation_split: Optional[str] = None
    num_test_samples: Optional[int] = None
    notes: Optional[str] = None


class EvaluationResponse(BaseModel):
    """Evaluation metrics for all registered models."""

    models: List[MetricsResponse]


class ConfusionMatrixResponse(BaseModel):
    """Confusion matrix data for a single model."""

    model_id: str
    model_name: str
    status: ModelStatus
    class_labels: Optional[List[str]] = None
    matrix: Optional[List[List[int]]] = None
    normalization: Optional[str] = None
