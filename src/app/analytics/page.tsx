"use client";

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import ThreatChart from "@/components/dashboard/ThreatChart";
import StarBorder from "@/components/ui/StarBorder";
import { BarChart3, PieChart as PieIcon, Cpu, Sparkles } from "lucide-react";

const categoryData = [
  { name: 'Voice Cloning', value: 45 },
  { name: 'Speaker Impersonation', value: 30 },
  { name: 'Replay Attack', value: 15 },
  { name: 'Synthetic Speech', value: 10 },
];

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#00e5ff'];

const confidenceData = [
  { name: '90-100%', threats: 120, genuine: 850 },
  { name: '80-89%', threats: 45, genuine: 150 },
  { name: '70-79%', threats: 20, genuine: 45 },
  { name: '< 70%', threats: 5, genuine: 15 },
];

export default function AnalyticsPage() {
  const tooltipStyle = {
    backgroundColor: '#07070a',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    color: '#ffffff',
    boxShadow: '0 10px 30px rgba(0,0,0,0.9)',
    padding: '10px 14px'
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      
      <div className="pb-2 border-b border-white/5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-bold mb-2">
          <BarChart3 size={12} /> FORENSIC TELEMETRY
        </div>
        <h1 className="text-3xl font-extrabold text-white">Analytics Overview</h1>
        <p className="text-white/60 text-sm mt-1">Deep threat telemetry, neural cluster metrics, and false-positive tracking.</p>
      </div>

      {/* Top Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Attack Categories Pie Chart */}
        <StarBorder
          as="div"
          className="lg:col-span-1 h-[420px]"
          innerClassName="p-6 flex flex-col h-full bg-[#07070a]/95"
          color="#ef4444"
          speed="8s"
          thickness={1.5}
          backgroundColor="#07070a"
          borderColor="rgba(255, 255, 255, 0.08)"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
              <PieIcon size={18} />
            </div>
            <h3 className="text-base font-bold text-white">Attack Vectors</h3>
          </div>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="45%"
                  innerRadius={75}
                  outerRadius={105}
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
                  itemStyle={{ color: '#ffffff' }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px' }}/>
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Stat */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
              <span className="text-3xl font-black font-mono text-white">190</span>
              <span className="text-[10px] text-white/50 uppercase font-mono tracking-widest">Total Threats</span>
            </div>
          </div>
        </StarBorder>

        {/* Main Threat Chart */}
        <div className="lg:col-span-2 h-[420px]">
          <ThreatChart />
        </div>
      </div>

      {/* Bottom Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Confidence Distribution */}
        <StarBorder
          as="div"
          className="w-full h-[420px]"
          innerClassName="p-6 flex flex-col h-full bg-[#07070a]/95"
          color="#a855f7"
          speed="8s"
          thickness={1.5}
          backgroundColor="#07070a"
          borderColor="rgba(255, 255, 255, 0.08)"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <BarChart3 size={18} />
            </div>
            <h3 className="text-base font-bold text-white">Confidence Distribution</h3>
          </div>
          <div className="flex-1 w-full bg-[#020204] border border-white/5 rounded-xl p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={confidenceData}
                margin={{ top: 15, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="rgba(255, 255, 255, 0.05)" 
                  vertical={false} 
                />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={tooltipStyle}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }}/>
                <Bar dataKey="threats" name="Threats" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={26} />
                <Bar dataKey="genuine" name="Genuine" fill="#10b981" radius={[4, 4, 0, 0]} barSize={26} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </StarBorder>

        {/* System Performance KPIs */}
        <StarBorder
          as="div"
          className="w-full h-[420px]"
          innerClassName="p-6 flex flex-col h-full bg-[#07070a]/95"
          color="#00e5ff"
          speed="8s"
          thickness={1.5}
          backgroundColor="#07070a"
          borderColor="rgba(255, 255, 255, 0.08)"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-accent/10 border border-accent/30 text-accent">
              <Cpu size={18} />
            </div>
            <h3 className="text-base font-bold text-white">Engine Performance</h3>
          </div>
          
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            <div className="p-4 bg-[#020204] border border-white/5 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-white/70">Average Inference Latency</span>
                <span className="text-base font-black font-mono text-accent">1.24s</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full shadow-[0_0_8px_#00e5ff]" style={{ width: '25%' }}></div>
              </div>
            </div>

            <div className="p-4 bg-[#020204] border border-white/5 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-white/70">False Positive Rate</span>
                <span className="text-base font-black font-mono text-emerald-400">0.8%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]" style={{ width: '8%' }}></div>
              </div>
            </div>

            <div className="p-4 bg-[#020204] border border-white/5 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-white/70">Detection Pipeline Uptime</span>
                <span className="text-base font-black font-mono text-emerald-400">99.99%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
            <span>Model Version: Swaraksha-v2.4</span>
            <button className="text-accent hover:text-cyan-300 font-semibold cursor-pointer">Download Forensic Report</button>
          </div>
        </StarBorder>

      </div>

    </div>
  );
}
