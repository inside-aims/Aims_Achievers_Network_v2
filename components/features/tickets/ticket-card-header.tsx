import { Ticket } from "./index";
import { TicketTheme } from "./index";
import { Calendar, MapPin, Clock } from "lucide-react";

interface TicketCardHeaderProps {
  ticket: Ticket;
  theme: TicketTheme;
  compact?: boolean;
}

// Top section of the ticket card with event info and themed background
const TicketCardHeader = ({ ticket, theme, compact = false }: TicketCardHeaderProps) => {
  return (
    <div
      className={`${compact ? "p-3" : "p-4 md:p-6"} text-center`}
      style={{
        backgroundColor: theme.primaryColor,
        backgroundImage: theme.bgPattern !== "none" ? theme.bgPattern : undefined,
        color: theme.textColor,
        fontFamily: theme.fontFamily,
      }}
    >
      {/* Event title */}
      <h3 className={`font-bold leading-tight ${compact ? "text-sm" : "text-lg md:text-xl"}`}>
        {ticket.eventTitle}
      </h3>

      {/* Event meta info */}
      <div
        className={`flex flex-wrap items-center justify-center gap-3 mt-2 ${compact ? "text-xs" : "text-sm"}`}
        style={{ color: theme.accentColor }}
      >
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {formatEventDate(ticket.eventDate)}
        </span>

        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {ticket.eventTime}
        </span>

        {!compact && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {ticket.venue}
          </span>
        )}
      </div>

      {/* Holder name */}
      {!compact && (
        <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${theme.accentColor}33` }}>
          <p className="text-xs uppercase tracking-wider opacity-70">Ticket Holder</p>
          <p className="text-base font-semibold mt-0.5">{ticket.holderName}</p>
        </div>
      )}
    </div>
  );
};

// Format date string to readable format
function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GH", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default TicketCardHeader;
