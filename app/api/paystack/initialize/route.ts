import { NextRequest, NextResponse } from "next/server";

interface InitializeBody {
  reference: string;
  amountPesewas: number;
  email: string;
  phone: string;
  metadata: Record<string, string>;
}

export async function POST(req: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ message: "Server misconfiguration" }, { status: 500 });
  }

  let body: InitializeBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  const { reference, amountPesewas, email, phone, metadata } = body;

  if (!reference || !amountPesewas || !email) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/vote/callback`;

  const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: amountPesewas,
      reference,
      currency: "GHS",
      callback_url: callbackUrl,
      metadata: {
        phone_number: phone,
        custom_fields: Object.entries(metadata).map(([key, value]) => ({
          display_name: key.replace(/_/g, " "),
          variable_name: key,
          value,
        })),
      },
    }),
  });

  const data = await paystackRes.json();

  if (!paystackRes.ok || !data.status) {
    console.error("Paystack initialize error:", data);
    return NextResponse.json(
      { message: data.message ?? "Payment initialization failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({
    authorization_url: data.data.authorization_url,
    access_code: data.data.access_code,
    reference: data.data.reference,
  });
}
