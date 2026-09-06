"""Dhwani Voice Deepfake Detection - FastAPI Backend Application.

Provides REST endpoints for system health and voice deepfake inference.
"""

import logging
import os
import shutil
import uuid
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Set

from fastapi import FastAPI, File, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.audio_service import chunk_audio, load_and_preprocess_audio
from app.config import settings
from app.model_service import ModelNotLoadedError, model_service
from app.schemas import ErrorResponse, HealthResponse, PredictionResponse, RootResponse

# Setup logging
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s [%(levelname)s] [%(name)s]: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("dhwani.api")

# Allowed audio file extensions
ALLOWED_EXTENSIONS: Set[str] = {
    ".wav",
    ".mp3",
    ".m4a",
    ".flac",
    ".ogg",
    ".aac",
    ".wma",
    ".opus",
}


@asynccontextmanager
async def lifespan(app: FastAPI):
    """FastAPI Lifespan context manager.

    Loads the ONNX model once during server startup and handles clean shutdown.
    """
    logger.info("=" * 60)
    logger.info(" Starting Dhwani Voice Deepfake Detection Backend")
    logger.info(f" Model path: {settings.resolved_model_path}")
    logger.info(f" CORS allowed origins: {settings.cors_origin_list}")
    logger.info(f" Max upload size: {settings.MAX_FILE_SIZE_MB} MB")
    logger.info("=" * 60)

    # Attempt to load model once at startup
    model_service.load_model(settings.resolved_model_path)

    yield

    logger.info("Dhwani Backend stopped.")


# Initialize FastAPI app
app = FastAPI(
    title="Dhwani Voice Deepfake Detection API",
    description="High-performance backend for detecting synthetic and cloned voices using ONNX Runtime.",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get(
    "/",
    response_model=RootResponse,
    summary="Root Endpoint",
    description="Returns a welcome message verifying the service is running.",
)
async def root():
    """Root status greeting endpoint."""
    return RootResponse(message="Dhwani Voice Deepfake Detection API is running")


@app.get(
    "/health",
    response_model=HealthResponse,
    summary="Health Check",
    description="Check backend health and verify if the ONNX model is loaded.",
)
async def health_check():
    """Health check endpoint indicating model readiness."""
    return HealthResponse(
        status="healthy",
        model_loaded=model_service.is_loaded,
        model_path=str(settings.MODEL_PATH),
    )


@app.post(
    "/predict",
    response_model=PredictionResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid file format or empty audio"},
        413: {"model": ErrorResponse, "description": "File exceeds maximum upload size"},
        500: {"model": ErrorResponse, "description": "Audio processing failure"},
        503: {"model": ErrorResponse, "description": "ONNX Model not loaded or unavailable"},
    },
    summary="Predict Voice Authenticity",
    description="Upload an audio file (WAV, MP3, etc.) to analyze for deepfake or synthetic voice.",
)
async def predict_audio(file: UploadFile = File(...)):
    """Inference endpoint accepting multipart/form-data audio file."""
    # 1. Validate filename and extension
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must have a valid filename.",
        )

    file_suffix = Path(file.filename).suffix.lower()
    if file_suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Unsupported file format '{file_suffix}'. "
                f"Supported formats are: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
            ),
        )

    # 2. Check if model is loaded before processing heavy audio
    if not model_service.is_loaded:
        logger.error("Predict requested, but ONNX model is not loaded.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Deepfake detection model is not loaded. Please ensure 'best_model.onnx' "
                f"is placed in '{settings.resolved_model_path}' and restart the server."
            ),
        )

    # 3. Create unique temporary file path
    unique_id = uuid.uuid4().hex
    temp_file_name = f"upload_{unique_id}{file_suffix}"
    temp_file_path = settings.uploads_dir / temp_file_name

    logger.info(f"Received upload: '{file.filename}' -> saving to temporary path: {temp_file_name}")

    try:
        # 4. Stream and write file with size limit enforcement
        max_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024
        total_bytes = 0

        with open(temp_file_path, "wb") as buffer:
            while chunk := await file.read(1024 * 1024):  # 1MB chunks
                total_bytes += len(chunk)
                if total_bytes > max_bytes:
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail=f"File exceeds maximum allowed size of {settings.MAX_FILE_SIZE_MB} MB.",
                    )
                buffer.write(chunk)

        if total_bytes == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty (0 bytes).",
            )

        logger.info(f"Saved {total_bytes} bytes for {file.filename}")

        # 5. Preprocess audio (convert non-wav, mono, 16kHz float32)
        try:
            samples, duration_seconds = load_and_preprocess_audio(temp_file_path)
        except RuntimeError as rt_err:
            logger.error(f"Runtime error during audio preprocessing: {rt_err}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(rt_err),
            )
        except ValueError as val_err:
            logger.warning(f"Audio validation failed for {file.filename}: {val_err}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Audio processing error: {str(val_err)}",
            )
        except Exception as proc_err:
            logger.error(f"Unexpected audio preprocessing failure: {proc_err}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Could not process audio: {str(proc_err)}",
            )

        # 6. Chunk audio into 3-second slices (48000 samples)
        chunks = chunk_audio(samples, chunk_samples=settings.chunk_samples)

        # 7. Model inference
        try:
            prediction, confidence, real_prob, fake_prob = model_service.predict(chunks)
        except ModelNotLoadedError as m_err:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=str(m_err),
            )
        except Exception as inf_err:
            logger.error(f"Model inference failed: {inf_err}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Inference error: {str(inf_err)}",
            )

        # 8. Return response matching exact required schema
        response_payload = PredictionResponse(
            prediction=prediction,
            confidence=confidence,
            real_probability=real_prob,
            fake_probability=fake_prob,
            duration_seconds=duration_seconds,
            chunks_analyzed=len(chunks),
        )

        return response_payload

    finally:
        # Guaranteed cleanup of uploaded temporary file
        if temp_file_path.exists():
            try:
                temp_file_path.unlink()
                logger.debug(f"Cleaned up temporary upload file: {temp_file_path}")
            except Exception as e:
                logger.warning(f"Failed to remove temporary upload file {temp_file_path}: {e}")
        await file.close()
