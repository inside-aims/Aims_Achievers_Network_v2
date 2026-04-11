import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ message: "Server misconfiguration" }, { status: 500 });
  }

  const { otp, reference } = await req.json();

  if (!otp || !reference) {
    return NextResponse.json({ message: "otp and reference are required" }, { status: 400 });
  }

  const res = await fetch("https://api.paystack.co/charge/submit_otp", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ otp, reference }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { message: data.message ?? "OTP submission failed" },
      { status: res.status },
    );
  }

  return NextResponse.json(data);
}
