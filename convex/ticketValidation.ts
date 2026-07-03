import { ConvexError } from "convex/values";

/**
 * Server-side invariant check for ticket-type numeric fields. The Convex
 * argument validators only check shape (v.number()), so without this a
 * bypassed/tampered client call could insert a negative price, fractional
 * pesewas, or a zero/fractional quantity.
 */
export function assertValidTicketTypeArgs(tt: {
  pricePesewas: number;
  quantityTotal: number;
}): void {
  if (!Number.isInteger(tt.pricePesewas) || tt.pricePesewas < 0) {
    throw new ConvexError("Ticket price must be a non-negative whole number of pesewas.");
  }
  if (
    !Number.isInteger(tt.quantityTotal) ||
    (tt.quantityTotal !== -1 && tt.quantityTotal <= 0)
  ) {
    throw new ConvexError("Ticket quantity must be -1 (unlimited) or a positive whole number.");
  }
}
