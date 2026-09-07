"use client";

import React from "react";

interface AiSparkIconProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export default function AiSparkIcon({ className = "", size = 18, glow = false }: AiSparkIconProps) {
  return (
    <span 
      className={`inline-flex items-center justify-center relative ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${glow ? "drop-shadow-sm" : ""}`}
      >
        <defs>
          <linearGradient id="aiSparkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        {/* Classic 4-Point AI Star with Concave Curves */}
        <path
          d="M12 0C12 6.62742 6.62742 12 0 12C6.62742 12 12 17.3726 12 24C12 17.3726 17.3726 12 24 12C17.3726 12 12 6.62742 12 0Z"
          fill="url(#aiSparkGrad)"
        />
        {/* Inner brilliant core */}
        <circle cx="12" cy="12" r="2" fill="#ffffff" opacity="0.9" />
      </svg>
    </span>
  );
}
