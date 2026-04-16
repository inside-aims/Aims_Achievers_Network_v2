"use client"

import { useFieldArray, type Control, type FieldErrors } from "react-hook-form"
import { Plus, Trash2, Tag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { type NewEventFormValues } from "./new-event-schema"

interface Props {
  control: Control<NewEventFormValues>
  errors:  FieldErrors<NewEventFormValues>
}

export function CategoriesSection({ control, errors }: Props) {
  const { fields, prepend, remove } = useFieldArray({ control, name: "categories" })

  function addRow() {
    prepend({ name: "", description: "" })
  }

  return (
    <div className="form-section">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="form-section-title">Categories</h2>
          <p className="form-section-desc">
            Define award categories. Nominees are added after event creation.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addRow} className="shrink-0">
          <Plus className="size-3.5 mr-1" />
          <span className="hidden md:inline">Add Category</span>
        </Button>
      </div>

      {/* Array-level validation error */}
      {typeof errors.categories?.message === "string" && (
        <p className="text-xs font-medium text-destructive">{errors.categories.message}</p>
      )}

      {fields.length === 0 ? (
        <button
          type="button"
          onClick={addRow}
          className="w-full flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border py-8 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors"
        >
          <Tag className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No categories yet - click to add one</p>
        </button>
      ) : (
        <div className="space-y-2">
          {/* Column labels — hidden on mobile */}
          <div className="hidden md:grid md:grid-cols-[1.25rem_1fr_1fr_2rem] gap-2 px-1">
            <span />
            <p className="text-xs text-muted-foreground font-medium">Name *</p>
            <p className="text-xs text-muted-foreground font-medium">Description (optional)</p>
            <span />
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-2">
              {/* Number badge */}
              <div className="flex h-9 shrink-0 items-center">
                <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                  {index + 1}
                </span>
              </div>

              {/* Name + description inputs */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                <FormField
                  control={control}
                  name={`categories.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormControl>
                        <Input placeholder="e.g. Best Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`categories.${index}.description`}
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormControl>
                        <Input placeholder="Short description..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Remove button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={() => remove(index)}
                aria-label={`Remove category ${index + 1}`}
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
