"use client";

import { Ticket } from "./index";
import { getThemeById } from "./ticket-themes";
import QRCodeDisplay from "./qr-code-display";
import TicketStatusBadge from "./ticket-status-badge";
import TicketCardHeader from "./ticket-card-header";
import TicketCardDetails from "./ticket-card-details";
import TicketCardFooter from "./ticket-card-footer";

interface TicketCardProps {
  ticket: Ticket;
  compact?: boolean; // smaller version for lists
}

// The main e-ticket card with themed styling, QR code, and perforated edge
const TicketCard = ({ ticket, compact = false }: TicketCardProps) => {
  const theme = getThemeById(ticket.themeId);

  return (
    <div
      className="relative overflow-hidden rounded-xl shadow-lg w-full max-w-md mx-auto"
      style={{ border: theme.borderStyle }}
    >
      {/* Top section with event info */}
      <TicketCardHeader
        ticket={ticket}
        theme={theme}
        compact={compact}
      />

      {/* Perforated edge divider */}
      <div className="relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-background" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 rounded-full bg-background" />
        <div className="border-t-2 border-dashed border-border mx-8" />
      </div>

      {/* Bottom section with QR and details */}
      <div className="bg-white p-4 md:p-6">
        <div className="flex flex-col items-center gap-4">
          {/* Status badge */}
          <div className="w-full flex items-center justify-between">
            <TicketStatusBadge status={ticket.status} />
            <span className="text-xs text-muted-foreground">
              {ticket.ticketTypeName}
            </span>
          </div>

          {/* QR Code */}
          {!compact && (
            <div className="flex flex-col items-center gap-2 py-2">
              <QRCodeDisplay
                value={ticket.ticketCode}
                size={compact ? 120 : 180}
              />
              <p className="font-mono text-lg font-bold tracking-widest text-foreground">
                {ticket.ticketCode}
              </p>
            </div>
          )}

          {/* Compact mode: show code only */}
          {compact && (
            <p className="font-mono text-sm font-bold tracking-widest text-foreground">
              {ticket.ticketCode}
            </p>
          )}

          {/* Ticket details grid */}
          <TicketCardDetails ticket={ticket} compact={compact} />

          {/* Footer with previous codes info */}
          {!compact && <TicketCardFooter ticket={ticket} />}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
