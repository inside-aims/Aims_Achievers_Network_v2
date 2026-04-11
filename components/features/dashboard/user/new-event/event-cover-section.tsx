"use client"

import { useState, useRef } from "react"
import { ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EventCoverSection() {
  const [preview, setPreview]   = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
    // TODO: upload to storage when DB is wired up
    console.log("[EventCover] file selected:", file.name, `${(file.size / 1024).toFixed(1)} KB`)
  }

  function clearFile() {
    setPreview(null)
    setFileName(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="form-section">
      <div>
        <h2 className="form-section-title">Event Cover</h2>
        <p className="form-section-desc">Upload a banner, flyer, or logo. PNG, JPG or WEBP - max 5 MB.</p>
      </div>

      {preview ? (
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Event cover preview"
              className="w-full h-44 object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 size-7"
              onClick={clearFile}
              aria-label="Remove cover image"
            >
              <X className="size-3.5" />
            </Button>
          </div>
          <p className="px-3 py-2 text-xs text-muted-foreground truncate border-t border-border">
            {fileName}
          </p>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/20 px-6 py-10 text-center cursor-pointer hover:bg-primary/5 hover:border-primary/40 transition-colors">
          <ImageIcon className="size-8 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Click to upload</p>
            <p className="text-xs text-muted-foreground mt-0.5">or drag and drop</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={handleFile}
          />
        </label>
      )}
    </div>
  )
}
