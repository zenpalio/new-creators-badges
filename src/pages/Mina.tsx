import { useState } from "react";
import { Phone, Gift, Settings2 } from "lucide-react";
import { useCompanion, tierFromAffection, type MoodStats } from "@/hooks/useCompanion";
import Live2DStage from "@/components/mina/Live2DStage";
import VRMStage from "@/components/mina/VRMStage";
import minaVrm from "@/assets/mina-character.vrm.asset.json";
import ChatComposer, { type Reaction, type Sentiment } from "@/components/mina/ChatComposer";
import GiftDrawer from "@/components/mina/GiftDrawer";
import CallModal from "@/components/mina/CallModal";
import SceneControls, { BACKGROUNDS, MODELS, type SceneSettings } from "@/components/mina/SceneControls";
import StatsPanel from "@/components/mina/StatsPanel";
import SfxToggle from "@/components/mina/SfxToggle";
import AnimationMenu from "@/components/mina/AnimationMenu";
import ReactionFX from "@/components/mina/ReactionFX";
import AmbientSounds from "@/components/mina/AmbientSounds";

const Mina = () => {
  const [mouth, setMouth] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [sceneOpen, setSceneOpen] = useState(false);
  const [scene, setScene] = useState<SceneSettings>({
    rotation: 0,
    scale: 1,
    mirror: false,
    backgroundId: "midnight",
    modelId: "hiyori",
    renderer: "vrm",
  });
  const { state, refresh, patch, nudgeStats } = useCompanion("mina");
  const tier = tierFromAffection(state.affection);
  const bg = BACKGROUNDS.find((b) => b.id === scene.backgroundId) ?? BACKGROUNDS[0];
  const model = MODELS.find((m) => m.id === scene.modelId) ?? MODELS[0];

  // Reaction FX
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


  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[hsl(220_20%_6%)]">
      {/* Ambient backdrop — image or gradient */}
      {bg.image ? (
        <>
          <img
            src={bg.image}
            alt={bg.label}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          />
          {/* darkening vignette so character stays readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60" />
        </>
      ) : (
        <div className="absolute inset-0 transition-[background] duration-500" style={{ background: bg.css }} />
      )}

      {/* Character */}
      {scene.renderer === "vrm" ? (
        <VRMStage
          mouthOpen={mouth}
          speaking={speaking}
          rotation={scene.rotation}
          scale={scene.scale * 1.0}
          mirror={scene.mirror}
          modelUrl={minaVrm.url}
          sentiment={fxSentiment as any}
          reactTrigger={fxTrigger}
        />
      ) : (
        <Live2DStage
          mouthOpen={mouth}
          speaking={speaking}
          rotation={scene.rotation}
          scale={scene.scale}
          mirror={scene.mirror}
          modelUrl={model.url}
          debug
        />
      )}

      {/* Reaction effects over character */}
      <ReactionFX trigger={fxTrigger} sentiment={fxSentiment} deltas={fxDeltas} />
      <AmbientSounds speaking={speaking || callOpen} volume={0.3} />

      {/* Top-right glass control cluster */}
      <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-30 flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => setCallOpen(true)}
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex items-center justify-center text-white/90 hover:bg-white/[0.12] hover:scale-105 transition"
          title="Call Mina"
        >
          <Phone className="w-4 h-4" />
        </button>
        <AnimationMenu
          onPlay={(sentiment) => {
            setFxSentiment(sentiment);
            setFxDeltas({});
            setFxTrigger((n) => n + 1);
          }}
        />
        <SfxToggle />
        <button
          onClick={() => setSceneOpen((v) => !v)}
          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex items-center justify-center transition ${
            sceneOpen ? "bg-white text-[hsl(220_25%_10%)]" : "bg-white/[0.06] text-white/90 hover:bg-white/[0.12] hover:scale-105"
          }`}
          title="Scene settings"
        >
          <Settings2 className="w-4 h-4" />
        </button>
      </div>

      <SceneControls open={sceneOpen} onClose={() => setSceneOpen(false)} settings={scene} onChange={setScene} />

      {/* Top-left stack: vitals + gift */}
      <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-30 flex flex-col gap-2 w-[62vw] max-w-[260px] sm:w-[280px] sm:max-w-none">
        <StatsPanel stats={state.stats} affection={state.affection} tier={tier} affectionPulse={affectionPulse} pulseTrigger={fxTrigger} pulseDeltas={fxDeltas as any} />
        <button
          onClick={() => setGiftOpen(true)}
          className="group relative h-12 rounded-2xl overflow-hidden border border-white/15 bg-gradient-to-br from-rose-500/25 via-fuchsia-500/15 to-indigo-500/25 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:border-white/30 hover:shadow-[0_10px_40px_rgba(236,72,153,0.25)] transition-all flex items-center pl-2 pr-2 gap-2"
          title="Activities, roleplay & gifts"
        >
          <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <span className="relative w-8 h-8 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </span>
          <span className="relative flex flex-col items-start leading-tight min-w-0 flex-1">
            <span className="text-[12px] font-semibold text-white">Spend time</span>
            <span className="text-[8.5px] uppercase tracking-[0.12em] text-white/55 truncate w-full">Play · Roleplay · Gifts</span>
          </span>
          <span className="relative flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-black/35 border border-white/10 text-[10px] font-semibold text-amber-200 tabular-nums shrink-0">
            <Coins className="w-3 h-3" /> {state.tokens_balance}
          </span>
        </button>
      </div>

      {/* Chat */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-6 z-20 w-[min(680px,calc(100%-2rem))]">
        <ChatComposer onAfterReply={refresh} onMouthLevel={setMouth} onSpeakingChange={setSpeaking} onReaction={handleReaction} />
      </div>

      <GiftDrawer open={giftOpen} onClose={() => setGiftOpen(false)} balance={state.tokens_balance} onPurchased={refresh} affection={state.affection} />
      <CallModal open={callOpen} onClose={() => { setCallOpen(false); refresh(); }} onMouthLevel={setMouth} onTick={refresh} />
    </div>
  );
};

export default Mina;
