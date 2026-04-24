import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Ban,
  X,
  Ticket,
  User,
} from "lucide-react";
import { ScanResult } from "./index";
import { cn } from "@/lib/utils";

interface ScanResultPanelProps {
  result: ScanResult;
  onGenerateNewQR: () => void;
  onDismiss: () => void;
}

const ScanResultPanel = ({ result, onGenerateNewQR, onDismiss }: ScanResultPanelProps) => {
  const config = RESULT_CONFIG[result.type];

  return (
    <div className={cn("rounded-2xl overflow-hidden border", config.borderClass)}>
      {/* Result header */}
      <div className={cn("flex items-center gap-4 px-5 py-5", config.bgClass)}>
        <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-full", config.iconBgClass)}>
          <config.icon className={cn("h-7 w-7", config.iconClass)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn("text-lg font-bold leading-tight", config.textClass)}>{config.title}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{result.message}</p>
        </div>
        <button
          onClick={onDismiss}
          className="self-start text-muted-foreground hover:text-foreground transition-colors mt-0.5"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Ticket details */}
      {result.ticket && (
        <div className="px-5 py-5 bg-background space-y-4">
          {/* Holder row — most prominent */}
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 shrink-0">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Ticket Holder</p>
              <p className="text-sm font-bold truncate">{result.ticket.holderName}</p>
            </div>
            <div className="flex items-center gap-1.5 bg-muted rounded-md px-2.5 py-1 shrink-0">
              <Ticket className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium font-mono">{result.ticket.ticketCode}</span>
            </div>
          </div>

          {/* Detail grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <InfoRow label="Ticket Type" value={result.ticket.ticketTypeName} />
            <InfoRow label="Event" value={result.ticket.eventTitle} />
          </div>

          {/* Actions */}
          <div className={cn("flex gap-2 pt-1 border-t border-border", result.type !== "already_used" && "justify-end")}>
            {result.type === "already_used" && (
              <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={onGenerateNewQR}>
                <RefreshCw className="h-3.5 w-3.5" />
                Generate New QR for Re-entry
              </Button>
            )}
            <Button variant="ghost" size="sm" className="gap-1.5" onClick={onDismiss}>
              <X className="h-3.5 w-3.5" />
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* No ticket found */}
      {!result.ticket && (
        <div className="px-5 py-4 bg-background">
          <Button variant="outline" size="sm" className="w-full" onClick={onDismiss}>
            Scan Another
          </Button>
        </div>
      )}
    </div>
  );
};

function InfoRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("text-sm font-medium truncate", mono && "font-mono")}>{value}</p>
    </div>
  );
}

const RESULT_CONFIG = {
  success: {
    title: "Ticket Verified",
    icon: CheckCircle2,
    borderClass: "border-green-500/25",
    bgClass: "bg-green-500/8",
    iconBgClass: "bg-green-500/15",
    iconClass: "text-green-600",
    textClass: "text-green-700",
  },
  already_used: {
    title: "Already Checked In",
    icon: AlertTriangle,
    borderClass: "border-amber-500/25",
    bgClass: "bg-amber-500/8",
    iconBgClass: "bg-amber-500/15",
    iconClass: "text-amber-600",
    textClass: "text-amber-700",
  },
  invalid: {
    title: "Invalid Ticket",
    icon: XCircle,
    borderClass: "border-destructive/25",
    bgClass: "bg-destructive/8",
    iconBgClass: "bg-destructive/15",
    iconClass: "text-destructive",
    textClass: "text-destructive",
  },
  cancelled: {
    title: "Ticket Cancelled",
    icon: Ban,
    borderClass: "border-destructive/25",
    bgClass: "bg-destructive/8",
    iconBgClass: "bg-destructive/15",
    iconClass: "text-destructive",
    textClass: "text-destructive",
  },
};

export default ScanResultPanel;
