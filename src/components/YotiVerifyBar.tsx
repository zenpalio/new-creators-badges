import { useEffect, useRef } from "react";
import { ShieldCheck } from "lucide-react";

const YOTI_SCENARIO_ID = "00e0cb82-338b-4143-9c8f-49e723036a89";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "yoti-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          scenarioid?: string;
          clientsdkid?: string;
          label?: string;
          align?: string;
        },
        HTMLElement
      >;
    }
  }
}

type Props = { visible: boolean };

const YotiVerifyBar = ({ visible }: Props) => {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible || !hostRef.current) return;
    hostRef.current.innerHTML = "";
    const el = document.createElement("yoti-button");
    el.setAttribute("scenarioid", YOTI_SCENARIO_ID);
    el.setAttribute("clientsdkid", YOTI_SCENARIO_ID);
    el.setAttribute("label", "Verify with Yoti");
    el.setAttribute("align", "center");
    hostRef.current.appendChild(el);
  }, [visible]);

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
            <ShieldCheck className="h-3 w-3" /> Verified by Yoti
          </p>
        </div>
        <div ref={hostRef} className="shrink-0" />
      </div>
    </div>
  );
};

export default YotiVerifyBar;
