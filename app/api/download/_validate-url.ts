// Allowlist mirrors next.config.ts remotePatterns so the proxy only fetches
// images from the same origins Next.js itself will serve.
const ALLOWED_PATTERNS: Array<{ exact?: string; suffix?: string }> = [
  { exact: "images.unsplash.com" },
  { exact: "images.prismic.io" },
  { exact: "randomuser.me" },
  { suffix: ".supabase.co" },
  { suffix: ".convex.cloud" },
];

function hostnameAllowed(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  return ALLOWED_PATTERNS.some((p) =>
    p.exact ? lower === p.exact : lower.endsWith(p.suffix!),
  );
}

/**
 * Returns the validated URL string, or throws a Response with an appropriate
 * 4xx status so callers can return it directly.
 */
export function validateImageUrl(raw: string | null): string {
  if (!raw) throw new Response("Missing url param", { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Response("Invalid url", { status: 400 });
  }

  if (parsed.protocol !== "https:") {
    throw new Response("Only https URLs are allowed", { status: 400 });
  }

  if (!hostnameAllowed(parsed.hostname)) {
    throw new Response("URL host is not permitted", { status: 400 });
  }

  return parsed.toString();
}
