import { v } from "convex/values";
import { internalMutation } from "../_generated/server";
import { internal } from "../_generated/api";

/** One-off: issue a comped ticket to a specific named holder, bypassing the
 * per-email dedup in issueComplimentaryTickets (two nominees sharing one
 * contact email/phone). */
export const issueOneComplimentaryTicket = internalMutation({
  args: {
    eventId: v.id("events"),
    ticketTypeId: v.id("ticketTypes"),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
  },
  returns: v.id("ticketOrders"),
  handler: async (ctx, args) => {
    const orderId = await ctx.db.insert("ticketOrders", {
      eventId: args.eventId,
      ticketTypeId: args.ticketTypeId,
      quantity: 1,
      totalPesewas: 0,
      buyerName: args.name,
      buyerEmail: args.email.toLowerCase().trim(),
      buyerPhone: args.phone,
      status: "confirmed",
      createdAt: Date.now(),
    });
    await ctx.runMutation(internal.internal.tickets.confirmTicketOrder, { orderId });
    return orderId;
  },
});
