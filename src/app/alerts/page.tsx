"use client";

import { ShieldAlert, AlertTriangle, ShieldCheck, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const alerts = [
  { id: 1, severity: "critical", type: "CEO Impersonation Attempt", time: "2 minutes ago", source: "External Call (+1 555-0198)", status: "Blocked" },
  { id: 2, severity: "high", type: "Synthetic Voice Detected", time: "15 minutes ago", source: "Uploaded Audio (urgent_msg.wav)", status: "Flagged" },
  { id: 3, severity: "medium", type: "Speaker Mismatch", time: "1 hour ago", source: "Internal Transfer (Ext 402)", status: "Investigating" },
  { id: 4, severity: "resolved", type: "Suspicious API Activity", time: "3 hours ago", source: "Integration Gateway", status: "Resolved" },
  { id: 5, severity: "high", type: "Replay Attack Detected", time: "Yesterday, 14:30", source: "Voicemail System", status: "Blocked" },
];

export default function AlertsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Threat Alerts</h1>
          <p className="text-foreground/60 mt-1">Real-time notifications of security events.</p>
        </div>
        
        <div className="flex gap-2">
          <select className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none">
            <option>All Alerts</option>
            <option>Critical Only</option>
            <option>Unresolved</option>
          </select>
          <button className="px-4 py-2 bg-white/5 border border-border hover:bg-white/10 rounded-lg text-sm transition-colors">
            Mark All as Read
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {alerts.map((alert) => {
          const isCritical = alert.severity === "critical";
          const isHigh = alert.severity === "high";
          const isMedium = alert.severity === "medium";
          const isResolved = alert.severity === "resolved";

          return (
            <div 
              key={alert.id} 
              className={cn(
                "skeuo-card p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between transition-all hover:-translate-y-1",
                isCritical ? "border-danger bg-danger/5" :
                isHigh ? "border-danger/50" :
                isMedium ? "border-warning/50" :
                "border-success/30 opacity-70"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-3 rounded-full shrink-0",
                  isCritical || isHigh ? "bg-danger/20 text-danger" :
                  isMedium ? "bg-warning/20 text-warning" :
                  "bg-success/20 text-success"
                )}>
                  {isCritical || isHigh ? <ShieldAlert size={24} /> :
                   isMedium ? <AlertTriangle size={24} /> :
                   <ShieldCheck size={24} />}
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-base font-bold text-foreground">{alert.type}</h3>
                    <span className={cn(
                      "text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded",
                      isCritical ? "bg-danger text-white" :
                      isHigh ? "bg-danger/20 text-danger" :
                      isMedium ? "bg-warning/20 text-warning" :
                      "bg-success/20 text-success"
                    )}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/70">{alert.source}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-border/50 pt-3 md:pt-0 mt-2 md:mt-0">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{alert.status}</p>
                  <p className="text-xs text-foreground/50">{alert.time}</p>
                </div>
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-sm font-medium rounded-lg transition-colors">
                  Details
                </button>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  );
}

