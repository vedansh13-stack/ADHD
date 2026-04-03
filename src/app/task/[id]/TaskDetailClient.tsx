"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import BottomNav from "@/components/BottomNav";
import { CheckCircle2, Circle, Bot, Plus, ArrowLeft, Loader2, CheckSquare, Square } from "lucide-react";

export default function TaskDetailClient({ task }: { task: any }) {
  const router = useRouter();
  const [subtasks, setSubtasks] = useState<any[]>([]);
  const [newStep, setNewStep] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [completeLoading, setCompleteLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  const fetchSubtasks = useCallback(async () => {
    try {
      const res = await fetch(`/api/tasks/${task.id}/subtasks`);
      const data = await res.json();
      if (res.ok) {
        setSubtasks(data);
      }
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [task.id]);

  useEffect(() => {
    fetchSubtasks();
  }, [fetchSubtasks]);

  const triggerCompletionSuccess = () => {
      setShowToast(true);
      setTimeout(() => {
         router.push("/dashboard");
         router.refresh();
      }, 2000);
  };

  const handleToggleSubtask = async (subtaskId: number, currentStatus: string) => {
    const newStatus = currentStatus === "Completed" ? "Pending" : "Completed";
    setSubtasks(prev => prev.map(s => s.id === subtaskId ? { ...s, status: newStatus } : s));

    try {
      const res = await fetch(`/api/subtasks/${subtaskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.taskStatusChanged && data.allCompleted) {
           triggerCompletionSuccess();
        } else if (data.taskStatusChanged) {
           router.refresh();
        }
      } else {
        setSubtasks(prev => prev.map(s => s.id === subtaskId ? { ...s, status: currentStatus } : s));
      }
    } catch(e) {
      setSubtasks(prev => prev.map(s => s.id === subtaskId ? { ...s, status: currentStatus } : s));
    }
  };

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStep.trim()) return;
    setAddLoading(true);

    try {
      const res = await fetch(`/api/tasks/${task.id}/subtasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subtask_name: newStep })
      });
      if (res.ok) {
        setNewStep("");
        await fetchSubtasks();
        router.refresh();
      }
    } catch(e) {
      console.error(e);
    } finally {
      setAddLoading(false);
    }
  };

  const handleAIBreakdown = async () => {
    setAiLoading(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}/ai-breakdown`, { method: "POST" });
      if (res.ok) {
        await fetchSubtasks();
        router.refresh();
      }
    } catch(e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCompleteMasterTask = async () => {
    setErrorMsg("");
    setCompleteLoading(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Completed" })
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "An error occurred");
      } else {
        triggerCompletionSuccess();
      }
    } catch(e) {
      setErrorMsg("Network error");
    } finally {
      setCompleteLoading(false);
    }
  };

  return (
    <>
      <div className="page-content">
        <button onClick={() => router.push("/dashboard")} style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "var(--text-muted)", fontSize: "15px", fontWeight: "600", cursor: "pointer", marginBottom: "20px" }}>
          <ArrowLeft size={18} /> BACK
        </button>

        <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px", lineHeight: 1.2 }}>{task.task_name}</h1>
        
        <div style={{ display: "flex", gap: "12px", marginBottom: "32px", alignItems: "center" }}>
           {task.priority && (
              <span style={{ fontSize: "13px", background: "var(--surface-hover)", padding: "4px 12px", borderRadius: "var(--radius-round)", fontWeight: "600", color: "var(--text-muted)" }}>
                {task.priority} Priority
              </span>
            )}
            <span style={{ fontSize: "13px", color: task.status === "Completed" ? "var(--secondary)" : "var(--primary)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {task.status}
            </span>
        </div>

        {subtasks.length === 0 && !loading && (
          <button 
            onClick={handleAIBreakdown}
            disabled={aiLoading}
            style={{ width: "100%", padding: "18px", background: "rgba(74, 144, 226, 0.1)", color: "var(--primary)", border: "2px dashed var(--primary)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginBottom: "32px", transition: "all 0.2s ease" }}
            onMouseOver={(e) => (e.currentTarget.style.background = "rgba(74, 144, 226, 0.15)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "rgba(74, 144, 226, 0.1)")}
          >
            {aiLoading ? <Loader2 className="spin" size={20} /> : <Bot size={20} />}
            {aiLoading ? "Generating breakdown..." : "Break Task with AI"}
          </button>
        )}

        <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px", color: "var(--foreground)" }}>Checklist</h2>
        
        {loading ? (
            <p className="text-muted" style={{ textAlign: "center", padding: "20px 0" }}>Loading subtasks...</p>
        ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
            {subtasks.map((subtask) => {
                const isComplete = subtask.status === "Completed";
                return (
                  <Card 
                    key={subtask.id} 
                    className="flex-center" 
                    style={{ justifyContent: "flex-start", gap: "16px", padding: "18px 20px", marginBottom: "0", opacity: isComplete ? 0.6 : 1, transition: "opacity 0.2s ease, transform 0.2s ease" }}
                    onClick={() => handleToggleSubtask(subtask.id, subtask.status)}
                  >
                    <div style={{ cursor: "pointer", color: isComplete ? "var(--secondary)" : "var(--border)" }}>
                      {isComplete ? <CheckCircle2 fill="var(--secondary)" color="white" size={26} className="check-icon checked" /> : <Circle size={26} className="check-icon" />}
                    </div>
                    <div style={{ flex: 1, textDecoration: isComplete ? "line-through" : "none", color: isComplete ? "var(--text-muted)" : "var(--foreground)", transition: "color 0.2s ease" }}>
                      <p style={{ fontWeight: "500", fontSize: "16px" }}>{subtask.subtask_name}</p>
                    </div>
                  </Card>
                )
            })}
            </div>
        )}

        <form onSubmit={handleAddSubtask} style={{ display: "flex", gap: "12px", marginBottom: "32px", padding: "16px", background: "var(--surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
            <input 
              type="text" 
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
              placeholder="Add a small step..."
              style={{ flex: 1, padding: "8px 0", border: "none", background: "transparent", color: "var(--foreground)", outline: "none", fontSize: "16px", fontWeight: "500" }}
            />
            <button type="submit" disabled={addLoading || !newStep.trim()} style={{ background: "var(--primary)", color: "white", width: "40px", height: "40px", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.1s" }}>
                <Plus size={20} />
            </button>
        </form>

        {errorMsg && (
          <div style={{ background: "rgba(255, 107, 107, 0.1)", color: "var(--danger)", padding: "14px", borderRadius: "var(--radius-sm)", marginBottom: "20px", textAlign: "center", fontWeight: "600", fontSize: "14px", border: "1px solid rgba(255, 107, 107, 0.2)" }}>
            {errorMsg}
          </div>
        )}

        <button 
          onClick={handleCompleteMasterTask}
          disabled={completeLoading || task.status === "Completed"}
          className="btn-primary"
          style={{ 
            background: task.status === "Completed" ? "var(--surface-hover)" : "var(--foreground)", 
            color: task.status === "Completed" ? "var(--text-muted)" : "white", 
            opacity: task.status === "Completed" ? 0.7 : 1,
            padding: "18px"
          }}
        >
          {completeLoading ? <Loader2 className="spin" size={20} /> : <CheckSquare size={20} />}
          {task.status === "Completed" ? "Already Completed" : "Complete Task"}
        </button>

      </div>

      {showToast && (
        <div className="toast">
           <span style={{ fontSize: "20px" }}>✅</span>
           <span>Task Completed!</span>
        </div>
      )}

      <BottomNav />
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}} />
    </>
  );
}
