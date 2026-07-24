"use client"

import { Ticket, Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// ─── Types ──────────────────────────────────────────────────────────────────

/** UI-only draft shape — GHS-decimal strings as typed into the inputs. */
export interface TicketTypeDraft {
  name: string
  priceGhs: string
  quantityTotal: string
}

/** DB/mutation shape — the only place GHS is converted to integer pesewas. */
export interface TicketTypePayload {
  name: string
  pricePesewas: number
  quantityTotal: number
}

export function emptyTicketTypeDraft(): TicketTypeDraft {
  return { name: "", priceGhs: "20", quantityTotal: "100" }
}

/** Single validation boundary — used by the create-form's zod superRefine
 *  and by the two plain-React call sites before they submit. */
export function validateTicketTypeDraft(draft: TicketTypeDraft): string | null {
  if (!draft.name.trim()) return "Ticket type name is required"

  const price = Number(draft.priceGhs)
  if (draft.priceGhs.trim() === "" || Number.isNaN(price) || price < 0) {
    return "Price must be 0 or greater"
  }

  const qty = Number(draft.quantityTotal)
  if (
    draft.quantityTotal.trim() === "" ||
    !Number.isInteger(qty) ||
    (qty !== -1 && qty <= 0)
  ) {
    return "Enter a quantity greater than 0, or -1 for unlimited"
  }

  return null
}

/** Single GHS→pesewas conversion boundary. Caller must have already
 *  validated via validateTicketTypeDraft — this does not re-validate. */
export function draftToTicketTypePayload(draft: TicketTypeDraft): TicketTypePayload {
  return {
    name: draft.name.trim(),
    pricePesewas: Math.round(Number(draft.priceGhs) * 100),
    quantityTotal: Math.trunc(Number(draft.quantityTotal)),
  }
}

// ─── Single row ─────────────────────────────────────────────────────────────

interface TicketTypeFieldsProps {
  value: TicketTypeDraft
  onChange: (draft: TicketTypeDraft) => void
  error?: string | null
  idPrefix?: string
}

/** One row of controlled ticket-type inputs — no add/remove chrome. */
export function TicketTypeFields({ value, onChange, error, idPrefix }: TicketTypeFieldsProps) {
  return (
    <div className="space-y-1">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_7rem_7rem] gap-2">
        <Input
          id={idPrefix ? `${idPrefix}-name` : undefined}
          placeholder="e.g. General Admission"
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
        />
        <Input
          id={idPrefix ? `${idPrefix}-price` : undefined}
          type="number"
          min={0}
          step={0.01}
          placeholder="Price (GHS)"
          value={value.priceGhs}
          onChange={(e) => onChange({ ...value, priceGhs: e.target.value })}
        />
        <Input
          id={idPrefix ? `${idPrefix}-qty` : undefined}
          type="number"
          min={-1}
          placeholder="-1 = unlimited"
          value={value.quantityTotal}
          onChange={(e) => onChange({ ...value, quantityTotal: e.target.value })}
        />
      </div>
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  )
}

// ─── Array editor ───────────────────────────────────────────────────────────

interface TicketTypeEditorProps {
  value: TicketTypeDraft[]
  onChange: (rows: TicketTypeDraft[]) => void
  minRows?: number
  arrayError?: string | null
  /** Per-row error messages (e.g. from react-hook-form field state). When
   *  omitted, rows show no live validation error — callers that only
   *  validate at submit time (SetupPanel, Add Type dialog) rely on this. */
  rowErrors?: (string | null | undefined)[]
}

/** Repeatable ticket-type rows — numbered, addable, per-row deletable, with
 *  the same dashed empty-state affordance used by categories-section.tsx. */
export function TicketTypeEditor({ value, onChange, minRows = 0, arrayError, rowErrors }: TicketTypeEditorProps) {
  function addRow() {
    onChange([...value, emptyTicketTypeDraft()])
  }

  function updateRow(index: number, draft: TicketTypeDraft) {
    onChange(value.map((row, i) => (i === index ? draft : row)))
  }

  function removeRow(index: number) {
    if (value.length <= minRows) return
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium">Ticket Types</p>
          <p className="text-xs text-muted-foreground">
            Define the ticket categories available for purchase.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addRow} className="shrink-0">
          <Plus className="size-3.5 mr-1" />
          <span className="hidden md:inline">Add Type</span>
        </Button>
      </div>

      {arrayError && <p className="text-xs font-medium text-destructive">{arrayError}</p>}

      {value.length === 0 ? (
        <button
          type="button"
          onClick={addRow}
          className="w-full flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border py-8 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors"
        >
          <Ticket className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No ticket types yet — click to add one</p>
        </button>
      ) : (
        <div className="space-y-2">
          <div className="hidden md:grid md:grid-cols-[1.25rem_1fr_7rem_7rem_2rem] gap-2 px-1">
            <span />
            <p className="text-xs text-muted-foreground font-medium">Name *</p>
            <p className="text-xs text-muted-foreground font-medium">Price (GHS) *</p>
            <p className="text-xs text-muted-foreground font-medium">Quantity *</p>
            <span />
          </div>

          {value.map((row, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="flex h-9 shrink-0 items-center">
                <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                  {index + 1}
                </span>
              </div>

              <div className="flex-1">
                <TicketTypeFields
                  value={row}
                  onChange={(draft) => updateRow(index, draft)}
                  error={rowErrors?.[index] ?? null}
                />
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={() => removeRow(index)}
                disabled={value.length <= minRows}
                aria-label={`Remove ticket type ${index + 1}`}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}

          <p className="text-xs text-muted-foreground px-1">
            Enter price in GHS — e.g. <span className="font-mono">10.50</span> for GHS 10.50.
            Use <span className="font-mono">-1</span> quantity for unlimited tickets.
          </p>
        </div>
      )}
    </div>
  )
}
