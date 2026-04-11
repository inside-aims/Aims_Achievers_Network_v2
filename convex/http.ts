import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";

const http = httpRouter();

// Convex Auth routes (sign in, sign out, session refresh, etc.)
auth.addHttpRoutes(http);

// ─── Paystack Webhook ─────────────────────────────────────────────────────────

http.route({
  path: "/webhooks/paystack",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const rawBody = await request.text();

    // ── 1. Verify HMAC-SHA512 signature ──────────────────────────────────
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      console.error("PAYSTACK_SECRET_KEY is not set");
      return new Response("Server misconfiguration", { status: 500 });
    }

    const signature = request.headers.get("x-paystack-signature");
    if (!signature) {
      return new Response("Missing signature", { status: 401 });
    }

    const isValid = await verifyPaystackSignature(rawBody, signature, secret);
    if (!isValid) {
      return new Response("Invalid signature", { status: 401 });
    }

    // ── 2. Parse payload ──────────────────────────────────────────────────
    let payload: PaystackWebhookPayload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }

    // ── 3. Only handle successful charges ─────────────────────────────────
    if (payload.event !== "charge.success") {
      // Acknowledge other events without processing
      return new Response("OK", { status: 200 });
    }

    const { reference, amount, status } = payload.data;
    console.log("payload ", payload)
    if (status !== "success") {
      return new Response("OK", { status: 200 });
    }

    if (!reference) {
      return new Response("Missing reference", { status: 400 });
    }

    // ── 4. Record the vote (idempotent internal mutation) ─────────────────
    try {
      await ctx.runMutation(internal.internal.votes.recordVote, {
        providerReference: reference,
        grossAmountPesewas: amount,
      });
    } catch (err) {
      // Return 500 so Paystack retries — recordVote is idempotent so retries are safe
      console.error("recordVote error:", err);
      return new Response("Vote recording failed", { status: 500 });
    }

    return new Response("OK", { status: 200 });
  }),
});

export default http;

// ─── Types ────────────────────────────────────────────────────────────────────

interface PaystackWebhookPayload {
  event: string;
  data: {
    reference: string;
    amount: number;     // in pesewas
    status: string;
    [key: string]: unknown;
  };
}

// ─── HMAC-SHA512 verification using Web Crypto API ────────────────────────────

async function verifyPaystackSignature(
  body: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const computed = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return computed === signature;
}
