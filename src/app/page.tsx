"use client";

import StatCard from "@/components/dashboard/StatCard";
import LiveAudioWidget from "@/components/ui/LiveAudioWidget";
import AudioUploader from "@/components/ui/AudioUploader";
import RecentDetections from "@/components/dashboard/RecentDetections";
import ThreatChart from "@/components/dashboard/ThreatChart";
import DetectionResult from "@/components/analysis/DetectionResult";
import AnalysisPipeline from "@/components/analysis/AnalysisPipeline";
import { Activity, ShieldAlert, Users, Target, RefreshCw } from "lucide-react";
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
    // Use a default filename if it's a Blob from the recorder
    formData.append("file", file, (file as File).name || "recording.wav");

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:7860";
      const response = await fetch(`${apiBase}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }


      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error("Error analyzing audio:", err);
      setError(err.message || "Failed to connect to the analysis server.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Welcome to <span className="text-accent">Swaraksha AI</span></h1>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
          <p className="text-foreground/70">AI-Powered Real-Time Detection and Prevention of Voice Cloning Impersonation Attacks</p>
          <p className="text-foreground/50 italic text-sm border-l-2 border-accent pl-3">&quot;Authentic Voices<br/>A Safer Tomorrow&quot;</p>
        </div>
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
          <div className="bg-danger/10 border-l-4 border-danger p-4 rounded-r-lg text-danger flex items-center justify-between">
            <div>
              <p className="font-bold">Analysis Failed</p>
              <p className="text-sm">{error}</p>
            </div>
            <button onClick={resetAnalysis} className="px-4 py-2 skeuo-button rounded-lg text-sm flex items-center gap-2">
              <RefreshCw size={16} /> Try Again
            </button>
          </div>
        )}

        {isAnalyzing && (
          <div className="h-full flex items-center justify-center">
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
          <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
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
                className="px-6 py-3 skeuo-button rounded-xl text-accent font-semibold flex items-center gap-2 transition-all active:scale-95"
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
        <div className="lg:col-span-1 h-[400px]">
          <RecentDetections />
        </div>
        <div className="lg:col-span-2 h-[400px]">
          <ThreatChart />
        </div>
      </div>

    </div>
  );
}
