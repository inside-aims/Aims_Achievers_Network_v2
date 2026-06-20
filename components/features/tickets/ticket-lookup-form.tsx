"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, Mail, Phone, Hash, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { LookupMode, Ticket } from "./index";
import TicketCard from "./ticket-card";
import EmptyState from "@/components/shared/empty-state";

const TicketLookupForm = () => {
  const [mode, setMode] = useState<LookupMode>("email");
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState<{ mode: LookupMode; value: string } | null>(null);

  const tabs: { key: LookupMode; label: string; icon: typeof Mail; placeholder: string }[] = [
    { key: "email", label: "Email", icon: Mail, placeholder: "Enter your email address" },
    { key: "phone", label: "Phone", icon: Phone, placeholder: "Enter your phone number" },
    { key: "code", label: "Ticket Code", icon: Hash, placeholder: "Enter ticket code (e.g. FAST-A3K9X2)" },
  ];

  const activeTab = useMemo(() => tabs.find((t) => t.key === mode)!, [mode]);

  const emailResults = useQuery(
    api.tickets.lookupByEmail,
    search?.mode === "email" ? { email: search.value } : "skip",
  );
  const phoneResults = useQuery(
    api.tickets.lookupByPhone,
    search?.mode === "phone" ? { phone: search.value } : "skip",
  );
  const codeResult = useQuery(
    api.tickets.lookupByCode,
    search?.mode === "code" ? { code: search.value } : "skip",
  );

  const searching =
    search !== null &&
    ((search.mode === "email" && emailResults === undefined) ||
      (search.mode === "phone" && phoneResults === undefined) ||
      (search.mode === "code" && codeResult === undefined));

  const results: Ticket[] | null =
    search === null
      ? null
      : search.mode === "email"
        ? ((emailResults as Ticket[] | undefined) ?? null)
        : search.mode === "phone"
          ? ((phoneResults as Ticket[] | undefined) ?? null)
          : codeResult !== undefined
            ? codeResult
              ? [codeResult as Ticket]
              : []
            : null;

  function handleSearch() {
    if (!inputValue.trim()) return;
    setSearch({ mode, value: inputValue.trim() });
  }

  function handleReset() {
    setInputValue("");
    setSearch(null);
  }

  function handleTabChange(newMode: LookupMode) {
    setMode(newMode);
    setInputValue("");
    setSearch(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex rounded-lg border border-border bg-muted p-1 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                mode === tab.key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ticket-lookup-input">{activeTab.label}</Label>
        <div className="flex gap-2">
          <Input
            id="ticket-lookup-input"
            type={mode === "email" ? "email" : "text"}
            placeholder={activeTab.placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            disabled={searching}
          />
          <Button
            onClick={handleSearch}
            disabled={!inputValue.trim() || searching}
            className="shrink-0"
          >
            {searching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span className="hidden sm:inline ml-2">Search</span>
          </Button>
        </div>
      </div>

      {results !== null && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              {results.length} ticket{results.length !== 1 ? "s" : ""} found
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {results.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {results.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} compact />
              ))}
            </div>
          ) : (
            <EmptyState onReset={handleReset} />
          )}
        </div>
      )}
    </div>
  );
};

export default TicketLookupForm;
