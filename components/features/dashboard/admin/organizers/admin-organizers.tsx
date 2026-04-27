"use client";

import { useState, useMemo } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PageHeader } from "../../shared/page-header";
import { OrganizerRow } from "./organizer-row";
import { NewOrganizerDialog } from "./new-organizer-dialog";
import { ADMIN_ORGANIZERS, type Organizer, type OrganizerStatus } from "../data/admin-data";

type Filter = "all" | OrganizerStatus;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all",       label: "All"       },
  { id: "active",    label: "Active"    },
  { id: "suspended", label: "Suspended" },
];

interface Props { base: string }

export function AdminOrganizers({ base }: Props) {
  const [organizers, setOrganizers] = useState<Organizer[]>(ADMIN_ORGANIZERS);
  const [filter,     setFilter]     = useState<Filter>("all");
  const [query,      setQuery]      = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const counts = useMemo(() => ({
    all:       organizers.length,
    active:    organizers.filter((o) => o.status === "active").length,
    suspended: organizers.filter((o) => o.status === "suspended").length,
  }), [organizers]);

  const filtered = useMemo(() =>
    organizers.filter((o) => {
      const matchStatus = filter === "all" || o.status === filter;
      const matchQuery  = !query ||
        o.name.toLowerCase().includes(query.toLowerCase()) ||
        o.email.toLowerCase().includes(query.toLowerCase());
      return matchStatus && matchQuery;
    }),
  [organizers, filter, query]);

  function toggleStatus(id: string) {
    setOrganizers((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: o.status === "active" ? "suspended" : "active" } : o
      )
    );
  }

  function addOrganizer(org: Omit<Organizer, "id" | "joinedAt" | "status">) {
    const newOrg: Organizer = {
      ...org,
      id:       `org-${Date.now()}`,
      joinedAt: new Date().toISOString().split("T")[0],
      status:   "active",
    };
    console.log("[AdminOrganizers] TODO: persist to DB:", newOrg);
    setOrganizers((prev) => [newOrg, ...prev]);
    setDialogOpen(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organizers"
        description="All registered organizer accounts on the platform."
        action={
          <Button size="sm" className="gap-1.5" onClick={() => setDialogOpen(true)}>
            <Plus className="size-3.5" />
            New Organizer
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total",     value: counts.all,       className: "text-foreground"  },
          { label: "Active",    value: counts.active,    className: "text-emerald-600" },
          { label: "Suspended", value: counts.suspended, className: "text-amber-600"   },
        ].map(({ label, value, className }) => (
          <div key={label} className="bg-card border border-border rounded-xl px-4 py-3 text-center">
            <p className={cn("text-2xl font-bold tabular-nums", className)}>{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 p-1 bg-muted rounded-lg shrink-0">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                filter === id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
              <span className="text-[11px] tabular-nums font-normal text-muted-foreground/70">
                {counts[id]}
              </span>
            </button>
          ))}
        </div>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by name or email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 h-9 text-sm w-full"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm font-medium">No organizers found</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your filter or search.</p>
            </div>
          ) : (
            <div className="divide-y">
              {filtered.map((org) => (
                <OrganizerRow
                  key={org.id}
                  org={org}
                  base={base}
                  onToggleStatus={() => toggleStatus(org.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <NewOrganizerDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={addOrganizer}
      />
    </div>
  );
}
