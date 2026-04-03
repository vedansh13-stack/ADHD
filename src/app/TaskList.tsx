"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, Circle } from "lucide-react";
import { Card } from "@/components/Card";

export default function TaskList({ initialTasks }: { initialTasks: any[] }) {
  const router = useRouter();

  if (initialTasks.length === 0) {
    return <p className="text-muted" style={{ textAlign: "center", marginTop: "40px", fontSize: "15px" }}>No tasks yet. Start small and add one.</p>;
  }

  const getBadgeStyle = (priority: string) => {
    switch (priority) {
      case "High": return { background: "var(--badge-high)", color: "var(--badge-high-text)" };
      case "Medium": return { background: "var(--badge-medium)", color: "var(--badge-medium-text)" };
      case "Low": return { background: "var(--badge-low)", color: "var(--badge-low-text)" };
      default: return { background: "var(--surface-hover)", color: "var(--text-muted)" };
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", paddingBottom: "24px" }}>
      {initialTasks.map((task: any) => {
        const isComplete = task.status === "Completed";
        const badgeStyle = getBadgeStyle(task.priority);

        return (
          <Card
            key={task.id}
            onClick={() => router.push(`/task/${task.id}`)}
            style={{ 
              padding: "20px", 
              display: "flex", 
              alignItems: "center", 
              gap: "16px",
              opacity: isComplete ? 0.6 : 1,
              transition: "transform 0.2s ease, opacity 0.3s ease"
            }}
          >
            <div style={{ color: isComplete ? "var(--secondary)" : "var(--border)", transition: "color 0.2s ease" }}>
              {isComplete ? <CheckCircle2 fill="var(--secondary)" color="white" size={28} className="check-icon checked" /> : <Circle size={28} className="check-icon" />}
            </div>
            
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
              <p style={{ 
                fontWeight: "600", 
                fontSize: "17px", 
                color: isComplete ? "var(--text-muted)" : "var(--foreground)",
                textDecoration: isComplete ? "line-through" : "none",
                transition: "color 0.2s ease"
              }}>
                {task.task_name}
              </p>
              
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                {task.priority && (
                  <span style={{ 
                    ...badgeStyle,
                    fontSize: "12px", 
                    padding: "4px 10px", 
                    borderRadius: "var(--radius-round)", 
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>
                    {task.priority}
                  </span>
                )}
                {task.subtasks && task.subtasks.length > 0 && (
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "500" }}>
                    {task.subtasks.filter((s:any) => s.status === "Completed").length}/{task.subtasks.length} steps
                  </span>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
