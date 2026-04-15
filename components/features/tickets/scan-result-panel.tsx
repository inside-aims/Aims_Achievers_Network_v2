import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Ban,
} from "lucide-react";
import { ScanResult } from "./index";

interface ScanResultPanelProps {
  result: ScanResult;
  onGenerateNewQR: () => void;
  onDismiss: () => void;
}

// Displays the outcome after scanning a QR code
const ScanResultPanel = ({ result, onGenerateNewQR, onDismiss }: ScanResultPanelProps) => {
  const config = RESULT_CONFIG[result.type];

  return (
    <div className={`rounded-xl border-2 ${config.borderClass} overflow-hidden`}>
      {/* Result header */}
      <div className={`flex items-center gap-3 p-4 ${config.bgClass}`}>
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${config.iconBgClass}`}>
          <config.icon className={`h-5 w-5 ${config.iconClass}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold ${config.textClass}`}>{config.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{result.message}</p>
        </div>
      </div>

      {/* Ticket details (if ticket exists) */}
      {result.ticket && (
        <div className="p-4 space-y-3 bg-card">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <InfoRow label="Name" value={result.ticket.holderName} />
            <InfoRow label="Ticket Type" value={result.ticket.ticketTypeName} />
            <InfoRow label="Code" value={result.ticket.ticketCode} mono />
            <InfoRow label="Event" value={result.ticket.eventTitle} />
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2 border-t border-border">
            {/* Re-entry: generate new QR for already-used tickets */}
            {result.type === "already_used" && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1"
                onClick={onGenerateNewQR}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Generate New QR for Re-entry
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="flex-1"
              onClick={onDismiss}
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* No ticket found */}
      {!result.ticket && (
        <div className="p-4 bg-card">
          <Button variant="ghost" size="sm" className="w-full" onClick={onDismiss}>
            Scan Another
          </Button>
        </div>
      )}
    </div>
  );
};

// Info row helper
function InfoRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-sm font-medium truncate ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

// Config for each scan result type
const RESULT_CONFIG = {
  success: {
    title: "Ticket Verified",
    icon: CheckCircle2,
    borderClass: "border-green-500/30",
    bgClass: "bg-green-500/5",
    iconBgClass: "bg-green-500/10",
    iconClass: "text-green-600",
    textClass: "text-green-700",
  },
  already_used: {
    title: "Already Scanned",
    icon: AlertTriangle,
    borderClass: "border-amber-500/30",
    bgClass: "bg-amber-500/5",
    iconBgClass: "bg-amber-500/10",
    iconClass: "text-amber-600",
    textClass: "text-amber-700",
  },
  invalid: {
    title: "Invalid Ticket",
    icon: XCircle,
    borderClass: "border-red-500/30",
    bgClass: "bg-red-500/5",
    iconBgClass: "bg-red-500/10",
    iconClass: "text-red-600",
    textClass: "text-red-700",
  },
  cancelled: {
    title: "Ticket Cancelled",
    icon: Ban,
    borderClass: "border-red-500/30",
    bgClass: "bg-red-500/5",
    iconBgClass: "bg-red-500/10",
    iconClass: "text-red-600",
    textClass: "text-red-700",
  },
};

export default ScanResultPanel;
