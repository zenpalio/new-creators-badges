import { useState } from "react";
import { PopunderCharacter, PopunderVariant, accentClasses } from "../../data/popunderVariants";
import { cn } from "../../lib/utils";

type Props = {
  variant: PopunderVariant;
  onPick: (char: PopunderCharacter) => void;
};

export default function CharacterSelector({ variant, onPick }: Props) {
  const accent = accentClasses[variant.accent];
  const [picked, setPicked] = useState<string | null>(null);

  const handlePick = (char: PopunderCharacter) => {
    if (picked) return;
    setPicked(char.name);
    if (navigator.vibrate) navigator.vibrate(30);
    setTimeout(() => onPick(char), 380);
  };

  return (
    <div className="flex flex-1 flex-col justify-center">
      {/* Hook */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-black uppercase leading-tight tracking-tight animate-pop-rise [text-shadow:0_2px_30px_rgba(0,0,0,0.6)]">
          <span className={accent.headingGradient}>{variant.hook.line1}</span>
        </h1>
        <p className="mt-2 text-sm text-white/80 animate-pop-rise" style={{ animationDelay: "120ms" }}>
          {variant.hook.line2}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3">
        {variant.characters.map((char, i) => {
          const isPicked = picked === char.name;
          const isDimmed = picked && !isPicked;
          return (
            <button
              key={char.name}
              type="button"
              onClick={() => handlePick(char)}
              className={cn(
                "group relative aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-white/10",
                "transition-all duration-300 ease-out animate-pop-rise",
                "hover:scale-[1.03] hover:ring-2 active:scale-95",
                accent.hoverRing,
                isPicked && cn("scale-105 ring-2", accent.ring, accent.glow),
                isDimmed && "scale-95 opacity-40 blur-[1px]",
              )}
              style={{ animationDelay: `${180 + i * 90}ms` }}
            >
              <img
                src={char.image}
                alt={char.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Bottom gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              {/* Hover sheen */}
              <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

              <div className="absolute inset-x-0 bottom-0 p-3 text-left">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-bold tracking-tight">{char.name}</span>
                  <span className="text-xs text-white/60">{char.age}</span>
                </div>
                <p className="mt-0.5 line-clamp-1 text-[11px] text-white/70">{char.tagline}</p>
              </div>

              {/* Picked checkmark burst */}
              {isPicked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={cn("h-14 w-14 rounded-full bg-white/95 flex items-center justify-center animate-pop-burst", accent.text)}>
                    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
