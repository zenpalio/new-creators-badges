import LikeButton from "./LikeButton";
import ChatIcon from "../icons/ChatIcon";

export interface PostCardProps {
  name: string;
  description: string;
  imageUrl: string;
  href?: string;
  onClick?: () => void;
  messageCount?: number | string;
  likeCount?: number | string;
  variant?: "compact" | "stats";
}

const PostCard = ({
  name,
  description,
  imageUrl,
  href = "#",
  onClick,
  messageCount = 0,
  likeCount,
  variant = "compact",
}: PostCardProps) => {
  const showStats = variant === "stats";

  return (
    <a
      href={href}
      onClick={onClick}
      className="group relative block w-[220px] shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-grey-dark-1-v2"
    >
      <div className="relative aspect-[13/19] w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Top-right menu removed (admin only) */}

        {/* Compact variant: message badge top-right */}
        {!showStats && messageCount !== 0 && messageCount !== "0" && (
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
            <ChatIcon className="h-3 w-3" />
            {messageCount}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-sm font-bold text-white leading-tight">{name}</h3>
          <p className="mt-1 line-clamp-2 text-[11px] text-grey-light-3-v2 leading-snug">
            {description}
          </p>

          {showStats && (
            <div className="mt-2 flex items-center justify-between text-[12px] font-medium text-white/90">
              <span className="flex items-center gap-1">
                <ChatIcon className="h-3.5 w-3.5" />
                {messageCount}
              </span>
              <LikeButton className="text-[12px] font-medium text-white/90"><span>{likeCount ?? 0}</span></LikeButton>
            </div>
          )}
        </div>
      </div>
    </a>
  );
};

export default PostCard;
