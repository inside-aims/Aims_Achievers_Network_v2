"use client"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  label: string
  description?: string
  count: number
  onAdd: () => void
  onRemove: (index: number) => void
  renderRow: (index: number) => React.ReactNode
  emptyLabel: string
}

/** Numbered-row / add-button / dashed-empty-state pattern shared by the
 *  event-details array fields (agenda, lineup, social links, FAQs, sponsors). */
export function RepeatableFieldGroup({
  label,
  description,
  count,
  onAdd,
  onRemove,
  renderRow,
  emptyLabel,
}: Props) {
  return (
    <div className="space-y-2 md:space-y-3">
      <div className="flex items-start justify-between gap-3 md:gap-4">
        <div>
          <p className="text-xs md:text-sm font-medium">{label}</p>
          {description && (
            <p className="text-[10px] md:text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onAdd} className="shrink-0">
          <Plus className="size-3.5 mr-1" />
          <span className="hidden md:inline">Add</span>
        </Button>
      </div>

      {count === 0 ? (
        <button
          type="button"
          onClick={onAdd}
          className="w-full flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border py-5 md:py-6 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors"
        >
          <Plus className="size-4 md:size-5 text-muted-foreground" />
          <p className="text-xs md:text-sm text-muted-foreground">{emptyLabel}</p>
        </button>
      ) : (
        <div className="space-y-2">
          {Array.from({ length: count }).map((_, index) => (
            <div key={index} className="flex items-start gap-1.5 md:gap-2">
              <div className="flex h-9 shrink-0 items-center">
                <span className="flex size-4 md:size-5 items-center justify-center rounded-full bg-primary/10 text-[9px] md:text-[10px] font-bold text-primary">
                  {index + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0">{renderRow(index)}</div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 md:size-9 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={() => onRemove(index)}
                aria-label={`Remove ${label.toLowerCase()} ${index + 1}`}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
