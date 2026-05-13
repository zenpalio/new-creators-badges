import { useRef, useState } from "react";
import { Bell, Menu, Search, Upload, ArrowRight, Sparkles, Image as ImageIcon, Film, User, Wand2, BookOpen, Crown, ChevronDown, Heart, SlidersHorizontal, X, Check, Plus } from "lucide-react";
import SideNav from "../components/SideNav";
import { useHeaderScrollTracking } from "../components/ExploreView";
import ExploreCreateToolCard from "../components/explore/ExploreCreateToolCard";
import ExploreVideoCard from "../components/explore/ExploreVideoCard";
import LikeButton from "../components/explore/LikeButton";
import { exploreVideoFeed } from "../data/exploreVideoFeed";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import sceneBuilderBg from "../assets/scene-builder-bg.jpg";
import premiumBg from "../assets/premium-bg.jpg";
import { CreatorsView } from "../components/CreatorsView";
import { mockCreators, creatorsPageLabels } from "./Creators";
import { useNavigate } from "react-router-dom";

// ---- Hero banners (left big, right secondary) ----
const heroBanners = [
  {
    eyebrow: "New release",
    title: "Scene Builder v2",
    description: "Cinematic, multi-shot scenes with characters, music and motion — all from one prompt.",
    cta: "Try Scene Builder",
    bg: sceneBuilderBg,
    overlay: "from-black/85 via-black/55 to-black/20",
    glow: "bg-primary-v2/30",
    badgeIcon: Sparkles,
    ctaClass: "bg-primary-v2 text-primary-v2-foreground hover:bg-primary-v2/90",
  },
  {
    eyebrow: "Premium",
    title: "Skip the queue",
    description: "Unlimited chats, HD videos, exclusive babes.",
    cta: "Upgrade",
    bg: premiumBg,
    overlay: "from-black/85 via-black/55 to-black/10",
    glow: "bg-fuchsia-500/30",
    badgeIcon: Crown,
    ctaClass: "bg-white text-black hover:bg-white/90",
  },
];

// ---- Tool tiles (Kling-style) ----
const tools = [
  { title: "Create Custom Babe", subtitle: "Design your dream character", Icon: Sparkles, href: "/explore/create-babe" },
  { title: "Video Generator", subtitle: "Bring scenes to life", Icon: Film, href: "/explore/video-generator" },
  { title: "Image Generator", subtitle: "Render any moment", Icon: ImageIcon, href: "/explore/image-generator" },
  { title: "Story Creator", subtitle: "Write episodic adventures", Icon: BookOpen, href: "/explore/story-creator" },
  { title: "Create Template Babe", subtitle: "Start from a preset", Icon: User, href: "/explore/create-template" },
];

// ---- Tabs ----
const tabs = ["Recommended", "Follows", "Events"] as const;
const contentTabs = ["Babes", "Images", "Videos", "Stories", "Creators"] as const;
const sortOptions = ["Trending", "Newest", "Most Liked"] as const;
const timeOptions = ["All time", "Year", "Month", "Week", "Today"] as const;

// ---- Masonry feed (mock images, fixed 13:19 aspect) ----
const feed = [...exploreVideoFeed, ...exploreVideoFeed].map((v, i) => ({
  ...v,
  id: `${v.id}-${i}`,
  aspect: "aspect-[13/19]",
  poster: `https://picsum.photos/seed/explore-${i}/520/760`,
  likes: ((v.likes as number) ?? 0) + i * 3,
}));

const ExploreKling = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Recommended");
  const [activeContent, setActiveContent] = useState<(typeof contentTabs)[number]>("Babes");
  const [activeSort, setActiveSort] = useState<(typeof sortOptions)[number]>("Trending");
  const [activeTime, setActiveTime] = useState<(typeof timeOptions)[number]>("All time");
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const mainRef = useRef<HTMLElement>(null);
  const { headerHidden } = useHeaderScrollTracking(mainRef);

  const [filtersOpen, setFiltersOpen] = useState(false);

  const toggleLiked = (id: string) =>
    setLikedMap((m) => ({ ...m, [id]: !m[id] }));

  return (
    <>
      <SideNav open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="relative flex h-svh w-full overflow-hidden bg-background-v2 font-onest text-foreground-v2">
        <main ref={mainRef} className="relative flex w-full flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* Top header */}
          <header
            className={`pointer-events-none fixed inset-x-0 top-0 z-30 flex min-h-[48px] items-center justify-between px-4 py-2 bg-gradient-to-b from-background-v2/80 via-background-v2/40 to-transparent transition-transform duration-300 ${
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

          <div className="relative z-10 flex w-full flex-col gap-6 px-4 pb-16 pt-14 md:px-8 lg:px-12">
            {/* Hero banners row */}
            <section className="grid grid-cols-1 gap-3 lg:grid-cols-3">
              {heroBanners.map((b, i) => {
                const BadgeIcon = b.badgeIcon;
                return (
                  <a
                    key={b.title}
                    href="#"
                    className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-black transition-all hover:-translate-y-0.5 hover:border-white/20 hover:shadow-2xl ${
                      i === 0 ? "lg:col-span-2 min-h-[220px]" : "min-h-[220px]"
                    }`}
                  >
                    {/* Background image */}
                    <img
                      src={b.bg}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover scale-105 transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Overlays */}
                    <div className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${b.overlay}`} />
                    <div className={`pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl opacity-60 ${b.glow}`} />
                    {/* Content */}
                    <div className="relative flex h-full flex-col justify-between gap-6 p-7">
                      <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-md ring-1 ring-white/15">
                          <BadgeIcon className="h-3 w-3" />
                          {b.eyebrow}
                        </span>
                        <h2 className="mt-4 text-3xl font-bold leading-[1.1] text-white drop-shadow-lg md:text-4xl">
                          {b.title}
                        </h2>
                        <p className="mt-2 max-w-md text-sm leading-relaxed text-white/75">
                          {b.description}
                        </p>
                      </div>
                      <div className={`inline-flex items-center gap-1.5 self-start rounded-full px-5 py-2.5 text-sm font-semibold transition-all group-hover:translate-x-1 ${b.ctaClass}`}>
                        {b.cta}
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </a>
                );
              })}
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
              <div className="flex items-center gap-2">
                <FilterDropdown
                  value={activeSort}
                  options={sortOptions as unknown as string[]}
                  onChange={(v) => setActiveSort(v as typeof activeSort)}
                />
                <FilterDropdown
                  value={activeTime}
                  options={timeOptions as unknown as string[]}
                  onChange={(v) => setActiveTime(v as typeof activeTime)}
                />
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-grey-dark-1-v2 px-4 py-2 text-sm font-medium text-white hover:bg-grey-dark-2-v2 transition-colors"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </button>
              </div>
            </section>

            {/* Content type tabs */}
            <div className="flex items-center gap-5 border-b border-white/5 -mt-2">
              {contentTabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveContent(t)}
                  className={`relative pb-2.5 text-sm font-medium transition-colors ${
                    activeContent === t ? "text-white" : "text-grey-light-4-v2 hover:text-white"
                  }`}
                >
                  {t}
                  {activeContent === t && (
                    <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 rounded-full bg-primary-v2" />
                  )}
                </button>
              ))}
            </div>

            {/* Feed */}
            {activeContent === "Creators" ? (
              <div className="-mx-4 md:-mx-8 lg:-mx-12">
                <CreatorsView
                  creators={mockCreators}
                  labels={creatorsPageLabels}
                  onBack={() => navigate(-1)}
                  onMenu={() => setSidebarOpen(true)}
                />
              </div>
            ) : (
              <section className="columns-2 gap-1.5 md:columns-3 lg:columns-4 xl:columns-5 [&>*]:mb-1.5 [&>*]:break-inside-avoid">
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
            )}
          </div>
        </main>
        {/* Right filter sidebar */}
        <FilterSidebar open={filtersOpen} onOpenChange={setFiltersOpen} />
        {/* Floating create button */}
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Create content"
            className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-primary-v2 px-5 py-3 text-sm font-semibold text-primary-v2-foreground shadow-xl shadow-primary-v2/30 hover:opacity-90 transition-opacity focus:outline-none"
          >
            <Plus className="h-5 w-5" />
            Create
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            side="top"
            className="min-w-[220px] rounded-xl border-white/5 bg-grey-dark-1-v2 p-1.5 shadow-xl mb-2"
          >
            {tools.map((t) => (
              <DropdownMenuItem
                key={t.title}
                onSelect={() => { window.location.href = t.href; }}
                className="flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm text-white cursor-pointer focus:bg-white/5"
              >
                <t.Icon className="h-4 w-4 mt-0.5 text-primary-v2 shrink-0" />
                <div className="flex flex-col">
                  <span className="font-medium leading-tight">{t.title}</span>
                  <span className="text-xs text-grey-light-3-v2">{t.subtitle}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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

// ---- Right-side filter sidebar ----
const filterGroups: Array<{ label: string; value?: string; type: "check" | "chip"; options: string[] }> = [
  { label: "Gender", value: "All", type: "check", options: ["Female", "Futa", "Transgender"] },
  { label: "Style", value: "All", type: "check", options: ["Realistic", "Anime"] },
  { label: "Age", value: "All", type: "check", options: ["20s", "Milf"] },
  { label: "Body type", value: "All", type: "check", options: ["Slim", "Thick"] },
  { label: "Ethnicity", value: "All", type: "chip", options: ["Asian", "Black", "Caucasian", "Indian", "Arab", "Latina", "Fantasy", "Furry"] },
  { label: "Tags", value: "All", type: "chip", options: ["Full Nelson", "Solo", "Straddling", "Cowgirl", "Rimjob", "Facials", "Fingering", "Futa", "Facesitting", "Doggy Style", "Sex", "Tattoos", "Deepthroat", "Tentacles", "Footjob", "BDSM", "SFW", "Penis", "Titfuck", "Buttplug", "Ahegao", "Missionary", "Blowjob", "Hairy", "Anal", "Bukkake", "Feet"] },
  { label: "Model", value: "All", type: "chip", options: ["Anime3d", "Artea", "Aphrodite", "Truelook", "Dreammix", "Cartoon", "Darkfantasy", "Furry", "Fantasy", "Anthro", "Velvetheat"] },
];

const FilterSidebar = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) => {
  const setOpen = onOpenChange;
  const [liked, setLiked] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(filterGroups.map((g) => [g.label, true])),
  );
  const [selected, setSelected] = useState<Record<string, Set<string>>>(() =>
    Object.fromEntries(filterGroups.map((g) => [g.label, new Set<string>()])),
  );

  const totalSelected = Object.values(selected).reduce((n, s) => n + s.size, 0) + (liked ? 1 : 0);

  const toggleOption = (group: string, opt: string) =>
    setSelected((prev) => {
      const next = new Set(prev[group]);
      next.has(opt) ? next.delete(opt) : next.add(opt);
      return { ...prev, [group]: next };
    });

  const clearAll = () => {
    setSelected(Object.fromEntries(filterGroups.map((g) => [g.label, new Set<string>()])));
    setLiked(false);
  };

  if (!open) return null;

  return (
    <aside className="hidden lg:flex w-80 shrink-0 flex-col border-l border-white/5 bg-background-v2">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-grey-light-3-v2" />
          <h3 className="text-sm font-bold tracking-wide text-white">Filters</h3>
          {totalSelected > 0 && (
            <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-v2/15 px-1.5 text-[11px] font-semibold text-primary-v2">
              {totalSelected}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {totalSelected > 0 && (
            <button
              onClick={clearAll}
              className="rounded-md px-2 py-1 text-[11px] font-medium text-grey-light-3-v2 hover:text-white hover:bg-white/5 transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setOpen(false)}
            aria-label="Collapse filters"
            className="flex h-7 w-7 items-center justify-center rounded-md text-grey-light-3-v2 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-themed pl-5 pr-3 pb-6">
        {/* Liked toggle pinned at top */}
        <div className="flex items-center justify-between rounded-xl border border-white/5 bg-grey-dark-1-v2/60 px-3.5 py-3 mb-4">
          <span className="flex items-center gap-2 text-sm text-white">
            <Heart className={`h-3.5 w-3.5 ${liked ? "fill-red-500 text-red-500" : "text-grey-light-3-v2"}`} />
            Liked only
          </span>
          <button
            onClick={() => setLiked((v) => !v)}
            role="switch"
            aria-checked={liked}
            className={`relative h-5 w-9 rounded-full transition-colors ${liked ? "bg-primary-v2" : "bg-white/10"}`}
          >
            <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${liked ? "left-[18px]" : "left-0.5"}`} />
          </button>
        </div>

        <div className="flex flex-col">
          {filterGroups.map((g) => {
            const isOpen = openGroups[g.label];
            const sel = selected[g.label];
            const summary = sel.size > 0 ? `${sel.size} selected` : g.value ?? "All";
            return (
              <div key={g.label} className="border-t border-white/5 first:border-t-0">
                <button
                  onClick={() => setOpenGroups((p) => ({ ...p, [g.label]: !p[g.label] }))}
                  className="flex w-full items-center justify-between py-3.5 text-left"
                >
                  <span className="text-[13px] font-semibold uppercase tracking-wider text-grey-light-4-v2">
                    {g.label}
                    <span className="ml-2 text-xs font-medium normal-case tracking-normal text-white/90">
                      {summary}
                    </span>
                  </span>
                  <ChevronDown className={`h-4 w-4 text-grey-light-3-v2 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <div
                  className={`grid transition-all duration-200 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100 pb-4" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    {g.type === "check" ? (
                      <div className="flex flex-col gap-1">
                        {g.options.map((o) => {
                          const active = sel.has(o);
                          return (
                            <button
                              key={o}
                              onClick={() => toggleOption(g.label, o)}
                              className={`flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors text-left ${
                                active ? "bg-primary-v2/10 text-white" : "text-grey-light-2-v2 hover:bg-white/5 hover:text-white"
                              }`}
                            >
                              <span
                                className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                                  active ? "border-primary-v2 bg-primary-v2" : "border-white/20"
                                }`}
                              >
                                {active && (
                                  <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-primary-v2-foreground" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M2 6.5l2.5 2.5L10 3.5" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </span>
                              {o}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {g.options.map((o) => {
                          const active = sel.has(o);
                          return (
                            <button
                              key={o}
                              onClick={() => toggleOption(g.label, o)}
                              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                                active
                                  ? "bg-primary-v2 text-primary-v2-foreground"
                                  : "bg-grey-dark-1-v2 text-grey-light-2-v2 hover:bg-grey-dark-2-v2 hover:text-white"
                              }`}
                            >
                              {o}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

// ---- Filter dropdown (sort/time pills) ----
const FilterDropdown = ({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-full bg-grey-dark-1-v2 px-4 py-2 text-sm font-medium text-white hover:bg-grey-dark-2-v2 focus:outline-none focus:ring-2 focus:ring-primary-v2/40 transition-colors data-[state=open]:bg-grey-dark-2-v2">
      {value}
      <ChevronDown className="h-3.5 w-3.5 text-grey-light-3-v2" />
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="start"
      className="min-w-[160px] rounded-xl border-white/5 bg-grey-dark-1-v2 p-1.5 shadow-xl"
    >
      {options.map((o) => {
        const active = o === value;
        return (
          <DropdownMenuItem
            key={o}
            onSelect={() => onChange(o)}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm cursor-pointer focus:bg-white/5 ${
              active ? "text-white bg-white/5" : "text-grey-light-2-v2"
            }`}
          >
            {o}
            {active && <Check className="h-3.5 w-3.5 text-primary-v2" />}
          </DropdownMenuItem>
        );
      })}
    </DropdownMenuContent>
  </DropdownMenu>
);

export default ExploreKling;
