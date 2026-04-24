"use client";

import { useState } from "react";
import {
  Plus,
  Copy,
  Check,
  Phone,
  ShieldCheck,
  ShieldOff,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ScanLine,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  getEventTicketInfo,
  getEventScanCodes,
} from "@/components/features/tickets/mock-data";
import type { ScanAccessCode, ScanResultType } from "@/components/features/tickets/index";

interface Props {
  eventId: string;
  readonly?: boolean;
}

function generateScanCode(eventTitle: string): string {
  const prefix = eventTitle.split(" ")[0].toUpperCase().slice(0, 4);
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let rand = "";
  for (let i = 0; i < 6; i++) rand += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}-GATE-${rand}`;
}

function formatScanTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString("en-GH", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatRelativeTime(iso?: string): string {
  if (!iso) return "Never";
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 0) return formatScanTime(iso);
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return "just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

const RESULT_CONFIG: Record<ScanResultType, { label: string; icon: typeof CheckCircle2; className: string }> = {
  success:      { label: "Valid",      icon: CheckCircle2,  className: "bg-green-500/10 text-green-700" },
  already_used: { label: "Used",       icon: AlertTriangle, className: "bg-amber-500/10 text-amber-700" },
  invalid:      { label: "Invalid",    icon: XCircle,       className: "bg-red-500/10 text-red-700" },
  cancelled:    { label: "Cancelled",  icon: XCircle,       className: "bg-red-500/10 text-red-700" },
};

export function EventTicketsSection({ eventId, readonly = false }: Props) {
  const ticketInfo = getEventTicketInfo(eventId);
  const [codes, setCodes] = useState<ScanAccessCode[]>(getEventScanCodes(eventId));

  const [dialogOpen, setDialogOpen] = useState(false);
  const [staffName, setStaffName] = useState("");
  const [staffRole, setStaffRole] = useState("");
  const [staffPhone, setStaffPhone] = useState("");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  if (!ticketInfo) return null;

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  }

  function handleGenerate() {
    if (!staffName.trim() || !staffRole.trim()) return;
    const code = generateScanCode(ticketInfo!.eventTitle);
    const newCode: ScanAccessCode = {
      id: `sac-new-${Date.now()}`,
      eventId,
      code,
      staffName: staffName.trim(),
      staffRole: staffRole.trim(),
      staffPhone: staffPhone.trim() || undefined,
      generatedAt: new Date().toISOString(),
      isActive: true,
      scansCount: 0,
      scans: [],
    };
    console.log("[ScanCodes] TODO: persist to DB:", newCode);
    setGeneratedCode(code);
    setCodes((prev) => [...prev, newCode]);
  }

  function handleDialogClose() {
    setDialogOpen(false);
    setStaffName("");
    setStaffRole("");
    setStaffPhone("");
    setGeneratedCode(null);
  }

  function toggleActive(id: string) {
    setCodes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="overview">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scan-codes">Scan Codes</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview: ticket types breakdown only */}
        <TabsContent value="overview" className="mt-4">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold">Ticket Types</p>
            </div>
            <div className="divide-y divide-border">
              {ticketInfo.ticketTypes.map((t) => {
                const revenue = (t.quantitySold * t.pricePesewas) / 100;
                const soldOut = t.quantityTotal !== -1 && t.quantitySold >= t.quantityTotal;
                const unlimited = t.quantityTotal === -1;
                return (
                  <div key={t.id} className="px-4 py-3 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{t.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{t.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-sm font-bold tabular-nums">
                          GHS {(t.pricePesewas / 100).toFixed(2)}
                        </span>
                        {soldOut && (
                          <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                            Sold Out
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>
                        Sold: <span className="font-medium text-foreground tabular-nums">{t.quantitySold}</span>
                        {!unlimited && ` / ${t.quantityTotal}`}
                      </span>
                      <span>
                        Revenue: <span className="font-medium text-foreground tabular-nums">GHS {revenue.toFixed(2)}</span>
                      </span>
                      {unlimited && <span>Unlimited capacity</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* Scan Codes */}
        <TabsContent value="scan-codes" className="space-y-4 mt-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Scan Access Codes</p>
              <p className="text-xs text-muted-foreground">
                Each code is tied to a specific staff member at the gate.
              </p>
            </div>
            {!readonly && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 shrink-0"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Generate Code</span>
                <span className="sm:hidden">Generate</span>
              </Button>
            )}
          </div>

          {codes.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border py-10 text-center px-4">
              <ShieldCheck className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No scan access codes yet.</p>
              {!readonly && (
                <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
                  Generate First Code
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {codes.map((c) => (
                <div
                  key={c.id}
                  className={cn(
                    "bg-card border border-border rounded-xl px-4 py-4 space-y-3",
                    !c.isActive && "opacity-60"
                  )}
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-sm font-bold tracking-wider">
                        {c.code}
                      </span>
                      <button
                        onClick={() => handleCopy(c.code)}
                        className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                        aria-label="Copy code"
                      >
                        {copied === c.code ? (
                          <Check className="h-3.5 w-3.5 text-green-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    {!readonly ? (
                      <button onClick={() => toggleActive(c.id)} className="shrink-0" aria-label="Toggle active">
                        <ActiveBadge isActive={c.isActive} />
                      </button>
                    ) : (
                      <ActiveBadge isActive={c.isActive} />
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{c.staffName}</span>
                    <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                      {c.staffRole}
                    </Badge>
                    {c.staffPhone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {c.staffPhone}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <ScanLine className="h-3 w-3" />
                      {c.scans.length} scan{c.scans.length !== 1 ? "s" : ""}
                    </span>
                    <span>Last: {formatRelativeTime(c.lastScannedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Activity: grouped by staff, collapsible */}
        <TabsContent value="activity" className="space-y-3 mt-4">
          <p className="text-sm font-semibold">Scan Activity by Staff</p>

          {codes.every((c) => c.scans.length === 0) ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border py-10 text-center px-4">
              <ScanLine className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No scan activity yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {codes
                .filter((c) => c.scans.length > 0)
                .map((c) => {
                  const counts = c.scans.reduce<Record<ScanResultType, number>>(
                    (acc, e) => { acc[e.result] = (acc[e.result] ?? 0) + 1; return acc; },
                    {} as Record<ScanResultType, number>
                  );

                  return (
                    <details key={c.id} className="group bg-card border border-border rounded-xl overflow-hidden">
                      <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none select-none">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 min-w-0">
                          <span className="text-sm font-medium">{c.staffName}</span>
                          <Badge variant="outline" className="text-[10px] h-4 px-1.5 shrink-0">
                            {c.staffRole}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {c.scans.length} scan{c.scans.length !== 1 ? "s" : ""}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {(Object.entries(counts) as [ScanResultType, number][]).map(([type, n]) => {
                              const { label, className } = RESULT_CONFIG[type];
                              return (
                                <span key={type} className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", className)}>
                                  {label}: {n}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 transition-transform group-open:rotate-180" />
                      </summary>

                      <div className="divide-y divide-border border-t border-border">
                        {c.scans
                          .slice()
                          .sort((a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime())
                          .map((entry) => {
                            const { label, icon: Icon, className } = RESULT_CONFIG[entry.result];
                            return (
                              <div key={entry.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                                <div className="min-w-0">
                                  <p className="text-sm font-medium truncate">{entry.holderName}</p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {entry.ticketTypeName} · <span className="font-mono">{entry.ticketCode}</span>
                                  </p>
                                </div>
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                  <span className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", className)}>
                                    <Icon className="h-3 w-3" />
                                    {label}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground">
                                    {formatScanTime(entry.scannedAt)}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </details>
                  );
                })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Generate code dialog */}
      {!readonly && (
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => { if (!open) handleDialogClose(); else setDialogOpen(true); }}
        >
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Generate Scan Access Code</DialogTitle>
            </DialogHeader>

            {generatedCode ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-3 rounded-xl bg-primary/5 border border-primary/20 p-5 text-center">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Access Code</p>
                    <p className="font-mono text-xl font-bold tracking-widest break-all">{generatedCode}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => handleCopy(generatedCode)}
                  >
                    {copied === generatedCode ? (
                      <><Check className="h-3.5 w-3.5 text-green-600" /> Copied</>
                    ) : (
                      <><Copy className="h-3.5 w-3.5" /> Copy Code</>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Share this code with <strong>{staffName}</strong> ({staffRole}) to allow them
                  to access the scanner for this event.
                </p>
                <Button className="w-full" onClick={handleDialogClose}>Done</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="staff-name">
                    Staff Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="staff-name"
                    placeholder="e.g. Kwesi Antwi"
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="staff-role">
                    Gate / Role <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="staff-role"
                    placeholder="e.g. Main Entrance"
                    value={staffRole}
                    onChange={(e) => setStaffRole(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="staff-phone">Phone (optional)</Label>
                  <Input
                    id="staff-phone"
                    type="tel"
                    placeholder="0551234567"
                    value={staffPhone}
                    onChange={(e) => setStaffPhone(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleGenerate}
                  disabled={!staffName.trim() || !staffRole.trim()}
                >
                  Generate Code
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function ActiveBadge({ isActive }: { isActive: boolean }) {
  return isActive ? (
    <Badge className="bg-green-500/10 text-green-700 border-green-500/20 gap-1 text-[10px]">
      <ShieldCheck className="h-3 w-3" />
      Active
    </Badge>
  ) : (
    <Badge variant="secondary" className="gap-1 text-[10px]">
      <ShieldOff className="h-3 w-3" />
      Inactive
    </Badge>
  );
}
