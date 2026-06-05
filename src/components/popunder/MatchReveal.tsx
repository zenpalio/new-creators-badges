import { useEffect, useState } from "react";
import { PopunderCharacter, PopunderVariant, accentClasses } from "../../data/popunderVariants";
import { cn } from "../../lib/utils";

type Props = {
  variant: PopunderVariant;
  picked: PopunderCharacter;
};

export default function MatchReveal({ variant, picked }: Props) {
  const accent = accentClasses[variant.accent];
  const fullQuote = variant.matchQuote(picked.name);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    setTyped("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(fullQuote.slice(0, i));
      if (i >= fullQuote.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, [fullQuote]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <div className="animate-pop-rise text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">It's a match</p>
        <h1
          className="mt-1 text-5xl font-black uppercase leading-none"
          style={{
            color: accent.banner.fill,
            WebkitTextStroke: `2px ${accent.banner.stroke}`,
            textShadow: `0 4px 0 ${accent.banner.shadow}, 0 8px 18px rgba(0,0,0,0.6)`,
          }}
        >
          {picked.name} 💋
        </h1>
      </div>


      <div
        className={cn(
          "relative mt-6 h-64 w-64 overflow-hidden rounded-3xl ring-4 animate-pop-burst",
          accent.ring,
          accent.glow,
        )}
      >
        <img src={picked.image} alt={picked.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-3 text-left">
          <div className="text-lg font-bold">{picked.name}, {picked.age}</div>
          <div className="text-xs text-white/70">{picked.tagline}</div>
        </div>
      </div>

      <p className="mt-5 min-h-[3rem] max-w-[18rem] text-base italic text-white/90">
        “{typed}<span className="animate-pop-blink">|</span>”
      </p>

      <button
        type="button"
        className={cn(
          "mt-6 w-full max-w-xs rounded-full px-6 py-4 text-base font-bold uppercase tracking-wide text-white",
          "transition-transform duration-200 active:scale-95 animate-pop-pulse-soft",
          accent.btn,
          accent.glow,
        )}
      >
        {variant.ctaLabel}
      </button>
      <button type="button" className="mt-3 text-xs text-white/50 underline-offset-4 hover:underline">
        keep browsing
      </button>
    </div>
  );
}
