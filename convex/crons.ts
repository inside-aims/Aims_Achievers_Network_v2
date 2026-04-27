import { cronJobs } from "convex/server";
import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";



const CONVEX_ENV = process.env.CONVEX_ENV;
const VALID_ENVS = ["production", "development"] as const;
if (CONVEX_ENV !== undefined && !(VALID_ENVS as readonly string[]).includes(CONVEX_ENV)) {
  throw new Error(
    `Invalid CONVEX_ENV="${CONVEX_ENV}". Expected one of: ${VALID_ENVS.join(", ")} (or leave unset for development).`,
  );
}
const isProd = CONVEX_ENV === "production";
// ─── Internal mutation ────────────────────────────────────────────────────────

/**
 * Closes any live events whose votingEndsAt has passed.
 * Sets status to "closed" and votingOpen to false.
 * Processes up to 20 events per run — well within any real platform load.
 */
export const closeExpiredEvents = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    const liveEvents = await ctx.db
      .query("events")
      .withIndex("by_status", (q) => q.eq("status", "live"))
      .take(20);

    for (const event of liveEvents) {
      if (
        event.votingEndsAt !== undefined &&
        event.votingEndsAt <= now &&
        event.votingOpen
      ) {
        await ctx.db.patch(event._id, {
          status: "closed",
          votingOpen: false,
        });
        console.log(`Auto-closed event: ${event.title} (${event._id})`);
      }
    }
  },
});

// ─── Cron schedule ────────────────────────────────────────────────────────────

const crons = cronJobs();

// Check every 5 minutes for events that should be auto-closed
crons.interval(
  "auto-close expired events",
  isProd ? { minutes: 10 } : { hours: 24 },
  internal.crons.closeExpiredEvents,
  {},
);

// Prune stale USSD sessions every 15 minutes
crons.interval(
  "prune expired ussd sessions",
  isProd ? { minutes: 15 } : { hours: 24 },
  internal.ussd.pruneExpiredSessions,
  {},
);

export default crons;
