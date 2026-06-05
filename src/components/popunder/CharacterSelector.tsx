import { useState } from "react";
import { PopunderCharacter, PopunderVariant, accentClasses } from "../../data/popunderVariants";
import { cn } from "../../lib/utils";

type Props = {
  variant: PopunderVariant;
  onPick: (char: PopunderCharacter) => void;
};

// Tilt + offset per card index (polaroid feel)
const tilts = ["-rotate-3", "rotate-2", "rotate-3", "-rotate-2"];
const stickerOffsets = [
  "-top-2 -left-2",
  "-top-2 -right-2",
  "-bottom-2 -left-2",
  "-bottom-2 -right-2",
];

export default function CharacterSelector({ variant, onPick }: Props) {
  const accent = accentClasses[variant.accent];
  const [picked, setPicked] = useState<string | null>(null);

  const handlePick = (char: PopunderCharacter) => {
    if (picked) return;
    setPicked(char.name);
    if (navigator.vibrate) navigator.vibrate(30);
    setTimeout(() => onPick(char), 420);
  };

  // Chunky banner text style (thick stroke + drop shadow)
  const bannerTextStyle: React.CSSProperties = {
    color: accent.banner.fill,
    WebkitTextStroke: `2px ${accent.banner.stroke}`,
    textShadow: `0 4px 0 ${accent.banner.shadow}, 0 6px 14px rgba(0,0,0,0.6)`,
    letterSpacing: "0.01em",
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Banner headline */}
      <div className="relative mx-auto w-full animate-pop-rise">
        <div
          className="relative rounded-2xl px-4 py-3 text-center ring-2 ring-white/15"
          style={{ background: accent.banner.bg, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.7)" }}
        >
          <h1
            className="font-black uppercase leading-[0.95] tracking-tight"
            style={{ ...bannerTextStyle, fontSize: "1.9rem" }}
          >
            {variant.hook.line1}
          </h1>
        </div>

        {/* Brand lockup under banner */}
        <div className="mt-3 flex items-center justify-center gap-2.5 text-white/90">
          <span className="text-sm font-black uppercase tracking-[0.18em]">NSFW.app</span>
          <span className={cn("text-base", accent.text)}>★</span>
          <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ring-1 ring-white/20">
            {variant.nsfw ? "18+" : "Preview"}
          </span>
        </div>

        <p className="mt-3 text-center text-sm text-white/75">{variant.hook.line2}</p>
      </div>

      {/* Polaroid grid */}
      <div className="mt-5 grid grid-cols-2 gap-x-2 gap-y-4">
        {variant.characters.map((char, i) => {
          const isPicked = picked === char.name;
          const isDimmed = picked && !isPicked;
          const tilt = tilts[i % tilts.length];
          const stickerPos = stickerOffsets[i % stickerOffsets.length];
          return (
            <button
              key={char.name}
              type="button"
              onClick={() => handlePick(char)}
              className={cn(
                "group relative aspect-[3/4] animate-pop-rise transition-all duration-300 ease-out",
                tilt,
                "hover:scale-[1.05] hover:rotate-0 active:scale-95",
                isPicked && cn("!rotate-0 scale-[1.08]", accent.glow),
                isDimmed && "scale-90 opacity-30 blur-[1px]",
              )}
              style={{ animationDelay: `${180 + i * 90}ms` }}
            >
              {/* Polaroid frame */}
              <div
                className={cn(
                  "relative h-full w-full overflow-hidden rounded-md bg-white p-1.5 pb-6 ring-2 ring-white/40",
                  "shadow-[0_10px_25px_-8px_rgba(0,0,0,0.8)]",
                  isPicked && cn("ring-4", accent.ring),
                )}
              >
                <div className="relative h-full w-full overflow-hidden rounded-sm">
                  <img
                    src={char.image}
                    alt={char.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Hover sheen */}
                  <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  {/* Bottom dark gradient for tagline */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-2">
                    <p className="line-clamp-1 text-[11px] font-medium text-white/90 italic">
                      "{char.tagline}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Name sticker */}
              <div
                className={cn(
                  "pointer-events-none absolute z-10 -skew-x-3 rounded-md px-2.5 py-0.5",
                  stickerPos,
                )}
                style={{
                  background: "rgba(0,0,0,0.55)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                }}
              >
                <span
                  className="block font-black uppercase tracking-tight"
                  style={{
                    fontSize: "1.15rem",
                    color: accent.nameSticker.fill,
                    WebkitTextStroke: `1.5px ${accent.nameSticker.stroke}`,
                    textShadow: `0 2px 0 ${accent.nameSticker.shadow}`,
                  }}
                >
                  {char.name}
                </span>
              </div>

              {/* Picked checkmark burst */}
              {isPicked && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className={cn("flex h-16 w-16 items-center justify-center rounded-full bg-white animate-pop-burst", accent.text)}>
                    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="3.5">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* CTA hint */}
      <div className="mt-4 text-center text-xs font-bold uppercase tracking-[0.2em] text-white/50 animate-pop-pulse">
        ↓ tap your pick ↓
      </div>
    </div>
  );
}
