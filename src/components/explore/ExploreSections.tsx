import { ArrowUpRight, type LucideIcon } from "lucide-react"
import PostCard from "./PostCard"
import HScroll from "./HScroll"
import StoryContentCard, {
  type StoryContentCardLabels,
} from "./StoryContentCard"
import CreatorRankCard from "./CreatorRankCard"
import ExploreVideoCard from "./ExploreVideoCard"
import ExploreWhatsNewCard from "./ExploreWhatsNewCard"
import ExploreCreateToolCard from "./ExploreCreateToolCard"
import PromoBanner, { type PromoBannerVariant } from "./PromoBanner"
import { Skeleton } from "../ui/skeleton"
import { type BadgeTier } from "../BadgeCard"
import { type MouseEvent, type ReactNode } from "react"

const DEFAULT_EXPLORE_SECTION_SKELETON_COUNT = 6

const CATEGORY_PLACEHOLDER_WIDTHS_PX = [72, 96, 88, 104, 80]

// ---- Loading skeletons (dimensions match real cards) ----

const TagRowSkeleton = () => (
  <div className="mb-3" aria-hidden>
    <HScroll>
      {CATEGORY_PLACEHOLDER_WIDTHS_PX.map((w, i) => (
        <Skeleton
          key={i}
          className="h-[41px] shrink-0 rounded-[5px]"
          style={{ width: w }}
        />
      ))}
    </HScroll>
  </div>
)

const PostOrVideoCardSkeleton = () => (
  <div
    aria-hidden
    className="relative block w-[220px] shrink-0 overflow-hidden rounded-2xl bg-grey-dark-1-v2"
  >
    <Skeleton className="aspect-[13/19] w-full rounded-none" />
  </div>
)

const ExploreStoryCardSkeleton = () => (
  <div
    aria-hidden
    className="w-[calc(100vw-2rem)] max-w-[460px] shrink-0 md:w-[460px]"
  >
    <Skeleton className="aspect-[5/3] w-full rounded-xl" />
  </div>
)

// ---- Public types ----

export interface ExploreViewSectionCategory {
  id?: string
  label: string
  href?: string
}

export interface ExploreViewBabe {
  name: string
  description: string
  imageUrl: string
  href?: string
  messageCount?: number | string
  likeCount?: number | string
  /** Opaque payload for like/actions (e.g. API entity); set when `likeCount` is used. */
  data?: any
}

export interface ExploreViewStory {
  id: string
  src: string
  href?: string
  title?: string
  description?: string
  episodeCount?: number
  totalScenes?: number
  avgRating?: number
  ratingCount?: number
  likes?: number
  /** Opaque payload for like/actions; set when `likes` is present. */
  data?: any
}

export interface ExploreViewVideo {
  id: string
  poster?: string
  video: string
  href?: string
  likes?: number | string
  /** Opaque payload for like/actions; set when `likes` is present. */
  data?: any
}

export interface ExploreViewCreatorRank {
  rank: number
  name: string
  avatarUrl: string
  tier: BadgeTier
  verified?: boolean
  href?: string
}

export interface ExploreViewWhatsNew {
  id?: string
  tag: string
  date: string
  title: string
  description: string
  href?: string
}

export interface ExploreViewPromo {
  variant?: PromoBannerVariant
  Icon?: LucideIcon
  emoji?: string
  eyebrow?: string
  title: string
  description?: string
  cta?: string
  href?: string
}

export interface ExploreViewCreateTool {
  title: string
  subtitle: string
  Icon: LucideIcon
  href: string
}

export interface ExploreViewFooterLinkGroup {
  title: string
  links: { label: string; href: string }[]
}

export interface ExploreViewFooterLinks {
  social: ExploreViewFooterLinkGroup
  features: ExploreViewFooterLinkGroup
  legal: ExploreViewFooterLinkGroup
  resources: ExploreViewFooterLinkGroup
}

// ---- Internal helpers ----

interface SectionTitleProps {
  title: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

const SectionTitle = ({
  title,
  actionLabel,
  actionHref = "#",
  onAction,
}: SectionTitleProps) => (
  <div className="mb-3 flex items-end justify-between">
    <h2 className="text-xl font-bold leading-tight text-white">{title}</h2>
    {actionLabel && (
      <a
        href={actionHref}
        onClick={onAction}
        className="flex items-center gap-1 text-xs font-medium text-grey-light-3-v2 hover:text-white transition-colors"
      >
        {actionLabel}
        <ArrowUpRight className="h-3.5 w-3.5" />
      </a>
    )}
  </div>
)

interface TagRowProps {
  tags: ExploreViewSectionCategory[]
  onTagClick?: (tag: ExploreViewSectionCategory) => void
}

const TagRow = ({ tags, onTagClick }: TagRowProps) => (
  <div className="mb-3">
    <HScroll>
      {tags.map((t, i) => (
        <a
          href={t.href ?? "#"}
          onClick={onTagClick ? () => onTagClick(t) : undefined}
          key={t.id ?? `${t.label}-${i}`}
          className="inline-flex h-[41px] shrink-0 items-center justify-center whitespace-nowrap rounded-[5px] bg-grey-dark-1-v2 px-[16px] text-sm font-medium text-[#F2F2F2] transition-colors hover:bg-grey-dark-3-v2 hover:text-white"
        >
          <span className="normal-case">{t.label}</span>
        </a>
      ))}
    </HScroll>
  </div>
)

// ---- Section components ----

export interface PostsSectionProps {
  title: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  categories?: ExploreViewSectionCategory[]
  onTagClick?: (tag: ExploreViewSectionCategory) => void
  posts: ExploreViewBabe[]
  onPostClick?: (post: ExploreViewBabe) => void
  /** Optional like control per card; passed through to `PostCard` for `variant="stats"`. */
  renderLikeButton?: (post: ExploreViewBabe) => ReactNode
  variant?: "compact" | "stats"
  className?: string
  /** When true, card rail shows skeleton placeholders instead of `posts`. */
  loading?: boolean
  /** Number of skeleton cards when `loading` is true. Defaults to 6. */
  skeletonCount?: number
  /**
   * When `loading` and there are no `categories` yet, show skeleton pills in the tag row.
   * Set to false to hide the category strip until real tags load.
   * @default true
   */
  showCategoryPlaceholders?: boolean
}

export const PostsSection = ({
  title,
  actionLabel,
  actionHref,
  onAction,
  categories,
  onTagClick,
  posts,
  onPostClick,
  renderLikeButton,
  variant = "compact",
  className,
  loading = false,
  skeletonCount = DEFAULT_EXPLORE_SECTION_SKELETON_COUNT,
  showCategoryPlaceholders = true,
}: PostsSectionProps) => {
  const showTagSkeleton =
    loading &&
    showCategoryPlaceholders &&
    !(categories && categories.length > 0)

  return (
    <section className={className} aria-busy={loading}>
      <SectionTitle
        title={title}
        actionLabel={actionLabel}
        actionHref={actionHref}
        onAction={onAction}
      />
      {categories && categories.length > 0 && (
        <TagRow tags={categories} onTagClick={onTagClick} />
      )}
      {showTagSkeleton && <TagRowSkeleton />}
      <HScroll>
        {loading
          ? Array.from({ length: skeletonCount }, (_, i) => (
              <PostOrVideoCardSkeleton key={i} />
            ))
          : posts.map((b, i) => (
              <PostCard
                key={i}
                name={b.name}
                description={b.description}
                imageUrl={b.imageUrl}
                href={b.href}
                onClick={onPostClick ? () => onPostClick(b) : undefined}
                messageCount={b.messageCount}
                variant={variant}
                likeButton={renderLikeButton?.(b)}
              />
            ))}
      </HScroll>
    </section>
  )
}

export interface ExploreStoriesSectionProps {
  title: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  posts: ExploreViewStory[]
  onPostClick?: (post: ExploreViewStory) => void
  className?: string
  storyCardLabels: StoryContentCardLabels
  renderLikeButton?: (post: ExploreViewStory) => ReactNode
  loading?: boolean
  skeletonCount?: number
}

export const ExploreStoriesSection = ({
  title,
  actionLabel,
  actionHref,
  onAction,
  posts,
  onPostClick,
  className,
  storyCardLabels,
  renderLikeButton,
  loading = false,
  skeletonCount = DEFAULT_EXPLORE_SECTION_SKELETON_COUNT,
}: ExploreStoriesSectionProps) => (
  <section className={className} aria-busy={loading}>
    <SectionTitle
      title={title}
      actionLabel={actionLabel}
      actionHref={actionHref}
      onAction={onAction}
    />
    <HScroll>
      {loading
        ? Array.from({ length: skeletonCount }, (_, i) => (
            <ExploreStoryCardSkeleton key={i} />
          ))
        : posts.map((s, i) => (
            <StoryContentCard
              key={`${s.id}-${i}`}
              src={s.src}
              href={s.href}
              title={s.title}
              description={s.description}
              episodeCount={s.episodeCount}
              totalScenes={s.totalScenes}
              avgRating={s.avgRating}
              ratingCount={s.ratingCount}
              onClick={onPostClick ? () => onPostClick(s) : undefined}
              labels={storyCardLabels}
              likeButton={renderLikeButton?.(s)}
            />
          ))}
    </HScroll>
  </section>
)

export interface ExploreVideosSectionProps {
  title: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  categories?: ExploreViewSectionCategory[]
  onTagClick?: (tag: ExploreViewSectionCategory) => void
  posts: ExploreViewVideo[]
  onPostClick?: (post: ExploreViewVideo) => void
  className?: string
  videoCardImageAlt: string
  renderLikeButton?: (post: ExploreViewVideo) => ReactNode
  loading?: boolean
  skeletonCount?: number
  showCategoryPlaceholders?: boolean
}

export const ExploreVideosSection = ({
  title,
  actionLabel,
  actionHref,
  onAction,
  categories,
  onTagClick,
  posts,
  onPostClick,
  className,
  videoCardImageAlt,
  renderLikeButton,
  loading = false,
  skeletonCount = DEFAULT_EXPLORE_SECTION_SKELETON_COUNT,
  showCategoryPlaceholders = true,
}: ExploreVideosSectionProps) => {
  const showTagSkeleton =
    loading &&
    showCategoryPlaceholders &&
    !(categories && categories.length > 0)

  return (
    <section className={className} aria-busy={loading}>
      <SectionTitle
        title={title}
        actionLabel={actionLabel}
        actionHref={actionHref}
        onAction={onAction}
      />
      {categories && categories.length > 0 && (
        <TagRow tags={categories} onTagClick={onTagClick} />
      )}
      {showTagSkeleton && <TagRowSkeleton />}
      <HScroll>
        {loading
          ? Array.from({ length: skeletonCount }, (_, i) => (
              <PostOrVideoCardSkeleton key={i} />
            ))
          : posts.map((v, i) => (
              <div key={`${v.id}-${i}`} className="w-[220px] shrink-0">
                <ExploreVideoCard
                  poster={v.poster}
                  video={v.video}
                  href={v.href}
                  onClick={onPostClick ? () => onPostClick(v) : undefined}
                  imageAlt={videoCardImageAlt}
                  likeButton={renderLikeButton?.(v)}
                />
              </div>
            ))}
      </HScroll>
    </section>
  )
}

export interface ExploreCreatorsSectionProps {
  title: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  posts: ExploreViewCreatorRank[]
  onPostClick?: (post: ExploreViewCreatorRank) => void
  className?: string
  tierLabels?: Partial<Record<BadgeTier, string>>
}

export const ExploreCreatorsSection = ({
  title,
  actionLabel,
  actionHref,
  onAction,
  posts,
  onPostClick,
  className,
  tierLabels,
}: ExploreCreatorsSectionProps) => (
  <section className={className}>
    <SectionTitle
      title={title}
      actionLabel={actionLabel}
      actionHref={actionHref}
      onAction={onAction}
    />
    <HScroll>
      {posts.map((c) => (
        <CreatorRankCard
          key={c.rank}
          rank={c.rank}
          name={c.name}
          tier={c.tier}
          tierLabel={tierLabels?.[c.tier]}
          verified={c.verified}
          avatarUrl={c.avatarUrl}
          href={c.href}
          onClick={onPostClick ? () => onPostClick(c) : undefined}
        />
      ))}
    </HScroll>
  </section>
)

export interface ExploreWhatsNewSectionProps {
  title: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  readMoreLabel: string
  posts: ExploreViewWhatsNew[]
  onPostClick?: (post: ExploreViewWhatsNew) => void
  className?: string
}

export const ExploreWhatsNewSection = ({
  title,
  actionLabel,
  actionHref,
  onAction,
  readMoreLabel,
  posts,
  onPostClick,
  className,
}: ExploreWhatsNewSectionProps) => (
  <section className={className}>
    <SectionTitle
      title={title}
      actionLabel={actionLabel}
      actionHref={actionHref}
      onAction={onAction}
    />
    <HScroll>
      {posts.map((n, i) => (
        <ExploreWhatsNewCard
          key={n.id ?? i}
          tag={n.tag}
          date={n.date}
          title={n.title}
          description={n.description}
          href={n.href}
          readMoreLabel={readMoreLabel}
          onClick={onPostClick ? () => onPostClick(n) : undefined}
        />
      ))}
    </HScroll>
  </section>
)

export interface ExplorePromoSectionProps {
  promo: ExploreViewPromo
  className?: string
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
}

export const ExplorePromoSection = ({
  promo,
  className,
  onClick,
}: ExplorePromoSectionProps) => (
  <PromoBanner
    variant={promo.variant}
    icon={promo.Icon}
    emoji={promo.emoji}
    eyebrow={promo.eyebrow}
    title={promo.title}
    description={promo.description}
    cta={promo.cta}
    href={promo.href}
    onClick={onClick}
    className={className}
  />
)

export interface ExploreStartCreatingSectionProps {
  title: string
  tools: ExploreViewCreateTool[]
  onToolClick?: (tool: ExploreViewCreateTool) => void
  className?: string
}

export const ExploreStartCreatingSection = ({
  title,
  tools,
  onToolClick,
  className,
}: ExploreStartCreatingSectionProps) => {
  const toolCardProps = (t: ExploreViewCreateTool) => ({
    title: t.title,
    subtitle: t.subtitle,
    Icon: t.Icon,
    href: t.href,
    onClick: onToolClick ? () => onToolClick(t) : undefined,
  })

  return (
    <section className={className}>
      <SectionTitle title={title} />
      {/* Tablet & mobile: horizontal scroll */}
      <div className="xl:hidden">
        <HScroll>
          {tools.map((t) => (
            <div key={t.title} className="w-[240px] shrink-0">
              <ExploreCreateToolCard {...toolCardProps(t)} />
            </div>
          ))}
        </HScroll>
      </div>
      {/* Desktop: full-width grid */}
      <div className="hidden gap-3 xl:grid xl:grid-cols-5">
        {tools.map((t) => (
          <ExploreCreateToolCard key={t.title} {...toolCardProps(t)} />
        ))}
      </div>
    </section>
  )
}

export interface ExploreFooterSectionProps {
  footer: ExploreViewFooterLinks
  className?: string
}

export const ExploreFooterSection = ({
  footer,
  className,
}: ExploreFooterSectionProps) => (
  <footer
    className={`mt-8 grid grid-cols-2 gap-6 border-t border-[#242529] pt-6 text-[13px] text-grey-light-4-v2 md:grid-cols-4${
      className ? ` ${className}` : ""
    }`}
  >
    {[footer.social, footer.features, footer.legal, footer.resources].map(
      (group) => (
        <div key={group.title}>
          <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-grey-light-2-v2">
            {group.title}
          </h4>
          <ul className="space-y-1.5">
            {group.links.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ),
    )}
  </footer>
)
