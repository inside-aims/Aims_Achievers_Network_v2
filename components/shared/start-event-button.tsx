"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { type VariantProps } from "class-variance-authority";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2 } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

interface StartEventButtonProps extends VariantProps<typeof buttonVariants> {
  className?: string;
  children?: React.ReactNode;
}

export default function StartEventButton({
  className,
  variant,
  size = "lg",
  children = "Start an Event",
}: StartEventButtonProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const submitRequest = useMutation(api.eventRequests.submit);

  function resetForm() {
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setStatus("idle");
    setError("");
  }

  function handleOpenChange(next: boolean) {
    if (status === "loading") return;
    setOpen(next);
    if (!next) setTimeout(resetForm, 200);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      await submitRequest({
        name,
        email,
        phone: phone || undefined,
        message: message || undefined,
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <>
      <Button variant={variant} size={size} className={className} onClick={() => setOpen(true)}>
        {children}
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          {status === "success" ? (
            <div className="flex flex-col items-center text-center py-6">
              <span className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-7 h-7 text-primary" />
              </span>
              <DialogHeader>
                <DialogTitle className="text-xl text-center">Request received</DialogTitle>
                <DialogDescription className="text-center">
                  Thanks{name ? `, ${name.split(" ")[0]}` : ""} — we&apos;ll get back to you within 24 hours.
                </DialogDescription>
              </DialogHeader>
              <Button className="w-full mt-6" onClick={() => handleOpenChange(false)}>
                Done
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Start an event</DialogTitle>
                <DialogDescription>
                  Tell us a bit about what you&apos;re planning — award voting, ticketing, or both.
                  We&apos;ll reach out to set it up.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="start-event-name">Name</Label>
                  <Input
                    id="start-event-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Kofi Mensah"
                    disabled={status === "loading"}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="start-event-email">Email</Label>
                  <Input
                    id="start-event-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={status === "loading"}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="start-event-phone">Phone (optional)</Label>
                  <Input
                    id="start-event-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0551234567"
                    disabled={status === "loading"}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="start-event-message">What are you planning? (optional)</Label>
                  <Textarea
                    id="start-event-message"
                    rows={3}
                    className="field-sizing-fixed h-24 resize-none overflow-y-auto"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Award voting, ticketing, or both — and roughly when."
                    disabled={status === "loading"}
                  />
                </div>

                {status === "error" && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button type="submit" className="w-full" disabled={status === "loading"}>
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    "Submit request"
                  )}
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
