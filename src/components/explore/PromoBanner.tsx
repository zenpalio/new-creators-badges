import { ArrowUpRight, type LucideIcon } from "lucide-react";

type Pill = { label: string };

export type PromoBannerVariant = "premium" | "tokens" | "gift" | "feature";

type PromoBannerProps = {
  variant?: PromoBannerVariant;
  icon?: LucideIcon;
  emoji?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  pills?: Pill[];
  cta?: string;
  badge?: string | number;
  href?: string;
};

const variantStyles: Record<
  PromoBannerVariant,
  {
    container: string;
    iconBox: string;
    iconColor: string;
    title: string;
    eyebrow: string;
    pillDot: string;
    cta: string;
  }
> = {
  premium: {
    container:
      "border-primary/30 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent hover:border-primary/50",
    iconBox: "border-primary/30 bg-primary/10",
    iconColor: "text-primary",
    title: "text-white",
    eyebrow: "text-primary",
    pillDot: "bg-primary",
    cta: "bg-primary text-primary-foreground hover:opacity-90",
  },
  tokens: {
    container:
      "border-[hsl(45_95%_55%)]/30 bg-gradient-to-r from-[hsl(45_95%_55%)]/15 via-[hsl(45_95%_55%)]/5 to-transparent hover:border-[hsl(45_95%_55%)]/50",
    iconBox: "border-[hsl(45_95%_55%)]/30 bg-[hsl(45_95%_55%)]/10",
    iconColor: "text-[hsl(45_95%_55%)]",
    title: "text-white",
    eyebrow: "text-[hsl(45_95%_55%)]",
    pillDot: "bg-[hsl(45_95%_55%)]",
    cta: "bg-[hsl(45_95%_55%)] text-black hover:opacity-90",
  },
  gift: {
    container:
      "border-[hsl(0_85%_60%)]/40 bg-gradient-to-r from-[hsl(0_85%_60%)]/15 via-[hsl(0_85%_60%)]/5 to-transparent hover:border-[hsl(0_85%_60%)]/60",
    iconBox: "border-[hsl(0_85%_60%)]/30 bg-[hsl(0_85%_60%)]/10",
    iconColor: "text-[hsl(0_85%_65%)]",
    title: "text-white",
    eyebrow: "text-[hsl(0_85%_65%)]",
    pillDot: "bg-[hsl(0_85%_60%)]",
    cta: "bg-[hsl(0_85%_60%)] text-white hover:opacity-90",
  },
  feature: {
    container:
      "border-[hsl(280_85%_65%)]/30 bg-gradient-to-r from-[hsl(280_85%_65%)]/15 via-[hsl(280_85%_65%)]/5 to-transparent hover:border-[hsl(280_85%_65%)]/50",
    iconBox: "border-[hsl(280_85%_65%)]/30 bg-[hsl(280_85%_65%)]/10",
    iconColor: "text-[hsl(280_85%_70%)]",
    title: "text-white",
    eyebrow: "text-[hsl(280_85%_70%)]",
    pillDot: "bg-[hsl(280_85%_65%)]",
    cta: "bg-[hsl(280_85%_65%)] text-white hover:opacity-90",
  },
};

const PromoBanner = ({
  variant = "premium",
  icon: Icon,
  emoji,
  eyebrow,
  title,
  description,
  pills,
  cta = "Learn more",
  badge,
  href = "#",
}: PromoBannerProps) => {
  const s = variantStyles[variant];

  return (
    <a
      href={href}
      className={`group flex w-full items-center gap-4 rounded-2xl border px-4 py-3 transition-colors md:gap-5 md:px-5 md:py-4 ${s.container}`}
    >
      {/* Icon / Emoji */}
      <div className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border md:h-12 md:w-12 ${s.iconBox} ${s.iconColor}`}>
        {emoji ? (
          <span className="text-2xl leading-none" aria-hidden>
            {emoji}
          </span>
        ) : Icon ? (
          <Icon className="h-5 w-5 md:h-[22px] md:w-[22px]" strokeWidth={1.75} />
        ) : null}
        {badge !== undefined && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[hsl(0_85%_60%)] px-1.5 text-[10px] font-bold text-white shadow">
            {badge}
          </span>
        )}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <h3 className={`truncate text-sm font-semibold md:text-base ${s.title}`}>
          {title}
        </h3>
        {eyebrow && (
          <p className={`mt-0.5 text-[10px] font-bold uppercase tracking-wider ${s.eyebrow}`}>
            {eyebrow}
          </p>
        )}
        {description && !eyebrow && (
          <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-grey-light-3 md:text-[13px]">
            {description}
          </p>
        )}
      </div>

      {/* Pills */}
      {pills && pills.length > 0 && (
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          {pills.map((p) => (
            <span
              key={p.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white"
            >
              <span className={`h-1.5 w-1.5 rounded-full ${s.pillDot}`} />
              {p.label}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      <span
        className={`hidden shrink-0 items-center justify-center gap-1 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition-opacity sm:inline-flex ${s.cta}`}
      >
        {cta}
      </span>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-grey-light-3 transition-colors group-hover:text-white sm:hidden" />
    </a>
  );
};

export default PromoBanner;
