import { Construction } from "lucide-react";

export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center">
      <Construction className="size-10 text-muted-foreground" />
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="text-sm text-muted-foreground max-w-xs">
        This section is under construction and will be available soon.
      </p>
    </div>
  );
}
