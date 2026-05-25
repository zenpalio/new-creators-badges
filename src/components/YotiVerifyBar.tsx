import { ShieldCheck } from "lucide-react";

type Props = { visible: boolean; onVerify: () => void };

const YotiVerifyBar = ({ visible, onVerify }: Props) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] pointer-events-none px-4 pb-4">
      <div className="pointer-events-auto mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-white/10 bg-neutral-900/95 p-3 pl-4 shadow-2xl backdrop-blur">
        <span className="inline-flex h-7 items-center justify-center rounded-md border border-white/15 bg-white/5 px-2 text-[11px] font-bold tracking-wide text-white/90">
          18+
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground leading-tight">
            Confirm you're 18+
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3 w-3" /> Quick age verification required
          </p>
        </div>
        <button
          type="button"
          onClick={onVerify}
          className="shrink-0 inline-flex h-9 items-center justify-center rounded-full bg-primary-v2 px-4 text-xs font-semibold text-primary-v2-foreground shadow-md transition-colors hover:bg-primary-v2/90"
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default YotiVerifyBar;
