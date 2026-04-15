import { Ticket } from "./index";
import { RefreshCw } from "lucide-react";

interface TicketCardFooterProps {
  ticket: Ticket;
}

// Footer section showing re-entry history and previous codes
const TicketCardFooter = ({ ticket }: TicketCardFooterProps) => {
  const hasPreviousCodes = ticket.previousCodes && ticket.previousCodes.length > 0;

  if (!hasPreviousCodes && ticket.status !== "used") return null;

  return (
    <div className="w-full pt-3 border-t border-border">
      {/* Used at timestamp */}
      {ticket.status === "used" && ticket.usedAt && (
        <p className="text-xs text-muted-foreground text-center">
          Checked in at {formatTime(ticket.usedAt)}
        </p>
      )}

      {/* Re-entry history */}
      {hasPreviousCodes && (
        <div className="mt-2 flex flex-col items-center gap-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <RefreshCw className="h-3 w-3" />
            <span>QR code has been refreshed {ticket.previousCodes!.length} time(s)</span>
          </div>
          <p className="text-[10px] text-muted-foreground/60">
            Previous codes are no longer valid
          </p>
        </div>
      )}
    </div>
  );
};

function formatTime(isoDate: string): string {
  return new Date(isoDate).toLocaleString("en-GH", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default TicketCardFooter;
