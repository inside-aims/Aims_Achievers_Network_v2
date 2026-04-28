"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { NotificationsBell } from "./notifications-panel";

const PAGE_LABELS: Record<string, string> = {
  "":            "Dashboard",
  "events":      "Events",
  "new-event":   "New Event",
  "edit":        "Edit Event",
  "organizers":  "Organizers",
  "highlights":  "Highlights",
  "analytics":   "Analytics",
  "settings":    "Settings",
  "categories":  "Categories",
  "nominees":    "Nominees",
  "nominations": "Nominations",
  "tickets":     "Tickets",
  "scan-codes":  "Scan Codes",
};

function getPageTitle(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  // segments = [role, uuid, ...rest]
  // Traverse from the deepest segment toward index 2 so that specific
  // labels (e.g. "edit") win over generic parents (e.g. "events").
  for (let i = segments.length - 1; i >= 2; i--) {
    const seg = segments[i];
    if (seg in PAGE_LABELS) return PAGE_LABELS[seg];
  }
  return "Dashboard";
}

export function NavHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const title = getPageTitle(pathname);

  const segments = pathname.split("/").filter(Boolean);
  const showBack = segments.length >= 4;

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4 sticky top-0 z-20">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4 mx-1" />

      {showBack && (
        <button
          onClick={() => router.back()}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background hover:bg-muted transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
        </button>
      )}

      <span className="font-semibold text-sm">{title}</span>

      <div className="flex-1" />

      <NotificationsBell />
    </header>
  );
}
