import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import type { IntroConfig, IntroTheme } from "../../lib/adsStudio/introFrames";

interface Props {
  value: IntroConfig;
  onChange: (v: IntroConfig) => void;
}

const IntroConfigPanel = ({ value, onChange }: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () =>
      onChange({ ...value, backgroundImage: reader.result as string });
    reader.readAsDataURL(f);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-white/60">
          Roleplay name
        </label>
        <input
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          placeholder="Anna's Diary"
          className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white placeholder:text-white/30 focus:border-primary-v2 focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-white/60">
          Subtitle
        </label>
        <input
          value={value.subtitle}
          onChange={(e) => onChange({ ...value, subtitle: e.target.value })}
          placeholder="A POV Roleplay"
          className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white placeholder:text-white/30 focus:border-primary-v2 focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-white/60">
          Background image
        </label>
        {value.backgroundImage ? (
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 p-2">
            <img
              src={value.backgroundImage}
              alt="Intro background"
              className="h-12 w-12 rounded object-cover"
            />
            <div className="flex-1 text-xs text-white/60">
              Image loaded — used as intro background with dark vignette.
            </div>
            <button
              onClick={() => onChange({ ...value, backgroundImage: null })}
              className="rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white"
              aria-label="Remove background"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 px-3 py-2.5 text-sm text-white/70 hover:border-white/30 hover:text-white"
          >
            <ImagePlus className="h-4 w-4" />
            Upload background image
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-white/60">
          Theme
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["anna", "neon", "minimal"] as IntroTheme[]).map((t) => (
            <button
              key={t}
              onClick={() => onChange({ ...value, theme: t })}
              className={`rounded-lg border px-3 py-2 text-sm capitalize ${
                value.theme === t
                  ? "border-primary-v2 bg-primary-v2/10 text-white"
                  : "border-white/10 bg-black/40 text-white/70 hover:border-white/20"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntroConfigPanel;
