import { ShieldCheck, IdCard, ScanFace, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: IdCard,
    title: "Upload your ID",
    desc: "Government-issued photo ID (passport, driver's license, or national ID).",
  },
  {
    icon: ScanFace,
    title: "Take a quick selfie",
    desc: "Our partner matches your face to your ID in seconds — fully encrypted.",
  },
  {
    icon: CheckCircle2,
    title: "Get verified",
    desc: "Most accounts are approved within 1 minute. You'll unlock full access right away.",
  },
];

const VerificationSignupDialog = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-md" />

      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-neutral-800/70 backdrop-blur-sm shadow-2xl">
        <div className="p-6 sm:p-7">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/30">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Verify your age to continue
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This is an 18+ platform. Sign up and complete a quick age
              verification with our trusted partner to access all content.
            </p>
          </div>

          <ol className="mt-6 space-y-3">
            {steps.map((s, i) => (
              <li
                key={s.title}
                className="flex gap-3 rounded-xl border border-border/60 bg-background/40 p-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <s.icon className="h-4.5 w-4.5" />
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
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Sign up & verify
          </button>
          <button
            type="button"
            className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-full text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            I already have an account
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
