import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { RateLimiter, DAY } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";
import { resend } from "./resend";

const rateLimiter = new RateLimiter(components.rateLimiter, {
  // Max 3 "start an event" requests from the same email per day
  eventRequestSubmit: { kind: "fixed window", rate: 3, period: DAY },
});

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Public "start an event" lead capture — no account required.
 * Organizer accounts are provisioned by admins, so this just queues
 * the request for the team to follow up on within 24 hours.
 */
export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const name = args.name.trim();
    const email = args.email.trim().toLowerCase();

    if (!name) throw new ConvexError("Please enter your name");
    if (!EMAIL_PATTERN.test(email)) throw new ConvexError("Enter a valid email address");

    await rateLimiter.limit(ctx, "eventRequestSubmit", { key: email, throws: true });

    await ctx.db.insert("eventRequests", {
      name,
      email,
      phone: args.phone?.trim() || undefined,
      message: args.message?.trim() || undefined,
      status: "new",
      createdAt: Date.now(),
    });

    try {
      await resend.sendEmail(ctx, {
        from: "AAN Platform <noreply@mail.xolace.app>",
        to: "hello@aimsachievers.network",
        subject: `New event request from ${name}`,
        html: `
          <p><strong>${name}</strong> wants to start an event.</p>
          <p>Email: ${email}${args.phone ? `<br>Phone: ${args.phone}` : ""}</p>
          ${args.message ? `<p>${args.message}</p>` : ""}
        `,
      });
    } catch (err) {
      console.error("Event request notification email failed:", err);
    }

    return null;
  },
});
