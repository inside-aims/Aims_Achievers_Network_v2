"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Phone, Mail, User, BookOpen, CalendarDays } from "lucide-react";
import type { NominationSubmission } from "./nominations";
import { StatusPill, NomineeAvatar, InfoRow } from "./nomination-primitives";

// Left border accent by status
const BORDER_ACCENT: Record<string, string> = {
  pending:  "border-l-amber-400  dark:border-l-amber-500",
  approved: "border-l-emerald-500 dark:border-l-emerald-400",
  rejected: "border-l-red-400    dark:border-l-red-500",
};

interface Props {
  sub: NominationSubmission;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function NominationCard({ sub, onApprove, onReject }: Props) {
  const isPending  = sub.status === "pending";
  const isApproved = sub.status === "approved";

  return (
    <div className={cn(
      "rounded-xl border-l-4 border border-border bg-card overflow-hidden",
      BORDER_ACCENT[sub.status],
      sub.status === "rejected" && "opacity-60",
    )}>

      {/* Profile header */}
      <div className="flex items-start gap-3 p-4">
        <NomineeAvatar name={sub.nomineeName} url={sub.avatarUrl} size="lg" />

        <div className="flex-1 min-w-0 pt-0.5">
          {/* Name + badge */}
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="min-w-0">
              <p className="font-bold text-sm sm:text-base leading-tight">{sub.nomineeName}</p>
              {sub.nomineeProgram && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{sub.nomineeProgram}</p>
              )}
            </div>
            <StatusPill status={sub.status} />
          </div>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {sub.nomineeDepartment && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-md">
                <BookOpen className="size-3 shrink-0" />
                {sub.nomineeDepartment}
              </span>
            )}
            {sub.nomineeYear && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-md">
                <CalendarDays className="size-3 shrink-0" />
                Year {sub.nomineeYear}
              </span>
            )}
            {sub.nomineePhone && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-md">
                <Phone className="size-3 shrink-0" />
                {sub.nomineePhone}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-4 border-t" />

      {/* Reason + achievements */}
      <div className="px-4 py-3 space-y-3">
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            Nomination Reason
          </p>
          <p className="text-sm leading-relaxed">{sub.nominationReason}</p>
        </div>

        {sub.achievements && (
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Achievements
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">{sub.achievements}</p>
          </div>
        )}
      </div>

      <div className="mx-4 border-t" />

      {/* Nominated by */}
      <div className="px-4 py-3 bg-muted/30">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Nominated by
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
          <InfoRow
            icon={User}
            label="Name"
            value={`${sub.nominatorName} (${sub.nominatorRelationship})`}
          />
          <InfoRow icon={Mail} label="Email" value={sub.nominatorEmail} />
          {sub.nominatorPhone && (
            <InfoRow icon={Phone} label="Phone" value={sub.nominatorPhone} />
          )}
        </div>
      </div>

      {/* Actions - pending only */}
      {isPending && (
        <>
          <div className="mx-4 border-t" />
          <div className="p-3 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReject(sub.id)}
              className="flex-1 gap-2 h-11 text-sm border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
            >
              <XCircle className="size-4 shrink-0" />
              <span>Reject</span>
            </Button>
            <Button
              size="sm"
              onClick={() => onApprove(sub.id)}
              className="flex-1 gap-2 h-11 text-sm bg-emerald-600 hover:bg-emerald-700 text-white border-0"
            >
              <CheckCircle2 className="size-4 shrink-0" />
              <span>Accept</span>
            </Button>
          </div>
        </>
      )}

      {/* Final state strip */}
      {!isPending && (
        <div className={cn(
          "px-4 py-2.5 text-xs font-medium flex items-center gap-2",
          isApproved
            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
            : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
        )}>
          {isApproved
            ? <><CheckCircle2 className="size-3.5 shrink-0" /> Accepted - listed for public voting</>
            : <><XCircle className="size-3.5 shrink-0" /> Rejected - this submission was declined</>
          }
        </div>
      )}
    </div>
  );
}
