"use client"

import { useWatch, type Control } from "react-hook-form"
import { Eye, Globe, Zap, ClipboardList, Rocket, type LucideIcon } from "lucide-react"
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
import { cn } from "@/lib/utils"
import { type NewEventFormValues } from "./new-event-schema"

interface SettingConfig {
  name:        "showVotes" | "publicPage" | "votingOpenByDefault" | "nominationsEnabled" | "autoPublishNominations"
  icon:        LucideIcon
  label:       string
  description: string
}

const SETTINGS: SettingConfig[] = [
  {
    name:        "showVotes",
    icon:        Eye,
    label:       "Show Vote Counts",
    description: "Allow voters to see the live tally for each nominee.",
  },
  {
    name:        "publicPage",
    icon:        Globe,
    label:       "Public Event Page",
    description: "Create a shareable page so voters can find and vote.",
  },
  {
    name:        "votingOpenByDefault",
    icon:        Zap,
    label:       "Open Voting Immediately",
    description: "Start accepting votes as soon as the event is created.",
  },
  {
    name:        "nominationsEnabled",
    icon:        ClipboardList,
    label:       "Enable Nominations",
    description: "Allow the public to submit nominees for review.",
  },
  {
    name:        "autoPublishNominations",
    icon:        Rocket,
    label:       "Auto-publish Nominations",
    description: "Submitted nominees go straight to public without review.",
  },
]

interface Props {
  control: Control<NewEventFormValues>
}

export function EventSettingsSection({ control }: Props) {
  const nominationsEnabled = useWatch({ control, name: "nominationsEnabled" })

  return (
    <div className="form-section">
      <div>
        <h2 className="form-section-title">Event Settings</h2>
        <p className="form-section-desc">Control visibility and voting behaviour.</p>
      </div>

      <div className="space-y-3">
        {SETTINGS.map(({ name, icon: Icon, label, description }) => {
          const isAutoPublish = name === "autoPublishNominations"
          const disabled = isAutoPublish && nominationsEnabled !== "yes"

          return (
            <FormField
              key={name}
              control={control}
              name={name}
              render={({ field }) => (
                <FormItem
                  className={cn(
                    "flex flex-row items-center justify-between rounded-lg border border-border p-3 gap-4 space-y-0 transition-opacity",
                    disabled && "opacity-40 pointer-events-none select-none"
                  )}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
                      <Icon className="size-3.5 text-primary" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-sm font-medium leading-none">{label}</p>
                      <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <Select
                      onValueChange={field.onChange}
                      value={disabled ? "no" : field.value}
                      disabled={disabled}
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
          )
        })}
      </div>
    </div>
  )
}
