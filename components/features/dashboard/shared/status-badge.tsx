import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  live:      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  closed:    "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
  draft:     "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  published: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

interface Props {
  status: string;
}

export function StatusBadge({ status }: Props) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.draft;
  const isLive = status === "live";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full capitalize whitespace-nowrap",
        style,
        isLive && "badge-live"
      )}
    >
      {isLive && (
        <span className="relative flex size-1.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
        </span>
      )}
      {status}
    </span>
  );
}
