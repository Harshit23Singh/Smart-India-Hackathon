"use client";

import { Mic, Square, Pause, RotateCcw } from "lucide-react";

export default function LiveAudioWidget() {
  return (
    <div className="skeuo-card p-6 flex flex-col h-full relative overflow-hidden">
      {/* Subtle inner top-highlight line for depth */}
      <div className="absolute top-0 left-4 right-4 h-px bg-white/10 rounded-full"></div>

      <div className="relative z-10 flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Mic className="text-accent" size={24} />
          Live Voice Detection
        </h3>
        {/* LED-style LIVE indicator */}
        <div className="flex items-center gap-2 px-3 py-1 skeuo-inset rounded-full">
          <div
            className="h-3 w-3 rounded-full bg-success skeuo-led"
            style={{ color: "var(--success)" }}
          ></div>
          <span className="text-[10px] font-bold text-success uppercase tracking-wider">Live</span>
        </div>
      </div>

      <p className="text-sm text-foreground/60 mb-4 relative z-10">Speak naturally to analyze in real time</p>

      {/* Waveform inside a sunken screen */}
      <div className="skeuo-inset rounded-xl flex-1 flex items-center justify-center gap-1 my-2 relative z-10 h-24 px-4 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="w-1.5 bg-accent rounded-full animate-pulse"
            style={{
              height: `${Math.max(10, Math.random() * 100)}%`,
              animationDelay: `${i * 0.05}s`,
              animationDuration: `${0.5 + Math.random()}s`,
              boxShadow: "0 0 6px var(--color-accent)",
            }}
          ></div>
        ))}
      </div>

      <div className="text-center mt-4 mb-4 relative z-10 skeuo-inset rounded-lg py-2">
        <p className="text-2xl font-bold font-mono text-foreground">00:07</p>
        <p className="text-xs text-accent animate-pulse mt-1">Recording...</p>
      </div>

      <div className="flex items-center justify-center gap-6 relative z-10">
        {/* Stop — red accent button */}
        <button className="flex flex-col items-center gap-2 text-danger group/btn">
          <div
            className="h-14 w-14 rounded-full flex items-center justify-center skeuo-button"
            style={{ background: "linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)" }}
          >
            <Square size={20} className="fill-current text-danger" />
          </div>
          <span className="text-xs font-medium text-foreground/60">Stop</span>
        </button>

        {/* Pause */}
        <button className="flex flex-col items-center gap-2 text-warning group/btn">
          <div className="h-14 w-14 rounded-full flex items-center justify-center skeuo-button">
            <Pause size={20} className="fill-current text-warning" />
          </div>
          <span className="text-xs font-medium text-foreground/60">Pause</span>
        </button>

        {/* Reset */}
        <button className="flex flex-col items-center gap-2 text-foreground/60 group/btn">
          <div className="h-14 w-14 rounded-full flex items-center justify-center skeuo-button">
            <RotateCcw size={20} />
          </div>
          <span className="text-xs font-medium text-foreground/60">Reset</span>
        </button>
      </div>
    </div>
  );
}
