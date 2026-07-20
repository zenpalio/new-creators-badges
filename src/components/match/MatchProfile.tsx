import { useState } from "react";
import { ChevronLeft, Heart, X, Sparkles } from "lucide-react";
import { scenarioById, type ScenarioId } from "./scenarios";

export default function MatchProfile({
  id,
  onBack,
  onMatch,
  onPass,
}: {
  id: ScenarioId;
  onBack: () => void;
  onMatch: () => void;
  onPass: () => void;
}) {
  const s = scenarioById(id);
  const [slide, setSlide] = useState(0);
  const total = s.slides.length;

  const go = (dir: number) => setSlide((i) => Math.max(0, Math.min(total - 1, i + dir)));

  return (
    <div className="min-h-[100dvh] bg-black text-white flex flex-col">
      {/* Hero gallery */}
      <div className="relative w-full aspect-[3/4] max-h-[70dvh] overflow-hidden">
        <img
          src={s.slides[slide]}
          alt={`${s.name} ${slide + 1}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/40" />

        {/* progress bars */}
        <div className="absolute top-3 left-3 right-3 flex gap-1">
          {s.slides.map((_, i) => (
            <div
              key={i}
              className={`h-[3px] flex-1 rounded-full transition-all ${
                i === slide ? "bg-white" : "bg-white/25"
              }`}
            />
          ))}
        </div>

        {/* tap zones */}
        <button
          className="absolute inset-y-0 left-0 w-1/3"
          onClick={() => go(-1)}
          aria-label="Previous"
        />
        <button
          className="absolute inset-y-0 right-0 w-1/3"
          onClick={() => go(1)}
          aria-label="Next"
        />

        {/* back */}
        <button
          onClick={onBack}
          className="absolute top-6 left-3 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center"
          aria-label="Back to deck"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Name overlay */}
        <div className="absolute bottom-4 left-5 right-5">
          <div className="flex items-baseline gap-2">
            <h1 className="text-4xl font-black tracking-tight">{s.name}</h1>
            <span className="text-2xl font-light text-white/80">{s.age}</span>
          </div>
          <p className="text-sm text-white/85 font-medium">{s.tag}</p>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 px-5 pt-5 pb-32 space-y-5 max-w-md w-full mx-auto">
        <section>
          <h3 className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-2">About</h3>
          <p className="text-[15px] leading-relaxed text-white/90">{s.bio}</p>
        </section>

        <section className="flex flex-wrap gap-2">
          {s.traits.map((t) => (
            <span
              key={t}
              className="px-3 py-1 rounded-full text-xs bg-white/8 border border-white/12 text-white/85"
            >
              {t}
            </span>
          ))}
        </section>

        <section>
          <h3 className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" /> Roleplay
          </h3>
          <p className="text-[15px] leading-relaxed text-white/90 italic">{s.roleplay}</p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h3 className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-2">
            Her first message
          </h3>
          <p className="text-[15px] text-white/90">"{s.opener}"</p>
        </section>
      </div>

      {/* Sticky action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent pt-8 pb-6 px-6 flex items-center justify-center gap-6">
        <button
          onClick={onPass}
          className="w-14 h-14 rounded-full bg-white/5 backdrop-blur-xl border border-white/15 flex items-center justify-center text-rose-400 hover:scale-110 active:scale-95 transition"
          aria-label="Pass"
        >
          <X className="w-7 h-7" strokeWidth={3} />
        </button>
        <button
          onClick={onMatch}
          className="w-18 h-18 w-[72px] h-[72px] rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-95 transition shadow-[0_0_40px_hsl(var(--primary-v2)/0.6)]"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary-v2)), #ec4899)" }}
          aria-label="Match"
        >
          <Heart className="w-9 h-9 fill-white" />
        </button>
      </div>
    </div>
  );
}
