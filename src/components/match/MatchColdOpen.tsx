import { useEffect, useState } from "react";
import { scenarioById, type ScenarioId } from "./scenarios";

export default function MatchColdOpen({
  id,
  onReply,
}: {
  id: ScenarioId;
  onReply: () => void;
}) {
  const s = scenarioById(id);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setShow(true), 900);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-40 bg-black overflow-hidden">
      <img
        src={s.hero}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ animation: "cold-zoom 6s ease-out forwards" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />

      {/* Scenario tag top */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 animate-fade-in">
        <div className="rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/15 px-4 py-1.5 text-[10px] uppercase tracking-[0.25em] text-white/80">
          {s.tag}
        </div>
      </div>

      {/* Opener line */}
      {show && (
        <div className="absolute inset-x-0 bottom-0 pb-[max(28px,env(safe-area-inset-bottom))] px-6">
          <div className="max-w-md mx-auto flex flex-col gap-5">
            <div className="flex items-end gap-3 animate-fade-in">
              <img
                src={s.portrait}
                alt={s.name}
                className="w-12 h-12 rounded-full object-cover border-2 shrink-0"
                style={{ borderColor: s.accent }}
              />
              <div
                className="flex-1 px-5 py-4 rounded-2xl rounded-bl-md text-[15px] text-white bg-white/[0.09] border border-white/15 backdrop-blur-xl shadow-2xl leading-relaxed"
              >
                {s.opener}
              </div>
            </div>

            <div className="text-center text-[10px] uppercase tracking-[0.3em] text-white/40">
              {s.hook}
            </div>

            <button
              onClick={onReply}
              className="w-full h-14 rounded-full font-bold text-white text-sm uppercase tracking-[0.25em] shadow-[0_0_40px_hsl(var(--primary-v2)/0.5)] hover:scale-[1.02] active:scale-95 transition"
              style={{
                background: `linear-gradient(135deg, hsl(var(--primary-v2)), ${s.accent})`,
              }}
            >
              Reply to {s.name}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes cold-zoom {
          from { transform: scale(1.15); }
          to   { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
