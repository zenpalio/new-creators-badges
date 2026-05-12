import { ArrowUpRight, type LucideIcon } from "lucide-react"
import PostCard from "./PostCard"
import HScroll from "./HScroll"
import StoryContentCard, { type StoryContentCardLabels } from "./StoryContentCard"
import CreatorRankCard from "./CreatorRankCard"
import ExploreVideoCard from "./ExploreVideoCard"
import ExploreWhatsNewCard from "./ExploreWhatsNewCard"
import ExploreCreateToolCard from "./ExploreCreateToolCard"
import PromoBanner, { type PromoBannerVariant } from "./PromoBanner"
import { type BadgeTier } from "../BadgeCard"

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
}

export interface ExploreViewVideo {
  id: string
  imageUrl: string
  href?: string
  likes?: number | string
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
  variant?: "compact" | "stats"
  className?: string
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
  variant = "compact",
  className,
}: PostsSectionProps) => (
  <section className={className}>
    <SectionTitle
      title={title}
      actionLabel={actionLabel}
      actionHref={actionHref}
      onAction={onAction}
    />
    {categories && categories.length > 0 && (
      <TagRow tags={categories} onTagClick={onTagClick} />
    )}
    <HScroll>
      {posts.map((b, i) => (
        <PostCard
          key={i}
          name={b.name}
          description={b.description}
          imageUrl={b.imageUrl}
          href={b.href}
          onClick={onPostClick ? () => onPostClick(b) : undefined}
          messageCount={b.messageCount}
          likeCount={b.likeCount}
          variant={variant}
        />
      ))}
    </HScroll>
  </section>
)

export interface ExploreStoriesSectionProps {
  title: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  posts: ExploreViewStory[]
  onPostClick?: (post: ExploreViewStory) => void
  className?: string
  storyCardLabels: StoryContentCardLabels
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
}: ExploreStoriesSectionProps) => (
  <section className={className}>
    <SectionTitle
      title={title}
      actionLabel={actionLabel}
      actionHref={actionHref}
      onAction={onAction}
    />
    <HScroll>
      {posts.map((s, i) => (
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
          likes={s.likes}
          onClick={onPostClick ? () => onPostClick(s) : undefined}
          labels={storyCardLabels}
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
}: ExploreVideosSectionProps) => (
  <section className={className}>
    <SectionTitle
      title={title}
      actionLabel={actionLabel}
      actionHref={actionHref}
      onAction={onAction}
    />
    {categories && categories.length > 0 && (
      <TagRow tags={categories} onTagClick={onTagClick} />
    )}
    <HScroll>
      {posts.map((v, i) => (
        <ExploreVideoCard
          key={`${v.id}-${i}`}
          imageUrl={v.imageUrl}
          href={v.href}
          likes={v.likes}
          onClick={onPostClick ? () => onPostClick(v) : undefined}
          imageAlt={videoCardImageAlt}
        />
      ))}
    </HScroll>
  </section>
)

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
}

export const ExplorePromoSection = ({
  promo,
  className,
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
