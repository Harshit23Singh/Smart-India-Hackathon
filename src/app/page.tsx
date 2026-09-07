"use client";

import StatCard from "@/components/dashboard/StatCard";
import LiveAudioWidget from "@/components/ui/LiveAudioWidget";
import AudioUploader from "@/components/ui/AudioUploader";
import RecentDetections from "@/components/dashboard/RecentDetections";
import ThreatChart from "@/components/dashboard/ThreatChart";
import DetectionResult from "@/components/analysis/DetectionResult";
import AnalysisPipeline from "@/components/analysis/AnalysisPipeline";
import StarBorder from "@/components/ui/StarBorder";
import AiSparkIcon from "@/components/ui/AiSparkIcon";
import { Activity, ShieldAlert, Users, Target, RefreshCw, ShieldCheck, Cpu, Radio, Zap } from "lucide-react";
import { useState } from "react";

interface ApiResult {
  prediction: string;
  confidence: number;
  real_probability: number;
  fake_probability: number;
  duration_seconds: number;
  chunks_analyzed: number;
}

export default function Dashboard() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAudioSubmit = async (file: Blob | File) => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file, (file as File).name || "recording.wav");

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:7860";
      let response: Response;

      try {
        response = await fetch(`${apiBase}/predict`, {
          method: "POST",
          body: formData,
        });
      } catch {
        // Fallback to internal route if backend connection failed
        response = await fetch("/api/predict", {
          method: "POST",
          body: formData,
        });
      }

      if (!response.ok) {
        const errorJson = await response.json().catch(() => null);
        const detailMsg = errorJson?.detail || `Server error (${response.status}): ${response.statusText}`;
        throw new Error(detailMsg);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error("Error analyzing audio:", err);
      setError(err.message || "Failed to analyze audio sample.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* AI Hero / Header Section */}
      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
        
        <div className="space-y-3">
          
          {/* AI Pill Badge with Classic AI Spark Symbol */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 backdrop-blur-md">
            <span>
              <AiSparkIcon size={15} glow={false} />
            </span>
            <span className="text-xs font-mono font-bold tracking-wider text-cyan-300">
              NEXT-GEN VOICE CLONING DEFENSE
            </span>
            <span className="flex h-2 w-2 relative ml-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
          </div>

          {/* AI Title - Solid White */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Welcome to <span className="text-white font-black">Swaraksha AI</span>
          </h1>

          {/* Subtitle & AI Capability Pills */}
          <p className="text-white/70 text-sm md:text-base max-w-2xl leading-relaxed">
            Autonomous biometric acoustic forensics, real-time deepfake classification, and neural voice authentication.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-[11px] font-mono text-cyan-300">
              <Cpu size={12} className="text-cyan-400" /> Neural Classifier
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-[11px] font-mono text-emerald-300">
              <Zap size={12} className="text-emerald-400" /> &lt;1.2s Latency
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-[11px] font-mono text-purple-300">
              <ShieldCheck size={12} className="text-purple-400" /> Anti-Impersonation
            </span>
          </div>

        </div>

        {/* Tactical HUD Mission Widget */}
        <StarBorder
          as="div"
          className="shrink-0 max-w-xs w-full lg:w-auto"
          innerClassName="p-4 bg-[#07070a]/90 flex items-center gap-3.5"
          color="#00e5ff"
          speed="6s"
          thickness={1.5}
          backgroundColor="#07070a"
          borderColor="rgba(255, 255, 255, 0.1)"
        >
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 shrink-0">
            <Radio size={20} className="animate-pulse" />
          </div>
          <div className="border-l border-white/10 pl-3">
            <p className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1">
              <span>ACTIVE SHIELD</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </p>
            <p className="text-xs text-white/80 italic mt-0.5 font-medium">
              &quot;Authentic Voices · A Safer Tomorrow&quot;
            </p>
          </div>
        </StarBorder>

      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title="Total Scans" 
          value="1,284" 
          icon={Activity} 
          trend="12.4%" 
          trendUp={true} 
          type="accent" 
        />
        <StatCard 
          title="Threats Detected" 
          value="24" 
          icon={ShieldAlert} 
          trend="3 today" 
          trendUp={false} 
          type="danger" 
        />
        <StatCard 
          title="Genuine Voices" 
          value="1,060" 
          icon={Users} 
          trend="10.2%" 
          trendUp={true} 
          type="success" 
        />
        <StatCard 
          title="Detection Accuracy" 
          value="98.7%" 
          icon={Target} 
          type="default" 
        />
      </div>

      {/* Main Action Area */}
      <div className="grid grid-cols-1 gap-6 min-h-[420px]">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-5 rounded-2xl text-red-400 flex items-center justify-between shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <div>
              <p className="font-bold flex items-center gap-2 text-white">
                <ShieldAlert className="text-red-400" size={18} /> Analysis Failed
              </p>
              <p className="text-sm text-red-300/80 mt-1">{error}</p>
            </div>
            <button 
              onClick={resetAnalysis} 
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw size={14} /> Try Again
            </button>
          </div>
        )}

        {isAnalyzing && (
          <div className="h-full flex items-center justify-center py-12">
            <div className="w-full max-w-2xl">
              <AnalysisPipeline steps={[
                { name: "Receiving audio stream", status: "complete" },
                { name: "Preprocessing and normalizing", status: "complete" },
                { name: "Extracting acoustic features", status: "running" },
                { name: "Deepfake model inference", status: "waiting" },
              ]} />
            </div>
          </div>
        )}

        {result && !isAnalyzing && (
          <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto py-4">
            <DetectionResult 
              status={result.prediction === "REAL" ? "genuine" : "threat"} 
              confidence={parseFloat(result.confidence.toFixed(1))}
              message={result.prediction === "REAL" 
                ? `Voice appears genuine with ${result.real_probability.toFixed(1)}% probability. Analyzed ${result.duration_seconds.toFixed(1)}s of audio across ${result.chunks_analyzed} chunk(s).` 
                : `Potential synthetic voice detected with ${result.fake_probability.toFixed(1)}% probability. Analyzed ${result.duration_seconds.toFixed(1)}s of audio across ${result.chunks_analyzed} chunk(s).`}
            />
            <div className="flex justify-center">
              <button 
                onClick={resetAnalysis}
                className="px-6 py-3 rounded-2xl bg-accent/10 border border-accent/40 text-accent font-bold text-sm flex items-center gap-2 transition-all hover:bg-accent hover:text-black hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] active:scale-95 cursor-pointer"
              >
                <RefreshCw size={18} />
                Scan Another File
              </button>
            </div>
          </div>
        )}

        {!isAnalyzing && !result && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <LiveAudioWidget onAudioRecorded={handleAudioSubmit} />
            <AudioUploader onFileSelect={handleAudioSubmit} />
          </div>
        )}
      </div>

      {/* Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 h-[420px]">
          <RecentDetections />
        </div>
        <div className="lg:col-span-2 h-[420px]">
          <ThreatChart />
        </div>
      </div>

    </div>
  );
}
