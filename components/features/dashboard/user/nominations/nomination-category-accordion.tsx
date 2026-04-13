"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, Hash } from "lucide-react";
import type { NominationCategory, SubmissionStatus } from "./nominations";
import { NominationCard } from "./nomination-card";

type TabId = "all" | SubmissionStatus;

// Matches the same palette used in the event accordion and tab bar
const TAB_BADGE: Record<TabId, string> = {
  all:      "bg-muted text-muted-foreground",
  pending:  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  rejected: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

interface Props {
  group: NominationCategory;
  isOpen: boolean;
  onToggle: () => void;
  activeTab: TabId;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function NominationCategoryAccordion({
  group,
  isOpen,
  onToggle,
  activeTab,
  onApprove,
  onReject,
}: Props) {
  const filtered =
    activeTab === "all"
      ? group.submissions
      : group.submissions.filter((s) => s.status === activeTab);

  if (filtered.length === 0) return null;

  const pendingCount = filtered.filter((s) => s.status === "pending").length;

  return (
    <div className={cn(
      "rounded-lg border overflow-hidden transition-shadow",
      isOpen && "shadow-sm",
    )}>
      {/* Category header */}
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "w-full flex items-center gap-2.5 px-3.5 py-3 text-left transition-colors min-h-[52px]",
          isOpen
            ? "bg-primary/10 text-primary dark:bg-primary/20"
            : "bg-muted/40 hover:bg-muted/70 text-foreground",
        )}
      >
        <Hash className={cn("size-3.5 shrink-0", isOpen ? "text-primary" : "text-muted-foreground")} />

        {/* Name + pending badge */}
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-sm truncate block">{group.name}</span>
          {pendingCount > 0 && activeTab !== "pending" && (
            <span className="text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded-full mt-1 inline-block">
              {pendingCount} pending
            </span>
          )}
        </div>

        {/* Tab-filtered count + chevron always on the right */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full font-semibold tabular-nums",
            TAB_BADGE[activeTab],
          )}>
            {filtered.length}
          </span>
          <ChevronDown className={cn(
            "size-4 shrink-0 transition-transform duration-200",
            isOpen ? "rotate-180 text-primary" : "text-muted-foreground",
          )} />
        </div>
      </button>

      {/* Cards */}
      {isOpen && (
        <div className="p-3 space-y-3 bg-background">
          {filtered.map((sub) => (
            <NominationCard
              key={sub.id}
              sub={sub}
              onApprove={onApprove}
              onReject={onReject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
