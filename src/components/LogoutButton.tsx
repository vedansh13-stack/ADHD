"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setShowToast(true);
      setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 1500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <button 
        onClick={handleLogout}
        style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "6px", 
            background: "rgba(255,255,255,0.2)", 
            color: "white", 
            border: "none", 
            padding: "8px 12px", 
            borderRadius: "var(--radius-round)",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            marginTop: "12px",
            backdropFilter: "blur(4px)"
        }}
      >
        <LogOut size={16} /> Logout 🚪
      </button>

      {showToast && (
        <div className="toast">
           <span style={{ fontSize: "20px" }}>👋</span>
           <span>Logged out successfully</span>
        </div>
      )}
    </>
  );
}
