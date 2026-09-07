import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  type?: "default" | "danger" | "success" | "accent";
}

export default function StatCard({ title, value, icon: Icon, trend, trendUp, type = "default" }: StatCardProps) {
  const iconBgStyles = {
    default: "bg-foreground/5 text-foreground/70",
    danger: "bg-danger/15 text-danger",
    success: "bg-success/15 text-success",
    accent: "bg-accent/15 text-accent",
  };

  return (
    <div className="skeuo-card p-6 flex items-start gap-4 transition-colors group">
      <div className={cn("p-4 rounded-2xl skeuo-inset", iconBgStyles[type])}>
        <Icon size={24} className={type === "default" ? "text-foreground/80 group-hover:text-accent transition-colors" : ""} />
      </div>
      <div>
        <h3 className="text-sm font-medium text-foreground/60">{title}</h3>
        <p className="text-2xl font-bold text-foreground mt-1 tracking-tight">{value}</p>
        
        {trend && (
          <div className="flex items-center gap-2 mt-2">
            <span className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-full",
              trendUp ? "text-success bg-success/10" : "text-danger bg-danger/10"
            )}>
              {trendUp ? "↑" : "↓"} {trend}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
