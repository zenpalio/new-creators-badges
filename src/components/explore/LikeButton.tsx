import { useState, MouseEvent, ReactNode } from "react";

interface LikeButtonProps {
  count?: number;
  initialLiked?: boolean;
  iconClassName?: string;
  className?: string;
  children?: ReactNode;
}

const HeartIcon = ({ className, filled }: { className?: string; filled: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 18 18"
    className={className}
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={filled ? 0 : 1.5}
  >
    <path d="M9 3.446a4.43 4.43 0 0 0-4.708-.825 4.5 4.5 0 0 0-1.449.975C1.08 5.368 1.08 8.14 2.845 9.905l5.499 5.499a.746.746 0 0 0 .99.286.74.74 0 0 0 .26-.224l5.561-5.561c1.766-1.766 1.766-4.537-.001-6.312a4.46 4.46 0 0 0-3.157-1.316c-1.11 0-2.18.417-2.997 1.169m5.093 1.207a2.94 2.94 0 0 1 .002 4.191L9 13.94 3.905 8.844a2.937 2.937 0 0 1-.001-4.188 2.96 2.96 0 0 1 2.1-.879c.783 0 1.525.312 2.09.878l.376.375a.75.75 0 0 0 1.06 0l.375-.375c1.134-1.132 3.056-1.129 4.188-.002" />
  </svg>
);

/**
 * Harmonized heart toggle. Clicking turns the heart pink/red and increments count.
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
      <HeartIcon
        className={`${iconClassName} transition-colors ${liked ? "text-pink-500" : ""}`}
        filled={liked}
      />
      {displayCount != null && <span>{displayCount}</span>}
      {children}
    </button>
  );
};

export default LikeButton;
