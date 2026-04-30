"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
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
  type MomoNetwork,
} from "./settings.data"
import { Field, SaveBar, SectionCard } from "./settings-primitives"

const DEFAULT_METHOD: PayoutMethod = "momo"
const DEFAULT_NETWORK: MomoNetwork = MOMO_NETWORKS[0].value

export function BillingTab() {
  const profile       = useQuery(api.organizerProfiles.getCurrent)
  const updateProfile = useMutation(api.organizerProfiles.update)

  const [method,   setMethod]   = useState<PayoutMethod>(DEFAULT_METHOD)
  const [network,  setNetwork]  = useState<MomoNetwork>(DEFAULT_NETWORK)
  const [momoNum,  setMomoNum]  = useState("")
  const [momoName, setMomoName] = useState("")
  const [bankName, setBankName] = useState("")
  const [accNum,   setAccNum]   = useState("")
  const [accName,  setAccName]  = useState("")
  const [saved,    setSaved]    = useState(false)
  const [saving,   setSaving]   = useState(false)

  useEffect(() => {
    if (profile) {
      setMethod(profile.payoutMethod ?? DEFAULT_METHOD)
      setNetwork(profile.momoNetwork ?? DEFAULT_NETWORK)
      setMomoNum(profile.momoNumber ?? "")
      setMomoName(profile.momoName ?? "")
      setBankName(profile.bankName ?? "")
      setAccNum(profile.bankAccountNumber ?? "")
      setAccName(profile.bankAccountName ?? "")
    }
  }, [profile])

  const dirty =
    profile !== undefined &&
    (
      method   !== (profile.payoutMethod ?? DEFAULT_METHOD) ||
      network  !== (profile.momoNetwork ?? DEFAULT_NETWORK) ||
      momoNum  !== (profile.momoNumber ?? "") ||
      momoName !== (profile.momoName ?? "") ||
      bankName !== (profile.bankName ?? "") ||
      accNum   !== (profile.bankAccountNumber ?? "") ||
      accName  !== (profile.bankAccountName ?? "")
    )

  async function save() {
    if (!dirty) return
    setSaving(true)
    try {
      await updateProfile({
        payoutMethod: method,
        momoNetwork: method === "momo" ? network : undefined,
        momoNumber: method === "momo" ? momoNum : undefined,
        momoName: method === "momo" ? momoName : undefined,
        bankName: method === "bank" ? bankName : undefined,
        bankAccountNumber: method === "bank" ? accNum : undefined,
        bankAccountName: method === "bank" ? accName : undefined,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  if (profile === undefined) {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b bg-muted/30">
            <Skeleton className="h-4 w-32 mb-1.5" />
            <Skeleton className="h-3 w-56" />
          </div>
          <div className="px-6 py-5 space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Skeleton className="h-9 rounded-md" />
              <Skeleton className="h-9 rounded-md" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b bg-muted/30">
            <Skeleton className="h-4 w-40 mb-1.5" />
            <Skeleton className="h-3 w-64" />
          </div>
          <div className="px-6 py-5">
            <Skeleton className="h-9 w-40 rounded-md" />
          </div>
        </div>
      </div>
    )
  }

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
              <Select value={network} onValueChange={(v) => setNetwork(v as MomoNetwork)}>
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
            <div className="sm:col-span-2">
              <Field label="Account name">
                <Input
                  value={momoName}
                  onChange={(e) => setMomoName(e.target.value)}
                  placeholder="Name registered on the MoMo account"
                />
              </Field>
            </div>
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

        <SaveBar onSave={save} saved={saved} disabled={!dirty || saving} />
      </SectionCard>

      <SectionCard
        title="Payout threshold"
        desc="The minimum balance required before a payout can be requested. This is set by the platform."
      >
        <div className="max-w-xs">
          <Field
            label="Minimum payout (GHS)"
            hint="This value is configured by the platform administrator and cannot be changed."
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium pointer-events-none select-none">
                GHS
              </span>
              <Input
                value="50.00"
                disabled
                className="pl-12 bg-muted/50 text-muted-foreground cursor-not-allowed"
                readOnly
              />
            </div>
          </Field>
        </div>
      </SectionCard>
    </div>
  )
}
