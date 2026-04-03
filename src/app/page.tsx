import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card } from "@/components/Card";
import { Brain, Sparkles, Target, BarChart2, CheckCircle2, ListTodo, Activity } from "lucide-react";

export default async function LandingPage() {
  const session = await getSession();
  
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh", display: "flex", flexDirection: "column", color: "var(--foreground)", fontFamily: "var(--font-outfit)" }}>
      {/* 1. HERO SECTION */}
      <div style={{ padding: "40px 24px", textAlign: "center", background: "var(--surface)", borderBottom: "1px solid var(--border)", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
           <div style={{ background: "rgba(74, 144, 226, 0.15)", padding: "12px", borderRadius: "50%", color: "var(--primary)" }}>
              <Brain size={32} />
           </div>
           <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--foreground)", letterSpacing: "-0.5px" }}>FocusFlow AI</h1>
        </div>
        <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "16px", lineHeight: 1.3 }}>
           Stay Focused. Stay Productive.<br/>Built for ADHD Minds.
        </h2>
        <p style={{ fontSize: "16px", color: "var(--text-muted)", marginBottom: "32px", maxWidth: "340px", lineHeight: 1.5 }}>
           The only premium productivity system explicitly designed to reduce overwhelm and boost consistency.
        </p>

        <div style={{ display: "flex", gap: "16px", width: "100%", maxWidth: "340px" }}>
            <Link href="/login" style={{ flex: 1 }}>
                <button style={{ width: "100%", padding: "16px", borderRadius: "var(--radius-lg)", border: "2px solid var(--primary)", background: "transparent", color: "var(--primary)", fontSize: "16px", fontWeight: "700" }}>Login</button>
            </Link>
            <Link href="/login" style={{ flex: 1 }}>
                <button style={{ width: "100%", padding: "16px", borderRadius: "var(--radius-lg)", background: "var(--primary)", border: "2px solid var(--primary)", color: "white", fontSize: "16px", fontWeight: "700" }}>Get Started</button>
            </Link>
        </div>
      </div>

      {/* 2. FEATURES SECTION */}
      <div style={{ padding: "40px 24px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-muted)", textAlign: "center" }}>Everything you need</h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Card style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", textAlign: "center" }}>
                <div style={{ color: "var(--primary)" }}><ListTodo size={28} /></div>
                <span style={{ fontWeight: "700", fontSize: "15px" }}>Task Breakdown</span>
            </Card>
            <Card style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", textAlign: "center" }}>
                <div style={{ color: "var(--secondary)" }}><Target size={28} /></div>
                <span style={{ fontWeight: "700", fontSize: "15px" }}>Focus Timer</span>
            </Card>
            <Card style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", textAlign: "center" }}>
                <div style={{ color: "var(--accent)" }}><BarChart2 size={28} /></div>
                <span style={{ fontWeight: "700", fontSize: "15px" }}>Progress Dash</span>
            </Card>
            <Card style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", textAlign: "center" }}>
                <div style={{ color: "#9B51E0" }}><Sparkles size={28} /></div>
                <span style={{ fontWeight: "700", fontSize: "15px" }}>AI Suggestions</span>
            </Card>
        </div>
      </div>

      {/* 3. HOW IT WORKS */}
      <div style={{ padding: "40px 24px", background: "var(--surface)" }}>
        <h3 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "24px", textAlign: "center" }}>How It Works</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {[
                { step: "1", title: "Add Task", desc: "Dump your thoughts straight into the app." },
                { step: "2", title: "Break into Steps", desc: "Use AI to split tasks into tiny actions." },
                { step: "3", title: "Focus Mode", desc: "Start the Pomodoro timer." },
                { step: "4", title: "Track Progress", desc: "Watch your streak flame grow." }
            ].map((item) => (
                <div key={item.step} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(74, 144, 226, 0.15)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "18px", flexShrink: 0 }}>
                        {item.step}
                    </div>
                    <div>
                        <h4 style={{ fontWeight: "700", fontSize: "16px", marginBottom: "4px" }}>{item.title}</h4>
                        <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>{item.desc}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* 4. ADHD FOCUSED SECTION */}
      <div style={{ padding: "48px 24px", textAlign: "center", background: "rgba(126, 217, 87, 0.05)" }}>
         <div style={{ display: "inline-flex", background: "var(--secondary)", color: "white", padding: "8px 16px", borderRadius: "var(--radius-round)", fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px" }}>
            Designed for ADHD Users
         </div>
         <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-start", maxWidth: "340px", margin: "0 auto", textAlign: "left" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <CheckCircle2 color="var(--secondary)" size={20} />
                <span style={{ fontWeight: "600" }}>Reduces overwhelm dynamically</span>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <CheckCircle2 color="var(--secondary)" size={20} />
                <span style={{ fontWeight: "600" }}>Improves productivity</span>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <CheckCircle2 color="var(--secondary)" size={20} />
                <span style={{ fontWeight: "600" }}>Simple and distraction-free UI</span>
            </div>
         </div>
      </div>

      {/* 5. CALL TO ACTION */}
      <div style={{ padding: "64px 24px", textAlign: "center", background: "var(--surface)", borderTop: "1px solid var(--border)", marginBottom: "40px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "24px" }}>Start Your Focus Journey Today</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "340px", margin: "0 auto" }}>
            <Link href="/login" style={{ width: "100%" }}>
                <button className="btn-primary" style={{ padding: "18px" }}>Sign Up Free</button>
            </Link>
            <Link href="/login" style={{ width: "100%" }}>
                <button style={{ width: "100%", padding: "18px", borderRadius: "var(--radius-lg)", border: "none", background: "var(--surface-hover)", color: "var(--foreground)", fontSize: "16px", fontWeight: "700" }}>Login to your account</button>
            </Link>
        </div>
      </div>
    
    </div>
  );
}
