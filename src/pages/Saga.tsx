import { useEffect, useState, useRef } from "react";
import { SkipForward, Menu, Play, ArrowRight, Trophy, Target, Sparkles, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCompanion, tierFromAffection, type MoodStats } from "@/hooks/useCompanion";
import ChatComposer, { type Reaction, type Sentiment } from "@/components/mina/ChatComposer";
import ReactionFX from "@/components/mina/ReactionFX";
import SagaSidebar from "@/components/saga/SagaSidebar";
import SagaNarration from "@/components/saga/SagaNarration";
import SagaNarration2 from "@/components/saga/SagaNarration2";
import SagaSignupModal from "@/components/saga/SagaSignupModal";
import sagaChar from "@/assets/saga-char.jpg.asset.json";
import sagaChatBg from "@/assets/saga-chat-bg.png.asset.json";
import sagaIntro from "@/assets/saga-intro.mp4.asset.json";
import sagaTitleBg from "@/assets/saga-title-bg.jpg";
import sagaOutroBg from "@/assets/saga-narr-1.jpg";
import annaStage from "@/assets/anna-stage-1.png.asset.json";
import annaChatBg from "@/assets/anna-chat-bg.mp4.asset.json";

type Phase = "title" | "intro" | "outro" | "narration" | "narration2" | "unlock" | "chat";

const INTRO_VIDEO_SRC = sagaIntro.url;

const Saga = () => {
  const [phase, setPhase] = useState<Phase>("title");
  const [menuOpen, setMenuOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [chatVideoDone, setChatVideoDone] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setIsAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setIsAuthed(!!session));
    return () => sub.subscription.unsubscribe();
  }, []);

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
  const endNarration = () => setPhase("narration2");
  const endNarration2 = () => setPhase("unlock");
  const startRoleplay = () => setPhase("chat");

  const startIntro = () => setPhase("intro");
  const continueToChapterOne = () => {
    if (isAuthed) setPhase("narration");
    else setSignupOpen(true);
  };
  const onSignupSuccess = () => {
    setSignupOpen(false);
    setPhase("narration");
  };

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

        {/* ===== NARRATION: subtitles + background imagery ===== */}
        {phase === "narration" && <SagaNarration onComplete={endNarration} />}
        {phase === "narration2" && <SagaNarration2 onComplete={endNarration2} />}

        {/* ===== UNLOCK: achievement-style roleplay reveal ===== */}
        {phase === "unlock" && (
          <div className="absolute inset-0 z-40 bg-background flex flex-col items-center justify-center animate-fade-in overflow-hidden">
            <img
              src={sagaOutroBg}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                filter: "brightness(0.35) grayscale(0.15) contrast(1.1)",
                animation: "saga-poster-drift 18s ease-in-out infinite alternate",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 90% 65% at 50% 50%, hsl(var(--background)/0.88) 0%, hsl(var(--background)/0.7) 55%, hsl(var(--background)/0.35) 100%)",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 70% 45% at 50% 40%, hsl(var(--primary-v2)/0.25), transparent 70%)",
              }}
            />
            {/* Radiating rays behind the trophy */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                background:
                  "conic-gradient(from 0deg at 50% 42%, transparent 0deg, hsl(var(--primary-v2)/0.35) 10deg, transparent 20deg, transparent 40deg, hsl(var(--primary-v2)/0.35) 50deg, transparent 60deg, transparent 90deg, hsl(var(--primary-v2)/0.35) 100deg, transparent 110deg, transparent 140deg, hsl(var(--primary-v2)/0.35) 150deg, transparent 160deg, transparent 200deg, hsl(var(--primary-v2)/0.35) 210deg, transparent 220deg, transparent 260deg, hsl(var(--primary-v2)/0.35) 270deg, transparent 280deg, transparent 320deg, hsl(var(--primary-v2)/0.35) 330deg, transparent 340deg)",
                animation: "saga-rays-spin 24s linear infinite",
                maskImage: "radial-gradient(ellipse 55% 40% at 50% 42%, #000 0%, transparent 70%)",
                WebkitMaskImage: "radial-gradient(ellipse 55% 40% at 50% 42%, #000 0%, transparent 70%)",
              }}
            />

            <div
              className="absolute inset-0 opacity-[0.1] mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")",
              }}
            />

            <style>{`
              @keyframes saga-rays-spin { to { transform: rotate(360deg); } }
              @keyframes saga-unlock-pop {
                0%   { transform: scale(0.4) rotate(-12deg); opacity: 0; }
                60%  { transform: scale(1.15) rotate(4deg); opacity: 1; }
                100% { transform: scale(1) rotate(0deg); opacity: 1; }
              }
              @keyframes saga-shine {
                0% { transform: translateX(-120%); }
                100% { transform: translateX(220%); }
              }
              @keyframes saga-badge-float {
                0%,100% { transform: translateY(0); }
                50%     { transform: translateY(-6px); }
              }
            `}</style>

            <div className="relative z-10 w-full px-6 text-center">
              <div className="mx-auto max-w-[340px] flex flex-col items-center">
                {/* Stage chip */}
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-v2/40 bg-primary-v2/10 mb-6 animate-fade-in"
                  style={{ animationDelay: "0.15s", animationFillMode: "both" }}
                >
                  <Sparkles className="w-3 h-3 text-primary-v2" />
                  <span className="text-[10px] uppercase tracking-[0.3em] text-primary-v2 font-semibold">
                    Stage 1 · Unlocked
                  </span>
                </div>

                {/* Anna portrait */}
                <div
                  className="relative mb-6"
                  style={{ animation: "saga-unlock-pop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}
                >
                  <div
                    className="w-40 h-52 sm:w-44 sm:h-56 rounded-3xl relative overflow-hidden"
                    style={{
                      boxShadow:
                        "0 24px 70px -12px hsl(var(--primary-v2)/0.65), inset 0 0 0 1.5px hsl(var(--primary-v2)/0.7)",
                      animation: "saga-badge-float 3.5s ease-in-out infinite",
                    }}
                  >
                    <img
                      src={annaStage.url}
                      alt="Anna"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Subtle bottom fade */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.55) 100%)",
                      }}
                    />
                    {/* Shine sweep */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.28) 50%, transparent 70%)",
                        animation: "saga-shine 3s ease-in-out 0.9s infinite",
                      }}
                    />
                  </div>
                </div>

                {/* Title */}
                <div
                  className="text-[11px] uppercase tracking-[0.35em] text-foreground-v2/55 mb-2 animate-fade-in"
                  style={{ animationDelay: "0.35s", animationFillMode: "both" }}
                >
                  New Stage
                </div>
                <h2
                  className="text-foreground-v2 leading-[1] tracking-tight font-bold mb-5 animate-fade-in"
                  style={{
                    fontSize: "clamp(28px, 8vw, 38px)",
                    animationDelay: "0.45s",
                    animationFillMode: "both",
                  }}
                >
                  Anna
                </h2>

                {/* Goal card */}
                <div
                  className="w-full rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-4 mb-7 text-left animate-fade-in"
                  style={{ animationDelay: "0.6s", animationFillMode: "both" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-3.5 h-3.5 text-primary-v2" />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-primary-v2/90 font-semibold">
                      Your Goal
                    </span>
                  </div>
                  <p className="text-[14px] leading-snug text-foreground-v2/90">
                    Persuade Anna to take you to the{" "}
                    <span className="text-primary-v2 font-semibold">girls' shelter</span>.
                  </p>
                  <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-foreground-v2/45">
                    <span>Persuasion</span>
                    <span>0 / 100</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-0 bg-primary-v2 rounded-full" />
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={startRoleplay}
                  className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-primary-v2 text-primary-v2-foreground text-[12px] font-semibold uppercase tracking-[0.2em] hover:bg-primary-v2/90 transition-all shadow-[0_10px_40px_-10px_hsl(var(--primary-v2)/0.6)] hover:shadow-[0_14px_50px_-8px_hsl(var(--primary-v2)/0.8)] hover:-translate-y-0.5 animate-fade-in"
                  style={{ animationDelay: "0.8s", animationFillMode: "both" }}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Start Roleplaying
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>

                <div
                  className="mt-4 text-[10px] text-foreground-v2/40 animate-fade-in"
                  style={{ animationDelay: "0.95s", animationFillMode: "both" }}
                >
                  Every reply shifts her trust
                </div>
              </div>
            </div>
          </div>
        )}



        {/* ===== OUTRO: end-of-intro CTA ===== */}
        {phase === "outro" && (
          <div className="absolute inset-0 z-40 bg-background flex flex-col items-center justify-center animate-fade-in overflow-hidden">
            {/* Character image — darkened for legibility */}
            <img
              src={sagaOutroBg}
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
                    Chapter 1 · Get Ready
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
                  Chapter<br />One
                </h2>

                {/* Body copy */}
                <p className="text-[14px] text-foreground-v2/70 mb-8 leading-relaxed max-w-[300px]">
                  Months after the fallout, your story begins. Save your progress and step into the wasteland.
                </p>

                {/* Primary CTA */}
                <button
                  onClick={continueToChapterOne}
                  className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-primary-v2 text-primary-v2-foreground text-[12px] font-semibold uppercase tracking-[0.2em] hover:bg-primary-v2/90 transition-all shadow-[0_10px_40px_-10px_hsl(var(--primary-v2)/0.6)] hover:shadow-[0_14px_50px_-8px_hsl(var(--primary-v2)/0.8)] hover:-translate-y-0.5"
                >
                  Continue to Chapter One
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>

                <div className="mt-4 text-[10px] text-foreground-v2/40">
                  {isAuthed ? "Signed in · ready to continue" : "Free account · takes 10 seconds"}
                </div>

              </div>
            </div>
          </div>
        )}



        {/* ===== CHAT: character + vitals + composer ===== */}
        {phase === "chat" && (
          <>
            {/* Character background — video with image fallback */}
            <div className="absolute inset-0">
              <img
                src={sagaChatBg.url}
                alt="Character"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {!chatVideoDone && (
                <video
                  src={annaChatBg.url}
                  poster={sagaChatBg.url}
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  onEnded={() => setChatVideoDone(true)}
                  onError={() => setChatVideoDone(true)}
                  className="absolute inset-0 w-full h-full object-cover animate-fade-in"
                />
              )}


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





            {/* Roleplay goal + persuasion progress — top-center */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 animate-fade-in w-[min(78%,300px)]">
              <div className="rounded-2xl bg-black/55 backdrop-blur-xl border border-white/10 px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Target className="w-3 h-3 text-primary-v2 shrink-0" />
                  <span className="text-[9px] uppercase tracking-[0.22em] text-white/60 font-medium truncate">
                    Persuade Anna · Girls' Shelter
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-primary-v2 rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.max(3, Math.min(100, state.affection))}%`,
                      boxShadow: "0 0 12px hsl(var(--primary-v2)/0.7)",
                    }}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between text-[9px] uppercase tracking-[0.2em] text-white/45">
                  <span>Persuasion</span>
                  <span>{Math.round(state.affection)} / 100</span>
                </div>
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

            {/* Composer slides up once the intro video finishes */}
            {chatVideoDone && (
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
                    scriptedIntro={[
                      "Keep your hands where I can see them, passenger.",
                      "You're lucky I stopped. Out here, most people don't.",
                      "So talk. What were you doing on that road — and why should I take you any further?",
                    ]}
                  />
                </div>
              <style>{`
                @keyframes saga-slide-up {
                  from { transform: translateY(120%); opacity: 0; }
                  to   { transform: translateY(0);    opacity: 1; }
                }
              `}</style>
              </div>
            )}
          </>
        )}

        {/* Signup / signin gate for Chapter One */}
        <SagaSignupModal
          open={signupOpen}
          onClose={() => setSignupOpen(false)}
          onSuccess={onSignupSuccess}
        />
      </div>
    </div>
  );
};

export default Saga;
