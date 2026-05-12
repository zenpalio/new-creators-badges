import { Play } from "lucide-react";
import LikeButton from "./LikeButton";

export interface ExploreVideoCardProps {
  imageUrl: string;
  href?: string;
  likes?: number | string;
  onClick?: () => void;
  imageAlt: string;
}

const ExploreVideoCard = ({
  imageUrl,
  href = "#",
  likes,
  onClick,
  imageAlt,
}: ExploreVideoCardProps) => (
  <a
    href={href}
    onClick={onClick}
    className="group relative block w-[220px] shrink-0 overflow-hidden rounded-2xl bg-grey-dark-1-v2"
  >
    <div className="relative aspect-[13/19] w-full overflow-hidden">
      <img
        src={imageUrl}
        alt={imageAlt}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur">
          <Play className="h-5 w-5 fill-black text-black" />
        </div>
      </div>
      {likes != null && (
        <div className="absolute bottom-2 right-2 text-[11px] font-medium text-white drop-shadow-md">
          <LikeButton iconClassName="h-3.5 w-3.5">
            <span>{likes}</span>
          </LikeButton>
        </div>
      )}
    </div>
  </a>
);

export default ExploreVideoCard;
