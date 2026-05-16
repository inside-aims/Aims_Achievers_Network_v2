import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { abbreviate } from "./helpers";

/**
 * Current state when these migrations were written:
 *   - Nominee shortcodes: already rebuilt to new format (e.g. CEA-BCR-01)
 *   - Category codes in DB: still old long values (e.g. BCROTY, BA&RS)
 *   - Nominees: never SMS-notified of their shortcode
 *
 * Run in order:
 *   1. npx convex run migrations:fixCategoryCodes
 *   2. npx convex run migrations:notifyAllNominees
 *
 * NOTE: category codes are used as URL segments (/events/[slug]/[categoryCode]).
 * After step 1 those old URLs will 404 — update any shared links.
 */

// ─── Step 1: Fix category codes in the DB ────────────────────────────────────

export const fixCategoryCodes = internalMutation({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").take(500);
    let updated = 0;
    let skipped = 0;

    for (const category of categories) {
      const newBase = abbreviate(category.name); // sanitized, max 3 chars

      if (newBase === category.categoryCode) { skipped++; continue; }

      // Ensure uniqueness within this event
      let code = newBase;
      let n = 2;
      while (true) {
        const conflict = await ctx.db
          .query("categories")
          .withIndex("by_event_code", (q) =>
            q.eq("eventId", category.eventId).eq("categoryCode", code),
          )
          .unique();
        if (!conflict || conflict._id === category._id) break;
        code = `${newBase}${n++}`;
      }

      await ctx.db.patch(category._id, { categoryCode: code });
      updated++;
    }

    return { updated, skipped };
  },
});

// ─── Step 2: SMS all nominees their current shortcode ────────────────────────

/**
 * Sends each nominee (who has a recorded phone number) their current shortcode.
 * Shortcodes are already correct — this is purely a notification step.
 */
export const notifyAllNominees = internalMutation({
  args: {},
  handler: async (ctx) => {
    const nominees = await ctx.db.query("nominees").take(500);
    let notified = 0;
    let noPhone = 0;

    for (const nominee of nominees) {
      const event = await ctx.db.get(nominee.eventId);
      if (!event) continue;

      const phone = await getNomineePhone(ctx, nominee._id);
      if (!phone) { noPhone++; continue; }

      await ctx.scheduler.runAfter(0, internal.sms.sendShortcodeReminderSms, {
        phone,
        nomineeName: nominee.displayName,
        shortcode: nominee.shortcode,
        eventName: event.title,
      });
      notified++;
    }

    return { notified, noPhone };
  },
});

// ─── Helper ───────────────────────────────────────────────────────────────────

async function getNomineePhone(
  ctx: { db: { query: Function } },
  nomineeId: Id<"nominees">,
): Promise<string | undefined> {
  const submission = await (ctx.db
    .query("nominationSubmissions") as any)
    .filter((q: any) => q.eq(q.field("resolvedNomineeId"), nomineeId))
    .first();
  return submission?.nomineeIdentifier;
}
