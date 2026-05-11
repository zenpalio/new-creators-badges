import { BookOpen, Star, Layers, Film } from "lucide-react";
import LikeButton from "./LikeButton";

interface StoryContentCardProps {
  src: string;
  title?: string;
  description?: string;
  href?: string;
  episodeCount?: number;
  totalScenes?: number;
  avgRating?: number;
  ratingCount?: number;
  likes?: number;
  onClick?: () => void;
}

/**
 * Wide story card (5:3) ported from Creative Studio's StoryContentCard.
 * Used in horizontal scrolling story rails on the Explore page.
 */
const StoryContentCard = ({
  src,
  title,
  description,
  href = "#",
  episodeCount = 0,
  totalScenes = 0,
  avgRating = 0,
  ratingCount = 0,
  likes,
  onClick,
}: StoryContentCardProps) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className="group relative block w-[calc(100vw-2rem)] max-w-[460px] shrink-0 aspect-[5/3] rounded-xl overflow-hidden bg-card border border-border/50 cursor-pointer md:w-[460px]"
    >
      {/* Cover image */}
      {src ? (
        <img
          src={src}
          alt={title || "Story"}
          loading="lazy"
          className="h-full w-full object-cover object-top transition-transform duration-300 md:group-hover:scale-[1.03]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
          <BookOpen className="h-10 w-10 text-muted-foreground/40" />
        </div>
      )}

      {/* Top badge */}
      <div className="absolute left-2.5 top-2.5 z-10">
        <span className="flex items-center gap-1 rounded-lg border border-border/30 bg-background/70 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur-sm">
          <BookOpen className="h-3.5 w-3.5" /> Story
        </span>
      </div>

      {/* Rating badge */}
      {avgRating > 0 && (
        <div className="absolute right-2.5 top-2.5 z-10">
          <span className="flex items-center gap-1 rounded-lg border border-border/30 bg-background/70 px-2 py-1 text-[11px] font-semibold text-yellow-400 backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 fill-yellow-400" />
            {avgRating.toFixed(1)}
            <span className="font-normal text-foreground/50">({ratingCount})</span>
          </span>
        </div>
      )}

      {/* Bottom gradient + meta */}
      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-3 pb-3 pt-12">
        {title && (
          <p className="mb-0.5 truncate text-lg font-bold tracking-tight text-white drop-shadow-md md:text-xl">
            {title}
          </p>
        )}
        {description && (
          <p className="mb-2 line-clamp-2 text-[11px] leading-relaxed text-white/60">
            {description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 text-[11px] text-white/80">
            <Film className="h-3.5 w-3.5" />
            {episodeCount} {episodeCount === 1 ? "episode" : "episodes"}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-white/80">
            <Layers className="h-3.5 w-3.5" />
            {totalScenes} {totalScenes === 1 ? "scene" : "scenes"}
          </span>
          {likes != null && (
            <LikeButton count={likes} className="text-[11px] text-white/80 hover:text-white" />
          )}
        </div>
      </div>

      {/* Hover overlay (desktop only) */}
      <div className="pointer-events-none absolute inset-0 z-[1] hidden items-center justify-center bg-black/0 opacity-0 transition-all duration-300 md:flex md:group-hover:bg-black/40 md:group-hover:opacity-100">
        <span className="rounded-full border border-white/20 bg-white/20 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm">
          View Story
        </span>
      </div>
    </a>
  );
};

export default StoryContentCard;
