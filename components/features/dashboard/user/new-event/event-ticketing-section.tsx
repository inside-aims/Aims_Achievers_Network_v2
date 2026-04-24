"use client"

import { useFieldArray, useWatch, type Control, type FieldErrors } from "react-hook-form"
import { Ticket, Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

export function EventTicketingSection({ control, errors }: Props) {
  const ticketingEnabled = useWatch({ control, name: "ticketingEnabled" })
  const { fields, append, remove, replace } = useFieldArray({ control, name: "ticketTypes" })

  function handleToggle(value: string) {
    if (value === "no") replace([])
  }

  function addRow() {
    append({ name: "", price: 20, quantity: 100 })
  }

  return (
    <div className="form-section">
      <div>
        <h2 className="form-section-title">Ticketing</h2>
        <p className="form-section-desc">Sell entry tickets and track attendance with QR codes.</p>
      </div>

      {/* Enable toggle */}
      <FormField
        control={control}
        name="ticketingEnabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-3 gap-4 space-y-0">
            <div className="flex items-start gap-3 min-w-0">
              <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <Ticket className="size-3.5 text-primary" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <p className="text-sm font-medium leading-none">Enable E-Tickets</p>
                <p className="text-xs text-muted-foreground">
                  Sell tickets for this event and verify attendance via QR codes.
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <Select
                onValueChange={(v) => { field.onChange(v); handleToggle(v); }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-[4.5rem]">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Ticket types — shown only when enabled */}
      {ticketingEnabled === "yes" && (
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

          {typeof (errors.ticketTypes as { message?: string })?.message === "string" && (
            <p className="text-xs font-medium text-destructive">
              {(errors.ticketTypes as { message?: string }).message}
            </p>
          )}

          {fields.length === 0 ? (
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

              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <div className="flex h-9 shrink-0 items-center">
                    <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                      {index + 1}
                    </span>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_7rem_7rem] gap-2">
                    <FormField
                      control={control}
                      name={`ticketTypes.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormControl>
                            <Input placeholder="e.g. General Admission" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`ticketTypes.${index}.price`}
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              step={0.01}
                              placeholder="10.50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`ticketTypes.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormControl>
                            <Input
                              type="number"
                              min={-1}
                              placeholder="-1 = unlimited"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-9 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => remove(index)}
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
      )}
    </div>
  )
}
