import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  sub: string;
  status: string;
  href?: string;
}

export function EventRow({ title, sub, status, href }: Props) {
  const inner = (
    <div className={cn(
      "flex items-center justify-between px-6 py-4 text-sm",
      href && "clickable"
    )}>
      <div className="min-w-0">
        <p className="font-medium truncate">{title}</p>
        <p className="text-muted-foreground text-xs mt-0.5">{sub}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-4">
        <StatusBadge status={status} />
        {href && <ChevronRight className="size-4 text-muted-foreground" />}
      </div>
    </div>
  );

  if (href) return <Link href={href} className="block">{inner}</Link>;
  return inner;
}
