import { ArrowRight, type LucideIcon } from "lucide-react";

export type PromoBannerVariant = "premium" | "tokens" | "gift" | "feature";

type PromoBannerProps = {
  variant?: PromoBannerVariant;
  icon?: LucideIcon;
  emoji?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  cta?: string;
  href?: string;
};

// Each variant: a moody gradient + soft accent glow + monogram art on the right.
const variantStyles: Record<
  PromoBannerVariant,
  {
    bg: string;
    border: string;
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
    glow: string;
    monogram: string;
    monoColor: string;
  }
> = {
  premium: {
    bg: "bg-gradient-to-br from-[#1a1d24] via-[#101218] to-[#0a0b0f]",
    border: "border-white/[0.06] hover:border-white/[0.12]",
    eyebrow: "text-white/40",
    title: "text-white",
    description: "text-white/55",
    cta: "bg-white text-black hover:bg-white/90",
    glow: "bg-[radial-gradient(circle_at_70%_50%,hsl(213_100%_60%/0.18),transparent_60%)]",
    monogram: "P",
    monoColor: "text-white/[0.04]",
  },
  tokens: {
    bg: "bg-gradient-to-br from-[#1f1a10] via-[#15110a] to-[#0a0805]",
    border: "border-[hsl(45_70%_50%)]/15 hover:border-[hsl(45_70%_50%)]/30",
    eyebrow: "text-[hsl(45_85%_65%)]/80",
    title: "text-white",
    description: "text-white/55",
    cta: "bg-[hsl(45_90%_60%)] text-black hover:bg-[hsl(45_90%_65%)]",
    glow: "bg-[radial-gradient(circle_at_75%_50%,hsl(45_90%_55%/0.22),transparent_60%)]",
    monogram: "20",
    monoColor: "text-[hsl(45_90%_55%)]/[0.06]",
  },
  gift: {
    bg: "bg-gradient-to-br from-[#1a1118] via-[#120a10] to-[#0a0507]",
    border: "border-[hsl(340_70%_55%)]/15 hover:border-[hsl(340_70%_55%)]/30",
    eyebrow: "text-[hsl(340_90%_70%)]/80",
    title: "text-white",
    description: "text-white/55",
    cta: "bg-[hsl(340_85%_55%)] text-white hover:bg-[hsl(340_85%_60%)]",
    glow: "bg-[radial-gradient(circle_at_75%_50%,hsl(340_90%_55%/0.25),transparent_60%)]",
    monogram: "★",
    monoColor: "text-[hsl(340_90%_60%)]/[0.07]",
  },
  feature: {
    bg: "bg-gradient-to-br from-[#161a22] via-[#0e1018] to-[#08090d]",
    border: "border-[hsl(265_70%_60%)]/15 hover:border-[hsl(265_70%_60%)]/30",
    eyebrow: "text-[hsl(265_85%_75%)]/80",
    title: "text-white",
    description: "text-white/55",
    cta: "bg-white text-black hover:bg-white/90",
    glow: "bg-[radial-gradient(circle_at_75%_50%,hsl(265_90%_60%/0.22),transparent_60%)]",
    monogram: "✦",
    monoColor: "text-[hsl(265_90%_70%)]/[0.07]",
  },
};

const PromoBanner = ({
  variant = "premium",
  icon: Icon,
  emoji,
  eyebrow,
  title,
  description,
  cta = "Learn more",
  href = "#",
}: PromoBannerProps) => {
  const s = variantStyles[variant];

  return (
    <a
      href={href}
      className={`group relative flex w-full items-stretch overflow-hidden rounded-2xl border transition-colors ${s.bg} ${s.border}`}
    >
      {/* Soft colored glow */}
      <div className={`pointer-events-none absolute inset-0 ${s.glow}`} />

      {/* Giant monogram art on the right */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 select-none font-black leading-none tracking-tighter ${s.monoColor}`}
        style={{ fontSize: "180px" }}
      >
        {s.monogram}
      </div>

      {/* Subtle dotted grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)",
          backgroundSize: "14px 14px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex w-full items-center gap-4 px-5 py-4 md:gap-5 md:px-6 md:py-5">
        {/* Glyph */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm md:h-12 md:w-12">
          {emoji ? (
            <span className="text-xl leading-none" aria-hidden>
              {emoji}
            </span>
          ) : Icon ? (
            <Icon className="h-5 w-5 text-white md:h-[22px] md:w-[22px]" strokeWidth={1.5} />
          ) : null}
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          {eyebrow && (
            <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${s.eyebrow}`}>
              {eyebrow}
            </p>
          )}
          <h3 className={`mt-0.5 truncate text-[15px] font-semibold leading-tight md:text-base ${s.title}`}>
            {title}
          </h3>
          {description && (
            <p className={`mt-0.5 line-clamp-1 text-xs leading-snug md:text-[13px] ${s.description}`}>
              {description}
            </p>
          )}
        </div>

        {/* CTA */}
        <span
          className={`hidden shrink-0 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors sm:inline-flex ${s.cta}`}
        >
          {cta}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-white/60 transition-transform group-hover:translate-x-0.5 sm:hidden" />
      </div>
    </a>
  );
};

export default PromoBanner;
