"use client";

import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CheckCircle2,
  Minus,
  Plus,
  Ticket,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { TicketType, EventTicketInfo } from "./index";
import { cn } from "@/lib/utils";

interface TicketPurchaseModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  ticketInfo: EventTicketInfo;
  selectedType: TicketType | null;
}

type Step = "form" | "loading" | "success";

const TicketPurchaseModal = ({
  open,
  setOpen,
  ticketInfo,
  selectedType,
}: TicketPurchaseModalProps) => {
  const isMobile = useIsMobile();
  const [step, setStep] = useState<Step>("form");
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  if (!selectedType) return null;

  const pricePerTicket = selectedType.pricePesewas / 100;
  const totalPrice = pricePerTicket * quantity;
  const isFree = selectedType.pricePesewas === 0;
  const remaining =
    selectedType.quantityTotal === -1
      ? 999
      : selectedType.quantityTotal - selectedType.quantitySold;
  const maxQuantity = Math.min(remaining, 10);

  function isFormValid() {
    return name.trim().length > 0 && email.trim().length > 0;
  }

  function handlePurchase() {
    if (!isFormValid()) return;
    setStep("loading");
    setTimeout(() => setStep("success"), 1500);
  }

  function handleClose(val: boolean) {
    if (step === "loading") return;
    setOpen(val);
    setTimeout(() => {
      setStep("form");
      setQuantity(1);
      setName("");
      setEmail("");
      setPhone("");
    }, 250);
  }

  const title = step === "success" ? "Order Confirmed!" : "Get Tickets";
  const description = ticketInfo.eventTitle;

  const content = (
    <PurchaseContent
      step={step}
      selectedType={selectedType}
      quantity={quantity}
      setQuantity={setQuantity}
      maxQuantity={maxQuantity}
      name={name}
      setName={setName}
      email={email}
      setEmail={setEmail}
      phone={phone}
      setPhone={setPhone}
      totalPrice={totalPrice}
      isFree={isFree}
      isFormValid={isFormValid()}
      onPurchase={handlePurchase}
      onClose={() => handleClose(false)}
    />
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent side="bottom" className="rounded-t-2xl px-0 pb-0 max-h-[92vh] flex flex-col gap-0">
          <SheetHeader className="px-5 pt-5 pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Ticket className="h-4 w-4 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-base font-bold leading-tight">{title}</SheetTitle>
                <SheetDescription className="text-xs leading-tight mt-0.5">{description}</SheetDescription>
              </div>
            </div>
          </SheetHeader>
          <div className="overflow-y-auto flex-1 px-5 py-4">
            {content}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Ticket className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold leading-tight">{title}</DialogTitle>
              <DialogDescription className="text-xs leading-tight mt-0.5">{description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[70vh] pr-1">
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface PurchaseContentProps {
  step: Step;
  selectedType: TicketType;
  quantity: number;
  setQuantity: (q: number) => void;
  maxQuantity: number;
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  totalPrice: number;
  isFree: boolean;
  isFormValid: boolean;
  onPurchase: () => void;
  onClose: () => void;
}

function PurchaseContent({
  step,
  selectedType,
  quantity,
  setQuantity,
  maxQuantity,
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  totalPrice,
  isFree,
  isFormValid,
  onPurchase,
  onClose,
}: PurchaseContentProps) {
  if (step === "loading") return <LoadingStep />;
  if (step === "success") {
    return (
      <SuccessStep
        name={name}
        email={email}
        quantity={quantity}
        ticketType={selectedType.name}
        onClose={onClose}
      />
    );
  }

  return <FormStep
    selectedType={selectedType}
    quantity={quantity}
    setQuantity={setQuantity}
    maxQuantity={maxQuantity}
    name={name}
    setName={setName}
    email={email}
    setEmail={setEmail}
    phone={phone}
    setPhone={setPhone}
    totalPrice={totalPrice}
    isFree={isFree}
    isFormValid={isFormValid}
    onPurchase={onPurchase}
  />;
}

function FormStep({
  selectedType,
  quantity,
  setQuantity,
  maxQuantity,
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  totalPrice,
  isFree,
  isFormValid,
  onPurchase,
}: Omit<PurchaseContentProps, "step" | "onClose">) {
  return (
    <div className="space-y-5 pt-1 pb-2">
      <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
        <div>
          <p className="text-sm font-bold">{selectedType.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {selectedType.description}
          </p>
        </div>
        <Badge className="bg-primary/10 text-primary border-primary/20 font-bold">
          {isFree ? "Free" : `GH₵ ${(selectedType.pricePesewas / 100).toFixed(2)}`}
        </Badge>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Quantity</Label>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full shrink-0"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xl font-bold w-8 text-center tabular-nums">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full shrink-0"
            onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
            disabled={quantity >= maxQuantity}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs text-muted-foreground">Max {maxQuantity} per order</span>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">Your details</p>

        <div className="space-y-1.5">
          <Label htmlFor="buyer-name" className="flex items-center gap-1.5 text-xs">
            <User className="h-3 w-3" />
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="buyer-name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="buyer-email" className="flex items-center gap-1.5 text-xs">
            <Mail className="h-3 w-3" />
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="buyer-email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="text-[11px] text-muted-foreground">Your QR code ticket will be sent here</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="buyer-phone" className="flex items-center gap-1.5 text-xs">
            <Phone className="h-3 w-3" />
            Phone <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="buyer-phone"
            type="tel"
            placeholder="0551234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {selectedType.name} × {quantity}
          </span>
          <span className="font-medium">
            {isFree ? "Free" : `GH₵ ${totalPrice.toFixed(2)}`}
          </span>
        </div>
        <div
          className={cn(
            "flex items-center justify-between text-sm font-bold pt-2 border-t border-border"
          )}
        >
          <span>Total</span>
          <span className="text-primary text-base">
            {isFree ? "Free" : `GH₵ ${totalPrice.toFixed(2)}`}
          </span>
        </div>
      </div>

      <Button className="w-full" onClick={onPurchase} disabled={!isFormValid}>
        {isFree
          ? `Get ${quantity} Free Ticket${quantity > 1 ? "s" : ""}`
          : `Pay GH₵ ${totalPrice.toFixed(2)}`}
      </Button>
    </div>
  );
}

function LoadingStep() {
  return (
    <div className="flex flex-col items-center justify-center py-14 gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Processing your order…</p>
    </div>
  );
}

function SuccessStep({
  name,
  email,
  quantity,
  ticketType,
  onClose,
}: {
  name: string;
  email: string;
  quantity: number;
  ticketType: string;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center py-6 gap-5">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 ring-4 ring-green-500/10">
        <CheckCircle2 className="h-8 w-8 text-green-500" />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold">Purchase Complete!</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          {quantity} {ticketType} ticket{quantity > 1 ? "s" : ""} confirmed for{" "}
          <span className="font-semibold text-foreground">{name}</span>
        </p>
      </div>

      <div className="w-full rounded-lg border border-border bg-muted/40 px-4 py-3 space-y-1">
        <p className="text-xs text-muted-foreground">
          Confirmation & QR code{quantity > 1 ? "s" : ""} sent to
        </p>
        <p className="text-sm font-bold text-primary">{email}</p>
      </div>

      <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
        You can look up your ticket anytime at the{" "}
        <span className="font-medium text-foreground">Tickets</span> page using
        your email, phone, or ticket code.
      </p>

      <Button className="w-full" onClick={onClose}>
        Done
      </Button>
    </div>
  );
}

export default TicketPurchaseModal;
