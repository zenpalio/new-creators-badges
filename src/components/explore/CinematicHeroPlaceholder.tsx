import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export interface CinematicHeroPlaceholderProps extends HTMLAttributes<HTMLElement> {}

/**
 * Same footprint and layering as {@link CinematicHero} so Explore (or consumers)
 * can swap it in while hero slide data is loading without layout shift.
 */
const CinematicHeroPlaceholder = ({
  className,
  ...props
}: CinematicHeroPlaceholderProps) => {
  return (
    <section
      className={cn(
        "relative w-full shrink-0 overflow-hidden select-none",
        className,
      )}
      style={{ height: "clamp(520px, 78vh, 760px)" }}
      aria-busy="true"
      aria-label="Loading featured hero"
      role="status"
      {...props}
    >
      <div className="absolute inset-0 bg-background-v2" />

      {/* Blurred “backdrop” block — reads like the hero image wash */}
      <div className="absolute inset-0 scale-110 bg-muted-v2/40 blur-3xl" />

      {/* Desktop portrait strip */}
      <div className="absolute inset-y-0 right-0 hidden h-full md:flex">
        <div className="relative h-full" style={{ aspectRatio: "13 / 19" }}>
          <Skeleton className="h-full w-full rounded-none bg-muted-v2/50" />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, hsl(var(--background-v2)) 100%)",
            }}
          />
        </div>
      </div>

      {/* Mobile full-bleed image area */}
      <div className="absolute inset-0 md:hidden">
        <Skeleton className="h-full w-full rounded-none bg-muted-v2/45" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 md:hidden"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, hsl(var(--background-v2) / 0.2) 35%, hsl(var(--background-v2) / 0.85) 70%, hsl(var(--background-v2)) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          background:
            "linear-gradient(90deg, hsl(var(--background-v2) / 0.92) 0%, hsl(var(--background-v2) / 0.7) 25%, hsl(var(--background-v2) / 0.25) 55%, transparent 75%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 hidden md:block"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, hsl(var(--background-v2)) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] items-end px-6 pb-20 md:items-center md:pb-0">
        <div className="max-w-xl space-y-4">
          <Skeleton className="h-7 w-40 rounded-full " />
          <div className="space-y-3">
            <Skeleton className="h-10 w-[92%] rounded-lg  md:h-14" />
            <Skeleton className="h-10 w-[72%] rounded-lg  md:h-14" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full max-w-lg rounded-md " />
            <Skeleton className="h-4 w-full max-w-lg rounded-md " />
            <Skeleton className="h-4 w-[88%] max-w-lg rounded-md " />
          </div>
          <div className="hidden flex-wrap gap-2 pt-1 md:flex">
            <Skeleton className="h-7 w-20 rounded-[5px] " />
            <Skeleton className="h-7 w-24 rounded-[5px] " />
            <Skeleton className="h-7 w-16 rounded-[5px] " />
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Skeleton className="h-11 w-36 rounded-full bg-white/15" />
            <Skeleton className="h-11 w-28 rounded-full " />
          </div>
        </div>
      </div>
    </section>
  )
}

export default CinematicHeroPlaceholder
