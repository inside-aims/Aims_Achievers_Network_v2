"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import { Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function Toggle({
  checked,
  onChange,
}: {
  checked:  boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-[22px] w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        checked ? "bg-primary" : "bg-input",
      )}
    >
      <span
        className={cn(
          "pointer-events-none block size-[18px] rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-[18px]" : "translate-x-0",
        )}
      />
    </button>
  )
}

export function Field({
  label,
  hint,
  optional,
  children,
}: {
  label:     string
  hint?:     string
  optional?: boolean
  children:  ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {label}
        {optional && <span className="ml-1 font-normal text-muted-foreground">(optional)</span>}
      </Label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  )
}

export function SaveBar({
  onSave,
  saved,
}: {
  onSave: () => void
  saved:  boolean
}) {
  return (
    <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t">
      {saved && (
        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-3.5" />
          Saved
        </span>
      )}
      <Button size="sm" onClick={onSave}>Save changes</Button>
    </div>
  )
}

export function SectionCard({
  title,
  desc,
  children,
}: {
  title:    string
  desc:     string
  children: ReactNode
}) {
  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      <div className="px-6 py-4 border-b bg-muted/30">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

export function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  hasError,
}: {
  id:          string
  value:       string
  onChange:    (v: string) => void
  placeholder: string
  hasError?:   boolean
}) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn("pr-9", hasError && "border-destructive")}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}
