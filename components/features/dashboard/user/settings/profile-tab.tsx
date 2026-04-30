"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Field, SaveBar, SectionCard } from "./settings-primitives"

export function ProfileTab() {
  const profile = useQuery(api.organizerProfiles.getCurrent)
  const updateProfile = useMutation(api.organizerProfiles.update)

  const [name, setName]   = useState("")
  const [bio, setBio]     = useState("")
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  // Sync local state when profile loads
  useEffect(() => {
    if (profile) {
      setName(profile.displayName ?? "")
      setBio(profile.bio ?? "")
    }
  }, [profile])

  const dirty =
    profile !== undefined &&
    (name !== (profile?.displayName ?? "") || bio !== (profile?.bio ?? ""))

  async function save() {
    if (!dirty) return
    setSaving(true)
    try {
      await updateProfile({ displayName: name, bio })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?"

  if (profile === undefined) {
    return (
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b bg-muted/30">
          <Skeleton className="h-4 w-32 mb-1.5" />
          <Skeleton className="h-3 w-56" />
        </div>
        <div className="px-6 py-5 space-y-5">
          <div className="flex items-center gap-4 pb-5 border-b">
            <Skeleton className="size-14 rounded-full shrink-0" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Skeleton className="h-9 rounded-md" />
            <Skeleton className="h-9 rounded-md" />
          </div>
          <Skeleton className="h-20 rounded-md" />
        </div>
      </div>
    )
  }

  if (profile === null) return null

  return (
    <SectionCard title="Your identity" desc="This is how you appear inside the platform.">
      <div className="flex items-center gap-4 pb-5 mb-5 border-b">
        <div className="size-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0 select-none">
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold">{name || "Your name"}</p>
          <p className="text-xs text-muted-foreground mt-0.5 capitalize">{profile.role}</p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Display name">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
        </Field>
        <Field label="Email address" hint="Managed by your account provider — cannot be changed.">
          <Input
            value={profile.email ?? ""}
            readOnly
            className="bg-muted/50 text-muted-foreground cursor-not-allowed"
          />
        </Field>
      </div>

      <div className="mt-5 space-y-1.5">
        <div className="flex items-baseline justify-between">
          <Label className="text-sm font-medium">
            Bio <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <span className="text-[11px] text-muted-foreground tabular-nums">{bio.length}/160</span>
        </div>
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value.slice(0, 160))}
          placeholder="A short description about you or your organisation…"
          className="resize-none"
          rows={3}
        />
      </div>

      <SaveBar onSave={save} saved={saved} disabled={!dirty || saving} />
    </SectionCard>
  )
}
