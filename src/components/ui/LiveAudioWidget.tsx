"use client";

import { Mic, Square, Pause, Play, RotateCcw, Circle } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface LiveAudioWidgetProps {
  onAudioRecorded?: (blob: Blob) => void;
  disabled?: boolean;
}

export default function LiveAudioWidget({ onAudioRecorded, disabled }: LiveAudioWidgetProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  // Flag to distinguish between Stop (submit) and Reset (discard)
  const isResettingRef = useRef(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, isPaused]);

  // Clean up microphone track on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const startRecording = async () => {
    if (disabled) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      isResettingRef.current = false;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        // If Reset was clicked, discard chunks instead of submitting
        if (isResettingRef.current) {
          isResettingRef.current = false;
          chunksRef.current = [];
          return;
        }
        const blob = new Blob(chunksRef.current, { type: "audio/wav" });
        if (onAudioRecorded) {
          onAudioRecorded(blob);
        }
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setDuration(0);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("Error accessing microphone:", message);
      alert("Could not access microphone. Please check your permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      isResettingRef.current = false;
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const togglePause = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  const resetRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      // Mark as resetting so onstop discards the audio
      isResettingRef.current = true;
      mediaRecorderRef.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    }
    setIsRecording(false);
    setIsPaused(false);
    setDuration(0);
    chunksRef.current = [];
  };

  return (
    <div className={`skeuo-card p-6 flex flex-col h-full relative overflow-hidden ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      {/* Subtle inner top-highlight line for depth */}
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent rounded-full"></div>

      <div className="relative z-10 flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Mic className="text-accent" size={24} />
          Live Voice Detection
        </h3>
        {/* LED-style LIVE indicator */}
        <div className="flex items-center gap-2 px-3 py-1 skeuo-inset rounded-full">
          <div
            className={`h-3 w-3 rounded-full skeuo-led ${isRecording && !isPaused ? "bg-danger animate-pulse" : "bg-success"}`}
            style={{ color: isRecording && !isPaused ? "var(--danger)" : "var(--success)" }}
          ></div>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${isRecording && !isPaused ? "text-danger" : "text-success"}`}>
            {isRecording ? (isPaused ? "Paused" : "Rec") : "Ready"}
          </span>
        </div>
      </div>

      <p className="text-sm text-foreground/60 mb-4 relative z-10">Speak naturally to analyze in real time</p>

      {/* Waveform inside a sunken screen */}
      <div className="skeuo-inset rounded-xl flex-1 flex items-center justify-center gap-1 my-2 relative z-10 h-24 px-4 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`w-1.5 bg-accent rounded-full ${isRecording && !isPaused ? "animate-pulse" : "opacity-30"}`}
            style={isRecording && !isPaused ? {
              height: `${Math.max(10, Math.random() * 100)}%`,
              animationDelay: `${i * 0.05}s`,
              animationDuration: `${0.5 + Math.random()}s`,
              boxShadow: "0 0 6px var(--color-accent)",
            } : {
              height: "10%",
            }}
          />
        ))}
      </div>

      <div className="text-center mt-4 mb-4 relative z-10 skeuo-inset rounded-lg py-2">
        <p className="text-2xl font-bold font-mono text-foreground">{formatTime(duration)}</p>
        <p className={`text-xs mt-1 ${isRecording && !isPaused ? "text-danger animate-pulse" : "text-foreground/50"}`}>
          {isRecording ? (isPaused ? "Paused" : "Recording...") : "Press Record to start"}
        </p>
      </div>

      <div className="flex items-center justify-center gap-6 relative z-10">
        {!isRecording ? (
          <button onClick={startRecording} className="flex flex-col items-center gap-2 text-danger group/btn">
            <div
              className="h-14 w-14 rounded-full flex items-center justify-center skeuo-button"
              style={{ background: "linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)" }}
            >
              <Circle size={20} className="fill-current text-danger" />
            </div>
            <span className="text-xs font-medium text-foreground/60">Record</span>
          </button>
        ) : (
          <button onClick={stopRecording} className="flex flex-col items-center gap-2 text-danger group/btn">
            <div
              className="h-14 w-14 rounded-full flex items-center justify-center skeuo-button"
              style={{ background: "linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)" }}
            >
              <Square size={20} className="fill-current text-danger" />
            </div>
            <span className="text-xs font-medium text-foreground/60">Stop</span>
          </button>
        )}

        {/* Pause/Resume */}
        <button 
          onClick={togglePause} 
          disabled={!isRecording}
          className={`flex flex-col items-center gap-2 text-warning group/btn ${!isRecording ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="h-14 w-14 rounded-full flex items-center justify-center skeuo-button">
            {isPaused ? <Play size={20} className="fill-current text-warning" /> : <Pause size={20} className="fill-current text-warning" />}
          </div>
          <span className="text-xs font-medium text-foreground/60">{isPaused ? "Resume" : "Pause"}</span>
        </button>

        {/* Reset */}
        <button onClick={resetRecording} className="flex flex-col items-center gap-2 text-foreground/60 group/btn">
          <div className="h-14 w-14 rounded-full flex items-center justify-center skeuo-button">
            <RotateCcw size={20} />
          </div>
          <span className="text-xs font-medium text-foreground/60">Reset</span>
        </button>
      </div>
    </div>
  );
}
