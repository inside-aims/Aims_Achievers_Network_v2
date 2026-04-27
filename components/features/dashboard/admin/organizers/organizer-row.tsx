"use client";

import Link from "next/link";
import {
  ChevronRight,
  CalendarDays,
  ShieldOff,
  ShieldCheck,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Doc } from "@/convex/_generated/dataModel";

interface Props {
  org:            Doc<"organizerProfiles">;
  base:           string;
  onToggleStatus: () => void;
}

export function OrganizerRow({ org, base, onToggleStatus }: Props) {
  const isActive = org.status === "active" || org.status === undefined;
  const initials = org.displayName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const joinedAt = new Date(org.createdAt).toLocaleDateString("en-GH", { month: "short", year: "numeric" });

  return (
    <div className={cn("px-5 py-4", !isActive && "opacity-60")}>
      <div className="flex items-start gap-4">
        <div className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold select-none",
          isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
        )}>
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`${base}/organizers/${org._id}`}
              className="text-sm font-semibold hover:text-primary transition-colors"
            >
              {org.displayName}
            </Link>
            <Badge
              variant={isActive ? "outline" : "secondary"}
              className={cn(
                "text-[10px] h-4 px-1.5",
                isActive && "text-emerald-700 border-emerald-500/30 bg-emerald-500/10",
              )}
            >
              {org.status ?? "active"}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-x-3 mt-0.5 text-xs text-muted-foreground">
            {org.email && (
              <span className="flex items-center gap-1"><Mail className="size-3" />{org.email}</span>
            )}
            {org.phone && (
              <span className="flex items-center gap-1"><Phone className="size-3" />{org.phone}</span>
            )}
          </div>

          <div className="flex flex-wrap gap-x-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CalendarDays className="size-3" />
              Joined {joinedAt}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "gap-1.5 text-xs h-7",
              isActive
                ? "text-amber-600 hover:text-amber-700 hover:bg-amber-500/10"
                : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10",
            )}
            onClick={onToggleStatus}
          >
            {isActive
              ? <><ShieldOff className="size-3" /> Suspend</>
              : <><ShieldCheck className="size-3" /> Reinstate</>
            }
          </Button>
          <Link
            href={`${base}/organizers/${org._id}`}
            className="flex items-center justify-center size-7 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
