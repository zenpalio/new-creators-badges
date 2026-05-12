import { useState, MouseEvent, ReactNode } from "react";
import { Heart } from "lucide-react";

export interface LikeButtonProps {
  count?: number;
  initialLiked?: boolean;
  iconClassName?: string;
  className?: string;
  children?: ReactNode;
}

/**
 * Harmonized heart toggle. Clicking turns the heart pink/red and increments count.
 * Stops propagation so it works inside clickable cards.
 */
const LikeButton = ({
  count,
  initialLiked = false,
  iconClassName = "h-3.5 w-3.5",
  className = "",
  children,
}: LikeButtonProps) => {
  const [liked, setLiked] = useState(initialLiked);

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setLiked((v) => !v);
  };

  const displayCount =
    count != null ? count + (liked && !initialLiked ? 1 : 0) - (!liked && initialLiked ? 1 : 0) : undefined;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1 transition-transform active:scale-90 ${className}`}
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
    >
      <Heart
        className={`${iconClassName} transition-colors ${liked ? "text-pink-500" : ""}`}
        fill={liked ? "currentColor" : "none"}
      />
      {displayCount != null && <span>{displayCount}</span>}
      {children}
    </button>
  );
};

export default LikeButton;
