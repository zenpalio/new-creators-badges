import { ArrowUpRight, type LucideIcon } from "lucide-react";

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

const variantStyles: Record<
  PromoBannerVariant,
  {
    container: string;
    eyebrow: string;
    accent: string; // for the vertical accent bar + arrow
    cta: string;
    pattern: React.ReactNode;
  }
> = {
  premium: {
    container: "bg-white text-black",
    eyebrow: "text-black/60",
    accent: "bg-black",
    cta: "bg-black text-white hover:bg-black/85",
    pattern: (
      <svg
        aria-hidden
        viewBox="0 0 200 120"
        className="absolute inset-y-0 right-0 h-full w-[55%] text-black/[0.06]"
        preserveAspectRatio="xMaxYMid slice"
      >
        {Array.from({ length: 14 }).map((_, i) => (
          <line
            key={i}
            x1={i * 16}
            y1="0"
            x2={i * 16 + 60}
            y2="120"
            stroke="currentColor"
            strokeWidth="1"
          />
        ))}
      </svg>
    ),
  },
  tokens: {
    container: "bg-black text-white",
    eyebrow: "text-white/55",
    accent: "bg-white",
    cta: "bg-white text-black hover:bg-white/90",
    pattern: (
      <svg
        aria-hidden
        viewBox="0 0 200 120"
        className="absolute inset-y-0 right-0 h-full w-[55%] text-white/[0.07]"
        preserveAspectRatio="xMaxYMid slice"
      >
        {Array.from({ length: 7 }).map((_, row) =>
          Array.from({ length: 12 }).map((_, col) => (
            <circle
              key={`${row}-${col}`}
              cx={col * 18 + 8}
              cy={row * 18 + 8}
              r="2"
              fill="currentColor"
            />
          )),
        )}
      </svg>
    ),
  },
  gift: {
    container: "bg-[#0e0e0e] text-white",
    eyebrow: "text-white/55",
    accent: "bg-white",
    cta: "bg-white text-black hover:bg-white/90",
    pattern: (
      <svg
        aria-hidden
        viewBox="0 0 200 120"
        className="absolute inset-y-0 right-0 h-full w-[55%] text-white/[0.06]"
        preserveAspectRatio="xMaxYMid slice"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <path
            key={i}
            d={`M${i * 18},120 L${i * 18 + 30},0`}
            stroke="currentColor"
            strokeWidth="1"
          />
        ))}
      </svg>
    ),
  },
  feature: {
    container: "bg-white text-black",
    eyebrow: "text-black/55",
    accent: "bg-black",
    cta: "bg-black text-white hover:bg-black/85",
    pattern: (
      <svg
        aria-hidden
        viewBox="0 0 200 120"
        className="absolute inset-y-0 right-0 h-full w-[55%] text-black/[0.07]"
        preserveAspectRatio="xMaxYMid slice"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <rect
            key={i}
            x={i * 32 + 4}
            y="6"
            width="24"
            height="108"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        ))}
      </svg>
    ),
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
      className={`group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-white/[0.04] px-5 py-4 transition-transform hover:-translate-y-[1px] md:gap-5 md:px-6 md:py-5 ${s.container}`}
    >
      {/* Decorative pattern */}
      {s.pattern}

      {/* Vertical accent bar + glyph */}
      <div className="relative z-10 flex shrink-0 items-center gap-3">
        <span className={`block h-10 w-[3px] rounded-full ${s.accent}`} />
        {emoji ? (
          <span className="text-2xl leading-none" aria-hidden>
            {emoji}
          </span>
        ) : Icon ? (
          <Icon className="h-5 w-5 md:h-[22px] md:w-[22px]" strokeWidth={1.5} />
        ) : null}
      </div>

      {/* Text */}
      <div className="relative z-10 min-w-0 flex-1">
        {eyebrow && (
          <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${s.eyebrow}`}>
            {eyebrow}
          </p>
        )}
        <h3 className="mt-0.5 truncate text-[15px] font-semibold leading-tight md:text-base">
          {title}
        </h3>
        {description && (
          <p className="mt-0.5 line-clamp-1 text-xs leading-snug opacity-70 md:text-[13px]">
            {description}
          </p>
        )}
      </div>

      {/* CTA */}
      <span
        className={`relative z-10 hidden shrink-0 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors sm:inline-flex ${s.cta}`}
      >
        {cta}
        <ArrowUpRight className="h-3.5 w-3.5" />
      </span>
      <ArrowUpRight className="relative z-10 h-4 w-4 shrink-0 opacity-70 sm:hidden" />
    </a>
  );
};

export default PromoBanner;
