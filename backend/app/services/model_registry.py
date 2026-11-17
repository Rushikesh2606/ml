"""
Model Registry — checks file existence for each registered model and returns
their status without loading any weights into memory.
"""

from __future__ import annotations

import os
from typing import Dict, List

from app.config import settings
from app.schemas.prediction import ModelInfo, ModelStatus


# ---------------------------------------------------------------------------
# Model definitions catalogue
# ---------------------------------------------------------------------------

MODEL_DEFINITIONS: Dict[str, Dict[str, str]] = {
    "custom_cnn": {
        "name": "Custom CNN (Baseline)",
        "description": "Custom 4-stage convolutional neural network trained from scratch with cross-entropy loss and random weight initialization.",
        "framework": "PyTorch",
        "file_format": ".pth",
        "file_path_env": "CUSTOM_CNN_MODEL_PATH",
    },
    "resnet": {
        "name": "ResNet-50 (Transfer Learning)",
        "description": "ResNet-50 architecture pretrained on ImageNet and fine-tuned on the 38-class PlantVillage dataset.",
        "framework": "PyTorch",
        "file_format": ".pth",
        "file_path_env": "RESNET_MODEL_PATH",
    },
    "efficientnet": {
        "name": "EfficientNet-B0 (Transfer Learning)",
        "description": (
            "EfficientNet-B0 architecture fine-tuned via transfer learning and "
            "exported to TensorFlow Lite FP32 format for low-latency inference."
        ),
        "framework": "TensorFlow Lite",
        "file_format": ".tflite",
        "file_path_env": "EFFICIENTNET_MODEL_PATH",
    },
}

# Map model_id → settings attribute name (used to look up the path at runtime)
_ENV_TO_SETTING: Dict[str, str] = {
    "CUSTOM_CNN_MODEL_PATH": "CUSTOM_CNN_MODEL_PATH",
    "RESNET_MODEL_PATH": "RESNET_MODEL_PATH",
    "EFFICIENTNET_MODEL_PATH": "EFFICIENTNET_MODEL_PATH",
}


class ModelRegistry:
    """
    Registry that reflects the on-disk availability of each model.

    File existence is checked **lazily on each call** so that placing a model
    file on disk is reflected without restarting the server.  Weights are
    never loaded here — that is the responsibility of InferenceService.
    """

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _get_file_path(self, model_id: str) -> str:
        """Return the configured file path for *model_id* (may be empty string)."""
        defn = MODEL_DEFINITIONS.get(model_id, {})
        env_key = defn.get("file_path_env", "")
        return getattr(settings, env_key, "") if env_key else ""

    def _resolve_status(self, model_id: str) -> tuple[ModelStatus, str]:
        """
        Determine ModelStatus by checking whether the model file exists.

        Returns
        -------
        (ModelStatus, status_message)
        """
        file_path = self._get_file_path(model_id)

        if not file_path:
            return (
                ModelStatus.PENDING,
                "Model path not configured. No weights uploaded yet.",
            )

        if os.path.isfile(file_path):
            return ModelStatus.AVAILABLE, "Model file found and ready."

        return (
            ModelStatus.PENDING,
            f"Model file not found at '{file_path}'. No weights uploaded yet.",
        )

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def get_all_model_info(self) -> List[ModelInfo]:
        """Return a :class:`ModelInfo` list for every registered model."""
        result: List[ModelInfo] = []
        for model_id, defn in MODEL_DEFINITIONS.items():
            status, message = self._resolve_status(model_id)
            result.append(
                ModelInfo(
                    model_id=model_id,
                    name=defn["name"],
                    framework=defn["framework"],
                    file_format=defn["file_format"],
                    status=status,
                    status_message=message,
                    params_millions=None,  # populated when weights are available
                )
            )
        return result

    def get_model_status(self, model_id: str) -> ModelStatus:
        """Return the :class:`ModelStatus` for a single model."""
        if model_id not in MODEL_DEFINITIONS:
            return ModelStatus.ERROR
        status, _ = self._resolve_status(model_id)
        return status

    def is_available(self, model_id: str) -> bool:
        """Return ``True`` if the model file exists on disk and is ready."""
        return self.get_model_status(model_id) == ModelStatus.AVAILABLE

    def get_model_name(self, model_id: str) -> str:
        """Return the human-readable name for *model_id*."""
        return MODEL_DEFINITIONS.get(model_id, {}).get("name", model_id)

    def get_model_framework(self, model_id: str) -> str:
        """Return the framework string for *model_id*."""
        return MODEL_DEFINITIONS.get(model_id, {}).get("framework", "")

    def get_model_file_path(self, model_id: str) -> str:
        """Return the resolved file path for *model_id*."""
        return self._get_file_path(model_id)


# Module-level singleton
model_registry = ModelRegistry()
