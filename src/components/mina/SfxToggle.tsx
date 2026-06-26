import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isSfxEnabled, setSfxEnabled } from "./reactionSounds";

const SfxToggle = () => {
  const [enabled, setEnabled] = useState(isSfxEnabled());

  useEffect(() => {
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<{ enabled: boolean }>).detail;
      if (detail) setEnabled(detail.enabled);
    };
    window.addEventListener("mina:sfx-changed", onChange);
    return () => window.removeEventListener("mina:sfx-changed", onChange);
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    setSfxEnabled(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={enabled ? "Mute reaction sounds" : "Enable reaction sounds"}
      title={enabled ? "Reaction sounds: on" : "Reaction sounds: off"}
      className="h-9 w-9 rounded-full border border-white/15 bg-white/[0.08] backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.4)] text-white/80 hover:bg-white/15 transition flex items-center justify-center"
    >
      {enabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-white/50" />}
    </button>
  );
};

export default SfxToggle;
