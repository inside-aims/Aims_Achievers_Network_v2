import { type LucideIcon, Info } from "lucide-react";

type NoDataStateProps = {
  icon?: LucideIcon;
  title?: string;
  description?: string;
};

/**
 * Generic "nothing here yet" placeholder — pass an icon/title/description
 * for whatever's missing (event details, agenda, reviews, etc.) instead of
 * building a one-off empty block each time.
 */
const NoDataState = (
  {
    icon: Icon = Info,
    title = "Nothing here yet",
    description = "There's no information to show right now.",
  }: NoDataStateProps) => {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-muted/30 px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          {description}
        </p>
      </div>
    </div>
  );
};

export default NoDataState;
