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

// Pure Hindi Real-person banking fraud voice alert
export const HINDI_FRAUD_MESSAGE = "धोखाधड़ी कॉल का पता चलने के कारण आपके सभी बैंक लेनदेन और खाते तत्काल प्रभाव से निलंबित कर दिए गए हैं।";

export function playHindiFraudAlert(
  text: string = HINDI_FRAUD_MESSAGE,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("SpeechSynthesis not supported on this browser.");
    return false;
  }

  try {
    // 1. Play realistic alert chime first
    playSecurityChime();

    // 2. Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    utterance.rate = 0.92;   // Natural authoritative cadence
    utterance.pitch = 1.02;  // Clear, crisp tone

    // Try finding an authentic Hindi voice
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

    utterance.onerror = (e) => {
      console.warn("Speech synthesis error:", e);
      if (onEnd) onEnd();
    };

    // Small delay after the security chime to sound completely natural
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 250);

    return true;
  } catch (err) {
    console.error("Failed to play Hindi fraud alert:", err);
    return false;
  }
}

export function stopVoiceAlert() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

