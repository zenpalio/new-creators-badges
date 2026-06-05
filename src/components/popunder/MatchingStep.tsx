import { useEffect, useState } from "react";
import { PopunderCharacter, PopunderVariant, accentClasses } from "../../data/popunderVariants";
import { cn } from "../../lib/utils";

type Props = {
  variant: PopunderVariant;
  picked: PopunderCharacter;
  onDone: () => void;
};

export default function MatchingStep({ variant, picked, onDone }: Props) {
  const accent = accentClasses[variant.accent];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const cycle = setInterval(() => setIdx((i) => (i + 1) % variant.characters.length), 120);
    const done = setTimeout(() => {
      clearInterval(cycle);
      onDone();
    }, 1300);
    return () => {
      clearInterval(cycle);
      clearTimeout(done);
    };
  }, [variant.characters.length, onDone]);

  const shown = variant.characters[idx];

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <div className={cn("relative h-56 w-56 overflow-hidden rounded-3xl ring-2", accent.ring, accent.glow)}>
        <img src={shown.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
        <div className="absolute inset-0 animate-pop-pulse bg-white/10" />
      </div>
      <h2 className="mt-6 text-xl font-bold">
        Matching you with <span className={accent.text}>{picked.name}</span>
        <span className="ml-0.5 inline-flex">
          <span className="animate-pop-dot">.</span>
          <span className="animate-pop-dot" style={{ animationDelay: "150ms" }}>.</span>
          <span className="animate-pop-dot" style={{ animationDelay: "300ms" }}>.</span>
        </span>
      </h2>
      <p className="mt-1 text-sm text-white/60">finding her DMs</p>
    </div>
  );
}
