"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TICKET_THEMES } from "./ticket-themes"

interface Props {
  value: string
  onChange: (themeId: string) => void
  id?: string
}

/** Shared ticket-theme picker — used at event-creation time and in the
 *  post-creation ticketing setup panel. */
export function TicketThemeSelect({ value, onChange, id }: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {TICKET_THEMES.map((t) => (
          <SelectItem key={t.id} value={t.id}>
            {t.name}
            <span className="ml-1.5 text-muted-foreground text-xs">— {t.description}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
