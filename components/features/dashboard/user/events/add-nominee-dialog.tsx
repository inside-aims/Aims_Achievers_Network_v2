"use client"

import { useState, useRef } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2, User, X } from "lucide-react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import type { CategoryDetail } from "./events"

const nomineeSchema = z.object({
  categoryId: z.string().min(1, "Please select a category"),
  name:       z.string().min(2, "Name must be at least 2 characters"),
  bio:        z.string().optional(),
})

type NomineeFormValues = z.infer<typeof nomineeSchema>

const DEFAULTS: NomineeFormValues = { categoryId: "", name: "", bio: "" }

interface Props {
  open:         boolean
  onOpenChange: (open: boolean) => void
  categories:   CategoryDetail[]
  eventTitle:   string
}

function PhotoUpload() {
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
    // TODO: upload to storage when DB is wired up
    console.log("[AddNominee] photo selected:", file.name)
  }

  function clear() {
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">
        Photo{" "}
        <span className="text-muted-foreground font-normal">(optional)</span>
      </p>
      <div className="flex items-center gap-4">
        <label className="relative flex size-16 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-muted/20 hover:bg-primary/5 hover:border-primary/40 transition-colors">
          {preview ? (
            <Image
              src={preview}
              alt="Nominee photo preview"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <User className="size-6 text-muted-foreground" />
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={handleFile}
          />
        </label>

        <div className="flex flex-col gap-1">
          {preview ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clear}
              className="gap-1.5"
            >
              <X className="size-3" />
              Remove photo
            </Button>
          ) : (
            <p className="text-xs text-muted-foreground">
              Click the circle to upload a photo.
            </p>
          )}
          <p className="text-[11px] text-muted-foreground/70">
            PNG, JPG or WEBP - max 2 MB
          </p>
        </div>
      </div>
    </div>
  )
}

export function AddNomineeDialog({ open, onOpenChange, categories, eventTitle }: Props) {
  const form = useForm<NomineeFormValues>({
    resolver:      zodResolver(nomineeSchema) as unknown as Resolver<NomineeFormValues>,
    defaultValues: DEFAULTS,
  })

  const { formState: { isSubmitting } } = form

  function handleClose() {
    form.reset()
    onOpenChange(false)
  }

  async function onSubmit(values: NomineeFormValues) {
    try {
      // TODO: Convex mutation when DB is wired up
      console.log("[AddNominee] submitted:", values)
      const category = categories.find((c) => c.id === values.categoryId)
      toast.success("Nominee added!", {
        description: `${values.name} has been added to "${category?.name ?? "the category"}".`,
      })
      handleClose()
    } catch {
      toast.error("Failed to add nominee", {
        description: "Something went wrong. Please try again.",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Nominee</DialogTitle>
          <DialogDescription>
            Adding a nominee to <strong>{eventTitle}</strong>.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
            <PhotoUpload />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Category <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nominee Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Ada Mensah" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Bio{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Short description about the nominee..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-1">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="size-4 mr-2 animate-spin" />}
                Add Nominee
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
