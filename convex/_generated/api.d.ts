/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as auth from "../auth.js";
import type * as categories from "../categories.js";
import type * as crons from "../crons.js";
import type * as dashboard from "../dashboard.js";
import type * as env from "../env.js";
import type * as events from "../events.js";
import type * as fileStorage from "../fileStorage.js";
import type * as gallery from "../gallery.js";
import type * as helpers from "../helpers.js";
import type * as http from "../http.js";
import type * as internal_aggregates from "../internal/aggregates.js";
import type * as internal_votes from "../internal/votes.js";
import type * as nominations from "../nominations.js";
import type * as nominees from "../nominees.js";
import type * as organizerProfiles from "../organizerProfiles.js";
import type * as outlets from "../outlets.js";
import type * as resend from "../resend.js";
import type * as seed from "../seed.js";
import type * as users from "../users.js";
import type * as ussd from "../ussd.js";
import type * as voting from "../voting.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  auth: typeof auth;
  categories: typeof categories;
  crons: typeof crons;
  dashboard: typeof dashboard;
  env: typeof env;
  events: typeof events;
  fileStorage: typeof fileStorage;
  gallery: typeof gallery;
  helpers: typeof helpers;
  http: typeof http;
  "internal/aggregates": typeof internal_aggregates;
  "internal/votes": typeof internal_votes;
  nominations: typeof nominations;
  nominees: typeof nominees;
  organizerProfiles: typeof organizerProfiles;
  outlets: typeof outlets;
  resend: typeof resend;
  seed: typeof seed;
  users: typeof users;
  ussd: typeof ussd;
  voting: typeof voting;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  votesByNominee: import("@convex-dev/aggregate/_generated/component.js").ComponentApi<"votesByNominee">;
  revenueByEvent: import("@convex-dev/aggregate/_generated/component.js").ComponentApi<"revenueByEvent">;
  organizerRevenue: import("@convex-dev/aggregate/_generated/component.js").ComponentApi<"organizerRevenue">;
  votesByTime: import("@convex-dev/aggregate/_generated/component.js").ComponentApi<"votesByTime">;
  nomineeVoteCounts: import("@convex-dev/sharded-counter/_generated/component.js").ComponentApi<"nomineeVoteCounts">;
  rateLimiter: import("@convex-dev/rate-limiter/_generated/component.js").ComponentApi<"rateLimiter">;
  resend: import("@convex-dev/resend/_generated/component.js").ComponentApi<"resend">;
};
