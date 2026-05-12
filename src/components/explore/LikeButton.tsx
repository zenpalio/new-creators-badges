import { type MouseEvent, type ReactNode } from "react";
import { Heart } from "lucide-react";
import { cn } from "../../lib/utils";

/** Preset styles for explore / hero surfaces. Omitted = defaults only (`h-3.5 w-3.5` icon, no extra button classes). */
export type LikeButtonVariant = "hero" | "heroMeta" | "story" | "babeStats" | "video";

const VARIANT_STYLES: Record<
  LikeButtonVariant,
  { iconClassName: string; className: string }
> = {
  /** Hero text row under story slide (caption): gap + white/hover */
  hero: {
    iconClassName: "h-3.5 w-3.5",
    className: "gap-1.5 text-white/80 hover:text-white",
  },
  /** Hero portrait slide meta row (inherits parent `text-white/70`) */
  heroMeta: {
    iconClassName: "h-3.5 w-3.5",
    className: "gap-1.5",
  },
  /** Hero story desktop card + story rails */
  story: {
    iconClassName: "h-3.5 w-3.5",
    className: "text-[11px] text-white/80 hover:text-white",
  },
  /** Post card stats row */
  babeStats: {
    iconClassName: "h-3.5 w-3.5",
    className: "text-[12px] font-medium text-white/90",
  },
  /** Video card corner (typography from parent wrapper) */
  video: {
    iconClassName: "h-3.5 w-3.5",
    className: "",
  },
};

export interface LikeButtonProps {
  liked: boolean;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  variant?: LikeButtonVariant;
  /** Merged after variant preset (when both are set). */
  iconClassName?: string;
  /** Merged after variant preset (when both are set). */
  className?: string;
  children?: ReactNode;
}

/**
 * Harmonized heart toggle. Parent owns `liked` and updates via `onClick`.
 * Stops propagation so it works inside clickable cards.
 */
const LikeButton = ({
  liked,
  onClick,
  variant,
  iconClassName: iconClassNameProp,
  className: classNameProp = "",
  children,
}: LikeButtonProps) => {
  const preset = variant != null ? VARIANT_STYLES[variant] : null;
  const iconClassName = iconClassNameProp ?? preset?.iconClassName ?? "h-3.5 w-3.5";
  const buttonClassName = cn(
    "inline-flex items-center gap-1 transition-transform active:scale-90",
    preset?.className,
    classNameProp,
  );

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onClick(e);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={buttonClassName}
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
    >
      <Heart
        className={cn(iconClassName, "transition-colors", liked && "text-pink-500")}
        fill={liked ? "currentColor" : "none"}
      />
      {children}
    </button>
  );
};

export default LikeButton;
