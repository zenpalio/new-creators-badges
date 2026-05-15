import { MousePointerClick, ScanFace, CheckCircle2, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: MousePointerClick,
    title: "Click verify with Yoti",
    desc: "You'll be handed off to Yoti, our independent identity partner.",
  },
  {
    icon: ScanFace,
    title: "Scan your ID & selfie",
    desc: "Yoti checks a government ID and a quick liveness selfie. Takes ~1 minute.",
  },
  {
    icon: CheckCircle2,
    title: "Get verified",
    desc: "You're returned to MyBabes age-verified — no ID stored on our side.",
  },
];

const YOTI_SCENARIO_ID = "00e0cb82-338b-4143-9c8f-49e723036a89";
const YOTI_SHARE_URL = `https://api.yoti.com/share/${YOTI_SCENARIO_ID}`;

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
            We use{" "}
            <span className="font-medium text-foreground">Yoti</span> — a
            trusted, independent identity provider — to confirm you're 18+.
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

          {/* Yoti share button mounts here (rendered by Yoti's client script). */}
          <div ref={buttonHostRef} className="mt-6 flex justify-center [&_yoti-button]:w-full" />

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Verification handled by Yoti. We never store your ID or biometric data.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationSignupDialog;
