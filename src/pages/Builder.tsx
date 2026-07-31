import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { BUILDER_IDLE_VIDEO, BUILDER_STEPS } from "../data/builderOptions";

const CTA_URL = "https://mybabes.ai/babes/create";

const GLASS =
  "border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.35)]";

export default function Builder() {
  const [partIdx, setPartIdx] = useState(0);
  const [choices, setChoices] = useState<Record<string, string>>({});

  const part = BUILDER_STEPS[partIdx];
  const selectedId = choices[part.id];
  const done = BUILDER_STEPS.filter((s) => choices[s.id]).length;

  const previewOption =
    part.options.find((o) => o.id === selectedId) ??
    BUILDER_STEPS.map((s) => s.options.find((o) => o.id === choices[s.id])).filter(Boolean).pop() ??
    part.options[0];

  return (
    <div className="relative min-h-svh w-full overflow-hidden bg-[hsl(0_0%_0%)] font-onest text-foreground-v2">
      {/* Character preview: full-bleed on mobile, contained card on desktop */}
      <div className="fixed inset-0 md:inset-y-6 md:left-1/2 md:w-[420px] md:-translate-x-[calc(100%+1rem)] md:overflow-hidden md:rounded-3xl">
        <img src={previewOption.poster} alt="" className="h-full w-full object-cover" />
        <video
          key={previewOption.videoUrl || BUILDER_IDLE_VIDEO}
          src={previewOption.videoUrl || BUILDER_IDLE_VIDEO}
          poster={previewOption.poster}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/80" />
      </div>


      <div className="relative mx-auto flex min-h-svh w-full max-w-md flex-col px-3 pb-4 pt-3 md:max-w-[420px] md:pb-8">
        <div className="flex-1" />

        {/* Bottom glass sheet with parts + options */}
        <section className={`rounded-3xl p-3 ${GLASS}`}>
          <nav className="-mx-1 mb-3 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max gap-2">
              {BUILDER_STEPS.map((s, i) => {
                const active = i === partIdx;
                const picked = !!choices[s.id];
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setPartIdx(i)}
                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                      active
                        ? "border border-white/50 bg-white/25 text-white"
                        : "border border-white/15 bg-white/10 text-white/70"
                    }`}
                  >
                    {s.title}
                    {picked && <Check className="h-3 w-3 text-primary-v2" strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="mb-2 flex items-baseline justify-between gap-2">
            <p className="text-sm font-semibold text-white">{part.title}</p>
            <p className="truncate text-[11px] text-white/60">{part.subtitle}</p>
          </div>


          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {part.options.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setChoices((c) => ({ ...c, [part.id]: o.id }))}
                aria-pressed={selectedId === o.id}
                className={`relative w-[88px] shrink-0 overflow-hidden rounded-2xl border transition-all ${
                  selectedId === o.id
                    ? "border-primary-v2 ring-2 ring-primary-v2/60"
                    : "border-white/25 hover:border-white/50"
                }`}
              >
                <div className="relative aspect-[3/4] w-full bg-white/10">
                  <img
                    src={o.poster}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 block px-1.5 pb-1.5 text-left text-[11px] font-medium text-white">
                    {o.label}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPartIdx((i) => Math.min(BUILDER_STEPS.length - 1, i + 1))}
              disabled={partIdx === BUILDER_STEPS.length - 1}
              className="rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-xl transition-colors disabled:opacity-30"
            >
              Next
            </button>
            <a
              href={CTA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary-v2 px-5 py-2.5 text-sm font-semibold text-primary-v2-foreground transition-transform active:scale-[0.98] ${
                done === BUILDER_STEPS.length ? "" : "pointer-events-none opacity-40"
              }`}
            >
              Bring her to life
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
