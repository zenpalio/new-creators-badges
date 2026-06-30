import { useState, useRef } from "react";
import { SkipForward, Menu } from "lucide-react";
import { useCompanion, tierFromAffection, type MoodStats } from "@/hooks/useCompanion";
import ChatComposer, { type Reaction, type Sentiment } from "@/components/mina/ChatComposer";
import ReactionFX from "@/components/mina/ReactionFX";
import SagaSidebar from "@/components/saga/SagaSidebar";
import sagaChar from "@/assets/saga-char.jpg.asset.json";

type Phase = "intro" | "chat";

// TODO: swap with the real Episode 1 cutscene once rendered.
const INTRO_VIDEO_SRC = "";

const Saga = () => {
  const [phase, setPhase] = useState<Phase>("intro");
  const [menuOpen, setMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reuse Mina's companion state for vitals — swap slug when saga companion ships.
  const { state, refresh, patch, nudgeStats } = useCompanion("mina");
  const tier = tierFromAffection(state.affection);

  const [, setMouth] = useState(0);
  const [, setSpeaking] = useState(false);

  const [fxTrigger, setFxTrigger] = useState(0);
  const [fxSentiment, setFxSentiment] = useState<Sentiment>("neutral");
  const [fxDeltas, setFxDeltas] = useState<Reaction["deltas"]>({});
  const [affectionPulse, setAffectionPulse] = useState<"up" | "down" | null>(null);

  const handleReaction = (r: Reaction) => {
    const d = (r.deltas ?? {}) as Record<string, number>;
    const stat: Partial<MoodStats> = {};
    Object.keys(d).forEach((k) => {
      if (k === "affection") return;
      if (typeof d[k] === "number") (stat as any)[k] = d[k];
    });
    if (Object.keys(stat).length) nudgeStats(stat);
    if (typeof d.affection === "number" && d.affection !== 0) {
      const next = Math.max(0, Math.min(100, state.affection + d.affection));
      patch({ affection: next });
      setAffectionPulse(d.affection > 0 ? "up" : "down");
      window.setTimeout(() => setAffectionPulse(null), 900);
    }
    setFxDeltas(d as any);
    setFxSentiment(r.sentiment);
    setFxTrigger((n) => n + 1);
  };

  const endIntro = () => {
    try { videoRef.current?.pause(); } catch {}
    setPhase("chat");
  };

  return (
    <div className="min-h-screen w-full bg-black text-white flex items-center justify-center overflow-hidden">
      {/* 9:16 stage */}
      <div className="relative w-full h-[100dvh] sm:max-w-[min(100vw,calc(100dvh*9/16))] sm:aspect-[9/16] sm:max-h-[100dvh] overflow-hidden bg-black">

        {/* ===== INTRO: full-bleed cutscene ===== */}
        {phase === "intro" && (
          <div className="absolute inset-0 z-30 bg-black animate-fade-in">
            {INTRO_VIDEO_SRC ? (
              <video
                ref={videoRef}
                src={INTRO_VIDEO_SRC}
                autoPlay
                playsInline
                onEnded={endIntro}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              // Placeholder until the cutscene file is dropped in
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 30% 30%, hsl(15 70% 28% / 0.85), transparent 55%), radial-gradient(ellipse at 70% 80%, hsl(220 50% 8% / 0.95), transparent 65%), linear-gradient(180deg, hsl(220 35% 6%), hsl(15 45% 5%))",
                }}
              />
            )}

            {/* film grain */}
            <div
              className="absolute inset-0 opacity-[0.1] mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")",
              }}
            />

            {/* Letterbox bars for cinematic feel */}
            <div className="absolute top-0 inset-x-0 h-10 bg-black/90 pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-10 bg-black/90 pointer-events-none" />

            {/* Episode label */}
            <div className="absolute top-3 left-4 z-10">
              <div className="text-[9px] uppercase tracking-[0.3em] text-white/60">
                Season I · Episode 1
              </div>
              <div className="text-[12px] font-semibold tracking-tight text-white/85">
                Ashes on the Shore
              </div>
            </div>

            {/* Skip */}
            <button
              onClick={endIntro}
              className="absolute bottom-3 right-4 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.1] backdrop-blur-xl border border-white/15 text-[11px] text-white/85 hover:bg-white/[0.18] transition"
            >
              Skip intro <SkipForward className="w-3 h-3" />
            </button>

            {!INTRO_VIDEO_SRC && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-6">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-1">
                    Cutscene
                  </div>
                  <div className="text-[15px] italic font-serif text-white/80 max-w-[80%] mx-auto">
                    "The longships cut the morning fog…"
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== CHAT: character + vitals + composer ===== */}
        {phase === "chat" && (
          <>
            {/* Character image — full bleed */}
            <div className="absolute inset-0">
              <img
                src={sagaChar.url}
                alt="Character"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Top fade so vitals chip stays readable */}
              <div
                className="absolute inset-x-0 top-0 h-[28%] pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 60%, transparent 100%)",
                }}
              />
              {/* Bottom veil for chat legibility */}
              <div
                className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.92) 100%)",
                }}
              />
            </div>


            {/* Vitals (top-left) — same StatsPanel as Mina */}
            <div className="absolute top-3 left-3 z-30 w-[62vw] max-w-[260px] animate-fade-in">
              <StatsPanel
                stats={state.stats}
                affection={state.affection}
                tier={tier}
                affectionPulse={affectionPulse}
                pulseTrigger={fxTrigger}
                pulseDeltas={fxDeltas as any}
              />
            </div>

            {/* Episode chip — top-center, compact */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 animate-fade-in pointer-events-none">
              <div className="px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-xl border border-white/10 text-[10px] uppercase tracking-[0.25em] text-white/75 leading-none whitespace-nowrap">
                S1 · E1 · Ashes
              </div>
            </div>



            {/* Reaction FX */}
            <ReactionFX trigger={fxTrigger} sentiment={fxSentiment} deltas={fxDeltas} />

            {/* Composer slides up from bottom */}
            <div
              className="absolute inset-x-0 bottom-0 z-20 px-3 pt-4 pb-[max(14px,env(safe-area-inset-bottom))]"
              style={{ animation: "slide-in-right 0s, fade-in 0.5s ease-out" }}
            >
              <div
                className="w-full"
                style={{
                  animation: "saga-slide-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) both",
                }}
              >
                <ChatComposer
                  onAfterReply={refresh}
                  onMouthLevel={setMouth}
                  onSpeakingChange={setSpeaking}
                  onReaction={handleReaction}
                />
              </div>
              <style>{`
                @keyframes saga-slide-up {
                  from { transform: translateY(120%); opacity: 0; }
                  to   { transform: translateY(0);    opacity: 1; }
                }
              `}</style>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Saga;
