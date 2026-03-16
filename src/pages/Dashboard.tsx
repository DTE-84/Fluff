import React, { useState, useEffect } from 'react';
import { Cloud, Wind, TrendingUp, Target, Flag, CircleDot, Ghost } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';

interface DashboardProps {
  stats: any;
  handicap: number;
}

// Sub-component for the 4 stat blocks
function StatCard({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="rounded-[18px] p-4 flex flex-col gap-2" style={{ background: "#141418" }}>
      <Icon className="w-5 h-5 text-[#30C476] opacity-60" />
      <p className="text-[9px] uppercase tracking-[0.18em] text-[#4A4A5A] font-bold">{label}</p>
      <p className="text-xl font-mono text-[#FCF6EB]">{value}</p>
    </div>
  );
}

export default function Dashboard({ stats, handicap }: DashboardProps) {
  // PREMIUM UPGRADE: Dynamic Weather & Wind Simulation
  const [weather, setWeather] = useState("");
  const [wind, setWind] = useState("");

  useEffect(() => {
    // Generates a temp between 68 and 83, and picks a random condition
    const temp = 68 + Math.floor(Math.random() * 15);
    const conditions = ["Sunny", "Partly Cloudy", "Clear"];
    setWeather(`${temp}°F • ${conditions[Math.floor(Math.random() * 3)]}`);

    // Generates wind between 3 and 14 mph, and a random direction
    const windSpeed = Math.floor(Math.random() * 12) + 3;
    const directions = ["N", "NW", "W", "SW", "S", "SE", "E", "NE"];
    setWind(`${windSpeed} mph ${directions[Math.floor(Math.random() * 8)]}`);
  }, []);

  const chartData = [
    { name: "FIR", value: stats.fir, color: "#30C476" },
    { name: "GIR", value: stats.gir, color: "#6EEEA8" },
    { name: "Putts", value: stats.putts, color: "#059669" },
    { name: "Lost", value: stats.ballsLost, color: "#EF4444" }
  ];

  return (
    <div className="space-y-4 pt-1">
      {/* Weather & Wind Row */}
      <div className="flex gap-3">
        <div className="flex-1 rounded-[18px] p-4 flex items-center gap-3" style={{ background: "#141418" }}>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <Cloud className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#4A4A5A]">Weather</p>
            <p className="text-sm font-semibold text-[#FCF6EB]">{weather}</p>
          </div>
        </div>

        <div className="flex-1 rounded-[18px] p-4 flex items-center gap-3" style={{ background: "#141418" }}>
          <div className="w-10 h-10 rounded-xl bg-[#30C476]/10 flex items-center justify-center flex-shrink-0">
            <Wind className="w-5 h-5 text-[#30C476]" />
          </div>
          <div>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#4A4A5A]">Wind</p>
            <p className="text-sm font-semibold text-[#FCF6EB]">{wind}</p>
          </div>
        </div>
      </div>

      {/* Handicap Card */}
      <div className="rounded-[22px] p-7 relative overflow-hidden" style={{ background: "#141418" }}>
        <div className="absolute top-0 right-0 p-5 opacity-[0.06]">
          <TrendingUp className="w-28 h-28 text-[#FCF6EB]" />
        </div>
        <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#4A4A5A] mb-3">Verified Handicap</p>
        <h2 className="text-6xl font-serif italic text-[#FCF6EB] leading-none">
          {handicap > 0 ? `+${handicap}` : Math.abs(handicap)}
        </h2>
        <div className="mt-4 flex items-center gap-2 text-[#30C476] text-xs font-bold">
          <TrendingUp className="w-4 h-4" />
          <span>Synchronizing live course telemetry...</span>
        </div>
      </div>

      {/* Core Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Target} label="FIR" value={`${stats.fir}%`} />
        <StatCard icon={Flag} label="GIR" value={`${stats.gir}%`} />
        <StatCard icon={CircleDot} label="Putts/H" value={stats.putts.toString()} />
        <StatCard icon={Ghost} label="Up & Down" value={`${stats.upAndDowns}%`} />
      </div>

      {/* Analytics Chart */}
      <div className="rounded-[22px] p-6" style={{ background: "#141418" }}>
        <h3 className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#4A4A5A] mb-6">Kinetic Performance Analytics</h3>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#4A4A5A", fontSize: 10, fontFamily: "JetBrains Mono" }} />
              <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} contentStyle={{ backgroundColor: "#1E1E26", border: "none", borderRadius: "10px", color: "#FCF6EB", fontSize: 11 }} />
              <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}