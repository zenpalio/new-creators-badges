import { useEffect, useRef, useState, type CSSProperties, type ComponentType, type MouseEvent } from "react";
import { Navigate } from "react-router-dom";
import { ArrowRight, BookOpen, Sparkles, ImageIcon } from "lucide-react";
import LikeButton from "../explore/LikeButton";
import { getFunnelVariant, type FunnelAudience, type FunnelMode, type FunnelKey, type FunnelVariant } from "../../data/funnelVariants";


// Banner background images (audience+mode -> 3 banners)
import herRealStory from "../../assets/funnel/her-real-story.jpg";
import herRealImage from "../../assets/funnel/her-real-image.jpg";
import herRealCreate from "../../assets/funnel/her-real-create.jpg";
import herAnimeStory from "../../assets/funnel/her-anime-story.jpg";
import herAnimeImage from "../../assets/funnel/her-anime-image.jpg";
import herAnimeCreate from "../../assets/funnel/her-anime-create.jpg";
import himRealStory from "../../assets/funnel/him-real-story.jpg";
import himRealImage from "../../assets/funnel/him-real-image.jpg";
import himRealCreate from "../../assets/funnel/him-real-create.jpg";
import himAnimeStory from "../../assets/funnel/him-anime-story.jpg";
import himAnimeImage from "../../assets/funnel/him-anime-image.jpg";
import himAnimeCreate from "../../assets/funnel/him-anime-create.jpg";
import gayRealStory from "../../assets/funnel/gay-real-story.jpg";
import gayRealImage from "../../assets/funnel/gay-real-image.jpg";
import gayRealCreate from "../../assets/funnel/gay-real-create.jpg";
import gayAnimeStory from "../../assets/funnel/gay-anime-story.jpg";
import gayAnimeImage from "../../assets/funnel/gay-anime-image.jpg";
import gayAnimeCreate from "../../assets/funnel/gay-anime-create.jpg";

const BANNER_BG: Record<FunnelKey, { story: string; image: string; create: string }> = {
  "her-real":   { story: herRealStory,   image: herRealImage,   create: herRealCreate   },
  "her-anime":  { story: herAnimeStory,  image: herAnimeImage,  create: herAnimeCreate  },
  "him-real":   { story: himRealStory,   image: himRealImage,   create: himRealCreate   },
  "him-anime":  { story: himAnimeStory,  image: himAnimeImage,  create: himAnimeCreate  },
  "gay-real":   { story: gayRealStory,   image: gayRealImage,   create: gayRealCreate   },
  "gay-anime":  { story: gayAnimeStory,  image: gayAnimeImage,  create: gayAnimeCreate  },
};

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
  const bgs = BANNER_BG[variant.key];

  return [
    {
      eyebrow: "Create",
      title: "Build your own",
      description: "Design the perfect companion — looks, voice, personality. Yours, forever.",
      cta: "Create now",
      bg: bgs.create,
      accentHsl: accent,
      badgeIcon: Sparkles,
      ctaClass: "bg-primary-v2 text-primary-v2-foreground hover:bg-primary-v2/90",
    },
    {
      eyebrow: "Story",
      title: "Write your fantasy",
      description: "Co-create immersive stories with your companion — endless plots, your rules.",
      cta: "Start a story",
      bg: bgs.story,
      accentHsl: accent,
      badgeIcon: BookOpen,
      ctaClass: "bg-white text-black hover:bg-white/90",
    },
    {
      eyebrow: "Images",
      title: "Generate spicy AI photos",
      description: "Turn any prompt into stunning AI images of your favorite characters.",
      cta: "Generate",
      bg: bgs.image,
      accentHsl: accent,
      badgeIcon: ImageIcon,
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

  const trendingIds = new Set(
    [...variant.characters]
      .filter((c) => typeof c.likeCount === "number")
      .sort((a, b) => (b.likeCount as number) - (a.likeCount as number))
      .slice(0, 3)
      .map((c) => c.id),
  );

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
              <a
                key={c.id}
                href={c.externalUrl ?? `/chat/${c.id}`}
                {...(c.externalUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                aria-label={c.name}
                className="group relative block w-full overflow-hidden rounded-2xl bg-grey-dark-1-v2"
              >
                <div className="relative aspect-[13/19] w-full overflow-hidden bg-grey-dark-1-v2">
                  <img
                    src={c.imageUrl}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute top-2 right-2 z-[3]">
                    <LikeButton
                      variant="video"
                      liked={!!likedMap[c.id]}
                      onClick={(e: MouseEvent<HTMLButtonElement>) => { e.preventDefault(); toggleLiked(c.id); }}
                      iconClassName="h-3 w-3"
                      className="gap-1 rounded-full bg-black/55 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm"
                    >
                      <span>{c.likeCount ?? 0}</span>
                    </LikeButton>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 z-[3] p-3">
                    <h3 className="text-base font-semibold text-white drop-shadow-md line-clamp-1 md:text-lg">{c.name}</h3>
                    <p className="mt-1 text-[13px] leading-snug text-white/80 line-clamp-3">{c.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </section>

        </div>
      </main>
    </div>
  );
}
