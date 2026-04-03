import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/Card";
import { CalendarCheck, CalendarDays, Calendar as CalendarIcon } from "lucide-react";
import ProgressCharts from "./ProgressCharts";

export default async function ProgressPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [user, tasks] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.userId } }),
    prisma.task.findMany({ where: { user_id: session.userId } })
  ]);

  if (!user) redirect("/login");

  const now = new Date();
  
  // Timestamps
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const sevenDaysAgo = new Date(todayStart);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Last 7 days including today

  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Aggregators
  let todayCompleted = 0;
  let weeklyCompleted = 0;
  let monthlyCompleted = 0;
  
  let totalPending = 0;
  let totalCompleted = 0;

  // Bar Data Mapping Structure (Last 7 Days)
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyMap = new Map<string, number>();
  
  // Initialize trailing 7 days
  for (let i = 6; i >= 0; i--) {
      const d = new Date(todayStart);
      d.setDate(d.getDate() - i);
      weeklyMap.set(daysOfWeek[d.getDay()], 0);
  }

  tasks.forEach((t) => {
      // Pie Chart
      if (t.status === "Completed") totalCompleted++;
      else totalPending++;

      // Date Analytics
      if (t.status === "Completed" && t.completed_at) {
          const completedDateStr = t.completed_at.toDateString();
          const tDate = new Date(t.completed_at);

          // Today
          if (completedDateStr === now.toDateString()) {
              todayCompleted++;
          }
          // Weekly
          if (tDate >= sevenDaysAgo) {
              weeklyCompleted++;
              const dName = daysOfWeek[tDate.getDay()];
              if (weeklyMap.has(dName)) {
                  weeklyMap.set(dName, (weeklyMap.get(dName) || 0) + 1);
              }
          }
          // Monthly
          if (tDate >= currentMonthStart) {
              monthlyCompleted++;
          }
      }
  });

  const weeklyData = Array.from(weeklyMap.entries()).map(([name, count]) => ({ name, count }));
  const pieData = [
      { name: "Pending", value: totalPending },
      { name: "Completed", value: totalCompleted }
  ];

  return (
    <>
      <div className="page-content">
        <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>Analytics</h1>
        <p className="text-muted" style={{ marginBottom: "24px", fontSize: "16px" }}>Track your productivity patterns.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
          
          <Card style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
             <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                 <div style={{ background: "rgba(74, 144, 226, 0.15)", padding: "12px", borderRadius: "12px", color: "var(--primary)" }}>
                     <CalendarCheck size={24} />
                 </div>
                 <span style={{ fontWeight: "700", fontSize: "16px", color: "var(--foreground)"}}>Today Completed</span>
             </div>
             <span style={{ fontWeight: "800", fontSize: "26px", color: "var(--foreground)"}}>{todayCompleted}</span>
          </Card>

          <Card style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
             <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                 <div style={{ background: "rgba(126, 217, 87, 0.15)", padding: "12px", borderRadius: "12px", color: "var(--secondary)" }}>
                     <CalendarDays size={24} />
                 </div>
                 <span style={{ fontWeight: "700", fontSize: "16px", color: "var(--foreground)"}}>Weekly Completed</span>
             </div>
             <span style={{ fontWeight: "800", fontSize: "26px", color: "var(--foreground)"}}>{weeklyCompleted}</span>
          </Card>

          <Card style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
             <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                 <div style={{ background: "var(--surface-hover)", padding: "12px", borderRadius: "12px", color: "var(--text-muted)" }}>
                     <CalendarIcon size={24} />
                 </div>
                 <span style={{ fontWeight: "700", fontSize: "16px", color: "var(--foreground)"}}>Monthly Completed</span>
             </div>
             <span style={{ fontWeight: "800", fontSize: "26px", color: "var(--foreground)"}}>{monthlyCompleted}</span>
          </Card>

        </div>

        <ProgressCharts weeklyData={weeklyData} pieData={pieData} />

      </div>
      <BottomNav />
    </>
  );
}
