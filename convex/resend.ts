import { components } from "./_generated/api";
import { Resend } from "@convex-dev/resend";

const CONVEX_ENV = process.env.CONVEX_ENV;
const VALID_ENVS = ["production", "development"] as const;
if (CONVEX_ENV !== undefined && !(VALID_ENVS as readonly string[]).includes(CONVEX_ENV)) {
  throw new Error(
    `Invalid CONVEX_ENV="${CONVEX_ENV}". Expected one of: ${VALID_ENVS.join(", ")} (or leave unset for development).`,
  );
}
console.log("🚀 ~ CONVEX_ENV:", CONVEX_ENV);


const isProd = CONVEX_ENV === "production";
console.log("🚀 ~ isProd:", isProd);


/**
 * Shared Resend client for all transactional emails.
 * Import `resend` from this file and call `resend.sendEmail(ctx, { ... })`.
 */
export const resend = new Resend(components.resend, {
  testMode: !isProd,
});
