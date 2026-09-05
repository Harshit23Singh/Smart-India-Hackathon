"use client";

import { UserCheck, UserX, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpeakerVerificationProps {
  expectedSpeaker: string;
  analyzedVoice: string;
  similarity: number;
}

export default function SpeakerVerification({ expectedSpeaker, analyzedVoice, similarity }: SpeakerVerificationProps) {
  const isMatch = similarity > 80;
  
  return (
    <div className="skeuo-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Speaker Verification</h3>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Expected */}
        <div className="flex-1 w-full text-center p-4 skeuo-inset rounded-xl">
          <p className="text-xs text-foreground/50 uppercase tracking-wider mb-2">Expected Speaker</p>
          <div className="h-12 w-12 mx-auto rounded-full skeuo-button flex items-center justify-center text-accent mb-2 font-bold">
            {expectedSpeaker.substring(0, 2).toUpperCase()}
          </div>
          <p className="font-medium text-foreground">{expectedSpeaker}</p>
        </div>
        
        {/* Comparison */}
        <div className="flex flex-col items-center">
          <ArrowRight className="hidden md:block text-foreground/30 mb-2" size={24} />
          <div className="text-center">
            <span className="text-3xl font-bold font-mono text-foreground">{similarity}%</span>
            <p className="text-xs text-foreground/50 uppercase tracking-wider mt-1">Similarity</p>
          </div>
        </div>
        
        {/* Analyzed */}
        <div className={cn(
          "flex-1 w-full text-center p-4 rounded-xl skeuo-inset",
          isMatch ? "" : ""
        )}>
          <p className="text-xs text-foreground/50 uppercase tracking-wider mb-2">Analyzed Voice</p>
          <div className={cn(
            "h-12 w-12 mx-auto rounded-full flex items-center justify-center mb-2",
            isMatch ? "bg-success/20 text-success" : "bg-danger/20 text-danger"
          )}>
            {isMatch ? <UserCheck size={24} /> : <UserX size={24} />}
          </div>
          <p className={cn("font-medium", isMatch ? "text-success" : "text-danger")}>
            {isMatch ? "Speaker Verified" : "Speaker Mismatch"}
          </p>
        </div>

      </div>
    </div>
  );
}
