"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DUMMY_PROFILE } from "./settings.data"
import { Field, SaveBar, SectionCard } from "./settings-primitives"

export function ProfileTab() {
  const [name,  setName]  = useState(DUMMY_PROFILE.name)
  const [bio,   setBio]   = useState(DUMMY_PROFILE.bio)
  const [saved, setSaved] = useState(false)

  const dirty = name !== DUMMY_PROFILE.name || bio !== DUMMY_PROFILE.bio
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?"

  function save() { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  return (
    <SectionCard title="Your identity" desc="This is how you appear inside the platform.">
      <div className="flex items-center gap-4 pb-5 mb-5 border-b">
        <div className="size-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0 select-none">
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold">{name || "Your name"}</p>
          <p className="text-xs text-muted-foreground mt-0.5 capitalize">{DUMMY_PROFILE.role}</p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Display name">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
        </Field>
        <Field label="Email address" hint="Managed by your account provider — cannot be changed.">
          <Input
            value={DUMMY_PROFILE.email}
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

      <SaveBar onSave={save} saved={saved} disabled={!dirty} />
    </SectionCard>
  )
}
