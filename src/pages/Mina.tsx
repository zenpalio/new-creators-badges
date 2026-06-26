import { useState } from "react";
import { Phone, Gift, Settings2 } from "lucide-react";
import { useCompanion, tierFromAffection, type MoodStats } from "@/hooks/useCompanion";
import Live2DStage from "@/components/mina/Live2DStage";
import ChatComposer, { type Reaction, type Sentiment } from "@/components/mina/ChatComposer";
import GiftDrawer from "@/components/mina/GiftDrawer";
import CallModal from "@/components/mina/CallModal";
import SceneControls, { BACKGROUNDS, MODELS, type SceneSettings } from "@/components/mina/SceneControls";
import StatsPanel from "@/components/mina/StatsPanel";
import ReactionFX from "@/components/mina/ReactionFX";

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
  });
  const { state, refresh, patch, nudgeStats } = useCompanion("mina");
  const tier = tierFromAffection(state.affection);
  const bg = BACKGROUNDS.find((b) => b.id === scene.backgroundId) ?? BACKGROUNDS[0];
  const model = MODELS.find((m) => m.id === scene.modelId) ?? MODELS[0];

  // Reaction FX
  const [fxTrigger, setFxTrigger] = useState(0);
  const [fxSentiment, setFxSentiment] = useState<Sentiment>("neutral");
  const [affectionPulse, setAffectionPulse] = useState<"up" | "down" | null>(null);

  const handleReaction = (r: Reaction) => {
    const d = r.deltas ?? {};
    const stat: Partial<MoodStats> = {};
    (["joy", "arousal", "comfort", "calm", "energy", "hunger"] as (keyof MoodStats)[]).forEach((k) => {
      if (typeof (d as any)[k] === "number") stat[k] = (d as any)[k];
    });
    if (Object.keys(stat).length) nudgeStats(stat);
    if (typeof d.affection === "number" && d.affection !== 0) {
      const next = Math.max(0, Math.min(100, state.affection + d.affection));
      patch({ affection: next });
      setAffectionPulse(d.affection > 0 ? "up" : "down");
      window.setTimeout(() => setAffectionPulse(null), 900);
    }
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
      <Live2DStage
        mouthOpen={mouth}
        speaking={speaking}
        rotation={scene.rotation}
        scale={scene.scale}
        mirror={scene.mirror}
        modelUrl={model.url}
        debug
      />

      {/* Top-right glass control cluster */}
      <div className="absolute top-5 right-5 z-30 flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-3 px-4 h-11 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-white/50">Mina</span>
            <span className="text-xs font-medium text-white capitalize">· {tier}</span>
          </div>
          <div className="w-px h-4 bg-white/15" />
          <div className="flex items-center gap-1.5">
            <div className="w-16 h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-white/80 to-white/40 transition-all duration-500"
                style={{ width: `${state.affection}%` }}
              />
            </div>
            <span className="text-[10px] text-white/40 tabular-nums">{state.affection}</span>
          </div>
        </div>

        <button
          onClick={() => setCallOpen(true)}
          className="w-11 h-11 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex items-center justify-center text-white/90 hover:bg-white/[0.12] hover:scale-105 transition"
          title="Call Mina"
        >
          <Phone className="w-4 h-4" />
        </button>
        <button
          onClick={() => setGiftOpen(true)}
          className="w-11 h-11 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex items-center justify-center text-white/90 hover:bg-white/[0.12] hover:scale-105 transition"
          title="Send a gift"
        >
          <Gift className="w-4 h-4" />
        </button>
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
      <StatsPanel stats={state.stats} />

      {/* Chat */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-6 z-20 w-[min(680px,calc(100%-2rem))]">
        <ChatComposer onAfterReply={refresh} onMouthLevel={setMouth} onSpeakingChange={setSpeaking} />
      </div>

      <GiftDrawer open={giftOpen} onClose={() => setGiftOpen(false)} balance={state.tokens_balance} onPurchased={refresh} />
      <CallModal open={callOpen} onClose={() => { setCallOpen(false); refresh(); }} onMouthLevel={setMouth} onTick={refresh} />
    </div>
  );
};

export default Mina;
