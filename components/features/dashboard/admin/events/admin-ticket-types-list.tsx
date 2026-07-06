"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Ticket, TicketX, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Id } from "@/convex/_generated/dataModel";

export interface AdminTicket {
  id: Id<"tickets">;
  ticketCode: string;
  holderName: string;
  holderEmail: string;
  status: "valid" | "used" | "cancelled";
}

export interface AdminTicketType {
  id: Id<"ticketTypes">;
  name: string;
  description: string;
  pricePesewas: number;
  quantityTotal: number;
  quantitySold: number;
  tickets: AdminTicket[];
}

const STATUS_STYLE: Record<AdminTicket["status"], { label: string; icon: typeof CheckCircle2; className: string }> = {
  valid:     { label: "Valid",     icon: Clock3,      className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
  used:      { label: "Used",      icon: CheckCircle2, className: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
  cancelled: { label: "Cancelled", icon: XCircle,      className: "bg-red-500/10 text-red-700 dark:text-red-400" },
};

function formatPrice(pesewas: number): string {
  return pesewas === 0 ? "Free" : `GHS ${(pesewas / 100).toLocaleString()}`;
}

interface TicketRowProps {
  ticket: AdminTicket;
}

function TicketRow({ ticket }: TicketRowProps) {
  const style = STATUS_STYLE[ticket.status];
  const StatusIcon = style.icon;

  return (
    <div className="flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2.5 md:py-3 hover:bg-accent transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-xs md:text-sm font-medium truncate">{ticket.holderName}</p>
        <p className="text-[10px] md:text-xs text-muted-foreground truncate">{ticket.holderEmail}</p>
      </div>
      <span className="text-[10px] md:text-xs font-mono tracking-wide text-muted-foreground shrink-0">
        {ticket.ticketCode}
      </span>
      <Badge className={cn("gap-1 text-[10px] shrink-0", style.className)}>
        <StatusIcon className="size-3" />
        {style.label}
      </Badge>
    </div>
  );
}

function TicketsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 md:gap-3 py-8 md:py-10 px-4 text-center">
      <div className="flex size-10 md:size-12 items-center justify-center rounded-full bg-muted">
        <TicketX className="size-4 md:size-5 text-muted-foreground" />
      </div>
      <div className="space-y-0.5 md:space-y-1">
        <p className="text-xs md:text-sm font-medium">No tickets sold yet</p>
        <p className="text-[10px] md:text-xs text-muted-foreground max-w-[220px]">
          Purchased tickets for this type will appear here.
        </p>
      </div>
    </div>
  );
}

interface TicketTypeRowProps {
  ticketType: AdminTicketType;
  isOpen: boolean;
  onToggle: () => void;
}

function TicketTypeRow({ ticketType, isOpen, onToggle }: TicketTypeRowProps) {
  const hasTickets = ticketType.tickets.length > 0;
  const capacityLabel = ticketType.quantityTotal === -1
    ? `${ticketType.quantitySold} sold`
    : `${ticketType.quantitySold} / ${ticketType.quantityTotal} sold`;

  return (
    <div className="border-b last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between px-4 md:px-5 py-3 md:py-4 text-left transition-colors",
          isOpen ? "bg-accent" : "hover:bg-accent/60",
        )}
      >
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div
            className={cn(
              "flex size-7 md:size-8 items-center justify-center rounded-md shrink-0 transition-colors",
              isOpen ? "bg-primary text-primary-foreground" : "bg-muted",
            )}
          >
            <Ticket className="size-3.5 md:size-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs md:text-sm font-semibold leading-tight">{ticketType.name}</p>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 truncate">
              {formatPrice(ticketType.pricePesewas)}{ticketType.description ? ` · ${ticketType.description}` : ""}
            </p>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 tabular-nums">
              {capacityLabel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-2.5 shrink-0 ml-3">
          <Badge
            variant={isOpen ? "default" : "outline"}
            className="text-[10px] md:text-[11px] tabular-nums px-1.5 md:px-2"
          >
            {hasTickets
              ? `${ticketType.tickets.length} ${ticketType.tickets.length === 1 ? "ticket" : "tickets"}`
              : "No tickets"}
          </Badge>
          {isOpen ? (
            <ChevronUp className="size-3.5 md:size-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-3.5 md:size-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="border-t">
          {!hasTickets ? (
            <TicketsEmptyState />
          ) : (
            <div className="divide-y">
              {ticketType.tickets.map((ticket) => (
                <TicketRow key={ticket.id} ticket={ticket} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface Props {
  ticketTypes: AdminTicketType[];
}

export function AdminTicketTypesList({ ticketTypes }: Props) {
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(ticketTypes.slice(0, 2).map((tt) => tt.id)),
  );

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <Card>
      <CardHeader className="pb-0 px-4 md:px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm md:text-base flex items-center gap-1.5 md:gap-2">
            <Ticket className="size-3.5 md:size-4 text-muted-foreground" />
            Ticket Types &amp; Sales
          </CardTitle>
          <span className="text-[10px] md:text-xs text-muted-foreground tabular-nums">
            {ticketTypes.length} {ticketTypes.length === 1 ? "type" : "types"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-0 mt-3 md:mt-4">
        {ticketTypes.length === 0 ? (
          <div className="py-12 md:py-16 text-center px-4 space-y-1 md:space-y-1.5">
            <p className="font-medium text-xs md:text-sm">No ticket types configured</p>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              The organiser hasn&apos;t set up any ticket types for this event yet.
            </p>
          </div>
        ) : (
          <div>
            {ticketTypes.map((tt) => (
              <TicketTypeRow
                key={tt.id}
                ticketType={tt}
                isOpen={openIds.has(tt.id)}
                onToggle={() => toggle(tt.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
