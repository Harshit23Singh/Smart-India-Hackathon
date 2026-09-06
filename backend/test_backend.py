"""Automated verification script for Dhwani Voice Deepfake Detection Backend.

Tests:
1. Audio loading, mono conversion, 16kHz resampling, and 3-second zero-padded chunking.
2. Root and health endpoints.
3. Model missing error handling (HTTP 503).
4. Prediction pipeline using an ONNX test model.
5. Cleanup of temporary files.
"""

import math
import os
import sys
import tempfile
from pathlib import Path
import numpy as np
import soundfile as sf
from fastapi.testclient import TestClient

# Ensure backend root is on sys.path
BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.main import app
from app.audio_service import load_and_preprocess_audio, chunk_audio
from app.model_service import model_service, softmax
from app.config import settings


def generate_synthetic_wav(duration_sec: float = 5.5, sample_rate: int = 16000) -> Path:
    """Generate a clean synthetic sine wave WAV file for testing."""
    t = np.linspace(0, duration_sec, int(sample_rate * duration_sec), endpoint=False, dtype=np.float32)
    # 440 Hz sine tone
    audio = 0.5 * np.sin(2 * np.pi * 440 * t)

    temp_wav = BACKEND_DIR / "uploads" / "test_synth_audio.wav"
    sf.write(str(temp_wav), audio, sample_rate, subtype="PCM_16")
    return temp_wav


def create_dummy_onnx_model(output_path: Path):
    """Create a minimal valid ONNX model for testing the inference pipeline.
    
    Model accepts input shape (1, 48000) float32 and outputs logits shape (1, 2) float32.
    """
    import onnx
    from onnx import helper, TensorProto

    # Define input & output tensors
    input_tensor = helper.make_tensor_value_info("input", TensorProto.FLOAT, [1, 48000])
    output_tensor = helper.make_tensor_value_info("output", TensorProto.FLOAT, [1, 2])

    # Weights: (48000, 2) initialized to small constant weights
    weights = np.zeros((48000, 2), dtype=np.float32)
    # Bias towards FAKE slightly for predictable test verification
    weights[:, 0] = 0.0001
    weights[:, 1] = 0.0002
    weights_tensor = helper.make_tensor(
        name="W",
        data_type=TensorProto.FLOAT,
        dims=[48000, 2],
        vals=weights.flatten().tolist()
    )

    # Bias: (2,)
    bias = np.array([0.5, 1.2], dtype=np.float32)
    bias_tensor = helper.make_tensor(
        name="B",
        data_type=TensorProto.FLOAT,
        dims=[2],
        vals=bias.flatten().tolist()
    )

    # MatMul node: input (1, 48000) * W (48000, 2) -> (1, 2)
    matmul_node = helper.make_node("MatMul", ["input", "W"], ["matmul_out"])
    # Add node: matmul_out + B -> output
    add_node = helper.make_node("Add", ["matmul_out", "B"], ["output"])

    graph = helper.make_graph(
        [matmul_node, add_node],
        "test_deepfake_classifier",
        [input_tensor],
        [output_tensor],
        [weights_tensor, bias_tensor]
    )

    model = helper.make_model(graph, producer_name="dhwani-test")
    model.opset_import[0].version = 13
    onnx.save(model, str(output_path))


def run_tests():
    print("=" * 60)
    print("Starting Dhwani Backend Automated Verification Suite")
    print("=" * 60)

    # --- Test 1: Audio Processing & Chunking ---
    print("\n[TEST 1] Testing Audio Preprocessing and Chunking...")
    wav_path = generate_synthetic_wav(duration_sec=5.5, sample_rate=16000)
    try:
        samples, duration = load_and_preprocess_audio(wav_path)
        assert isinstance(samples, np.ndarray), "Samples should be a NumPy array"
        assert samples.dtype == np.float32, f"Expected float32, got {samples.dtype}"
        assert samples.ndim == 1, f"Expected 1D mono, got {samples.ndim}D"
        assert duration == 5.5, f"Expected duration 5.5s, got {duration}s"
        assert len(samples) == 88000, f"Expected 88000 samples, got {len(samples)}"
        print(f"  [OK] Audio loading passed: {len(samples)} samples, duration {duration}s")

        chunks = chunk_audio(samples, chunk_samples=48000)
        assert len(chunks) == 2, f"Expected 2 chunks for 5.5s, got {len(chunks)}"
        assert chunks[0].shape == (1, 48000), f"Chunk 0 shape expected (1, 48000), got {chunks[0].shape}"
        assert chunks[1].shape == (1, 48000), f"Chunk 1 shape expected (1, 48000), got {chunks[1].shape}"
        
        # Verify zero padding on second chunk:
        # Original has 88000 total: chunk 0 has [0:48000], chunk 1 has [48000:88000] (40000 samples) + 8000 zeros
        assert np.all(chunks[1][0, 40000:] == 0.0), "Final chunk should be zero-padded to 48000 samples"
        print(f"  [OK] Chunking passed: {len(chunks)} chunks created, zero-padding verified.")
    finally:
        if wav_path.exists():
            wav_path.unlink()

    # --- Test 2: Softmax Function ---
    print("\n[TEST 2] Testing Softmax Normalization...")
    test_logits = np.array([1.0, 2.0], dtype=np.float32)
    s = softmax(test_logits)
    assert len(s) == 2
    assert math.isclose(np.sum(s), 1.0, rel_tol=1e-5), "Softmax sum must equal 1.0"
    assert s[1] > s[0], "Higher logit must have higher probability"
    print(f"  [OK] Softmax passed: logits {test_logits.tolist()} -> probs {[round(float(x), 4) for x in s]}")

    # --- Test 3: API Endpoints Without Model ---
    print("\n[TEST 3] Testing API Endpoints (Model absent scenario)...")
    client = TestClient(app)

    # GET /
    res_root = client.get("/")
    assert res_root.status_code == 200, f"Root returned {res_root.status_code}"
    assert res_root.json() == {"message": "Dhwani Voice Deepfake Detection API is running"}
    print(f"  [OK] GET / returned 200: {res_root.json()}")

    # GET /health
    res_health = client.get("/health")
    assert res_health.status_code == 200
    health_data = res_health.json()
    assert health_data["status"] == "healthy"
    assert health_data["model_loaded"] is False, "Model should be False before being placed"
    print(f"  [OK] GET /health returned 200: {health_data}")

    # POST /predict with no model
    test_audio = generate_synthetic_wav(duration_sec=3.0)
    try:
        with open(test_audio, "rb") as f:
            res_predict_nomodel = client.post(
                "/predict",
                files={"file": ("test.wav", f, "audio/wav")}
            )
        assert res_predict_nomodel.status_code == 503, f"Expected 503 without model, got {res_predict_nomodel.status_code}"
        assert "Deepfake detection model is not loaded" in res_predict_nomodel.json()["detail"]
        print(f"  [OK] POST /predict returned expected 503 Service Unavailable when model is missing")
    finally:
        if test_audio.exists():
            test_audio.unlink()

    # POST /predict with invalid extension (.txt)
    res_invalid = client.post(
        "/predict",
        files={"file": ("test.txt", b"dummy content", "text/plain")}
    )
    assert res_invalid.status_code == 400
    assert "Unsupported file format" in res_invalid.json()["detail"]
    print(f"  [OK] POST /predict rejected invalid format with 400 Bad Request")

    # --- Test 4: End-to-End Prediction with Dummy ONNX Model ---
    print("\n[TEST 4] Testing End-to-End Prediction with ONNX Inference...")
    dummy_model_path = BACKEND_DIR / "models" / "test_dummy_model.onnx"
    
    # Try importing onnx to build dummy model
    try:
        import onnx
        create_dummy_onnx_model(dummy_model_path)
        has_onnx_lib = True
    except ImportError:
        has_onnx_lib = False
        print("  ! 'onnx' library not installed (only onnxruntime is in requirements). Skipping dummy model generation.")

    if has_onnx_lib and dummy_model_path.exists():
        try:
            # Load dummy model into model service
            loaded = model_service.load_model(dummy_model_path)
            assert loaded is True, "Dummy model should load successfully"
            assert model_service.is_loaded is True

            # Check /health again
            res_health2 = client.get("/health")
            assert res_health2.json()["model_loaded"] is True
            print(f"  [OK] Model successfully loaded into memory! /health reports model_loaded=True")

            # Run POST /predict with synthetic audio
            predict_audio_path = generate_synthetic_wav(duration_sec=5.5)
            with open(predict_audio_path, "rb") as f:
                res_pred = client.post(
                    "/predict",
                    files={"file": ("sample.wav", f, "audio/wav")}
                )
            
            assert res_pred.status_code == 200, f"Expected 200, got {res_pred.status_code}: {res_pred.text}"
            data = res_pred.json()
            print(f"  [OK] POST /predict Response: {data}")

            assert data["prediction"] in ["REAL", "FAKE"]
            assert 0.0 <= data["confidence"] <= 100.0
            assert 0.0 <= data["real_probability"] <= 100.0
            assert 0.0 <= data["fake_probability"] <= 100.0
            assert math.isclose(data["duration_seconds"], 5.5, abs_tol=0.1)
            assert data["chunks_analyzed"] == 2

            # Check that temporary uploads are cleaned up
            leftover_uploads = list(settings.uploads_dir.glob("upload_*"))
            assert len(leftover_uploads) == 0, f"Leftover temporary uploads found: {leftover_uploads}"
            print("  [OK] Verified temporary upload file was automatically deleted from uploads/")

        finally:
            if dummy_model_path.exists():
                dummy_model_path.unlink()
            if predict_audio_path.exists():
                predict_audio_path.unlink()
            # Reset model_service to unloaded state
            model_service.session = None
            model_service.is_loaded = False

    print("\n" + "=" * 60)
    print("ALL TESTS PASSED SUCCESSFULLY! [OK]")
    print("=" * 60)


if __name__ == "__main__":
    run_tests()
