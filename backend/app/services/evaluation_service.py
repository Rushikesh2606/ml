"""
Evaluation service — reads pre-computed metrics and confusion matrices from
JSON files produced during offline model evaluation.

Scientific integrity: no numbers are fabricated.  If the JSON file is absent
or contains null metrics (status=PENDING), the response reflects that.
"""

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any, Dict, Optional

from app.config import settings
from app.schemas.prediction import (
    ConfusionMatrixResponse,
    EvaluationResponse,
    MetricsResponse,
    ModelStatus,
)
from app.services.model_registry import MODEL_DEFINITIONS, model_registry

logger = logging.getLogger(__name__)


class EvaluationService:
    """
    Reads evaluation artefacts stored under ``EVALUATION_RESULTS_DIR/``.

    Expected directory layout::

        evaluation_results/
            custom_cnn/
                metrics.json
                confusion_matrix.json
            resnet/
                metrics.json
                confusion_matrix.json
            efficientnet/
                metrics.json
                confusion_matrix.json
    """

    def _eval_dir(self, model_id: str) -> Path:
        return Path(settings.EVALUATION_RESULTS_DIR) / model_id

    def _read_json(self, path: Path) -> Optional[Dict[str, Any]]:
        """Return parsed JSON dict or ``None`` if the file does not exist / is null."""
        if not path.is_file():
            return None
        try:
            with path.open("r", encoding="utf-8") as fh:
                return json.load(fh)
        except json.JSONDecodeError as exc:
            logger.warning("Failed to parse '%s': %s", path, exc)
            return None

    # ------------------------------------------------------------------
    # Single-model helpers
    # ------------------------------------------------------------------

    def get_model_metrics(self, model_id: str) -> MetricsResponse:
        """
        Return evaluation metrics for a single model.

        If the metrics.json file is absent or its content signals PENDING
        (via a ``_status`` key), the response will have ``status=PENDING``
        and ``metrics=None``.
        """
        model_name = model_registry.get_model_name(model_id)

        if model_id not in MODEL_DEFINITIONS:
            return MetricsResponse(
                model_id=model_id,
                model_name=model_id,
                status=ModelStatus.ERROR,
                notes=f"Unknown model_id '{model_id}'.",
            )

        metrics_path = self._eval_dir(model_id) / "metrics.json"
        data = self._read_json(metrics_path)

        if data is None:
            return MetricsResponse(
                model_id=model_id,
                model_name=model_name,
                status=ModelStatus.PENDING,
                notes="metrics.json not found. Evaluation has not been run yet.",
            )

        # Check for an explicit PENDING sentinel written by the evaluation script
        file_status = data.get("_status", "")
        if "PENDING" in str(file_status).upper():
            return MetricsResponse(
                model_id=model_id,
                model_name=model_name,
                status=ModelStatus.PENDING,
                notes=data.get("_notes", "Evaluation pending — model weights not yet available."),
            )

        return MetricsResponse(
            model_id=model_id,
            model_name=model_name,
            status=ModelStatus.AVAILABLE,
            metrics=data.get("metrics"),
            per_class_metrics=data.get("per_class_metrics"),
            evaluation_split=data.get("evaluation_split"),
            num_test_samples=data.get("num_test_samples"),
            notes=data.get("notes"),
        )

    def get_confusion_matrix(self, model_id: str) -> ConfusionMatrixResponse:
        """
        Return the confusion matrix for a single model.

        Returns ``status=PENDING`` when the matrix file is absent or empty.
        """
        model_name = model_registry.get_model_name(model_id)

        if model_id not in MODEL_DEFINITIONS:
            return ConfusionMatrixResponse(
                model_id=model_id,
                model_name=model_id,
                status=ModelStatus.ERROR,
            )

        cm_path = self._eval_dir(model_id) / "confusion_matrix.json"
        data = self._read_json(cm_path)

        if data is None:
            return ConfusionMatrixResponse(
                model_id=model_id,
                model_name=model_name,
                status=ModelStatus.PENDING,
            )

        file_status = data.get("_status", "")
        if "PENDING" in str(file_status).upper():
            return ConfusionMatrixResponse(
                model_id=model_id,
                model_name=model_name,
                status=ModelStatus.PENDING,
            )

        return ConfusionMatrixResponse(
            model_id=model_id,
            model_name=model_name,
            status=ModelStatus.AVAILABLE,
            class_labels=data.get("class_labels"),
            matrix=data.get("matrix"),
            normalization=data.get("normalization"),
        )

    # ------------------------------------------------------------------
    # All-models aggregate
    # ------------------------------------------------------------------

    def get_all_metrics(self) -> EvaluationResponse:
        """Return evaluation metrics for every registered model."""
        return EvaluationResponse(
            models=[self.get_model_metrics(mid) for mid in MODEL_DEFINITIONS]
        )


# Module-level singleton
evaluation_service = EvaluationService()
