"""Pydantic schemas and response models for Dhwani Voice Deepfake Detection API."""

from typing import Literal
from pydantic import BaseModel, Field


class RootResponse(BaseModel):
    """Response model for the root endpoint."""

    message: str = Field(
        default="Dhwani Voice Deepfake Detection API is running",
        description="Informational greeting message",
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "message": "Dhwani Voice Deepfake Detection API is running"
            }
        }
    }


class HealthResponse(BaseModel):
    """Response model for the health check endpoint."""

    status: str = Field(..., description="API operational status")
    model_loaded: bool = Field(..., description="Indicates if ONNX model is loaded and ready")
    model_path: str = Field(..., description="Target model file path")

    model_config = {
        "json_schema_extra": {
            "example": {
                "status": "healthy",
                "model_loaded": True,
                "model_path": "models/best_model.onnx"
            }
        }
    }


class PredictionResponse(BaseModel):
    """Response model for voice deepfake detection prediction."""

    prediction: Literal["REAL", "FAKE"] = Field(
        ...,
        description="Predicted classification: 'REAL' for authentic human voice, 'FAKE' for synthetic/deepfake"
    )
    confidence: float = Field(
        ...,
        ge=0.0,
        le=100.0,
        description="Confidence percentage of the winning class (0.00 to 100.00)"
    )
    real_probability: float = Field(
        ...,
        ge=0.0,
        le=100.0,
        description="Percentage probability that the audio is REAL (0.00 to 100.00)"
    )
    fake_probability: float = Field(
        ...,
        ge=0.0,
        le=100.0,
        description="Percentage probability that the audio is FAKE (0.00 to 100.00)"
    )
    duration_seconds: float = Field(
        ...,
        ge=0.0,
        description="Duration of the processed audio in seconds"
    )
    chunks_analyzed: int = Field(
        ...,
        ge=1,
        description="Number of 3-second audio chunks analyzed by the ONNX model"
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "prediction": "FAKE",
                "confidence": 99.97,
                "real_probability": 0.03,
                "fake_probability": 99.97,
                "duration_seconds": 9.57,
                "chunks_analyzed": 4
            }
        }
    }


class ErrorResponse(BaseModel):
    """Standard error response structure."""

    detail: str = Field(..., description="Detailed description of the error")
