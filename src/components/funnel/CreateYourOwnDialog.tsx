import { Check, Sparkles, X } from "lucide-react";
import { Dialog, DialogContent } from "../ui/dialog";

interface Props {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  accent: string;
  ctaUrl?: string;
}

const BENEFITS = [
  "Design looks, body & style",
  "Write personality and backstory",
  "Add voice and visuals",
  "Chat instantly when done",
];

export default function CreateYourOwnDialog({ open, onClose, imageUrl, accent, ctaUrl = "https://mybabes.ai/create" }: Props) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-md overflow-hidden border-white/10 bg-grey-dark-1-v2 p-0 text-white sm:rounded-3xl"
        showCloseButton={false}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-20 rounded-full bg-black/50 p-1.5 text-white/80 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative h-56 w-full overflow-hidden">
          <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-grey-dark-1-v2 via-grey-dark-1-v2/40 to-transparent" />
          <div
            className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-md"
            style={{ background: `linear-gradient(90deg, ${accent}, hsl(280 80% 60%))` }}
          >
            <Sparkles className="h-3 w-3" /> New
          </div>
        </div>

        <div className="space-y-4 p-5 pt-2">
          <div>
            <h2 className="text-xl font-semibold leading-tight">Create your own babe</h2>
            <p className="mt-1 text-sm text-white/70">
              Don't see your perfect match? Build her from scratch — looks, personality, voice and story. Yours, forever.
            </p>
          </div>

          <ul className="space-y-2">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-white/85">
                <span
                  className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                  style={{ background: accent }}
                >
                  <Check className="h-2.5 w-2.5 text-white" />
                </span>
                {b}
              </li>
            ))}
          </ul>

          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02]"
            style={{ background: `linear-gradient(90deg, ${accent}, hsl(280 80% 60%))` }}
          >
            <Sparkles className="h-4 w-4" />
            Start creating
          </a>
          <button
            type="button"
            onClick={onClose}
            className="block w-full text-center text-xs text-white/50 hover:text-white/80"
          >
            Maybe later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
