import { type ReactNode } from "react";

export interface ExploreVideoCardProps {
  poster?: string;
  /** Kept for backward compatibility; no longer rendered. */
  video?: string;
  href?: string;
  onClick?: () => void;
  /** Passed to the card link as `aria-label` */
  imageAlt: string;
  likeButton?: ReactNode;
}

const ExploreVideoCard = ({
  poster,
  href = "#",
  onClick,
  imageAlt,
  likeButton,
}: ExploreVideoCardProps) => {
  return (
    <a
      href={href}
      onClick={onClick}
      aria-label={imageAlt}
      className="group relative block w-full overflow-hidden rounded-2xl bg-grey-dark-1-v2"
    >
      <div className="relative aspect-[13/19] w-full overflow-hidden bg-grey-dark-1-v2">
        {poster != null && poster !== "" && (
          <img
            src={poster}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-20 bg-gradient-to-t from-black/70 to-transparent" />
        {likeButton != null && (
          <div className="absolute bottom-2 right-2 z-[3] text-[11px] font-medium text-white drop-shadow-md">
            {likeButton}
          </div>
        )}
      </div>
    </a>
  );
};

export default ExploreVideoCard;
