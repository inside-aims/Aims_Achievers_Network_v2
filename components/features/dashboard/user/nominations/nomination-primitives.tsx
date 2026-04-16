"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { SubmissionStatus } from "./nominations";

// Status pill

const STATUS_STYLES: Record<SubmissionStatus, string> = {
  pending:  "bg-amber-100  text-amber-700  dark:bg-amber-900/30  dark:text-amber-400",
  approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  rejected: "bg-red-100    text-red-600    dark:bg-red-900/30    dark:text-red-400",
};

export function StatusPill({ status }: { status: SubmissionStatus }) {
  return (
    <span className={cn("text-xs font-medium px-2.5 py-0.5 rounded-full capitalize whitespace-nowrap", STATUS_STYLES[status])}>
      {status}
    </span>
  );
}

// Nominee avatar

interface AvatarProps {
  name: string;
  url?: string;
  size?: "sm" | "md" | "lg";
}

const SIZE: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-11 sm:size-14 text-sm sm:text-base",
};

export function NomineeAvatar({ name, url, size = "md" }: AvatarProps) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const cls = SIZE[size];

  if (url) {
    return (
      <div className={cn("rounded-full overflow-hidden shrink-0 border-2 border-border", cls)}>
        <Image src={url} alt={name} width={56} height={56} className="object-cover w-full h-full" />
      </div>
    );
  }

  return (
    <div className={cn("rounded-full shrink-0 bg-primary/10 text-primary flex items-center justify-center font-bold border-2 border-primary/20", cls)}>
      {initials}
    </div>
  );
}

// Labelled info row

export function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2 min-w-0">
      <Icon className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide leading-none mb-0.5">
          {label}
        </p>
        <p className="text-xs font-medium break-words">{value}</p>
      </div>
    </div>
  );
}
