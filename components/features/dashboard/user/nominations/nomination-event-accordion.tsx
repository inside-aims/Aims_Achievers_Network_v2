"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, CalendarDays } from "lucide-react";
import { StatusBadge } from "@/components/features/dashboard/shared/status-badge";
import type { NominationEvent, SubmissionStatus } from "./nominations";
import { NominationCategoryAccordion } from "./nomination-category-accordion";

type TabId = "all" | SubmissionStatus;

// Styles for the tab-count badge when header is closed
const TAB_BADGE_CLOSED: Record<TabId, string> = {
  all:      "bg-muted text-muted-foreground",
  pending:  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  rejected: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

// Styles for the tab-count badge when header is open (primary bg)
const TAB_BADGE_OPEN: Record<TabId, string> = {
  all:      "bg-primary-foreground/20 text-primary-foreground/80",
  pending:  "bg-amber-300/30 text-amber-100",
  approved: "bg-emerald-300/30 text-emerald-100",
  rejected: "bg-red-300/30 text-red-100",
};

const TAB_LABELS: Record<TabId, string> = {
  all:      "total",
  pending:  "pending",
  approved: "approved",
  rejected: "rejected",
};

interface Props {
  group: NominationEvent;
  isOpen: boolean;
  onToggle: () => void;
  activeTab: TabId;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function NominationEventAccordion({
  group,
  isOpen,
  onToggle,
  activeTab,
  onApprove,
  onReject,
}: Props) {
  // One category open at a time - none by default
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);

  const allSubs = group.categories.flatMap((c) => c.submissions);

  // Total across all categories regardless of tab - shown on the right
  const totalCount = allSubs.length;

  // Count matching the active tab - shown below the title
  const filteredCount =
    activeTab === "all"
      ? totalCount
      : allSubs.filter((s) => s.status === activeTab).length;

  if (filteredCount === 0) return null;

  function toggleCategory(id: string) {
    setOpenCategoryId((prev) => (prev === id ? null : id));
  }

  return (
    <div className={cn(
      "rounded-xl border overflow-hidden transition-shadow",
      isOpen ? "shadow-md border-primary/30" : "shadow-xs",
    )}>
      {/* Event header */}
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-4 text-left transition-colors min-h-[64px]",
          isOpen
            ? "bg-primary text-primary-foreground"
            : "bg-card hover:bg-muted/40 text-foreground",
        )}
      >
        {/* Calendar icon */}
        <div className={cn(
          "size-9 rounded-lg flex items-center justify-center shrink-0",
          isOpen ? "bg-primary-foreground/20" : "bg-muted",
        )}>
          <CalendarDays className={cn("size-4", isOpen ? "text-primary-foreground" : "text-muted-foreground")} />
        </div>

        {/* Title + status + tab-count badge */}
        <div className="flex-1 min-w-0">
          <p className={cn(
            "font-bold text-sm leading-snug truncate",
            isOpen ? "text-primary-foreground" : "text-foreground",
          )}>
            {group.title}
          </p>

          {/* Status + tab-based count badge - always below title */}
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            {isOpen ? (
              <span className="text-[11px] font-semibold bg-primary-foreground/20 text-primary-foreground px-2 py-0.5 rounded-full capitalize">
                {group.status}
              </span>
            ) : (
              <StatusBadge status={group.status} />
            )}

            {/* Tab-aware count badge */}
            {filteredCount > 0 && (
              <span className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                isOpen ? TAB_BADGE_OPEN[activeTab] : TAB_BADGE_CLOSED[activeTab],
              )}>
                {filteredCount} {TAB_LABELS[activeTab]}
              </span>
            )}
          </div>
        </div>

        {/* Total submissions + chevron - always on the right */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <ChevronDown className={cn(
            "size-5 transition-transform duration-200",
            isOpen ? "rotate-180 text-primary-foreground" : "text-muted-foreground",
          )} />
          <span className={cn(
            "text-[11px] tabular-nums",
            isOpen ? "text-primary-foreground/80" : "text-muted-foreground",
          )}>
            {totalCount} submission{totalCount !== 1 ? "s" : ""}
          </span>
        </div>
      </button>

      {/* Category list */}
      {isOpen && (
        <div className="bg-muted/20 p-3 space-y-2.5 border-t border-primary/10">
          {group.categories.map((cat) => (
            <NominationCategoryAccordion
              key={cat.id}
              group={cat}
              isOpen={openCategoryId === cat.id}
              onToggle={() => toggleCategory(cat.id)}
              activeTab={activeTab}
              onApprove={onApprove}
              onReject={onReject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
