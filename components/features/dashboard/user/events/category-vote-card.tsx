import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CategoryDetail, Nominee } from "./events";

function getInitials(name: string): string {
  const cleaned = name.replace(/^(Prof\.|Dr\.|Ms\.|Mr\.)\s*/i, "").trim();
  const parts = cleaned.split(/\s+/);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

function rankBadgeClass(rank: number): string {
  if (rank === 1) return "bg-secondary text-secondary-foreground font-bold";
  return "bg-muted text-muted-foreground";
}

function avatarClass(rank: number): string {
  if (rank === 1) return "bg-secondary/20 text-secondary-foreground";
  return "bg-muted text-muted-foreground";
}

interface NomineeRowProps {
  nominee: Nominee;
  rank: number;
  max: number;
  total: number;
  isFirst: boolean;
}

function NomineeRow({ nominee, rank, max, total, isFirst }: NomineeRowProps) {
  const barPct = max > 0 ? Math.round((nominee.votes / max) * 100) : 0;
  const sharePct = total > 0 ? Math.round((nominee.votes / total) * 100) : 0;
  const initials = getInitials(nominee.name);

  return (
    <div
      className={cn(
        "flex items-center gap-3 py-3 px-1 rounded-md transition-colors",
        isFirst && "bg-secondary/5"
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center size-5 rounded-full text-[10px] shrink-0",
          rankBadgeClass(rank)
        )}
      >
        {rank}
      </span>

      <div
        className={cn(
          "flex items-center justify-center size-8 rounded-full text-xs font-semibold shrink-0",
          avatarClass(rank)
        )}
      >
        {initials}
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium truncate leading-none">
            {nominee.name}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground tabular-nums">
              {nominee.votes.toLocaleString()}
            </span>
            <span className="text-[10px] text-muted-foreground tabular-nums w-7 text-right">
              {sharePct}%
            </span>
          </div>
        </div>

        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isFirst ? "bg-secondary" : "bg-primary/60"
            )}
            style={{ width: `${barPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

interface Props {
  category: CategoryDetail;
}

export function CategoryVoteCard({ category }: Props) {
  const sorted = [...category.nominees].sort((a, b) => b.votes - a.votes);
  const total = sorted.reduce((sum, n) => sum + n.votes, 0);
  const max = sorted[0]?.votes ?? 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold leading-tight">{category.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
              {category.description}
            </p>
          </div>
          <Badge variant="outline" className="shrink-0 text-xs">
            {category.nominees.length}{" "}
            {category.nominees.length === 1 ? "nominee" : "nominees"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex-1">
        {sorted.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">
            No nominees yet.
          </p>
        ) : (
          <div className="divide-y">
            {sorted.map((nominee, i) => (
              <NomineeRow
                key={nominee.id}
                nominee={nominee}
                rank={i + 1}
                max={max}
                total={total}
                isFirst={i === 0}
              />
            ))}
          </div>
        )}

        {total > 0 && (
          <p className="mt-3 text-[10px] text-muted-foreground text-right">
            {total.toLocaleString()} total votes in this category
          </p>
        )}
      </CardContent>
    </Card>
  );
}
