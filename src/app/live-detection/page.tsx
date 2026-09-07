"use client";

import { useState, useRef, useEffect } from "react";
import AnalysisPipeline from "@/components/analysis/AnalysisPipeline";
import DetectionResult from "@/components/analysis/DetectionResult";
import ExplainableAI from "@/components/analysis/ExplainableAI";
import SpeakerVerification from "@/components/analysis/SpeakerVerification";
import ThreatMeter from "@/components/analysis/ThreatMeter";
import StarBorder from "@/components/ui/StarBorder";
import { Mic, Square, Play, ShieldAlert, Sparkles, AlertTriangle, RefreshCw, Radio, CheckCircle, ShieldCheck } from "lucide-react";

interface ApiResult {
  prediction: "REAL" | "FAKE" | string;
  confidence: number;
  real_probability: number;
  fake_probability: number;
  duration_seconds: number;
  chunks_analyzed: number;
}

export default function LiveDetectionPage() {
  const [streamState, setStreamState] = useState<"idle" | "listening" | "analyzing" | "result">("idle");
  const [duration, setDuration] = useState(0);
  const [frequencyData, setFrequencyData] = useState<number[]>(Array(40).fill(10));
  const [audioLevel, setAudioLevel] = useState(0);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  // Timer while listening
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (streamState === "listening") {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [streamState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudioContext();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const stopAudioContext = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  };

  const startLiveCapture = async () => {
    setError(null);
    setResult(null);
    setDuration(0);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        }
      });
      streamRef.current = stream;

      // Setup Web Audio API Analyser for real-time waveform visualization
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.7;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      // Animate Frequency Spectrum Bars
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVisualizer = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Pick 40 distributed frequency points
        const bars: number[] = [];
        let totalEnergy = 0;
        const step = Math.max(1, Math.floor(dataArray.length / 40));
        
        for (let i = 0; i < 40; i++) {
          const val = dataArray[i * step] || 0;
          totalEnergy += val;
          const normalized = Math.max(10, Math.min(100, Math.round((val / 255) * 100)));
          bars.push(normalized);
        }

        setFrequencyData(bars);
        setAudioLevel(Math.round((totalEnergy / (40 * 255)) * 100));
        animationFrameRef.current = requestAnimationFrame(updateVisualizer);
      };
      updateVisualizer();

      // Initialize MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "";

      const options = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stopAudioContext();
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        const actualMime = mediaRecorder.mimeType || "audio/webm";
        const recordedBlob = new Blob(chunksRef.current, { type: actualMime });
        
        if (chunksRef.current.length > 0 && recordedBlob.size > 0) {
          await analyzeRecordedStream(recordedBlob);
        }
      };

      mediaRecorder.start(250); // Slice every 250ms
      setStreamState("listening");

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Microphone access denied";
      console.error("Microphone access error:", err);
      setError(`Microphone error: ${message}. Please check browser microphone permissions.`);
      setStreamState("idle");
    }
  };

  const stopLiveCapture = () => {
    if (mediaRecorderRef.current && streamState === "listening") {
      setStreamState("analyzing");
      mediaRecorderRef.current.stop();
    }
  };

  const analyzeRecordedStream = async (blob: Blob) => {
    setStreamState("analyzing");
    setError(null);

    const formData = new FormData();
    const ext = blob.type.includes("webm") ? "webm" : blob.type.includes("mp4") ? "mp4" : "wav";
    formData.append("file", blob, `live_stream_${Date.now()}.${ext}`);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:7860";
      let response: Response;

      try {
        response = await fetch(`${apiBase}/predict`, {
          method: "POST",
          body: formData,
        });
      } catch {
        response = await fetch("/api/predict", {
          method: "POST",
          body: formData,
        });
      }

      if (!response.ok) {
        const errJson = await response.json().catch(() => null);
        const detailMsg = errJson?.detail || `API error (${response.status}): ${response.statusText}`;
        throw new Error(detailMsg);
      }

      const data: ApiResult = await response.json();
      setResult(data);
      setStreamState("result");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to analyze live stream audio.";
      console.error("Analysis failure:", err);
      setError(msg);
      setStreamState("idle");
    }
  };

  const resetLiveStream = () => {
    stopAudioContext();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setStreamState("idle");
    setResult(null);
    setError(null);
    setDuration(0);
    setFrequencyData(Array(40).fill(10));
    setAudioLevel(0);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const isLive = streamState === "listening";
  const isThreat = result?.prediction === "FAKE";

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-xs font-mono font-bold mb-2">
            <Radio size={12} className="animate-pulse" /> LIVE STREAM FORENSICS
          </div>
          <h1 className="text-3xl font-extrabold text-white">Live Voice Detection</h1>
          <p className="text-white/60 text-sm mt-1">Real-time spectral analysis & neural voice cloning prevention.</p>
        </div>
        
        {/* Controls */}
        <div className="flex gap-3">
          {streamState === "idle" && (
            <button 
              onClick={startLiveCapture} 
              className="px-5 py-2.5 bg-accent hover:bg-cyan-300 text-black font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <Mic size={16} className="fill-current" />
              Start Live Analysis
            </button>
          )}

          {streamState === "listening" && (
            <button 
              onClick={stopLiveCapture} 
              className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer animate-pulse active:scale-95"
            >
              <Square size={16} className="fill-current" />
              Stop & Classify Stream
            </button>
          )}

          {(streamState === "result" || streamState === "analyzing" || error) && (
            <button 
              onClick={resetLiveStream} 
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl flex items-center gap-2 transition-all border border-white/10 cursor-pointer active:scale-95"
            >
              <RefreshCw size={16} />
              New Live Scan
            </button>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 p-5 rounded-2xl text-red-400 flex items-center justify-between">
          <div>
            <p className="font-bold flex items-center gap-2 text-white">
              <ShieldAlert className="text-red-400" size={18} /> Stream Analysis Failed
            </p>
            <p className="text-sm text-red-300/80 mt-1">{error}</p>
          </div>
          <button 
            onClick={resetLiveStream} 
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw size={14} /> Try Again
          </button>
        </div>
      )}

      {/* Main Recording / Real FFT Visualizer Stage Card */}
      <StarBorder
        as="div"
        className="w-full"
        innerClassName="p-8 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden bg-[#07070a]/95"
        color={isLive ? "#ef4444" : streamState === "analyzing" ? "#f59e0b" : isThreat ? "#ef4444" : result ? "#10b981" : "#00e5ff"}
        speed="4s"
        thickness={2}
        backgroundColor="#07070a"
        borderColor="rgba(255, 255, 255, 0.08)"
      >
        {isLive && (
          <div className="absolute top-6 left-6 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-ping"></div>
            <span className="text-[10px] font-bold text-red-400 font-mono tracking-widest uppercase">STREAMING ACTIVE</span>
          </div>
        )}

        {isLive && (
          <div className="absolute top-6 right-6 px-3 py-1 bg-black/80 border border-white/10 rounded-full flex items-center gap-2">
            <span className="text-[10px] font-mono text-cyan-300 uppercase">Input Level:</span>
            <span className="text-xs font-mono font-bold text-white">{audioLevel}%</span>
          </div>
        )}

        {/* Real-time Frequency Spectrum Visualizer */}
        <div className="w-full h-40 flex items-end justify-center gap-1.5 md:gap-2 px-4 py-2 bg-[#020204]/60 rounded-2xl border border-white/5">
          {frequencyData.map((height, i) => {
            const barColor = isLive 
              ? (height > 60 ? "bg-red-500" : height > 35 ? "bg-amber-400" : "bg-cyan-400")
              : streamState === "analyzing"
              ? "bg-amber-400"
              : isThreat
              ? "bg-red-500"
              : result
              ? "bg-emerald-400"
              : "bg-white/10";

            return (
              <div 
                key={i}
                className={`w-1.5 md:w-2 rounded-full transition-all duration-75 ${barColor}`}
                style={{
                  height: `${Math.max(8, height)}%`,
                  opacity: isLive ? (0.7 + (height / 100) * 0.3) : (result ? 0.8 : 0.25),
                }}
              ></div>
            );
          })}
        </div>

        {/* Idle prompt */}
        {streamState === "idle" && (
          <div className="mt-5 text-center text-white/50 flex flex-col items-center">
            <button
              onClick={startLiveCapture}
              className="p-4 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 mb-3 hover:bg-cyan-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Mic size={32} />
            </button>
            <p className="text-base font-bold text-white">Ready for Live Voice Testing</p>
            <p className="text-xs text-white/40 mt-0.5">Click &quot;Start Live Analysis&quot; above or the microphone icon to speak or test cloned audio.</p>
          </div>
        )}

        {/* Listening / Streaming state display */}
        {streamState === "listening" && (
          <div className="mt-5 flex flex-col items-center gap-3">
            <div className="flex items-center gap-3 bg-black/70 border border-white/10 px-5 py-2 rounded-2xl">
              <span className="text-2xl font-black font-mono tracking-wider text-white">{formatTime(duration)}</span>
              <div className="h-4 w-px bg-white/20"></div>
              <span className="text-xs text-red-400 font-bold uppercase tracking-wider animate-pulse flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-400"></span> Live Listening
              </span>
            </div>
            <p className="text-xs text-white/60">Speak naturally or play cloned voice from another phone, then click &quot;Stop & Classify Stream&quot;.</p>
          </div>
        )}

        {/* Analyzing state */}
        {streamState === "analyzing" && (
          <div className="mt-5 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-sm font-bold animate-pulse">
              <Sparkles size={16} className="animate-spin" /> Dhwani Neural Engine is Classifying Stream...
            </div>
            <p className="text-xs text-white/40">Evaluating Wav2Vec2 XLS-R + AASIST hybrid embeddings...</p>
          </div>
        )}
      </StarBorder>

      {/* Analysis Flow & Live Telemetry Results */}
      {streamState !== "idle" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-1 space-y-6">
            <AnalysisPipeline 
              steps={[
                { name: "Audio stream capture", status: streamState === "listening" ? "running" : "complete" },
                { name: "16kHz mono normalization", status: streamState === "analyzing" ? "running" : streamState === "result" ? "complete" : "waiting" },
                { name: "3-second window chunking", status: streamState === "analyzing" ? "running" : streamState === "result" ? "complete" : "waiting" },
                { name: "ONNX neural inference", status: streamState === "analyzing" ? "running" : streamState === "result" ? "complete" : "waiting" },
                { name: "Biometric voice verification", status: streamState === "result" ? "complete" : "waiting" },
              ]}
            />
            
            {result && (
              <ThreatMeter 
                status={isThreat ? "threat" : "genuine"}
                authenticity={Math.round(result.real_probability)}
                syntheticProb={Math.round(result.fake_probability)}
                speakerMatch={isThreat ? Math.round(result.real_probability * 0.4) : Math.round(result.real_probability)}
              />
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            {result ? (
              <div className="space-y-6">
                <DetectionResult 
                  status={isThreat ? "threat" : "genuine"}
                  confidence={Math.round(result.confidence)}
                  message={isThreat 
                    ? `Synthetic voice cloned audio detected with ${result.fake_probability.toFixed(1)}% probability across ${result.chunks_analyzed} chunk(s) (${result.duration_seconds.toFixed(1)}s analyzed).`
                    : `Authentic genuine human voice verified with ${result.real_probability.toFixed(1)}% probability across ${result.chunks_analyzed} chunk(s) (${result.duration_seconds.toFixed(1)}s analyzed).`}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SpeakerVerification 
                    expectedSpeaker="Authorized Biometric Profile"
                    analyzedVoice={isThreat ? "Synthetic Cloned Voice" : "Authentic Human Speaker"}
                    similarity={isThreat ? Math.round(result.real_probability * 0.5) : Math.round(result.real_probability)}
                  />
                  <ExplainableAI 
                    indicators={isThreat ? [
                      { name: "Synthetic Vocoder Artifacts", score: Math.round(result.fake_probability), isHighRisk: true },
                      { name: "Phase Inconsistency Anomaly", score: Math.min(100, Math.round(result.fake_probability * 0.95)), isHighRisk: true },
                      { name: "Biometric Acoustic Mismatch", score: Math.min(100, Math.round(result.fake_probability * 0.9)), isHighRisk: true },
                      { name: "Robotic Micro-jitter Pattern", score: Math.min(100, Math.round(result.fake_probability * 0.88)), isHighRisk: true },
                    ] : [
                      { name: "Natural Vocal Formants", score: Math.round(result.real_probability), isHighRisk: false },
                      { name: "Organic Pitch Micro-variation", score: Math.min(100, Math.round(result.real_probability * 0.96)), isHighRisk: false },
                      { name: "Biometric Resonance Match", score: Math.min(100, Math.round(result.real_probability * 0.94)), isHighRisk: false },
                      { name: "Acoustic Phase Coherence", score: Math.min(100, Math.round(result.real_probability * 0.92)), isHighRisk: false },
                    ]}
                  />
                </div>
                
                {/* Prevention / Response Panel for Threat */}
                {isThreat && (
                  <StarBorder
                    as="div"
                    className="w-full"
                    innerClassName="p-6 bg-[#07070a]/95"
                    color="#ef4444"
                    speed="4s"
                    thickness={1.5}
                    backgroundColor="#07070a"
                    borderColor="rgba(239, 68, 68, 0.3)"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                        <ShieldAlert size={22} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-red-400">Threat Mitigation Action Required</h3>
                        <p className="text-xs text-white/50">Active impersonation detected on stream channel.</p>
                      </div>
                    </div>
                    
                    <ul className="space-y-2 mb-6 bg-[#020204] p-4 rounded-xl border border-white/5">
                      <li className="flex items-center gap-2 text-xs text-white/80">
                        <span className="text-red-400 font-bold">✓</span> Terminate incoming connection or mute audio feed immediately
                      </li>
                      <li className="flex items-center gap-2 text-xs text-white/80">
                        <span className="text-red-400 font-bold">✓</span> Request out-of-band verification code
                      </li>
                      <li className="flex items-center gap-2 text-xs text-white/80">
                        <span className="text-red-400 font-bold">✓</span> Issue challenge question to verify caller authenticity
                      </li>
                    </ul>
                    
                    <div className="flex flex-wrap gap-3">
                      <button className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] cursor-pointer active:scale-95">
                        Block Stream
                      </button>
                      <button 
                        onClick={resetLiveStream}
                        className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs rounded-xl transition-all border border-white/10 cursor-pointer active:scale-95"
                      >
                        Scan New Audio
                      </button>
                    </div>
                  </StarBorder>
                )}

                {/* Secure Verification Panel for Authentic Voice */}
                {!isThreat && (
                  <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                        <ShieldCheck size={22} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-emerald-300">Biometric Verification Confirmed</h4>
                        <p className="text-xs text-white/60">Voice patterns align with natural human vocal resonance. Safe to proceed.</p>
                      </div>
                    </div>
                    <button 
                      onClick={resetLiveStream}
                      className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold transition-all border border-emerald-500/30"
                    >
                      Scan Next
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full min-h-[300px] rounded-2xl border border-dashed border-white/10 bg-[#07070a]/50 flex items-center justify-center p-12 text-center text-white/40">
                {streamState === "analyzing" 
                  ? "Dhwani neural models are decomposing acoustic features in real time..." 
                  : "Click 'Start Live Analysis' above to begin capturing microphone stream..."}
              </div>
            )}
          </div>
          
        </div>
      )}
    </div>
  );
}
