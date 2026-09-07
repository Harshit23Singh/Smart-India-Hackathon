"use client";

import { Search, Filter, Play, Download, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

const historyData = [
  { id: "DET-1049", date: "2026-09-05 13:01", audio: "call_01.wav", result: "Synthetic", confidence: 96, risk: "High", status: "Blocked", action: "Review" },
  { id: "DET-1048", date: "2026-09-05 12:45", audio: "sample_02.wav", result: "Genuine", confidence: 91, risk: "Low", status: "Allowed", action: "Review" },
  { id: "DET-1047", date: "2026-09-05 11:30", audio: "call_03.wav", result: "Suspicious", confidence: 78, risk: "Medium", status: "Flagged", action: "Review" },
  { id: "DET-1046", date: "2026-09-05 09:15", audio: "unknown_caller.wav", result: "Synthetic", confidence: 99, risk: "High", status: "Blocked", action: "Review" },
  { id: "DET-1045", date: "2026-09-04 18:20", audio: "voicemail_msg.m4a", result: "Genuine", confidence: 88, risk: "Low", status: "Allowed", action: "Review" },
  { id: "DET-1044", date: "2026-09-04 15:10", audio: "ceo_urgent.wav", result: "Synthetic", confidence: 94, risk: "High", status: "Blocked", action: "Review" },
  { id: "DET-1043", date: "2026-09-04 14:05", audio: "meeting_rec.flac", result: "Genuine", confidence: 95, risk: "Low", status: "Allowed", action: "Review" },
];

export default function ThreatHistoryPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Threat History</h1>
          <p className="text-foreground/60 mt-1">Review past detections and analysis reports.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 skeuo-button rounded-lg flex items-center gap-2 transition-colors text-sm font-medium cursor-pointer">
            <Filter size={16} />
            Filter
          </button>
          <button className="px-4 py-2 skeuo-button rounded-lg flex items-center gap-2 transition-colors text-sm font-medium cursor-pointer">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="skeuo-card overflow-hidden">
        
        {/* Search Bar */}
        <div className="p-4 border-b border-border flex items-center bg-foreground/5">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
            <input 
              type="text" 
              placeholder="Search by ID, filename, or result..." 
              className="w-full pl-10 pr-4 py-2 skeuo-inset rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
            />
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-foreground/5 border-b border-border text-foreground/60 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Audio / Call</th>
                <th className="px-6 py-4 font-medium">Detection Result</th>
                <th className="px-6 py-4 font-medium">Confidence</th>
                <th className="px-6 py-4 font-medium">Risk Level</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {historyData.map((row) => (
                <tr key={row.id} className="hover:bg-foreground/5 transition-colors group">
                  <td className="px-6 py-4 text-foreground/80">{row.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent/20 transition-colors">
                        <Play size={14} className="ml-0.5" />
                      </button>
                      <span className="font-medium">{row.audio}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-semibold",
                      row.result === "Synthetic" ? "bg-danger/10 text-danger border border-danger/20" :
                      row.result === "Genuine" ? "bg-success/10 text-success border border-success/20" :
                      "bg-warning/10 text-warning border border-warning/20"
                    )}>
                      {row.result}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono">{row.confidence}%</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        row.risk === "High" ? "bg-danger" :
                        row.risk === "Low" ? "bg-success" : "bg-warning"
                      )}></div>
                      {row.risk}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground/60">{row.status}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-accent hover:text-accent/80 text-sm font-medium mr-4">View Report</button>
                    <button className="text-foreground/40 hover:text-foreground">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-foreground/60">
          <span>Showing 1 to 7 of 1,284 entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-border rounded hover:bg-foreground/5 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 bg-accent text-white rounded">1</button>
            <button className="px-3 py-1 border border-border rounded hover:bg-foreground/5">2</button>
            <button className="px-3 py-1 border border-border rounded hover:bg-foreground/5">3</button>
            <button className="px-3 py-1 border border-border rounded hover:bg-foreground/5 disabled:opacity-50">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
}

