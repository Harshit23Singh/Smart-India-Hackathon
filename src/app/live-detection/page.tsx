"use client";

import { useState } from "react";
import AnalysisPipeline from "@/components/analysis/AnalysisPipeline";
import DetectionResult from "@/components/analysis/DetectionResult";
import ExplainableAI from "@/components/analysis/ExplainableAI";
import SpeakerVerification from "@/components/analysis/SpeakerVerification";
import ThreatMeter from "@/components/analysis/ThreatMeter";
import { Mic, Square, Play, ShieldAlert } from "lucide-react";

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

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Live Voice Detection</h1>
          <p className="text-foreground/60 mt-1">Analyze incoming audio streams in real time.</p>
        </div>
        
        {/* Demo Controls */}
        <div className="flex gap-2">
          {demoState === "idle" && (
            <button onClick={startDemo} className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg flex items-center gap-2 transition-colors font-medium">
              <Play size={18} />
              Start Live Analysis
            </button>
          )}
          {demoState !== "idle" && (
            <button onClick={resetDemo} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-foreground rounded-lg flex items-center gap-2 transition-colors font-medium">
              <Square size={18} />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Recording/Analysis Stage */}
      <div className="skeuo-card p-8 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden border-2 border-accent/20">
        
        {demoState === "recording" && (
          <div className="absolute top-6 left-6 px-3 py-1 bg-success/20 border border-success/30 rounded-full flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success animate-ping"></div>
            <span className="text-xs font-bold text-success uppercase tracking-widest">LIVE RECORDING</span>
          </div>
        )}
        
        {/* Large Waveform Visualizer */}
        <div className="w-full h-40 flex items-center justify-center gap-1.5 md:gap-2">
          {[...Array(60)].map((_, i) => {
            const isActive = demoState === "recording" || demoState === "analyzing";
            const height = isActive 
              ? Math.max(10, Math.random() * 100) 
              : 5;
            
            return (
              <div 
                key={i}
                className="w-1.5 md:w-2 bg-accent/80 rounded-full transition-all duration-300"
                style={{
                  height: `${height}%`,
                  opacity: isActive ? (0.5 + Math.random() * 0.5) : 0.3,
                  boxShadow: isActive ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none'
                }}
              ></div>
            )
          })}
        </div>

        {demoState === "idle" && (
          <div className="mt-8 text-center text-foreground/60 flex flex-col items-center">
            <Mic size={32} className="mb-4 text-foreground/40" />
            <p className="text-lg">Ready to Analyze</p>
            <p className="text-sm">Click "Start Live Analysis" to begin detecting threats.</p>
          </div>
        )}
      </div>

      {/* Analysis Flow - Appears conditionally based on state */}
      {demoState !== "idle" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
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
              <div className="animate-in fade-in zoom-in duration-500 delay-300">
                <ThreatMeter 
                  status="threat"
                  authenticity={18}
                  syntheticProb={94}
                  speakerMatch={21}
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            {demoState === "result_threat" ? (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <DetectionResult 
                  status="threat"
                  confidence={94}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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
                
                {/* Prevention/Response Panel */}
                <div className="mt-6 skeuo-card border-l-4 border-l-danger p-6 bg-danger/5">
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldAlert className="text-danger" size={24} />
                    <h3 className="text-lg font-bold text-danger">Threat Response Action Required</h3>
                  </div>
                  <p className="text-foreground/80 mb-4">Potential impersonation detected. Immediate action is recommended.</p>
                  
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm text-foreground/70">
                      <span className="text-danger">✓</span> Pause or end the conversation immediately
                    </li>
                    <li className="flex items-center gap-2 text-sm text-foreground/70">
                      <span className="text-danger">✓</span> Verify identity through an alternative communication channel
                    </li>
                    <li className="flex items-center gap-2 text-sm text-foreground/70">
                      <span className="text-danger">✓</span> Ask a predefined challenge question
                    </li>
                  </ul>
                  
                  <div className="flex flex-wrap gap-4">
                    <button className="px-5 py-2.5 bg-danger hover:bg-danger/90 text-white font-medium rounded-lg transition-colors">
                      Block Caller
                    </button>
                    <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-foreground font-medium rounded-lg transition-colors">
                      Verify Identity
                    </button>
                    <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-foreground font-medium rounded-lg transition-colors">
                      Report Threat
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full w-full skeuo-card flex items-center justify-center p-12 text-center text-foreground/40 border-dashed">
                {demoState === "analyzing" 
                  ? "AI models are analyzing the audio stream..." 
                  : "Waiting for audio input to generate detailed analysis."}
              </div>
            )}
          </div>
          
        </div>
      )}
    </div>
  );
}

