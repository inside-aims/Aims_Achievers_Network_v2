"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, Home, Ticket } from "lucide-react";

// Mirrors app/vote/callback/page.tsx — same reactive pattern, no polling.
// Paystack appends ?reference=xxx&trxref=xxx to the callback URL.

function ConfirmationContent() {
  const params = useSearchParams();
  const router = useRouter();

  const reference = params.get("reference") ?? params.get("trxref") ?? "";

  const order = useQuery(
    api.tickets.getOrderStatusByReference,
    reference ? { reference } : "skip",
  );

  // ── No reference ─────────────────────────────────────────────────────────
  if (!reference) {
    return (
      <StatusCard
        icon={<XCircle className="h-16 w-16 text-destructive" />}
        title="Invalid callback"
        description="No payment reference was found in the URL."
        action={<Button onClick={() => router.push("/")}>Go home</Button>}
      />
    );
  }

  // ── Loading (Convex query in flight) ─────────────────────────────────────
  if (order === undefined) {
    return <SpinnerCard message="Looking up your order…" />;
  }

  // ── Reference not found in DB ─────────────────────────────────────────────
  if (order === null) {
    return (
      <StatusCard
        icon={<XCircle className="h-16 w-16 text-destructive" />}
        title="Order not found"
        description="We could not find a ticket order matching this reference. If you were charged, please contact support."
        action={<Button onClick={() => router.push("/")}>Go home</Button>}
      />
    );
  }

  // ── Confirmed ─────────────────────────────────────────────────────────────
  if (order.status === "confirmed") {
    return (
      <StatusCard
        icon={<CheckCircle2 className="h-16 w-16 text-primary" />}
        title="Tickets confirmed!"
        description={
          <>
            <strong>{order.quantity} {order.ticketTypeName}</strong> ticket
            {order.quantity !== 1 ? "s" : ""} for <strong>{order.eventTitle}</strong> confirmed.
            A copy has been emailed to <strong>{order.buyerEmail}</strong>.
          </>
        }
        meta={`GHS ${(order.totalPesewas / 100).toFixed(2)} paid`}
        action={
          <div className="w-full space-y-2">
            {order.tickets.map((t) => (
              <Link
                key={t.ticketCode}
                href={`/tickets/${t.ticketCode}`}
                className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/40 px-4 py-2.5 text-sm hover:border-primary/40 transition-colors"
              >
                <span className="flex items-center gap-2 font-mono font-semibold text-primary">
                  <Ticket className="h-4 w-4" />
                  {t.ticketCode}
                </span>
                <span className="text-xs text-muted-foreground">View ticket</span>
              </Link>
            ))}
          </div>
        }
      />
    );
  }

  // ── Cancelled ─────────────────────────────────────────────────────────────
  if (order.status === "cancelled") {
    return (
      <StatusCard
        icon={<XCircle className="h-16 w-16 text-destructive" />}
        title="Order cancelled"
        description="This order was cancelled and no tickets were issued. If you were charged, please contact support with your reference."
        meta={`Reference: ${reference}`}
        action={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push(`/events/${order.eventSlug}`)}>
              Back to event
            </Button>
            <Button onClick={() => router.push("/")}>Go home</Button>
          </div>
        }
      />
    );
  }

  // ── Pending — webhook hasn't fired yet ────────────────────────────────────
  // Convex is reactive: this will re-render automatically once the webhook
  // confirms the order, no polling required.
  return (
    <StatusCard
      icon={<Loader2 className="h-16 w-16 animate-spin text-primary" />}
      title="Confirming your payment…"
      description="We're verifying your transaction with Paystack. This usually takes a few seconds."
      meta="Please keep this page open."
    />
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SpinnerCard({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="h-10 w-10 animate-spin" />
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}

function StatusCard({
  icon,
  title,
  description,
  meta,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  meta?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 rounded-xl border border-border bg-card p-8 shadow-sm text-center">
        <div className="flex justify-center">{icon}</div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          {meta && (
            <p className="text-xs text-muted-foreground/70 font-mono mt-1">{meta}</p>
          )}
        </div>

        {action && <div className="flex justify-center">{action}</div>}

        <button
          onClick={() => window.location.href = "/"}
          className="flex items-center gap-1.5 mx-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Home className="h-3 w-3" />
          Return home
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TicketConfirmationPage() {
  return (
    // useSearchParams() requires Suspense in the App Router
    <Suspense fallback={<SpinnerCard message="Loading…" />}>
      <ConfirmationContent />
    </Suspense>
  );
}
