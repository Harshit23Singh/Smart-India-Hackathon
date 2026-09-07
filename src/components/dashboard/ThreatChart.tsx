"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useEffect, useState } from "react";

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
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <div className="skeuo-card p-6 flex flex-col h-full min-h-[300px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Threats Over Time</h3>
        <select className="skeuo-inset text-xs rounded-lg px-3 py-1.5 focus:outline-none text-foreground border-none cursor-pointer">
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
        </select>
      </div>
      <div className="flex-1 w-full h-full min-h-[200px] skeuo-inset p-4 rounded-xl">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.07)"} 
              vertical={false} 
            />
            <XAxis dataKey="name" stroke={isDark ? "#94a3b8" : "#64748b"} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={isDark ? "#94a3b8" : "#64748b"} fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDark ? '#2b2d31' : '#ffffff', 
                borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)', 
                borderRadius: '10px',
                color: isDark ? '#e0e2e5' : '#1c222b',
                boxShadow: isDark ? '0 10px 25px rgba(0,0,0,0.5)' : '0 10px 25px rgba(0,0,0,0.1)'
              }}
              itemStyle={{ fontSize: '13px' }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
            <Line type="monotone" name="Threats Detected" dataKey="threats" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            <Line type="monotone" name="Genuine Voices" dataKey="genuine" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
