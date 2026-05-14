import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { Bell, Menu, Search, Upload, ArrowRight, ArrowUpRight, Sparkles, Image as ImageIcon, Film, User, Wand2, BookOpen, Crown, ChevronDown, Heart, SlidersHorizontal, X, Check, Plus, Clock, Flame, Users, Pencil, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import SideNav from "../components/SideNav";
import NotificationsSidebar, {
  type Notification,
  type NotificationRowLinkProps,
  type NotificationsSidebarLabels,
  type NotificationsSidebarStatusItem,
} from "../components/NotificationsSidebar";
import StoryContentCard, { type StoryContentCardLabels } from "../components/explore/StoryContentCard";
import { useHeaderScrollTracking } from "../components/ExploreView";
import ExploreCreateToolCard from "../components/explore/ExploreCreateToolCard";
import ExploreVideoCard from "../components/explore/ExploreVideoCard";
import FloatingToolsFAB, { type FloatingToolsFabItem } from "../components/explore/FloatingToolsFAB";
import { ExploreStartCreatingSection } from "../components/explore/ExploreSections";
import LikeButton from "../components/explore/LikeButton";
import { exploreVideoFeed } from "../data/exploreVideoFeed";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import sceneBuilderBg from "../assets/scene-builder-bg.jpg";
import storyCreatorBg from "../assets/story-creator-bg.jpg";
import premiumBg from "../assets/premium-bg.jpg";
import storySummer from "../assets/story-summer.jpg";
import storyDark from "../assets/story-dark.jpg";
import storyCampus from "../assets/story-campus.jpg";
import storyMidnight from "../assets/story-midnight.jpg";
import storyIsland from "../assets/story-island.jpg";
import storyNeon from "../assets/story-neon.jpg";
import storyVelvet from "../assets/story-velvet.jpg";
import storyCrimson from "../assets/story-crimson.jpg";
import storyRooftop from "../assets/story-rooftop.jpg";
import storyCabin from "../assets/story-cabin.jpg";
import storyYacht from "../assets/story-yacht.jpg";
import storyTokyo from "../assets/story-tokyo.jpg";
import {
  CreatorsView,
  type SortBy as CreatorsSortBy,
  type FilterBy as CreatorsFilterBy,
  type CreationType as CreatorsCreationType,
} from "../components/CreatorsView";

import { mockCreators, creatorsPageLabels } from "./Creators";
import BadgesHero from "../components/BadgesHero";
import BadgesPanel, { badgesTabs, type BadgesTab } from "../components/BadgesPanel";
import { type EquippedBadge } from "../components/ProfileBadgeShowcase";
import { type BadgeTier } from "../components/BadgeCard";
import { useNavigate } from "react-router-dom";

// ---- Hero banners (left big, right secondary) ----
const heroBanners = [
  {
    code: "SYS//BDG-001",
    eyebrow: "Aura Badges",
    title: "Collect badges, level up",
    version: "v1.0",
    description: "Earn aura, unlock tiers and flex rare badges on your profile.",
    cta: "View badges",
    bg: storyCreatorBg,
    overlay: "from-black/90 via-black/55 to-black/10",
    accent: "primary-v2",
    accentHsl: "213 100% 50%",
    badgeIcon: Sparkles,
    ctaClass: "bg-primary-v2 text-primary-v2-foreground hover:bg-primary-v2/90",
    stats: [
      { label: "TIERS", value: "7" },
      { label: "BADGES", value: "30+" },
      { label: "AURA", value: "∞" },
    ],
  },
  {
    code: "",
    eyebrow: "Premium",
    title: "Skip the queue",
    version: "ELITE",
    description: "Unlimited chats, HD videos, exclusive babes.",
    cta: "Get Premium",
    bg: premiumBg,
    overlay: "from-black/90 via-black/55 to-black/10",
    accent: "fuchsia-400",
    accentHsl: "292 91% 73%",
    badgeIcon: Crown,
    ctaClass: "bg-white text-black hover:bg-white/90",
    stats: [
      { label: "TIER", value: "S+" },
      { label: "QUEUE", value: "00" },
    ],
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
const tabs = ["Creations", "Badges"] as const;
const contentTabs = ["Babes", "Images", "Videos", "Stories"] as const;
const sortOptions = ["Trending", "Newest", "Most Liked"] as const;
const timeOptions = ["Newest", "Oldest", "Most Liked"] as const;

// ---- Masonry feed (mock images, fixed 13:19 aspect) ----
const feed = [...exploreVideoFeed, ...exploreVideoFeed].map((v, i) => ({
  ...v,
  id: `${v.id}-${i}`,
  aspect: "aspect-[13/19]",
  poster: `https://picsum.photos/seed/explore-${i}/520/760`,
  likes: ((v.likes as number) ?? 0) + i * 3,
}));

// (followingTags removed — Following filter moved to right panel)

// ---- Mock characters (scalable: search popover handles long lists) ----
const mockCharacters = [
  "Mia", "Ellie", "Nyx", "Ella", "Hikari", "Lucy", "Luna", "Zara", "Ivy", "Suki",
  "Phoenix", "Aurora", "Violet", "Ember", "Mira", "Kai", "Axel", "Orion", "Ronin",
  "Sasha", "Yuki", "Cleo", "Nova", "Selene", "Raven", "Skye", "Juno", "Echo",
].map((name, i) => ({
  id: name.toLowerCase(),
  name,
  avatar: `https://i.pravatar.cc/80?img=${(i % 70) + 1}`,
}));

const storyCardLabels: StoryContentCardLabels = {
  storyBadge: "Story",
  viewStory: "View story",
  episodeSingular: "episode",
  episodePlural: "episodes",
  sceneSingular: "scene",
  scenePlural: "scenes",
  imageAltFallback: "Story cover",
};

const exploreStories = [
  { title: "Summer Adventures", description: "A sun-drenched escape filled with chance encounters and lingering glances.", src: storySummer, episodeCount: 1, totalScenes: 6, avgRating: 4.6, ratingCount: 128 },
  { title: "Dark Desires", description: "A thrilling journey through the shadows of the city where nothing is as it seems.", src: storyDark, episodeCount: 3, totalScenes: 12, avgRating: 4.8, ratingCount: 312 },
  { title: "Campus Life", description: "Wild adventures of college students navigating love, drama and late-night study sessions.", src: storyCampus, episodeCount: 2, totalScenes: 8, avgRating: 4.3, ratingCount: 87 },
  { title: "Midnight Whispers", description: "Secrets unfold under the moonlight as two strangers meet at a masquerade ball.", src: storyMidnight, episodeCount: 1, totalScenes: 4, avgRating: 4.5, ratingCount: 54 },
  { title: "Island Escape", description: "Stranded on a tropical paradise with a beautiful stranger, every day brings new temptation.", src: storyIsland, episodeCount: 4, totalScenes: 18, avgRating: 4.9, ratingCount: 421 },
  { title: "Neon Nights", description: "Synthwave-soaked rendezvous in a city that never sleeps.", src: storyNeon, episodeCount: 2, totalScenes: 9, avgRating: 4.4, ratingCount: 96 },
  { title: "Velvet Hours", description: "Slow-burn elegance behind closed velvet curtains.", src: storyVelvet, episodeCount: 1, totalScenes: 5, avgRating: 4.7, ratingCount: 142 },
  { title: "Crimson Affair", description: "An untamed romance written in scarlet ink.", src: storyCrimson, episodeCount: 3, totalScenes: 11, avgRating: 4.6, ratingCount: 203 },
  { title: "Rooftop Confessions", description: "Two strangers, one skyline, and a secret neither of them can keep.", src: storyRooftop, episodeCount: 2, totalScenes: 7, avgRating: 4.5, ratingCount: 174 },
  { title: "Cabin in the Pines", description: "A snowed-in weekend turns a quiet retreat into something far more intimate.", src: storyCabin, episodeCount: 1, totalScenes: 5, avgRating: 4.7, ratingCount: 89 },
  { title: "Yacht Week", description: "Sun, salt, and a slow-burning attraction across seven days at sea.", src: storyYacht, episodeCount: 5, totalScenes: 22, avgRating: 4.8, ratingCount: 356 },
  { title: "Tokyo After Dark", description: "Neon-lit alleys, late trains, and a chance meeting that changes everything.", src: storyTokyo, episodeCount: 3, totalScenes: 14, avgRating: 4.6, ratingCount: 241 },
];

const exploreEvents = [
  { id: "stadium-broadcast", title: "Kreate Contest #52: Stadium Broadcast Challenge", subtitle: "Recreate the big screen live moments with Kling AI!", deadline: "13 days and 22 hours before deadline", prize: "Credits", heat: 3564, image: "https://picsum.photos/seed/event-1/800/500" },
  { id: "nextgen-2026", title: "KlingAI NEXTGEN 2026 University Creator Challenge", subtitle: "Your creation lights up the future", deadline: "28 days and 7 hours before deadline", prize: "Prize Pool $10,000", heat: 5332, image: "https://picsum.photos/seed/event-2/800/500" },
  { id: "frames-of-her-love", title: "Holiday Sparks #9: Frames of Her Love", subtitle: "Reimagine your cherished memories with Kling AI!", deadline: "24 days and 22 hours before deadline", prize: "Credits", heat: 586, image: "https://picsum.photos/seed/event-3/800/500" },
  { id: "fashion-spotlight", title: "Kreate Contest #51: Fashion Spotlight Challenge", subtitle: "Redefining Fashion with Kling AI!", deadline: "21 days and 22 hours before deadline", prize: "Credits", heat: 1368, image: "https://picsum.photos/seed/event-4/800/500" },
];

// Notifications (mirrors logic from /)
const ExploreNotificationLink = ({ href, children, ...rest }: NotificationRowLinkProps) => (
  <Link to={href} {...rest}>
    {children}
  </Link>
);

const mockNotifications: Notification[] = [
  { id: "n1", actor: "energetic_lion_0991", initials: "EN", action: "liked video of", target: "Mia", unread: true, href: "#" },
  { id: "n2", actor: "calm_beaver_6740", initials: "CA", action: "liked video of", target: "Ellie – The Reclusive Stepsister", unread: true },
  { id: "n3", actor: "amiable_leopard_8696", initials: "AM", action: "liked", target: "Nyx", unread: true },
  { id: "n4", actor: "cheerful_ibis_4482", initials: "CH", action: "liked video of", target: "Ella" },
  { id: "n5", actor: "charming_capybara_7956", initials: "CH", action: "liked", target: "Hikari" },
  { id: "n6", actor: "Sandwiches", initials: "SA", action: "liked video of", target: "Elipses..." },
  { id: "n7", actor: "blessed_gecko_6782", initials: "BL", action: "liked video of", target: "Lucy" },
  { id: "n8", actor: "appealing_camel_9047", initials: "AP", action: "started following you", href: "https://discord.gg/lovable-dev", hrefTarget: "_blank" as const },
];

const exploreNotificationsSidebarLabels: NotificationsSidebarLabels = {
  titleNotifications: "Notifications",
  titleWhatsNew: "What's new",
  markAllRead: "Mark all as read",
  tabNotifications: "Notifications",
  tabWhatsNew: "What's new?",
  discordCta: "Join our Discord",
  discordHref: "https://discord.gg/lovable-dev",
};

const exploreNotificationsSidebarStatusItems: NotificationsSidebarStatusItem[] = [
  { id: "all-operational", type: "success", message: "All systems operational" },
];

const Gallery = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    mockNotifications.map((n) => ({ ...n }))
  );
  const notificationUnreadCount = notifications.filter((n) => n.unread).length;
  const markAllNotificationsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Creations");
  
  const [activeContent, setActiveContent] = useState<(typeof contentTabs)[number]>("Babes");
  const [badgesSubTab, setBadgesSubTab] = useState<BadgesTab>("aura");
  const [activeSort, setActiveSort] = useState<(typeof sortOptions)[number]>("Trending");
  const [activeTime, setActiveTime] = useState<(typeof timeOptions)[number]>("Newest");
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const mainRef = useRef<HTMLElement>(null);
  const { headerHidden } = useHeaderScrollTracking(mainRef);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [storyFilter, setStoryFilter] = useState<"mine" | "unlocked" | "watching">("mine");

  // Creators tab controls (lifted out of CreatorsView)
  const [creatorsSearch, setCreatorsSearch] = useState("");
  const [creatorsSort, setCreatorsSort] = useState<CreatorsSortBy>("likes");
  const [creatorsTime, setCreatorsTime] = useState<CreatorsFilterBy>("all");
  const [creatorsCreation, setCreatorsCreation] = useState<CreatorsCreationType>("all");

  const toggleLiked = (id: string) =>
    setLikedMap((m) => ({ ...m, [id]: !m[id] }));

  // Equipped badge + tier preview (lifted so BadgesHero reflects them)
  const [activeBadge, setActiveBadge] = useState<EquippedBadge | null>(null);
  const [previewTier, setPreviewTier] = useState<BadgeTier>("legend");

  // Edit mode (mass-delete) for content grid
  const [editMode, setEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const toggleSelected = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const exitEditMode = () => {
    setEditMode(false);
    setSelectedIds(new Set());
  };
  const clearSelection = () => setSelectedIds(new Set());
  const handleDeleteSelected = () => {
    // TODO: wire to backend; for now just clear
    exitEditMode();
  };
  // Reset edit mode when switching tabs/content
  useEffect(() => {
    exitEditMode();
  }, [activeTab, activeContent]);

  return (
    <>
      <SideNav open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <NotificationsSidebar
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onReopen={() => setNotificationsOpen(true)}
        notifications={notifications}
        announcements={[]}
        labels={exploreNotificationsSidebarLabels}
        systemStatusItems={exploreNotificationsSidebarStatusItems}
        notificationLinkComponent={ExploreNotificationLink}
        onMarkAllRead={markAllNotificationsRead}
        onNotificationClick={(n) =>
          setNotifications((prev) =>
            prev.map((x) => (x.id === n.id ? { ...x, unread: false } : x))
          )
        }
      />
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
                onClick={() => setNotificationsOpen(true)}
                aria-label="Notifications"
                className="relative flex h-9 w-9 items-center justify-center text-foreground-v2/90 hover:opacity-70"
              >
                <Bell className="h-5 w-5" strokeWidth={1.5} />
                {notificationUnreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary-v2 px-1 text-[10px] font-semibold text-white">
                    {notificationUnreadCount}
                  </span>
                )}
              </button>
            </div>
          </header>

          <div className="relative z-10 flex w-full flex-col gap-6 px-4 pb-16 pt-14 md:px-8 lg:px-12">
            {/* Hero banners row */}
            <BadgesHero activeBadge={activeBadge} tier={previewTier} />


            {/* Tabs + Search + Publish */}
            <section className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between xl:gap-4 min-w-0">
              <div className="flex items-center gap-3 -mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto scrollbar-hide min-w-0">
                <div className="flex items-center gap-1 rounded-full bg-grey-dark-1-v2 p-1 shrink-0">
                  {tabs.map((t) => (
                    <button
                      key={t}
                      onClick={() => setActiveTab(t)}
                      className={`whitespace-nowrap rounded-full px-3 md:px-4 py-1.5 text-sm font-medium transition-colors ${
                        activeTab === t
                          ? "bg-primary-v2 text-primary-v2-foreground"
                          : "text-grey-light-3-v2 hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {activeTab === "Creations" && (
                  <>
                    <div className="hidden xl:block h-6 w-px bg-white/10" />
                    <div className="relative hidden xl:block">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grey-light-4-v2" />
                      <input
                        placeholder="Search"
                        className="h-9 w-64 rounded-full border border-white/5 bg-grey-dark-1-v2 pl-9 pr-3 text-sm text-white placeholder:text-grey-light-4-v2 outline-none focus:border-primary-v2/50"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Search + filters row (combined below xl) */}
              <div className="flex items-center gap-2 flex-wrap xl:flex-nowrap xl:contents">
                {activeTab === "Creations" && (
                  <div className="relative xl:hidden w-full sm:flex-1 sm:min-w-[180px] sm:max-w-xs">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grey-light-4-v2" />
                    <input
                      placeholder="Search"
                      className="h-9 w-full rounded-full border border-white/5 bg-grey-dark-1-v2 pl-9 pr-3 text-sm text-white placeholder:text-grey-light-4-v2 outline-none focus:border-primary-v2/50"
                    />
                  </div>
                )}
                {activeTab === "Creations" && (
                  <div className="flex items-center gap-2 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-hide flex-nowrap min-w-0 sm:ml-auto xl:ml-0 xl:justify-end">
                    <FilterDropdown
                      value={activeTime}
                      options={timeOptions as unknown as string[]}
                      onChange={(v) => setActiveTime(v as typeof activeTime)}
                    />
                  </div>
                )}
              </div>
            </section>



            {/* Content type tabs */}
            {activeTab === "Creations" && (
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
                <button
                  onClick={() => (editMode ? exitEditMode() : setEditMode(true))}
                  aria-label={editMode ? "Exit edit mode" : "Edit / select to delete"}
                  className={`ml-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                    editMode
                      ? "bg-primary-v2 text-primary-v2-foreground"
                      : "bg-grey-dark-1-v2 text-white hover:bg-grey-dark-2-v2"
                  }`}
                >
                  {editMode ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                </button>
              </div>
            )}

            {activeTab === "Badges" && (
              <div className="flex items-center gap-5 border-b border-white/5 -mt-2">
                {badgesTabs.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setBadgesSubTab(t.value)}
                    className={`relative pb-2.5 text-sm font-medium transition-colors ${
                      badgesSubTab === t.value ? "text-white" : "text-grey-light-4-v2 hover:text-white"
                    }`}
                  >
                    {t.label}
                    {badgesSubTab === t.value && (
                      <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 rounded-full bg-primary-v2" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Character filter (Images / Videos / Stories) */}
            {activeTab === "Creations" && (activeContent === "Images" || activeContent === "Videos") && (
              <CharacterFilter
                characters={mockCharacters}
                value={selectedCharacter}
                onChange={setSelectedCharacter}
              />
            )}

            {/* Feed */}
            {activeTab === "Badges" ? (
              <div className="flex flex-col gap-2">
                <BadgesPanel
                  value={badgesSubTab}
                  activeBadge={activeBadge}
                  onActiveBadgeChange={setActiveBadge}
                  previewTier={previewTier}
                  onPreviewTierChange={setPreviewTier}
                />
              </div>
            ) : activeContent === "Stories" ? (
              <>
              <div className="flex items-center gap-2 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-hide flex-nowrap">
                {([
                  
                  { value: "mine", label: "My stories" },
                  { value: "unlocked", label: "Unlocked" },
                  { value: "watching", label: "Watching" },
                ] as const).map((opt) => {
                  const active = storyFilter === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setStoryFilter(opt.value)}
                      aria-pressed={active}
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                        active
                          ? "bg-primary-v2 text-primary-v2-foreground"
                          : "bg-grey-dark-1-v2 text-grey-light-2-v2 hover:bg-grey-dark-2-v2 hover:text-white"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 [&_a]:!w-full [&_a]:!max-w-none [&>*]:w-full [&>*]:max-w-none">
                <CreateMediaCard
                  to="/explore/story-creator"
                  label="Create story"
                  aspectClass="aspect-[5/3]"
                />
                {exploreStories.map((s) => {
                  const sid = `story-${s.title}`;
                  const isSelected = selectedIds.has(sid);
                  return (
                    <div key={s.title} className="relative">
                      <StoryContentCard {...s} labels={storyCardLabels} />
                      {editMode && (
                        <button
                          type="button"
                          onClick={() => toggleSelected(sid)}
                          aria-label={isSelected ? "Deselect item" : "Select item"}
                          aria-pressed={isSelected}
                          className={`absolute inset-0 z-10 flex items-start justify-start rounded-xl ring-2 ring-inset transition-all ${
                            isSelected
                              ? "bg-primary-v2/25 ring-primary-v2"
                              : "bg-black/10 ring-transparent hover:bg-black/20"
                          }`}
                        >
                          <span
                            className={`m-2 flex h-6 w-6 items-center justify-center rounded-md border-2 transition-colors ${
                              isSelected
                                ? "border-primary-v2 bg-primary-v2 text-primary-v2-foreground"
                                : "border-white/80 bg-black/40"
                            }`}
                          >
                            {isSelected && <Check className="h-4 w-4" strokeWidth={3} />}
                          </span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </section>
              </>
            ) : (
              <section className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                {(() => {
                  const map: Record<string, { href: string; label: string }> = {
                    Babes: { href: "/explore/create-babe", label: "Create babe" },
                    Images: { href: "/explore/image-generator", label: "Create image" },
                    Videos: { href: "/explore/video-generator", label: "Create video" },
                  };
                  const cfg = map[activeContent] ?? map.Images;
                  return (
                    <CreateMediaCard
                      to={cfg.href}
                      label={cfg.label}
                      aspectClass="aspect-[13/19]"
                    />
                  );
                })()}
                {feed.map((v) => {
                  const isSelected = selectedIds.has(v.id);
                  return (
                    <div key={v.id} className="relative">
                      <ExploreVideoCard
                        poster={v.poster}
                        video={v.video}
                        imageAlt={`Preview ${v.id}`}
                        likeButton={
                          <LikeButton
                            variant="video"
                            liked={!!likedMap[v.id]}
                            onClick={() => toggleLiked(v.id)}
                          >
                            <span>{v.likes as number}</span>
                          </LikeButton>
                        }
                      />
                      {editMode && (
                        <button
                          type="button"
                          onClick={() => toggleSelected(v.id)}
                          aria-label={isSelected ? "Deselect item" : "Select item"}
                          aria-pressed={isSelected}
                          className={`absolute inset-0 z-10 flex items-start justify-start rounded-xl ring-2 ring-inset transition-all ${
                            isSelected
                              ? "bg-primary-v2/25 ring-primary-v2"
                              : "bg-black/10 ring-transparent hover:bg-black/20"
                          }`}
                        >
                          <span
                            className={`m-2 flex h-6 w-6 items-center justify-center rounded-md border-2 transition-colors ${
                              isSelected
                                ? "border-primary-v2 bg-primary-v2 text-primary-v2-foreground"
                                : "border-white/80 bg-black/40"
                            }`}
                          >
                            {isSelected && <Check className="h-4 w-4" strokeWidth={3} />}
                          </span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </section>
            )}
          </div>
          {/* Sticky selection action bar */}
          {editMode && (
            <div className="pointer-events-none sticky bottom-4 z-40 flex justify-center px-4">
              <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/10 bg-grey-dark-1-v2/95 p-1.5 shadow-2xl backdrop-blur-md">
                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  disabled={selectedIds.size === 0}
                  className="flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete {selectedIds.size > 0 ? `${selectedIds.size} item${selectedIds.size === 1 ? "" : "s"}` : ""}
                </button>
                <button
                  type="button"
                  onClick={clearSelection}
                  disabled={selectedIds.size === 0}
                  className="rounded-full px-3 py-2 text-sm text-white/80 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Clear Selection
                </button>
                <button
                  type="button"
                  onClick={exitEditMode}
                  className="flex items-center gap-2 rounded-full bg-primary-v2 px-4 py-2 text-sm font-semibold text-primary-v2-foreground transition-colors hover:bg-primary-v2/90"
                >
                  <Check className="h-4 w-4" />
                  Done
                </button>
              </div>
            </div>
          )}
        </main>
        {/* Right filter sidebar */}
        <FilterSidebar open={filtersOpen} onOpenChange={setFiltersOpen} />
      </div>
      <FloatingToolsFAB
        items={[
          { icon: Users, label: "Create Babe", onClick: () => {} },
          { icon: ImageIcon, label: "Create Image", onClick: () => {} },
          { icon: Film, label: "Create Video", onClick: () => {} },
          { icon: BookOpen, label: "Create Story", onClick: () => {} },
        ] satisfies FloatingToolsFabItem[]}
      />
    </>
  );
};


// ---- Right-side filter sidebar ----
const filterGroups: Array<{ label: string; value?: string; type: "check" | "chip"; options: string[] }> = [
  {
    label: "Following",
    value: "All",
    type: "check",
    options: [
      "@luna_eclipse", "@nyx_shadow", "@zara_nova", "@kai_storm", "@mira_blaze",
      "@ivy_frost", "@axel_drift", "@suki_dream", "@phoenix_gale", "@orion_void",
      "@ember_wilde", "@violet_haze", "@ronin_drift",
    ],
  },
  { label: "Gender", value: "All", type: "check", options: ["Female", "Futa", "Transgender"] },
  { label: "Style", value: "All", type: "check", options: ["Realistic", "Anime"] },
  { label: "Age", value: "All", type: "check", options: ["20s", "Milf"] },
  { label: "Body type", value: "All", type: "check", options: ["Slim", "Thick"] },
  { label: "Ethnicity", value: "All", type: "chip", options: ["Asian", "Black", "Caucasian", "Indian", "Arab", "Latina", "Fantasy", "Furry"] },
  { label: "Tags", value: "All", type: "chip", options: ["Full Nelson", "Solo", "Straddling", "Cowgirl", "Rimjob", "Facials", "Fingering", "Futa", "Facesitting", "Doggy Style", "Sex", "Tattoos", "Deepthroat", "Tentacles", "Footjob", "BDSM", "SFW", "Penis", "Titfuck", "Buttplug", "Ahegao", "Missionary", "Blowjob", "Hairy", "Anal", "Bukkake", "Feet"] },
  { label: "Model", value: "All", type: "chip", options: ["Anime3d", "Artea", "Aphrodite", "Truelook", "Dreammix", "Cartoon", "Darkfantasy", "Furry", "Fantasy", "Anthro", "Velvetheat"] },
];

// ---- Hero banners (mobile slider, lg grid) ----
const HeroBanners = () => {
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
      {/* Mobile: snap slider */}
      <div className="xl:hidden">
        <div
          ref={scrollerRef}
          className="-mx-4 flex snap-x snap-mandatory overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {heroBanners.map((b) => (
            <div key={b.title} className="w-full shrink-0 snap-center px-4">
              <HeroBannerCard banner={b} large />
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {heroBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to banner ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${activeIdx === i ? "w-5 bg-white" : "w-1.5 bg-white/30"}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop: grid */}
      <div className="hidden xl:grid grid-cols-2 gap-3">
        {heroBanners.map((b) => (
          <HeroBannerCard key={b.title} banner={b} large={false} />
        ))}
      </div>
    </section>
  );
};

const HeroBannerCard = ({ banner: b, large }: { banner: typeof heroBanners[number]; large: boolean }) => {
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
};

const FilterSidebar = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) => {
  const setOpen = onOpenChange;
  const [liked, setLiked] = useState(false);
  const [followingOnly, setFollowingOnly] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(filterGroups.map((g) => [g.label, true])),
  );
  const [selected, setSelected] = useState<Record<string, Set<string>>>(() =>
    Object.fromEntries(filterGroups.map((g) => [g.label, new Set<string>()])),
  );

  const totalSelected =
    Object.values(selected).reduce((n, s) => n + s.size, 0) + (liked ? 1 : 0) + (followingOnly ? 1 : 0);

  const toggleOption = (group: string, opt: string) =>
    setSelected((prev) => {
      const next = new Set(prev[group]);
      if (next.has(opt)) {
        next.delete(opt);
      } else {
        next.add(opt);
      }
      return { ...prev, [group]: next };
    });

  const clearAll = () => {
    setSelected(Object.fromEntries(filterGroups.map((g) => [g.label, new Set<string>()])));
    setLiked(false);
    setFollowingOnly(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-80 flex-col border-l border-white/5 bg-background-v2 shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
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
        {/* Quick toggles pinned at top */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center justify-between rounded-xl border border-white/5 bg-grey-dark-1-v2/60 px-3.5 py-3">
            <span className="flex items-center gap-2 text-sm text-white">
              <Users className={`h-3.5 w-3.5 ${followingOnly ? "text-primary-v2" : "text-grey-light-3-v2"}`} />
              Following only
            </span>
            <button
              onClick={() => setFollowingOnly((v) => !v)}
              role="switch"
              aria-checked={followingOnly}
              className={`relative shrink-0 h-6 w-11 rounded-full transition-colors ${followingOnly ? "bg-primary-v2" : "bg-white/10"}`}
            >
              <span className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white shadow transition-all ${followingOnly ? "left-[calc(100%-1.375rem)]" : "left-0.5"}`} />
            </button>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-white/5 bg-grey-dark-1-v2/60 px-3.5 py-3">
            <span className="flex items-center gap-2 text-sm text-white">
              <Heart className={`h-3.5 w-3.5 ${liked ? "fill-red-500 text-red-500" : "text-grey-light-3-v2"}`} />
              Liked only
            </span>
            <button
              onClick={() => setLiked((v) => !v)}
              role="switch"
              aria-checked={liked}
              className={`relative shrink-0 h-6 w-11 rounded-full transition-colors ${liked ? "bg-primary-v2" : "bg-white/10"}`}
            >
              <span className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white shadow transition-all ${liked ? "left-[calc(100%-1.375rem)]" : "left-0.5"}`} />
            </button>
          </div>
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
    </>
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
    <DropdownMenuTrigger className="shrink-0 whitespace-nowrap inline-flex items-center gap-2 rounded-full bg-grey-dark-1-v2 px-4 py-2 text-sm font-medium text-white hover:bg-grey-dark-2-v2 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-v2/40 transition-colors data-[state=open]:bg-grey-dark-2-v2">
      {value}
      <ChevronDown className="h-3.5 w-3.5 text-grey-light-3-v2" />
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="start"
      className="min-w-[160px] rounded-xl border-white/5 bg-grey-dark-1-v2 p-2 shadow-xl space-y-1"
    >
      {options.map((o) => {
        const active = o === value;
        return (
          <DropdownMenuItem
            key={o}
            onSelect={() => onChange(o)}
            className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm cursor-pointer focus:bg-white/5 ${
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

const CreatorPillDropdown = ({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) => {
  const current = options.find((o) => o.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-xl border border-border-v2 bg-card-v2 px-4 py-2.5 text-sm font-medium text-foreground-v2 hover:bg-accent-v2/50 focus:outline-none transition-colors data-[state=open]:bg-accent-v2/50">
        {current?.label ?? value}
        <ChevronDown className="h-4 w-4 text-muted-v2-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="min-w-[180px] rounded-xl border-border-v2 bg-card-v2 p-1.5 shadow-xl"
      >
        {options.map((o) => {
          const active = o.value === value;
          return (
            <DropdownMenuItem
              key={o.value}
              onSelect={() => onChange(o.value)}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm cursor-pointer focus:bg-accent-v2/50 ${
                active ? "bg-primary-v2/10 text-primary-v2" : "text-foreground-v2"
              }`}
            >
              {o.label}
              {active && <Check className="h-3.5 w-3.5" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const EventCard = ({
  id,
  title,
  subtitle,
  deadline,
  prize,
  heat,
  image,
}: {
  id: string;
  title: string;
  subtitle: string;
  deadline: string;
  prize: string;
  heat: number;
  image: string;
}) => (
  <a
    href={`/explore/event/${id}`}
    className="group flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-white/5 bg-grey-dark-1-v2 hover:border-primary-v2/30 transition-colors"
  >
    <div className="relative w-full sm:w-[40%] sm:max-w-[260px] shrink-0 aspect-[16/10] sm:aspect-auto sm:min-h-[200px] overflow-hidden bg-black">
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
    <div className="flex flex-1 flex-col gap-3 p-4">
      <div>
        <h3 className="text-base font-semibold text-white leading-snug line-clamp-2">{title}</h3>
        <p className="mt-1 text-sm text-grey-light-3-v2 line-clamp-2">{subtitle}</p>
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-grey-dark-2-v2 px-3 py-1.5 text-xs font-medium text-grey-light-2-v2">
          <Clock className="h-3.5 w-3.5" />
          {deadline}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-grey-dark-2-v2 px-3 py-1.5 text-xs font-medium text-grey-light-2-v2">
          <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500/90 text-[9px] font-bold text-black">$</span>
          {prize}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-grey-dark-2-v2 px-3 py-1.5 text-xs font-medium text-grey-light-2-v2">
          <Flame className="h-3.5 w-3.5 text-orange-400" />
          {heat.toLocaleString()}
        </span>
      </div>
    </div>
  </a>
);

// ---- Character filter (scalable: scrollable chip rail + search popover) ----
const CharacterFilter = ({
  characters,
  value,
  onChange,
}: {
  characters: { id: string; name: string; avatar: string }[];
  value: string | null;
  onChange: (v: string | null) => void;
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = query
    ? characters.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : characters;
  const selected = characters.find((c) => c.id === value);

  return (
    <div className="flex items-center gap-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-nowrap min-w-0">
        <button
          type="button"
          onClick={() => onChange(null)}
          className={`shrink-0 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            value === null
              ? "bg-primary-v2 text-primary-v2-foreground"
              : "bg-grey-dark-1-v2 text-grey-light-2-v2 hover:bg-grey-dark-2-v2 hover:text-white"
          }`}
          aria-pressed={value === null}
        >
          <Users className="h-3.5 w-3.5" />
          All babes
        </button>
        {selected && !characters.slice(0, 8).some((c) => c.id === selected.id) && (
          <CharacterChip character={selected} active onClick={() => onChange(null)} />
        )}
        {characters.slice(0, 8).map((c) => (
          <CharacterChip
            key={c.id}
            character={c}
            active={value === c.id}
            onClick={() => onChange(value === c.id ? null : c.id)}
          />
        ))}
      </div>
      <Popover open={searchOpen} onOpenChange={setSearchOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Search characters"
            className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-grey-dark-1-v2 px-3 py-1.5 text-xs font-medium text-grey-light-2-v2 hover:bg-grey-dark-2-v2 hover:text-white transition-colors"
          >
            <Search className="h-3.5 w-3.5" />
            All ({characters.length})
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-72 border-white/5 bg-grey-dark-1-v2 p-2"
        >
          <div className="relative mb-2">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-grey-light-4-v2" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search characters"
              className="h-8 w-full rounded-md border border-white/5 bg-background-v2 pl-8 pr-2 text-sm text-white placeholder:text-grey-light-4-v2 outline-none focus:border-primary-v2/50"
            />
          </div>
          <div className="max-h-64 overflow-y-auto scrollbar-themed pr-1">
            {filtered.length === 0 && (
              <p className="py-4 text-center text-xs text-grey-light-4-v2">No matches</p>
            )}
            {filtered.map((c) => {
              const active = value === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    onChange(active ? null : c.id);
                    setSearchOpen(false);
                    setQuery("");
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                    active ? "bg-primary-v2/15 text-white" : "text-grey-light-2-v2 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <img src={c.avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
                  <span className="flex-1 truncate">{c.name}</span>
                  {active && <Check className="h-3.5 w-3.5 text-primary-v2" />}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const CharacterChip = ({
  character,
  active,
  onClick,
}: {
  character: { id: string; name: string; avatar: string };
  active: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`shrink-0 inline-flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-xs font-medium transition-colors ${
      active
        ? "bg-primary-v2 text-primary-v2-foreground"
        : "bg-grey-dark-1-v2 text-grey-light-2-v2 hover:bg-grey-dark-2-v2 hover:text-white"
    }`}
  >
    <img src={character.avatar} alt="" className="h-6 w-6 rounded-full object-cover" />
    {character.name}
  </button>
);

// ---- First-card CTA used inside media grids ----
const CTA_GRADIENTS: Record<string, string> = {
  story:
    "radial-gradient(80% 60% at 50% 0%, hsl(210 75% 60%) 0%, transparent 70%), radial-gradient(55% 45% at 15% 70%, hsl(25 55% 55%) 0%, transparent 70%), radial-gradient(60% 50% at 85% 80%, hsl(28 70% 60%) 0%, transparent 70%), linear-gradient(180deg, hsl(210 70% 55%), hsl(25 50% 55%))",
  babe:
    "radial-gradient(80% 60% at 50% 0%, hsl(320 75% 60%) 0%, transparent 70%), radial-gradient(55% 45% at 15% 75%, hsl(280 60% 50%) 0%, transparent 70%), radial-gradient(60% 50% at 85% 80%, hsl(340 70% 60%) 0%, transparent 70%), linear-gradient(180deg, hsl(320 70% 55%), hsl(270 55% 45%))",
  image:
    "radial-gradient(80% 60% at 50% 0%, hsl(170 70% 55%) 0%, transparent 70%), radial-gradient(55% 45% at 15% 75%, hsl(140 55% 50%) 0%, transparent 70%), radial-gradient(60% 50% at 85% 80%, hsl(85 65% 55%) 0%, transparent 70%), linear-gradient(180deg, hsl(170 65% 50%), hsl(95 55% 50%))",
  video:
    "radial-gradient(80% 60% at 50% 0%, hsl(255 70% 60%) 0%, transparent 70%), radial-gradient(55% 45% at 15% 75%, hsl(220 60% 50%) 0%, transparent 70%), radial-gradient(60% 50% at 85% 80%, hsl(330 70% 60%) 0%, transparent 70%), linear-gradient(180deg, hsl(255 65% 55%), hsl(330 60% 55%))",
};

const pickCtaGradient = (to: string, label: string) => {
  const k = `${to} ${label}`.toLowerCase();
  if (k.includes("story")) return CTA_GRADIENTS.story;
  if (k.includes("babe")) return CTA_GRADIENTS.babe;
  if (k.includes("video")) return CTA_GRADIENTS.video;
  if (k.includes("image")) return CTA_GRADIENTS.image;
  return CTA_GRADIENTS.story;
};

const CreateMediaCard = ({
  to,
  label,
  aspectClass,
}: {
  to: string;
  label: string;
  aspectClass: string;
}) => (
  <Link
    to={to}
    aria-label={label}
    className="group relative block w-full overflow-hidden rounded-2xl transition-transform duration-500 ease-out hover:-translate-y-1 hover:scale-[1.02]"
  >
    <div className={`relative w-full ${aspectClass}`}>
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        style={{ background: pickCtaGradient(to, label) }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-60 mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div className="relative flex h-full items-center justify-center p-4 text-center">
        <span className="text-base font-medium leading-snug text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)] sm:text-lg">
          {label}
        </span>
      </div>
    </div>
  </Link>
);

export default Gallery;
