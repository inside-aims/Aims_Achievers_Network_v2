"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/features/dashboard/shared/page-header";
import { MOCK_NOMINATIONS, type NominationEvent, type SubmissionStatus } from "./nominations";
import { NominationEventAccordion } from "./nomination-event-accordion";

type TabId = "all" | SubmissionStatus;

const TABS: { id: TabId; label: string }[] = [
  { id: "all",      label: "All"      },
  { id: "pending",  label: "Pending"  },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

const TAB_COUNT_STYLES: Record<TabId, string> = {
  all:      "bg-muted text-muted-foreground",
  pending:  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  rejected: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

export function UserNominations() {
  const [activeTab, setActiveTab]   = useState<TabId>("pending");
  const [openEventId, setOpenEventId] = useState<string | null>(null);

  // Local status map - mirrors what Convex will drive
  const [statuses, setStatuses] = useState<Record<string, SubmissionStatus>>(() => {
    const map: Record<string, SubmissionStatus> = {};
    for (const event of MOCK_NOMINATIONS) {
      for (const cat of event.categories) {
        for (const sub of cat.submissions) {
          map[sub.id] = sub.status;
        }
      }
    }
    return map;
  });

  // Merge overridden statuses into mock data
  const data: NominationEvent[] = MOCK_NOMINATIONS.map((event) => ({
    ...event,
    categories: event.categories.map((cat) => ({
      ...cat,
      submissions: cat.submissions.map((sub) => ({
        ...sub,
        status: statuses[sub.id] ?? sub.status,
      })),
    })),
  }));

  function handleApprove(id: string) {
    setStatuses((prev) => ({ ...prev, [id]: "approved" }));
  }

  function handleReject(id: string) {
    setStatuses((prev) => ({ ...prev, [id]: "rejected" }));
  }

  function toggleEvent(id: string) {
    setOpenEventId((prev) => (prev === id ? null : id));
  }

  // Tab counts
  const allSubs = data.flatMap((e) => e.categories.flatMap((c) => c.submissions));
  const counts: Record<TabId, number> = {
    all:      allSubs.length,
    pending:  allSubs.filter((s) => s.status === "pending").length,
    approved: allSubs.filter((s) => s.status === "approved").length,
    rejected: allSubs.filter((s) => s.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nominations"
        description="Review submitted nominations across your events. Accept to list a nominee for public voting, or reject to decline."
      />

      <div className="flex gap-1 overflow-x-auto pb-px scrollbar-hide border-b">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors relative shrink-0",
              activeTab === id
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
            {counts[id] > 0 && (
              <span className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none",
                TAB_COUNT_STYLES[id],
              )}>
                {counts[id]}
              </span>
            )}
            {activeTab === id && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {counts[activeTab] === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <div className="size-12 rounded-full bg-muted flex items-center justify-center">
            <ClipboardList className="size-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold">
              No {activeTab === "all" ? "" : activeTab} nominations
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {activeTab === "pending"
                ? "All caught up - no submissions are waiting for review."
                : `No nominations have been ${activeTab} yet.`}
            </p>
          </div>
        </div>
      )}

      {counts[activeTab] > 0 && (
        <div className="space-y-3">
          {data.map((group) => (
            <NominationEventAccordion
              key={group.id}
              group={group}
              isOpen={openEventId === group.id}
              onToggle={() => toggleEvent(group.id)}
              activeTab={activeTab}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
