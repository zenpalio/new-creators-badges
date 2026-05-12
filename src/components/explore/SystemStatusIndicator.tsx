import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "../../lib/utils";

export type ServiceStatus = "operational" | "degraded" | "down";

export type Service = {
  name: string;
  status: ServiceStatus;
  note?: string;
};

const defaultStatusLabels: Record<ServiceStatus, string> = {
  operational: "Operational",
  degraded: "Degraded",
  down: "Down",
};

export type SystemStatusIndicatorProps = {
  services: Service[];
  /** Summary shown in the popover */
  message: string;
  /** Override status labels (e.g. localization) */
  statusLabels?: Partial<Record<ServiceStatus, string>>;
  className?: string;
};

function overallStatus(list: Service[]): ServiceStatus {
  if (list.some((s) => s.status === "down")) return "down";
  if (list.some((s) => s.status === "degraded")) return "degraded";
  return "operational";
}

export default function SystemStatusIndicator({
  services,
  message,
  statusLabels: statusLabelsProp,
  className,
}: SystemStatusIndicatorProps) {
  const [open, setOpen] = useState(false);
  const labels = { ...defaultStatusLabels, ...statusLabelsProp };
  const overall = overallStatus(services);

  const affected = services.filter((s) => s.status !== "operational");

  if (overall === "operational") return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "pointer-events-auto relative flex h-8 w-8 items-center justify-center transition-opacity hover:opacity-75",
            className,
          )}
          aria-label={`System status: ${labels[overall]}`}
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(42_92%_52%)] text-[13px] font-bold leading-none text-black shadow-private">
            !
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-64 rounded-lg border border-border/60 bg-popover/95 p-3 text-popover-foreground backdrop-blur-xl"
      >
        <p className="text-sm leading-snug text-foreground/90">{message}</p>
        {affected.length > 0 && (
          <ul className="mt-2 space-y-1.5 border-t border-border/50 pt-2 text-xs text-foreground/80">
            {affected.map((s) => (
              <li key={s.name} className="leading-snug">
                <span className="font-medium text-foreground">{s.name}</span>
                <span className="text-foreground/60"> — {labels[s.status]}</span>
                {s.note ? <span className="block text-foreground/55">{s.note}</span> : null}
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
