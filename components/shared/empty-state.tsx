import {Button} from "@/components/ui/button";
import {SearchX} from "lucide-react";

type EmptyStateProps = {
  title?: string;
  description?: string;
  onReset?: () => void;
};

const EmptyState = (
  {
    title = "No results found",
    description = "Try adjusting your search or filter to find what you’re looking for.",
    onReset,
  }: EmptyStateProps) => {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-muted/30 px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <SearchX className="h-6 w-6 text-muted-foreground"/>
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          {description}
        </p>
      </div>

      {onReset && (
        <Button onClick={onReset}>
          Reset filters
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
