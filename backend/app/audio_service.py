"""Audio processing service for Dhwani Voice Deepfake Detection.

Handles audio decoding, format conversion (via FFmpeg/Pydub), mono conversion,
resampling to 16 kHz float32, and 3-second chunking (48,000 samples) with zero-padding.
"""

import logging
import math
from pathlib import Path
from typing import List, Tuple
import numpy as np
import soundfile as sf
import scipy.signal
from pydub import AudioSegment
from pydub.exceptions import CouldntDecodeError

from app.config import settings

logger = logging.getLogger("dhwani.audio")


def convert_to_wav_if_needed(file_path: Path) -> Tuple[Path, bool]:
    """Check if file is a non-WAV format and convert to WAV using Pydub/FFmpeg if necessary.

    Returns:
        Tuple[Path, bool]: (path_to_wav, is_temporary_file)
    """
    suffix = file_path.suffix.lower()
    if suffix == ".wav":
        return file_path, False

    # Convert non-WAV (MP3, M4A, FLAC, OGG, AAC, etc.) to WAV
    output_wav = file_path.with_suffix(".converted.wav")
    logger.info(f"Converting {file_path.name} ({suffix}) to WAV format: {output_wav.name}")

    try:
        audio = AudioSegment.from_file(str(file_path))
        # Ensure 16kHz mono in conversion for maximum efficiency
        audio = audio.set_channels(1).set_frame_rate(settings.TARGET_SAMPLE_RATE)
        audio.export(str(output_wav), format="wav")
        return output_wav, True
    except (FileNotFoundError, CouldntDecodeError) as e:
        logger.error(f"Failed to decode audio file {file_path.name}: {e}")
        raise RuntimeError(
            "FFmpeg is required to process non-WAV audio files (e.g. MP3, M4A). "
            "Please install FFmpeg on your system or upload a standard WAV file. "
            f"Original error: {str(e)}"
        ) from e
    except Exception as e:
        logger.error(f"Unexpected error converting {file_path.name} to WAV: {e}")
        raise ValueError(f"Could not convert audio file: {str(e)}") from e


def load_and_preprocess_audio(file_path: Path) -> Tuple[np.ndarray, float]:
    """Load audio file, convert to mono float32, and resample to 16,000 Hz.

    Args:
        file_path: Path to the audio file (WAV, MP3, etc.)

    Returns:
        Tuple[np.ndarray, float]: (1D float32 audio samples array, duration_seconds)
    """
    wav_path = file_path
    is_temp = False

    try:
        # Step 1: Format conversion if needed
        wav_path, is_temp = convert_to_wav_if_needed(file_path)

        # Step 2: Read audio data using SoundFile
        try:
            data, sample_rate = sf.read(str(wav_path), dtype="float32")
        except Exception as sf_err:
            logger.warning(f"Soundfile failed on {wav_path.name} ({sf_err}), trying Pydub fallback.")
            # Fallback to pydub if soundfile fails on non-standard WAV
            audio = AudioSegment.from_file(str(wav_path))
            audio = audio.set_channels(1).set_frame_rate(settings.TARGET_SAMPLE_RATE)
            raw_samples = np.array(audio.get_array_of_samples(), dtype=np.float32)
            if audio.sample_width == 2:
                raw_samples = raw_samples / 32768.0
            elif audio.sample_width == 4:
                raw_samples = raw_samples / 2147483648.0
            elif audio.sample_width == 1:
                raw_samples = (raw_samples - 128.0) / 128.0
            duration = round(len(raw_samples) / float(settings.TARGET_SAMPLE_RATE), 2)
            return raw_samples, duration

        # Step 3: Convert to mono if multi-channel
        if data.ndim > 1:
            logger.info(f"Audio has {data.shape[1]} channels, converting to mono by averaging.")
            data = np.mean(data, axis=1)

        # Step 4: Resample to 16000 Hz if sample rate differs
        target_sr = settings.TARGET_SAMPLE_RATE
        if sample_rate != target_sr:
            logger.info(f"Resampling audio from {sample_rate} Hz to {target_sr} Hz.")
            target_length = int(round(len(data) * target_sr / sample_rate))
            data = scipy.signal.resample(data, target_length)

        # Ensure float32 format
        data = data.astype(np.float32)

        # Duration in seconds
        duration = round(len(data) / float(target_sr), 2)

        if len(data) == 0:
            raise ValueError("Audio file contains no audio samples.")

        logger.info(f"Audio preprocessed successfully: {len(data)} samples, duration {duration}s")
        return data, duration

    finally:
        # Clean up temporary converted WAV file if created
        if is_temp and wav_path.exists():
            try:
                wav_path.unlink()
                logger.debug(f"Cleaned up temporary converted file: {wav_path}")
            except Exception as e:
                logger.warning(f"Failed to delete temporary converted file {wav_path}: {e}")


def chunk_audio(
    samples: np.ndarray,
    chunk_samples: int = 48000
) -> List[np.ndarray]:
    """Divide audio samples into 3-second chunks (48,000 samples at 16 kHz).

    The final chunk is zero-padded if shorter than 48,000 samples.
    Each chunk is shaped into a 2D array with batch dimension: (1, 48000).

    Args:
        samples: 1D NumPy array of float32 audio samples.
        chunk_samples: Number of samples per chunk (default 48000 for 3 seconds).

    Returns:
        List[np.ndarray]: List of chunks, each having shape (1, 48000) and dtype float32.
    """
    total_samples = len(samples)
    if total_samples == 0:
        raise ValueError("Cannot chunk empty audio signal.")

    num_chunks = math.ceil(total_samples / chunk_samples)
    chunks = []

    for i in range(num_chunks):
        start_idx = i * chunk_samples
        end_idx = min(start_idx + chunk_samples, total_samples)
        chunk = samples[start_idx:end_idx]

        # Zero-pad the final chunk if shorter than 3 seconds
        if len(chunk) < chunk_samples:
            pad_width = chunk_samples - len(chunk)
            chunk = np.pad(chunk, (0, pad_width), mode="constant", constant_values=0.0)

        # Ensure float32 and shape (1, chunk_samples)
        chunk_tensor = chunk.astype(np.float32).reshape(1, chunk_samples)
        chunks.append(chunk_tensor)

    logger.info(f"Divided audio of {total_samples} samples into {len(chunks)} chunks of {chunk_samples} samples.")
    return chunks
