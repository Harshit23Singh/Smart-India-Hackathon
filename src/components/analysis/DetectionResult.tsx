"use client";

import { AlertTriangle, ShieldCheck, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import StarBorder from "@/components/ui/StarBorder";

interface DetectionResultProps {
  status: "genuine" | "suspicious" | "threat";
  confidence: number;
  message?: string;
}

export default function DetectionResult({ status, confidence, message }: DetectionResultProps) {
  
  const config = {
    genuine: {
      title: "Genuine Voice Verified",
      badge: "AUTHENTIC / LOW RISK",
      starColor: "#10b981",
      textColor: "text-emerald-400",
      bgBadge: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
      icon: ShieldCheck,
      defaultMessage: "Acoustic biomarkers and vocal cadence match genuine human speech. No synthetic manipulation detected.",
      gradient: "from-emerald-950/20 via-black to-black",
    },
    suspicious: {
      title: "Suspicious Voice Artifacts",
      badge: "ANOMALOUS / MEDIUM RISK",
      starColor: "#f59e0b",
      textColor: "text-amber-400",
      bgBadge: "bg-amber-500/10 border-amber-500/30 text-amber-400",
      icon: AlertTriangle,
      defaultMessage: "Unusual spectral anomalies and pitch irregularities detected. Identity verification strongly recommended.",
      gradient: "from-amber-950/20 via-black to-black",
    },
    threat: {
      title: "Voice Cloning Detected",
      badge: "SYNTHETIC DEEPFAKE / HIGH RISK",
      starColor: "#ef4444",
      textColor: "text-red-400",
      bgBadge: "bg-red-500/10 border-red-500/30 text-red-400",
      icon: ShieldAlert,
      defaultMessage: "Critical match for neural speech synthesis / AI voice clone. Impersonation attack vectors flagged.",
      gradient: "from-red-950/20 via-black to-black",
    }
  };

  const curr = config[status];
  const Icon = curr.icon;

  return (
    <StarBorder
      as="div"
      className="w-full"
      innerClassName="p-8 relative overflow-hidden bg-[#07070a]/95"
      color={curr.starColor}
      speed="5s"
      thickness={2}
      backgroundColor="#07070a"
      borderColor="rgba(255, 255, 255, 0.1)"
    >
      {/* Background Gradient Glow */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-40 pointer-events-none", curr.gradient)}></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        
        {/* Risk Score — glowing radial dial */}
        <div className="relative h-36 w-36 flex items-center justify-center shrink-0 bg-[#020204] border border-white/10 rounded-full p-2 shadow-2xl">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <circle 
              cx="50" cy="50" r="42" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="8" 
              strokeDasharray={`${confidence * 2.64} 264`}
              className={curr.textColor}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-black font-mono text-white">{confidence}%</span>
            <span className="text-[9px] uppercase tracking-wider text-white/50 text-center leading-tight mt-0.5">
              {status === 'genuine' ? 'Authenticity' : 'Synthetic Prob.'}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <div className={cn("p-2 rounded-xl border", curr.bgBadge)}>
              <Icon size={24} />
            </div>
            <h2 className={cn("text-2xl font-extrabold tracking-tight", curr.textColor)}>{curr.title}</h2>
          </div>
          
          <div className="mb-3">
            <span className={cn(
              "inline-block px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest border",
              curr.bgBadge
            )}>
              {curr.badge}
            </span>
          </div>
          
          <p className="text-white/80 text-sm md:text-base leading-relaxed">
            {message || curr.defaultMessage}
          </p>
        </div>
      </div>
    </StarBorder>
  );
}
