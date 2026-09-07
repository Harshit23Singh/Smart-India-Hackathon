"use client";

import { Play, FileAudio, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import StarBorder from "@/components/ui/StarBorder";

const recentDetections = [
  { id: 1, filename: "call_01.wav", result: "Synthetic", confidence: 96, risk: "High", time: "2 min ago" },
  { id: 2, filename: "sample_02.wav", result: "Genuine", confidence: 91, risk: "Low", time: "15 min ago" },
  { id: 3, filename: "call_03.wav", result: "Suspicious", confidence: 78, risk: "Medium", time: "1 hour ago" },
];

export default function RecentDetections() {
  return (
    <StarBorder
      as="div"
      className="w-full h-full"
      innerClassName="p-6 flex flex-col h-full bg-[#07070a]/95"
      color="#00e5ff"
      speed="7s"
      thickness={1.5}
      backgroundColor="#07070a"
      borderColor="rgba(255, 255, 255, 0.08)"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-accent/10 border border-accent/30 text-accent">
            <FileAudio size={18} />
          </div>
          Recent Detections
        </h3>
        <Link href="/history" className="text-xs font-semibold text-accent hover:text-cyan-300 flex items-center gap-1 transition-colors">
          View All <ArrowUpRight size={14} />
        </Link>
      </div>
      
      <div className="flex flex-col gap-2.5 overflow-y-auto pr-1 flex-1">
        {recentDetections.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-white/5 hover:border-white/15 transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <button className="h-8 w-8 rounded-lg flex items-center justify-center bg-white/[0.05] border border-white/10 text-accent group-hover:border-accent/40 group-hover:bg-accent/10 transition-colors shrink-0">
                <Play size={13} className="ml-0.5 fill-current" />
              </button>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate group-hover:text-accent transition-colors">{item.filename}</p>
                <p className="text-[10px] text-white/40">{item.time}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <span className={cn(
                "px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wider uppercase border font-mono",
                item.result === "Synthetic" ? "bg-red-500/10 text-red-400 border-red-500/30" :
                item.result === "Genuine" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
                "bg-amber-500/10 text-amber-400 border-amber-500/30"
              )}>
                {item.result}
              </span>
              <span className="text-xs font-bold font-mono text-white/80 hidden sm:block w-10 text-right">{item.confidence}%</span>
            </div>
          </div>
        ))}
      </div>
    </StarBorder>
  );
}
