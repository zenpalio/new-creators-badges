import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type ServiceStatus = "operational" | "degraded" | "down";

type Service = {
  name: string;
  status: ServiceStatus;
  note?: string;
};

// Mock data — replace with real status feed
const services: Service[] = [
  { name: "Chat", status: "operational" },
  { name: "Image generation", status: "operational" },
  { name: "Video generation", status: "degraded", note: "Slower than usual" },
  { name: "Voice", status: "operational" },
  { name: "Payments", status: "operational" },
];

const statusLabel: Record<ServiceStatus, string> = {
  operational: "Operational",
  degraded: "Degraded",
  down: "Down",
};

const statusMessage = "Some features are temporarily unavailable.";

function overallStatus(list: Service[]): ServiceStatus {
  if (list.some((s) => s.status === "down")) return "down";
  if (list.some((s) => s.status === "degraded")) return "degraded";
  return "operational";
}

export default function SystemStatusIndicator() {
  const [open, setOpen] = useState(false);
  const overall = overallStatus(services);

  if (overall === "operational") return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="pointer-events-auto relative flex h-8 w-8 items-center justify-center transition-opacity hover:opacity-75"
          aria-label={`System status: ${statusLabel[overall]}`}
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(42_92%_52%)] text-[13px] font-bold leading-none text-black shadow-private">
            !
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-56 rounded-lg border border-border/60 bg-popover/95 p-3 text-popover-foreground backdrop-blur-xl"
      >
        <p className="text-sm leading-snug text-foreground/90">{statusMessage}</p>
      </PopoverContent>
    </Popover>
  );
}
