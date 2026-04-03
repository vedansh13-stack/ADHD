"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/Card";
import { Plus } from "lucide-react";

export default function AddTask() {
  const router = useRouter();
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) {
       setErrorMsg("Please enter a task name.");
       return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_name: taskName, priority }),
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setErrorMsg("Failed to add task.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-content">
        <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>New Task</h1>
        <p className="text-muted" style={{ marginBottom: "24px", fontSize: "16px" }}>What's the one thing you need to do?</p>

        <Card style={{ padding: "24px" }}>
          {errorMsg && (
             <div style={{ background: "rgba(255, 107, 107, 0.1)", color: "var(--danger)", padding: "12px", borderRadius: "8px", marginBottom: "20px", textAlign: "center", fontWeight: "600", fontSize: "14px" }}>
               {errorMsg}
             </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "10px", fontWeight: "600", fontSize: "14px", color: "var(--foreground)" }}>Task Name</label>
              <input
                type="text"
                placeholder="E.g., Read chapter 1 of Biology"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "var(--radius-sm)",
                  border: "2px solid var(--border)",
                  background: "var(--surface)",
                  color: "var(--foreground)",
                  fontSize: "16px",
                  outline: "none",
                  transition: "border-color 0.2s ease"
                }}
                onFocus={e => e.target.style.borderColor = "var(--primary)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "10px", fontWeight: "600", fontSize: "14px", color: "var(--foreground)" }}>Priority</label>
              <div style={{ display: "flex", gap: "12px" }}>
                {["Low", "Medium", "High"].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setPriority(lvl)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "var(--radius-sm)",
                      border: "2px solid",
                      borderColor: priority === lvl ? "var(--primary)" : "var(--border)",
                      background: priority === lvl ? "rgba(74, 144, 226, 0.05)" : "var(--surface)",
                      color: priority === lvl ? "var(--primary)" : "var(--text-muted)",
                      fontWeight: "600",
                      fontSize: "14px",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ marginTop: "12px", padding: "18px" }}
            >
              {loading ? "Adding..." : (
                <>Create Task <Plus size={20} /></>
              )}
            </button>
          </form>
        </Card>
      </div>
      <BottomNav />
    </>
  );
}
