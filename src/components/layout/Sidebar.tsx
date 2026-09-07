"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Mic, 
  History, 
  Bell, 
  BarChart3, 
  Activity,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import AiSparkIcon from "@/components/ui/AiSparkIcon";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Live Detection", href: "/live-detection", icon: Mic },
  { name: "Threat History", href: "/history", icon: History },
  { name: "Alerts", href: "/alerts", icon: Bell },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Protected Call", href: "/protected-call", icon: Activity },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full hidden md:flex flex-col bg-[#050508] border-r border-white/10 z-20">
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="bg-cyan-500/10 border border-cyan-400/20 p-2.5 rounded-xl text-cyan-400 flex items-center justify-center">
          <AiSparkIcon size={20} glow={false} />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
            Swaraksha{" "}
            <span className="text-white text-xs font-mono px-1.5 py-0.5 rounded bg-white/10 border border-white/20 font-bold">
              AI
            </span>
          </h1>
          <p className="text-[10px] text-white/50 uppercase tracking-widest mt-0.5 font-mono">सुरक्षित आवाज़ · Secure Voice</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                isActive 
                  ? "bg-white/[0.07] text-accent font-semibold border border-accent/40 shadow-[0_0_20px_-5px_rgba(0,229,255,0.3)]" 
                  : "text-white/70 hover:bg-white/[0.04] hover:text-white hover:border-white/10 border border-transparent"
              )}
            >
              <Icon size={18} className={cn(
                "transition-colors",
                isActive ? "text-accent" : "text-white/50 group-hover:text-white/80"
              )} />
              <span>{item.name}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Status Widget */}
      <div className="p-4 m-4 rounded-xl bg-black/60 border border-white/10 shadow-inner">
        <div className="flex items-center gap-3">
          <div
            className="h-3 w-3 rounded-full bg-success skeuo-led flex-shrink-0"
            style={{ color: "var(--success)" }}
          ></div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate flex items-center gap-1">
              AI Shield Active
              <ShieldCheck size={12} className="text-success" />
            </p>
            <p className="text-[10px] text-white/40 truncate font-mono">Real-time protection enabled</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
