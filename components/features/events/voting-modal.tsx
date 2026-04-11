'use client';

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { NomineeProps, VotingConfig } from "@/components/features/events/index";
import { CheckCircle2, Copy, Check, CreditCard, Phone, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VotingModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  nominee: NomineeProps | null;
  votingConfig: VotingConfig | null;
}

type Tab = "online" | "ussd";

const USSD_STEPS = [
  "Dial *920*401#",
  "Select 1 for E-Voting",
  "Enter nominee code: {nomineeCode}",
  "Confirm the nominee details",
  "Enter the amount to vote with",
  "Approve the mobile money prompt",
];

const VotingModal = ({ open, setOpen, nominee, votingConfig }: VotingModalProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("online");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [amountGHS, setAmountGHS] = useState<string>("");
  const [selectedTierIndex, setSelectedTierIndex] = useState<number | null>(null);
  const [phoneError, setPhoneError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const createPaymentIntent = useMutation(api.voting.createPaymentIntent);

  if (!nominee || !votingConfig) return null;

  const { nomineeCode, fullName } = nominee;
  const { votingMode, pricePerVotePesewas, bulkTiers, votingOpen } = votingConfig;

  // ── Derived values ───────────────────────────────────────────────────────────
  const isBulk = votingMode === "bulk";
  const selectedTier = isBulk && selectedTierIndex !== null ? bulkTiers[selectedTierIndex] : null;
  const resolvedAmountPesewas = isBulk
    ? (selectedTier?.amountPesewas ?? 0)
    : Math.round(parseFloat(amountGHS || "0") * 100);
  const resolvedVotes = isBulk
    ? (selectedTier?.votes ?? 0)
    : Math.floor(resolvedAmountPesewas / pricePerVotePesewas);

  // ── Validation ───────────────────────────────────────────────────────────────
  function validatePhone(value: string): boolean {
    if (!value) {
      setPhoneError("Phone number is required");
      return false;
    }
    if (!/^0[0-9]{9}$/.test(value.trim())) {
      setPhoneError("Enter a valid 10-digit Ghana number (e.g. 0551234567)");
      return false;
    }
    setPhoneError("");
    return true;
  }

  function isFormValid(): boolean {
    if (isBulk) return selectedTierIndex !== null && !phoneError && !!phone;
    return (
      resolvedAmountPesewas >= pricePerVotePesewas &&
      resolvedAmountPesewas % pricePerVotePesewas === 0 &&
      !phoneError &&
      !!phone
    );
  }

  // ── Submit ───────────────────────────────────────────────────────────────────
  async function handleProceed() {
    if (!validatePhone(phone)) return;
    if (!isFormValid()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const { providerReference } = await createPaymentIntent({
        eventId: votingConfig.eventDocId as Id<"events">,
        nomineeId: nominee.nomineeId as Id<"nominees">,
        categoryId: votingConfig.categoryDocId as Id<"categories">,
        amountPesewas: resolvedAmountPesewas,
        provider: "paystack",
      });

      const resolvedEmail = email.trim() || `${phone}@voter.aimsnetwork.com`;

      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: providerReference,
          amountPesewas: resolvedAmountPesewas,
          email: resolvedEmail,
          phone,
          metadata: {
            nominee_name: fullName,
            nominee_code: nomineeCode,
            nominee_id: nominee.nomineeId,
            phone_number: phone,
          },
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.authorization_url) {
        throw new Error(json.message ?? "Failed to initialize payment");
      }

      window.location.href = json.authorization_url;
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  function handleCopyCode() {
    navigator.clipboard.writeText(nomineeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  function handleClose(val: boolean) {
    if (status === "loading") return; // prevent dismiss while redirecting
    setOpen(val);
    // Reset form on close
    setPhone("");
    setEmail("");
    setAmountGHS("");
    setSelectedTierIndex(null);
    setPhoneError("");
    setStatus("idle");
    setErrorMsg("");
    setActiveTab("online");
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-bold">Vote for {fullName}</DialogTitle>
          <DialogDescription className="text-sm">
            Code: <span className="font-mono font-semibold text-primary">{nomineeCode}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Tab switcher */}
        <div className="flex rounded-lg border border-border bg-muted p-1 gap-1">
          <TabButton
            active={activeTab === "online"}
            icon={<CreditCard className="h-4 w-4" />}
            label="Pay Online"
            onClick={() => setActiveTab("online")}
            disabled={status === "loading"}
          />
          <TabButton
            active={activeTab === "ussd"}
            icon={<Phone className="h-4 w-4" />}
            label="USSD"
            onClick={() => setActiveTab("ussd")}
            disabled={status === "loading"}
          />
        </div>

        {/* ── Pay Online tab ───────────────────────────────────────────────── */}
        {activeTab === "online" && (
          <div className="space-y-4 pt-1">
            {!votingOpen && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
                Voting is currently closed for this event.
              </div>
            )}

            {/* Bulk tiers */}
            {isBulk && bulkTiers.length > 0 && (
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium">
                  Select a vote package <span className="text-destructive">*</span>
                </legend>
                <div className="grid grid-cols-1 gap-2">
                  {bulkTiers.map((tier, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedTierIndex(i)}
                      className={cn(
                        "flex items-center justify-between rounded-md border px-4 py-3 text-sm transition-colors",
                        selectedTierIndex === i
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border bg-card hover:border-primary/40",
                      )}
                    >
                      <span className="font-semibold">
                        GHS {(tier.amountPesewas / 100).toFixed(2)}
                      </span>
                      <span className="text-muted-foreground">
                        {tier.votes} vote{tier.votes !== 1 ? "s" : ""}
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {/* Standard amount input */}
            {!isBulk && (
              <div className="space-y-1">
                <Label htmlFor="amount">
                  Amount (GHS) <span className="text-destructive">*</span>
                  <span className="ml-2 font-normal text-muted-foreground">
                    — GHS 1 = {Math.floor(100 / pricePerVotePesewas * 100) / 100} vote
                    {Math.floor(100 / pricePerVotePesewas) !== 1 ? "s" : ""}
                  </span>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  min={(pricePerVotePesewas / 100).toString()}
                  step={(pricePerVotePesewas / 100).toString()}
                  placeholder="Enter amount in GHS"
                  value={amountGHS}
                  onChange={(e) => setAmountGHS(e.target.value)}
                  disabled={status === "loading"}
                />
                {resolvedVotes > 0 && (
                  <p className="text-xs text-muted-foreground">
                    = <span className="font-semibold text-primary">{resolvedVotes} vote{resolvedVotes !== 1 ? "s" : ""}</span>
                  </p>
                )}
              </div>
            )}

            {/* Phone */}
            <div className="space-y-1">
              <Label htmlFor="phone">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0551234567"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (phoneError) setPhoneError("");
                }}
                onBlur={() => phone && validatePhone(phone)}
                aria-invalid={!!phoneError}
                disabled={status === "loading"}
              />
              {phoneError && (
                <p className="text-xs text-destructive">{phoneError}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Used to send your vote confirmation via SMS
              </p>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
              />
            </div>

            {/* Error */}
            {status === "error" && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
                {errorMsg}
              </div>
            )}

            {/* Submit */}
            <Button
              className="w-full"
              onClick={handleProceed}
              disabled={!isFormValid() || !votingOpen || status === "loading"}
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting to payment…
                </>
              ) : (
                `Pay GHS ${isBulk
                  ? selectedTier
                    ? (selectedTier.amountPesewas / 100).toFixed(2)
                    : "—"
                  : parseFloat(amountGHS || "0").toFixed(2)
                }`
              )}
            </Button>
          </div>
        )}

        {/* ── USSD tab ─────────────────────────────────────────────────────── */}
        {activeTab === "ussd" && (
          <div className="space-y-4 pt-1">
            {/* Nominee code highlight */}
            <div className="flex items-center justify-between rounded-md border-2 border-primary/20 bg-muted px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Nominee Code</p>
                <p className="mt-0.5 font-mono text-2xl font-bold text-primary">{nomineeCode}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleCopyCode}>
                {copied ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Steps */}
            <div className="space-y-2">
              {USSD_STEPS.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </div>
                  <div className="flex flex-1 items-start justify-between pt-1">
                    <p className="text-sm leading-relaxed">
                      {step.replace("{nomineeCode}", nomineeCode)}
                    </p>
                    <CheckCircle2 className="ml-2 mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground/30" />
                  </div>
                </div>
              ))}
            </div>

            {/* Info */}
            <div className="rounded-md border border-border bg-accent px-3 py-2">
              <p className="text-xs text-accent-foreground text-center">
                Make sure you have sufficient mobile money balance before voting
              </p>
            </div>

            <Button variant="default" className="w-full" onClick={() => handleClose(false)}>
              Got it!
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

function TabButton({
  active,
  icon,
  label,
  onClick,
  disabled,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

export default VotingModal;
