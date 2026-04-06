import { TableAggregate } from "@convex-dev/aggregate";
import { ShardedCounter } from "@convex-dev/sharded-counter";
import { components } from "../_generated/api";
import { DataModel, Id } from "../_generated/dataModel";

/**
 * Votes per nominee within an event.
 * - namespace: eventId
 * - sortKey:   [nomineeId, createdAt]
 * - sumValue:  quantity
 *
 * Queries:
 *   total votes for a nominee →
 *     votesByNominee.sum(ctx, { namespace: eventId, bounds: { prefix: [nomineeId] } })
 *   total vote count for event →
 *     votesByNominee.sum(ctx, { namespace: eventId })
 */
export const votesByNominee = new TableAggregate<{
  Namespace: Id<"events">;
  Key: [Id<"nominees">, number];
  DataModel: DataModel;
  TableName: "votes";
}>(components.votesByNominee, {
  namespace: (doc) => doc.eventId,
  sortKey: (doc) => [doc.nomineeId, doc.createdAt],
  sumValue: (doc) => doc.quantity,
});

/**
 * Gross revenue per event.
 * - namespace: eventId
 * - sortKey:   createdAt  (enables time-range slices)
 * - sumValue:  grossAmountPesewas
 *
 * Queries:
 *   total revenue → revenueByEvent.sum(ctx, { namespace: eventId })
 *   revenue last hour → revenueByEvent.sum(ctx, {
 *     namespace: eventId,
 *     bounds: { lower: { key: Date.now() - 3_600_000, inclusive: true } }
 *   })
 */
export const revenueByEvent = new TableAggregate<{
  Namespace: Id<"events">;
  Key: number;
  DataModel: DataModel;
  TableName: "votes";
}>(components.revenueByEvent, {
  namespace: (doc) => doc.eventId,
  sortKey: (doc) => doc.createdAt,
  sumValue: (doc) => doc.grossAmountPesewas,
});

/**
 * Organizer net amount per event.
 * - namespace: eventId
 * - sortKey:   createdAt
 * - sumValue:  organizerAmountPesewas
 *
 * platformFee = revenueByEvent.sum() - organizerRevenue.sum()
 */
export const organizerRevenue = new TableAggregate<{
  Namespace: Id<"events">;
  Key: number;
  DataModel: DataModel;
  TableName: "votes";
}>(components.organizerRevenue, {
  namespace: (doc) => doc.eventId,
  sortKey: (doc) => doc.createdAt,
  sumValue: (doc) => doc.organizerAmountPesewas,
});

/**
 * Vote quantity per event indexed by time.
 * - namespace: eventId
 * - sortKey:   createdAt
 * - sumValue:  quantity
 *
 * Queries:
 *   votes in the last hour → votesByTime.sum(ctx, {
 *     namespace: eventId,
 *     bounds: { lower: { key: Date.now() - 3_600_000, inclusive: true } }
 *   })
 */
export const votesByTime = new TableAggregate<{
  Namespace: Id<"events">;
  Key: number;
  DataModel: DataModel;
  TableName: "votes";
}>(components.votesByTime, {
  namespace: (doc) => doc.eventId,
  sortKey: (doc) => doc.createdAt,
  sumValue: (doc) => doc.quantity,
});

/**
 * High-throughput per-nominee vote counts for live card display.
 * Key = nomineeId string. 10 shards per key to handle vote bursts.
 */
export const nomineeVoteCounts = new ShardedCounter(components.nomineeVoteCounts, {
  defaultShards: 10,
});
