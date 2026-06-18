import { useEffect, useRef, useState, type CSSProperties, type ComponentType } from "react";
import { Navigate } from "react-router-dom";
import { ArrowRight, BookOpen, Crown, Sparkles, MessageCircle } from "lucide-react";
import ExploreVideoCard from "../explore/ExploreVideoCard";
import LikeButton from "../explore/LikeButton";
import { getFunnelVariant, type FunnelAudience, type FunnelMode, type FunnelVariant } from "../../data/funnelVariants";
import storyCreatorBg from "../../assets/story-creator-bg.jpg";
import premiumBg from "../../assets/premium-bg.jpg";
import badgesBannerBg from "../../assets/badges-banner-bg.jpg";

// ---- Banner types ----
type FunnelBanner = {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  bg: string;
  accentHsl: string;
  badgeIcon: ComponentType<{ className?: string; style?: CSSProperties }>;
  ctaClass: string;
};

function buildBanners(variant: FunnelVariant): FunnelBanner[] {
  const accent = variant.audience === "her" ? "320 70% 55%"
    : variant.audience === "him" ? "213 100% 50%"
    : "281 85% 62%";
  const isAnime = variant.mode === "anime";

  return [
    {
      eyebrow: isAnime ? "Anime" : "Photoreal",
      title: "Find your match",
      description: isAnime
        ? "Stylized anime companions — pick one and start chatting in seconds."
        : "Photoreal companions — pick one and start chatting in seconds.",
      cta: "Start chatting",
      bg: storyCreatorBg,
      accentHsl: accent,
      badgeIcon: MessageCircle,
      ctaClass: "bg-primary-v2 text-primary-v2-foreground hover:bg-primary-v2/90",
    },
    {
      eyebrow: "Premium",
      title: "Skip the queue",
      description: "Unlimited chats, HD images and videos, exclusive characters.",
      cta: "Upgrade",
      bg: premiumBg,
      accentHsl: "292 91% 73%",
      badgeIcon: Crown,
      ctaClass: "bg-white text-black hover:bg-white/90",
    },
    {
      eyebrow: "Create",
      title: "Build your own",
      description: "Design a companion from scratch — looks, voice and personality.",
      cta: "Create now",
      bg: badgesBannerBg,
      accentHsl: accent,
      badgeIcon: Sparkles,
      ctaClass: "bg-primary-v2 text-primary-v2-foreground hover:bg-primary-v2/90",
    },
  ];
}

// ---- Hero banners (mirrors ExploreKling layout: mobile slider + xl 65/35 split) ----
function HeroBanners({ banners }: { banners: FunnelBanner[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      setActiveIdx(idx);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <section>
      <div className="xl:hidden">
        <div
          ref={scrollerRef}
          className="-mx-4 flex snap-x snap-mandatory overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {banners.map((b) => (
            <div key={b.title} className="w-full shrink-0 snap-center px-4">
              <HeroBannerCard banner={b} large />
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to banner ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${activeIdx === i ? "w-5 bg-white" : "w-1.5 bg-white/30"}`}
            />
          ))}
        </div>
      </div>

      <div className="hidden xl:grid xl:grid-cols-[65%_35%] gap-3">
        {banners[0] && <HeroBannerCard banner={banners[0]} large={false} />}
        <div className="flex flex-col gap-3">
          {banners.slice(1).map((b) => (
            <HeroBannerCard key={b.title} banner={b} large={false} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroBannerCard({ banner: b, large }: { banner: FunnelBanner; large: boolean }) {
  const BadgeIcon = b.badgeIcon;
  return (
    <a
      href="#"
      style={{ "--accent": b.accentHsl } as CSSProperties & { "--accent": string }}
      className={`group relative block overflow-hidden rounded-2xl border border-white/5 bg-black transition-colors hover:border-white/15 ${
        large ? "h-[265px] sm:h-[285px] md:h-[305px] lg:h-[320px]" : "min-h-[220px]"
      }`}
    >
      <img src={b.bg} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/70 via-black/20 to-transparent" />
      <div
        className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full blur-3xl opacity-40"
        style={{ background: `hsl(var(--accent) / 0.5)` }}
      />
      <div className="relative flex h-full items-center p-4 md:p-5">
        <div className="w-full rounded-xl border border-white/10 bg-black/35 p-4 backdrop-blur-md md:p-5">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-white/90"
              style={{
                background: `hsl(var(--accent) / 0.14)`,
                borderColor: `hsl(var(--accent) / 0.4)`,
              }}
            >
              <BadgeIcon className="h-3 w-3" style={{ color: `hsl(var(--accent))` }} />
              {b.eyebrow}
            </span>
          </div>
          <h2 className="mt-2 text-2xl font-semibold leading-tight text-white md:text-3xl">{b.title}</h2>
          <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-white/70">{b.description}</p>
          <div className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${b.ctaClass}`}>
            {b.cta}
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </a>
  );
}

interface FunnelPageProps {
  audience: FunnelAudience;
  mode: FunnelMode;
}

export default function FunnelPage({ audience, mode }: FunnelPageProps) {
  const variant = getFunnelVariant(audience, mode);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  if (!variant) return <Navigate to="/" replace />;

  const banners = buildBanners(variant);
  const toggleLiked = (id: string) => setLikedMap((m) => ({ ...m, [id]: !m[id] }));

  return (
    <div className="relative flex min-h-svh w-full overflow-x-hidden bg-background-v2 font-onest text-foreground-v2">
      <main className="relative flex w-full flex-1 flex-col">
        <div className="relative z-10 flex w-full flex-col gap-6 px-4 pb-16 pt-6 md:px-8 lg:px-12">
          {/* Top banners */}
          <HeroBanners banners={banners} />

          {/* Characters grid (~20) */}
          <section
            aria-label={variant.sectionTitle}
            className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5"
          >
            {variant.characters.map((c) => (
              <ExploreVideoCard
                key={c.id}
                poster={c.imageUrl}
                href={`/chat/${c.id}`}
                imageAlt={c.name}
                likeButton={
                  <LikeButton
                    variant="video"
                    liked={!!likedMap[c.id]}
                    onClick={() => toggleLiked(c.id)}
                  >
                    <span>{c.likeCount ?? 0}</span>
                  </LikeButton>
                }
              />
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
