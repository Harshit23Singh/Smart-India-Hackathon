"use client";

import { Search, Filter, Play, Download, MoreVertical, History, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import StarBorder from "@/components/ui/StarBorder";

const historyData = [
  { id: "DET-1049", date: "2026-09-05 13:01", audio: "call_01.wav", result: "Synthetic", confidence: 96, risk: "High", status: "Blocked" },
  { id: "DET-1048", date: "2026-09-05 12:45", audio: "sample_02.wav", result: "Genuine", confidence: 91, risk: "Low", status: "Allowed" },
  { id: "DET-1047", date: "2026-09-05 11:30", audio: "call_03.wav", result: "Suspicious", confidence: 78, risk: "Medium", status: "Flagged" },
  { id: "DET-1046", date: "2026-09-05 09:15", audio: "unknown_caller.wav", result: "Synthetic", confidence: 99, risk: "High", status: "Blocked" },
  { id: "DET-1045", date: "2026-09-04 18:20", audio: "voicemail_msg.m4a", result: "Genuine", confidence: 88, risk: "Low", status: "Allowed" },
  { id: "DET-1044", date: "2026-09-04 15:10", audio: "ceo_urgent.wav", result: "Synthetic", confidence: 94, risk: "High", status: "Blocked" },
  { id: "DET-1043", date: "2026-09-04 14:05", audio: "meeting_rec.flac", result: "Genuine", confidence: 95, risk: "Low", status: "Allowed" },
];

export default function ThreatHistoryPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-bold mb-2">
            <History size={12} /> FORENSIC AUDIT LOG
          </div>
          <h1 className="text-3xl font-extrabold text-white">Threat History</h1>
          <p className="text-white/60 text-sm mt-1">Audit log of analyzed audio streams, acoustic signatures, and classification records.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center gap-2 text-xs font-semibold text-white transition-colors cursor-pointer">
            <Filter size={14} />
            Filter
          </button>
          <button className="px-4 py-2 bg-accent/10 hover:bg-accent/20 border border-accent/30 rounded-xl flex items-center gap-2 text-xs font-semibold text-accent transition-colors cursor-pointer">
            <Download size={14} />
            Export Log
          </button>
        </div>
      </div>

      <StarBorder
        as="div"
        className="w-full"
        innerClassName="p-0 overflow-hidden bg-[#07070a]/95"
        color="#00e5ff"
        speed="8s"
        thickness={1.5}
        backgroundColor="#07070a"
        borderColor="rgba(255, 255, 255, 0.08)"
      >
        {/* Search Bar */}
        <div className="p-4 border-b border-white/10 flex items-center bg-black/40">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            <input 
              type="text" 
              placeholder="Search by ID, audio file, or status..." 
              className="w-full pl-10 pr-4 py-2 bg-[#020204] border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-black/60 border-b border-white/10 text-white/50 uppercase font-mono tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-4 font-semibold">Date & Time</th>
                <th className="px-6 py-4 font-semibold">Audio Sample</th>
                <th className="px-6 py-4 font-semibold">Verdict</th>
                <th className="px-6 py-4 font-semibold">Confidence</th>
                <th className="px-6 py-4 font-semibold">Risk Level</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {historyData.map((row) => (
                <tr key={row.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 text-white/70 font-mono">{row.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <button className="h-7 w-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:bg-accent/20 transition-colors">
                        <Play size={12} className="ml-0.5 fill-current" />
                      </button>
                      <span className="font-semibold text-white">{row.audio}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono border",
                      row.result === "Synthetic" ? "bg-red-500/10 text-red-400 border-red-500/30" :
                      row.result === "Genuine" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
                      "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    )}>
                      {row.result}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-white/90">{row.confidence}%</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 font-medium">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        row.risk === "High" ? "bg-red-500 shadow-[0_0_6px_#ef4444]" :
                        row.risk === "Low" ? "bg-emerald-500 shadow-[0_0_6px_#10b981]" : "bg-amber-500 shadow-[0_0_6px_#f59e0b]"
                      )}></div>
                      <span className="text-white/80">{row.risk}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white/60 font-mono">{row.status}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-accent hover:text-cyan-300 font-semibold mr-4 cursor-pointer">View Dossier</button>
                    <button className="text-white/30 hover:text-white cursor-pointer">
                      <MoreVertical size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50 bg-black/40">
          <span>Showing 1 to 7 of 1,284 telemetry records</span>
          <div className="flex gap-1.5 font-mono">
            <button className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-40">Prev</button>
            <button className="px-3 py-1 bg-accent text-black font-bold rounded-lg shadow-[0_0_10px_rgba(0,229,255,0.4)]">1</button>
            <button className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10">2</button>
            <button className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10">3</button>
            <button className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10">Next</button>
          </div>
        </div>
      </StarBorder>

    </div>
  );
}
