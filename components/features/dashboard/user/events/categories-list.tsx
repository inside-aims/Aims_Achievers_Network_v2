"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Tag, UserX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CategoryDetail, Nominee } from "./events";

function getInitials(name: string): string {
  const cleaned = name.replace(/^(Prof\.|Dr\.|Ms\.|Mr\.)\s*/i, "").trim();
  const parts = cleaned.split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

function formatShare(votes: number, total: number): string {
  if (total === 0) return "0.00%";
  return ((votes / total) * 100).toFixed(2) + "%";
}

interface NomineeRowProps {
  nominee: Nominee;
  rank: number;
  max: number;
  total: number;
}

function NomineeRow({ nominee, rank, max, total }: NomineeRowProps) {
  const barPct = max > 0 ? (nominee.votes / max) * 100 : 0;
  const isFirst = rank === 1;

  return (
    <div
      className={cn(
        "flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2.5 md:py-3 transition-colors",
        isFirst
          ? "bg-secondary/8 hover:bg-secondary/15"
          : "hover:bg-accent"
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center size-5 md:size-6 rounded-full text-[10px] font-bold shrink-0",
          isFirst
            ? "bg-secondary text-secondary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {rank}
      </span>

      <div
        className={cn(
          "flex items-center justify-center size-7 md:size-8 rounded-full text-[10px] md:text-xs font-bold shrink-0",
          isFirst
            ? "bg-secondary/25 text-secondary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {getInitials(nominee.name)}
      </div>

      <div className="flex-1 min-w-0 space-y-1 md:space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs md:text-sm font-medium truncate">{nominee.name}</span>
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <span className="text-xs md:text-sm font-semibold tabular-nums">
              {nominee.votes.toLocaleString()}
            </span>
            <span
              className={cn(
                "text-[10px] md:text-[11px] tabular-nums w-10 text-right font-medium",
                isFirst
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground"
              )}
            >
              {formatShare(nominee.votes, total)}
            </span>
          </div>
        </div>

        <div className="h-1 md:h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700 ease-out",
              isFirst ? "bg-secondary" : "bg-primary/50"
            )}
            style={{ width: `${barPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function NomineesEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 md:gap-3 py-8 md:py-10 px-4 text-center">
      <div className="flex size-10 md:size-12 items-center justify-center rounded-full bg-muted">
        <UserX className="size-4 md:size-5 text-muted-foreground" />
      </div>
      <div className="space-y-0.5 md:space-y-1">
        <p className="text-xs md:text-sm font-medium">No nominees yet</p>
        <p className="text-[10px] md:text-xs text-muted-foreground max-w-[200px]">
          Use the <strong>···</strong> menu to add nominees to this category.
        </p>
      </div>
    </div>
  );
}

interface CategoryRowProps {
  category: CategoryDetail;
  isOpen: boolean;
  onToggle: () => void;
}

function CategoryRow({ category, isOpen, onToggle }: CategoryRowProps) {
  const sorted = [...category.nominees].sort((a, b) => b.votes - a.votes);
  const total = sorted.reduce((sum, n) => sum + n.votes, 0);
  const max = sorted[0]?.votes ?? 0;
  const hasNominees = sorted.length > 0;

  return (
    <div className="border-b last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between px-4 md:px-5 py-3 md:py-4 text-left transition-colors",
          isOpen ? "bg-accent" : "hover:bg-accent/60"
        )}
      >
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div
            className={cn(
              "flex size-7 md:size-8 items-center justify-center rounded-md shrink-0 transition-colors",
              isOpen ? "bg-primary text-primary-foreground" : "bg-muted"
            )}
          >
            <Tag className="size-3.5 md:size-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs md:text-sm font-semibold leading-tight">{category.name}</p>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 truncate">
              {category.description}
            </p>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 tabular-nums">
              {total.toLocaleString()} {total === 1 ? "vote" : "votes"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-2.5 shrink-0 ml-3">
          <Badge
            variant={isOpen ? "default" : "outline"}
            className="text-[10px] md:text-[11px] tabular-nums px-1.5 md:px-2"
          >
            {hasNominees
              ? `${category.nominees.length} ${category.nominees.length === 1 ? "nominee" : "nominees"}`
              : "No nominees"}
          </Badge>
          {isOpen ? (
            <ChevronUp className="size-3.5 md:size-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-3.5 md:size-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="border-t">
          {!hasNominees ? (
            <NomineesEmptyState />
          ) : (
            <div className="divide-y">
              {sorted.map((nominee, i) => (
                <NomineeRow
                  key={nominee.id}
                  nominee={nominee}
                  rank={i + 1}
                  max={max}
                  total={total}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface Props {
  categories: CategoryDetail[];
}

export function CategoriesList({ categories }: Props) {
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(categories.slice(0, 2).map((c) => c.id))
  );

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <Card>
      <CardHeader className="pb-0 px-4 md:px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm md:text-base flex items-center gap-1.5 md:gap-2">
            <Tag className="size-3.5 md:size-4 text-muted-foreground" />
            Categories &amp; Votes
          </CardTitle>
          <span className="text-[10px] md:text-xs text-muted-foreground tabular-nums">
            {categories.length}{" "}
            {categories.length === 1 ? "category" : "categories"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-0 mt-3 md:mt-4">
        {categories.length === 0 ? (
          <div className="py-12 md:py-16 text-center px-4 space-y-1 md:space-y-1.5">
            <p className="font-medium text-xs md:text-sm">No categories yet</p>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              Use the <strong>···</strong> menu above to add your first category.
            </p>
          </div>
        ) : (
          <div>
            {categories.map((cat) => (
              <CategoryRow
                key={cat.id}
                category={cat}
                isOpen={openIds.has(cat.id)}
                onToggle={() => toggle(cat.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
