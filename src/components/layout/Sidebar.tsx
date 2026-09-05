"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Mic, 
  FileAudio, 
  History, 
  Bell, 
  BarChart3, 
  FileText, 
  Settings,
  ShieldCheck,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Live Detection", href: "/live-detection", icon: Mic },
  { name: "Audio Analysis", href: "/audio-analysis", icon: FileAudio },
  { name: "Threat History", href: "/history", icon: History },
  { name: "Alerts", href: "/alerts", icon: Bell },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full hidden md:flex flex-col bg-background/50 border-r border-border skeuo-card rounded-none border-t-0 border-l-0 border-b-0">
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-accent/20 p-2 rounded-lg text-accent skeuo-inset">
          <Activity size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Swaraksha AI</h1>
          <p className="text-[10px] text-foreground/50 uppercase tracking-widest mt-0.5">सुरक्षित आवाज़ · Secure Voice</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "skeuo-button text-white shadow-lg shadow-accent/20" 
                  : "text-foreground/70 hover:bg-white/5 hover:text-foreground"
              )}
            >
              <Icon size={18} className={cn(isActive ? "text-white" : "text-foreground/50")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto">
        <div className="flex items-center gap-3 p-4 rounded-xl skeuo-inset">
          {/* Physical LED bulb */}
          <div
            className="h-4 w-4 rounded-full bg-success skeuo-led flex-shrink-0"
            style={{ color: "var(--success)" }}
          ></div>
          <div>
            <p className="text-sm font-medium text-foreground">AI Protection Active</p>
            <p className="text-xs text-foreground/50">All systems operational</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

