"use client"

import { useState } from "react"
import { useAction } from "convex/react"
import { toast } from "sonner"
import { AlertTriangle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { api } from "@/convex/_generated/api"
import { PASSWORD_FIELDS, type PwFieldId } from "./settings.data"
import { Field, SaveBar, SectionCard, PasswordInput } from "./settings-primitives"

export function SecurityTab() {
  const changePassword = useAction(api.users.verifyAndChangePassword)

  const [passwords, setPasswords] = useState<Record<PwFieldId, string>>({
    "cur-pw":  "",
    "new-pw":  "",
    "conf-pw": "",
  })
  const [saving,    setSaving]    = useState(false)
  const [saved,     setSaved]     = useState(false)
  const [danger,    setDanger]    = useState(false)
  const [deleteVal, setDeleteVal] = useState("")

  const mismatch =
    passwords["new-pw"].length > 0 &&
    passwords["conf-pw"].length > 0 &&
    passwords["new-pw"] !== passwords["conf-pw"]

  const canSavePassword =
    passwords["cur-pw"].length > 0 &&
    passwords["new-pw"].length >= 8 &&
    passwords["conf-pw"].length > 0 &&
    !mismatch &&
    !saving

  function setField(id: PwFieldId, val: string) {
    setPasswords((p) => ({ ...p, [id]: val }))
  }

  async function savePassword() {
    if (!canSavePassword) return
    setSaving(true)
    try {
      await changePassword({
        currentPassword: passwords["cur-pw"],
        newPassword: passwords["new-pw"],
      })
      setSaved(true)
      setPasswords({ "cur-pw": "", "new-pw": "", "conf-pw": "" })
      setTimeout(() => setSaved(false), 2500)
      toast.success("Password updated", { description: "Your password has been changed successfully." })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong"
      toast.error("Failed to update password", { description: msg })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <SectionCard title="Change password" desc="Use a strong password you don't use on other sites.">
        <div className="space-y-4 max-w-sm">
          {PASSWORD_FIELDS.map(({ id, label, placeholder }) => (
            <Field key={id} label={label}>
              <>
                <PasswordInput
                  id={id}
                  value={passwords[id]}
                  onChange={(v) => setField(id, v)}
                  placeholder={placeholder}
                  hasError={id === "conf-pw" && mismatch}
                />
                {id === "conf-pw" && mismatch && (
                  <p className="text-xs text-destructive mt-1">Passwords do not match.</p>
                )}
              </>
            </Field>
          ))}
        </div>
        <SaveBar onSave={savePassword} saved={saved} disabled={!canSavePassword} />
      </SectionCard>

      <div className={cn("rounded-2xl border border-destructive/40 overflow-hidden")}>
        <div className="flex items-center gap-2.5 px-6 py-4 bg-destructive/5 border-b border-destructive/20">
          <AlertTriangle className="size-4 text-destructive shrink-0" />
          <div>
            <p className="text-sm font-semibold text-destructive">Danger zone</p>
            <p className="text-xs text-muted-foreground mt-0.5">These actions are permanent and cannot be undone.</p>
          </div>
        </div>
        <div className="px-6 py-5">
          {!danger ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Delete account</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Permanently removes your organiser account and all associated events.
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="shrink-0"
                onClick={() => setDanger(true)}
              >
                <Trash2 className="size-3.5 mr-1.5" />
                Delete account
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium text-destructive">
                Type{" "}
                <code className="font-mono bg-destructive/10 px-1.5 py-0.5 rounded">DELETE</code>{" "}
                to confirm.
              </p>
              <div className="flex items-center gap-2 max-w-xs">
                <Input
                  value={deleteVal}
                  onChange={(e) => setDeleteVal(e.target.value)}
                  placeholder="DELETE"
                  className="font-mono"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deleteVal !== "DELETE"}
                  className="shrink-0"
                >
                  Confirm
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0"
                  onClick={() => { setDanger(false); setDeleteVal("") }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
