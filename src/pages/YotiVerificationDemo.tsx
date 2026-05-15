import { ArrowLeft, BadgeCheck, Camera, FileCheck2, ShieldCheck } from "lucide-react";

const YotiVerificationDemo = () => {
  const params = new URLSearchParams(window.location.search);
  const returnTo = params.get("returnTo") || "/verification";

  const finishVerification = () => {
    const target = new URL(returnTo, window.location.origin);
    target.searchParams.set("yoti_verified", "1");
    window.location.assign(target.toString());
  };

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md flex-col justify-between">
        <button
          type="button"
          onClick={() => window.location.assign(returnTo)}
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to MyBabes
        </button>

        <section className="py-8">
          <div className="mb-8 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/25">
              <ShieldCheck className="h-8 w-8" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm font-semibold text-primary">Yoti verification</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Confirm you are 18+
            </h1>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Demo handoff for the PSP review. In production this step opens Yoti to scan ID and complete liveness checks.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {[
              { icon: FileCheck2, label: "Government ID check" },
              { icon: Camera, label: "Liveness selfie" },
              { icon: BadgeCheck, label: "18+ result returned" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-3 pb-3">
          <button
            type="button"
            onClick={finishVerification}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90"
          >
            Approve verification
          </button>
          <p className="text-center text-xs text-muted-foreground">
            MyBabes receives only the pass/fail result, not ID documents.
          </p>
        </div>
      </div>
    </main>
  );
};

export default YotiVerificationDemo;