"use client";

import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import { Play, Pause, RotateCcw, PartyPopper, CheckCircle2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const messages = [
  "Stay focused 💪",
  "You're doing great 🔥",
  "Keep going 🚀",
  "Just a little more!"
];

export default function FocusPage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  
  const [pendingTasks, setPendingTasks] = useState<any[]>([]);
  const [taskIndex, setTaskIndex] = useState(0);
  const [completionError, setCompletionError] = useState("");

  const currentTask = pendingTasks.length > 0 ? pendingTasks[taskIndex] : null;

  useEffect(() => {
    fetch('/api/tasks')
      .then(r => r.json())
      .then(data => {
        if(Array.isArray(data)){
          setPendingTasks(data.filter(t => t.status !== 'Completed'));
        }
      })
      .catch(e => console.error(e));
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setSessionComplete(true);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (!isActive || timeLeft === 0) return;
    const msgInterval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 4000); 
    return () => clearInterval(msgInterval);
  }, [isActive, timeLeft]);

  function startTimer() {
    setIsActive(true);
    setSessionComplete(false);
    setCompletionError("");
  }

  function pauseTimer() {
    setIsActive(false);
  }

  function resetTimer() {
    setIsActive(false);
    setTimeLeft(25 * 60);
    setSessionComplete(false);
    setCompletionError("");
  }

  async function markTaskDone() {
    if(!currentTask) return;
    setIsActive(false);
    setCompletionError("");

    try {
      const res = await fetch(`/api/tasks/${currentTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Completed" })
      });
      const data = await res.json();
      
      if (!res.ok) {
         setCompletionError(data.error || "Failed to complete task.");
         return;
      }
      
      setSessionComplete(true); 
      setPendingTasks(prev => prev.filter(t => t.id !== currentTask.id));
      if (taskIndex >= pendingTasks.length - 1) {
          setTaskIndex(0);
      }
      router.refresh();

    } catch (e) {
      setCompletionError("Network error.");
    }
  }

  function nextTask() {
    setCompletionError("");
    if (pendingTasks.length === 0) return;
    setTaskIndex((prev) => (prev + 1) % pendingTasks.length);
  }

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");
  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #F0F7FF 0%, #D9EBFF 100%)", color: "var(--foreground)", minHeight: "100vh", position: "absolute", inset: 0, paddingBottom: "80px", fontFamily: "var(--font-outfit)", overflow: "hidden" }}>
        
        <div style={{ marginBottom: "20px", textAlign: "center", padding: "0 20px" }}>
            <p style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-muted)", fontWeight: "700", marginBottom: "8px" }}>Focus On</p>
            <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--primary)", lineHeight: 1.2 }}>
                {currentTask ? currentTask.task_name : "No pending tasks! 🎉"}
            </h1>
        </div>
        
        <div style={{ height: "30px", marginBottom: "32px" }}>
            <p key={msgIndex} className={isActive ? "animate-switch" : ""} style={{ fontSize: "16px", color: "#5A738E", textAlign: "center", fontWeight: "600" }}>
                {isActive ? messages[msgIndex] : "Start focusing on your task 💪"}
            </p>
        </div>

        <div style={{ position: "relative", width: "220px", height: "220px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "40px", filter: "drop-shadow(0 20px 40px rgba(74, 144, 226, 0.15))" }}>
           <div className="progress-ring" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, borderRadius: "50%", background: `conic-gradient(var(--primary) ${progress}%, rgba(255,255,255,0.6) ${progress}%)`, transition: "background 1s linear" }} />
           <div style={{ position: "absolute", top: 10, left: 10, right: 10, bottom: 10, borderRadius: "50%", background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)", boxShadow: "inset 0 4px 10px rgba(0,0,0,0.03)" }} />
           
           <span style={{ fontSize: "56px", fontWeight: "700", zIndex: 1, fontVariantNumeric: "tabular-nums", letterSpacing: "-1px", color: "var(--primary)" }}>
             {minutes}:{seconds}
           </span>
        </div>

        {completionError && (
            <div style={{ background: "rgba(255, 107, 107, 0.1)", color: "var(--danger)", padding: "12px", borderRadius: "8px", fontWeight: "600", fontSize: "14px", marginBottom: "20px", textAlign: "center", maxWidth: "340px" }}>
                {completionError}
            </div>
        )}

        <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "24px" }}>
          {!isActive ? (
             <button onClick={startTimer} style={{ padding: "16px 28px", fontSize: "15px", fontWeight: "700", background: "var(--primary)", color: "white", border: "none", borderRadius: "100px", boxShadow: "0 8px 24px rgba(74,144,226,0.3)", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", transition: "transform 0.1s" }} onMouseOver={e=>e.currentTarget.style.transform="scale(0.95)"} onMouseOut={e=>e.currentTarget.style.transform="scale(1)"}>
                <Play size={18} fill="white"/> Start
             </button>
          ) : (
             <button onClick={pauseTimer} style={{ padding: "16px 28px", fontSize: "15px", fontWeight: "700", background: "var(--secondary)", color: "white", border: "none", borderRadius: "100px", boxShadow: "0 8px 24px rgba(126,217,87,0.3)", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", transition: "transform 0.1s" }} onMouseOver={e=>e.currentTarget.style.transform="scale(0.95)"} onMouseOut={e=>e.currentTarget.style.transform="scale(1)"}>
                <Pause size={18} fill="white"/> Pause
             </button>
          )}

          <button onClick={resetTimer} style={{ padding: "16px", background: "white", color: "var(--text-muted)", border: "none", borderRadius: "100px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", fontSize: "15px", cursor: "pointer", transition: "transform 0.1s" }} onMouseOver={e=>e.currentTarget.style.transform="scale(0.95)"} onMouseOut={e=>e.currentTarget.style.transform="scale(1)"}>
             <RotateCcw size={18} /> Reset
          </button>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button onClick={markTaskDone} style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: "8px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", color: "var(--foreground)", fontWeight: "600", fontSize: "15px", boxShadow: "var(--shadow-sm)", transition: "all 0.2s" }} onMouseOver={e=>(e.currentTarget.style.borderColor="var(--secondary)", e.currentTarget.style.color="var(--secondary)")} onMouseOut={e=>(e.currentTarget.style.borderColor="var(--border)", e.currentTarget.style.color="var(--foreground)")}>
                <CheckCircle2 size={18} /> Mark Task Done
            </button>
            
            <button onClick={nextTask} style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: "8px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", color: "var(--text-muted)", fontWeight: "600", fontSize: "15px", boxShadow: "var(--shadow-sm)", transition: "all 0.2s" }} onMouseOver={e=>(e.currentTarget.style.color="var(--primary)")} onMouseOut={e=>(e.currentTarget.style.color="var(--text-muted)")}>
                Next Task <ArrowRight size={18} />
            </button>
        </div>

      </div>

      {sessionComplete && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "white", padding: "40px", borderRadius: "32px", textAlign: "center", width: "85%", maxWidth: "340px", boxShadow: "0 30px 60px rgba(0,0,0,0.2)", animation: "popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}>
             <div style={{ background: "rgba(255, 179, 71, 0.1)", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                 <PartyPopper size={40} color="#FFB347" />
             </div>
             
             <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "12px", color: "var(--foreground)"}}>Session Complete!</h2>
             <p style={{ fontSize: "16px", color: "var(--text-muted)", marginBottom: "32px", lineHeight: 1.5 }}>
               🎉 Focus session complete! Take a short break.
             </p>
             <button onClick={() => { resetTimer(); if (pendingTasks.length > 0) nextTask(); }} className="btn-primary" style={{ width: "100%", padding: "18px", borderRadius: "100px", fontSize: "16px" }}>Take a 5-Min Break</button>
          </div>
        </div>
      )}

      <BottomNav />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeSwitch { 
          0% { opacity: 0; transform: translateY(6px); } 
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-6px); }
        }
        .animate-switch {
          animation: fadeSwitch 4s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.8) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}} />
    </>
  );
}
