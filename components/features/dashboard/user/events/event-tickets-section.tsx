"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
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
  Ticket,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { TICKET_THEMES } from "@/components/features/tickets/ticket-themes";
import type { ScanResultType } from "@/components/features/tickets/index";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatScanTime(ts: number): string {
  return new Date(ts).toLocaleString("en-GH", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatRelativeTime(ts?: number): string {
  if (!ts) return "Never";
  const diff = Date.now() - ts;
  if (diff < 0) return formatScanTime(ts);
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

const RESULT_CONFIG: Record<
  ScanResultType,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  success:      { label: "Valid",     icon: CheckCircle2,  className: "bg-green-500/10 text-green-700" },
  already_used: { label: "Used",      icon: AlertTriangle, className: "bg-amber-500/10 text-amber-700" },
  invalid:      { label: "Invalid",   icon: XCircle,       className: "bg-red-500/10 text-red-700" },
  cancelled:    { label: "Cancelled", icon: XCircle,       className: "bg-red-500/10 text-red-700" },
};

// ─── Public component ─────────────────────────────────────────────────────────

interface Props {
  eventId: Id<"events">;
  ticketingEnabled: boolean;
  readonly?: boolean;
}

export function EventTicketsSection({ eventId, ticketingEnabled, readonly = false }: Props) {
  if (!ticketingEnabled) return <SetupPanel eventId={eventId} />;
  return <TicketingDashboard eventId={eventId} readonly={readonly} />;
}

// ─── Setup panel ──────────────────────────────────────────────────────────────

type TicketRow = { id: string; name: string; price: string; quantity: string };

function newRow(): TicketRow {
  return { id: String(Date.now() + Math.random()), name: "", price: "20", quantity: "100" };
}

function SetupPanel({ eventId }: { eventId: Id<"events"> }) {
  const [rows, setRows] = useState<TicketRow[]>([newRow()]);
  const [themeId, setThemeId] = useState("royal-night");
  const [submitting, setSubmitting] = useState(false);
  const setup = useMutation(api.tickets.setupTicketing);

  function addRow() {
    setRows((r) => [...r, newRow()]);
  }

  function removeRow(id: string) {
    if (rows.length > 1) setRows((r) => r.filter((x) => x.id !== id));
  }

  function updateRow(id: string, field: keyof Omit<TicketRow, "id">, value: string) {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
  }

  async function handleSubmit() {
    const ticketTypes = rows.map((r) => ({
      name: r.name.trim(),
      pricePesewas: Math.round(parseFloat(r.price || "0") * 100),
      quantityTotal: parseInt(r.quantity || "-1", 10),
    }));

    if (ticketTypes.some((t) => !t.name)) {
      toast.error("All ticket types need a name");
      return;
    }

    setSubmitting(true);
    try {
      await setup({ eventId, themeId, ticketTypes });
      toast.success("Ticketing enabled!");
    } catch {
      toast.error("Failed to enable ticketing. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardContent className="py-5 space-y-5">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Ticket className="size-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold">Enable E-Ticketing</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Sell tickets and verify attendance with QR codes.
            </p>
          </div>
        </div>

        {/* Theme */}
        <div className="space-y-1.5">
          <Label>Ticket Theme</Label>
          <Select value={themeId} onValueChange={setThemeId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TICKET_THEMES.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                  <span className="ml-1.5 text-muted-foreground text-xs">— {t.description}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ticket types */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Ticket Types</p>
              <p className="text-xs text-muted-foreground">Define price tiers for this event.</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addRow} className="shrink-0">
              <Plus className="size-3.5 mr-1" />
              Add Type
            </Button>
          </div>

          <div className="space-y-2">
            <div className="hidden md:grid grid-cols-[1fr_8rem_8rem_2.25rem] gap-2 px-1">
              <p className="text-xs text-muted-foreground font-medium">Name *</p>
              <p className="text-xs text-muted-foreground font-medium">Price (GHS) *</p>
              <p className="text-xs text-muted-foreground font-medium">Qty (-1 = ∞)</p>
              <span />
            </div>

            {rows.map((row, i) => (
              <div key={row.id} className="flex items-center gap-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                  {i + 1}
                </span>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_8rem_8rem] gap-2">
                  <Input
                    placeholder="e.g. General Admission"
                    value={row.name}
                    onChange={(e) => updateRow(row.id, "name", e.target.value)}
                  />
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    value={row.price}
                    onChange={(e) => updateRow(row.id, "price", e.target.value)}
                  />
                  <Input
                    type="number"
                    min={-1}
                    placeholder="-1"
                    value={row.quantity}
                    onChange={(e) => updateRow(row.id, "quantity", e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => removeRow(row.id)}
                  disabled={rows.length === 1}
                  aria-label="Remove row"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}

            <p className="text-xs text-muted-foreground px-1">
              Price in GHS — e.g. <span className="font-mono">10.50</span>. Use{" "}
              <span className="font-mono">-1</span> for unlimited tickets.
            </p>
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={submitting} className="w-full">
          {submitting && <Loader2 className="size-4 mr-2 animate-spin" />}
          Enable Ticketing
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Ticketing dashboard ──────────────────────────────────────────────────────

function TicketingDashboard({
  eventId,
  readonly,
}: {
  eventId: Id<"events">;
  readonly: boolean;
}) {
  const ticketInfo  = useQuery(api.tickets.getEventTicketInfo, { eventId });
  const accessCodes = useQuery(api.tickets.getScanAccessCodes, { eventId });
  const entries     = useQuery(api.tickets.getScanActivity, { eventId });

  const generateCode = useMutation(api.tickets.generateScanAccessCode);
  const toggle       = useMutation(api.tickets.toggleScanAccessCode);
  const addType      = useMutation(api.tickets.addTicketType);

  // Scan code dialog
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);
  const [staffName, setStaffName]           = useState("");
  const [staffRole, setStaffRole]           = useState("");
  const [staffPhone, setStaffPhone]         = useState("");
  const [generatedCode, setGeneratedCode]   = useState<string | null>(null);
  const [generating, setGenerating]         = useState(false);
  const [copied, setCopied]                 = useState<string | null>(null);

  // Add ticket type dialog
  const [typeDialogOpen, setTypeDialogOpen] = useState(false);
  const [typeName, setTypeName]             = useState("");
  const [typePrice, setTypePrice]           = useState("20");
  const [typeQty, setTypeQty]               = useState("100");
  const [addingType, setAddingType]         = useState(false);

  // Group scan entries by access code id for the activity tab
  const entriesByCode = useMemo(() => {
    const map = new Map<string, NonNullable<typeof entries>>();
    for (const entry of entries ?? []) {
      const key = entry.scanAccessCodeId as string;
      const arr = map.get(key) ?? [];
      arr.push(entry);
      map.set(key, arr);
    }
    return map;
  }, [entries]);

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleGenerateCode() {
    if (!staffName.trim() || !staffRole.trim()) return;
    setGenerating(true);
    try {
      const result = await generateCode({
        eventId,
        staffName: staffName.trim(),
        staffRole: staffRole.trim(),
        staffPhone: staffPhone.trim() || undefined,
      });
      setGeneratedCode(result.code);
    } catch {
      toast.error("Failed to generate code. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  function handleCodeDialogClose() {
    setCodeDialogOpen(false);
    setStaffName("");
    setStaffRole("");
    setStaffPhone("");
    setGeneratedCode(null);
  }

  async function handleAddType() {
    const name = typeName.trim();
    if (!name) { toast.error("Name is required"); return; }
    const pricePesewas  = Math.round(parseFloat(typePrice  || "0")  * 100);
    const quantityTotal = parseInt(typeQty || "-1", 10);

    setAddingType(true);
    try {
      await addType({ eventId, name, pricePesewas, quantityTotal });
      toast.success("Ticket type added");
      setTypeDialogOpen(false);
      setTypeName("");
      setTypePrice("20");
      setTypeQty("100");
    } catch {
      toast.error("Failed to add ticket type");
    } finally {
      setAddingType(false);
    }
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="overview">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scan-codes">Scan Codes</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* ── Overview ── */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">Ticket Types</p>
            {!readonly && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 shrink-0"
                onClick={() => setTypeDialogOpen(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Add Type</span>
              </Button>
            )}
          </div>

          {ticketInfo === undefined ? (
            <div className="h-24 rounded-xl bg-muted/40 animate-pulse" />
          ) : ticketInfo === null || ticketInfo.ticketTypes.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border py-10 text-center px-4">
              <Ticket className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No ticket types defined yet.</p>
              {!readonly && (
                <Button variant="outline" size="sm" onClick={() => setTypeDialogOpen(true)}>
                  Add First Type
                </Button>
              )}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="divide-y divide-border">
                {ticketInfo.ticketTypes.map((t) => {
                  const revenue  = (t.quantitySold * t.pricePesewas) / 100;
                  const soldOut  = t.quantityTotal !== -1 && t.quantitySold >= t.quantityTotal;
                  const unlimited = t.quantityTotal === -1;
                  return (
                    <div key={t.id as string} className="px-4 py-3 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{t.name}</p>
                          {t.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {t.description}
                            </p>
                          )}
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
                          Sold:{" "}
                          <span className="font-medium text-foreground tabular-nums">
                            {t.quantitySold}
                          </span>
                          {!unlimited && ` / ${t.quantityTotal}`}
                        </span>
                        <span>
                          Revenue:{" "}
                          <span className="font-medium text-foreground tabular-nums">
                            GHS {revenue.toFixed(2)}
                          </span>
                        </span>
                        {unlimited && <span>Unlimited capacity</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </TabsContent>

        {/* ── Scan Codes ── */}
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
                onClick={() => setCodeDialogOpen(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Generate Code</span>
                <span className="sm:hidden">Generate</span>
              </Button>
            )}
          </div>

          {accessCodes === undefined ? (
            <div className="h-24 rounded-xl bg-muted/40 animate-pulse" />
          ) : accessCodes.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border py-10 text-center px-4">
              <ShieldCheck className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No scan access codes yet.</p>
              {!readonly && (
                <Button variant="outline" size="sm" onClick={() => setCodeDialogOpen(true)}>
                  Generate First Code
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {accessCodes.map((c) => (
                <div
                  key={c._id as string}
                  className={cn(
                    "bg-card border border-border rounded-xl px-4 py-4 space-y-3",
                    !c.isActive && "opacity-60",
                  )}
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-sm font-bold tracking-wider">{c.code}</span>
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
                      <button
                        onClick={() =>
                          toggle({ scanAccessCodeId: c._id }).catch(() =>
                            toast.error("Failed to update code status"),
                          )
                        }
                        className="shrink-0"
                        aria-label="Toggle active"
                      >
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
                      {c.scansCount} scan{c.scansCount !== 1 ? "s" : ""}
                    </span>
                    <span>Last: {formatRelativeTime(c.lastScannedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Activity ── */}
        <TabsContent value="activity" className="space-y-3 mt-4">
          <p className="text-sm font-semibold">Scan Activity by Staff</p>

          {accessCodes === undefined || entries === undefined ? (
            <div className="h-24 rounded-xl bg-muted/40 animate-pulse" />
          ) : (entries ?? []).length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border py-10 text-center px-4">
              <ScanLine className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No scan activity yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {(accessCodes ?? [])
                .filter((c) => (entriesByCode.get(c._id as string) ?? []).length > 0)
                .map((c) => {
                  const codeEntries = entriesByCode.get(c._id as string) ?? [];
                  const counts = codeEntries.reduce<Record<ScanResultType, number>>(
                    (acc, e) => {
                      acc[e.result] = (acc[e.result] ?? 0) + 1;
                      return acc;
                    },
                    {} as Record<ScanResultType, number>,
                  );

                  return (
                    <details
                      key={c._id as string}
                      className="group bg-card border border-border rounded-xl overflow-hidden"
                    >
                      <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none select-none">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 min-w-0">
                          <span className="text-sm font-medium">{c.staffName}</span>
                          <Badge variant="outline" className="text-[10px] h-4 px-1.5 shrink-0">
                            {c.staffRole}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {codeEntries.length} scan{codeEntries.length !== 1 ? "s" : ""}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {(Object.entries(counts) as [ScanResultType, number][]).map(
                              ([type, n]) => {
                                const { label, className } = RESULT_CONFIG[type];
                                return (
                                  <span
                                    key={type}
                                    className={cn(
                                      "rounded-full px-2 py-0.5 text-[10px] font-medium",
                                      className,
                                    )}
                                  >
                                    {label}: {n}
                                  </span>
                                );
                              },
                            )}
                          </div>
                        </div>
                        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 transition-transform group-open:rotate-180" />
                      </summary>

                      <div className="divide-y divide-border border-t border-border">
                        {codeEntries.map((entry) => {
                          const { label, icon: Icon, className } = RESULT_CONFIG[entry.result];
                          return (
                            <div
                              key={entry._id as string}
                              className="flex items-center justify-between gap-3 px-4 py-2.5"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {entry.holderName ?? "Unknown"}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {entry.ticketTypeName} ·{" "}
                                  <span className="font-mono">{entry.ticketCode}</span>
                                </p>
                              </div>
                              <div className="flex flex-col items-end gap-1 shrink-0">
                                <span
                                  className={cn(
                                    "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                                    className,
                                  )}
                                >
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

      {/* ── Generate scan code dialog ── */}
      {!readonly && (
        <Dialog
          open={codeDialogOpen}
          onOpenChange={(open) => { if (!open) handleCodeDialogClose(); else setCodeDialogOpen(true); }}
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
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Access Code
                    </p>
                    <p className="font-mono text-xl font-bold tracking-widest break-all">
                      {generatedCode}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => handleCopy(generatedCode)}
                  >
                    {copied === generatedCode ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-green-600" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy Code
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Share this code with <strong>{staffName}</strong> ({staffRole}) to allow them
                  to access the scanner for this event.
                </p>
                <Button className="w-full" onClick={handleCodeDialogClose}>
                  Done
                </Button>
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
                  onClick={handleGenerateCode}
                  disabled={!staffName.trim() || !staffRole.trim() || generating}
                >
                  {generating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Generate Code
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* ── Add ticket type dialog ── */}
      {!readonly && (
        <Dialog open={typeDialogOpen} onOpenChange={setTypeDialogOpen}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Add Ticket Type</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="type-name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="type-name"
                  placeholder="e.g. VIP"
                  value={typeName}
                  onChange={(e) => setTypeName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="type-price">Price (GHS)</Label>
                  <Input
                    id="type-price"
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    value={typePrice}
                    onChange={(e) => setTypePrice(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="type-qty">Quantity (-1 = ∞)</Label>
                  <Input
                    id="type-qty"
                    type="number"
                    min={-1}
                    placeholder="-1"
                    value={typeQty}
                    onChange={(e) => setTypeQty(e.target.value)}
                  />
                </div>
              </div>
              <Button
                className="w-full"
                onClick={handleAddType}
                disabled={!typeName.trim() || addingType}
              >
                {addingType && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Add Ticket Type
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

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
