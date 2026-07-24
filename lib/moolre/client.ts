import "server-only";
import type { CreatePaymentLinkInput, MoolrePaymentLinkResponse } from "./types";

// Defaults to live; set MOOLRE_BASE_URL=https://sandbox.moolre.com locally to test.
const MOOLRE_BASE_URL = process.env.MOOLRE_BASE_URL ?? "https://api.moolre.com";

export async function createMoolrePaymentLink(
  input: CreatePaymentLinkInput,
): Promise<MoolrePaymentLinkResponse> {
  const apiUser = process.env.MOOLRE_API_USER;
  const pubKey = process.env.MOOLRE_API_PUBKEY;
  const accountNumber = process.env.MOOLRE_ACCOUNT_NUMBER;

  if (!apiUser || !pubKey || !accountNumber) {
    throw new Error("Moolre server misconfiguration");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${MOOLRE_BASE_URL}/embed/link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-USER": apiUser,
        "X-API-PUBKEY": pubKey,
      },
      body: JSON.stringify({
        type: 1,
        amount: input.amount,
        email: input.email,
        externalref: input.externalref,
        callback: input.callback,
        redirect: input.redirect,
        reusable: "0",
        expiration_time: input.expirationMinutes ?? 30,
        currency: "GHS",
        accountnumber: accountNumber,
        ...(input.metadata && { metadata: input.metadata }),
      }),
      cache: "no-store",
      signal: controller.signal,
    });

    return (await res.json()) as MoolrePaymentLinkResponse;
  } finally {
    clearTimeout(timeout);
  }
}

export function isMoolreLinkSuccess(
  r: MoolrePaymentLinkResponse,
): r is MoolrePaymentLinkResponse & { data: { authorization_url: string; reference: string } } {
  return String(r.status) === "1" && !Array.isArray(r.data) && !!(r.data as { authorization_url?: string })?.authorization_url;
}
