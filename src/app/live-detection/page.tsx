"use client";

import { useState } from "react";
import AnalysisPipeline from "@/components/analysis/AnalysisPipeline";
import DetectionResult from "@/components/analysis/DetectionResult";
import ExplainableAI from "@/components/analysis/ExplainableAI";
import SpeakerVerification from "@/components/analysis/SpeakerVerification";
import ThreatMeter from "@/components/analysis/ThreatMeter";
import StarBorder from "@/components/ui/StarBorder";
import { Mic, Square, Play, ShieldAlert, Sparkles, AlertTriangle } from "lucide-react";

export default function LiveDetectionPage() {
  const [demoState, setDemoState] = useState<"idle" | "recording" | "analyzing" | "result_threat">("idle");

  const startDemo = () => {
    setDemoState("recording");
    setTimeout(() => setDemoState("analyzing"), 4000);
    setTimeout(() => setDemoState("result_threat"), 8000);
  };

  const resetDemo = () => {
    setDemoState("idle");
  };

  const isLive = demoState === "recording";

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-bold mb-2">
            <Sparkles size={12} className="animate-spin" /> LIVE STREAM FORENSICS
          </div>
          <h1 className="text-3xl font-extrabold text-white">Live Voice Detection</h1>
          <p className="text-white/60 text-sm mt-1">Real-time spectral analysis & neural voice cloning prevention.</p>
        </div>
        
        {/* Controls */}
        <div className="flex gap-3">
          {demoState === "idle" && (
            <button 
              onClick={startDemo} 
              className="px-5 py-2.5 bg-accent hover:bg-cyan-300 text-black font-bold rounded-xl flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] cursor-pointer"
            >
              <Play size={16} className="fill-current" />
              Start Live Analysis
            </button>
          )}
          {demoState !== "idle" && (
            <button 
              onClick={resetDemo} 
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl flex items-center gap-2 transition-all border border-white/10 cursor-pointer"
            >
              <Square size={16} />
              Reset Demo
            </button>
          )}
        </div>
      </div>

      {/* Main Recording / Visualizer Stage Card */}
      <StarBorder
        as="div"
        className="w-full"
        innerClassName="p-8 min-h-[320px] flex flex-col items-center justify-center relative overflow-hidden bg-[#07070a]/95"
        color={isLive ? "#ef4444" : demoState === "analyzing" ? "#f59e0b" : demoState === "result_threat" ? "#ef4444" : "#00e5ff"}
        speed="4s"
        thickness={2}
        backgroundColor="#07070a"
        borderColor="rgba(255, 255, 255, 0.08)"
      >
        {isLive && (
          <div className="absolute top-6 left-6 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-ping"></div>
            <span className="text-[10px] font-bold text-red-400 font-mono tracking-widest uppercase">STREAMING ACTIVE</span>
          </div>
        )}

        {/* Waveform Visualizer */}
        <div className="w-full h-44 flex items-center justify-center gap-1.5 md:gap-2">
          {[...Array(50)].map((_, i) => {
            const isActive = demoState === "recording" || demoState === "analyzing";
            const height = isActive 
              ? Math.max(15, Math.random() * 95) 
              : 8;
            
            return (
              <div 
                key={i}
                className={`w-1.5 md:w-2 rounded-full transition-all duration-200 ${
                  demoState === "recording" 
                    ? "bg-red-500 shadow-[0_0_8px_#ef4444]" 
                    : demoState === "analyzing" 
                    ? "bg-amber-400 shadow-[0_0_8px_#f59e0b]" 
                    : demoState === "result_threat" 
                    ? "bg-red-500" 
                    : "bg-white/10"
                }`}
                style={{
                  height: `${height}%`,
                  opacity: isActive ? (0.6 + Math.random() * 0.4) : 0.2,
                }}
              ></div>
            );
          })}
        </div>

        {demoState === "idle" && (
          <div className="mt-4 text-center text-white/50 flex flex-col items-center">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 mb-3 text-white/40">
              <Mic size={28} />
            </div>
            <p className="text-base font-bold text-white">System Ready for Live Telemetry</p>
            <p className="text-xs text-white/40 mt-0.5">Click &quot;Start Live Analysis&quot; above to begin detecting voice spoofing threats.</p>
          </div>
        )}
      </StarBorder>

      {/* Analysis Flow */}
      {demoState !== "idle" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-1 space-y-6">
            <AnalysisPipeline 
              steps={[
                { name: "Audio preprocessing", status: demoState === "recording" ? "running" : "complete" },
                { name: "Feature extraction", status: demoState === "analyzing" ? "running" : demoState === "result_threat" ? "complete" : "waiting" },
                { name: "Spectral analysis", status: demoState === "analyzing" ? "running" : demoState === "result_threat" ? "complete" : "waiting" },
                { name: "Speaker verification", status: demoState === "result_threat" ? "complete" : "waiting" },
                { name: "Deepfake classification", status: demoState === "result_threat" ? "complete" : "waiting" },
              ]}
            />
            
            {demoState === "result_threat" && (
              <ThreatMeter 
                status="threat"
                authenticity={18}
                syntheticProb={94}
                speakerMatch={21}
              />
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            {demoState === "result_threat" ? (
              <div className="space-y-6">
                <DetectionResult 
                  status="threat"
                  confidence={94}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SpeakerVerification 
                    expectedSpeaker="Harshit Singh"
                    analyzedVoice="Unknown Source"
                    similarity={21}
                  />
                  <ExplainableAI 
                    indicators={[
                      { name: "Synthetic speech artifacts", score: 94, isHighRisk: true },
                      { name: "Spectral anomaly", score: 92, isHighRisk: true },
                      { name: "Speaker mismatch", score: 89, isHighRisk: true },
                      { name: "Pitch irregularity", score: 87, isHighRisk: true },
                    ]}
                  />
                </div>
                
                {/* Prevention / Response Panel */}
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
                    <button className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] cursor-pointer">
                      Block Stream
                    </button>
                    <button className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs rounded-xl transition-all border border-white/10 cursor-pointer">
                      Verify Identity
                    </button>
                    <button className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs rounded-xl transition-all border border-white/10 cursor-pointer">
                      Report Incident
                    </button>
                  </div>
                </StarBorder>
              </div>
            ) : (
              <div className="h-full min-h-[300px] rounded-2xl border border-dashed border-white/10 bg-[#07070a]/50 flex items-center justify-center p-12 text-center text-white/40">
                {demoState === "analyzing" 
                  ? "AI models are decomposing acoustic features in real time..." 
                  : "Waiting for live audio capture stream..."}
              </div>
            )}
          </div>
          
        </div>
      )}
    </div>
  );
}
