"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const PAGE_LABELS: Record<string, string> = {
  "":            "Dashboard",
  "events":      "Events",
  "organizers":  "Organizers",
  "analytics":   "Analytics",
  "settings":    "Settings",
  "new":         "New Event",
  "categories":  "Categories",
  "nominees":    "Nominees",
};

function getPageTitle(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  // [role, uuid, sub?, id?, deeper?, id2?]
  const sub = segments[2];
  if (!sub) return "Dashboard";
  if (sub in PAGE_LABELS) return PAGE_LABELS[sub];
  // sub is a dynamic id — look one level deeper
  const deeper = segments[3];
  if (deeper && deeper in PAGE_LABELS) return PAGE_LABELS[deeper];
  // even deeper (e.g. categories/[categoryId])
  const deepest = segments[4];
  if (deepest && deepest in PAGE_LABELS) return PAGE_LABELS[deepest];
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

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" aria-label="Notifications">
            <Bell className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80">
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center h-48 text-center gap-2">
            <Bell className="size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">You have no notifications.</p>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
