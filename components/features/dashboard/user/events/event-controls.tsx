import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { EventControls } from "./events";

interface ControlConfig {
  key: keyof EventControls;
  id: string;
  label: string;
  description: string;
}

const CONTROL_CONFIG: ControlConfig[] = [
  {
    key: "showVotes",
    id: "ctrl-show-votes",
    label: "Show votes",
    description: "Display vote counts publicly",
  },
  {
    key: "votingOpen",
    id: "ctrl-voting-open",
    label: "Voting open",
    description: "Allow voters to submit votes",
  },
  {
    key: "publicPage",
    id: "ctrl-public-page",
    label: "Public page",
    description: "Visible on the public site",
  },
];

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}

function Toggle({ checked, onChange, id }: ToggleProps) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent",
        "transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-ring focus-visible:ring-offset-2",
        checked ? "bg-primary" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm",
          "transition-transform duration-200",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
}

interface Props {
  controls: EventControls;
  onToggle: (key: keyof EventControls, value: boolean) => void;
}

export function EventControlsCard({ controls, onToggle }: Props) {
  return (
    <Card>
      <CardHeader className="pb-0 pt-4">
        <CardTitle className="text-sm">Controls</CardTitle>
      </CardHeader>
      <CardContent className="pb-3 divide-y">
        {CONTROL_CONFIG.map(({ key, id, label, description }) => (
          <div key={key} className="flex items-start justify-between gap-4 py-3">
            <label htmlFor={id} className="cursor-pointer space-y-0.5">
              <p className="text-sm font-medium leading-none">{label}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </label>
            <Toggle
              id={id}
              checked={controls[key]}
              onChange={(v) => onToggle(key, v)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
