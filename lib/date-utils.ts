type DateInput = string | number | Date;

function toDate(raw: DateInput): Date {
  if (raw instanceof Date) return raw;
  if (typeof raw === "number") return new Date(raw);
  return new Date(raw);
}

/** Guards every formatter below against empty strings / invalid dates —
 *  e.g. a ticket-only event has no votingEndsAt, so "closes date" fields
 *  are legitimately absent rather than always populated. */
function isValidDate(d: Date): boolean {
  return !Number.isNaN(d.getTime());
}

export function formatDate(raw: DateInput): string {
  const d = toDate(raw);
  if (!isValidDate(d)) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function formatDateShort(raw: DateInput): string {
  const d = toDate(raw);
  if (!isValidDate(d)) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(d);
}

export function formatDateMedium(raw: DateInput): string {
  const d = toDate(raw);
  if (!isValidDate(d)) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function formatDateTime(raw: DateInput): string {
  const d = toDate(raw);
  if (!isValidDate(d)) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export function formatRelative(raw: DateInput): string {
  const parsed = toDate(raw);
  if (!isValidDate(parsed)) return "—";
  const diff = Date.now() - parsed.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  if (days < 30) return `${days} ${days === 1 ? "day" : "days"} ago`;
  if (months < 12) return `${months} ${months === 1 ? "month" : "months"} ago`;
  return `${years} ${years === 1 ? "year" : "years"} ago`;
}
