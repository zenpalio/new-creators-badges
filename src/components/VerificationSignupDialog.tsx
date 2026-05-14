import { MousePointerClick, ScanFace, CheckCircle2, ShieldCheck, Lock, X, ArrowRight } from "lucide-react";

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
    title: "Start exploring",
    desc: "You'll be redirected back to MyBabes with full access.",
  },
];

type Props = { open: boolean; onClose: () => void };

const VerificationSignupDialog = ({ open, onClose }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">
        {/* Glow */}
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[140%] -translate-x-1/2 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(213 100% 50% / 0.35) 0%, transparent 65%)",
          }}
        />

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative p-7">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/30">
              <ShieldCheck className="h-8 w-8 text-white" strokeWidth={2.25} />
              <span className="absolute -bottom-1.5 -right-1.5 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white ring-2 ring-neutral-900">
                18+
              </span>
            </div>
            <h2 className="mt-4 text-xl font-bold tracking-tight text-white">
              Verify your age
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/60">
              A quick one-time check with our verification partner.
              <span className="mt-1 inline-flex items-center gap-1 text-white/80">
                <Lock className="h-3 w-3" /> We never see or store your ID.
              </span>
            </p>
          </div>

          {/* Steps */}
          <ol className="mt-6 space-y-2.5">
            {steps.map((s, i) => (
              <li
                key={s.title}
                className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3 transition-colors hover:border-white/10 hover:bg-white/[0.05]"
              >
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-primary ring-1 ring-white/10">
                  <s.icon className="h-4.5 w-4.5" />
                  <span className="absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-neutral-900">
                    {i + 1}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white">{s.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-white/50">
                    {s.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {/* CTA */}
          <button
            type="button"
            className="group mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black shadow-xl shadow-black/40 transition-transform hover:scale-[1.02] active:scale-[0.99]"
          >
            Verify with our partner
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] leading-relaxed text-white/40">
            <Lock className="h-3 w-3" />
            Encrypted &amp; handled by an independent third party.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationSignupDialog;
