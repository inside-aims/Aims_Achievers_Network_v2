import { v } from "convex/values";
import { internalMutation, MutationCtx } from "../_generated/server";

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
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error(`Order not found: ${args.orderId}`);

    // Idempotency: already confirmed means tickets were already issued
    const existingTicket = await ctx.db
      .query("tickets")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .first();
    if (existingTicket) return;

    const event = await ctx.db.get(order.eventId);
    if (!event) throw new Error("Event not found");

    const ticketType = await ctx.db.get(order.ticketTypeId);
    if (!ticketType) throw new Error("Ticket type not found");

    const now = Date.now();
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
    }

    await ctx.db.patch(args.orderId, { status: "confirmed" });
    await ctx.db.patch(order.ticketTypeId, {
      quantitySold: ticketType.quantitySold + order.quantity,
    });
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
    const order = await ctx.db
      .query("ticketOrders")
      .withIndex("by_providerReference", (q) =>
        q.eq("providerReference", args.providerReference),
      )
      .unique();

    if (!order) throw new Error(`Ticket order not found: ${args.providerReference}`);
    if (order.status === "confirmed") return; // idempotent

    const existingTicket = await ctx.db
      .query("tickets")
      .withIndex("by_order", (q) => q.eq("orderId", order._id))
      .first();
    if (existingTicket) {
      await ctx.db.patch(order._id, { status: "confirmed" });
      return;
    }

    const event = await ctx.db.get(order.eventId);
    if (!event) throw new Error("Event not found");

    const ticketType = await ctx.db.get(order.ticketTypeId);
    if (!ticketType) throw new Error("Ticket type not found");

    const now = Date.now();
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
    }

    await ctx.db.patch(order._id, { status: "confirmed" });
    await ctx.db.patch(order.ticketTypeId, {
      quantitySold: ticketType.quantitySold + order.quantity,
    });
  },
});
