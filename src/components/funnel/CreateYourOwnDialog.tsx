import { Check, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

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
  "Generate spicy AI images of her",
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
        className="z-[120] flex h-[100dvh] w-screen max-w-none flex-col gap-0 overflow-hidden rounded-none border-0 bg-card-v2 p-0 text-foreground-v2 left-0 top-0 translate-x-0 translate-y-0 data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100 sm:left-[50%] sm:top-[50%] sm:h-auto sm:max-h-[90vh] sm:w-[calc(100%-32px)] sm:max-w-[760px] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:flex-row sm:rounded-2xl sm:border sm:border-border-v2/60"
      >
        {/* Image — top on mobile, left on desktop */}
        <div className="relative h-56 w-full shrink-0 overflow-hidden sm:h-auto sm:w-[44%]">
          <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card-v2 via-card-v2/30 to-transparent sm:bg-gradient-to-r" />
          <div
            className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-md"
            style={{ background: accent }}
          >
            <Sparkles className="h-3 w-3" /> Free to try
          </div>
        </div>

        {/* Content — bottom on mobile, right on desktop */}
        <div className="scrollbar-themed flex-1 overflow-y-auto px-5 pb-6 pt-5 sm:px-7 sm:py-7">
          <DialogHeader className="space-y-3 text-left">
            <div className="flex items-center gap-2 text-[11px] font-medium">
              <span className="rounded-full bg-primary-v2/15 px-2 py-0.5 text-primary-v2">New</span>
              <span className="text-muted-v2-foreground">100% free</span>
            </div>
            <DialogTitle className="text-2xl font-extrabold leading-tight tracking-tight text-foreground-v2 sm:text-[26px]">
              Create your own babe
            </DialogTitle>
            <DialogDescription className="text-[15px] leading-relaxed text-muted-v2-foreground">
              Don't see your perfect match? Build her from scratch — looks, personality, voice, and story. Generate spicy AI images of her. All free.
            </DialogDescription>
          </DialogHeader>

          <ul className="mt-5 space-y-2">
            {BENEFITS.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 rounded-xl border border-border-v2/40 bg-background-v2/40 p-3 text-sm leading-snug text-foreground-v2"
              >
                <span
                  className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white"
                  style={{ background: accent }}
                >
                  <Check className="h-3 w-3" />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-v2 px-5 py-3 text-sm font-semibold text-primary-v2-foreground transition-opacity hover:opacity-90"
          >
            <Sparkles className="h-4 w-4" />
            Start creating — free
          </a>
          <button
            type="button"
            onClick={onClose}
            className="mt-2 block w-full text-center text-xs text-muted-v2-foreground hover:text-foreground-v2"
          >
            Maybe later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
