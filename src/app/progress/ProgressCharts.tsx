"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Card } from "@/components/Card";

interface ChartProps {
  weeklyData: { name: string; count: number }[];
  pieData: { name: string; value: number }[];
}

export default function ProgressCharts({ weeklyData, pieData }: ChartProps) {
  const COLORS = ["#4A90E2", "#7ED957"];

  if (!weeklyData || weeklyData.length === 0 || !pieData || pieData.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", paddingBottom: "24px" }}>
      
      {/* BAR CHART SECTION */}
      <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--foreground)", paddingLeft: "4px" }}>7-Day Activity</h2>
      <Card style={{ padding: "24px", paddingBottom: "24px", paddingTop: "40px" }}>
        <div style={{ height: "300px", width: "100%", minHeight: "300px" }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: "var(--text-muted)" }} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: "var(--text-muted)" }} 
                allowDecimals={false}
              />
              <Tooltip 
                cursor={{ fill: "var(--surface-hover)", radius: 8 }} 
                contentStyle={{ borderRadius: "12px", border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}
              />
              <Bar 
                dataKey="count" 
                fill="var(--primary)" 
                radius={[6, 6, 6, 6]} 
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* PIE CHART SECTION */}
      <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--foreground)", paddingLeft: "4px" }}>Task Status Make-up</h2>
      <Card style={{ padding: "24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ height: "300px", width: "100%", minHeight: "300px" }}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={70}
                outerRadius={100}
                paddingAngle={6}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: "12px", border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle" 
                wrapperStyle={{ fontSize: "14px", fontWeight: "600", color: "var(--text-muted)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

    </div>
  );
}
