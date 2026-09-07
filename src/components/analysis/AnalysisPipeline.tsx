"use client";

import { CheckCircle2, CircleDashed, Loader2, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import StarBorder from "@/components/ui/StarBorder";

interface PipelineStep {
  name: string;
  status: "waiting" | "running" | "complete" | "error";
}

interface AnalysisPipelineProps {
  steps: PipelineStep[];
}

export default function AnalysisPipeline({ steps }: AnalysisPipelineProps) {
  return (
    <StarBorder
      as="div"
      className="w-full"
      innerClassName="p-6 bg-[#07070a]/95"
      color="#00e5ff"
      speed="5s"
      thickness={1.5}
      backgroundColor="#07070a"
      borderColor="rgba(255, 255, 255, 0.08)"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="p-1.5 rounded-lg bg-accent/10 border border-accent/30 text-accent">
          <Cpu size={18} />
        </div>
        <h3 className="text-base font-bold text-white">AI Forensic Pipeline</h3>
      </div>
      
      <div className="space-y-4 bg-[#020204] border border-white/10 rounded-2xl p-5 shadow-inner">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-4 relative">
            {/* Connecting line */}
            {idx < steps.length - 1 && (
              <div className="absolute left-[11px] top-7 bottom-[-16px] w-0.5 bg-white/10"></div>
            )}
            
            {/* Status Icon */}
            <div className="relative z-10 flex-shrink-0">
              {step.status === "complete" && <CheckCircle2 className="text-emerald-400 drop-shadow-[0_0_6px_#10b981]" size={22} />}
              {step.status === "running" && <Loader2 className="text-accent animate-spin drop-shadow-[0_0_6px_#00e5ff]" size={22} />}
              {step.status === "waiting" && <CircleDashed className="text-white/20" size={22} />}
              {step.status === "error" && <CheckCircle2 className="text-red-400 drop-shadow-[0_0_6px_#ef4444]" size={22} />}
            </div>
            
            {/* Label */}
            <div className="flex-1 flex justify-between items-center min-w-0">
              <span className={cn(
                "text-xs font-semibold truncate",
                step.status === "complete" ? "text-white" :
                step.status === "running" ? "text-accent font-bold" :
                "text-white/40"
              )}>
                {step.name}
              </span>
              <span className={cn(
                "text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-md border shrink-0 ml-2",
                step.status === "complete" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" :
                step.status === "running" ? "text-accent bg-accent/10 border-accent/30 animate-pulse" :
                "text-white/30 bg-white/[0.02] border-white/5"
              )}>
                {step.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </StarBorder>
  );
}
