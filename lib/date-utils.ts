type DateInput = string | number | Date;

function toDate(raw: DateInput): Date {
  if (raw instanceof Date) return raw;
  if (typeof raw === "number") return new Date(raw);
  return new Date(raw);
}

export function formatDate(raw: DateInput): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(toDate(raw));
}

export function formatDateShort(raw: DateInput): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(toDate(raw));
}

export function formatDateMedium(raw: DateInput): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(toDate(raw));
}

export function formatDateTime(raw: DateInput): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(toDate(raw));
}

export function formatRelative(raw: DateInput): string {
  const diff = Date.now() - toDate(raw).getTime();
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
