"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  PAYOUT_METHODS,
  MOMO_NETWORKS,
  type PayoutMethod,
} from "./settings.data"
import { Field, SaveBar, SectionCard } from "./settings-primitives"

const PAYOUT_INITIAL = {
  method:    "momo" as PayoutMethod,
  network:   MOMO_NETWORKS[0].value,
  momoNum:   "",
  bankName:  "",
  accNum:    "",
  accName:   "",
}

const THRESHOLD_INITIAL = "100"

export function BillingTab() {
  const [method,    setMethod]    = useState<PayoutMethod>(PAYOUT_INITIAL.method)
  const [network,   setNetwork]   = useState(PAYOUT_INITIAL.network)
  const [momoNum,   setMomoNum]   = useState(PAYOUT_INITIAL.momoNum)
  const [bankName,  setBankName]  = useState(PAYOUT_INITIAL.bankName)
  const [accNum,    setAccNum]    = useState(PAYOUT_INITIAL.accNum)
  const [accName,   setAccName]   = useState(PAYOUT_INITIAL.accName)
  const [threshold, setThreshold] = useState(THRESHOLD_INITIAL)
  const [payoutSaved,    setPayoutSaved]    = useState(false)

  const payoutDirty =
    method   !== PAYOUT_INITIAL.method   ||
    network  !== PAYOUT_INITIAL.network  ||
    momoNum  !== PAYOUT_INITIAL.momoNum  ||
    bankName !== PAYOUT_INITIAL.bankName ||
    accNum   !== PAYOUT_INITIAL.accNum   ||
    accName  !== PAYOUT_INITIAL.accName

  function saveMethod()    { setPayoutSaved(true);    setTimeout(() => setPayoutSaved(false),    2500) }

  return (
    <div className="space-y-5">
      <SectionCard title="Payout method" desc="Where your earnings are sent after voting closes.">
        <div className="grid grid-cols-2 gap-3 mb-5">
          {PAYOUT_METHODS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              className={cn(
                "rounded-xl border p-4 text-left transition-all",
                method === m.id
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "hover:bg-muted/40",
              )}
            >
              <p className="text-sm font-semibold">{m.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
            </button>
          ))}
        </div>

        {method === "momo" ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Network">
              <Select value={network} onValueChange={setNetwork}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MOMO_NETWORKS.map((n) => (
                    <SelectItem key={n.value} value={n.value}>{n.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="MoMo number">
              <Input
                value={momoNum}
                onChange={(e) => setMomoNum(e.target.value)}
                placeholder="024 000 0000"
              />
            </Field>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Bank name">
              <Input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g. GCB Bank" />
            </Field>
            <Field label="Account number">
              <Input value={accNum} onChange={(e) => setAccNum(e.target.value)} placeholder="0123456789" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Account name">
                <Input value={accName} onChange={(e) => setAccName(e.target.value)} placeholder="Name on account" />
              </Field>
            </div>
          </div>
        )}

        <SaveBar onSave={saveMethod} saved={payoutSaved} disabled={!payoutDirty} />
      </SectionCard>

      <SectionCard
        title="Payout threshold"
        desc="Payouts are processed once your balance meets this amount."
      >
        <div className="max-w-xs">
          <Field label="Minimum payout (GHS)" hint="Payments below this amount will not be processed.">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium pointer-events-none select-none">
                GHS
              </span>
              <Input
                type="number"
                min="50"
                step="0.01"
                value={threshold}
                disabled
                onChange={(e) => setThreshold(e.target.value)}
                className="pl-12"
              />
            </div>
          </Field>
        </div>
      </SectionCard>
    </div>
  )
}
