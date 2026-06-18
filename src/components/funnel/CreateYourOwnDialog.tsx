import { Check } from "lucide-react";
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
  "Generate AI images of her",
  "Chat instantly when done",
];

export default function CreateYourOwnDialog({
  open,
  onClose,
  imageUrl,
  accent,
  ctaUrl = "https://mybabes.ai/create",
}: Props) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="z-[120] flex h-[100dvh] w-screen max-w-none flex-col gap-0 overflow-hidden rounded-none border-0 bg-[#0a0a0a] p-0 text-white left-0 top-0 translate-x-0 translate-y-0 data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100 sm:left-[50%] sm:top-[50%] sm:h-auto sm:max-h-[90vh] sm:w-[calc(100%-32px)] sm:max-w-[920px] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:flex-row sm:rounded-[32px] sm:border sm:border-white/10"
      >
        {/* Image — clean, no overlays */}
        <div className="relative aspect-square w-full min-h-[260px] shrink-0 overflow-hidden sm:aspect-auto sm:w-[45%]">
          <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>

        {/* Content */}
        <div className="flex w-full flex-col justify-center bg-[#111111] p-8 sm:w-[55%] sm:p-12">
          <div className="mb-8">
            <h2
              className="mb-4 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl"
              style={{ fontFamily: "'Outfit', Inter, ui-sans-serif, system-ui, sans-serif" }}
            >
              Create your own babe
            </h2>
            <p className="text-base leading-relaxed text-neutral-400 sm:text-lg">
              Don't see your perfect match? Build her from scratch — looks, personality, and story.
            </p>
          </div>

          <ul className="mb-10 space-y-4">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-3">
                <span
                  className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: accent }}
                  aria-hidden
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={4} />
                </span>
                <span className="font-medium text-neutral-200">{b}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-4">
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-2xl px-8 py-4 font-bold text-white shadow-lg shadow-pink-500/10 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: accent }}
            >
              Start creating — free
            </a>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-sm font-semibold tracking-wide text-neutral-500 transition-colors hover:text-white"
            >
              MAYBE LATER
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
