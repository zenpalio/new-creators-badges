import { useEffect } from "react";
import { Heart } from "lucide-react";
import { scenarioById, type ScenarioId } from "./scenarios";

export default function MatchFlash({
  id,
  onDone,
}: {
  id: ScenarioId;
  onDone: () => void;
}) {
  const s = scenarioById(id);

  useEffect(() => {
    const t = window.setTimeout(onDone, 1800);
    return () => window.clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Radial pulse */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${s.accent}55 0%, transparent 60%)`,
          animation: "match-pulse 1.6s ease-out",
        }}
      />

      {/* Big text */}
      <h1
        className="relative text-6xl sm:text-7xl font-black tracking-tight text-white uppercase animate-scale-in"
        style={{
          background: `linear-gradient(135deg, #fff, ${s.accent})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: `drop-shadow(0 0 30px ${s.accent}80)`,
        }}
      >
        It's a match
      </h1>

      <div className="relative mt-8 flex items-center gap-5">
        <img
          src={s.portrait}
          alt=""
          className="w-24 h-24 rounded-full object-cover border-4"
          style={{ borderColor: s.accent, boxShadow: `0 0 40px ${s.accent}80` }}
        />
        <Heart className="w-10 h-10 fill-white text-white animate-pulse" />
        <div className="w-24 h-24 rounded-full bg-white/10 border-4 border-white/60 flex items-center justify-center text-4xl font-black text-white/70">
          You
        </div>
      </div>

      <p className="relative mt-8 text-white/70 text-sm uppercase tracking-[0.3em] animate-fade-in">
        {s.name} sent you a message…
      </p>

      <style>{`
        @keyframes match-pulse {
          0% { transform: scale(0.4); opacity: 0; }
          40% { opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
