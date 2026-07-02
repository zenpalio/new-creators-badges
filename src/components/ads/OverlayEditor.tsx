import { Plus, Trash2 } from "lucide-react";
import type { Caption, Headline } from "../../lib/adsStudio/ffmpegClient";

interface Props {
  headline: Headline | null;
  captions: Caption[];
  onHeadline: (h: Headline | null) => void;
  onCaptions: (c: Caption[]) => void;
}

const OverlayEditor = ({ headline, captions, onHeadline, onCaptions }: Props) => {
  const addCaption = () =>
    onCaptions([
      ...captions,
      { text: "", start: 0, end: 3, position: "bottom" },
    ]);
  const updateCaption = (i: number, patch: Partial<Caption>) =>
    onCaptions(captions.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  const removeCaption = (i: number) =>
    onCaptions(captions.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      {/* Headline */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-medium uppercase tracking-wide text-white/60">
            Headline
          </label>
          {headline && (
            <button
              onClick={() => onHeadline(null)}
              className="text-xs text-white/50 hover:text-white"
            >
              Remove
            </button>
          )}
        </div>
        {headline ? (
          <div className="space-y-2">
            <input
              value={headline.text}
              onChange={(e) => onHeadline({ ...headline, text: e.target.value })}
              placeholder="Your headline"
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white placeholder:text-white/30 focus:border-primary-v2 focus:outline-none"
            />
            <div className="flex gap-2">
              {(["top", "bottom"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => onHeadline({ ...headline, position: p })}
                  className={`flex-1 rounded-lg border px-3 py-1.5 text-sm capitalize ${
                    headline.position === p
                      ? "border-primary-v2 bg-primary-v2/10 text-white"
                      : "border-white/10 bg-black/40 text-white/70"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={() => onHeadline({ text: "", position: "bottom" })}
            className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-white/15 px-3 py-2 text-sm text-white/70 hover:border-white/30 hover:text-white"
          >
            <Plus className="h-3.5 w-3.5" /> Add headline
          </button>
        )}
      </div>

      {/* Captions */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-medium uppercase tracking-wide text-white/60">
            Timed captions
          </label>
          <button
            onClick={addCaption}
            className="inline-flex items-center gap-1 text-xs text-primary-v2 hover:opacity-80"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
        {captions.length === 0 && (
          <div className="text-xs text-white/40">No captions yet.</div>
        )}
        <div className="space-y-2">
          {captions.map((c, i) => (
            <div key={i} className="rounded-lg border border-white/10 bg-black/40 p-2">
              <div className="flex items-start gap-2">
                <input
                  value={c.text}
                  onChange={(e) => updateCaption(i, { text: e.target.value })}
                  placeholder="Caption text"
                  className="flex-1 rounded border border-white/10 bg-black/40 px-2 py-1.5 text-sm text-white placeholder:text-white/30 focus:border-primary-v2 focus:outline-none"
                />
                <button
                  onClick={() => removeCaption(i)}
                  className="rounded p-1 text-white/50 hover:bg-white/10 hover:text-white"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <label className="text-xs text-white/50">Start</label>
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  value={c.start}
                  onChange={(e) => updateCaption(i, { start: parseFloat(e.target.value) || 0 })}
                  className="w-16 rounded border border-white/10 bg-black/40 px-2 py-1 text-sm text-white focus:border-primary-v2 focus:outline-none"
                />
                <label className="text-xs text-white/50">End</label>
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  value={c.end}
                  onChange={(e) => updateCaption(i, { end: parseFloat(e.target.value) || 0 })}
                  className="w-16 rounded border border-white/10 bg-black/40 px-2 py-1 text-sm text-white focus:border-primary-v2 focus:outline-none"
                />
                <select
                  value={c.position}
                  onChange={(e) => updateCaption(i, { position: e.target.value as Caption["position"] })}
                  className="ml-auto rounded border border-white/10 bg-black/40 px-2 py-1 text-sm text-white focus:border-primary-v2 focus:outline-none"
                >
                  <option value="top">Top</option>
                  <option value="middle">Middle</option>
                  <option value="bottom">Bottom</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverlayEditor;
