"""
Inference service — loads models on demand and runs predictions.

Scientific integrity guarantee: predictions are only returned when a real model
file is present.  PENDING models always return status="unavailable".
"""

from __future__ import annotations

import json
import logging
import time
from pathlib import Path
from typing import Dict, Any, List, Optional

import numpy as np

from app.config import settings
from app.schemas.prediction import ModelStatus, PredictionResponse, TopPrediction
from app.services.model_registry import MODEL_DEFINITIONS, model_registry
from app.utils.image_utils import (
    preprocess_for_pytorch,
    preprocess_for_tflite,
    validate_image,
)

logger = logging.getLogger(__name__)


class InferenceService:
    """
    Runs inference for a specified model on uploaded image bytes.

    Models are loaded lazily (on first request) and cached for subsequent
    calls.  Only PyTorch (.pth) and TFLite (.tflite) models are supported.
    """

    def __init__(self) -> None:
        self._model_cache: Dict[str, Any] = {}

    # ------------------------------------------------------------------
    # Configuration helpers
    # ------------------------------------------------------------------

    def _load_json(self, path: str, label: str) -> Dict[str, Any]:
        """Load a JSON config file, raising a clear error if unavailable."""
        p = Path(path)
        if not p.is_file():
            raise FileNotFoundError(
                f"{label} not found at '{path}'. "
                "Please ensure the data file is present before running inference."
            )
        with p.open("r", encoding="utf-8") as fh:
            data = json.load(fh)
        if data is None:
            raise ValueError(
                f"{label} at '{path}' contains null content. "
                "The file must be a valid JSON object."
            )
        return data

    def _get_preprocessing_config(self, model_id: str) -> Dict[str, Any]:
        """
        Return the preprocessing sub-config for *model_id*.

        The JSON file has the structure::

            {
                "custom_cnn":   { "input_size": [...], "mean": [...], "std": [...] },
                "resnet":       { ... },
                "efficientnet": { ... }
            }

        We extract and return only the dict for the requested model so that
        callers can use ``config["input_size"]`` etc. directly.
        """
        full = self._load_json(settings.PREPROCESSING_CONFIG_PATH, "Preprocessing config")
        model_cfg = full.get(model_id)
        if not model_cfg:
            raise ValueError(
                f"No preprocessing config found for model '{model_id}' in "
                f"'{settings.PREPROCESSING_CONFIG_PATH}'. "
                "Please populate that model's section before running inference."
            )
        return model_cfg

    def _get_class_mapping(self) -> Dict[str, str]:
        """
        Return the ``{str_index: label}`` dict from class_mapping.json.

        The JSON file may be either a bare ``{"0": "Apple...", ...}`` dict
        or our structured format with a nested ``"classes"`` key::

            { "_schema_version": "1.0", "classes": {"0": "...", ...}, ... }

        Both shapes are handled.
        """
        raw = self._load_json(settings.CLASS_MAPPING_PATH, "Class mapping")
        # Structured format with "classes" key
        if "classes" in raw and isinstance(raw["classes"], dict):
            return raw["classes"]
        # Flat format: keys are string integers directly
        # Filter out metadata keys (those that are not numeric strings)
        return {k: v for k, v in raw.items() if k.lstrip("-").isdigit()}

    # ------------------------------------------------------------------
    # Model loading
    # ------------------------------------------------------------------

    def _load_pytorch_model(self, model_id: str):
        """Load a PyTorch model from disk and cache it."""
        if model_id in self._model_cache:
            return self._model_cache[model_id]

        import torch  # type: ignore
        import importlib

        file_path = model_registry.get_model_file_path(model_id)
        logger.info("Loading PyTorch model '%s' from '%s'", model_id, file_path)
        loaded = torch.load(file_path, map_location=torch.device("cpu"))

        if isinstance(loaded, torch.nn.Module):
            model = loaded
        elif isinstance(loaded, dict):
            state_dict = loaded.get("model_state_dict", loaded)
            try:
                arch_module = importlib.import_module(f"app.models.{model_id}.architecture")
                if hasattr(arch_module, "get_model"):
                    model = arch_module.get_model()
                elif hasattr(arch_module, "CustomCNN"):
                    model = arch_module.CustomCNN()
                elif hasattr(arch_module, "ResNetModel"):
                    model = arch_module.ResNetModel()
                elif hasattr(arch_module, "PhytoTurboNet"):
                    model = arch_module.PhytoTurboNet()
                else:
                    classes = [
                        getattr(arch_module, c)
                        for c in dir(arch_module)
                        if isinstance(getattr(arch_module, c), type)
                        and issubclass(getattr(arch_module, c), torch.nn.Module)
                    ]
                    if classes:
                        model = classes[0]()
                    else:
                        raise AttributeError(f"No torch.nn.Module found in app.models.{model_id}.architecture")
                model.load_state_dict(state_dict)
            except Exception as e:
                raise RuntimeError(
                    f"Checkpoint at '{file_path}' is a state_dict dictionary. "
                    f"Please ensure app/models/{model_id}/architecture.py defines the model class so it can be instantiated. Details: {e}"
                )
        else:
            model = loaded

        model.eval()
        # If the model was trained with channels_last memory format (common for
        # CustomCNN and some ResNet configs), convert it to avoid NaN artifacts
        # caused by format mismatches during inference.
        try:
            import torch  # type: ignore
            model = model.to(memory_format=torch.channels_last)
        except Exception:
            pass  # Not all models support channels_last; ignore silently

        self._model_cache[model_id] = model
        return model

    def _load_tflite_model(self, model_id: str):
        """Load a TFLite interpreter from disk and cache it.

        Tries tflite_runtime first (lightweight), falls back to tensorflow.lite.
        TF 2.20 deprecates tf.lite.Interpreter in favour of ai_edge_litert;
        we suppress the deprecation warning so it does not pollute API logs.
        """
        if model_id in self._model_cache:
            return self._model_cache[model_id]

        file_path = model_registry.get_model_file_path(model_id)
        logger.info("Loading TFLite model '%s' from '%s'", model_id, file_path)

        interpreter = None

        # 1. Try tflite_runtime (preferred, lightweight)
        try:
            from tflite_runtime.interpreter import Interpreter  # type: ignore
            interpreter = Interpreter(model_path=file_path)
            logger.info("Using tflite_runtime.Interpreter for '%s'", model_id)
        except ImportError:
            pass

        # 2. Try ai_edge_litert (new TF 2.20+ recommended package)
        if interpreter is None:
            try:
                from ai_edge_litert.interpreter import Interpreter  # type: ignore
                interpreter = Interpreter(model_path=file_path)
                logger.info("Using ai_edge_litert.Interpreter for '%s'", model_id)
            except ImportError:
                pass

        # 3. Fall back to tensorflow.lite (suppress deprecation warning)
        if interpreter is None:
            try:
                import warnings
                import tensorflow as tf  # type: ignore
                with warnings.catch_warnings():
                    warnings.simplefilter("ignore")
                    interpreter = tf.lite.Interpreter(model_path=file_path)
                logger.info("Using tf.lite.Interpreter for '%s'", model_id)
            except ImportError as exc:
                raise RuntimeError(
                    "No TFLite runtime found. Install one of: "
                    "tflite-runtime, ai-edge-litert, or tensorflow."
                ) from exc

        interpreter.allocate_tensors()
        self._model_cache[model_id] = interpreter
        return interpreter

    # ------------------------------------------------------------------
    # Inference implementations
    # ------------------------------------------------------------------

    def _run_pytorch(
        self,
        model_id: str,
        image_bytes: bytes,
        preprocessing_config: Dict[str, Any],
        class_mapping: Dict[str, str],
    ) -> tuple[int, str, float, List[TopPrediction]]:
        """Run PyTorch inference and return (index, label, confidence, top5)."""
        import torch  # type: ignore
        import torch.nn.functional as F  # type: ignore
        from PIL import Image
        import io

        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        tensor = preprocess_for_pytorch(pil_image, preprocessing_config)

        # Apply channels_last memory format to match training configuration
        try:
            tensor = tensor.to(memory_format=torch.channels_last)
        except Exception:
            pass

        model = self._load_pytorch_model(model_id)
        with torch.no_grad():
            output = model(tensor)
            # Clamp extreme logits to prevent NaN in softmax
            output = torch.clamp(output, min=-100.0, max=100.0)
            probabilities = F.softmax(output, dim=1)[0]  # (num_classes,)

        probs_numpy = probabilities.cpu().numpy()

        # Guard against NaN / Inf values (can occur with format mismatches)
        if not np.isfinite(probs_numpy).all():
            probs_numpy = np.nan_to_num(probs_numpy, nan=0.0, posinf=0.0, neginf=0.0)
            total = probs_numpy.sum()
            if total > 0:
                probs_numpy = probs_numpy / total
            else:
                probs_numpy = np.ones(len(probs_numpy)) / len(probs_numpy)

        top_k = min(5, len(probs_numpy))
        top_indices = probs_numpy.argsort()[::-1][:top_k]

        top_predictions: List[TopPrediction] = []
        for idx in top_indices:
            label = class_mapping.get(str(idx), f"class_{idx}")
            top_predictions.append(
                TopPrediction(
                    class_index=int(idx),
                    class_label=label,
                    confidence=float(probs_numpy[idx]),
                )
            )

        best = top_predictions[0]
        return best.class_index, best.class_label, best.confidence, top_predictions

    def _run_tflite(
        self,
        model_id: str,
        image_bytes: bytes,
        preprocessing_config: Dict[str, Any],
        class_mapping: Dict[str, str],
    ) -> tuple[int, str, float, List[TopPrediction]]:
        """Run TFLite inference and return (index, label, confidence, top5)."""
        from PIL import Image
        import io

        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        input_array = preprocess_for_tflite(pil_image, preprocessing_config)

        interpreter = self._load_tflite_model(model_id)
        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()

        interpreter.set_tensor(input_details[0]["index"], input_array)
        interpreter.invoke()

        output_data = interpreter.get_tensor(output_details[0]["index"])[0]  # (num_classes,)
        raw = output_data.astype(np.float64)

        # Apply softmax — the EfficientNet TFLite model outputs raw logits,
        # not probabilities. Numerically stable softmax (subtract max first).
        exp_raw = np.exp(raw - raw.max())
        probs = exp_raw / exp_raw.sum()

        top_k = min(5, len(probs))
        top_indices = probs.argsort()[::-1][:top_k]

        top_predictions: List[TopPrediction] = []
        for idx in top_indices:
            label = class_mapping.get(str(idx), f"class_{idx}")
            top_predictions.append(
                TopPrediction(
                    class_index=int(idx),
                    class_label=label,
                    confidence=float(probs[idx]),
                )
            )

        best = top_predictions[0]
        return best.class_index, best.class_label, best.confidence, top_predictions

    # ------------------------------------------------------------------
    # Public predict method
    # ------------------------------------------------------------------

    def predict(self, model_id: str, image_bytes: bytes) -> PredictionResponse:
        """
        Run inference for *model_id* on *image_bytes*.

        Parameters
        ----------
        model_id:
            One of the registered model identifiers (e.g. ``"custom_cnn"``).
        image_bytes:
            Raw bytes of the uploaded image file.

        Returns
        -------
        PredictionResponse
            Contains predictions on success, or an informative status/message
            when the model is pending or an error occurs.
        """
        start_time = time.perf_counter()
        model_name = model_registry.get_model_name(model_id)
        framework = model_registry.get_model_framework(model_id)

        def elapsed_ms() -> float:
            return (time.perf_counter() - start_time) * 1000.0

        # ----------------------------------------------------------------
        # Guard: unknown model
        # ----------------------------------------------------------------
        if model_id not in MODEL_DEFINITIONS:
            return PredictionResponse(
                model_id=model_id,
                model_name=model_id,
                status="error",
                message=f"Unknown model_id '{model_id}'.",
                processing_time_ms=elapsed_ms(),
            )

        # ----------------------------------------------------------------
        # Guard: model not yet available
        # ----------------------------------------------------------------
        status = model_registry.get_model_status(model_id)
        if status == ModelStatus.PENDING:
            return PredictionResponse(
                model_id=model_id,
                model_name=model_name,
                status="unavailable",
                message="Model pending integration. No weights uploaded yet.",
                processing_time_ms=elapsed_ms(),
            )

        if status == ModelStatus.ERROR:
            return PredictionResponse(
                model_id=model_id,
                model_name=model_name,
                status="error",
                message="Model registry returned an error status.",
                processing_time_ms=elapsed_ms(),
            )

        # ----------------------------------------------------------------
        # Inference
        # ----------------------------------------------------------------
        try:
            preprocessing_config = self._get_preprocessing_config(model_id)
            class_mapping = self._get_class_mapping()

            if framework == "PyTorch":
                pred_index, pred_label, confidence, top_preds = self._run_pytorch(
                    model_id, image_bytes, preprocessing_config, class_mapping
                )
            elif framework == "TensorFlow Lite":
                pred_index, pred_label, confidence, top_preds = self._run_tflite(
                    model_id, image_bytes, preprocessing_config, class_mapping
                )
            else:
                return PredictionResponse(
                    model_id=model_id,
                    model_name=model_name,
                    status="error",
                    message=f"Unsupported framework '{framework}'.",
                    processing_time_ms=elapsed_ms(),
                )

            return PredictionResponse(
                model_id=model_id,
                model_name=model_name,
                predicted_class=pred_label,
                predicted_index=pred_index,
                confidence=confidence,
                top_predictions=top_preds,
                status="success",
                message="Inference completed successfully.",
                processing_time_ms=elapsed_ms(),
            )

        except FileNotFoundError as exc:
            logger.error("Config file missing for '%s': %s", model_id, exc)
            return PredictionResponse(
                model_id=model_id,
                model_name=model_name,
                status="error",
                message=str(exc),
                processing_time_ms=elapsed_ms(),
            )
        except Exception as exc:  # noqa: BLE001
            logger.exception("Inference error for model '%s'", model_id)
            return PredictionResponse(
                model_id=model_id,
                model_name=model_name,
                status="error",
                message=f"Inference failed: {exc}",
                processing_time_ms=elapsed_ms(),
            )


# Module-level singleton
inference_service = InferenceService()
