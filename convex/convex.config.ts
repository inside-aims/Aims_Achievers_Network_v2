import { defineApp } from "convex/server";
import aggregate from "@convex-dev/aggregate/convex.config.js";
import shardedCounter from "@convex-dev/sharded-counter/convex.config.js";

const app = defineApp();

// Leaderboard: votes per nominee, prefix-queryable by nomineeId
app.use(aggregate, { name: "votesByNominee" });

// Gross revenue per event (sortKey: createdAt → time-range revenue queries)
app.use(aggregate, { name: "revenueByEvent" });

// Organizer net amount per event (gross minus platform fee)
app.use(aggregate, { name: "organizerRevenue" });

// Vote quantity per event sorted by time (for "votes this hour" stat)
app.use(aggregate, { name: "votesByTime" });

// High-throughput per-nominee vote counts for live card display
app.use(shardedCounter, { name: "nomineeVoteCounts" });

export default app;
