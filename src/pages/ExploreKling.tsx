import { useRef, useState } from "react";
import { Bell, Menu, Search, Upload, ArrowRight, Sparkles, Image as ImageIcon, Film, User, Wand2, BookOpen, Crown, ChevronDown, Heart } from "lucide-react";
import SideNav from "../components/SideNav";
import { useHeaderScrollTracking } from "../components/ExploreView";
import ExploreCreateToolCard from "../components/explore/ExploreCreateToolCard";
import ExploreVideoCard from "../components/explore/ExploreVideoCard";
import LikeButton from "../components/explore/LikeButton";
import { exploreVideoFeed } from "../data/exploreVideoFeed";

// ---- Hero banners (left big, right secondary) ----
const heroBanners = [
  {
    eyebrow: "New release",
    title: "Scene Builder v2 is live",
    description: "Cinematic, multi-shot scenes with characters, music and motion — all from one prompt.",
    cta: "Try Scene Builder",
    accent: "from-primary-v2/40 via-primary-v2/10 to-transparent",
  },
  {
    eyebrow: "Premium",
    title: "Skip the queue",
    description: "Unlimited chats, HD videos, exclusive babes.",
    cta: "Upgrade",
    accent: "from-fuchsia-500/30 via-purple-500/10 to-transparent",
  },
];

// ---- Tool tiles (Kling-style) ----
const tools = [
  { title: "Omni Does It All", subtitle: "Experience Now", Icon: Sparkles, href: "#", featured: true },
  { title: "Image Generation", subtitle: "Create stunning visuals", Icon: ImageIcon, href: "#" },
  { title: "Video Generation", subtitle: "Bring scenes to life", Icon: Film, href: "#" },
  { title: "Character Builder", subtitle: "Design your babe", Icon: User, href: "#" },
  { title: "Story Studio", subtitle: "Branching roleplay", Icon: BookOpen, href: "#" },
  { title: "Magic Edit", subtitle: "Inpaint & refine", Icon: Wand2, href: "#" },
];

// ---- Tabs ----
const tabs = ["Recommended", "Follows", "Events"] as const;
const sortTabs = ["Recommended", "Time"] as const;

// ---- Masonry feed (mock images with varied aspect ratios) ----
const aspects: Array<{ cls: string; w: number; h: number }> = [
  { cls: "aspect-[3/4]", w: 600, h: 800 },
  { cls: "aspect-[4/5]", w: 600, h: 750 },
  { cls: "aspect-[2/3]", w: 600, h: 900 },
  { cls: "aspect-[1/1]", w: 600, h: 600 },
  { cls: "aspect-[9/16]", w: 540, h: 960 },
  { cls: "aspect-[4/3]", w: 800, h: 600 },
];
const feed = [...exploreVideoFeed, ...exploreVideoFeed].map((v, i) => {
  const a = aspects[i % aspects.length];
  return {
    ...v,
    id: `${v.id}-${i}`,
    aspect: a.cls,
    poster: `https://picsum.photos/seed/explore-${i}/${a.w}/${a.h}`,
    likes: ((v.likes as number) ?? 0) + i * 3,
  };
});

const ExploreKling = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Recommended");
  const [activeSort, setActiveSort] = useState<(typeof sortTabs)[number]>("Recommended");
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const mainRef = useRef<HTMLElement>(null);
  const { headerHidden } = useHeaderScrollTracking(mainRef);

  const toggleLiked = (id: string) =>
    setLikedMap((m) => ({ ...m, [id]: !m[id] }));

  return (
    <>
      <SideNav open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="relative flex h-svh w-full overflow-hidden bg-background-v2 font-onest text-foreground-v2">
        <main ref={mainRef} className="relative flex w-full flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* Top header */}
          <header
            className={`pointer-events-none fixed inset-x-0 top-0 z-30 flex min-h-[62px] items-center justify-between px-6 py-4 bg-gradient-to-b from-background-v2/80 via-background-v2/40 to-transparent transition-transform duration-300 ${
              headerHidden ? "-translate-y-full" : "translate-y-0"
            }`}
          >
            <div className="pointer-events-auto flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
                className="flex h-9 w-9 items-center justify-center text-foreground-v2/90 hover:opacity-70"
              >
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <span className="text-sm font-bold tracking-wide text-white">Explore</span>
            </div>
            <div className="pointer-events-auto flex items-center gap-1">
              <button
                aria-label="Notifications"
                className="flex h-9 w-9 items-center justify-center text-foreground-v2/90 hover:opacity-70"
              >
                <Bell className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
          </header>

          <div className="relative z-10 flex w-full flex-col gap-6 px-4 pb-16 pt-20 md:px-8 lg:px-12">
            {/* Hero banners row */}
            <section className="grid grid-cols-1 gap-3 lg:grid-cols-3">
              {heroBanners.map((b, i) => (
                <a
                  key={b.title}
                  href="#"
                  className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-grey-dark-1-v2 p-6 transition-all hover:-translate-y-0.5 hover:border-white/10 ${
                    i === 0 ? "lg:col-span-2 min-h-[180px]" : "min-h-[180px]"
                  }`}
                >
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${b.accent}`} />
                  <div className="relative flex h-full flex-col justify-between gap-4">
                    <div>
                      <span className="inline-block rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur">
                        {b.eyebrow}
                      </span>
                      <h2 className="mt-3 text-2xl font-bold leading-tight text-white">{b.title}</h2>
                      <p className="mt-1.5 max-w-md text-sm text-grey-light-3-v2">{b.description}</p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 self-start rounded-full bg-primary-v2 px-4 py-2 text-sm font-semibold text-primary-v2-foreground transition-transform group-hover:translate-x-0.5">
                      {b.cta}
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </a>
              ))}
            </section>

            {/* Tools row */}
            <section>
              {/* Mobile/tablet: horizontal scroll */}
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 xl:hidden">
                {tools.map((t) => (
                  <div key={t.title} className="w-[220px] shrink-0">
                    <ExploreCreateToolCard
                      title={t.title}
                      subtitle={t.subtitle}
                      Icon={t.Icon}
                      href={t.href}
                    />
                  </div>
                ))}
              </div>
              {/* Desktop: grid */}
              <div className="hidden gap-3 xl:grid xl:grid-cols-6">
                {tools.map((t) => (
                  <ExploreCreateToolCard
                    key={t.title}
                    title={t.title}
                    subtitle={t.subtitle}
                    Icon={t.Icon}
                    href={t.href}
                  />
                ))}
              </div>
            </section>

            {/* Tabs + Search + Publish */}
            <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-full bg-grey-dark-1-v2 p-1">
                  {tabs.map((t) => (
                    <button
                      key={t}
                      onClick={() => setActiveTab(t)}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                        activeTab === t
                          ? "bg-primary-v2 text-primary-v2-foreground"
                          : "text-grey-light-3-v2 hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="hidden md:block h-6 w-px bg-white/10" />
                <div className="relative hidden md:block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grey-light-4-v2" />
                  <input
                    placeholder="Search"
                    className="h-9 w-64 rounded-full border border-white/5 bg-grey-dark-1-v2 pl-9 pr-3 text-sm text-white placeholder:text-grey-light-4-v2 outline-none focus:border-primary-v2/50"
                  />
                </div>
              </div>
              <button className="inline-flex items-center gap-1.5 self-start rounded-full bg-primary-v2 px-5 py-2 text-sm font-semibold text-primary-v2-foreground hover:opacity-90">
                <Upload className="h-4 w-4" />
                Publish
              </button>
            </section>

            {/* Sort sub-tabs */}
            <div className="flex items-center gap-5 border-b border-white/5 pb-2 -mt-2">
              {sortTabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveSort(t)}
                  className={`relative text-sm font-medium transition-colors ${
                    activeSort === t ? "text-white" : "text-grey-light-4-v2 hover:text-white"
                  }`}
                >
                  {t}
                  {activeSort === t && (
                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full bg-primary-v2" />
                  )}
                </button>
              ))}
            </div>

            {/* Masonry feed */}
            <section className="columns-2 gap-3 md:columns-3 lg:columns-4 xl:columns-5 [&>*]:mb-3 [&>*]:break-inside-avoid">
              {feed.map((v) => (
                <div key={v.id} className="w-full">
                  <ExploreVideoCardFull
                    id={v.id}
                    poster={v.poster}
                    video={v.video}
                    likes={v.likes as number}
                    aspect={v.aspect}
                    liked={!!likedMap[v.id]}
                    onLike={() => toggleLiked(v.id)}
                  />
                </div>
              ))}
            </section>
          </div>
        </main>
      </div>
    </>
  );
};

// Width-flexible variant of ExploreVideoCard (for masonry columns)
const ExploreVideoCardFull = ({
  id,
  poster,
  video,
  likes,
  aspect = "aspect-[13/19]",
  liked,
  onLike,
}: {
  id: string;
  poster?: string;
  video: string;
  likes: number;
  aspect?: string;
  liked: boolean;
  onLike: () => void;
}) => (
  <a
    href="#"
    aria-label="Video preview"
    className="group relative block w-full overflow-hidden rounded-2xl bg-grey-dark-1-v2"
  >
    <div className={`relative ${aspect} w-full overflow-hidden`}>
      {poster && (
        <img
          src={poster}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute bottom-2 right-2 z-[3]" onClick={(e) => { e.preventDefault(); onLike(); }}>
        <LikeButton variant="video" liked={liked} onClick={onLike}>
          <span>{likes}</span>
        </LikeButton>
      </div>
    </div>
  </a>
);

export default ExploreKling;
