import React from "react";
import styles from "./Card.module.css";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function Card({ children, className = "", style, onClick }: CardProps) {
  return (
    <div
      className={`${styles.card} ${className} ${onClick ? styles.clickable : ""}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
