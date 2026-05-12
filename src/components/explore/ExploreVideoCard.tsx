import { useEffect, useRef } from "react";
import LikeButton from "./LikeButton";

export interface ExploreVideoCardProps {
  poster?: string;
  video: string;
  href?: string;
  likes?: number | string;
  onClick?: () => void;
  /** Passed to the card link as `aria-label` */
  imageAlt: string;
}

const ExploreVideoCard = ({
  poster,
  video,
  href = "#",
  likes,
  onClick,
  imageAlt,
}: ExploreVideoCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverRef = useRef(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.load();
  }, [video]);

  const handleMouseEnter = () => {
    hoverRef.current = true;
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    const tryPlay = () => {
      if (!hoverRef.current) return;
      void el.play().catch(() => {});
    };
    const p = el.play();
    if (p !== undefined) {
      void p.catch(() => {
        const onCanPlay = () => {
          el.removeEventListener("canplay", onCanPlay);
          tryPlay();
        };
        el.addEventListener("canplay", onCanPlay, { once: true });
      });
    }
  };

  const handleMouseLeave = () => {
    hoverRef.current = false;
    const el = videoRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
  };

  return (
    <a
      href={href}
      onClick={onClick}
      aria-label={imageAlt}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative block w-[220px] shrink-0 overflow-hidden rounded-2xl bg-grey-dark-1-v2"
    >
      <div className="relative aspect-[13/19] w-full overflow-hidden">
        <video
          ref={videoRef}
          src={video}
          muted
          playsInline
          loop
          preload="auto"
          className="absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {poster != null && poster !== "" && (
          <img
            src={poster}
            alt=""
            loading="lazy"
            decoding="async"
            className="pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-0"
          />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-20 bg-gradient-to-t from-black/70 to-transparent" />
        {likes != null && (
          <div className="absolute bottom-2 right-2 z-[3] text-[11px] font-medium text-white drop-shadow-md">
            <LikeButton iconClassName="h-3.5 w-3.5">
              <span>{likes}</span>
            </LikeButton>
          </div>
        )}
      </div>
    </a>
  );
};

export default ExploreVideoCard;
