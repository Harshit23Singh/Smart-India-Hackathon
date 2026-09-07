"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle, ShieldCheck, Activity } from "lucide-react";
import StarBorder from "@/components/ui/StarBorder";

interface ThreatMeterProps {
  status: "analyzing" | "genuine" | "threat";
  authenticity: number;
  syntheticProb: number;
  speakerMatch: number;
}

export default function ThreatMeter({ status, authenticity, syntheticProb, speakerMatch }: ThreatMeterProps) {

  // LED segment meter
  const renderLedMeter = (value: number, activeColor: string, inactiveColor = "#111218") => {
    const blocks = 20;
    const filledBlocks = Math.round((value / 100) * blocks);

    return (
      <div className="flex gap-1.5 items-center">
        {[...Array(blocks)].map((_, i) => (
          <div
            key={i}
            className="h-5 w-3 rounded-sm transition-colors duration-500 border border-black/80"
            style={{
              backgroundColor: i < filledBlocks ? activeColor : inactiveColor,
              boxShadow: i < filledBlocks ? `0 0 8px ${activeColor}` : "none",
            }}
          ></div>
        ))}
        <span className="ml-3 font-mono text-xs font-bold w-10 text-white/90">{value}%</span>
      </div>
    );
  };

  const threatColor = status === "threat" ? "#ef4444" : status === "genuine" ? "#10b981" : "#f59e0b";

  return (
    <StarBorder
      as="div"
      className="w-full"
      innerClassName="p-6 bg-[#07070a]/95"
      color={threatColor}
      speed="4s"
      thickness={1.5}
      backgroundColor="#07070a"
      borderColor="rgba(255, 255, 255, 0.08)"
    >
      {/* Header with status LED */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white">
            <Activity size={18} />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Live Threat Telemetry</h3>
        </div>

        <div className={cn(
          "flex items-center gap-2 px-3 py-1 rounded-full border bg-black/80",
          status === "threat" ? "border-red-500/40 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.3)]" :
          status === "genuine" ? "border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]" :
          "border-amber-500/40 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
        )}>
          <div
            className="h-2.5 w-2.5 rounded-full skeuo-led flex-shrink-0"
            style={{ backgroundColor: threatColor, color: threatColor }}
          ></div>
          {status === "threat" && (
            <span className="font-bold tracking-widest text-[11px] font-mono animate-pulse flex items-center gap-1">
              <AlertTriangle size={12} /> HIGH THREAT
            </span>
          )}
          {status === "genuine" && (
            <span className="font-bold tracking-widest text-[11px] font-mono flex items-center gap-1">
              <ShieldCheck size={12} /> SECURE
            </span>
          )}
          {status === "analyzing" && (
            <span className="font-bold tracking-widest text-[11px] font-mono">ANALYZING</span>
          )}
        </div>
      </div>

      {/* Meter rows inside a dark inset */}
      <div className="bg-[#020204] border border-white/10 rounded-2xl p-5 space-y-5 shadow-inner">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/50 mb-2 font-mono">Human Authenticity Index</p>
          {renderLedMeter(authenticity, status === "threat" ? "#ef4444" : "#10b981")}
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/50 mb-2 font-mono">Synthetic Likelihood</p>
          {renderLedMeter(syntheticProb, status === "threat" ? "#ef4444" : "#f59e0b")}
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/50 mb-2 font-mono">Voiceprint Match</p>
          {renderLedMeter(speakerMatch, "#00e5ff")}
        </div>
      </div>

      {status === "threat" && (
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <p className="text-red-400 font-bold text-sm">Cloning Confidence: 94%</p>
            <p className="text-xs text-white/50 mt-0.5">High-confidence synthetic vocoder signature detected.</p>
          </div>
          <button
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all active:scale-95 cursor-pointer shrink-0"
          >
            Verify Identity
          </button>
        </div>
      )}
    </StarBorder>
  );
}
