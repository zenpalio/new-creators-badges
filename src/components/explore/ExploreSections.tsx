import { ArrowUpRight, ChevronRight, Play, type LucideIcon } from "lucide-react";
import BabeCard from "./BabeCard";
import HScroll from "./HScroll";
import StoryContentCard from "./StoryContentCard";
import CreatorRankCard from "./CreatorRankCard";
import LikeButton from "./LikeButton";
import PromoBanner, { type PromoBannerVariant } from "./PromoBanner";
import { type BadgeTier } from "../BadgeCard";

// ---- Public types ----

export interface ExploreViewSectionCategory {
  id?: string;
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface ExploreViewBabe {
  name: string;
  description: string;
  imageUrl: string;
  href?: string;
  onClick?: () => void;
  messageCount?: number | string;
  likeCount?: number | string;
}

export interface ExploreViewStory {
  id: string;
  src: string;
  href?: string;
  title?: string;
  description?: string;
  episodeCount?: number;
  totalScenes?: number;
  avgRating?: number;
  ratingCount?: number;
  likes?: number;
  onClick?: () => void;
}

export interface ExploreViewVideo {
  id: string;
  imageUrl: string;
  href?: string;
  onClick?: () => void;
  likes?: number | string;
}

export interface ExploreViewCreatorRank {
  rank: number;
  name: string;
  avatarUrl: string;
  tier: BadgeTier;
  verified?: boolean;
  href?: string;
  onClick?: () => void;
}

export interface ExploreViewWhatsNew {
  tag: string;
  date: string;
  title: string;
  description: string;
  href?: string;
  onClick?: () => void;
}

export interface ExploreViewPromo {
  variant?: PromoBannerVariant;
  Icon?: LucideIcon;
  emoji?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  cta?: string;
  href?: string;
}

export interface ExploreViewCreateTool {
  title: string;
  subtitle: string;
  Icon: LucideIcon;
  href: string;
  onClick?: () => void;
}

export interface ExploreViewFooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

export interface ExploreViewFooterLinks {
  social: ExploreViewFooterLinkGroup;
  features: ExploreViewFooterLinkGroup;
  legal: ExploreViewFooterLinkGroup;
  resources: ExploreViewFooterLinkGroup;
}

// ---- Internal helpers ----

interface SectionTitleProps {
  title: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

const SectionTitle = ({ title, actionLabel, actionHref = "#", onAction }: SectionTitleProps) => (
  <div className="mb-3 flex items-end justify-between">
    <h2 className="text-xl font-bold leading-tight text-white">{title}</h2>
    {actionLabel && (
      <a
        href={actionHref}
        onClick={onAction}
        className="flex items-center gap-1 text-xs font-medium text-grey-light-3 hover:text-white transition-colors"
      >
        {actionLabel}
        <ArrowUpRight className="h-3.5 w-3.5" />
      </a>
    )}
  </div>
);

interface TagRowProps {
  tags: ExploreViewSectionCategory[];
}

const TagRow = ({ tags }: TagRowProps) => (
  <div className="mb-3">
    <HScroll>
      {tags.map((t, i) => (
        <a
          href={t.href ?? "#"}
          onClick={t.onClick}
          key={t.id ?? `${t.label}-${i}`}
          className="inline-flex h-[41px] shrink-0 items-center justify-center whitespace-nowrap rounded-[5px] bg-grey-dark-1 px-[16px] text-sm font-medium text-[#F2F2F2] transition-colors hover:bg-grey-dark-3 hover:text-white"
        >
          <span className="normal-case">{t.label}</span>
        </a>
      ))}
    </HScroll>
  </div>
);

// ---- Section components ----

export interface ExploreBabesSectionProps {
  title: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  categories?: ExploreViewSectionCategory[];
  posts: ExploreViewBabe[];
  variant?: "compact" | "stats";
  className?: string;
}

export const ExploreBabesSection = ({
  title,
  actionLabel,
  actionHref,
  onAction,
  categories,
  posts,
  variant = "compact",
  className,
}: ExploreBabesSectionProps) => (
  <section className={className}>
    <SectionTitle title={title} actionLabel={actionLabel} actionHref={actionHref} onAction={onAction} />
    {categories && categories.length > 0 && <TagRow tags={categories} />}
    <HScroll>
      {posts.map((b, i) => (
        <BabeCard
          key={i}
          name={b.name}
          description={b.description}
          imageUrl={b.imageUrl}
          href={b.href}
          onClick={b.onClick}
          messageCount={b.messageCount}
          likeCount={b.likeCount}
          variant={variant}
        />
      ))}
    </HScroll>
  </section>
);

export interface ExploreStoriesSectionProps {
  title: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  posts: ExploreViewStory[];
  className?: string;
}

export const ExploreStoriesSection = ({
  title,
  actionLabel,
  actionHref,
  onAction,
  posts,
  className,
}: ExploreStoriesSectionProps) => (
  <section className={className}>
    <SectionTitle title={title} actionLabel={actionLabel} actionHref={actionHref} onAction={onAction} />
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
          onClick={s.onClick}
        />
      ))}
    </HScroll>
  </section>
);

export interface ExploreVideosSectionProps {
  title: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  categories?: ExploreViewSectionCategory[];
  posts: ExploreViewVideo[];
  className?: string;
}

export const ExploreVideosSection = ({
  title,
  actionLabel,
  actionHref,
  onAction,
  categories,
  posts,
  className,
}: ExploreVideosSectionProps) => (
  <section className={className}>
    <SectionTitle title={title} actionLabel={actionLabel} actionHref={actionHref} onAction={onAction} />
    {categories && categories.length > 0 && <TagRow tags={categories} />}
    <HScroll>
      {posts.map((v, i) => (
        <a
          href={v.href ?? "#"}
          onClick={v.onClick}
          key={`${v.id}-${i}`}
          className="group relative block w-[220px] shrink-0 overflow-hidden rounded-2xl bg-grey-dark-1"
        >
          <div className="relative aspect-[13/19] w-full overflow-hidden">
            <img
              src={v.imageUrl}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur">
                <Play className="h-5 w-5 fill-black text-black" />
              </div>
            </div>
            {v.likes != null && (
              <div className="absolute bottom-2 right-2 text-[11px] font-medium text-white drop-shadow-md">
                <LikeButton iconClassName="h-3.5 w-3.5">
                  <span>{v.likes}</span>
                </LikeButton>
              </div>
            )}
          </div>
        </a>
      ))}
    </HScroll>
  </section>
);

export interface ExploreCreatorsSectionProps {
  title: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  posts: ExploreViewCreatorRank[];
  className?: string;
}

export const ExploreCreatorsSection = ({
  title,
  actionLabel,
  actionHref,
  onAction,
  posts,
  className,
}: ExploreCreatorsSectionProps) => (
  <section className={className}>
    <SectionTitle title={title} actionLabel={actionLabel} actionHref={actionHref} onAction={onAction} />
    <HScroll>
      {posts.map((c) => (
        <CreatorRankCard
          key={c.rank}
          rank={c.rank}
          name={c.name}
          tier={c.tier}
          verified={c.verified}
          avatarUrl={c.avatarUrl}
          href={c.href}
          onClick={c.onClick}
        />
      ))}
    </HScroll>
  </section>
);

export interface ExploreWhatsNewSectionProps {
  title: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  readMoreLabel?: string;
  posts: ExploreViewWhatsNew[];
  className?: string;
}

export const ExploreWhatsNewSection = ({
  title,
  actionLabel,
  actionHref,
  onAction,
  readMoreLabel = "Read more",
  posts,
  className,
}: ExploreWhatsNewSectionProps) => (
  <section className={className}>
    <SectionTitle title={title} actionLabel={actionLabel} actionHref={actionHref} onAction={onAction} />
    <HScroll>
      {posts.map((n, i) => (
        <a
          href={n.href ?? "#"}
          key={i}
          className="block shrink-0"
          onClick={n.onClick}
        >
          <div className="group flex h-full w-[300px] shrink-0 flex-col gap-2 rounded-2xl border border-white/[0.06] bg-grey-dark-1/60 p-4 text-left transition-colors hover:border-white/10 hover:bg-grey-dark-1">
            <div className="flex items-center gap-2 text-[11px] font-medium">
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-primary">{n.tag}</span>
              <span className="text-grey-light-4">{n.date}</span>
            </div>
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white">
              {n.title}
            </h3>
            <p className="line-clamp-2 text-xs leading-snug text-grey-light-3">
              {n.description}
            </p>
            <div className="mt-auto flex items-center gap-1 pt-1 text-xs font-medium text-grey-light-3 transition-colors group-hover:text-white">
              <span>{readMoreLabel}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </a>
      ))}
    </HScroll>
  </section>
);

export interface ExplorePromoSectionProps {
  promo: ExploreViewPromo;
  className?: string;
}

export const ExplorePromoSection = ({ promo, className }: ExplorePromoSectionProps) => (
  <div className={className}>
    <PromoBanner
      variant={promo.variant}
      icon={promo.Icon}
      emoji={promo.emoji}
      eyebrow={promo.eyebrow}
      title={promo.title}
      description={promo.description}
      cta={promo.cta}
      href={promo.href}
    />
  </div>
);

export interface ExploreStartCreatingSectionProps {
  title: string;
  tools: ExploreViewCreateTool[];
  className?: string;
}

export const ExploreStartCreatingSection = ({
  title,
  tools,
  className,
}: ExploreStartCreatingSectionProps) => {
  const cardClass =
    "group relative flex w-full shrink-0 flex-col gap-2.5 overflow-hidden rounded-2xl border border-white/5 bg-grey-dark-1 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-white/10";

  const renderCard = (t: ExploreViewCreateTool) => {
    const Icon = t.Icon;
    return (
      <a key={t.title} href={t.href} onClick={t.onClick} className={cardClass}>
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/15 blur-2xl transition-opacity duration-300 group-hover:bg-primary/25" />

        <div className="relative flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
            <Icon className="h-[18px] w-[18px] text-white" />
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 backdrop-blur transition-all group-hover:bg-white group-hover:text-black">
            <ChevronRight className="h-4 w-4 text-current" />
          </div>
        </div>

        <div className="relative min-w-0">
          <h3 className="line-clamp-2 text-[15px] font-bold leading-tight text-white">
            {t.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-snug text-grey-light-3">
            {t.subtitle}
          </p>
        </div>
      </a>
    );
  };

  return (
    <section className={className}>
      <SectionTitle title={title} />
      {/* Tablet & mobile: horizontal scroll */}
      <div className="xl:hidden">
        <HScroll>
          {tools.map((t) => (
            <div key={t.title} className="w-[240px] shrink-0">
              {renderCard(t)}
            </div>
          ))}
        </HScroll>
      </div>
      {/* Desktop: full-width grid */}
      <div className="hidden gap-3 xl:grid xl:grid-cols-5">
        {tools.map(renderCard)}
      </div>
    </section>
  );
};

export interface ExploreFooterSectionProps {
  footer: ExploreViewFooterLinks;
  className?: string;
}

export const ExploreFooterSection = ({ footer, className }: ExploreFooterSectionProps) => (
  <footer
    className={`mt-8 grid grid-cols-2 gap-6 border-t border-[#242529] pt-6 text-[13px] text-grey-light-4 md:grid-cols-4${
      className ? ` ${className}` : ""
    }`}
  >
    {([footer.social, footer.features, footer.legal, footer.resources]).map((group) => (
      <div key={group.title}>
        <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-grey-light-2">
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
    ))}
  </footer>
);
