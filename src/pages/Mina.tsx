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
      <div className="absolute top-5 right-5 z-30 flex items-center gap-2">
        <button
          onClick={() => setCallOpen(true)}
          className="w-11 h-11 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex items-center justify-center text-white/90 hover:bg-white/[0.12] hover:scale-105 transition"
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
        <button
          onClick={() => setSceneOpen((v) => !v)}
          className={`w-11 h-11 rounded-full backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex items-center justify-center transition ${
            sceneOpen ? "bg-white text-[hsl(220_25%_10%)]" : "bg-white/[0.06] text-white/90 hover:bg-white/[0.12] hover:scale-105"
          }`}
          title="Scene settings"
        >
          <Settings2 className="w-4 h-4" />
        </button>
      </div>

      <SceneControls open={sceneOpen} onClose={() => setSceneOpen(false)} settings={scene} onChange={setScene} />

      {/* Top-left stack: vitals + gift */}
      <div className="absolute top-5 left-3 sm:left-5 z-30 flex flex-col gap-2 w-[260px] sm:w-[280px]">
        <StatsPanel stats={state.stats} affection={state.affection} tier={tier} affectionPulse={affectionPulse} pulseTrigger={fxTrigger} pulseDeltas={fxDeltas as any} />
        <button
          onClick={() => setGiftOpen(true)}
          className="h-11 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)] text-white/90 hover:bg-white/[0.12] transition flex items-center justify-center gap-2 text-[12px] font-semibold"
          title="Send a gift"
        >
          <Gift className="w-4 h-4" />
          Gifts
          <span className="text-[10px] text-white/45 tabular-nums ml-1 flex items-center gap-1">
            · {state.tokens_balance} 🪙
          </span>
        </button>
      </div>

      {/* Sound toggle — bottom-left */}
      <div className="absolute bottom-5 left-3 sm:left-5 z-30">
        <SfxToggle />
      </div>

      {/* Chat */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-6 z-20 w-[min(680px,calc(100%-2rem))]">
        <ChatComposer onAfterReply={refresh} onMouthLevel={setMouth} onSpeakingChange={setSpeaking} onReaction={handleReaction} />
      </div>

      <GiftDrawer open={giftOpen} onClose={() => setGiftOpen(false)} balance={state.tokens_balance} onPurchased={refresh} />
      <CallModal open={callOpen} onClose={() => { setCallOpen(false); refresh(); }} onMouthLevel={setMouth} onTick={refresh} />
    </div>
  );
};

export default Mina;
