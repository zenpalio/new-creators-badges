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
        className="z-[120] flex h-[100dvh] w-screen max-w-none flex-col gap-0 overflow-hidden rounded-none border-0 bg-[#0a0a0a] p-0 text-white left-0 top-0 translate-x-0 translate-y-0 data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100 sm:left-[50%] sm:top-[50%] sm:h-auto sm:max-h-[88vh] sm:w-[calc(100%-32px)] sm:max-w-[640px] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:flex-row sm:rounded-2xl sm:border sm:border-white/10"
      >
        {/* Image — clean, no overlays */}
        <div className="relative aspect-square w-full min-h-[220px] shrink-0 overflow-hidden sm:aspect-auto sm:w-[42%]">
          <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>

        {/* Content */}
        <div className="flex w-full flex-col justify-center bg-[#111111] p-6 sm:w-[58%] sm:p-7">
          <div className="mb-5">
            <h2
              className="mb-2 text-xl font-bold leading-tight tracking-tight text-white sm:text-2xl"
              style={{ fontFamily: "'Outfit', Inter, ui-sans-serif, system-ui, sans-serif" }}
            >
              Create your own babe
            </h2>
            <p className="text-sm leading-relaxed text-neutral-400">
              Don't see your perfect match? Build her from scratch — looks, personality, and story.
            </p>
          </div>

          <ul className="mb-6 space-y-2.5">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-2">
                <span
                  className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-v2 text-primary-v2-foreground"
                  aria-hidden
                >
                  <Check className="h-2.5 w-2.5" strokeWidth={4} />
                </span>
                <span className="text-[13px] font-medium text-neutral-200">{b}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2">
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-xl bg-primary-v2 px-6 py-3 text-sm font-semibold text-primary-v2-foreground transition-transform hover:scale-[1.01] active:scale-[0.98]"
            >
              Start creating — free
            </a>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-1.5 text-xs font-semibold tracking-wide text-neutral-500 transition-colors hover:text-white"
            >
              MAYBE LATER
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
