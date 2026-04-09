const STYLES: Record<string, string> = {
  live:      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  closed:    "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
  draft:     "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  published: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

export function StatusBadge({ status }: { status: string }) {
  const style = STYLES[status] ?? STYLES.draft;
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize whitespace-nowrap ${style}`}>
      {status}
    </span>
  );
}
