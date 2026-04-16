import { components } from "./_generated/api";
import { Resend } from "@convex-dev/resend";

/**
 * Shared Resend client for all transactional emails.
 * Import `resend` from this file and call `resend.sendEmail(ctx, { ... })`.
 */
export const resend = new Resend(components.resend, {
  testMode: process.env.CONVEX_ENV !== "production",
});
