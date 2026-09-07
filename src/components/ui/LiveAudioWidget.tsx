"use client";

import { Mic, Square, Pause, Play, RotateCcw, Circle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import StarBorder from "@/components/ui/StarBorder";

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

  const isLive = isRecording && !isPaused;

  return (
    <StarBorder
      as="div"
      className={`w-full h-full ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      innerClassName="p-6 flex flex-col h-full justify-between bg-[#07070a]/95"
      color={isLive ? "#ef4444" : "#00e5ff"}
      speed={isLive ? "3s" : "6s"}
      thickness={1.5}
      backgroundColor="#07070a"
      borderColor="rgba(255, 255, 255, 0.08)"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <div className="p-2 rounded-lg bg-accent/10 border border-accent/30 text-accent">
              <Mic size={20} />
            </div>
            Live Voice Detection
          </h3>
          {/* LED indicator */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 border border-white/10">
            <div
              className={`h-2.5 w-2.5 rounded-full skeuo-led ${isLive ? "bg-danger animate-ping" : "bg-success"}`}
              style={{ color: isLive ? "var(--danger)" : "var(--success)" }}
            ></div>
            <span className={`text-[10px] font-bold font-mono tracking-wider ${isLive ? "text-danger" : "text-success"}`}>
              {isRecording ? (isPaused ? "PAUSED" : "RECORDING") : "ONLINE"}
            </span>
          </div>
        </div>

        <p className="text-sm text-white/60 mb-4">Real-time spectral analysis for live audio streaming</p>

        {/* Waveform visualizer inside a dark cockpit inset */}
        <div className="bg-[#020204] border border-white/10 rounded-xl flex items-center justify-center gap-1.5 h-24 px-4 overflow-hidden shadow-inner">
          {[...Array(32)].map((_, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${isLive ? "bg-accent shadow-[0_0_8px_#00e5ff]" : "bg-white/15"}`}
              style={isLive ? {
                height: `${Math.max(12, Math.random() * 95)}%`,
                animationDelay: `${i * 0.04}s`,
                animationDuration: `${0.4 + Math.random() * 0.5}s`,
              } : {
                height: "12%",
              }}
            />
          ))}
        </div>

        {/* Timer display */}
        <div className="text-center mt-4 mb-4 bg-black/60 border border-white/10 rounded-xl py-2.5">
          <p className="text-2xl font-black font-mono tracking-widest text-white">{formatTime(duration)}</p>
          <p className={`text-[11px] font-medium mt-0.5 ${isLive ? "text-danger animate-pulse" : "text-white/40"}`}>
            {isRecording ? (isPaused ? "Paused — Click Resume" : "Listening & streaming audio...") : "Press Record to initiate stream"}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 pt-2">
        {!isRecording ? (
          <button onClick={startRecording} className="flex flex-col items-center gap-1.5 text-danger group cursor-pointer">
            <div
              className="h-14 w-14 rounded-full flex items-center justify-center border border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-transform group-hover:scale-105 active:scale-95"
              style={{ background: "linear-gradient(135deg, #7f1d1d 0%, #300808 100%)" }}
            >
              <Circle size={20} className="fill-current text-white" />
            </div>
            <span className="text-xs font-semibold text-white/70 group-hover:text-white">Record</span>
          </button>
        ) : (
          <button onClick={stopRecording} className="flex flex-col items-center gap-1.5 text-danger group cursor-pointer">
            <div
              className="h-14 w-14 rounded-full flex items-center justify-center border border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-transform group-hover:scale-105 active:scale-95 animate-pulse"
              style={{ background: "linear-gradient(135deg, #b91c1c 0%, #450a0a 100%)" }}
            >
              <Square size={20} className="fill-current text-white" />
            </div>
            <span className="text-xs font-semibold text-white/70 group-hover:text-white">Stop & Analyze</span>
          </button>
        )}

        {/* Pause/Resume */}
        <button 
          onClick={togglePause} 
          disabled={!isRecording}
          className={`flex flex-col items-center gap-1.5 text-warning group cursor-pointer ${!isRecording ? "opacity-40 cursor-not-allowed" : ""}`}
        >
          <div className="h-14 w-14 rounded-full flex items-center justify-center bg-white/[0.05] border border-white/10 hover:border-warning/50 hover:bg-warning/10 transition-all">
            {isPaused ? <Play size={20} className="fill-current text-warning ml-0.5" /> : <Pause size={20} className="fill-current text-warning" />}
          </div>
          <span className="text-xs font-semibold text-white/70">{isPaused ? "Resume" : "Pause"}</span>
        </button>

        {/* Reset */}
        <button onClick={resetRecording} className="flex flex-col items-center gap-1.5 text-white/60 hover:text-white group cursor-pointer">
          <div className="h-14 w-14 rounded-full flex items-center justify-center bg-white/[0.05] border border-white/10 hover:border-white/20 transition-all">
            <RotateCcw size={18} />
          </div>
          <span className="text-xs font-semibold text-white/70">Reset</span>
        </button>
      </div>
    </StarBorder>
  );
}
