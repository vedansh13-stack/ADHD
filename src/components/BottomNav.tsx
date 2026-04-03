"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusSquare, Brain, BarChart2, Sparkles } from "lucide-react";
import styles from "./BottomNav.module.css";

export default function BottomNav() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/add", label: "Add Task", icon: PlusSquare },
    { href: "/focus", label: "Focus", icon: Brain },
    { href: "/progress", label: "Progress", icon: BarChart2 },
    { href: "/ai", label: "AI", icon: Sparkles },
  ];

  return (
    <nav className={styles.bottomNav}>
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.navItem} ${isActive ? styles.active : ""}`}
          >
            <div className={styles.iconContainer}>
              <Icon size={24} />
            </div>
            <span className={styles.label}>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
