import { type TouchEvent, useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Check, ChevronLeft, ChevronRight, Crown, Film, GitBranch, Image as ImageIcon, Layers, MessageCircle, Mic, Music, Play, Sparkles, Star, Trophy, User, Wand2 } from "lucide-react";
import ChatIcon from "@/components/icons/ChatIcon";
import LikeButton from "./LikeButton";

export type HeroMedia =
  | { type: "image"; url: string }
  | { type: "video"; url: string; poster?: string };

export interface HeroSlide {
  name: string;
  tagline?: string;
  description: string;
  imageUrl: string;
  /** Optional gallery of additional images/videos cycled within the slide */
  media?: HeroMedia[];
  tags?: string[];
  meta?: { messages?: string; likes?: string };
  /** Optional override for the small pill above the headline (default: "Featured today") */
  badge?: string;
  /** Optional override for the primary CTA label (default: "Chat now") */
  cta?: string;
  /** Visual treatment. "portrait" (default) shows a tall portrait panel on the right.
   *  "banner" shows a full-bleed wide image — better for promo / sale / feature cards.
   *  "story" shows a book-cover style card with chapter/episode metadata.
   *  "creators" shows a top-3 creators podium. */
  layout?: "portrait" | "banner" | "story" | "creators" | "premium" | "feature";
  /** Optional accent color (hsl) for banner overlays */
  accent?: string;
  /** Story metadata, shown when layout === "story" */
  storyMeta?: { chapters?: number; episodes?: number; rating?: number };
  /** Top creators, shown when layout === "creators" */
  creators?: { rank: number; name: string; avatarUrl: string; subtitle?: string }[];
  /** Premium plan, shown when layout === "premium" */
  premiumPlan?: { price: string; period: string; perks: string[] };
  /** Optional second plan for premium layout (e.g. Ultra) */
  premiumPlans?: { name: string; price: string; period: string; perks: string[]; highlight?: boolean; bonus?: string }[];
  /** Feature highlight, shown when layout === "feature" */
  featureMeta?: { eyebrow?: string; bullets?: string[] };
}

interface Props {
  slides: HeroSlide[];
  intervalMs?: number;
  /** How long each media item within a slide stays before crossfading */
  mediaIntervalMs?: number;
}

const CinematicHero = ({ slides, intervalMs = 7000, mediaIntervalMs = 3500 }: Props) => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Build a normalized media list per slide (always at least the imageUrl)
  const slideMedia = useMemo<HeroMedia[][]>(
    () =>
      slides.map((s) =>
        s.media && s.media.length > 0
          ? s.media
          : [{ type: "image", url: s.imageUrl }],
      ),
    [slides],
  );

  // Sub-index for cycling media within the active slide
  const [mediaIdx, setMediaIdx] = useState(0);

  // Reset media index when slide changes
  useEffect(() => {
    setMediaIdx(0);
  }, [active]);

  // Auto-cycle media within the active slide
  useEffect(() => {
    const list = slideMedia[active];
    if (!list || list.length <= 1 || paused) return;
    const id = window.setInterval(() => {
      setMediaIdx((i) => (i + 1) % list.length);
    }, mediaIntervalMs);
    return () => window.clearInterval(id);
  }, [active, paused, slideMedia, mediaIntervalMs]);

  // Auto-rotate slides. Progress is CSS-driven so the hero doesn't re-render every frame.
  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const id = window.setTimeout(() => {
      setDir(1);
      setActive((a) => (a + 1) % slides.length);
    }, intervalMs);
    return () => window.clearTimeout(id);
  }, [active, paused, intervalMs, slides.length]);

  const [dir, setDir] = useState<1 | -1>(1);
  const go = (i: number) => {
    setActive((prev) => {
      const next = (i + slides.length) % slides.length;
      if (next !== prev) setDir(next > prev || (prev === slides.length - 1 && next === 0) ? 1 : -1);
      return next;
    });
  };
  const slide = slides[active];

  // Mobile swipe: touch-only with a slight follow effect.
  const sectionRef = useRef<HTMLElement | null>(null);
  const touchStart = useRef<{ x: number; y: number; at: number } | null>(null);
  const touchLast = useRef<{ x: number; y: number } | null>(null);
  const lockedHorizontal = useRef(false);
  const activeRef = useRef(active);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  useEffect(() => { activeRef.current = active; }, [active]);

  const clearTouch = () => {
    touchStart.current = null;
    touchLast.current = null;
    lockedHorizontal.current = false;
    setDragX(0);
    setDragging(false);
    setPaused(false);
  };

  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    if (event.touches.length !== 1 || slides.length <= 1) return;
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY, at: Date.now() };
    touchLast.current = { x: touch.clientX, y: touch.clientY };
    lockedHorizontal.current = false;
    setPaused(true);
  };

  const handleTouchMove = (event: TouchEvent<HTMLElement>) => {
    const start = touchStart.current;
    if (!start || event.touches.length !== 1) return;
    const touch = event.touches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    touchLast.current = { x: touch.clientX, y: touch.clientY };

    if (!lockedHorizontal.current) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx) * 1.15) {
        clearTouch();
        return;
      }
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
        lockedHorizontal.current = true;
        setDragging(true);
      }
    }

    if (lockedHorizontal.current) {
      // Slight follow with rubber-band damping
      const damped = Math.sign(dx) * Math.min(Math.abs(dx) * 0.15, 32);
      setDragX(damped);
    }
  };

  const handleTouchEnd = () => {
    const start = touchStart.current;
    const last = touchLast.current;
    if (!start || !last) {
      clearTouch();
      return;
    }

    const dx = last.x - start.x;
    const dy = last.y - start.y;
    const elapsed = Date.now() - start.at;
    const horizontal = Math.abs(dx) > Math.abs(dy) * 1.25;
    const deliberateSwipe = horizontal && Math.abs(dx) > 64;
    const quickSwipe = horizontal && elapsed < 450 && Math.abs(dx) > 42;

    if (deliberateSwipe || quickSwipe) {
      go(activeRef.current + (dx < 0 ? 1 : -1));
    }
    clearTouch();
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full shrink-0 overflow-hidden touch-pan-y select-none"
      style={{ height: "clamp(520px, 78vh, 760px)" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={clearTouch}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {/* Only render the active slide — no parked neighbors causing ghost overlays */}
      {slides.map((s, i) => {
        const isActive = i === active;
        if (!isActive) return null;
        return (
        <div
          key={s.name + i + "-" + active}
          className="absolute inset-0 hero-slide-enter"
          style={{
            transform: dragX ? `translate3d(${dragX}px,0,0)` : undefined,
            transition: dragging ? "none" : "transform 500ms ease-out",
            willChange: dragging ? "transform" : undefined,
            ["--hero-dir" as any]: dir === 1 ? "1" : "-1",
          }}
          aria-hidden={!isActive}
        >
          {(() => {
            const list = slideMedia[i];
            const m = list[0];
            const isBanner = s.layout === "banner";
            const isStory = s.layout === "story";
            const isPremium = s.layout === "premium";
            const isFeature = s.layout === "feature";

            if (isStory) {
              const list = slideMedia[i];
              const covers = list.length > 0 ? list : [{ type: "image" as const, url: s.imageUrl }];
              const c0 = covers[0];
              const c1 = covers[1] ?? covers[0];
              const c2 = covers[2] ?? covers[0];
              const src0 = c0.type === "image" ? c0.url : (c0.poster ?? s.imageUrl);
              const src1 = c1.type === "image" ? c1.url : (c1.poster ?? s.imageUrl);
              const src2 = c2.type === "image" ? c2.url : (c2.poster ?? s.imageUrl);
              const rating = s.storyMeta?.rating;
              const chapters = s.storyMeta?.chapters;
              const episodes = s.storyMeta?.episodes;
              const likes = s.meta?.likes;
              return (
                <div className="absolute inset-0">
                  {/* Moody backdrop */}
                  <img
                    src={src0}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 h-full w-full scale-125 object-cover blur-3xl saturate-125 opacity-60"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse at 70% 45%, hsl(320 50% 25% / 0.55) 0%, hsl(260 35% 10% / 0.85) 55%, hsl(0 0% 0% / 0.95) 100%)",
                    }}
                  />

                  {/* Desktop: wide 5:3 story card matching StoryContentCard */}
                  <div className="absolute inset-y-0 right-0 hidden items-center justify-center pr-12 lg:pr-20 md:flex">
                    <div className="relative h-[78%] aspect-[13/19]">
                      {/* Back layer (subtle peek) */}
                      <div
                        className="absolute inset-0 translate-x-6 translate-y-4 rounded-xl overflow-hidden ring-1 ring-white/10 opacity-70"
                        style={{ boxShadow: "0 25px 50px -15px rgba(0,0,0,0.7)" }}
                      >
                        <img src={src1} alt="" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-black/40" />
                      </div>

                      {/* Main story card */}
                      <div
                        className="absolute inset-0 rounded-xl overflow-hidden ring-1 ring-white/15 bg-card border border-border/50"
                        style={{ boxShadow: "0 35px 60px -15px rgba(0,0,0,0.8)" }}
                      >
                        <img
                          src={src0}
                          alt={s.name}
                          className="h-full w-full object-cover object-top"
                          loading={i === 0 ? "eager" : "lazy"}
                        />

                        {/* Top-left Story badge */}
                        <div className="absolute left-2.5 top-2.5 z-10">
                          <span className="flex items-center gap-1 rounded-lg border border-border/30 bg-background/70 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur-sm">
                            <BookOpen className="h-3.5 w-3.5" /> Story
                          </span>
                        </div>

                        {/* Top-right rating */}
                        {rating != null && (
                          <div className="absolute right-2.5 top-2.5 z-10">
                            <span className="flex items-center gap-1 rounded-lg border border-border/30 bg-background/70 px-2 py-1 text-[11px] font-semibold text-yellow-400 backdrop-blur-sm">
                              <Star className="h-3.5 w-3.5 fill-yellow-400" />
                              {rating.toFixed(1)}
                            </span>
                          </div>
                        )}

                        {/* Bottom gradient + meta */}
                        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-3 pb-3 pt-12">
                          <p className="mb-0.5 truncate text-lg font-bold tracking-tight text-white drop-shadow-md md:text-xl">
                            {s.name}
                          </p>
                          <p className="mb-2 line-clamp-2 text-[11px] leading-relaxed text-white/60">
                            {s.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-3">
                            {episodes != null && (
                              <span className="flex items-center gap-1 text-[11px] text-white/80">
                                <Film className="h-3.5 w-3.5" />
                                {episodes} {episodes === 1 ? "episode" : "episodes"}
                              </span>
                            )}
                            {chapters != null && (
                              <span className="flex items-center gap-1 text-[11px] text-white/80">
                                <Layers className="h-3.5 w-3.5" />
                                {chapters} {chapters === 1 ? "chapter" : "chapters"}
                              </span>
                            )}
                            {likes && (
                              <LikeButton iconClassName="h-3.5 w-3.5" className="text-[11px] text-white/80 hover:text-white">
                                <span>{likes}</span>
                              </LikeButton>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile: cinematic full-bleed cover. Title/meta/CTA come from the global content block below. */}
                  <div className="absolute inset-0 md:hidden">
                    <img
                      src={src0}
                      alt={s.name}
                      className="h-full w-full object-cover object-top"
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                    {/* Top-left Story badge */}
                    <div className="absolute left-4 top-4 z-10">
                      <span className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                        <BookOpen className="h-3.5 w-3.5" /> Story
                      </span>
                    </div>
                    {/* Top-right rating */}
                    {rating != null && (
                      <div className="absolute right-4 top-4 z-10">
                        <span className="flex items-center gap-1 rounded-lg border border-white/15 bg-black/45 px-2 py-1 text-[11px] font-semibold text-yellow-400 backdrop-blur-md">
                          <Star className="h-3.5 w-3.5 fill-yellow-400" />
                          {rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                    {/* Cinematic letterbox-ish dark gradient for text legibility */}
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 25%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.85) 100%)",
                      }}
                    />
                  </div>
                </div>
              );
            }

            const isCreators = s.layout === "creators";

            if (isCreators) {
              const creators = (s.creators ?? []).slice(0, 3);
              const podiumOrder = [creators[1], creators[0], creators[2]].filter(Boolean);
              const heights = ["h-[58%]", "h-[72%]", "h-[50%]"];
              const ranks = [2, 1, 3];
              return (
                <div className="absolute inset-0">
                  <img
                    src={s.imageUrl}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 h-full w-full scale-125 object-cover blur-3xl saturate-150 opacity-70"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse at 70% 50%, hsl(213 70% 30% / 0.45) 0%, hsl(220 35% 8% / 0.85) 55%, hsl(0 0% 0% / 0.95) 100%)",
                    }}
                  />

                  {/* Desktop podium */}
                  <div className="absolute inset-y-0 right-0 hidden items-end justify-center gap-4 pr-12 pb-16 lg:pr-20 md:flex">
                    {podiumOrder.map((c, idx) => {
                      const r = ranks[idx];
                      const medal = r === 1 ? "text-yellow-400" : r === 2 ? "text-gray-300" : "text-amber-700";
                      return (
                        <div key={c.rank} className={`relative flex w-[140px] flex-col items-center ${heights[idx]}`}>
                          <div className="relative w-full flex-1 overflow-hidden rounded-2xl ring-1 ring-white/15"
                            style={{ boxShadow: "0 30px 60px -15px rgba(0,0,0,0.8)" }}>
                            <img src={c.avatarUrl} alt={c.name} className="h-full w-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                            <div className={`absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-xs font-extrabold backdrop-blur ring-1 ring-white/20 ${medal}`}>
                              #{r}
                            </div>
                            <div className="absolute inset-x-0 bottom-0 px-2 pb-2">
                              <p className="truncate text-sm font-bold text-white drop-shadow-md">{c.name}</p>
                              {c.subtitle && (
                                <p className="truncate text-[10px] text-white/70">{c.subtitle}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mobile: top podium row of 3 */}
                  <div className="absolute inset-x-0 top-16 flex items-end justify-center gap-3 px-6 md:hidden">
                    {podiumOrder.map((c, idx) => {
                      const r = ranks[idx];
                      const medal = r === 1 ? "text-yellow-400" : r === 2 ? "text-gray-300" : "text-amber-700";
                      const h = idx === 1 ? "h-44" : "h-36";
                      const w = idx === 1 ? "w-28" : "w-24";
                      return (
                        <div key={c.rank} className={`relative ${w} ${h} overflow-hidden rounded-2xl ring-1 ring-white/15`} style={{ boxShadow: "0 20px 40px -12px rgba(0,0,0,0.7)" }}>
                          <img src={c.avatarUrl} alt={c.name} className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                          <div className={`absolute left-1.5 top-1.5 rounded-full bg-black/70 px-1.5 py-0.5 text-[10px] font-extrabold ring-1 ring-white/20 backdrop-blur ${medal}`}>#{r}</div>
                          <div className="absolute inset-x-0 bottom-1 px-1.5">
                            <p className="truncate text-center text-[11px] font-bold text-white drop-shadow">{c.name}</p>
                            {c.subtitle && (
                              <p className="truncate text-center text-[9px] text-white/70">{c.subtitle.split(" · ")[0]}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }

            if (isPremium) {
              const plans = s.premiumPlans ?? (s.premiumPlan
                ? [{ name: "Premium", price: s.premiumPlan.price, period: s.premiumPlan.period, perks: s.premiumPlan.perks }]
                : []);
              return (
                <div className="absolute inset-0 overflow-hidden">
                  {/* Minimal dark backdrop with primary blue glow */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 0%, hsl(213 100% 50% / 0.18) 0%, transparent 60%), linear-gradient(180deg, hsl(220 30% 6%) 0%, hsl(220 35% 4%) 100%)",
                    }}
                  />

                  {/* Plan cards */}
                  <div className="absolute inset-0 hidden items-center justify-end pr-8 lg:pr-16 md:flex">
                    <div className="flex gap-3">
                      {plans.map((plan) => {
                        const highlight = plan.highlight;
                        return (
                          <div
                            key={plan.name}
                            className={`relative w-[240px] rounded-2xl border p-5 backdrop-blur-xl transition-colors ${
                              highlight
                                ? "border-primary/50 bg-primary/[0.06]"
                                : "border-white/10 bg-white/[0.03]"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`text-[11px] font-bold uppercase tracking-[0.15em] ${highlight ? "text-primary" : "text-white/70"}`}>
                                {plan.name}
                              </span>
                              {plan.bonus && (
                                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                                  {plan.bonus}
                                </span>
                              )}
                            </div>
                            <div className="mt-3 flex items-baseline gap-1">
                              <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                              <span className="text-xs text-white/50">/{plan.period}</span>
                            </div>
                            <ul className="mt-4 space-y-1.5">
                              {plan.perks.slice(0, 4).map((p) => (
                                <li key={p} className="flex items-start gap-2 text-[12px] text-white/75">
                                  <Check className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${highlight ? "text-primary" : "text-white/40"}`} />
                                  <span>{p}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mobile: stacked compact plans */}
                  <div className="absolute inset-x-0 bottom-20 flex flex-col gap-2 px-4 md:hidden">
                    {plans.map((plan) => {
                      const highlight = plan.highlight;
                      return (
                        <div
                          key={plan.name}
                          className={`flex items-center justify-between rounded-xl border px-3 py-2.5 backdrop-blur-xl ${
                            highlight ? "border-primary/50 bg-primary/[0.08]" : "border-white/10 bg-white/[0.04]"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${highlight ? "text-primary" : "text-white/70"}`}>
                              {plan.name}
                            </span>
                            {plan.bonus && (
                              <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-primary">
                                {plan.bonus}
                              </span>
                            )}
                          </div>
                          <div className="flex items-baseline gap-0.5">
                            <span className="text-lg font-extrabold text-white">{plan.price}</span>
                            <span className="text-[10px] text-white/50">/{plan.period}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }

            if (isFeature) {
              const bullets = s.featureMeta?.bullets ?? [];
              const mediaChips = [
                { icon: ImageIcon, label: "Image", color: "hsl(213 100% 60%)" },
                { icon: Film, label: "Video", color: "hsl(280 80% 65%)" },
                { icon: Mic, label: "Voice", color: "hsl(160 70% 55%)" },
                { icon: Music, label: "Music", color: "hsl(45 90% 60%)" },
                { icon: GitBranch, label: "Branch", color: "hsl(0 80% 65%)" },
              ];
              return (
                <div className="absolute inset-0 overflow-hidden">
                  {/* Epic background image */}
                  <img
                    src={s.imageUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ animation: "hero-zoom 18s ease-out both" }}
                  />
                  {/* Color grade + vignette */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse at 75% 35%, hsl(213 90% 45% / 0.35) 0%, transparent 60%), radial-gradient(ellipse at 20% 90%, hsl(280 70% 35% / 0.30) 0%, transparent 60%), linear-gradient(180deg, hsl(220 40% 6% / 0.4) 0%, hsl(220 40% 4% / 0.85) 100%)",
                    }}
                  />
                  {/* film grain dots */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 1px 1px, hsl(213 100% 70% / 0.18) 1px, transparent 0)",
                      backgroundSize: "26px 26px",
                    }}
                  />
                  {/* glowing orb */}
                  <div
                    className="absolute right-[18%] top-1/2 hidden h-72 w-72 -translate-y-1/2 rounded-full md:block"
                    style={{
                      background:
                        "radial-gradient(circle, hsl(213 100% 70% / 0.45) 0%, transparent 65%)",
                      filter: "blur(20px)",
                    }}
                  />

                  {/* Story Creator mock card on the right */}
                  <div className="absolute inset-y-0 right-0 hidden items-center justify-center pr-12 lg:pr-20 md:flex">
                    <div
                      className="relative w-[440px] rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 to-white/[0.03] p-5 backdrop-blur-xl"
                      style={{ boxShadow: "0 30px 80px -20px rgba(0,0,0,0.8), 0 0 80px -20px hsl(213 100% 50% / 0.5)" }}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 ring-1 ring-primary/40">
                            <Wand2 className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-primary">{s.featureMeta?.eyebrow ?? "New feature"}</div>
                            <div className="text-sm font-bold text-white">{s.name}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-1 ring-1 ring-red-500/40">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                          <span className="text-[9px] font-bold uppercase tracking-wider text-red-400">REC</span>
                        </div>
                      </div>

                      {/* Cinematic preview strip with letterbox bars */}
                      <div className="relative mt-4 aspect-[16/7] overflow-hidden rounded-xl ring-1 ring-white/10">
                        <img
                          src={s.imageUrl}
                          alt=""
                          className="h-full w-full object-cover"
                          style={{ filter: "saturate(1.1) contrast(1.05)" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
                        {/* letterbox bars */}
                        <div className="absolute inset-x-0 top-0 h-2 bg-black/80" />
                        <div className="absolute inset-x-0 bottom-0 h-2 bg-black/80" />
                        {/* timecode */}
                        <div className="absolute left-2 top-3 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[9px] text-white/90">
                          00:01:24
                        </div>
                        {/* play button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg">
                            <Play className="h-4 w-4 fill-black text-black" />
                          </div>
                        </div>
                        {/* caption */}
                        <div className="absolute inset-x-0 bottom-3 text-center text-[11px] font-medium text-white/95 drop-shadow">
                          "Wait... did you just hear that?"
                        </div>
                      </div>

                      {/* Media chips */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {mediaChips.map((c, idx) => (
                          <div
                            key={c.label}
                            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-white/80"
                            style={{ animation: `fade-in 0.4s ease-out ${idx * 0.06}s both` }}
                          >
                            <c.icon className="h-3 w-3" style={{ color: c.color }} />
                            {c.label}
                          </div>
                        ))}
                      </div>

                      {/* Timeline */}
                      <div className="mt-3 space-y-1.5">
                        {[
                          { c: "hsl(213 100% 55%)", w: "w-[35%]" },
                          { c: "hsl(280 80% 60%)", w: "w-[55%]" },
                          { c: "hsl(45 90% 55%)", w: "w-[25%]" },
                        ].map((t, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="h-1.5 w-3 rounded-full bg-white/20" />
                            <div className="flex-1 overflow-hidden rounded-full bg-white/5">
                              <div
                                className={`h-1.5 ${t.w} rounded-full`}
                                style={{
                                  background: `linear-gradient(90deg, ${t.c}, ${t.c}88)`,
                                  animation: `fade-in 0.6s ease-out ${0.2 + i * 0.1}s both`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Bullets */}
                      <div className="mt-3 grid grid-cols-2 gap-1.5">
                        {bullets.slice(0, 4).map((b, idx) => (
                          <div
                            key={b}
                            className="flex items-start gap-1.5 text-[10.5px] leading-snug text-white/75"
                            style={{ animation: `fade-in 0.5s ease-out ${0.3 + idx * 0.06}s both` }}
                          >
                            <Check className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            if (isBanner) {
              return (
                <div className="absolute inset-0">
                  {/* Blurred backdrop, same image */}
                  <img
                    src={m.type === "image" ? m.url : (m.poster ?? s.imageUrl)}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 h-full w-full scale-125 object-cover blur-3xl saturate-150 opacity-70"
                  />
                  {/* Sharp full-bleed banner image — anchored right on desktop, full on mobile */}
                  {m.type === "image" ? (
                    <img
                      src={m.url}
                      alt={s.name}
                      className="absolute inset-0 h-full w-full object-cover md:object-right"
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  ) : (
                    <video
                      src={m.url}
                      poster={m.poster}
                      autoPlay muted loop playsInline
                      className="absolute inset-0 h-full w-full object-cover md:object-right"
                    />
                  )}
                  {/* Accent color wash */}
                  {s.accent && (
                    <div
                      className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-40"
                      style={{ background: `radial-gradient(ellipse at 30% 50%, ${s.accent} 0%, transparent 65%)` }}
                    />
                  )}
                </div>
              );
            }

            return (
              <div className="absolute inset-0">
                {/* Blurred full-bleed backdrop */}
                <img
                  src={m.type === "image" ? m.url : (m.poster ?? s.imageUrl)}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 h-full w-full scale-125 object-cover blur-3xl saturate-150"
                />

                {/* Sharp portrait panel(s), anchored right (desktop). */}
                <div className="absolute inset-y-0 right-0 hidden h-full md:flex">
                  {(() => {
                    if (list.length < 2) {
                      return (
                        <HeroPanel
                          media={[m]}
                          name={s.name}
                          eager={i === 0}
                          paused={paused}
                          slotIndex={0}
                        />
                      );
                    }
                    const panelA = list.filter((_, idx) => idx % 2 === 0);
                    const panelB = list.filter((_, idx) => idx % 2 === 1);
                    return (
                      <>
                        <HeroPanel media={panelA} name={s.name} eager={i === 0} paused={paused} slotIndex={0} withLeftFade />
                        <HeroPanel media={panelB} name={s.name} eager={false} paused={paused} slotIndex={1} />
                      </>
                    );
                  })()}
                </div>

                {/* Mobile centered */}
                <div className="absolute inset-0 md:hidden">
                  {m.type === "image" ? (
                    <img src={m.url} alt={s.name} className="h-full w-full object-cover object-right" />
                  ) : (
                    <video src={m.url} poster={m.poster} autoPlay muted loop playsInline className="h-full w-full object-cover object-right" />
                  )}
                </div>
              </div>
            );
          })()}

          {/* Mobile readability vignette */}
          <div
            className="pointer-events-none absolute inset-0 md:hidden"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, hsl(var(--background) / 0.2) 35%, hsl(var(--background) / 0.85) 70%, hsl(var(--background)) 100%)",
            }}
          />
          {/* Desktop side gradient */}
          <div
            className="pointer-events-none absolute inset-0 hidden md:block"
            style={{
              background:
                "linear-gradient(90deg, hsl(var(--background) / 0.92) 0%, hsl(var(--background) / 0.7) 25%, hsl(var(--background) / 0.25) 55%, transparent 75%)",
            }}
          />
          {/* Bottom-up vignette into rows */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-40 hidden md:block"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, hsl(var(--background)) 100%)",
            }}
          />
        </div>
        );
      })}

      {/* Content */}
      <div
        className="relative z-10 mx-auto flex h-full max-w-[1600px] items-end px-6 pb-20 md:items-center md:pb-0"
      >
        <div
          key={slide.name}
          className="max-w-xl animate-fade-in space-y-4"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {slide.badge ?? "Featured today"}
          </span>
          <h1 className="text-4xl font-extrabold leading-[1.05] text-white drop-shadow-lg md:text-6xl">
            {slide.name}
          </h1>
          <p className="max-w-lg text-sm text-white/90 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)] md:text-base md:text-grey-light-3 md:[text-shadow:none] md:line-clamp-3">
            {slide.description}
          </p>

          {slide.tags && slide.tags.length > 0 && (
            <div className="hidden flex-wrap gap-2 md:flex">
              {slide.tags.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="rounded-[5px] bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {slide.layout === "story" && slide.storyMeta && (
            <div className="flex flex-wrap items-center gap-4 text-xs text-white/80">
              {slide.storyMeta.chapters != null && (
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                  {slide.storyMeta.chapters} chapters
                </span>
              )}
              {slide.storyMeta.episodes != null && (
                <span>{slide.storyMeta.episodes} episodes</span>
              )}
              {slide.storyMeta.rating != null && (
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-white text-white" />
                  {slide.storyMeta.rating.toFixed(1)}
                </span>
              )}
              {slide.meta?.likes && (
                <LikeButton iconClassName="h-3.5 w-3.5" className="gap-1.5 text-white/80 hover:text-white">
                  <span>{slide.meta.likes}</span>
                </LikeButton>
              )}
            </div>
          )}

          {slide.meta && slide.layout !== "story" && (
            <div className="hidden items-center gap-4 text-xs text-white/70 md:flex">
              {slide.meta.messages && (
                <span className="flex items-center gap-1.5">
                  <ChatIcon className="h-3.5 w-3.5" />
                  {slide.meta.messages} chats
                </span>
              )}
              {slide.meta.likes && (
                <LikeButton iconClassName="h-3.5 w-3.5" className="gap-1.5">
                  <span>{slide.meta.likes}</span>
                </LikeButton>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {slide.layout !== "premium" && (
              <button className={`inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-bold transition-transform hover:scale-[1.03] ${
                slide.layout === "feature"
                  ? "bg-primary text-primary-foreground"
                  : slide.layout === "story"
                  ? "bg-primary text-primary-foreground"
                  : "bg-white text-black"
              }`}>
                {slide.layout === "story" ? (
                  <BookOpen className="h-4 w-4" />
                ) : slide.layout === "feature" ? (
                  <Wand2 className="h-4 w-4" />
                ) : slide.layout === "creators" ? (
                  <Trophy className="h-4 w-4" />
                ) : slide.layout === "banner" ? (
                  <Sparkles className="h-4 w-4" />
                ) : (
                  <MessageCircle className="h-4 w-4" />
                )}
                {slide.cta ?? (
                  slide.layout === "story" ? "Play Story"
                  : slide.layout === "feature" ? "Try it now"
                  : "Chat now"
                )}
              </button>
            )}
            {slide.layout !== "creators" && (
              <button className={`h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold text-white backdrop-blur transition-colors ${
                slide.layout === "premium"
                  ? "inline-flex bg-primary/15 hover:bg-primary/25 ring-1 ring-primary/40"
                  : "hidden bg-white/10 hover:bg-white/20 md:inline-flex"
              }`}>
                {slide.layout === "story" ? <Film className="h-4 w-4" /> : slide.layout === "premium" ? <Star className="h-4 w-4" /> : slide.layout === "feature" ? <BookOpen className="h-4 w-4" /> : <User className="h-4 w-4" />}
                {slide.layout === "story" ? "View Episodes" : slide.layout === "premium" ? "Compare plans" : slide.layout === "feature" ? "View all stories" : "View profile"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={() => go(active - 1)}
        aria-label="Previous"
        className="absolute left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/70 md:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => go(active + 1)}
        aria-label="Next"
        className="absolute right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/70 md:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Progress indicators — desktop bars, mobile small dots with edge-fade hint */}
      {(() => {
        const total = slides.length;
        const MAX_MOBILE = 7; // odd number, active sits in middle when possible
        const half = Math.floor(MAX_MOBILE / 2);
        let mobileStart = 0;
        if (total > MAX_MOBILE) {
          mobileStart = Math.min(Math.max(0, active - half), total - MAX_MOBILE);
        }
        const mobileEnd = mobileStart + Math.min(MAX_MOBILE, total);
        const visibleCount = mobileEnd - mobileStart;
        return (
          <>
            {/* Desktop: full progress bars */}
            <div className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 md:flex">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  className="group relative flex h-4 w-10 items-center justify-center transition-all"
                  aria-label={`Go to slide ${i + 1}`}
                >
                  <span className="block h-1 w-full overflow-hidden rounded-full bg-white/25">
                    <span
                      className={`block h-full origin-left bg-white ${i === active ? "hero-progress-fill" : ""}`}
                      style={{
                        width: i <= active ? "100%" : "0%",
                        animationDuration: i === active ? `${intervalMs}ms` : undefined,
                        animationPlayState: paused ? "paused" : "running",
                      }}
                    />
                  </span>
                </button>
              ))}
            </div>

            {/* Mobile: small dots, edge dots scaled down to hint at more slides */}
            <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 md:hidden">
              {slides.map((_, i) => {
                if (i < mobileStart || i >= mobileEnd) return null;
                const localIdx = i - mobileStart;
                const isActive = i === active;
                const hasMoreLeft = mobileStart > 0;
                const hasMoreRight = mobileEnd < total;
                // Edge-fade scaling: outermost = smallest, next = medium
                let scale = 1;
                if (hasMoreLeft && localIdx === 0) scale = 0.45;
                else if (hasMoreLeft && localIdx === 1) scale = 0.7;
                if (hasMoreRight && localIdx === visibleCount - 1) scale = 0.45;
                else if (hasMoreRight && localIdx === visibleCount - 2) scale = 0.7;

                return (
                  <button
                    key={i}
                    onClick={() => go(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className="flex h-4 w-4 items-center justify-center"
                  >
                    <span
                      className={`block rounded-full transition-all ${
                        isActive ? "bg-white" : "bg-white/40"
                      }`}
                      style={{
                        width: `${(isActive ? 7 : 6) * scale}px`,
                        height: `${(isActive ? 7 : 6) * scale}px`,
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </>
        );
      })()}
    </section>
  );
};

/**
 * Full-height 13:19 portrait panel anchored on the hero's right side. Crossfades
 * through its assigned media subset on a staggered timer so two adjacent panels
 * never advance in lockstep.
 */
const HeroPanel = ({
  media,
  name,
  eager,
  paused,
  slotIndex,
  withLeftFade = false,
}: {
  media: HeroMedia[];
  name: string;
  eager: boolean;
  paused: boolean;
  slotIndex: number;
  withLeftFade?: boolean;
}) => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (paused || media.length <= 1) return;
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % media.length);
    }, 4200 + slotIndex * 700);
    return () => window.clearInterval(id);
  }, [paused, media.length, slotIndex]);

  return (
    <div className="relative h-full" style={{ aspectRatio: "13 / 19" }}>
      {media.map((m, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            i === idx ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== idx}
        >
          {m.type === "image" ? (
            <img
              src={m.url}
              alt={i === 0 ? name : ""}
              className="h-full w-full object-cover"
              loading={eager && i === 0 ? "eager" : "lazy"}
            />
          ) : (
            <video
              src={m.url}
              poster={m.poster}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          )}
        </div>
      ))}
      {withLeftFade && (
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-24"
          style={{
            background:
              "linear-gradient(90deg, hsl(var(--background) / 0.5) 0%, transparent 100%)",
          }}
        />
      )}
      {/* Bottom fade into next sections */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, hsl(var(--background)) 100%)",
        }}
      />
    </div>
  );
};

export default CinematicHero;
