"""
Application configuration loaded from environment variables / .env file.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    """Application settings loaded via pydantic-settings from .env."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # --- Model file paths -------------------------------------------------------
    CUSTOM_CNN_MODEL_PATH: str = "app/models/custom_cnn/model.pth"
    RESNET_MODEL_PATH: str = "app/models/resnet/model.pth"
    EFFICIENTNET_MODEL_PATH: str = "app/models/efficientnet/ensemble_model.tflite"

    # --- Supporting data files --------------------------------------------------
    CLASS_MAPPING_PATH: str = "app/data/class_mapping.json"
    PREPROCESSING_CONFIG_PATH: str = "app/data/preprocessing_config.json"

    # --- Evaluation -------------------------------------------------------------
    EVALUATION_RESULTS_DIR: str = "evaluation_results"

    # --- Limits -----------------------------------------------------------------
    MAX_IMAGE_SIZE_MB: float = Field(default=10.0)

    # --- Logging ----------------------------------------------------------------
    LOG_LEVEL: str = "INFO"


# Singleton instance used application-wide.
settings = Settings()
