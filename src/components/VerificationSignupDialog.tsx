import { MousePointerClick, ScanFace, CheckCircle2, ShieldCheck, X } from "lucide-react";

const steps = [
  {
    icon: MousePointerClick,
    title: "Start verification",
    desc: "We'll hand you off to our independent identity partner.",
  },
  {
    icon: ScanFace,
    title: "Scan your ID & selfie",
    desc: "A government ID and a quick liveness selfie. Takes ~1 minute.",
  },
  {
    icon: CheckCircle2,
    title: "Get verified",
    desc: "You're returned to MyBabes age-verified — no ID stored on our side.",
  },
];

type Props = { open: boolean; onClose: () => void };

const VerificationSignupDialog = ({ open, onClose }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-stretch justify-center sm:items-center sm:px-4 sm:py-6">
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative flex w-full flex-col bg-neutral-800/95 shadow-2xl sm:h-auto sm:max-w-md sm:rounded-2xl sm:border sm:border-white/10">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex-1 overflow-y-auto p-6 sm:p-7">
          <div className="flex items-center gap-3 pr-10">
            <span className="inline-flex h-7 items-center justify-center rounded-md border border-white/15 bg-white/5 px-2 text-[11px] font-bold tracking-wide text-white/90">
              18+
            </span>
            <h2 className="flex-1 text-lg font-semibold tracking-tight text-foreground">
              Age verification
            </h2>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            We use a trusted, independent identity provider to confirm you're 18+.
            MyBabes never sees or stores your ID.
          </p>

          <ol className="mt-5 space-y-2">
            {steps.map((s, i) => (
              <li
                key={s.title}
                className="flex gap-3 rounded-xl border border-white/15 bg-background/40 p-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <s.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    <span className="text-muted-foreground">{i + 1}. </span>
                    {s.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {s.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <button
            type="button"
            onClick={() => {
              const returnTo = `${window.location.pathname}${window.location.search}`;
              window.location.assign(
                `/yoti-verification?returnTo=${encodeURIComponent(returnTo)}`
              );
            }}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg ring-1 ring-white/10 transition-colors hover:bg-primary/90"
          >
            Start verification
          </button>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <span>We never store your ID or biometric data.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationSignupDialog;
