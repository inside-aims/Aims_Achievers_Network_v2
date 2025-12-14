"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface SwipeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  hoverLabel?: string;
  className?: string;
  baseClass?: string;
  hoverClass?: string;
}

export default function SwipeButton({
  label,
  hoverLabel,
  className,
  baseClass = "bg-orange-500 text-white",
  hoverClass = "bg-black text-white",
  ...props
}: SwipeButtonProps) {
  const common =
    "block px-4 py-2 text-2xl font-bold transition-transform duration-300 ease-in-out";

  return (
    <button
      {...props}
      className={cn(
        "group relative min-w-fit overflow-hidden rounded-md",
        className
      )}
    >
      {/* Hover / Swipe Text */}
      <span
        className={cn(
          "absolute inset-0 translate-y-full group-hover:translate-y-0",
          common,
          hoverClass
        )}
      >
        {hoverLabel ?? label}
      </span>

      {/* Default Text */}
      <span
        className={cn(
          "group-hover:-translate-y-full",
          common,
          baseClass
        )}
      >
        {label}
      </span>
    </button>
  );
}
