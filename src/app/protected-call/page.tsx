"use client";

import { Phone, ShieldAlert, AlertTriangle, User, MicOff, PhoneOff, PhoneForwarded } from "lucide-react";
import ThreatMeter from "@/components/analysis/ThreatMeter";

export default function ProtectedCallPage() {
  return (
    <div className="max-w-5xl mx-auto flex flex-col h-full min-h-[calc(100vh-8rem)]">
      
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <ShieldAlert className="text-danger" size={32} />
            Protected Call Session
          </h1>
          <p className="text-foreground/60 mt-1">Real-time monitoring and threat prevention during active calls.</p>
        </div>
        <div className="px-4 py-1.5 bg-danger/20 border border-danger/30 rounded-full flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-danger animate-ping"></div>
          <span className="text-sm font-bold text-danger uppercase tracking-wider">Call in progress - 04:12</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Call UI */}
        <div className="lg:col-span-7 skeuo-card flex flex-col items-center justify-center p-12 relative overflow-hidden">
          
          {/* Background Pulse */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-danger/5 rounded-full blur-3xl animate-pulse"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="h-32 w-32 rounded-full skeuo-inset flex items-center justify-center mb-6 shadow-2xl relative">
              <User size={48} className="text-foreground/40" />
              <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-danger rounded-full flex items-center justify-center border-4 border-background">
                <AlertTriangle size={18} className="text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-foreground">Unknown Caller</h2>
            <p className="text-foreground/50 font-mono mt-1">+1 (555) 019-2834</p>
            
            <div className="mt-8 px-6 py-2 bg-danger/10 border border-danger/30 rounded-xl text-danger font-medium text-center max-w-sm">
              ⚠ Suspicious voice characteristics detected. Possible synthetic audio stream.
            </div>

            {/* Waveform */}
            <div className="w-full max-w-sm h-16 flex items-center justify-center gap-1 mt-12">
              {[...Array(40)].map((_, i) => (
                <div 
                  key={i}
                  className="w-1 bg-danger/60 rounded-full animate-pulse"
                  style={{
                    height: `${Math.max(10, Math.random() * 100)}%`,
                    animationDelay: `${i * 0.05}s`
                  }}
                ></div>
              ))}
            </div>
            
            {/* Call Controls */}
            <div className="flex items-center gap-6 mt-12">
              <button className="h-16 w-16 rounded-full skeuo-button flex items-center justify-center text-foreground transition-all cursor-pointer">
                <MicOff size={24} />
              </button>
              <button className="h-20 w-20 rounded-full bg-danger hover:bg-danger/90 border-4 border-danger/20 flex items-center justify-center text-white transition-all shadow-lg shadow-danger/20 cursor-pointer">
                <PhoneOff size={28} />
              </button>
              <button className="h-16 w-16 rounded-full skeuo-button flex items-center justify-center text-foreground transition-all cursor-pointer">
                <PhoneForwarded size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Analysis */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <ThreatMeter 
            status="threat"
            authenticity={12}
            syntheticProb={96}
            speakerMatch={0}
          />

          <div className="skeuo-card p-6 flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recommended Actions</h3>
            
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 skeuo-button rounded-xl transition-colors text-left group cursor-pointer">
                <div>
                  <p className="font-medium text-foreground">Disconnect Call</p>
                  <p className="text-xs text-foreground/50 mt-1">End the current session immediately</p>
                </div>
                <PhoneOff className="text-foreground/40 group-hover:text-danger transition-colors" size={20} />
              </button>
              
              <button className="w-full flex items-center justify-between p-4 skeuo-button rounded-xl transition-colors text-left group cursor-pointer">
                <div>
                  <p className="font-medium text-foreground">Challenge Question</p>
                  <p className="text-xs text-foreground/50 mt-1">Ask predefined security question</p>
                </div>
                <ShieldAlert className="text-foreground/40 group-hover:text-accent transition-colors" size={20} />
              </button>

              <button className="w-full flex items-center justify-between p-4 skeuo-button rounded-xl transition-colors text-left group cursor-pointer">
                <div>
                  <p className="font-medium text-foreground">Record & Trace</p>
                  <p className="text-xs text-foreground/50 mt-1">Capture forensic evidence</p>
                </div>
                <Phone className="text-foreground/40 group-hover:text-accent transition-colors" size={20} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

