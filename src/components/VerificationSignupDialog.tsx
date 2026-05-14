import { MousePointerClick, ScanFace, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: MousePointerClick,
    title: "Click verify",
    desc: "You'll be redirected to our trusted verification partner.",
  },
  {
    icon: ScanFace,
    title: "Finish verification",
    desc: "Complete the quick check on the partner's secure site.",
  },
  {
    icon: CheckCircle2,
    title: "Get verified",
    desc: "You'll be redirected back to MyBabes and can start exploring right away.",
  },
];

type Props = { open: boolean; onClose: () => void };

const VerificationSignupDialog = ({ open, onClose }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-neutral-800/95 shadow-2xl">
        <div className="p-6 sm:p-7">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-7 items-center justify-center rounded-md border border-white/15 bg-white/5 px-2 text-[11px] font-bold tracking-wide text-white/90">
              18+
            </span>
            <h2 className="flex-1 text-lg font-semibold tracking-tight text-foreground">
              Age verification
            </h2>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Sign up and complete a quick age verification with our trusted
            third-party partner. We never store or see your ID — verification
            is handled entirely by them.
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
              const av = (window as any).ageverif;
              if (av && typeof av.start === "function") {
                av.start();
              } else {
                console.warn(
                  "[AgeVerif] window.ageverif is undefined — script likely blocked. " +
                  "Live key only works on the configured domain. Use the Public Test Key for previews."
                );
              }
            }}
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black shadow-lg ring-1 ring-white/20 transition-colors hover:bg-white/90"
          >
            Sign up & verify
          </button>
          <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground">
            Verification is handled by an independent third-party provider. We
            never store your ID or biometric data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationSignupDialog;
