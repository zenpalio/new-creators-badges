import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, Film, Heart, ImageIcon, type LucideIcon } from "lucide-react";

// ---- First-card CTA used inside media grids (extracted from Gallery) ----
export type CtaVariant = "story" | "babe" | "image" | "video";

export const pickCtaVariant = (to: string, label: string): CtaVariant => {
  const k = `${to} ${label}`.toLowerCase();
  if (k.includes("story")) return "story";
  if (k.includes("babe")) return "babe";
  if (k.includes("video")) return "video";
  if (k.includes("image")) return "image";
  return "story";
};

export const CTA_VARIANTS: Record<
  CtaVariant,
  { accent: string; ring: string; glow: string; tag: string }
> = {
  story: { accent: "text-amber-300/90", ring: "ring-amber-300/15", glow: "bg-amber-400/10", tag: "Story" },
  babe:  { accent: "text-rose-300/90",  ring: "ring-rose-300/15",  glow: "bg-rose-400/10",  tag: "Babe"  },
  image: { accent: "text-emerald-300/90", ring: "ring-emerald-300/15", glow: "bg-emerald-400/10", tag: "Image" },
  video: { accent: "text-sky-300/90",   ring: "ring-sky-300/15",   glow: "bg-sky-400/10",   tag: "Video" },
};

const CTA_ICONS: Record<CtaVariant, LucideIcon> = {
  story: BookOpen,
  babe: Heart,
  image: ImageIcon,
  video: Film,
};

const CtaSkeleton = ({ variant }: { variant: CtaVariant }) => {
  switch (variant) {
    case "story":
      return (
        <div className="absolute inset-0 rounded-xl bg-white/[0.03] p-2.5 ring-1 ring-white/10">
          <div className="space-y-1.5">
            <div className="h-1 w-5/6 rounded-full bg-white/15" />
            <div className="h-1 w-4/6 rounded-full bg-white/10" />
            <div className="h-1 w-3/6 rounded-full bg-white/10" />
          </div>
          <div className="mt-2 flex gap-1.5">
            <div className="relative h-7 flex-1 overflow-hidden rounded-md bg-white/[0.06] ring-1 ring-white/10">
              <div className="absolute right-1 top-0.5 h-1 w-1 rounded-full bg-white/40" />
              <svg viewBox="0 0 40 28" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                <path d="M0 22 L12 14 L20 19 L28 11 L40 18 L40 28 L0 28 Z" fill="rgba(255,255,255,0.18)" />
              </svg>
            </div>
            <div className="flex h-7 flex-1 items-center justify-center gap-[2px] rounded-md bg-white/[0.06] px-1.5 ring-1 ring-white/10">
              {[3, 5, 2, 6, 4, 7, 3, 5].map((h, i) => (
                <div key={i} className="w-[2px] rounded-full bg-white/40" style={{ height: `${h * 2}px` }} />
              ))}
            </div>
          </div>
        </div>
      );
    case "babe":
      return (
        <div className="absolute inset-0 flex items-center gap-2.5 rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/10">
          <div className="h-10 w-10 shrink-0 rounded-full bg-white/15" />
          <div className="flex-1 space-y-1.5">
            <div className="h-1.5 w-3/4 rounded-full bg-white/15" />
            <div className="h-1 w-1/2 rounded-full bg-white/10" />
            <div className="mt-1 flex gap-1">
              <div className="h-2 w-6 rounded-full bg-white/10" />
              <div className="h-2 w-8 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      );
    case "image":
      return (
        <div className="absolute inset-0 overflow-hidden rounded-xl bg-white/[0.03] ring-1 ring-white/10">
          <div className="absolute right-3 top-2.5 h-2.5 w-2.5 rounded-full bg-white/25" />
          <svg viewBox="0 0 144 96" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
            <path d="M0 78 L40 50 L70 70 L95 45 L125 65 L144 55 L144 96 L0 96 Z" fill="rgba(255,255,255,0.10)" />
            <path d="M0 86 L30 70 L60 82 L90 68 L120 80 L144 72 L144 96 L0 96 Z" fill="rgba(255,255,255,0.06)" />
          </svg>
        </div>
      );
    case "video":
      return (
        <div className="absolute inset-0 rounded-xl bg-white/[0.03] ring-1 ring-white/10">
          <div className="absolute inset-x-0 top-0 flex h-[68%] items-center justify-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
              <div className="ml-0.5 h-0 w-0 border-y-[5px] border-l-[7px] border-y-transparent border-l-white/70" />
            </div>
          </div>
          <div className="absolute inset-x-3 bottom-2.5 space-y-1.5">
            <div className="h-1 w-full rounded-full bg-white/10">
              <div className="h-1 w-1/3 rounded-full bg-white/40" />
            </div>
            <div className="flex justify-between">
              <div className="h-1 w-4 rounded-full bg-white/10" />
              <div className="h-1 w-4 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      );
  }
};

export const CtaIllustration = ({ variant }: { variant: CtaVariant }) => {
  const Icon = CTA_ICONS[variant];
  const v = CTA_VARIANTS[variant];
  return (
    <div className="pointer-events-none relative h-16 w-24 sm:h-24 sm:w-36 transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
      <CtaSkeleton variant={variant} />
      <div className={`absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(0_0%_5%)] ring-1 ${v.ring} backdrop-blur-sm transition-transform duration-500 ease-out group-hover:rotate-6`}>
        <Icon className={`h-3.5 w-3.5 ${v.accent}`} strokeWidth={1.8} />
      </div>
    </div>
  );
};

export interface CreateMediaCardProps {
  to: string;
  label: string;
  aspectClass?: string;
}

const CreateMediaCard = ({ to, label, aspectClass = "h-full" }: CreateMediaCardProps) => {
  const variant = pickCtaVariant(to, label);
  const { ring, glow } = CTA_VARIANTS[variant];
  return (
    <Link
      to={to}
      aria-label={label}
      className={`group relative block h-full w-full overflow-hidden rounded-2xl bg-[hsl(0_0%_5%)] ring-1 ${ring} transition-all duration-500 ease-out hover:-translate-y-1 hover:ring-white/20`}
    >
      <div className={`relative w-full ${aspectClass}`}>
        <div
          className={`pointer-events-none absolute -bottom-16 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full ${glow} blur-3xl`}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <CtaIllustration variant={variant} />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white sm:text-base">{label}</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition-all duration-500 group-hover:bg-white/10 group-hover:ring-white/20">
              <ArrowUpRight className="h-3.5 w-3.5 text-white" strokeWidth={2} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CreateMediaCard;
