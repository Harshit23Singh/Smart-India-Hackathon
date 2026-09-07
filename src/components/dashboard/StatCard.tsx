"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import StarBorder from "@/components/ui/StarBorder";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  type?: "default" | "danger" | "success" | "accent";
}

export default function StatCard({ title, value, icon: Icon, trend, trendUp, type = "default" }: StatCardProps) {
  const colorMap = {
    default: {
      star: "#a855f7", // purple
      iconBg: "bg-purple-500/10 border-purple-500/30 text-purple-400",
    },
    danger: {
      star: "#ef4444", // red
      iconBg: "bg-red-500/10 border-red-500/30 text-red-400",
    },
    success: {
      star: "#10b981", // emerald
      iconBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    },
    accent: {
      star: "#00e5ff", // cyan
      iconBg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
    },
  };

  const currentTheme = colorMap[type];

  return (
    <StarBorder
      as="div"
      className="w-full group transition-all duration-300"
      innerClassName="p-5 flex items-start gap-4 bg-[#07070a]/90"
      color={currentTheme.star}
      speed="5s"
      thickness={1.5}
      backgroundColor="#07070a"
      borderColor="rgba(255, 255, 255, 0.08)"
    >
      <div className={cn("p-3.5 rounded-2xl border flex items-center justify-center transition-transform group-hover:scale-105", currentTheme.iconBg)}>
        <Icon size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider">{title}</h3>
        <p className="text-2xl font-black text-white mt-1 tracking-tight font-mono">{value}</p>
        
        {trend && (
          <div className="flex items-center gap-2 mt-2">
            <span className={cn(
              "text-[11px] font-semibold px-2 py-0.5 rounded-full border",
              trendUp 
                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" 
                : "text-red-400 bg-red-500/10 border-red-500/30"
            )}>
              {trendUp ? "↑" : "↓"} {trend}
            </span>
          </div>
        )}
      </div>
    </StarBorder>
  );
}
