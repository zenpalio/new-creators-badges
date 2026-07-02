import type { IntroConfig, IntroTheme } from "../../lib/adsStudio/introFrames";

interface Props {
  value: IntroConfig;
  onChange: (v: IntroConfig) => void;
}

const IntroConfigPanel = ({ value, onChange }: Props) => (
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

export default IntroConfigPanel;
