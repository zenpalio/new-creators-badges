import { useState, useRef } from "react";
import { SkipForward, Menu, Play, ArrowRight } from "lucide-react";
import { useCompanion, tierFromAffection, type MoodStats } from "@/hooks/useCompanion";
import ChatComposer, { type Reaction, type Sentiment } from "@/components/mina/ChatComposer";
import ReactionFX from "@/components/mina/ReactionFX";
import SagaSidebar from "@/components/saga/SagaSidebar";
import sagaChar from "@/assets/saga-char.jpg.asset.json";
import sagaIntro from "@/assets/saga-intro.mp4.asset.json";
import sagaTitleBg from "@/assets/saga-title-bg.jpg";

type Phase = "title" | "intro" | "outro" | "chat";

const INTRO_VIDEO_SRC = sagaIntro.url;

const Saga = () => {
  const [phase, setPhase] = useState<Phase>("title");
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
    setPhase("outro");
  };

  const startIntro = () => setPhase("intro");
  const enterChat = () => setPhase("chat");

  return (
    <div className="min-h-screen w-full bg-black text-white flex items-center justify-center overflow-hidden">
      {/* 9:16 stage */}
      <div className="relative w-full h-[100dvh] sm:max-w-[min(100vw,calc(100dvh*9/16))] sm:aspect-[9/16] sm:max-h-[100dvh] overflow-hidden bg-black">

        {/* ===== TITLE: interactive opener ===== */}
        {phase === "title" && (
          <div className="absolute inset-0 z-40 bg-background flex flex-col items-center justify-center animate-fade-in overflow-hidden">
            {/* Poster background — darkened for legibility */}
            <img
              src={sagaTitleBg}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                filter: "brightness(0.5) saturate(0.85)",
                animation: "saga-poster-drift 20s ease-in-out infinite alternate",
              }}
            />
            {/* Heavy center scrim so text sits on solid dark */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 85% 60% at 50% 50%, hsl(var(--background)/0.88) 0%, hsl(var(--background)/0.65) 55%, hsl(var(--background)/0.3) 100%)",
              }}
            />
            {/* Top/bottom fades */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, hsl(var(--background)/0.7) 0%, transparent 25%, transparent 75%, hsl(var(--background)/0.95) 100%)",
              }}
            />
            {/* Blue tint */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 60% 40% at 50% 45%, hsl(var(--primary-v2)/0.15), transparent 70%)",
              }}
            />

            {/* Film grain */}
            <div
              className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")",
              }}
            />
            <style>{`
              @keyframes saga-poster-drift {
                0%   { transform: scale(1.05) translateY(0); }
                100% { transform: scale(1.12) translateY(-1.5%); }
              }
            `}</style>


            <div className="relative z-10 w-full px-6 text-center">
              <div className="mx-auto max-w-[340px] flex flex-col items-center">
                {/* Brand mark */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-v2/30 bg-primary-v2/5 mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-v2 animate-pulse" />
                  <span className="text-[10px] uppercase tracking-[0.3em] text-primary-v2 font-medium">
                    mybabes.ai · original
                  </span>
                </div>

                {/* Eyebrow */}
                <div className="text-[10px] uppercase tracking-[0.45em] text-foreground-v2/50 mb-3">
                  Interactive Series
                </div>

                {/* Title — bold sans, tight */}
                <h1 className="text-foreground-v2 leading-[0.95] tracking-tight font-bold mb-5"
                  style={{ fontSize: "clamp(38px, 11vw, 56px)" }}
                >
                  THE LAST<br />EDEN
                </h1>

                {/* Meta row */}
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-foreground-v2/55 mb-10">
                  <span>S1</span>
                  <span className="w-1 h-1 rounded-full bg-foreground-v2/30" />
                  <span>Episode 1</span>
                  <span className="w-1 h-1 rounded-full bg-foreground-v2/30" />
                  <span>Post-Apoc</span>
                </div>

                {/* Primary CTA */}
                <button
                  onClick={startIntro}
                  className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-primary-v2 text-primary-v2-foreground text-[12px] font-semibold uppercase tracking-[0.2em] hover:bg-primary-v2/90 transition-all shadow-[0_10px_40px_-10px_hsl(var(--primary-v2)/0.6)] hover:shadow-[0_14px_50px_-8px_hsl(var(--primary-v2)/0.8)] hover:-translate-y-0.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Play Intro
                </button>

                <div className="mt-4 text-[10px] text-foreground-v2/40">
                  ~1 min · then you take control
                </div>
              </div>
            </div>

            <div className="absolute bottom-5 inset-x-0 text-center text-[9px] uppercase tracking-[0.35em] text-foreground-v2/30">
              A mybabes.ai original
            </div>
          </div>
        )}



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

            {/* (letterbox bars removed — video fills the stage) */}

            {/* Episode label */}
            <div className="absolute top-3 left-4 z-10">
              <div className="text-[9px] uppercase tracking-[0.3em] text-white/60">
                Season I · Episode 1
              </div>
              <div className="text-[12px] font-semibold tracking-tight text-white/85">
                The Last Eden
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

        {/* ===== OUTRO: end-of-intro CTA ===== */}
        {phase === "outro" && (
          <div className="absolute inset-0 z-40 bg-background flex flex-col items-center justify-center animate-fade-in overflow-hidden">
            {/* Character image — darkened for legibility */}
            <img
              src={sagaChar.url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                filter: "brightness(0.4) grayscale(0.2) contrast(1.05)",
                animation: "saga-poster-drift 18s ease-in-out infinite alternate",
              }}
            />
            {/* Heavy center scrim so text sits on solid dark */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 85% 65% at 50% 50%, hsl(var(--background)/0.9) 0%, hsl(var(--background)/0.7) 55%, hsl(var(--background)/0.35) 100%)",
              }}
            />
            {/* Top/bottom fades */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, hsl(var(--background)/0.7) 0%, transparent 25%, transparent 75%, hsl(var(--background)/0.95) 100%)",
              }}
            />
            {/* Blue tint */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 60% 40% at 50% 45%, hsl(var(--primary-v2)/0.15), transparent 70%)",
              }}
            />

            {/* Film grain */}
            <div
              className="absolute inset-0 opacity-[0.1] mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")",
              }}
            />

            <div className="relative z-10 w-full px-6 text-center">
              <div className="mx-auto max-w-[340px] flex flex-col items-center">
                {/* Chapter chip */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-v2/30 bg-primary-v2/5 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-v2 animate-pulse" />
                  <span className="text-[10px] uppercase tracking-[0.3em] text-primary-v2 font-medium">
                    Chapter 1 · Now Playing
                  </span>
                </div>

                {/* Eyebrow */}
                <div className="text-[10px] uppercase tracking-[0.45em] text-foreground-v2/50 mb-3">
                  Your story begins
                </div>

                {/* Title */}
                <h2 className="text-foreground-v2 leading-[0.95] tracking-tight font-bold mb-5"
                  style={{ fontSize: "clamp(34px, 10vw, 48px)" }}
                >
                  Finding<br />Shelter
                </h2>

                {/* Body copy — clean sans, not italic serif */}
                <p className="text-[14px] text-foreground-v2/70 mb-8 leading-relaxed max-w-[300px]">
                  The storm is closing in. Find a place to hide before nightfall — every choice from here is yours.
                </p>

                {/* Primary CTA */}
                <button
                  onClick={enterChat}
                  className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-primary-v2 text-primary-v2-foreground text-[12px] font-semibold uppercase tracking-[0.2em] hover:bg-primary-v2/90 transition-all shadow-[0_10px_40px_-10px_hsl(var(--primary-v2)/0.6)] hover:shadow-[0_14px_50px_-8px_hsl(var(--primary-v2)/0.8)] hover:-translate-y-0.5"
                >
                  Enter the story
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>

                <div className="mt-4 text-[10px] text-foreground-v2/40">
                  Chat begins · vitals track your journey
                </div>
              </div>
            </div>
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


            {/* Menu button — opens sidebar with vitals/episodes/lore */}
            <button
              onClick={() => setMenuOpen(true)}
              className="absolute top-3 left-3 z-30 w-10 h-10 rounded-full bg-black/45 backdrop-blur-xl border border-white/15 flex items-center justify-center text-white/85 hover:bg-black/60 transition animate-fade-in"
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Episode chip — top-center, compact */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 animate-fade-in pointer-events-none">
              <div className="px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-xl border border-white/10 text-[10px] uppercase tracking-[0.25em] text-white/75 leading-none whitespace-nowrap">
                S1 · E1 · The Last Eden
              </div>
            </div>

            {/* Sidebar drawer */}
            <SagaSidebar
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              state={state}
              tier={tier}
              affectionPulse={affectionPulse}
              pulseTrigger={fxTrigger}
              pulseDeltas={fxDeltas as any}
            />




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
