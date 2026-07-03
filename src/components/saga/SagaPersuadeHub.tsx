import { Check, X, MessageCircle, ArrowRight, HelpCircle } from "lucide-react";
import abbyImg from "@/assets/chars/abby.png.asset.json";
import boImg from "@/assets/chars/bo.png.asset.json";
import cleoImg from "@/assets/chars/cleo.png.asset.json";
import annaImg from "@/assets/chars/anna.png.asset.json";
import commonBg from "@/assets/saga-shelter-common.jpg.asset.json";

export type GirlSlug = "abby" | "bo" | "cleo" | "anna";
export type Verdict = "yes" | "no" | null;
export type PersuadeState = Record<GirlSlug, Verdict>;

const GIRLS: {
  slug: GirlSlug;
  name: string;
  tag: string;
  difficulty: "Easy" | "Medium" | "Hard";
  img: string;
}[] = [
  { slug: "cleo", name: "Cleo", tag: "Curious. Playful. Will laugh with you.", difficulty: "Easy", img: cleoImg.url },
  { slug: "anna", name: "Anna", tag: "The driver. Tired. Watching.", difficulty: "Medium", img: annaImg.url },
  { slug: "bo", name: "Bo", tag: "Cleaning her rifle. Testing you.", difficulty: "Hard", img: boImg.url },
  { slug: "abby", name: "Abby", tag: "Arms crossed. Decides who stays.", difficulty: "Hard", img: abbyImg.url },
];

export default function SagaPersuadeHub({
  state,
  onTalk,
  onVote,
}: {
  state: PersuadeState;
  onTalk: (girl: GirlSlug) => void;
  onVote: () => void;
}) {
  const yesCount = 1 + Object.values(state).filter((v) => v === "yes").length; // Mai always yes
  const decided = Object.values(state).filter((v) => v !== null).length;
  const needMore = Math.max(0, 3 - yesCount);

  return (
    <div className="absolute inset-0 z-40 bg-black overflow-hidden animate-fade-in">
      <img
        src={commonBg.url}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "brightness(0.35) blur(2px) saturate(0.9)" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.75) 70%, rgba(0,0,0,0.95) 100%)",
        }}
      />

      <div className="relative z-10 h-full flex flex-col px-5 pt-8 pb-6 overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-v2/30 bg-primary-v2/10 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-v2 animate-pulse" />
            <span className="text-[9px] uppercase tracking-[0.3em] text-primary-v2 font-medium">
              The Vote · Persuade the shelter
            </span>
          </div>
          <h2 className="text-foreground-v2 text-[26px] font-bold leading-tight tracking-tight">
            Earn your bed.
          </h2>
          <p className="text-foreground-v2/60 text-[12px] mt-1.5 max-w-[280px] mx-auto leading-snug">
            Mai is already a yes. You need <span className="text-primary-v2 font-semibold">3 of 5</span> votes to be let in.
          </p>
        </div>

        {/* Tally */}
        <div className="mx-auto mb-5 flex items-center gap-2">
          {["Mai", "Cleo", "Anna", "Bo", "Abby"].map((n, i) => {
            const v: Verdict = i === 0 ? "yes" : state[(["cleo", "anna", "bo", "abby"] as GirlSlug[])[i - 1]];
            return (
              <div key={n} className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-full grid place-items-center border ${
                    v === "yes"
                      ? "bg-emerald-500/25 border-emerald-400/60 text-emerald-300"
                      : v === "no"
                      ? "bg-rose-500/25 border-rose-400/60 text-rose-300"
                      : "bg-white/[0.05] border-white/15 text-white/40"
                  }`}
                >
                  {v === "yes" ? <Check className="w-3.5 h-3.5" /> : v === "no" ? <X className="w-3.5 h-3.5" /> : <HelpCircle className="w-3.5 h-3.5" />}
                </div>
                <span className="text-[8px] uppercase tracking-[0.2em] text-white/50">{n}</span>
              </div>
            );
          })}
        </div>

        <div className="text-center mb-4 text-[11px] uppercase tracking-[0.25em] text-foreground-v2/70">
          <span className="text-primary-v2 font-semibold text-[13px]">{yesCount}</span> / 3 yes
          {needMore > 0 && decided === 4 && (
            <span className="ml-2 text-amber-300/90">— they may turn you away</span>
          )}
        </div>

        {/* Girl cards */}
        <div className="grid grid-cols-2 gap-3">
          {GIRLS.map((g) => {
            const v = state[g.slug];
            const locked = v !== null;
            return (
              <button
                key={g.slug}
                onClick={() => !locked && onTalk(g.slug)}
                disabled={locked}
                className={`group relative overflow-hidden rounded-2xl aspect-[3/4] border transition text-left ${
                  locked
                    ? v === "yes"
                      ? "border-emerald-400/50"
                      : "border-rose-400/50"
                    : "border-white/15 hover:border-primary-v2/60 active:scale-[0.98]"
                }`}
              >
                <img src={g.img} alt={g.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {locked && (
                  <div
                    className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border ${
                      v === "yes"
                        ? "bg-emerald-500/30 border-emerald-300/60 text-emerald-100"
                        : "bg-rose-500/30 border-rose-300/60 text-rose-100"
                    }`}
                  >
                    {v}
                  </div>
                )}
                {!locked && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[8px] uppercase tracking-[0.2em] bg-black/60 border border-white/15 text-white/70">
                    {g.difficulty}
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 p-3">
                  <div className="text-white text-[15px] font-bold leading-none">{g.name}</div>
                  <div className="text-white/70 text-[10px] leading-snug mt-1 line-clamp-2">{g.tag}</div>
                  {!locked && (
                    <div className="mt-2 inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.2em] text-primary-v2 font-semibold">
                      <MessageCircle className="w-3 h-3" /> Talk
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Vote CTA */}
        <div className="mt-6 mb-2">
          <button
            onClick={onVote}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-primary-v2 text-primary-v2-foreground text-[12px] font-semibold uppercase tracking-[0.25em] hover:bg-primary-v2/90 transition shadow-[0_10px_40px_-10px_hsl(var(--primary-v2)/0.6)]"
          >
            Face the vote <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <p className="text-center text-[10px] text-white/40 mt-2">
            You can vote at any time. Undecided girls will vote NO.
          </p>
        </div>
      </div>
    </div>
  );
}
