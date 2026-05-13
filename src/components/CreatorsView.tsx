import { useEffect, useMemo, useRef, useState } from "react"
import {
  Search,
  ArrowLeft,
  Crown,
  ChevronDown,
  Zap,
  Image,
  Video,
  BookOpen,
  Users,
  Heart,
  Menu,
} from "lucide-react"
import AuraIcon from "./AuraIcon"
import { type BadgeTier } from "./BadgeCard"
import { cn } from "../lib/utils"

export type CreationType =
  | "all"
  | "characters"
  | "images"
  | "videos"
  | "stories"
export type SortBy = "aura" | "likes" | "followers"
export type FilterBy = "all" | "year" | "month" | "week"

export interface CreatorsViewCreator {
  id: number
  name: string
  avatarUrl: string
  tier: BadgeTier
  followers: number
  likes: number
  aura: number
  creations: {
    characters: number
    images: number
    videos: number
    stories: number
  }
}

export interface CreatorsViewLabels {
  title: string
  searchPlaceholder: string
  sortBy: Record<SortBy, string>
  timeFilter: Record<FilterBy, string>
  creationType: Record<CreationType, string>
  emptyMessage: string
  hotBadge: string
  searchResultsSummary: (resultCount: number, query: string) => string
  followersCount: (n: number) => string
  creationCountFragment: (count: number, typeLabel: string) => string
  searchResultMeta: (followers: number, aura: number) => string
}

const tierBorderColors: Record<BadgeTier, string> = {
  newbie: "hsl(25 45% 52%)",
  master: "hsl(213 100% 60%)",
  legend: "hsl(43 96% 58%)",
  elite: "hsl(213 100% 50%)",
  grandmaster: "hsl(0 82% 58%)",
  mythic: "hsl(281 85% 62%)",
  immortal: "hsl(48 96% 70%)",
}

const tierGlowColors: Record<BadgeTier, string> = {
  newbie: "25 45% 52%",
  master: "213 100% 60%",
  legend: "43 96% 58%",
  elite: "213 100% 50%",
  grandmaster: "0 82% 58%",
  mythic: "281 85% 62%",
  immortal: "48 96% 70%",
}

const isHighTier = (tier: BadgeTier) =>
  ["elite", "grandmaster", "mythic", "immortal"].includes(tier)

const creationTypeIcons: Record<CreationType, React.ReactNode> = {
  all: <Users className="w-4 h-4" />,
  characters: <Users className="w-4 h-4" />,
  images: <Image className="w-4 h-4" />,
  videos: <Video className="w-4 h-4" />,
  stories: <BookOpen className="w-4 h-4" />,
}

export interface CreatorsViewProps {
  creators: CreatorsViewCreator[]
  labels: CreatorsViewLabels
  onBack: () => void
  onMenu?: () => void
  className?: string
  hideHeader?: boolean
  hideToolbar?: boolean
  search?: string
  onSearchChange?: (v: string) => void
  sortBy?: SortBy
  onSortByChange?: (v: SortBy) => void
  filterBy?: FilterBy
  onFilterByChange?: (v: FilterBy) => void
  creationType?: CreationType
  onCreationTypeChange?: (v: CreationType) => void
}

export function CreatorsView({
  creators,
  labels,
  onBack,
  onMenu,
  className,
  hideHeader,
  hideToolbar,
  search: searchProp,
  onSearchChange,
  sortBy: sortByProp,
  onSortByChange,
  filterBy: filterByProp,
  onFilterByChange,
  creationType: creationTypeProp,
  onCreationTypeChange,
}: CreatorsViewProps) {
  const [internalSearch, setInternalSearch] = useState("")
  const search = searchProp !== undefined ? searchProp : internalSearch
  const setSearch = (v: string) => (onSearchChange ?? setInternalSearch)(v)
  const [searchActive, setSearchActive] = useState(false)
  const [internalSortBy, setInternalSortBy] = useState<SortBy>("likes")
  const sortBy = sortByProp ?? internalSortBy
  const setSortBy = (v: SortBy) => (onSortByChange ?? setInternalSortBy)(v)
  const [sortOpen, setSortOpen] = useState(false)
  const [creationOpen, setCreationOpen] = useState(false)
  const [timeOpen, setTimeOpen] = useState(false)
  const [internalFilterBy, setInternalFilterBy] = useState<FilterBy>("all")
  const filterBy = filterByProp ?? internalFilterBy
  const setFilterBy = (v: FilterBy) => (onFilterByChange ?? setInternalFilterBy)(v)
  const [internalCreationType, setInternalCreationType] = useState<CreationType>("all")
  const creationType = creationTypeProp ?? internalCreationType
  const setCreationType = (v: CreationType) => (onCreationTypeChange ?? setInternalCreationType)(v)
  const [headerHidden, setHeaderHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (y < 80) {
        setHeaderHidden(false)
      } else if (y > lastScrollY.current + 4) {
        setHeaderHidden(true)
      } else if (y < lastScrollY.current - 4) {
        setHeaderHidden(false)
      }
      lastScrollY.current = y
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const filterOptions: FilterBy[] = ["all", "year", "month", "week"]
  const creationOptions: CreationType[] = [
    "all",
    "characters",
    "images",
    "videos",
  ]

  const showExtraFilters = sortBy === "likes"

  const filtered = useMemo(() => {
    let list = [...creators]
    if (search)
      list = list.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()),
      )
    if (showExtraFilters && creationType !== "all")
      list = list.filter((c) => c.creations[creationType] > 0)
    if (sortBy === "likes") list.sort((a, b) => b.likes - a.likes)
    else if (sortBy === "followers")
      list.sort((a, b) => b.followers - a.followers)
    else list.sort((a, b) => b.aura - a.aura)
    return list
  }, [creators, search, sortBy, creationType, showExtraFilters])

  return (
    <div className={cn("min-h-screen bg-background-v2 relative w-full", className)}>
      <div className="absolute top-0 left-0 right-0 h-[500px] overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 60% at 50% -10%, hsl(213 100% 50% / 0.14) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 40% 50% at 80% -5%, hsl(40 80% 55% / 0.08) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 35% 45% at 15% 5%, hsl(30 60% 50% / 0.05) 0%, transparent 55%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 w-[200px] h-[1px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, hsl(40 80% 55% / 0.3), transparent)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background:
              "linear-gradient(to top, hsl(var(--background-v2)), transparent)",
          }}
        />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 relative z-10">
        {!hideHeader && (
          <>
            <div
              className={`fixed inset-x-0 top-0 z-40 flex items-start justify-between px-4 pt-4 transition-transform duration-300 ease-out pointer-events-none ${
                headerHidden ? "-translate-y-full" : "translate-y-0"
              }`}
            >
              {onMenu ? (
                <button
                  onClick={onMenu}
                  className="pointer-events-auto flex h-9 w-9 items-center justify-center text-foreground-v2/90 transition-opacity hover:opacity-70"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" strokeWidth={1.5} />
                </button>
              ) : (
                <span />
              )}
              <div className="pointer-events-auto flex h-9 items-center gap-2 bg-card-v2/70 backdrop-blur-md border border-border-v2/40 rounded-full px-3 w-[200px] focus-within:w-[260px] transition-all duration-200">
                <Search className="w-4 h-4 text-muted-v2-foreground flex-shrink-0" />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    if (!e.target.value) setSearchActive(false)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && search.trim()) setSearchActive(true)
                  }}
                  placeholder={labels.searchPlaceholder}
                  className="bg-transparent text-sm text-foreground-v2 placeholder:text-muted-v2-foreground focus:outline-none flex-1 min-w-0"
                />
                {search && (
                  <button
                    onClick={() => {
                      setSearch("")
                      setSearchActive(false)
                    }}
                    className="text-muted-v2-foreground hover:text-foreground-v2 text-xs flex-shrink-0"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            <div className="h-9 mb-4" />
          </>
        )}

        {!hideToolbar && !searchActive && !search && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 bg-card-v2 border border-border-v2 rounded-xl px-4 py-2.5 text-sm font-medium text-foreground-v2 hover:bg-accent-v2/50 transition-colors"
              >
                {labels.sortBy[sortBy]}
                <ChevronDown
                  className={`w-4 h-4 text-muted-v2-foreground transition-transform ${sortOpen ? "rotate-180" : ""}`}
                />
              </button>
              {sortOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setSortOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 z-50 bg-card-v2 border border-border-v2 rounded-xl overflow-hidden shadow-lg min-w-[180px] animate-in fade-in slide-in-from-top-2 duration-150">
                    {(["likes", "followers", "aura"] as SortBy[]).map(
                      (option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSortBy(option)
                            setSortOpen(false)
                          }}
                          className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
                            sortBy === option
                              ? "bg-primary-v2/10 text-primary-v2"
                              : "text-foreground-v2 hover:bg-accent-v2/50"
                          }`}
                        >
                          {labels.sortBy[option]}
                        </button>
                      ),
                    )}
                  </div>
                </>
              )}
            </div>

            {showExtraFilters && (
              <div className="relative">
                <button
                  onClick={() => setCreationOpen(!creationOpen)}
                  className="flex items-center gap-2 bg-card-v2 border border-border-v2 rounded-xl px-4 py-2.5 text-sm font-medium text-foreground-v2 hover:bg-accent-v2/50 transition-colors animate-in fade-in slide-in-from-left-2 duration-200"
                >
                  {creationTypeIcons[creationType]}
                  {labels.creationType[creationType]}
                  <ChevronDown
                    className={`w-4 h-4 text-muted-v2-foreground transition-transform ${creationOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {creationOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setCreationOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 z-50 bg-card-v2 border border-border-v2 rounded-xl overflow-hidden shadow-lg min-w-[180px] animate-in fade-in slide-in-from-top-2 duration-150">
                      {creationOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setCreationType(option)
                            setCreationOpen(false)
                          }}
                          className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
                            creationType === option
                              ? "bg-primary-v2/10 text-primary-v2"
                              : "text-foreground-v2 hover:bg-accent-v2/50"
                          }`}
                        >
                          {creationTypeIcons[option]}
                          {labels.creationType[option]}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {showExtraFilters && (
              <div className="relative">
                <button
                  onClick={() => setTimeOpen(!timeOpen)}
                  className="flex items-center gap-2 bg-card-v2 border border-border-v2 rounded-xl px-4 py-2.5 text-sm font-medium text-foreground-v2 hover:bg-accent-v2/50 transition-colors animate-in fade-in slide-in-from-left-2 duration-200"
                >
                  {labels.timeFilter[filterBy]}
                  <ChevronDown
                    className={`w-4 h-4 text-muted-v2-foreground transition-transform ${timeOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {timeOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setTimeOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 z-50 bg-card-v2 border border-border-v2 rounded-xl overflow-hidden shadow-lg min-w-[180px] animate-in fade-in slide-in-from-top-2 duration-150">
                      {filterOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setFilterBy(option)
                            setTimeOpen(false)
                          }}
                          className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                            filterBy === option
                              ? "bg-primary-v2/10 text-primary-v2"
                              : "text-foreground-v2 hover:bg-accent-v2/50"
                          }`}
                        >
                          {labels.timeFilter[option]}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {!searchActive && !search && filtered.length >= 3 && (
          <div className="relative mb-8 pt-2">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 rounded-full bg-primary-v2/10 blur-[80px]" />
            </div>

            <div className="flex items-end justify-center gap-2 relative z-10">
              {[filtered[1], filtered[0], filtered[2]].map((creator, i) => {
                const podiumRank = [2, 1, 3][i]
                const isFirst = podiumRank === 1
                const avatarPx = isFirst ? 104 : 76
                const borderColor = tierBorderColors[creator.tier]
                const glowHsl = tierGlowColors[creator.tier]
                const highTier = isHighTier(creator.tier)

                return (
                  <div
                    key={creator.id}
                    className="flex flex-col items-center gap-1.5 cursor-pointer group"
                    style={{ marginTop: isFirst ? 0 : "28px" }}
                  >
                    <div
                      className="relative group-hover:scale-110 transition-transform duration-300"
                      style={{
                        filter: highTier
                          ? `drop-shadow(0 0 ${isFirst ? 12 : 8}px hsl(${glowHsl} / 0.4))`
                          : "none",
                      }}
                    >
                      <div
                        className="rounded-full overflow-hidden"
                        style={{
                          width: avatarPx,
                          height: avatarPx,
                          border: `2px solid ${borderColor}`,
                        }}
                      >
                        <img
                          src={creator.avatarUrl}
                          alt={creator.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    <p
                      className={`font-bold text-foreground-v2 truncate max-w-[110px] ${isFirst ? "text-base" : "text-sm"}`}
                    >
                      {creator.name}
                    </p>

                    <div
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                      style={{
                        background:
                          sortBy === "likes"
                            ? "hsl(0 70% 50% / 0.15)"
                            : `linear-gradient(135deg, hsl(${glowHsl} / 0.2), hsl(${glowHsl} / 0.05))`,
                        boxShadow:
                          sortBy === "likes"
                            ? "0 0 12px hsl(0 70% 50% / 0.1)"
                            : `0 0 12px hsl(${glowHsl} / 0.15)`,
                      }}
                    >
                      {sortBy === "likes" ? (
                        <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                      ) : sortBy === "followers" ? (
                        <Users
                          className="w-3.5 h-3.5"
                          style={{ color: `hsl(${glowHsl})` }}
                        />
                      ) : (
                        <AuraIcon className="w-3.5 h-3.5 text-purple-500" />
                      )}
                      <span className="text-[11px] font-black text-foreground-v2">
                        {sortBy === "likes"
                          ? creator.likes.toLocaleString()
                          : sortBy === "followers"
                            ? creator.followers.toLocaleString()
                            : creator.aura.toLocaleString()}
                      </span>
                    </div>

                    <div
                      className="rounded-t-2xl flex flex-col items-center justify-center gap-1 border border-border-v2/30"
                      style={{
                        width: isFirst ? 106 : 86,
                        height: isFirst ? 110 : podiumRank === 2 ? 76 : 58,
                        background:
                          podiumRank === 1
                            ? "linear-gradient(180deg, hsl(43 96% 58% / 0.15) 0%, hsl(var(--card-v2)) 100%)"
                            : podiumRank === 2
                              ? "linear-gradient(180deg, hsl(0 0% 70% / 0.1) 0%, hsl(var(--card-v2)) 100%)"
                              : "linear-gradient(180deg, hsl(25 70% 45% / 0.1) 0%, hsl(var(--card-v2)) 100%)",
                      }}
                    >
                      <span
                        className={`text-3xl font-black ${
                          podiumRank === 1
                            ? "text-yellow-400"
                            : podiumRank === 2
                              ? "text-gray-300"
                              : "text-amber-600"
                        }`}
                      >
                        {podiumRank}
                      </span>
                      {isFirst && (
                        <div className="flex items-center gap-0.5">
                          <Zap className="w-3 h-3 text-yellow-400" />
                          <span className="text-[9px] font-bold text-yellow-400/80">
                            {labels.hotBadge}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="space-y-2">
          {searchActive && search && (
            <p className="text-xs text-muted-v2-foreground mb-3">
              {labels.searchResultsSummary(filtered.length, search)}
            </p>
          )}
          {searchActive || search
            ? filtered.map((creator) => (
                <SearchResultCard
                  key={creator.id}
                  creator={creator}
                  labels={labels}
                />
              ))
            : filtered
                .slice(3)
                .map((creator, idx) => (
                  <CreatorRow
                    key={creator.id}
                    creator={creator}
                    rank={idx + 4}
                    creationType={creationType}
                    sortBy={sortBy}
                    labels={labels}
                  />
                ))}
          {filtered.length === 0 && (
            <p className="text-center text-muted-v2-foreground py-12 text-sm">
              {labels.emptyMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

interface CreatorRowProps {
  creator: CreatorsViewCreator
  rank: number
  creationType: CreationType
  sortBy: SortBy
  labels: CreatorsViewLabels
}

function CreatorRow({
  creator,
  rank,
  creationType,
  sortBy,
  labels,
}: CreatorRowProps) {
  const borderColor = tierBorderColors[creator.tier]
  const glowHsl = tierGlowColors[creator.tier]
  const highTier = isHighTier(creator.tier)

  const rankColor = rank <= 10 ? "text-foreground-v2" : "text-muted-v2-foreground"

  const secondary =
    creationType !== "all"
      ? `${labels.followersCount(creator.followers)} · ${labels.creationCountFragment(
          creator.creations[creationType],
          labels.creationType[creationType],
        )}`
      : labels.followersCount(creator.followers)

  return (
    <div
      className="flex items-center gap-3 bg-card-v2 rounded-xl border border-border-v2/50 px-4 py-3 hover:bg-accent-v2/50 transition-all duration-200 cursor-pointer group hover:scale-[1.01] hover:border-border-v2"
      style={{
        boxShadow: highTier ? `inset 0 0 30px hsl(${glowHsl} / 0.03)` : "none",
      }}
    >
      <span className={`text-lg font-black w-8 text-center ${rankColor}`}>
        {rank}
      </span>

      <div className="relative flex-shrink-0">
        <div
          className="w-11 h-11 rounded-full overflow-hidden"
          style={{ border: `1.5px solid ${borderColor}80` }}
        >
          <img
            src={creator.avatarUrl}
            alt={creator.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold text-foreground-v2 truncate">
            {creator.name}
          </p>
        </div>
        <p className="text-[11px] text-muted-v2-foreground">{secondary}</p>
      </div>

      <div
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
        style={{
          background:
            sortBy === "likes"
              ? "hsl(0 70% 50% / 0.1)"
              : highTier
                ? `linear-gradient(135deg, hsl(${glowHsl} / 0.12), hsl(${glowHsl} / 0.05))`
                : "hsl(var(--muted-v2) / 0.6)",
        }}
      >
        {sortBy === "likes" ? (
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
        ) : sortBy === "followers" ? (
          <Users className="w-3.5 h-3.5 text-primary-v2" />
        ) : (
          <AuraIcon className="w-3.5 h-3.5 text-purple-500" />
        )}
        <span className="text-xs font-bold text-foreground-v2">
          {sortBy === "likes"
            ? creator.likes.toLocaleString()
            : sortBy === "followers"
              ? creator.followers.toLocaleString()
              : creator.aura.toLocaleString()}
        </span>
      </div>
    </div>
  )
}

function SearchResultCard({
  creator,
  labels,
}: {
  creator: CreatorsViewCreator
  labels: CreatorsViewLabels
}) {
  const borderColor = tierBorderColors[creator.tier]

  return (
    <div className="flex items-center gap-4 bg-card-v2 rounded-xl border border-border-v2/50 px-5 py-4 hover:bg-accent-v2/50 transition-all duration-200 cursor-pointer group hover:border-border-v2">
      <div
        className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0"
        style={{ border: `1.5px solid ${borderColor}80` }}
      >
        <img
          src={creator.avatarUrl}
          alt={creator.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground-v2 truncate">
          {creator.name}
        </p>
        <p className="text-[11px] text-muted-v2-foreground mt-0.5">
          {labels.searchResultMeta(creator.followers, creator.aura)}
        </p>
      </div>

      <div className="flex items-center gap-1.5 text-muted-v2-foreground">
        <Heart className="w-3.5 h-3.5" />
        <span className="text-xs font-medium">
          {creator.likes.toLocaleString()}
        </span>
      </div>
    </div>
  )
}
