"use client";

import { UserCheck, UserX, ArrowRight, Fingerprint } from "lucide-react";
import { cn } from "@/lib/utils";
import StarBorder from "@/components/ui/StarBorder";

interface SpeakerVerificationProps {
  expectedSpeaker: string;
  analyzedVoice: string;
  similarity: number;
}

export default function SpeakerVerification({ expectedSpeaker, analyzedVoice, similarity }: SpeakerVerificationProps) {
  const isMatch = similarity > 80;
  
  return (
    <StarBorder
      as="div"
      className="w-full"
      innerClassName="p-6 bg-[#07070a]/95"
      color={isMatch ? "#10b981" : "#ef4444"}
      speed="6s"
      thickness={1.5}
      backgroundColor="#07070a"
      borderColor="rgba(255, 255, 255, 0.08)"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="p-1.5 rounded-lg bg-accent/10 border border-accent/30 text-accent">
          <Fingerprint size={18} />
        </div>
        <h3 className="text-base font-bold text-white">Biometric Speaker Verification</h3>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Expected Speaker */}
        <div className="flex-1 w-full text-center p-4 bg-[#020204] border border-white/10 rounded-2xl">
          <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2 font-mono">Expected Voiceprint</p>
          <div className="h-12 w-12 mx-auto rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent mb-2 font-bold font-mono text-sm shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            {expectedSpeaker.substring(0, 2).toUpperCase()}
          </div>
          <p className="text-xs font-semibold text-white truncate">{expectedSpeaker}</p>
        </div>
        
        {/* Comparison Indicator */}
        <div className="flex flex-col items-center shrink-0">
          <ArrowRight className="hidden md:block text-white/30 mb-1" size={20} />
          <div className="text-center">
            <span className="text-2xl font-black font-mono text-white tracking-tight">{similarity}%</span>
            <p className="text-[9px] text-white/40 uppercase tracking-widest font-mono">Confidence</p>
          </div>
        </div>
        
        {/* Analyzed Audio */}
        <div className="flex-1 w-full text-center p-4 bg-[#020204] border border-white/10 rounded-2xl">
          <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2 font-mono">Analyzed Stream</p>
          <div className={cn(
            "h-12 w-12 mx-auto rounded-xl flex items-center justify-center mb-2 border",
            isMatch 
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]" 
              : "bg-red-500/10 border-red-500/30 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
          )}>
            {isMatch ? <UserCheck size={22} /> : <UserX size={22} />}
          </div>
          <p className={cn("text-xs font-semibold uppercase tracking-wider font-mono", isMatch ? "text-emerald-400" : "text-red-400")}>
            {isMatch ? "Verified" : "Mismatch"}
          </p>
        </div>

      </div>
    </StarBorder>
  );
}
