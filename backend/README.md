# Dhwani - Voice Deepfake Detection Backend

Backend service for **Dhwani**, an AI-powered voice deepfake detection system developed for the Smart India Hackathon.

The backend receives audio files from users, converts and standardizes them to 16 kHz mono `float32` PCM, segments the audio into 3-second (48,000 samples) chunks with zero-padding, and performs inference with a trained ONNX deepfake classification model using **ONNX Runtime** on CPU.

---

## Architecture Overview

```
User / Next.js Frontend
        │
        ▼ (multipart/form-data audio file)
POST /predict
        │
        ▼
[ audio_service.py ]
   ├── Decode & convert non-WAV formats via FFmpeg/Pydub
   ├── Convert to mono float32
   ├── Resample to 16,000 Hz
   └── Chunk into 3-second slices (48,000 samples each, zero-padded)
        │
        ▼
[ model_service.py ]
   ├── Loaded once at startup via lifespan context (CPUExecutionProvider)
   ├── Run each chunk (shape: 1, 48000) through best_model.onnx
   ├── Softmax: [prob_REAL, prob_FAKE]
   └── Average probabilities across all chunks
        │
        ▼
Response JSON (REAL or FAKE, confidence %, probabilities %, chunks analyzed)
```

---

## Directory Structure

```
backend/
├── app/
│   ├── __init__.py           # Package marker
│   ├── config.py             # Server & audio settings (CORS, file size, paths)
│   ├── schemas.py            # Pydantic request & response models
│   ├── audio_service.py      # Audio loading, resampling & chunking
│   ├── model_service.py      # ONNX Runtime model lifecycle & inference
│   └── main.py               # FastAPI application & API endpoints
├── models/
│   ├── .gitkeep              # Directory for ONNX model
│   └── best_model.onnx       # Downloaded ONNX model (~1.26 GB, gitignored)
├── uploads/
│   └── .gitkeep              # Temporary upload directory (gitignored)
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules for virtualenv, models, uploads
├── requirements.txt          # Python dependencies
└── README.md                 # Documentation and setup instructions
```

---

## Prerequisites

1. **Python 3.10 or 3.11** (Recommended: Python 3.11 for guaranteed binary wheel support with `onnxruntime`, `scipy`, and `soundfile`).
2. **FFmpeg** (Required for processing non-WAV audio files like MP3, M4A, FLAC, AAC).

---

## 1. Installing FFmpeg

FFmpeg is used by `pydub` to convert compressed audio formats to WAV:

### Windows:
Using Windows Package Manager (`winget`):
```powershell
winget install Gyan.FFmpeg
```
*Or using Chocolatey:*
```powershell
choco install ffmpeg
```
*Or using Scoop:*
```powershell
scoop install ffmpeg
```
> **Note**: After installation, restart your terminal so `ffmpeg` is recognized in your `PATH`. Verify with `ffmpeg -version`.

### macOS:
```bash
brew install ffmpeg
```

### Linux (Ubuntu/Debian):
```bash
sudo apt update && sudo apt install -y ffmpeg
```

---

## 2. Setup & Installation

### Step 1: Navigate to the `backend/` directory
```bash
cd backend
```

### Step 2: Create a virtual environment
```bash
# Windows (using Python 3.11):
py -3.11 -m venv .venv

# Or generic:
python -m venv .venv
```

### Step 3: Activate the virtual environment
```bash
# Windows PowerShell:
.\.venv\Scripts\Activate.ps1

# Windows Command Prompt:
.\.venv\Scripts\activate.bat

# Linux / macOS:
source .venv/bin/activate
```

### Step 4: Install dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

---

## 3. Place the ONNX Model

The trained deepfake detection model (`best_model.onnx`, ~1.26 GB) is excluded from version control.

Place the model file in the `backend/models/` folder:
```
backend/models/best_model.onnx
```

> **Note**: If `best_model.onnx` is not present, the backend will still start normally in degraded mode. The `/health` endpoint will report `model_loaded: false`, and calling `/predict` will return a descriptive HTTP 503 error prompting you to add the model file.

---

## 4. Configuration (.env)

Copy the example environment file to `.env`:
```bash
cp .env.example .env
```
*(On Windows PowerShell: `Copy-Item .env.example .env`)*

Configurable variables:
| Variable | Default | Description |
|---|---|---|
| `HOST` | `0.0.0.0` | Bind host address |
| `PORT` | `8000` | Port for the backend server |
| `MODEL_PATH` | `models/best_model.onnx` | Path to the ONNX model |
| `CORS_ORIGINS` | `http://localhost:3000,http://127.0.0.1:3000` | Comma-separated allowed frontend origins |
| `MAX_FILE_SIZE_MB` | `25` | Maximum allowed audio upload size in MB |
| `TARGET_SAMPLE_RATE`| `16000` | Target audio sample rate in Hz |
| `CHUNK_DURATION_SEC`| `3` | Chunk duration in seconds (48,000 samples) |

---

## 5. Running the Backend

From inside the `backend` directory, run:
```bash
uvicorn app.main:app --reload
```

The API will be live at:
- **API Base**: `http://127.0.0.1:8000`
- **Interactive Swagger Documentation**: `http://127.0.0.1:8000/docs`
- **Alternative Redoc Documentation**: `http://127.0.0.1:8000/redoc`

---

## 6. API Endpoints

### 1. Root Status
- **Method**: `GET /`
- **Description**: Verifies the API is online.
- **Response**:
```json
{
  "message": "Dhwani Voice Deepfake Detection API is running"
}
```

### 2. Health Check
- **Method**: `GET /health`
- **Description**: Check server status and whether `best_model.onnx` is loaded into memory.
- **Response**:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_path": "models/best_model.onnx"
}
```

### 3. Voice Deepfake Prediction
- **Method**: `POST /predict`
- **Content-Type**: `multipart/form-data`
- **Payload**:
  - `file`: Audio file (`.wav`, `.mp3`, `.m4a`, `.flac`, `.ogg`, `.aac`, etc.)
- **Response**:
```json
{
  "prediction": "FAKE",
  "confidence": 99.97,
  "real_probability": 0.03,
  "fake_probability": 99.97,
  "duration_seconds": 9.57,
  "chunks_analyzed": 4
}
```

---

## 7. Example Testing & cURL Requests

### Health Check:
```bash
curl -X GET http://127.0.0.1:8000/health
```

### Predict with Audio File:
```bash
curl -X POST "http://127.0.0.1:8000/predict" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@/path/to/sample_audio.wav"
```

### Python Request Example (Frontend / Test Client):
```python
import requests

url = "http://127.0.0.1:8000/predict"
file_path = "sample.wav"

with open(file_path, "rb") as f:
    files = {"file": (file_path, f, "audio/wav")}
    response = requests.post(url, files=files)

print(response.json())
```

---

## 8. Frontend Integration Notes

The existing Next.js frontend (running at `http://localhost:3000`) can directly call `POST http://127.0.0.1:8000/predict` using `FormData`:

```typescript
const formData = new FormData();
formData.append("file", selectedAudioFile);

const res = await fetch("http://127.0.0.1:8000/predict", {
  method: "POST",
  body: formData,
});

const data = await res.json();
console.log(data);
// data: { prediction: "FAKE" | "REAL", confidence: 99.97, real_probability: 0.03, fake_probability: 99.97, ... }
```
CORS is preconfigured to accept requests from `http://localhost:3000` and `http://127.0.0.1:3000`.
