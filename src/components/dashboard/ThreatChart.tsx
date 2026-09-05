"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

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
    <div className="skeuo-card p-6 flex flex-col h-full min-h-[300px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Threats Over Time</h3>
        <select className="skeuo-inset text-xs rounded-lg px-3 py-1.5 focus:outline-none text-foreground border-none">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
        </select>
      </div>
      <div className="flex-1 w-full h-full min-h-[200px] skeuo-inset p-4 rounded-xl">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(51, 65, 85, 0.4)" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(51, 65, 85, 0.5)', borderRadius: '8px' }}
              itemStyle={{ fontSize: '14px' }}
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
