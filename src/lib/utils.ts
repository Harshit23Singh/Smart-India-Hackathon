import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Emergency banking dual-tone security chime using Web Audio API
export function playSecurityChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();

    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playTone(880, now, 0.15);       // A5
    playTone(1174.66, now + 0.18, 0.25); // D6
  } catch (e) {
    console.warn("Could not play security chime:", e);
  }
}

let activeAudioInstance: HTMLAudioElement | null = null;

// Pure Hindi Real-person banking fraud voice alert
export const HINDI_FRAUD_MESSAGE = "धोखाधड़ी कॉल का पता चलने के कारण आपके सभी बैंक लेनदेन और खाते तत्काल प्रभाव से निलंबित कर दिए गए हैं।";

export function playHindiFraudAlert(
  text: string = HINDI_FRAUD_MESSAGE,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (typeof window === "undefined") return false;

  // Stop any ongoing audio or speech synthesis
  stopVoiceAlert();

  try {
    // 1. Prioritize playing the real-person recorded alertt.ogg file
    const audio = new Audio("/alertt.ogg");
    activeAudioInstance = audio;
    audio.volume = 1.0;

    audio.onplay = () => {
      if (onStart) onStart();
    };

    audio.onended = () => {
      activeAudioInstance = null;
      if (onEnd) onEnd();
    };

    audio.onerror = (e) => {
      console.warn("Could not play /alertt.ogg audio file, falling back to neural speech synthesis:", e);
      fallbackToSpeechSynthesis(text, onStart, onEnd);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((playErr) => {
        console.warn("Autoplay / audio element play error, falling back to speech synthesis:", playErr);
        fallbackToSpeechSynthesis(text, onStart, onEnd);
      });
    }

    return true;
  } catch (err) {
    console.error("Audio playback error, falling back:", err);
    return fallbackToSpeechSynthesis(text, onStart, onEnd);
  }
}

function fallbackToSpeechSynthesis(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    if (onEnd) onEnd();
    return false;
  }

  try {
    playSecurityChime();
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    utterance.rate = 0.92;
    utterance.pitch = 1.02;

    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(
      (v) =>
        v.lang === "hi-IN" ||
        v.lang === "hi_IN" ||
        v.name.toLowerCase().includes("hindi") ||
        v.name.toLowerCase().includes("madhur") ||
        v.name.toLowerCase().includes("swara") ||
        v.name.toLowerCase().includes("google हिन्दी")
    );

    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 250);

    return true;
  } catch (e) {
    console.error("Fallback speech synthesis failed:", e);
    if (onEnd) onEnd();
    return false;
  }
}

export function stopVoiceAlert() {
  if (typeof window !== "undefined") {
    if (activeAudioInstance) {
      try {
        activeAudioInstance.pause();
        activeAudioInstance.currentTime = 0;
      } catch {
        // ignore
      }
      activeAudioInstance = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }
}

