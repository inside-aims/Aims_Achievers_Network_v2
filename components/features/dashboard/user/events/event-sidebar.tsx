import { Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventControlsCard, Toggle } from "./event-controls";
import { formatDateMedium, formatRelative } from "@/lib/date-utils";
import type { ComputedStats, EventControls } from "./events";

interface DetailConfig {
  label: string;
  value: string;
  sub?: string;
}

interface EventInfoCardProps {
  stats: ComputedStats;
  closesDate: string;
  createdAt: string;
}

function EventInfoCard({ stats, closesDate, createdAt }: EventInfoCardProps) {
  const rows: DetailConfig[] = [
    { label: "Price", value: stats.priceLabel },
    ...(closesDate ? [{ label: "Closes", value: formatDateMedium(closesDate) }] : []),
    { label: "Categories", value: `${stats.totalCategories} total` },
    { label: "Nominees",   value: `${stats.totalNominees} total`   },
    {
      label: "Created",
      value: formatDateMedium(createdAt),
      sub: formatRelative(createdAt),
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-0 pt-4">
        <CardTitle className="text-sm">Event details</CardTitle>
      </CardHeader>
      <CardContent className="pb-3 divide-y">
        {rows.map(({ label, value, sub }) => (
          <div key={label} className="flex items-start justify-between gap-3 py-2.5">
            <span className="text-xs md:text-sm text-muted-foreground shrink-0">{label}</span>
            <div className="text-right">
              <span className="text-xs md:text-sm font-medium">{value}</span>
              {sub && (
                <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">{sub}</p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/**
 * Ticket-only events have just one control (public page) and two info rows
 * (closes/created) — stacking two mostly-empty cards in a narrow column
 * leaves a lot of dead space next to it. This merges both into a single
 * full-width horizontal bar instead.
 */
function TicketOnlySettingsBar({
  closesDate,
  createdAt,
  publicPage,
  onTogglePublicPage,
}: {
  closesDate: string;
  createdAt: string;
  publicPage: boolean;
  onTogglePublicPage: (value: boolean) => void;
}) {
  return (
    <Card>
      <CardContent className="py-4 flex flex-wrap items-center gap-x-8 gap-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
            <Globe className="size-3.5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium leading-none">Public page</p>
            <p className="text-xs text-muted-foreground mt-0.5">Visible on the public site</p>
          </div>
          <Toggle id="ctrl-public-page" checked={publicPage} onChange={onTogglePublicPage} />
        </div>

        <div className="hidden sm:block h-8 w-px bg-border" />

        <div className="flex items-center gap-6">
          {closesDate && (
            <div>
              <p className="text-xs text-muted-foreground">Closes</p>
              <p className="text-sm font-medium">{formatDateMedium(closesDate)}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground">Created</p>
            <p className="text-sm font-medium">{formatDateMedium(createdAt)}</p>
            {/*<p className="text-[10px] text-muted-foreground">{formatRelative(createdAt)}</p>*/}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface Props {
  stats: ComputedStats;
  closesDate: string;
  createdAt: string;
  controls: EventControls;
  onToggle: (key: keyof EventControls, value: boolean) => void;
  isTicketOnly?: boolean;
}

export function EventSidebar({ stats, closesDate, createdAt, controls, onToggle, isTicketOnly = false }: Props) {
  if (isTicketOnly) {
    return (
      <TicketOnlySettingsBar
        closesDate={closesDate}
        createdAt={createdAt}
        publicPage={controls.publicPage}
        onTogglePublicPage={(v) => onToggle("publicPage", v)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <EventControlsCard controls={controls} onToggle={onToggle} />
      <EventInfoCard stats={stats} closesDate={closesDate} createdAt={createdAt} />
    </div>
  );
}
