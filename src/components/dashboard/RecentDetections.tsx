"use client";

import { Play, FileAudio } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const recentDetections = [
  { id: 1, filename: "call_01.wav", result: "Synthetic", confidence: 96, risk: "High", time: "2 min ago" },
  { id: 2, filename: "sample_02.wav", result: "Genuine", confidence: 91, risk: "Low", time: "15 min ago" },
  { id: 3, filename: "call_03.wav", result: "Suspicious", confidence: 78, risk: "Medium", time: "1 hour ago" },
];

export default function RecentDetections() {
  return (
    <div className="skeuo-card p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <FileAudio size={20} className="text-accent" />
          Recent Detections
        </h3>
        <Link href="/history" className="text-sm text-accent hover:underline">
          View All &rarr;
        </Link>
      </div>
      
      <div className="flex flex-col gap-3 overflow-y-auto pr-2 skeuo-inset p-3 rounded-xl flex-1">
        {recentDetections.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 rounded-xl skeuo-card transition-colors group">
            <div className="flex items-center gap-4">
              <button className="h-10 w-10 rounded-full flex items-center justify-center text-accent skeuo-button">
                <Play size={16} className="ml-1" />
              </button>
              <div>
                <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">{item.filename}</p>
                <p className="text-xs text-foreground/50">{item.time}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold tracking-wide",
                item.result === "Synthetic" ? "bg-danger/20 text-danger" :
                item.result === "Genuine" ? "bg-success/20 text-success" :
                "bg-warning/20 text-warning"
              )}>
                {item.result}
              </span>
              <span className="text-sm font-medium hidden sm:block w-12 text-right">{item.confidence}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
