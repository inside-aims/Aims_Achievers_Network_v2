import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ScanLine } from "lucide-react";
import { TicketStatus } from "./index";

interface TicketStatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

const statusConfig: Record<TicketStatus, {
  label: string;
  icon: typeof CheckCircle2;
  className: string;
}> = {
  valid: {
    label: "Valid",
    icon: CheckCircle2,
    className: "bg-green-500/10 text-green-600 border-green-500/20",
  },
  used: {
    label: "Checked In",
    icon: ScanLine,
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-red-500/10 text-red-600 border-red-500/20",
  },
};

const TicketStatusBadge = ({ status, className = "" }: TicketStatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`${config.className} ${className} gap-1 font-medium`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

export default TicketStatusBadge;
