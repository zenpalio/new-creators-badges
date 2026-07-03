import { useEffect, useState } from "react";
import { Check, X, ArrowRight } from "lucide-react";
import maiPortrait from "@/assets/chars/mai.png.asset.json";
import abbyPortrait from "@/assets/chars/abby.png.asset.json";
import boPortrait from "@/assets/chars/bo.png.asset.json";
import cleoPortrait from "@/assets/chars/cleo.png.asset.json";
import annaPortrait from "@/assets/chars/anna.png.asset.json";
import commonBg from "@/assets/saga-shelter-common.jpg.asset.json";
import type { PersuadeState } from "./SagaPersuadeHub";

type Row = {
  key: string;
  name: string;
  portrait: string;
  verdict: "yes" | "no";
  yesLine: string;
  noLine: string;
};

const YES_LINES: Record<string, string> = {
  Mai: "Yes. He stays. That's not a question.",
  Cleo: "Yes! I like this one. Keep him.",
  Anna: "Yes. He kept his head on the ride in. He can stay.",
  Bo: "Yes. He can pull his weight. Don't make me regret it.",
  Abby: "Fine. Yes. But one wrong move and it's on you.",
};

const NO_LINES: Record<string, string> = {
  Mai: "No.",
  Cleo: "…Sorry. No.",
  Anna: "No. Something's off.",
  Bo: "Hard no.",
  Abby: "Absolutely not.",
};

export default function SagaVote({
  state,
  onComplete,
}: {
  state: PersuadeState;
  onComplete: () => void;
}) {
  // Undecided → NO
  const rows: Row[] = [
    { key: "mai", name: "Mai", portrait: maiPortrait.url, verdict: "yes", yesLine: YES_LINES.Mai, noLine: NO_LINES.Mai },
    { key: "cleo", name: "Cleo", portrait: cleoPortrait.url, verdict: state.cleo === "yes" ? "yes" : "no", yesLine: YES_LINES.Cleo, noLine: NO_LINES.Cleo },
    { key: "anna", name: "Anna", portrait: annaPortrait.url, verdict: state.anna === "yes" ? "yes" : "no", yesLine: YES_LINES.Anna, noLine: NO_LINES.Anna },
    { key: "bo", name: "Bo", portrait: boPortrait.url, verdict: state.bo === "yes" ? "yes" : "no", yesLine: YES_LINES.Bo, noLine: NO_LINES.Bo },
    { key: "abby", name: "Abby", portrait: abbyPortrait.url, verdict: state.abby === "yes" ? "yes" : "no", yesLine: YES_LINES.Abby, noLine: NO_LINES.Abby },
  ];

  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (revealed >= rows.length) return;
    const t = window.setTimeout(() => setRevealed((r) => r + 1), revealed === 0 ? 800 : 1300);
    return () => window.clearTimeout(t);
  }, [revealed, rows.length]);

  const done = revealed >= rows.length;
  const yesCount = rows.filter((r) => r.verdict === "yes").length;
  const passed = yesCount >= 3;

  return (
    <div className="absolute inset-0 z-40 bg-black overflow-hidden animate-fade-in">
      <img
        src={commonBg.url}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "brightness(0.3) blur(3px)" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.75) 70%, rgba(0,0,0,0.95) 100%)",
        }}
      />

      <div className="relative z-10 h-full flex flex-col px-5 pt-10 pb-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-v2/30 bg-primary-v2/10 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-v2 animate-pulse" />
            <span className="text-[9px] uppercase tracking-[0.3em] text-primary-v2 font-medium">
              The Vote
            </span>
          </div>
          <h2 className="text-foreground-v2 text-[24px] font-bold leading-tight">
            The room decides.
          </h2>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-2.5 max-w-[360px] mx-auto w-full">
          {rows.map((r, i) => {
            const shown = i < revealed;
            return (
              <div
                key={r.key}
                className={`flex items-center gap-3 rounded-2xl border p-2.5 transition-all duration-500 ${
                  shown
                    ? r.verdict === "yes"
                      ? "border-emerald-400/50 bg-emerald-500/10 opacity-100 translate-y-0"
                      : "border-rose-400/50 bg-rose-500/10 opacity-100 translate-y-0"
                    : "border-white/10 bg-white/[0.03] opacity-30 translate-y-2"
                }`}
              >
                <img
                  src={r.portrait}
                  alt={r.name}
                  className="w-11 h-11 rounded-full object-cover border border-white/20"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-[13px] font-semibold leading-none">{r.name}</div>
                  {shown && (
                    <div className="text-white/70 text-[11px] leading-snug mt-1 italic">
                      "{r.verdict === "yes" ? r.yesLine : r.noLine}"
                    </div>
                  )}
                </div>
                {shown && (
                  <div
                    className={`w-9 h-9 rounded-full grid place-items-center border ${
                      r.verdict === "yes"
                        ? "bg-emerald-500/30 border-emerald-300/60 text-emerald-200"
                        : "bg-rose-500/30 border-rose-300/60 text-rose-200"
                    }`}
                  >
                    {r.verdict === "yes" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {done && (
          <div className="mt-6 animate-fade-in">
            <div
              className={`text-center px-5 py-4 rounded-2xl border mb-4 ${
                passed
                  ? "bg-emerald-500/15 border-emerald-400/40"
                  : "bg-amber-500/15 border-amber-400/40"
              }`}
            >
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/60 mb-1">
                {yesCount} of 5 said yes
              </div>
              <div
                className={`text-[18px] font-bold ${
                  passed ? "text-emerald-100" : "text-amber-100"
                }`}
              >
                {passed ? "You're in." : "They tolerate you — for now."}
              </div>
              <div className="text-white/60 text-[11px] mt-1.5 leading-snug">
                {passed
                  ? "Mai shows you to a bunk. The others watch you go."
                  : "Mai vouches for you. The others don't hide their doubt."}
              </div>
            </div>
            <button
              onClick={onComplete}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-primary-v2 text-primary-v2-foreground text-[12px] font-semibold uppercase tracking-[0.25em] hover:bg-primary-v2/90 transition"
            >
              Continue <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
