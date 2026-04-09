"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, Home } from "lucide-react";

// Paystack appends ?reference=xxx&trxref=xxx to the callback URL.
// We read whichever is present.

function CallbackContent() {
  const params = useSearchParams();
  const router = useRouter();

  const reference = params.get("reference") ?? params.get("trxref") ?? "";

  const intent = useQuery(
    api.voting.getIntentStatus,
    reference ? { providerReference: reference } : "skip",
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
  if (intent === undefined) {
    return <SpinnerCard message="Looking up your payment…" />;
  }

  // ── Reference not found in DB ─────────────────────────────────────────────
  if (intent === null) {
    return (
      <StatusCard
        icon={<XCircle className="h-16 w-16 text-destructive" />}
        title="Payment not found"
        description="We could not find a transaction matching this reference. If you were charged, please contact support."
        action={<Button onClick={() => router.push("/")}>Go home</Button>}
      />
    );
  }

  // ── Confirmed ─────────────────────────────────────────────────────────────
  if (intent.status === "confirmed") {
    const backUrl = `/events/${intent.eventSlug}/${intent.categoryCode}`;
    return (
      <StatusCard
        icon={<CheckCircle2 className="h-16 w-16 text-primary" />}
        title="Votes cast!"
        description={
          <>
            <strong>{intent.votesAwarded} vote{intent.votesAwarded !== 1 ? "s" : ""}</strong> for{" "}
            <strong>{intent.nomineeName}</strong> in{" "}
            <strong>{intent.categoryName}</strong> have been recorded.
          </>
        }
        meta={`GHS ${(intent.amountPesewas / 100).toFixed(2)} paid · ${intent.eventTitle}`}
        action={
          <Button onClick={() => router.push(backUrl)}>
            Back to nominees
          </Button>
        }
      />
    );
  }

  // ── Failed ────────────────────────────────────────────────────────────────
  if (intent.status === "failed") {
    return (
      <StatusCard
        icon={<XCircle className="h-16 w-16 text-destructive" />}
        title="Payment unsuccessful"
        description="Your payment could not be verified. No votes were recorded. If you were charged, please contact support with your reference."
        meta={`Reference: ${reference}`}
        action={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.back()}>
              Try again
            </Button>
            <Button onClick={() => router.push("/")}>Go home</Button>
          </div>
        }
      />
    );
  }

  // ── Pending — webhook hasn't fired yet ────────────────────────────────────
  // Convex is reactive: this will re-render automatically when the webhook
  // fires and recordVote patches the intent to "confirmed".
  return (
    <StatusCard
      icon={<Loader2 className="h-16 w-16 animate-spin text-primary" />}
      title="Verifying payment…"
      description="We're confirming your transaction with Paystack. This usually takes a few seconds."
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

export default function VoteCallbackPage() {
  return (
    // useSearchParams() requires Suspense in the App Router
    <Suspense fallback={<SpinnerCard message="Loading…" />}>
      <CallbackContent />
    </Suspense>
  );
}
