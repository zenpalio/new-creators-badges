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

type AgeVerifOptions = {
  challenges?: string[] | string;
  closable?: boolean;
  cookie?: string;
  domain?: string;
  language?: string;
  page?: string;
  sessionToken?: string;
  target?: "popup" | "tab";
};

const CHECKER_ORIGIN = "https://checker.ageverif.com";

const getAgeVerifOptions = (ageverif: any): AgeVerifOptions | undefined => {
  try {
    return ageverif?.options as AgeVerifOptions | undefined;
  } catch {
    return undefined;
  }
};

const isConfiguredDomain = (options?: AgeVerifOptions) => {
  if (!options?.domain || typeof window === "undefined") return true;
  const domainParts = options.domain.split(".").length;
  const currentBaseDomain = window.location.hostname
    .split(".")
    .slice(-domainParts)
    .join(".");

  return currentBaseDomain === options.domain;
};

const openCheckerFallback = (ageverif: any) => {
  const options = getAgeVerifOptions(ageverif);
  if (!options?.sessionToken) return false;

  const params = new URLSearchParams({ sessionToken: options.sessionToken });
  if (options.challenges) {
    params.set(
      "challenges",
      Array.isArray(options.challenges)
        ? options.challenges.join(",")
        : options.challenges
    );
  }
  if (options.closable) params.set("closable", "1");

  const language =
    typeof ageverif?.language === "string" && ageverif.language !== "auto"
      ? ageverif.language
      : "en";
  const page = options.page ? `/${options.page}` : "";
  const checkerUrl = `${CHECKER_ORIGIN}/${language}${page}?${params.toString()}`;
  const popup = window.open(
    checkerUrl,
    "_blank",
    options.target === "popup" ? "width=400,height=700" : undefined
  );

  if (!popup) return false;

  const cleanup = () => {
    window.removeEventListener("message", onMessage);
    window.clearTimeout(timeoutId);
  };

  const onMessage = (event: MessageEvent) => {
    if (event.origin !== CHECKER_ORIGIN || typeof event.data !== "object") return;

    const data = event.data as { type?: string; verificationToken?: string };
    if (data.type === "verified" && data.verificationToken) {
      if (options.cookie) localStorage.setItem(options.cookie, data.verificationToken);
      document.documentElement.classList.add("ageverif-verified");
      window.dispatchEvent(
        new CustomEvent("ageverif:success", {
          detail: { verificationToken: data.verificationToken },
        })
      );
      popup.close();
      cleanup();
    }

    if (data.type === "close") {
      window.dispatchEvent(new CustomEvent("ageverif:close"));
      cleanup();
    }
  };

  const timeoutId = window.setTimeout(cleanup, 10 * 60 * 1000);
  window.addEventListener("message", onMessage);
  popup.focus();
  return true;
};

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
              const options = getAgeVerifOptions(av);

              if (av && typeof av.start === "function" && isConfiguredDomain(options)) {
                av.start({ target: "tab" }).catch((error: unknown) => {
                  console.warn("[AgeVerif] start() failed, using direct checker fallback.", error);
                  openCheckerFallback(av);
                });
                onClose();
                return;
              }

              if (openCheckerFallback(av)) {
                onClose();
                return;
              }

              {
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
