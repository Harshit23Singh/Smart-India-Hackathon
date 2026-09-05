"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle, ShieldCheck } from "lucide-react";

interface ThreatMeterProps {
  status: "analyzing" | "genuine" | "threat";
  authenticity: number;
  syntheticProb: number;
  speakerMatch: number;
}

export default function ThreatMeter({ status, authenticity, syntheticProb, speakerMatch }: ThreatMeterProps) {

  // Physical LED segment bar
  const renderLedMeter = (value: number, activeColor: string, inactiveColor = "#1a1c1f") => {
    const blocks = 20;
    const filledBlocks = Math.round((value / 100) * blocks);

    return (
      <div className="flex gap-1 items-center">
        {[...Array(blocks)].map((_, i) => (
          <div
            key={i}
            className="h-5 w-3 rounded-sm transition-colors duration-500"
            style={{
              backgroundColor: i < filledBlocks ? activeColor : inactiveColor,
              boxShadow: i < filledBlocks ? `0 0 6px ${activeColor}` : "inset 1px 1px 2px rgba(0,0,0,0.5)",
              border: "1px solid rgba(0,0,0,0.4)",
            }}
          ></div>
        ))}
        <span className="ml-3 font-mono text-sm w-10 text-foreground/80">{value}%</span>
      </div>
    );
  };

  const threatColor = status === "threat" ? "#ef4444" : status === "genuine" ? "#10b981" : "#f59e0b";

  return (
    <div
      className="skeuo-card p-6 transition-all duration-500"
      style={{
        boxShadow: `
          -4px -4px 10px rgba(255,255,255,0.05),
          4px 4px 12px rgba(0,0,0,0.5),
          inset 1px 1px 1px rgba(255,255,255,0.1),
          0 0 30px ${status === "threat" ? "rgba(239,68,68,0.15)" : "transparent"}
        `,
      }}
    >
      {/* Panel header with status LED */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground tracking-wide uppercase text-sm">Live Threat Meter</h3>

        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 skeuo-inset rounded-lg",
        )}>
          <div
            className="h-4 w-4 rounded-full skeuo-led flex-shrink-0"
            style={{ backgroundColor: threatColor, color: threatColor }}
          ></div>
          {status === "threat" && (
            <span className="font-bold tracking-widest text-xs text-danger animate-pulse flex items-center gap-1">
              <AlertTriangle size={14} /> THREAT
            </span>
          )}
          {status === "genuine" && (
            <span className="font-bold tracking-widest text-xs text-success flex items-center gap-1">
              <ShieldCheck size={14} /> SAFE
            </span>
          )}
          {status === "analyzing" && (
            <span className="font-bold tracking-widest text-xs text-warning">SUSPICIOUS</span>
          )}
        </div>
      </div>

      {/* Meter rows inside a sunken panel */}
      <div className="skeuo-inset rounded-xl p-5 space-y-6">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-foreground/50 mb-2">Authenticity</p>
          {renderLedMeter(authenticity, status === "threat" ? "#ef4444" : "#10b981")}
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-widest text-foreground/50 mb-2">Synthetic Probability</p>
          {renderLedMeter(syntheticProb, status === "threat" ? "#ef4444" : "#f59e0b")}
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-widest text-foreground/50 mb-2">Speaker Match</p>
          {renderLedMeter(speakerMatch, "#3b82f6")}
        </div>
      </div>

      {status === "threat" && (
        <div className="mt-6 pt-5 border-t border-black/40 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <p className="text-danger font-semibold">Voice cloning probability: 94%</p>
            <p className="text-sm text-foreground/60 mt-1">Synthetic artifacts + speaker mismatch detected.</p>
          </div>
          <button
            className="px-6 py-3 text-white font-bold rounded-xl tracking-wider text-sm skeuo-button"
            style={{ background: "linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)", color: "#fff" }}
          >
            VERIFY IDENTITY
          </button>
        </div>
      )}
    </div>
  );
}
