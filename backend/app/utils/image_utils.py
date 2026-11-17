"""
Image validation and preprocessing utilities for PyTorch and TFLite models.
"""

from __future__ import annotations

import io
from typing import Dict, Any

import numpy as np
from PIL import Image, UnidentifiedImageError

# Torch and torchvision are optional — imported lazily inside the functions
# that need them so the module can be imported even without a GPU environment.


# ---------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------


def validate_image(image_bytes: bytes, max_size_mb: float) -> Image.Image:
    """
    Validate raw image bytes and return an RGB PIL Image.

    Parameters
    ----------
    image_bytes:
        Raw bytes of the uploaded image.
    max_size_mb:
        Maximum allowed file size in megabytes.

    Returns
    -------
    PIL.Image.Image
        The validated image converted to RGB colour space.

    Raises
    ------
    ValueError
        If the image exceeds the size limit, is not JPEG/PNG, or cannot be
        decoded.
    """
    # Size check
    size_mb = len(image_bytes) / (1024 * 1024)
    if size_mb > max_size_mb:
        raise ValueError(
            f"Image size {size_mb:.2f} MB exceeds the maximum allowed "
            f"{max_size_mb} MB."
        )

    # Decode
    try:
        pil_image = Image.open(io.BytesIO(image_bytes))
    except UnidentifiedImageError as exc:
        raise ValueError("Could not decode image. Ensure it is a valid image file.") from exc

    # Format check
    allowed_formats = {"JPEG", "PNG"}
    if pil_image.format not in allowed_formats:
        raise ValueError(
            f"Unsupported image format '{pil_image.format}'. "
            "Only JPEG and PNG are accepted."
        )

    # Convert to RGB (handles RGBA, greyscale, palette images, etc.)
    pil_image = pil_image.convert("RGB")
    return pil_image


# ---------------------------------------------------------------------------
# PyTorch preprocessing
# ---------------------------------------------------------------------------


def preprocess_for_pytorch(pil_image: Image.Image, config: Dict[str, Any]):
    """
    Preprocess a PIL image into a normalised PyTorch tensor.

    Parameters
    ----------
    pil_image:
        RGB PIL image (already validated).
    config:
        Preprocessing configuration dict with keys::

            {
                "image_size": int | [H, W],
                "mean": [float, float, float],   # per-channel mean
                "std":  [float, float, float],   # per-channel std
            }

    Returns
    -------
    torch.Tensor
        Shape ``(1, C, H, W)`` float32 tensor ready for model inference.
    """
    import torch
    from torchvision import transforms  # type: ignore

    image_size = config.get("image_size", 224)
    if isinstance(image_size, (list, tuple)):
        resize_to = tuple(image_size)
    else:
        resize_to = (int(image_size), int(image_size))

    mean = config.get("mean", [0.485, 0.456, 0.406])
    std = config.get("std", [0.229, 0.224, 0.225])

    transform = transforms.Compose(
        [
            transforms.Resize(resize_to),
            transforms.ToTensor(),
            transforms.Normalize(mean=mean, std=std),
        ]
    )

    tensor = transform(pil_image)          # (C, H, W)
    tensor = tensor.unsqueeze(0)           # (1, C, H, W)
    return tensor


# ---------------------------------------------------------------------------
# TFLite preprocessing
# ---------------------------------------------------------------------------


def preprocess_for_tflite(
    pil_image: Image.Image, config: Dict[str, Any]
) -> np.ndarray:
    """
    Preprocess a PIL image into a normalised NumPy array for TFLite inference.

    Parameters
    ----------
    pil_image:
        RGB PIL image (already validated).
    config:
        Preprocessing configuration dict with keys::

            {
                "image_size": int | [H, W],
                "mean": [float, float, float],
                "std":  [float, float, float],
                "dtype": "float32" | "uint8"    # optional, default float32
            }

    Returns
    -------
    np.ndarray
        Shape ``(1, H, W, C)`` array with the dtype specified in *config*
        (default ``float32``).
    """
    image_size = config.get("image_size", 224)
    if isinstance(image_size, (list, tuple)):
        resize_to = tuple(int(x) for x in image_size)
    else:
        resize_to = (int(image_size), int(image_size))

    mean = np.array(config.get("mean", [0.485, 0.456, 0.406]), dtype=np.float32)
    std = np.array(config.get("std", [0.229, 0.224, 0.225]), dtype=np.float32)
    dtype_str = config.get("dtype", "float32")

    resized = pil_image.resize((resize_to[1], resize_to[0]), Image.BILINEAR)
    arr = np.array(resized, dtype=np.float32) / 255.0  # (H, W, C) in [0,1]
    arr = (arr - mean) / std                           # normalise

    if dtype_str == "uint8":
        arr = arr.astype(np.uint8)
    else:
        arr = arr.astype(np.float32)

    arr = np.expand_dims(arr, axis=0)  # (1, H, W, C)
    return arr
