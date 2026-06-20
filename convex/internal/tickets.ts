import { v } from "convex/values";
import { internalMutation, MutationCtx } from "../_generated/server";
import { resend } from "../resend";

function buildTicketConfirmationEmail(opts: {
  buyerName: string;
  eventTitle: string;
  eventDate?: number;
  location?: string;
  ticketTypeName: string;
  totalPesewas: number;
  ticketCodes: string[];
}): string {
  const { buyerName, eventTitle, eventDate, location, ticketTypeName, totalPesewas, ticketCodes } = opts;
  const formattedDate = eventDate
    ? new Date(eventDate).toLocaleDateString("en-GH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : null;
  const formattedAmount = (totalPesewas / 100).toFixed(2);

  const ticketRows = ticketCodes
    .map(
      (code) => `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;font-family:monospace;font-size:18px;font-weight:700;letter-spacing:2px;color:#1a1a1a;">
          ${code}
        </td>
      </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#1a1a1a;padding:32px 40px;text-align:center;">
            <p style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:1px;">AIMS Achievers Network</p>
            <p style="margin:8px 0 0;color:#aaaaaa;font-size:13px;">Your tickets are confirmed</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 24px;">
            <p style="margin:0 0 8px;font-size:16px;color:#555555;">Hi ${buyerName},</p>
            <p style="margin:0 0 24px;font-size:16px;color:#333333;">
              Your payment was successful. Here ${ticketCodes.length === 1 ? "is your ticket" : "are your tickets"} for <strong>${eventTitle}</strong>.
            </p>

            <!-- Event details -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;border-radius:6px;margin-bottom:28px;">
              <tr><td style="padding:20px 24px;">
                <p style="margin:0 0 6px;font-size:12px;color:#888888;text-transform:uppercase;letter-spacing:1px;">Event</p>
                <p style="margin:0;font-size:17px;font-weight:600;color:#1a1a1a;">${eventTitle}</p>
                ${formattedDate ? `<p style="margin:8px 0 0;font-size:14px;color:#555555;">📅 ${formattedDate}</p>` : ""}
                ${location ? `<p style="margin:4px 0 0;font-size:14px;color:#555555;">📍 ${location}</p>` : ""}
                <p style="margin:8px 0 0;font-size:14px;color:#555555;">🎟 ${ticketTypeName} × ${ticketCodes.length}</p>
                <p style="margin:4px 0 0;font-size:14px;color:#555555;">💳 GHS ${formattedAmount}</p>
              </td></tr>
            </table>

            <!-- Ticket codes -->
            <p style="margin:0 0 12px;font-size:13px;color:#888888;text-transform:uppercase;letter-spacing:1px;">Your ticket code${ticketCodes.length > 1 ? "s" : ""}</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e8e8;border-radius:6px;overflow:hidden;margin-bottom:28px;">
              ${ticketRows}
            </table>

            <p style="margin:0;font-size:14px;color:#555555;line-height:1.6;">
              Present your ticket code at the entrance on the day of the event. Keep this email safe — it's your proof of purchase.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px;border-top:1px solid #f0f0f0;text-align:center;">
            <p style="margin:0;font-size:12px;color:#aaaaaa;">
              This is an automated confirmation from AIMS Achievers Network.<br>
              If you have questions, contact us at <a href="mailto:support@aimsachieversnetwork.com" style="color:#aaaaaa;">support@aimsachieversnetwork.com</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function generateTicketCode(prefix: string): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}-${code}`;
}

async function uniqueTicketCode(ctx: MutationCtx, prefix: string): Promise<string> {
  for (let attempt = 0; attempt < 20; attempt++) {
    const code = generateTicketCode(prefix);
    const existing = await ctx.db
      .query("tickets")
      .withIndex("by_ticketCode", (q) => q.eq("ticketCode", code))
      .unique();
    if (!existing) return code;
  }
  throw new Error("Failed to generate unique ticket code after 20 attempts");
}

/**
 * Issues tickets for a confirmed order and increments quantitySold.
 * NEVER call from the frontend — internal only.
 * Idempotent: safe to call twice for the same orderId.
 */
export const confirmTicketOrder = internalMutation({
  args: { orderId: v.id("ticketOrders") },
  handler: async (ctx, args) => {
    console.log(`[confirmTicketOrder] Processing orderId="${args.orderId}"`);

    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error(`Order not found: ${args.orderId}`);

    console.log(`[confirmTicketOrder] Order status="${order.status}" qty=${order.quantity} buyer="${order.buyerEmail}"`);

    // Idempotency: if tickets already exist this ran before
    const existingTicket = await ctx.db
      .query("tickets")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .first();
    if (existingTicket) {
      console.log(`[confirmTicketOrder] Tickets already issued, skipping`);
      return;
    }

    const event = await ctx.db.get(order.eventId);
    if (!event) throw new Error("Event not found");

    const ticketType = await ctx.db.get(order.ticketTypeId);
    if (!ticketType) throw new Error("Ticket type not found");

    // Over-sell guard (safety net — availability was already checked in createTicketOrder)
    if (ticketType.quantityTotal !== -1) {
      const remaining = ticketType.quantityTotal - ticketType.quantitySold;
      if (remaining < order.quantity) {
        console.error(`[confirmTicketOrder] Over-sell blocked: remaining=${remaining} requested=${order.quantity}`);
        throw new Error(`Not enough tickets remaining (${remaining} left)`);
      }
    }

    console.log(`[confirmTicketOrder] Issuing ${order.quantity} ticket(s) — eventCode="${event.eventCode}" quantitySold BEFORE=${ticketType.quantitySold}`);

    const now = Date.now();
    const issuedCodes: string[] = [];
    for (let i = 0; i < order.quantity; i++) {
      const ticketCode = await uniqueTicketCode(ctx, event.eventCode);
      await ctx.db.insert("tickets", {
        eventId: order.eventId,
        ticketTypeId: order.ticketTypeId,
        orderId: args.orderId,
        ticketCode,
        holderName: order.buyerName,
        holderEmail: order.buyerEmail,
        holderPhone: order.buyerPhone,
        status: "valid",
        themeId: event.themeId,
        createdAt: now,
      });
      issuedCodes.push(ticketCode);
    }

    await ctx.db.patch(args.orderId, { status: "confirmed" });
    await ctx.db.patch(order.ticketTypeId, {
      quantitySold: ticketType.quantitySold + order.quantity,
    });

    console.log(`[confirmTicketOrder] Done. quantitySold AFTER=${ticketType.quantitySold + order.quantity} codes=${issuedCodes.join(", ")}`);

    await resend.sendEmail(ctx, {
      from: "AIMS Achievers Network <tickets@aimsachieversnetwork.com>",
      to: order.buyerEmail,
      subject: `Your ticket${issuedCodes.length > 1 ? "s" : ""} for ${event.title}`,
      html: buildTicketConfirmationEmail({
        buyerName: order.buyerName,
        eventTitle: event.title,
        eventDate: event.eventDate,
        location: event.location,
        ticketTypeName: ticketType.name,
        totalPesewas: order.totalPesewas,
        ticketCodes: issuedCodes,
      }),
    });
    console.log(`[confirmTicketOrder] Confirmation email queued to ${order.buyerEmail}`);
  },
});

/**
 * Called from the Paystack webhook for ticket order payments.
 * Looks up by providerReference, then delegates to confirmTicketOrder logic.
 */
export const confirmTicketOrderByReference = internalMutation({
  args: {
    providerReference: v.string(),
    grossAmountPesewas: v.number(),
  },
  handler: async (ctx, args) => {
    console.log(`[confirmTicketOrderByReference] Looking up order for reference="${args.providerReference}" amount=${args.grossAmountPesewas}`);

    const order = await ctx.db
      .query("ticketOrders")
      .withIndex("by_providerReference", (q) =>
        q.eq("providerReference", args.providerReference),
      )
      .unique();

    if (!order) {
      console.error(`[confirmTicketOrderByReference] No order found for reference="${args.providerReference}"`);
      throw new Error(`Ticket order not found: ${args.providerReference}`);
    }

    console.log(`[confirmTicketOrderByReference] Found order _id="${order._id}" status="${order.status}" qty=${order.quantity} totalPesewas=${order.totalPesewas}`);

    if (order.status === "confirmed") {
      console.log(`[confirmTicketOrderByReference] Order already confirmed, skipping`);
      return;
    }

    // Amount guard — warn if Paystack amount differs from what we recorded
    if (args.grossAmountPesewas !== order.totalPesewas) {
      console.warn(`[confirmTicketOrderByReference] Amount mismatch: expected=${order.totalPesewas} received=${args.grossAmountPesewas}`);
    }

    const existingTicket = await ctx.db
      .query("tickets")
      .withIndex("by_order", (q) => q.eq("orderId", order._id))
      .first();
    if (existingTicket) {
      console.warn(`[confirmTicketOrderByReference] Tickets already exist for order, patching status only`);
      await ctx.db.patch(order._id, { status: "confirmed" });
      return;
    }

    const event = await ctx.db.get(order.eventId);
    if (!event) {
      console.error(`[confirmTicketOrderByReference] Event not found for eventId="${order.eventId}"`);
      throw new Error("Event not found");
    }

    const ticketType = await ctx.db.get(order.ticketTypeId);
    if (!ticketType) {
      console.error(`[confirmTicketOrderByReference] TicketType not found for ticketTypeId="${order.ticketTypeId}"`);
      throw new Error("Ticket type not found");
    }

    // Over-sell guard
    if (ticketType.quantityTotal !== -1) {
      const remaining = ticketType.quantityTotal - ticketType.quantitySold;
      if (remaining < order.quantity) {
        console.error(`[confirmTicketOrderByReference] Over-sell blocked: remaining=${remaining} requested=${order.quantity}`);
        throw new Error(`Not enough tickets remaining (${remaining} left)`);
      }
    }

    console.log(`[confirmTicketOrderByReference] Issuing ${order.quantity} ticket(s) — eventCode="${event.eventCode}" ticketType="${ticketType.name}" quantitySold BEFORE=${ticketType.quantitySold}`);

    const now = Date.now();
    const issuedCodes: string[] = [];
    for (let i = 0; i < order.quantity; i++) {
      const ticketCode = await uniqueTicketCode(ctx, event.eventCode);
      await ctx.db.insert("tickets", {
        eventId: order.eventId,
        ticketTypeId: order.ticketTypeId,
        orderId: order._id,
        ticketCode,
        holderName: order.buyerName,
        holderEmail: order.buyerEmail,
        holderPhone: order.buyerPhone,
        status: "valid",
        themeId: event.themeId,
        createdAt: now,
      });
      issuedCodes.push(ticketCode);
    }

    await ctx.db.patch(order._id, { status: "confirmed" });
    await ctx.db.patch(order.ticketTypeId, {
      quantitySold: ticketType.quantitySold + order.quantity,
    });

    console.log(`[confirmTicketOrderByReference] Done. quantitySold AFTER=${ticketType.quantitySold + order.quantity} codes=${issuedCodes.join(", ")}`);

    await resend.sendEmail(ctx, {
      from: "AIMS Achievers Network <tickets@aimsachieversnetwork.com>",
      to: order.buyerEmail,
      subject: `Your ticket${issuedCodes.length > 1 ? "s" : ""} for ${event.title}`,
      html: buildTicketConfirmationEmail({
        buyerName: order.buyerName,
        eventTitle: event.title,
        eventDate: event.eventDate,
        location: event.location,
        ticketTypeName: ticketType.name,
        totalPesewas: order.totalPesewas,
        ticketCodes: issuedCodes,
      }),
    });
    console.log(`[confirmTicketOrderByReference] Confirmation email queued to ${order.buyerEmail}`);
  },
});
