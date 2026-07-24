import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createMoolrePaymentLink, isMoolreLinkSuccess } from "@/lib/moolre/client";
import { USER_MESSAGES, mapMoolreCode } from "@/lib/moolre/errors";

const bodySchema = z.object({
  reference: z.string().min(1),
  amountPesewas: z.number().int().positive(),
  email: z.string().email(),
  callbackPath: z.string().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
});

export async function POST(req: NextRequest) {
  if (!process.env.MOOLRE_API_USER || !process.env.MOOLRE_API_PUBKEY || !process.env.MOOLRE_ACCOUNT_NUMBER) {
    return NextResponse.json({ message: "Server misconfiguration" }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const convexSiteUrl = process.env.CONVEX_SITE_URL;
  if (!siteUrl || !convexSiteUrl) {
    return NextResponse.json({ message: "Server misconfiguration" }, { status: 500 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const { reference, amountPesewas, email, callbackPath = "/tickets/confirmation", metadata } = parsed.data;
  const amount = (amountPesewas / 100).toFixed(2);
  const redirect = `${siteUrl}${callbackPath}?reference=${encodeURIComponent(reference)}`;
  const callback = `${convexSiteUrl}/webhooks/moolre`;

  try {
    const result = await createMoolrePaymentLink({
      amount,
      email,
      externalref: reference,
      callback,
      redirect,
      metadata,
    });

    if (isMoolreLinkSuccess(result)) {
      return NextResponse.json({
        authorization_url: result.data.authorization_url,
        reference: result.data.reference,
      });
    }

    const key = mapMoolreCode(result.code);
    console.error("[moolre initiate] rejected", { reference, code: result.code });
    return NextResponse.json({ message: USER_MESSAGES[key] }, { status: 400 });
  } catch (err) {
    console.error("[moolre initiate] request failed", err instanceof Error ? err.message : err);
    return NextResponse.json({ message: USER_MESSAGES.generic }, { status: 502 });
  }
}
