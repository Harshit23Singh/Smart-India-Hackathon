"""ONNX Model Service for Dhwani Voice Deepfake Detection.

Manages the ONNX Runtime InferenceSession (using CPUExecutionProvider),
executes inference over 3-second audio chunks (shape: 1, 48000), applies softmax,
and computes final prediction and confidence averages.
"""

import logging
from pathlib import Path
from typing import List, Tuple, Optional
import numpy as np
import onnxruntime as ort

logger = logging.getLogger("dhwani.model")


class ModelNotLoadedError(Exception):
    """Raised when prediction is requested but ONNX model is not available."""
    pass


def softmax(x: np.ndarray) -> np.ndarray:
    """Compute numerically stable softmax over a 1D or flattened array."""
    flat = x.flatten()
    shift_x = flat - np.max(flat)
    exps = np.exp(shift_x)
    sum_exps = np.sum(exps)
    if sum_exps == 0:
        return np.ones_like(flat) / len(flat)
    return exps / sum_exps


class ModelService:
    """Singleton service to hold and run the ONNX deepfake detection model."""

    def __init__(self, model_path: Optional[Path] = None):
        self.model_path: Optional[Path] = model_path
        self.session: Optional[ort.InferenceSession] = None
        self.input_name: Optional[str] = None
        self.output_name: Optional[str] = None
        self.is_loaded: bool = False

        if model_path:
            self.load_model(model_path)

    def load_model(self, model_path: Path) -> bool:
        """Load the ONNX model into memory with CPUExecutionProvider.

        Args:
            model_path: Absolute or relative Path to best_model.onnx

        Returns:
            bool: True if model loaded successfully, False otherwise.
        """
        self.model_path = model_path
        resolved_path = model_path.resolve()

        if not resolved_path.exists() or not resolved_path.is_file():
            logger.warning(
                f"Model file not found at: {resolved_path}. "
                "Backend will run in degraded mode (model_loaded=False). "
                "Place 'best_model.onnx' into backend/models/ to enable prediction."
            )
            self.session = None
            self.is_loaded = False
            return False

        try:
            logger.info(f"Loading ONNX model from: {resolved_path} using CPUExecutionProvider...")
            # Configure ONNX Runtime session with CPUExecutionProvider
            opts = ort.SessionOptions()
            opts.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL

            self.session = ort.InferenceSession(
                str(resolved_path),
                sess_options=opts,
                providers=["CPUExecutionProvider"]
            )

            # Inspect input/output metadata
            inputs = self.session.get_inputs()
            outputs = self.session.get_outputs()
            self.input_name = inputs[0].name
            self.output_name = outputs[0].name
            self.is_loaded = True

            logger.info(
                f"ONNX model loaded successfully! "
                f"Input: '{self.input_name}' (shape {inputs[0].shape}, type {inputs[0].type}), "
                f"Output: '{self.output_name}' (shape {outputs[0].shape})"
            )
            return True

        except Exception as e:
            logger.error(f"Failed to load ONNX model from {resolved_path}: {e}", exc_info=True)
            self.session = None
            self.is_loaded = False
            return False

    def predict(self, chunks: List[np.ndarray]) -> Tuple[str, float, float, float]:
        """Run inference across all 3-second audio chunks and aggregate predictions.

        For each chunk:
          - Pass chunk array of shape (1, 48000) float32 to ONNX session.
          - Apply softmax to logits:
              probabilities[0] = REAL probability
              probabilities[1] = FAKE probability
          - Average probabilities across all chunks.
          - Final prediction = whichever average probability is larger.

        Args:
          chunks: List of numpy arrays, each of shape (1, 48000) float32.

        Returns:
          Tuple[str, float, float, float]:
            (prediction, confidence, real_probability, fake_probability)
            where confidence, real_probability, and fake_probability are percentages (0.00 to 100.00).
        """
        if not self.is_loaded or self.session is None:
            raise ModelNotLoadedError(
                f"ONNX model is not loaded. Expected model file at: {self.model_path}. "
                "Please place the 1.26 GB 'best_model.onnx' into backend/models/ and restart the backend."
            )

        if not chunks:
            raise ValueError("No audio chunks provided for inference.")

        chunk_real_probs: List[float] = []
        chunk_fake_probs: List[float] = []

        logger.info(f"Running inference over {len(chunks)} chunk(s)...")

        for idx, chunk in enumerate(chunks):
            # Ensure float32 and shape is (1, 48000)
            chunk_input = chunk.astype(np.float32)
            if chunk_input.ndim != 2 or chunk_input.shape[0] != 1:
                chunk_input = chunk_input.reshape(1, -1)

            # Run inference
            raw_outputs = self.session.run(None, {self.input_name: chunk_input})
            logits = raw_outputs[0]

            # Apply softmax
            probs = softmax(logits)

            if len(probs) < 2:
                raise ValueError(
                    f"Model output has {len(probs)} class score(s), but at least 2 (REAL, FAKE) are expected."
                )

            # Class mapping: index 0 = REAL, index 1 = FAKE
            real_p = float(probs[0])
            fake_p = float(probs[1])

            chunk_real_probs.append(real_p)
            chunk_fake_probs.append(fake_p)

            logger.debug(f"Chunk {idx + 1}/{len(chunks)} -> REAL: {real_p:.4f}, FAKE: {fake_p:.4f}")

        # Average probabilities across all chunks
        avg_real = float(np.mean(chunk_real_probs))
        avg_fake = float(np.mean(chunk_fake_probs))

        # Convert to percentage rounded to 2 decimal places
        real_percentage = round(avg_real * 100.0, 2)
        fake_percentage = round(avg_fake * 100.0, 2)

        # Final prediction: whichever average probability is larger
        if avg_fake > avg_real:
            prediction = "FAKE"
            confidence = fake_percentage
        else:
            prediction = "REAL"
            confidence = real_percentage

        logger.info(
            f"Inference complete: prediction={prediction}, confidence={confidence}%, "
            f"REAL={real_percentage}%, FAKE={fake_percentage}% across {len(chunks)} chunks."
        )

        return prediction, confidence, real_percentage, fake_percentage


# Global model service instance
model_service = ModelService()
