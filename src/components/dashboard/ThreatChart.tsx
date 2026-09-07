"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import StarBorder from "@/components/ui/StarBorder";
import { BarChart3 } from "lucide-react";

const data = [
  { name: 'Mon', threats: 18, genuine: 120 },
  { name: 'Tue', threats: 14, genuine: 132 },
  { name: 'Wed', threats: 25, genuine: 145 },
  { name: 'Thu', threats: 34, genuine: 160 },
  { name: 'Fri', threats: 22, genuine: 155 },
  { name: 'Sat', threats: 30, genuine: 125 },
  { name: 'Sun', threats: 18, genuine: 110 },
];

export default function ThreatChart() {
  return (
    <StarBorder
      as="div"
      className="w-full h-full min-h-[300px]"
      innerClassName="p-6 flex flex-col h-full bg-[#07070a]/95"
      color="#3b82f6"
      speed="8s"
      thickness={1.5}
      backgroundColor="#07070a"
      borderColor="rgba(255, 255, 255, 0.08)"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <BarChart3 size={18} />
          </div>
          <h3 className="text-base font-bold text-white">Threats Over Time</h3>
        </div>
        
        <select className="bg-black/60 border border-white/10 text-xs rounded-lg px-3 py-1.5 text-white/80 focus:outline-none focus:border-accent cursor-pointer">
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
        </select>
      </div>

      <div className="flex-1 w-full h-full min-h-[220px] bg-[#020204] border border-white/5 rounded-xl p-3 shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255, 255, 255, 0.05)" 
              vertical={false} 
            />
            <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#07070a', 
                borderColor: 'rgba(255, 255, 255, 0.15)', 
                borderRadius: '12px',
                color: '#f8fafc',
                boxShadow: '0 10px 30px rgba(0,0,0,0.9)',
                padding: '10px 14px'
              }}
              itemStyle={{ fontSize: '12px', fontWeight: 600 }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}/>
            <Line 
              type="monotone" 
              name="Threats Detected" 
              dataKey="threats" 
              stroke="#ef4444" 
              strokeWidth={3} 
              dot={{ r: 4, strokeWidth: 2, fill: '#07070a', stroke: '#ef4444' }} 
              activeDot={{ r: 6, fill: '#ef4444' }} 
            />
            <Line 
              type="monotone" 
              name="Genuine Voices" 
              dataKey="genuine" 
              stroke="#00e5ff" 
              strokeWidth={3} 
              dot={{ r: 4, strokeWidth: 2, fill: '#07070a', stroke: '#00e5ff' }} 
              activeDot={{ r: 6, fill: '#00e5ff' }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </StarBorder>
  );
}
