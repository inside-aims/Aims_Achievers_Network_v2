import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type StatVariant = "default" | "success" | "info" | "warning";

interface VariantStyle {
  iconBg: string;
  iconColor: string;
}

const VARIANT_STYLES: Record<StatVariant, VariantStyle> = {
  default: {
    iconBg:    "bg-primary/10",
    iconColor: "text-primary",
  },
  success: {
    iconBg:    "bg-emerald-50 dark:bg-emerald-900/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  info: {
    iconBg:    "bg-violet-50 dark:bg-violet-900/20",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  warning: {
    iconBg:    "bg-amber-50 dark:bg-amber-900/20",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
};

interface Props {
  label: string;
  value: string | number;
  sub: string;
  icon: LucideIcon;
  variant?: StatVariant;
  href?: string;
}

function StatCardInner({ label, value, sub, icon: Icon, variant = "default" }: Omit<Props, "href">) {
  const styles = VARIANT_STYLES[variant];

  return (
    <Card>
      <CardContent className="pt-5 pb-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs md:text-sm text-muted-foreground font-medium leading-none">
              {label}
            </p>
            <p className="text-2xl md:text-3xl font-bold mt-1.5 md:mt-2 tabular-nums leading-none truncate">
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-1.5">
              {sub}
            </p>
          </div>

          <div
            className={cn(
              "flex size-9 md:size-10 shrink-0 items-center justify-center rounded-lg",
              styles.iconBg
            )}
          >
            <Icon className={cn("size-4 md:size-5", styles.iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatCard({ href, ...rest }: Props) {
  if (href) {
    return (
      <Link href={href} className="block">
        <div className="transition-all duration-200 ease-out hover:scale-[1.03] hover:shadow-md">
          <StatCardInner {...rest} />
        </div>
      </Link>
    );
  }
  return <StatCardInner {...rest} />;
}
