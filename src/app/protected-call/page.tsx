"use client";

import { Phone, ShieldAlert, AlertTriangle, User, MicOff, PhoneOff, PhoneForwarded, Radio } from "lucide-react";
import ThreatMeter from "@/components/analysis/ThreatMeter";
import StarBorder from "@/components/ui/StarBorder";

export default function ProtectedCallPage() {
  return (
    <div className="max-w-5xl mx-auto flex flex-col h-full min-h-[calc(100vh-8rem)] space-y-6 pb-16">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold mb-2">
            <Radio size={12} className="animate-pulse" /> ACTIVE TELEPHONY SHIELD
          </div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            Protected Call Session
          </h1>
          <p className="text-white/60 text-sm mt-1">Real-time anti-spoofing and deepfake biometric defense for live audio calls.</p>
        </div>
        <div className="px-4 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-ping"></div>
          <span className="text-xs font-bold text-red-400 font-mono tracking-wider">CALL IN PROGRESS · 04:12</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Call UI Card */}
        <StarBorder
          as="div"
          className="lg:col-span-7 h-full"
          innerClassName="p-10 flex flex-col items-center justify-center relative overflow-hidden bg-[#07070a]/95 h-full"
          color="#ef4444"
          speed="3.5s"
          thickness={2}
          backgroundColor="#07070a"
          borderColor="rgba(239, 68, 68, 0.3)"
        >
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="h-28 w-28 rounded-full bg-[#020204] border-2 border-red-500/40 flex items-center justify-center mb-5 relative">
              <User size={44} className="text-white/30" />
              <div className="absolute -bottom-1 -right-1 h-8 w-8 bg-red-600 rounded-full flex items-center justify-center border-2 border-black shadow-lg">
                <AlertTriangle size={14} className="text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-extrabold text-white">Unknown Caller</h2>
            <p className="text-white/40 font-mono text-xs mt-1 tracking-wider">+1 (555) 019-2834 · SIP Trunk 08</p>
            
            <div className="mt-6 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-medium text-xs text-center max-w-xs">
              ⚠ High-risk synthetic frequency patterns detected on line.
            </div>

            {/* Live Waveform */}
            <div className="w-full max-w-xs h-14 flex items-center justify-center gap-1 mt-8">
              {[...Array(30)].map((_, i) => (
                <div 
                  key={i}
                  className="w-1 bg-red-500 rounded-full animate-pulse shadow-[0_0_6px_#ef4444]"
                  style={{
                    height: `${Math.max(15, Math.random() * 95)}%`,
                    animationDelay: `${i * 0.05}s`
                  }}
                ></div>
              ))}
            </div>
            
            {/* Call Controls */}
            <div className="flex items-center gap-5 mt-8">
              <button className="h-12 w-12 rounded-full bg-white/5 border border-white/10 hover:border-white/20 flex items-center justify-center text-white transition-all cursor-pointer">
                <MicOff size={18} />
              </button>
              <button className="h-16 w-16 rounded-full bg-red-600 hover:bg-red-500 border-4 border-red-500/30 flex items-center justify-center text-white transition-all shadow-[0_0_25px_rgba(239,68,68,0.5)] cursor-pointer active:scale-95">
                <PhoneOff size={24} />
              </button>
              <button className="h-12 w-12 rounded-full bg-white/5 border border-white/10 hover:border-white/20 flex items-center justify-center text-white transition-all cursor-pointer">
                <PhoneForwarded size={18} />
              </button>
            </div>
          </div>
        </StarBorder>

        {/* Real-time Telemetry & Actions */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <ThreatMeter 
            status="threat"
            authenticity={12}
            syntheticProb={96}
            speakerMatch={0}
          />

          <StarBorder
            as="div"
            className="w-full flex-1"
            innerClassName="p-6 bg-[#07070a]/95 flex flex-col justify-between"
            color="#00e5ff"
            speed="6s"
            thickness={1.5}
            backgroundColor="#07070a"
            borderColor="rgba(255, 255, 255, 0.08)"
          >
            <div>
              <h3 className="text-base font-bold text-white mb-4">Tactical Call Countermeasures</h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3.5 bg-[#020204] border border-white/10 hover:border-red-500/40 rounded-xl transition-all text-left group cursor-pointer">
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">Instant Line Sever</p>
                    <p className="text-[10px] text-white/40 mt-0.5">Disconnect audio bridge & save telemetry</p>
                  </div>
                  <PhoneOff className="text-white/30 group-hover:text-red-400 transition-colors" size={16} />
                </button>
                
                <button className="w-full flex items-center justify-between p-3.5 bg-[#020204] border border-white/10 hover:border-accent/40 rounded-xl transition-all text-left group cursor-pointer">
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-accent transition-colors">Synthetic Trap / Challenge</p>
                    <p className="text-[10px] text-white/40 mt-0.5">Inject dynamic acoustic challenge token</p>
                  </div>
                  <ShieldAlert className="text-white/30 group-hover:text-accent transition-colors" size={16} />
                </button>

                <button className="w-full flex items-center justify-between p-3.5 bg-[#020204] border border-white/10 hover:border-accent/40 rounded-xl transition-all text-left group cursor-pointer">
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-accent transition-colors">Record Forensic Audio</p>
                    <p className="text-[10px] text-white/40 mt-0.5">Stream packet logs to compliance vault</p>
                  </div>
                  <Phone className="text-white/30 group-hover:text-accent transition-colors" size={16} />
                </button>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-white/40">
              Session Hash: 8F2A-94B1-0C7D
            </div>
          </StarBorder>
        </div>

      </div>
    </div>
  );
}
