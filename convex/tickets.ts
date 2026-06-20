import { v, ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";
import { QueryCtx, MutationCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { requireEventOwner } from "./helpers";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateScanCode(prefix: string): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}-GATE-${code}`;
}

// ─── Ticket type queries ──────────────────────────────────────────────────────

/** Returns event ticket info shaped for the purchase UI. Replaces mock-data.getEventTicketInfo. */
export const getEventTicketInfo = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event || !event.ticketingEnabled) return null;

    const ticketTypes = await ctx.db
      .query("ticketTypes")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .take(50);

    return {
      eventId: event._id,
      eventTitle: event.title,
      eventDate: event.eventDate
        ? new Date(event.eventDate).toISOString().split("T")[0]
        : "",
      eventTime: "",
      venue: event.location ?? "",
      themeId: event.themeId ?? "royal-night",
      ticketTypes: ticketTypes.map((tt) => ({
        id: tt._id,
        name: tt.name,
        description: tt.description ?? "",
        pricePesewas: tt.pricePesewas,
        quantityTotal: tt.quantityTotal,
        quantitySold: tt.quantitySold,
        salesStartAt: tt.salesStartAt
          ? new Date(tt.salesStartAt).toISOString().split("T")[0]
          : undefined,
        salesEndAt: tt.salesEndAt
          ? new Date(tt.salesEndAt).toISOString().split("T")[0]
          : undefined,
      })),
    };
  },
});

/** Same as getEventTicketInfo but looks up by event slug. Used by the event page. */
export const getEventTicketInfoBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!event || !event.ticketingEnabled) return null;

    const ticketTypes = await ctx.db
      .query("ticketTypes")
      .withIndex("by_event", (q) => q.eq("eventId", event._id))
      .take(50);

    return {
      eventId: event._id,
      eventTitle: event.title,
      eventDate: event.eventDate
        ? new Date(event.eventDate).toISOString().split("T")[0]
        : "",
      eventTime: "",
      venue: event.location ?? "",
      themeId: event.themeId ?? "royal-night",
      ticketTypes: ticketTypes.map((tt) => ({
        id: tt._id,
        name: tt.name,
        description: tt.description ?? "",
        pricePesewas: tt.pricePesewas,
        quantityTotal: tt.quantityTotal,
        quantitySold: tt.quantitySold,
        salesStartAt: tt.salesStartAt
          ? new Date(tt.salesStartAt).toISOString().split("T")[0]
          : undefined,
        salesEndAt: tt.salesEndAt
          ? new Date(tt.salesEndAt).toISOString().split("T")[0]
          : undefined,
      })),
    };
  },
});

// ─── Ticket lookup queries ────────────────────────────────────────────────────

/** Replaces mock-data.lookupByEmail. Returns tickets with event + type names joined. */
export const lookupByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const tickets = await ctx.db
      .query("tickets")
      .withIndex("by_holderEmail", (q) =>
        q.eq("holderEmail", args.email.toLowerCase()),
      )
      .take(50);

    return await enrichTickets(ctx, tickets);
  },
});

/** Replaces mock-data.lookupByPhone. */
export const lookupByPhone = query({
  args: { phone: v.string() },
  handler: async (ctx, args) => {
    const tickets = await ctx.db
      .query("tickets")
      .withIndex("by_holderPhone", (q) => q.eq("holderPhone", args.phone))
      .take(50);

    return await enrichTickets(ctx, tickets);
  },
});

/** Replaces mock-data.lookupByCode — returns one enriched ticket or null. */
export const lookupByCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const ticket = await ctx.db
      .query("tickets")
      .withIndex("by_ticketCode", (q) =>
        q.eq("ticketCode", args.code.toUpperCase()),
      )
      .unique();

    if (!ticket) return null;
    const enriched = await enrichTickets(ctx, [ticket]);
    return enriched[0] ?? null;
  },
});

/** Used by /tickets/[ticketCode] detail page. */
export const getTicketByCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const ticket = await ctx.db
      .query("tickets")
      .withIndex("by_ticketCode", (q) =>
        q.eq("ticketCode", args.code.toUpperCase()),
      )
      .unique();

    if (!ticket) return null;
    const enriched = await enrichTickets(ctx, [ticket]);
    return enriched[0] ?? null;
  },
});

// ─── Scan queries ─────────────────────────────────────────────────────────────

/** Verifies a gate staff access code. Returns the code doc if active, null otherwise. */
export const verifyScanAccess = query({
  args: { eventId: v.id("events"), code: v.string() },
  handler: async (ctx, args) => {
    const accessCode = await ctx.db
      .query("scanAccessCodes")
      .withIndex("by_code", (q) => q.eq("code", args.code.toUpperCase()))
      .unique();

    if (!accessCode) return null;
    if (accessCode.eventId !== args.eventId) return null;
    if (!accessCode.isActive) return null;

    return accessCode;
  },
});

/** Returns all scan access codes for an event (organizer dashboard). */
export const getScanAccessCodes = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    await requireEventOwner(ctx, args.eventId);
    return await ctx.db
      .query("scanAccessCodes")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .take(50);
  },
});

/** Returns recent scan entries for an event (organizer dashboard activity tab). */
export const getScanActivity = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    await requireEventOwner(ctx, args.eventId);
    return await ctx.db
      .query("scanEntries")
      .withIndex("by_event_time", (q) => q.eq("eventId", args.eventId))
      .order("desc")
      .take(100);
  },
});

// ─── Ticket purchase mutations ────────────────────────────────────────────────

/**
 * Creates a ticket order. For free tiers, immediately confirms and issues tickets.
 * For paid tiers, returns a providerReference for Paystack checkout.
 */
export const createTicketOrder = mutation({
  args: {
    eventId: v.id("events"),
    ticketTypeId: v.id("ticketTypes"),
    quantity: v.number(),
    buyerName: v.string(),
    buyerEmail: v.string(),
    buyerPhone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error("Event not found");
    if (!event.ticketingEnabled) throw new Error("Ticketing is not enabled for this event");

    const ticketType = await ctx.db.get(args.ticketTypeId);
    if (!ticketType) throw new Error("Ticket type not found");
    if (ticketType.eventId !== args.eventId)
      throw new Error("Ticket type does not belong to this event");
    if (!ticketType.isActive) throw new Error("This ticket type is no longer available");

    // Availability check
    if (ticketType.quantityTotal !== -1) {
      const remaining = ticketType.quantityTotal - ticketType.quantitySold;
      if (remaining < args.quantity)
        throw new Error(`Only ${remaining} ticket(s) remaining for this tier`);
    }

    const totalPesewas = ticketType.pricePesewas * args.quantity;
    const isFree = ticketType.pricePesewas === 0;

    let providerReference: string | undefined;
    if (!isFree) {
      const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(8)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      providerReference = `TKT-${event.eventCode}-${randomHex}`.toUpperCase();
    }

    const orderId = await ctx.db.insert("ticketOrders", {
      eventId: args.eventId,
      ticketTypeId: args.ticketTypeId,
      quantity: args.quantity,
      totalPesewas,
      buyerName: args.buyerName,
      buyerEmail: args.buyerEmail.toLowerCase(),
      buyerPhone: args.buyerPhone,
      providerReference,
      status: isFree ? "confirmed" : "pending",
      createdAt: Date.now(),
    });

    if (isFree) {
      await ctx.runMutation(internal.internal.tickets.confirmTicketOrder, { orderId });
    }

    return { orderId, providerReference, totalPesewas, isFree };
  },
});

// ─── Scan access code mutations ───────────────────────────────────────────────

/** Generates a new gate-staff scan code for an event. Returns { id, code }. */
export const generateScanAccessCode = mutation({
  args: {
    eventId: v.id("events"),
    staffName: v.string(),
    staffRole: v.string(),
    staffPhone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireEventOwner(ctx, args.eventId);

    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error("Event not found");

    // Generate unique code
    let code = "";
    for (let attempt = 0; attempt < 10; attempt++) {
      code = generateScanCode(event.eventCode);
      const existing = await ctx.db
        .query("scanAccessCodes")
        .withIndex("by_code", (q) => q.eq("code", code))
        .unique();
      if (!existing) break;
      if (attempt === 9) throw new Error("Failed to generate unique scan code");
    }

    const id = await ctx.db.insert("scanAccessCodes", {
      eventId: args.eventId,
      code,
      staffName: args.staffName,
      staffRole: args.staffRole,
      staffPhone: args.staffPhone,
      isActive: true,
      scansCount: 0,
      createdAt: Date.now(),
    });

    return { id, code };
  },
});

/**
 * Enables ticketing on an existing event and inserts initial ticket types.
 * Safe to call even if ticketingEnabled is already true — will just add more types.
 */
export const setupTicketing = mutation({
  args: {
    eventId: v.id("events"),
    themeId: v.optional(v.string()),
    ticketTypes: v.array(
      v.object({
        name: v.string(),
        description: v.optional(v.string()),
        pricePesewas: v.number(),
        quantityTotal: v.number(),
        salesStartAt: v.optional(v.number()),
        salesEndAt: v.optional(v.number()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    await requireEventOwner(ctx, args.eventId);

    const patch: Record<string, unknown> = { ticketingEnabled: true };
    if (args.themeId) patch.themeId = args.themeId;
    await ctx.db.patch(args.eventId, patch);

    const now = Date.now();
    for (const tt of args.ticketTypes) {
      await ctx.db.insert("ticketTypes", {
        eventId: args.eventId,
        name: tt.name,
        description: tt.description,
        pricePesewas: tt.pricePesewas,
        quantityTotal: tt.quantityTotal,
        quantitySold: 0,
        salesStartAt: tt.salesStartAt,
        salesEndAt: tt.salesEndAt,
        isActive: true,
        createdAt: now,
      });
    }
  },
});

/** Adds a single ticket type to an already-ticketed event. */
export const addTicketType = mutation({
  args: {
    eventId: v.id("events"),
    name: v.string(),
    description: v.optional(v.string()),
    pricePesewas: v.number(),
    quantityTotal: v.number(),
    salesStartAt: v.optional(v.number()),
    salesEndAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireEventOwner(ctx, args.eventId);

    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error("Event not found");
    if (!event.ticketingEnabled) throw new Error("Ticketing is not enabled for this event");

    return await ctx.db.insert("ticketTypes", {
      eventId: args.eventId,
      name: args.name,
      description: args.description,
      pricePesewas: args.pricePesewas,
      quantityTotal: args.quantityTotal,
      quantitySold: 0,
      salesStartAt: args.salesStartAt,
      salesEndAt: args.salesEndAt,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

/**
 * Deletes a ticket type. Blocked if any tickets have been sold for this type.
 * Only the event owner may call this.
 */
export const deleteTicketType = mutation({
  args: { ticketTypeId: v.id("ticketTypes") },
  handler: async (ctx, args) => {
    const ticketType = await ctx.db.get(args.ticketTypeId);
    if (!ticketType) throw new Error("Ticket type not found");

    await requireEventOwner(ctx, ticketType.eventId);

    if (ticketType.quantitySold > 0) {
      throw new ConvexError("Cannot delete a ticket type that has sold tickets.");
    }

    // Also guard against pending orders that haven't confirmed yet
    const pendingOrder = await ctx.db
      .query("ticketOrders")
      .withIndex("by_event", (q) => q.eq("eventId", ticketType.eventId))
      .filter((q) =>
        q.and(
          q.eq(q.field("ticketTypeId"), args.ticketTypeId),
          q.eq(q.field("status"), "pending"),
        ),
      )
      .first();

    if (pendingOrder) {
      throw new ConvexError("Cannot delete a ticket type with a pending checkout in progress.");
    }

    await ctx.db.delete(args.ticketTypeId);
  },
});

/** Toggles a scan access code active/inactive. */
export const toggleScanAccessCode = mutation({
  args: { scanAccessCodeId: v.id("scanAccessCodes") },
  handler: async (ctx, args) => {
    const accessCode = await ctx.db.get(args.scanAccessCodeId);
    if (!accessCode) throw new Error("Scan access code not found");
    await requireEventOwner(ctx, accessCode.eventId);
    await ctx.db.patch(args.scanAccessCodeId, { isActive: !accessCode.isActive });
  },
});

// ─── Ticket verification mutation ─────────────────────────────────────────────

/**
 * Called from the gate scanner when a QR code is scanned.
 * Validates the ticket, marks it used, and writes a scan entry.
 */
export const verifyTicketCode = mutation({
  args: {
    eventId: v.id("events"),
    ticketCode: v.string(),
    scanAccessCodeId: v.id("scanAccessCodes"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const normalizedCode = args.ticketCode.toUpperCase().trim();

    const accessCode = await ctx.db.get(args.scanAccessCodeId);
    if (!accessCode) throw new Error("Invalid scan access code");
    if (!accessCode.isActive) throw new Error("Scan access code is inactive");
    if (accessCode.eventId !== args.eventId)
      throw new Error("Access code does not belong to this event");

    const ticket = await ctx.db
      .query("tickets")
      .withIndex("by_ticketCode", (q) => q.eq("ticketCode", normalizedCode))
      .unique();

    const ticketType = ticket ? await ctx.db.get(ticket.ticketTypeId) : null;

    let result: "success" | "already_used" | "invalid" | "cancelled";
    let message: string;

    if (!ticket || ticket.eventId !== args.eventId) {
      result = "invalid";
      message =
        ticket && ticket.eventId !== args.eventId
          ? "This ticket does not belong to this event."
          : "No ticket found for this code. Please check and try again.";
    } else if (ticket.status === "cancelled") {
      result = "cancelled";
      message = "This ticket has been cancelled and is no longer valid.";
    } else if (ticket.status === "used") {
      result = "already_used";
      message =
        "This ticket has already been scanned. If re-entry is needed, generate a new QR code.";
    } else {
      result = "success";
      message = "Ticket verified successfully. Welcome!";
      await ctx.db.patch(ticket._id, { status: "used", usedAt: now });
    }

    await ctx.db.insert("scanEntries", {
      eventId: args.eventId,
      scanAccessCodeId: args.scanAccessCodeId,
      ticketCode: normalizedCode,
      holderName: ticket?.holderName,
      ticketTypeName: ticketType?.name,
      result,
      scannedAt: now,
    });

    await ctx.db.patch(args.scanAccessCodeId, {
      scansCount: accessCode.scansCount + 1,
      lastScannedAt: now,
    });

    return {
      result,
      message,
      ticket: ticket
        ? {
            id: ticket._id,
            ticketCode: ticket.ticketCode,
            holderName: ticket.holderName,
            holderEmail: ticket.holderEmail,
            holderPhone: ticket.holderPhone,
            status: result === "success" ? "used" : ticket.status,
            ticketTypeName: ticketType?.name ?? "",
            themeId: ticket.themeId ?? "",
          }
        : null,
      scannedAt: new Date(now).toISOString(),
    };
  },
});

// ─── Private helper ───────────────────────────────────────────────────────────

async function enrichTickets(
  ctx: QueryCtx | MutationCtx,
  tickets: Doc<"tickets">[],
) {
  const result = [];
  for (const ticket of tickets) {
    const [event, ticketType] = await Promise.all([
      ctx.db.get(ticket.eventId),
      ctx.db.get(ticket.ticketTypeId),
    ]);

    result.push({
      id: ticket._id,
      eventId: event?.slug ?? (ticket.eventId as string),
      eventTitle: event?.title ?? "",
      eventDate: event?.eventDate
        ? new Date(event.eventDate).toISOString().split("T")[0]
        : "",
      eventTime: "",
      venue: event?.location ?? "",
      orderId: ticket.orderId,
      ticketTypeName: ticketType?.name ?? "",
      ticketCode: ticket.ticketCode,
      holderName: ticket.holderName,
      holderEmail: ticket.holderEmail,
      holderPhone: ticket.holderPhone,
      status: ticket.status,
      usedAt: ticket.usedAt ? new Date(ticket.usedAt).toISOString() : undefined,
      themeId: ticket.themeId ?? event?.themeId ?? "royal-night",
      createdAt: new Date(ticket.createdAt).toISOString(),
      previousCodes: ticket.previousCodes,
    });
  }
  return result;
}
