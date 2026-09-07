"use client";

import { Search, Bell, Sun, Moon, Menu, Shield } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useEffect, useState } from "react";

export default function TopNav() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <header className="h-20 w-full flex items-center justify-between px-6 md:px-8 border-b border-white/10 bg-[#050508]/80 backdrop-blur-xl sticky top-0 z-20">
      
      {/* Mobile Menu & Search Area */}
      <div className="flex items-center gap-4 flex-1">
        <button className="md:hidden p-2 text-white/70 hover:text-white skeuo-button rounded-lg" aria-label="Open menu">
          <Menu size={22} />
        </button>
        
        <div className="relative w-full max-w-md hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search size={16} className="text-white/40" />
          </div>
          <input
            type="text"
            placeholder="Search audio, detections, reports..."
            className="block w-full pl-10 pr-4 py-2 text-sm bg-black/60 border border-white/10 rounded-xl leading-5 text-white placeholder:text-white/30 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-200"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 md:gap-5">
        
        {/* Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono">
          <Shield size={13} className="animate-pulse" />
          <span>VOICEGUARD ENGINE V2.4</span>
        </div>

        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.08] transition-all duration-200 active:scale-95 flex items-center justify-center cursor-pointer"
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            <Sun size={18} className="text-amber-400 animate-in fade-in zoom-in duration-200" />
          ) : (
            <Moon size={18} className="text-accent animate-in fade-in zoom-in duration-200" />
          )}
        </button>

        {/* Notifications */}
        <button 
          className="relative p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span
            className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-danger skeuo-led"
            style={{ color: "var(--danger)" }}
          ></span>
        </button>

        {/* Divider */}
        <div className="hidden md:block h-6 w-px bg-white/10"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer select-none bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 p-1.5 pr-3 rounded-xl transition-colors">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-accent/40 flex items-center justify-center text-accent font-bold text-xs shadow-[0_0_10px_rgba(0,229,255,0.2)]">
            HS
          </div>
          <div className="hidden md:block text-left">
            <p className="font-semibold text-xs text-white leading-tight">Harshit Singh</p>
            <p className="text-[10px] text-accent font-mono">SecOps Admin</p>
          </div>
        </div>

      </div>
    </header>
  );
}
