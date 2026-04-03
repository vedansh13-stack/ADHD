"use client";

import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/Card";
import { Bot, Sparkles, Loader2 } from "lucide-react";

export default function AIPage() {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetSuggestion = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai");
      const data = await res.json();
      setSuggestion(data.suggestion);
    } catch (e) {
      console.error(e);
      setSuggestion("Take a deep breath and start with the smallest possible step.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-content" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", position: "absolute", inset: 0, paddingBottom: "80px", background: "var(--background)" }}>
        
        <div style={{ textAlign: "center", marginBottom: "40px", padding: "0 20px" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                <div style={{ background: "rgba(74, 144, 226, 0.15)", padding: "20px", borderRadius: "50%", color: "var(--primary)" }}>
                    <Bot size={48} />
                </div>
            </div>
            <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "12px", color: "var(--foreground)" }}>AI Copilot</h1>
            <p style={{ fontSize: "16px", color: "var(--text-muted)", lineHeight: 1.5 }}>
              Feeling overwhelmed? Let the AI suggest a micro-habit or productivity strategy optimized for ADHD.
            </p>
        </div>

        <button 
          className="btn-primary" 
          onClick={handleGetSuggestion} 
          disabled={loading}
          style={{ width: "80%", padding: "20px", fontSize: "18px", borderRadius: "var(--radius-round)", boxShadow: "var(--shadow-md)" }}
        >
          {loading ? (
             <><Loader2 className="spin" size={24} /> Analyzing...</>
          ) : (
             <><Sparkles size={24} /> Get AI Suggestion</>
          )}
        </button>

        {suggestion && !loading && (
          <Card style={{ margin: "40px 20px 0", borderLeft: "4px solid var(--primary)", animation: "slideUpFade 0.5s ease" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px", color: "var(--foreground)" }}>Latest Strategy</h3>
            <p style={{ fontSize: "16px", color: "var(--text-muted)", lineHeight: 1.6 }}>"{suggestion}"</p>
          </Card>
        )}

      </div>
      <BottomNav />
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}} />
    </>
  );
}
