import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Play, Star, User } from "lucide-react";
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
   *  "story" shows a book-cover style card with chapter/episode metadata. */
  layout?: "portrait" | "banner" | "story";
  /** Optional accent color (hsl) for banner overlays */
  accent?: string;
  /** Story metadata, shown when layout === "story" */
  storyMeta?: { chapters?: number; episodes?: number; rating?: number };
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
  const startRef = useRef<number>(performance.now());
  const [progress, setProgress] = useState(0);

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

  // Auto-rotate slides with progress
  useEffect(() => {
    if (paused) return;
    startRef.current = performance.now();
    setProgress(0);
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - startRef.current) / intervalMs);
      setProgress(p);
      if (p >= 1) {
        setActive((a) => (a + 1) % slides.length);
      } else {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, paused, intervalMs, slides.length]);

  const go = (i: number) => setActive((i + slides.length) % slides.length);
  const slide = slides[active];

  // Touch swipe (mobile) — live drag with snap on release
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const lockedAxis = useRef<"x" | "y" | null>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(0); // 0 idle, 1 dragging
  const widthRef = useRef<number>(0);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    lockedAxis.current = null;
    widthRef.current = (e.currentTarget as HTMLElement).clientWidth || 1;
    setPaused(true);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current == null || touchStartY.current == null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (lockedAxis.current == null) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        lockedAxis.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }
    }
    if (lockedAxis.current === "x") {
      setIsDragging(1);
      // resistance at edges
      setDragX(dx);
    }
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null || touchStartY.current == null) {
      setPaused(false);
      return;
    }
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const w = widthRef.current || 1;
    const ratio = Math.abs(dx) / w;
    touchStartX.current = null;
    touchStartY.current = null;
    setIsDragging(0);
    setDragX(0);
    if (lockedAxis.current === "x" && (ratio > 0.18 || Math.abs(dx) > 80)) {
      go(active + (dx < 0 ? 1 : -1));
    }
    lockedAxis.current = null;
    setPaused(false);
  };

  return (
    <section
      className="relative w-full shrink-0 overflow-hidden touch-pan-y"
      style={{ height: "clamp(520px, 78vh, 760px)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
      aria-roledescription="carousel"
    >
      {/* Layered backdrops — crossfade */}
      {slides.map((s, i) => (
        <div
          key={s.name + i}
          className={`absolute inset-0 ${isDragging ? "" : "transition-all duration-1000 ease-out"} ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
          style={
            i === active && isDragging
              ? { transform: `translate3d(${dragX}px,0,0)` }
              : undefined
          }
          aria-hidden={i !== active}
        >
          {(() => {
            const list = slideMedia[i];
            const m = list[0];
            const isBanner = s.layout === "banner";
            const isStory = s.layout === "story";

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
                    <div className="relative w-[min(560px,42vw)] aspect-[5/3]">
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

                  {/* Mobile: same card, smaller */}
                  <div className="absolute inset-0 flex items-center justify-center px-6 md:hidden">
                    <div className="relative w-full max-w-[360px] aspect-[5/3]">
                      <div
                        className="absolute inset-0 rounded-xl overflow-hidden ring-1 ring-white/15 bg-card border border-border/50"
                        style={{ boxShadow: "0 25px 50px -10px rgba(0,0,0,0.8)" }}
                      >
                        <img src={src0} alt={s.name} className="h-full w-full object-cover object-top" />
                        <div className="absolute left-2 top-2 z-10">
                          <span className="flex items-center gap-1 rounded-lg border border-border/30 bg-background/70 px-2 py-1 text-[10px] font-medium text-foreground backdrop-blur-sm">
                            <BookOpen className="h-3 w-3" /> Story
                          </span>
                        </div>
                        {rating != null && (
                          <div className="absolute right-2 top-2 z-10">
                            <span className="flex items-center gap-1 rounded-lg border border-border/30 bg-background/70 px-1.5 py-1 text-[10px] font-semibold text-yellow-400 backdrop-blur-sm">
                              <Star className="h-3 w-3 fill-yellow-400" />
                              {rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-3 pb-2 pt-8">
                          <p className="truncate text-sm font-bold text-white">{s.name}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            {episodes != null && (
                              <span className="flex items-center gap-1 text-[10px] text-white/80">
                                <Film className="h-3 w-3" />
                                {episodes}
                              </span>
                            )}
                            {chapters != null && (
                              <span className="flex items-center gap-1 text-[10px] text-white/80">
                                <Layers className="h-3 w-3" />
                                {chapters}
                              </span>
                            )}
                          </div>
                        </div>
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
      ))}

      {/* Content */}
      <div
        className={`relative z-10 mx-auto flex h-full max-w-[1600px] items-end px-6 pb-20 md:items-center md:pb-0 ${isDragging ? "" : "transition-transform duration-500 ease-out"}`}
        style={isDragging ? { transform: `translate3d(${dragX}px,0,0)` } : undefined}
      >
        <div key={slide.name} className="max-w-xl animate-fade-in space-y-4">
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
            <button className={`inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-bold transition-transform hover:scale-[1.03] ${
              slide.layout === "story"
                ? "bg-primary text-primary-foreground"
                : "bg-white text-black"
            }`}>
              {slide.layout === "story" ? (
                <BookOpen className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4 fill-black" />
              )}
              {slide.cta ?? "Chat now"}
            </button>
            <button className="hidden h-11 items-center gap-2 rounded-full bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20 md:inline-flex">
              <User className="h-4 w-4" />
              View profile
            </button>
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

      {/* Progress indicators */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className="group h-1 w-10 overflow-hidden rounded-full bg-white/20"
            aria-label={`Go to slide ${i + 1}`}
          >
            <span
              className="block h-full bg-white transition-[width] duration-150 ease-linear"
              style={{
                width:
                  i < active
                    ? "100%"
                    : i === active
                    ? `${progress * 100}%`
                    : "0%",
              }}
            />
          </button>
        ))}
      </div>
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
