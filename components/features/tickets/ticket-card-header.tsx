import { Ticket } from "./index";
import { TicketTheme } from "./index";
import { Calendar, MapPin, Clock } from "lucide-react";

interface TicketCardHeaderProps {
  ticket: Ticket;
  theme: TicketTheme;
  compact?: boolean;
}

const TicketCardHeader = ({ ticket, theme, compact = false }: TicketCardHeaderProps) => {
  return (
    <div
      className={compact ? "px-4 py-3" : "px-5 py-6 md:px-6 md:py-7"}
      style={{
        backgroundColor: theme.primaryColor,
        backgroundImage: theme.bgPattern !== "none" ? theme.bgPattern : undefined,
        color: theme.textColor,
        fontFamily: theme.fontFamily,
      }}
    >
      {/* Event title */}
      <h3
        className={`font-bold leading-tight ${compact ? "text-sm" : "text-lg md:text-xl"}`}
        style={{ color: theme.textColor }}
      >
        {ticket.eventTitle}
      </h3>

      {/* Event meta row */}
      <div
        className={`flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 ${compact ? "text-xs" : "text-sm"}`}
        style={{ color: theme.accentColor }}
      >
        <span className="flex items-center gap-1.5">
          <Calendar className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
          {formatEventDate(ticket.eventDate)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
          {ticket.eventTime}
        </span>
        {!compact && (
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {ticket.venue}
          </span>
        )}
      </div>

      {/* Holder block */}
      {!compact && (
        <div
          className="mt-5 pt-4 flex items-center justify-between"
          style={{ borderTop: `1px solid ${theme.accentColor}30` }}
        >
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.15em] font-medium"
              style={{ color: theme.accentColor + "aa" }}
            >
              Ticket Holder
            </p>
            <p className="text-base font-semibold mt-0.5" style={{ color: theme.textColor }}>
              {ticket.holderName}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

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
