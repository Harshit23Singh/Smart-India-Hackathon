"use client";

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import ThreatChart from "@/components/dashboard/ThreatChart";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useEffect, useState } from "react";

const categoryData = [
  { name: 'Voice Cloning', value: 45 },
  { name: 'Speaker Impersonation', value: 30 },
  { name: 'Replay Attack', value: 15 },
  { name: 'Synthetic Speech', value: 10 },
];

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#3b82f6'];

const confidenceData = [
  { name: '90-100%', threats: 120, genuine: 850 },
  { name: '80-89%', threats: 45, genuine: 150 },
  { name: '70-79%', threats: 20, genuine: 45 },
  { name: '< 70%', threats: 5, genuine: 15 },
];

export default function AnalyticsPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  const tooltipStyle = {
    backgroundColor: isDark ? '#2b2d31' : '#ffffff',
    borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    color: isDark ? '#e0e2e5' : '#1c222b',
    boxShadow: isDark ? '0 10px 25px rgba(0,0,0,0.5)' : '0 10px 25px rgba(0,0,0,0.1)'
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Analytics Overview</h1>
        <p className="text-foreground/60 mt-1">Deep dive into threat patterns and system performance.</p>
      </div>

      {/* Top Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Attack Categories Pie Chart */}
        <div className="lg:col-span-1 skeuo-card p-6 h-[400px] flex flex-col">
          <h3 className="text-lg font-semibold text-foreground mb-4">Attack Categories</h3>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="45%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={tooltipStyle}
                  itemStyle={{ color: isDark ? '#ffffff' : '#1c222b' }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }}/>
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
              <span className="text-3xl font-bold text-foreground">190</span>
              <span className="text-xs text-foreground/50 uppercase tracking-widest">Total Threats</span>
            </div>
          </div>
        </div>

        {/* Main Threat Chart (Reused from Dashboard) */}
        <div className="lg:col-span-2 h-[400px]">
          <ThreatChart />
        </div>
      </div>

      {/* Bottom Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Confidence Distribution */}
        <div className="skeuo-card p-6 h-[400px] flex flex-col">
          <h3 className="text-lg font-semibold text-foreground mb-6">Detection Confidence Distribution</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={confidenceData}
                margin={{ top: 20, right: 30, left: -20, bottom: 5 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.07)"} 
                  vertical={false} 
                />
                <XAxis dataKey="name" stroke={isDark ? "#94a3b8" : "#64748b"} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={isDark ? "#94a3b8" : "#64748b"} fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={tooltipStyle}
                  cursor={{ fill: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }}/>
                <Bar dataKey="threats" name="Threats" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="genuine" name="Genuine" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Performance KPIs */}
        <div className="skeuo-card p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-foreground mb-6">System Performance</h3>
          
          <div className="space-y-6 flex-1">
            <div className="p-4 skeuo-inset rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground/70">Average Analysis Time</span>
                <span className="text-lg font-bold text-accent">1.24s</span>
              </div>
              <div className="h-1.5 w-full bg-foreground/10 rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>

            <div className="p-4 skeuo-inset rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground/70">False Positive Rate</span>
                <span className="text-lg font-bold text-success">0.8%</span>
              </div>
              <div className="h-1.5 w-full bg-foreground/10 rounded-full overflow-hidden">
                <div className="h-full bg-success rounded-full" style={{ width: '8%' }}></div>
              </div>
            </div>

            <div className="p-4 skeuo-inset rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground/70">API Uptime</span>
                <span className="text-lg font-bold text-success">99.99%</span>
              </div>
              <div className="h-1.5 w-full bg-foreground/10 rounded-full overflow-hidden">
                <div className="h-full bg-success rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs text-foreground/50">Last updated: Just now</span>
              <button className="text-xs text-accent hover:underline cursor-pointer">Download Full Report</button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
