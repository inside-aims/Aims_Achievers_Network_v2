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

const TicketCard = ({ ticket, compact = false }: TicketCardProps) => {
  const theme = getThemeById(ticket.themeId);

  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-lg w-full max-w-md mx-auto"
      style={{ border: theme.borderStyle }}
    >
      {/* Themed header */}
      <TicketCardHeader ticket={ticket} theme={theme} compact={compact} />

      {/* Perforated tear-line */}
      <div className="relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-background z-10" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 rounded-full bg-background z-10" />
        <div
          className="border-t-2 border-dashed mx-5"
          style={{ borderColor: theme.accentColor + "55" }}
        />
      </div>

      {/* Body */}
      <div className="bg-background px-5 pb-5 pt-5">
        <div className="flex flex-col items-center gap-5">
          {/* Status + ticket type */}
          <div className="w-full flex items-center justify-between">
            <TicketStatusBadge status={ticket.status} />
            <span className="text-xs font-medium text-muted-foreground">{ticket.ticketTypeName}</span>
          </div>

          {/* QR code — needs white bg to be scannable */}
          {!compact && (
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="bg-primary-foreground rounded-xl p-5 shadow-sm border border-border">
                <QRCodeDisplay value={ticket.ticketCode} size={160} />
              </div>
              <p className="font-mono text-sm font-bold tracking-[0.2em] text-foreground">
                {ticket.ticketCode}
              </p>
            </div>
          )}

          {compact && (
            <p className="font-mono text-sm font-bold tracking-widest text-foreground">
              {ticket.ticketCode}
            </p>
          )}

          {/* Attendee details */}
          <TicketCardDetails ticket={ticket} compact={compact} />

          {/* Footer (re-entry history) */}
          {!compact && <TicketCardFooter ticket={ticket} />}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
