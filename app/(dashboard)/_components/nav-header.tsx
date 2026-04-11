"use client";

import { usePathname } from "next/navigation";
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
  const title = getPageTitle(pathname);

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4 sticky top-0 z-20">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4 mx-1" />
      <span className="font-semibold text-sm">{title}</span>

      <div className="flex-1" />

      <NotificationsBell />
    </header>
  );
}
