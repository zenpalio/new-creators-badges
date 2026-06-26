import { X, RotateCcw, FlipHorizontal2, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { isSfxEnabled, setSfxEnabled } from "./reactionSounds";
import bgApartment from "@/assets/bg-apartment.jpg";
import bgPark from "@/assets/bg-park.jpg";
import bgBedroom from "@/assets/bg-bedroom.jpg";
import bgBeach from "@/assets/bg-beach.jpg";
import bgCity from "@/assets/bg-city.jpg";
import bgCafe from "@/assets/bg-cafe.jpg";

export type RendererKind = "live2d" | "vrm";

export interface SceneSettings {
  rotation: number;
  scale: number;
  mirror: boolean;
  backgroundId: string;
  modelId: string;
  renderer: RendererKind;
}

export interface ModelOption {
  id: string;
  label: string;
  url: string;
  note?: string;
}

const SAMPLE = "https://cdn.jsdelivr.net/gh/Live2D/CubismWebSamples@master/Samples/Resources";
export const MODELS: ModelOption[] = [
  { id: "hiyori", label: "Mina", url: `${SAMPLE}/Hiyori/Hiyori.model3.json`, note: "Lip-sync + body motions" },
];

export interface BackgroundOption {
  id: string;
  label: string;
  /** CSS background value (gradients) */
  css?: string;
  /** Image URL — when set, rendered as cover image */
  image?: string;
  /** Swatch for picker */
  swatch: string;
}

export const BACKGROUNDS: BackgroundOption[] = [
  { id: "apartment", label: "Flat", image: bgApartment, swatch: `center/cover url(${bgApartment})` },
  { id: "park", label: "Park", image: bgPark, swatch: `center/cover url(${bgPark})` },
  { id: "bedroom", label: "Bedroom", image: bgBedroom, swatch: `center/cover url(${bgBedroom})` },
  { id: "cafe", label: "Café", image: bgCafe, swatch: `center/cover url(${bgCafe})` },
  { id: "beach", label: "Beach", image: bgBeach, swatch: `center/cover url(${bgBeach})` },
  { id: "city", label: "City", image: bgCity, swatch: `center/cover url(${bgCity})` },
  {
    id: "midnight",
    label: "Midnight",
    css: "radial-gradient(circle at 50% 30%, hsl(230 60% 25% / 0.6), transparent 65%), radial-gradient(circle at 50% 100%, hsl(260 50% 20% / 0.55), transparent 60%), linear-gradient(to bottom, hsl(225 25% 8%), hsl(220 25% 5%))",
    swatch: "linear-gradient(135deg, hsl(230 60% 25%), hsl(220 25% 5%))",
  },
  {
    id: "neon",
    label: "Neon",
    css: "radial-gradient(circle at 30% 30%, hsl(280 80% 35% / 0.5), transparent 60%), radial-gradient(circle at 70% 70%, hsl(190 80% 30% / 0.5), transparent 60%), linear-gradient(to bottom, hsl(250 30% 6%), hsl(220 30% 4%))",
    swatch: "linear-gradient(135deg, hsl(280 80% 50%), hsl(190 80% 45%))",
  },
  {
    id: "void",
    label: "Void",
    css: "linear-gradient(to bottom, hsl(0 0% 4%), hsl(0 0% 0%))",
    swatch: "linear-gradient(135deg, hsl(0 0% 15%), hsl(0 0% 0%))",
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
  settings: SceneSettings;
  onChange: (s: SceneSettings) => void;
}

const SceneControls = ({ open, onClose, settings, onChange }: Props) => {
  const [sfx, setSfx] = useState(isSfxEnabled());
  useEffect(() => {
    const onChangeSfx = (e: Event) => {
      const detail = (e as CustomEvent<{ enabled: boolean }>).detail;
      if (detail) setSfx(detail.enabled);
    };
    window.addEventListener("mina:sfx-changed", onChangeSfx);
    return () => window.removeEventListener("mina:sfx-changed", onChangeSfx);
  }, []);
  if (!open) return null;
  const update = (patch: Partial<SceneSettings>) => onChange({ ...settings, ...patch });
  const toggleSfx = () => { const n = !sfx; setSfx(n); setSfxEnabled(n); };

  return (
    <div className="absolute top-20 right-5 z-40 w-[300px] rounded-2xl bg-white/[0.07] backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-4 animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white/90">Scene</h3>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-white/60"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Rotation */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-white/60">Rotation</label>
          <span className="text-xs text-white/40 tabular-nums">{settings.rotation}°</span>
        </div>
        <input
          type="range"
          min={-180}
          max={180}
          step={1}
          value={settings.rotation}
          onChange={(e) => update({ rotation: Number(e.target.value) })}
          className="w-full accent-white"
        />
      </div>

      {/* Zoom */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-white/60">Zoom</label>
          <span className="text-xs text-white/40 tabular-nums">{settings.scale.toFixed(2)}×</span>
        </div>
        <input
          type="range"
          min={0.5}
          max={1.5}
          step={0.01}
          value={settings.scale}
          onChange={(e) => update({ scale: Number(e.target.value) })}
          className="w-full accent-white"
        />
      </div>

      {/* Quick actions */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => update({ rotation: 0, scale: 1, mirror: false })}
          className="flex-1 h-9 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs text-white/80 flex items-center justify-center gap-1.5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
        <button
          onClick={() => update({ mirror: !settings.mirror })}
          className={`flex-1 h-9 rounded-lg border border-white/10 text-xs flex items-center justify-center gap-1.5 transition ${
            settings.mirror ? "bg-white text-[hsl(220_25%_10%)]" : "bg-white/[0.06] hover:bg-white/[0.12] text-white/80"
          }`}
        >
          <FlipHorizontal2 className="w-3.5 h-3.5" /> Mirror
        </button>
        <button
          onClick={toggleSfx}
          title={sfx ? "Reaction sounds: on" : "Reaction sounds: off"}
          className={`flex-1 h-9 rounded-lg border border-white/10 text-xs flex items-center justify-center gap-1.5 transition ${
            sfx ? "bg-white/[0.06] hover:bg-white/[0.12] text-white/80" : "bg-white/[0.03] text-white/50"
          }`}
        >
          {sfx ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />} Audio
        </button>
      </div>

      {/* Renderer */}
      <div className="mb-4">
        <label className="text-xs text-white/60 mb-2 block">Renderer</label>
        <div className="grid grid-cols-2 gap-2">
          {(["live2d", "vrm"] as const).map((r) => {
            const active = settings.renderer === r;
            return (
              <button
                key={r}
                onClick={() => update({ renderer: r })}
                className={`h-9 rounded-lg border border-white/10 text-xs transition ${
                  active ? "bg-white text-[hsl(220_25%_10%)]" : "bg-white/[0.06] hover:bg-white/[0.12] text-white/80"
                }`}
              >
                {r === "live2d" ? "Live2D (2D)" : "VRM (3D)"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Backgrounds */}
      <div>
        <label className="text-xs text-white/60 mb-2 block">Background</label>
        <div className="grid grid-cols-3 gap-2">
          {BACKGROUNDS.map((bg) => {
            const active = settings.backgroundId === bg.id;
            return (
              <button
                key={bg.id}
                onClick={() => update({ backgroundId: bg.id })}
                className={`relative aspect-square rounded-lg overflow-hidden border transition ${
                  active ? "border-white ring-2 ring-white/30" : "border-white/10 hover:border-white/30"
                }`}
                style={{ background: bg.swatch }}
                title={bg.label}
              >
                <span className="absolute inset-x-0 bottom-0 text-[10px] text-white/90 bg-black/40 backdrop-blur-sm py-0.5">
                  {bg.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default SceneControls;
