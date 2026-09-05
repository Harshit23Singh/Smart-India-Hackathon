"use client";

import { Search, Bell, Sun, Moon, Menu } from "lucide-react";
import { useState } from "react";

export default function TopNav() {
  const [isDark, setIsDark] = useState(true);

  return (
    <header className="h-20 w-full flex items-center justify-between px-6 md:px-8 border-b border-black/40 skeuo-card rounded-none border-t-0 border-x-0 sticky top-0 z-10">
      
      {/* Mobile Menu & Search Area */}
      <div className="flex items-center gap-4 flex-1">
        <button className="md:hidden p-2 text-foreground/70 hover:text-foreground skeuo-button">
          <Menu size={24} />
        </button>
        
        <div className="relative w-full max-w-md hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-foreground/40" />
          </div>
          <input
            type="text"
            placeholder="Search recordings, reports..."
            className="block w-full pl-10 pr-3 py-2 border-none rounded-xl leading-5 skeuo-inset text-foreground placeholder-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent transition-colors duration-200"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 md:gap-6">
        
        {/* Theme Toggle (Mock) */}
        <button 
          onClick={() => setIsDark(!isDark)}
          className="p-2.5 rounded-xl skeuo-button text-foreground/70 hover:text-foreground transition-colors"
        >
          {isDark ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl skeuo-button text-foreground/70 hover:text-foreground transition-colors">
          <Bell size={20} />
          <span
            className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-danger skeuo-led"
            style={{ color: "var(--danger)" }}
          ></span>
        </button>

        {/* Divider */}
        <div className="hidden md:block h-6 w-px bg-border"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="h-10 w-10 rounded-xl skeuo-button flex items-center justify-center text-accent font-bold text-sm">
            HS
          </div>
          <div className="hidden md:block text-sm">
            <p className="font-medium text-foreground">Harshit Singh</p>
            <p className="text-xs text-foreground/50">Admin</p>
          </div>
        </div>

      </div>
    </header>
  );
}
