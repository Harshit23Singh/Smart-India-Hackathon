"use client";

import { AlertTriangle, ShieldCheck, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface DetectionResultProps {
  status: "genuine" | "suspicious" | "threat";
  confidence: number;
  message?: string;
}

export default function DetectionResult({ status, confidence, message }: DetectionResultProps) {
  
  const config = {
    genuine: {
      title: "Genuine",
      badge: "LOW RISK",
      color: "text-success",
      bg: "bg-success/10",
      border: "border-success/30",
      icon: ShieldCheck,
      defaultMessage: "Voice appears consistent with a genuine human recording.",
      gradient: "from-success/20 to-transparent",
    },
    suspicious: {
      title: "Suspicious",
      badge: "MEDIUM RISK",
      color: "text-warning",
      bg: "bg-warning/10",
      border: "border-warning/30",
      icon: AlertTriangle,
      defaultMessage: "Unusual voice characteristics detected. Additional verification recommended.",
      gradient: "from-warning/20 to-transparent",
    },
    threat: {
      title: "Voice Cloning Detected",
      badge: "HIGH RISK",
      color: "text-danger",
      bg: "bg-danger/10",
      border: "border-danger/30",
      icon: ShieldAlert,
      defaultMessage: "Potential synthetic/AI-generated voice characteristics detected.",
      gradient: "from-danger/20 to-transparent",
    }
  };

  const curr = config[status];
  const Icon = curr.icon;

  return (
    <div className={cn(
      "skeuo-card overflow-hidden relative border-l-4",
      status === "genuine" ? "border-l-success" :
      status === "suspicious" ? "border-l-warning" : "border-l-danger"
    )}>
      {/* Background Gradient */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", curr.gradient)}></div>
      
      <div className="p-6 relative z-10 flex flex-col md:flex-row items-center gap-8">
        
        {/* Risk Score — skeuomorphic sunken dial */}
        <div className="relative h-36 w-36 flex items-center justify-center shrink-0 skeuo-inset rounded-full p-2">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="10" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" strokeDasharray="6 2" />
            <circle 
              cx="50" cy="50" r="42" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="10" 
              strokeDasharray={`${confidence * 2.64} 264`}
              className={curr.color}
              strokeLinecap="butt"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-bold font-mono text-foreground">{confidence}%</span>
            <span className="text-[9px] uppercase tracking-wider text-foreground/50 text-center leading-tight mt-1">
              {status === 'genuine' ? 'Authenticity' : 'Synthetic Prob.'}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <Icon className={curr.color} size={28} />
            <h2 className={cn("text-2xl font-bold tracking-tight", curr.color)}>{curr.title}</h2>
          </div>
          
          <div className="mb-4">
            {/* Engraved label badge */}
            <span className={cn(
              "inline-block px-4 py-1.5 rounded-lg text-xs font-bold tracking-widest skeuo-inset",
              curr.color
            )}>
              {curr.badge}
            </span>
          </div>
          
          <p className="text-foreground/80 text-sm md:text-base leading-relaxed">
            {message || curr.defaultMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
