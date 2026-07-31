import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import OptionVideoCard from "../components/builder/OptionVideoCard";
import { BUILDER_STEPS } from "../data/builderOptions";

const CTA_URL = "https://mybabes.ai/babes/create";

export default function Builder() {
  const [stepIdx, setStepIdx] = useState(0);
  const [choices, setChoices] = useState<Record<string, string>>({});

  const step = BUILDER_STEPS[stepIdx];
  const isLast = stepIdx === BUILDER_STEPS.length - 1;
  const selected = choices[step.id];
  const progress = useMemo(
    () => ((stepIdx + (selected ? 1 : 0)) / BUILDER_STEPS.length) * 100,
    [stepIdx, selected],
  );

  const pick = (optionId: string) => {
    setChoices((c) => ({ ...c, [step.id]: optionId }));
    if (!isLast) setTimeout(() => setStepIdx((i) => i + 1), 220);
  };

  const summary = BUILDER_STEPS.map((s) => {
    const id = choices[s.id];
    return id ? s.options.find((o) => o.id === id)?.label : null;
  }).filter(Boolean) as string[];

  return (
    <div className="min-h-svh w-full bg-background-v2 font-onest text-foreground-v2">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pb-28 pt-8">
        <header className="flex flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary-v2/40 bg-primary-v2/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/90">
            <Sparkles className="h-3 w-3 text-primary-v2" />
            Step {stepIdx + 1} of {BUILDER_STEPS.length}
          </span>
          <h1 className="text-2xl font-semibold leading-tight md:text-3xl">{step.title}</h1>
          <p className="text-sm text-foreground-v2/60">{step.subtitle}</p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-primary-v2 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </header>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {step.options.map((o) => (
            <OptionVideoCard
              key={o.id}
              option={o}
              selected={selected === o.id}
              onSelect={() => pick(o.id)}
            />
          ))}
        </section>

        {summary.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {summary.map((label) => (
              <span
                key={label}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-foreground-v2/80"
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-white/10 bg-background-v2/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
            disabled={stepIdx === 0}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-foreground-v2/70 transition-colors hover:text-foreground-v2 disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {isLast && selected ? (
            <a
              href={CTA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary-v2 px-6 py-2.5 text-sm font-semibold text-primary-v2-foreground transition-transform hover:scale-[1.02]"
            >
              Bring her to life
              <ArrowRight className="h-4 w-4" />
            </a>
          ) : (
            <button
              type="button"
              onClick={() => setStepIdx((i) => Math.min(BUILDER_STEPS.length - 1, i + 1))}
              disabled={!selected}
              className="inline-flex items-center gap-2 rounded-full bg-primary-v2 px-6 py-2.5 text-sm font-semibold text-primary-v2-foreground transition-transform hover:scale-[1.02] disabled:opacity-30"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
