"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Organizer } from "../data/admin-data";

interface Props {
  open:     boolean;
  onClose:  () => void;
  onCreate: (org: Omit<Organizer, "id" | "joinedAt" | "status">) => void;
}

export function NewOrganizerDialog({ open, onClose, onCreate }: Props) {
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  function handleSubmit() {
    if (!name.trim() || !email.trim()) return;
    onCreate({ name: name.trim(), email: email.trim(), phone: phone.trim() });
    setName(""); setEmail(""); setPhone("");
  }

  function handleClose() {
    setName(""); setEmail(""); setPhone("");
    onClose();
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
            />
          </div>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!name.trim() || !email.trim()}
          >
            Create Organizer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
