"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open:      boolean;
  onClose:   () => void;
  onSuccess: () => void;
}

export function NewOrganizerDialog({ open, onClose, onSuccess }: Props) {
  const [name,      setName]      = useState("");
  const [email,     setEmail]     = useState("");
  const [phone,     setPhone]     = useState("");
  const [isPending, setIsPending] = useState(false);

  const createOrganizer = useAction(api.users.createOrganizerAccount);

  function reset() {
    setName(""); setEmail(""); setPhone("");
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit() {
    if (!name.trim() || !email.trim()) return;
    setIsPending(true);
    try {
      await createOrganizer({
        displayName: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
      });
      toast.success("Organizer account created. Welcome email sent.");
      reset();
      onSuccess();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create organizer");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="size-4" />
            New Organizer
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="org-name">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="org-name"
              placeholder="e.g. Kwame Mensah"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="org-email">
              Email address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="org-email"
              type="email"
              placeholder="organizer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="org-phone">
              Phone <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              id="org-phone"
              type="tel"
              placeholder="024 000 0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isPending}
            />
          </div>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!name.trim() || !email.trim() || isPending}
          >
            {isPending ? "Creating…" : "Create Organizer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
