import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventControlsCard } from "./event-controls";
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
    { label: "Price",      value: stats.priceLabel                                       },
    { label: "Closes",     value: formatDateMedium(closesDate)                           },
    { label: "Categories", value: `${stats.totalCategories} total`                      },
    { label: "Nominees",   value: `${stats.totalNominees} total`                        },
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

interface Props {
  stats: ComputedStats;
  closesDate: string;
  createdAt: string;
  controls: EventControls;
  onToggle: (key: keyof EventControls, value: boolean) => void;
}

export function EventSidebar({ stats, closesDate, createdAt, controls, onToggle }: Props) {
  return (
    <div className="space-y-4">
      <EventControlsCard controls={controls} onToggle={onToggle} />
      <EventInfoCard stats={stats} closesDate={closesDate} createdAt={createdAt} />
    </div>
  );
}
