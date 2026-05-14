import { useState } from "react";
import { IdCard, ScanFace, CheckCircle2 } from "lucide-react";

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

type Props = { open: boolean; onClose: () => void };

const VerificationSignupDialog = ({ open, onClose }: Props) => {
  const [step, setStep] = useState<1 | 2>(1);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-neutral-800/95 shadow-2xl">
        <div className="p-6 sm:p-7">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold">
              18+
            </div>
            <h2 className="flex-1 pt-1 text-base font-bold uppercase tracking-wide text-foreground">
              Age verification required
            </h2>
          </div>

          {step === 1 && (
            <>
              <p className="mt-4 text-sm text-muted-foreground">
                You may encounter sensitive or adult content upon enabling
                NSFW. Please verify your age to proceed.
              </p>

              <p className="mt-4 text-sm italic text-muted-foreground">
                To comply with age-related regulations in your region, we
                verify that users meet the minimum age to access our service.
                This protects both you and our platform, ensuring that
                everyone uses our service responsibly.
              </p>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Continue
              </button>
              <button
                type="button"
                className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-full text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Leave site
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <p className="mt-4 text-sm text-muted-foreground">
                Sign up and complete a quick age verification with our trusted
                partner to access all content.
              </p>

              <ol className="mt-5 space-y-2">
                {steps.map((s, i) => (
                  <li
                    key={s.title}
                    className="flex gap-3 rounded-xl border border-border/60 bg-background/40 p-3"
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
                className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Sign up & verify
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-full text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Back
              </button>

              <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground">
                Verification is handled by an independent third-party
                provider. We never store your ID or biometric data.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationSignupDialog;
