import { Ticket } from "./index";
import { User, Mail, Phone } from "lucide-react";

interface TicketCardDetailsProps {
  ticket: Ticket;
  compact?: boolean;
}

const TicketCardDetails = ({ ticket, compact = false }: TicketCardDetailsProps) => {
  if (compact) {
    return (
      <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <User className="h-3 w-3" />
          {ticket.holderName}
        </span>
        <span>{formatShortDate(ticket.createdAt)}</span>
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-2 gap-3 text-sm">
      <DetailItem
        icon={<User className="h-3.5 w-3.5" />}
        label="Name"
        value={ticket.holderName}
      />
      <DetailItem
        icon={<Mail className="h-3.5 w-3.5" />}
        label="Email"
        value={ticket.holderEmail}
      />
      {ticket.holderPhone && (
        <DetailItem
          icon={<Phone className="h-3.5 w-3.5" />}
          label="Phone"
          value={ticket.holderPhone}
        />
      )}
      <DetailItem
        icon={null}
        label="Purchased"
        value={formatShortDate(ticket.createdAt)}
      />
    </div>
  );
};

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground flex items-center gap-1">
        {icon}
        {label}
      </span>
      <span className="text-sm font-medium truncate">{value}</span>
    </div>
  );
}

function formatShortDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-GH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default TicketCardDetails;
