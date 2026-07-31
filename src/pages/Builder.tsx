import { useState } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { BUILDER_STEPS } from "../data/builderOptions";

const CTA_URL = "https://mybabes.ai/babes/create";

export default function Builder() {
  const [partIdx, setPartIdx] = useState(0);
  const [choices, setChoices] = useState<Record<string, string>>({});

  const part = BUILDER_STEPS[partIdx];
  const selectedId = choices[part.id];
  const done = BUILDER_STEPS.filter((s) => choices[s.id]).length;

  // Center preview = the most recently picked option, else the current part's first option
  const previewOption =
    part.options.find((o) => o.id === selectedId) ??
    BUILDER_STEPS.map((s) => s.options.find((o) => o.id === choices[s.id])).filter(Boolean).pop() ??
    part.options[0];

  return (
    <div className="min-h-svh w-full bg-background-v2 font-onest text-foreground-v2">
      <div className="mx-auto w-full max-w-6xl px-3 py-4 md:px-6 md:py-6">
        <header className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary-v2" />
            <h1 className="text-base font-semibold md:text-lg">Character builder</h1>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground-v2/50">
            {done}/{BUILDER_STEPS.length} set
          </span>
        </header>

        <div className="grid gap-3 md:grid-cols-[190px_minmax(0,1fr)_260px]">
          {/* Parts list (left panel) */}
          <aside className="rounded-2xl border border-white/10 bg-grey-dark-1-v2/60 p-2">
            <p className="px-2 pb-2 pt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground-v2/40">
              Parts
            </p>
            <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
              {BUILDER_STEPS.map((s, i) => {
                const active = i === partIdx;
                const picked = choices[s.id];
                const pickedLabel = s.options.find((o) => o.id === picked)?.label;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setPartIdx(i)}
                    className={`flex min-w-[130px] items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors md:min-w-0 ${
                      active
                        ? "bg-primary-v2/15 text-foreground-v2 ring-1 ring-primary-v2/50"
                        : "text-foreground-v2/60 hover:bg-white/5"
                    }`}
                  >
                    <span className="truncate">
                      <span className="block font-medium">{s.title}</span>
                      <span className="block truncate text-[11px] text-foreground-v2/40">
                        {pickedLabel ?? "—"}
                      </span>
                    </span>
                    {picked && <Check className="h-3.5 w-3.5 shrink-0 text-primary-v2" strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Center preview */}
          <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-grey-dark-1-v2">
            <div className="relative aspect-[13/19] w-full md:aspect-auto md:h-[560px]">
              <img
                src={previewOption.poster}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              {previewOption.videoUrl && (
                <video
                  src={previewOption.videoUrl}
                  poster={previewOption.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-1.5 p-3">
                {BUILDER_STEPS.map((s) => {
                  const label = s.options.find((o) => o.id === choices[s.id])?.label;
                  if (!label) return null;
                  return (
                    <span
                      key={s.id}
                      className="rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[11px] text-white backdrop-blur-sm"
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Options grid (right panel) */}
          <aside className="rounded-2xl border border-white/10 bg-grey-dark-1-v2/60 p-3">
            <p className="pb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground-v2/40">
              {part.title}
            </p>
            <div className="grid grid-cols-3 gap-2 md:grid-cols-2">
              {part.options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setChoices((c) => ({ ...c, [part.id]: o.id }))}
                  aria-pressed={selectedId === o.id}
                  className={`group relative overflow-hidden rounded-xl border transition-all ${
                    selectedId === o.id
                      ? "border-primary-v2 ring-2 ring-primary-v2/60"
                      : "border-white/10 hover:border-white/25"
                  }`}
                >
                  <div className="relative aspect-square w-full">
                    <img
                      src={o.poster}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 to-transparent" />
                    <span className="absolute inset-x-0 bottom-0 block px-2 pb-1.5 text-left text-[11px] font-medium text-white">
                      {o.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <a
              href={CTA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-v2 px-5 py-2.5 text-sm font-semibold text-primary-v2-foreground transition-transform hover:scale-[1.02] ${
                done === BUILDER_STEPS.length ? "" : "pointer-events-none opacity-30"
              }`}
            >
              Bring her to life
              <ArrowRight className="h-4 w-4" />
            </a>
          </aside>
        </div>
      </div>
    </div>
  );
}
