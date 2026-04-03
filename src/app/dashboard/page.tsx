import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/Card";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";
import { Flame, Play } from "lucide-react";
import TaskList from "@/app/TaskList";
import LogoutButton from "@/components/LogoutButton";

export default async function Home() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!user) {
    redirect("/login");
  }

  // Get tasks for today
  const tasks = await prisma.task.findMany({
    where: { user_id: session.userId },
    orderBy: { id: "desc" },
  });

  const completedToday = tasks.filter((t: any) => t.status === "Completed" && t.completed_at?.toDateString() === new Date().toDateString());

  return (
    <>
      <div className="page-content">
        
        {/* HERO CARD */}
        <Card style={{ background: "var(--primary)", color: "white", border: "none", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
            <div>
              <p style={{ fontSize: "14px", opacity: 0.9, marginBottom: "4px" }}>Good Morning 👋</p>
              <h1 style={{ fontSize: "28px", fontWeight: "700", lineHeight: 1.2 }}>{user.name}</h1>
              <LogoutButton />
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", background: "rgba(255,255,255,0.15)", padding: "10px 14px", borderRadius: "var(--radius-lg)", backdropFilter: "blur(10px)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Flame color="#FFB347" size={22} fill="#FFB347" />
                <span style={{ fontWeight: "700", fontSize: "20px" }}>{user.streak}</span>
              </div>
              <span style={{ fontSize: "10px", opacity: 0.9, marginTop: "2px", letterSpacing: "0.5px", textTransform: "uppercase" }}>Days Active</span>
            </div>
          </div>
          <p style={{ fontSize: "15px", opacity: 0.95 }}>Let’s stay focused today 💪 Consistency is key.</p>
        </Card>

        {completedToday.length >= 3 && (
            <div style={{ background: "rgba(126, 217, 87, 0.15)", color: "var(--secondary)", padding: "14px", borderRadius: "var(--radius-sm)", fontWeight: "600", fontSize: "14px", textAlign: "center" }}>
              🔥 Great job! You're extremely productive today!
            </div>
        )}
        
        {tasks.length > 0 && completedToday.length === 0 && (
            <div style={{ background: "rgba(74, 144, 226, 0.15)", color: "var(--primary)", padding: "14px", borderRadius: "var(--radius-sm)", fontWeight: "600", fontSize: "14px", textAlign: "center" }}>
              ⚠️ You haven’t completed any tasks today. Start small!
            </div>
        )}

        <Link href="/focus" style={{ display: "block" }}>
          <button className="btn-primary" style={{ padding: "18px" }}>
             Start Focus Mode <Play size={18} fill="white" />
          </button>
        </Link>

        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px", color: "var(--foreground)" }}>Today's Tasks</h2>
          <TaskList initialTasks={tasks} />
        </div>

      </div>
      <BottomNav />
    </>
  );
}
