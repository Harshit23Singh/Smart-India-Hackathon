"use client";

import { ShieldAlert, AlertTriangle, ShieldCheck, Bell, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import StarBorder from "@/components/ui/StarBorder";

const alerts = [
  { id: 1, severity: "critical", type: "CEO Impersonation Attempt", time: "2 minutes ago", source: "External Call (+1 555-0198)", status: "Blocked" },
  { id: 2, severity: "high", type: "Synthetic Voice Detected", time: "15 minutes ago", source: "Uploaded Audio (urgent_msg.wav)", status: "Flagged" },
  { id: 3, severity: "medium", type: "Speaker Mismatch", time: "1 hour ago", source: "Internal Transfer (Ext 402)", status: "Investigating" },
  { id: 4, severity: "resolved", type: "Suspicious API Activity", time: "3 hours ago", source: "Integration Gateway", status: "Resolved" },
  { id: 5, severity: "high", type: "Replay Attack Detected", time: "Yesterday, 14:30", source: "Voicemail System", status: "Blocked" },
];

export default function AlertsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-bold mb-2">
            <Bell size={12} /> REAL-TIME SECURITY ALERTS
          </div>
          <h1 className="text-3xl font-extrabold text-white">Threat Alerts</h1>
          <p className="text-white/60 text-sm mt-1">Live telemetry notifications & flagged biometric events.</p>
        </div>
        
        <div className="flex gap-2">
          <select className="bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent">
            <option>All Alerts</option>
            <option>Critical Only</option>
            <option>Unresolved</option>
          </select>
          <button className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer">
            Mark All as Read
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {alerts.map((alert) => {
          const isCritical = alert.severity === "critical";
          const isHigh = alert.severity === "high";
          const isMedium = alert.severity === "medium";

          const starColor = isCritical ? "#ef4444" : isHigh ? "#f87171" : isMedium ? "#f59e0b" : "#10b981";

          return (
            <StarBorder
              key={alert.id}
              as="div"
              className="w-full transition-all duration-200 hover:-translate-y-0.5"
              innerClassName="p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-[#07070a]/95"
              color={starColor}
              speed="8s"
              thickness={1.5}
              backgroundColor="#07070a"
              borderColor="rgba(255, 255, 255, 0.08)"
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-3 rounded-xl border shrink-0",
                  isCritical || isHigh ? "bg-red-500/10 border-red-500/30 text-red-400" :
                  isMedium ? "bg-amber-500/10 border-amber-500/30 text-amber-400" :
                  "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                )}>
                  {isCritical || isHigh ? <ShieldAlert size={22} /> :
                   isMedium ? <AlertTriangle size={22} /> :
                   <ShieldCheck size={22} />}
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-sm font-bold text-white">{alert.type}</h3>
                    <span className={cn(
                      "text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 rounded border",
                      isCritical ? "bg-red-500 text-white border-red-600" :
                      isHigh ? "bg-red-500/10 text-red-400 border-red-500/30" :
                      isMedium ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                      "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    )}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-xs text-white/50">{alert.source}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-3 md:pt-0 mt-2 md:mt-0">
                <div className="text-right">
                  <p className="text-xs font-semibold text-white">{alert.status}</p>
                  <p className="text-[10px] text-white/40">{alert.time}</p>
                </div>
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white rounded-xl transition-colors cursor-pointer">
                  Details
                </button>
              </div>
            </StarBorder>
          );
        })}
      </div>

    </div>
  );
}
