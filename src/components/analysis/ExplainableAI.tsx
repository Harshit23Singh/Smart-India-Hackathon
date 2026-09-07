"use client";

import StarBorder from "@/components/ui/StarBorder";
import { HelpCircle } from "lucide-react";

interface Indicator {
  name: string;
  score: number; // 0 to 100
  isHighRisk: boolean;
}

interface ExplainableAIProps {
  indicators: Indicator[];
}

export default function ExplainableAI({ indicators }: ExplainableAIProps) {
  return (
    <StarBorder
      as="div"
      className="w-full"
      innerClassName="p-6 bg-[#07070a]/95"
      color="#a855f7"
      speed="6s"
      thickness={1.5}
      backgroundColor="#07070a"
      borderColor="rgba(255, 255, 255, 0.08)"
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
          <HelpCircle size={18} />
        </div>
        <h3 className="text-base font-bold text-white">Explainable AI Attribution</h3>
      </div>
      <p className="text-xs text-white/50 mb-5">Neural weight contributors leading to the final threat decision.</p>
      
      <div className="space-y-4 bg-[#020204] border border-white/10 rounded-2xl p-4 shadow-inner">
        {indicators.map((ind, idx) => {
          const colorClass = ind.isHighRisk
            ? ind.score > 80 ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : ind.score > 50 ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
            : ind.score > 80 ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : ind.score > 50 ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]';

          return (
            <div key={idx}>
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-xs font-medium text-white/80">{ind.name}</span>
                <span className="text-xs font-mono font-bold text-white">{ind.score}%</span>
              </div>
              
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${colorClass}`}
                  style={{ width: `${ind.score}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </StarBorder>
  );
}
