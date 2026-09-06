"""Application configuration module for Dhwani Voice Deepfake Detection Backend."""

import os
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings

# Absolute path to backend directory
BACKEND_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    """Server and pipeline settings loaded from environment or defaults."""

    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False

    # Path to ONNX model (relative to backend dir or absolute path)
    MODEL_PATH: str = "models/best_model.onnx"

    # Allowed CORS origins, comma-separated
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001,http://localhost:3002,http://127.0.0.1:3002"

    # Audio upload and processing settings
    MAX_FILE_SIZE_MB: int = 25
    TARGET_SAMPLE_RATE: int = 16000
    CHUNK_DURATION_SEC: int = 3

    @property
    def chunk_samples(self) -> int:
        """Calculate number of samples in one chunk (16000 * 3 = 48000)."""
        return self.TARGET_SAMPLE_RATE * self.CHUNK_DURATION_SEC

    @property
    def cors_origin_list(self) -> List[str]:
        """Convert comma-separated CORS_ORIGINS to list of strings."""
        if not self.CORS_ORIGINS or self.CORS_ORIGINS.strip() == "*":
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def resolved_model_path(self) -> Path:
        """Resolve full path to ONNX model."""
        p = Path(self.MODEL_PATH)
        if p.is_absolute():
            return p
        return BACKEND_DIR / p

    @property
    def uploads_dir(self) -> Path:
        """Resolve uploads directory and ensure it exists."""
        d = BACKEND_DIR / "uploads"
        d.mkdir(parents=True, exist_ok=True)
        return d

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
