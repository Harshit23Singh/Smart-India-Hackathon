"use client";

import { CheckCircle2, CircleDashed, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PipelineStep {
  name: string;
  status: "waiting" | "running" | "complete" | "error";
}

interface AnalysisPipelineProps {
  steps: PipelineStep[];
}

export default function AnalysisPipeline({ steps }: AnalysisPipelineProps) {
  return (
    <div className="skeuo-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">AI Analysis Pipeline</h3>
      
      <div className="space-y-6 skeuo-inset rounded-xl p-4">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-4 relative">
            {/* Connecting line */}
            {idx < steps.length - 1 && (
              <div className="absolute left-[11px] top-8 bottom-[-16px] w-0.5 bg-border"></div>
            )}
            
            {/* Status Icon */}
            <div className="relative z-10 flex-shrink-0">
              {step.status === "complete" && <CheckCircle2 className="text-success" size={24} />}
              {step.status === "running" && <Loader2 className="text-accent animate-spin" size={24} />}
              {step.status === "waiting" && <CircleDashed className="text-foreground/30" size={24} />}
              {step.status === "error" && <CheckCircle2 className="text-danger" size={24} />}
            </div>
            
            {/* Label */}
            <div className="flex-1 flex justify-between items-center">
              <span className={cn(
                "text-sm font-medium",
                step.status === "complete" ? "text-foreground" :
                step.status === "running" ? "text-accent" :
                "text-foreground/50"
              )}>
                {step.name}
              </span>
              <span className={cn(
                "text-xs capitalize px-2 py-0.5 rounded-md skeuo-inset",
                step.status === "complete" ? "text-success" :
                step.status === "running" ? "text-accent" :
                "text-foreground/40"
              )}>
                {step.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
