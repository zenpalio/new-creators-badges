import { Check } from "lucide-react";
import type { BuilderOption } from "../../data/builderOptions";

interface Props {
  option: BuilderOption;
  selected: boolean;
  onSelect: () => void;
}

export default function OptionVideoCard({ option, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group relative block w-full overflow-hidden rounded-2xl border transition-all ${
        selected
          ? "border-primary-v2 ring-2 ring-primary-v2/60"
          : "border-white/10 hover:border-white/25"
      }`}
    >
      <div className="relative aspect-[13/19] w-full bg-grey-dark-1-v2">
        <img
          src={option.poster}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {option.videoUrl && (
          <video
            src={option.videoUrl}
            poster={option.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 to-transparent" />

        {selected && (
          <span className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-v2 text-primary-v2-foreground">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
        )}

        <span className="absolute inset-x-0 bottom-0 block p-3 text-left text-sm font-semibold text-white drop-shadow">
          {option.label}
        </span>
      </div>
    </button>
  );
}
