import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`bg-card text-card-foreground rounded-lg border shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
} 