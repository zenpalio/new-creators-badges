import { useState } from "react";
import { Phone, Gift, Settings2 } from "lucide-react";
import { useCompanion, tierFromAffection } from "@/hooks/useCompanion";
import Live2DStage from "@/components/mina/Live2DStage";
import ChatComposer from "@/components/mina/ChatComposer";
import GiftDrawer from "@/components/mina/GiftDrawer";
import CallModal from "@/components/mina/CallModal";
import SceneControls, { BACKGROUNDS, MODELS, type SceneSettings } from "@/components/mina/SceneControls";
import StatsPanel from "@/components/mina/StatsPanel";

const Mina = () => {
  const [mouth, setMouth] = useState(0);
  const [giftOpen, setGiftOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [sceneOpen, setSceneOpen] = useState(false);
  const [scene, setScene] = useState<SceneSettings>({
    rotation: 0,
    scale: 1,
    mirror: false,
    backgroundId: "midnight",
    modelId: "mao",
  });
  const { state, refresh } = useCompanion("mina");
  const tier = tierFromAffection(state.affection);
  const bg = BACKGROUNDS.find((b) => b.id === scene.backgroundId) ?? BACKGROUNDS[0];
  const model = MODELS.find((m) => m.id === scene.modelId) ?? MODELS[0];

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
        rotation={scene.rotation}
        scale={scene.scale}
        mirror={scene.mirror}
        modelUrl={model.url}
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
          <div className="w-px h-4 bg-white/15" />
          <span className="text-xs text-white/70 tabular-nums">{state.tokens_balance} <span className="text-white/40">tokens</span></span>
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

      {/* Chat */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-6 z-20 w-[min(680px,calc(100%-2rem))]">
        <ChatComposer onAfterReply={refresh} />
      </div>

      <GiftDrawer open={giftOpen} onClose={() => setGiftOpen(false)} balance={state.tokens_balance} onPurchased={refresh} />
      <CallModal open={callOpen} onClose={() => { setCallOpen(false); refresh(); }} onMouthLevel={setMouth} onTick={refresh} />
    </div>
  );
};

export default Mina;
