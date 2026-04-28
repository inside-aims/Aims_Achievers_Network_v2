const CONVEX_ENV = process.env.CONVEX_ENV;
const VALID_ENVS = ["production", "development"] as const;

if (CONVEX_ENV !== undefined && !(VALID_ENVS as readonly string[]).includes(CONVEX_ENV)) {
  throw new Error(
    `Invalid CONVEX_ENV="${CONVEX_ENV}". Expected one of: ${VALID_ENVS.join(", ")} (or leave unset for development).`,
  );
}

export const isProd = CONVEX_ENV === "production";
