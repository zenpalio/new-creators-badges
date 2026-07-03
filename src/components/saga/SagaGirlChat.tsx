import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send, Target, Loader2 } from "lucide-react";
import abbyPortrait from "@/assets/chars/abby.png.asset.json";
import boPortrait from "@/assets/chars/bo.png.asset.json";
import cleoPortrait from "@/assets/chars/cleo.png.asset.json";
import annaPortrait from "@/assets/chars/anna.png.asset.json";
import abbyBg from "@/assets/saga-chat-abby.jpg.asset.json";
import boBg from "@/assets/saga-chat-bo.jpg.asset.json";
import cleoBg from "@/assets/saga-chat-cleo.jpg.asset.json";
import annaBg from "@/assets/saga-chat-anna.jpg.asset.json";
import type { GirlSlug, Verdict } from "./SagaPersuadeHub";

type Msg = { role: "user" | "assistant"; content: string };

const GIRL_META: Record<
  GirlSlug,
  { name: string; portrait: string; bg: string; opener: string; difficulty: string }
> = {
  cleo: {
    name: "Cleo",
    portrait: cleoPortrait.url,
    bg: cleoBg.url,
    difficulty: "Easy",
    opener: "Ooh, fresh meat. Sit — Mai said you had a rough ride in. What's your name, stranger?",
  },
  anna: {
    name: "Anna",
    portrait: annaPortrait.url,
    bg: annaBg.url,
    difficulty: "Medium",
    opener: "You made it inside. Good. Now tell me — why should I speak up for you tonight?",
  },
  bo: {
    name: "Bo",
    portrait: boPortrait.url,
    bg: boBg.url,
    difficulty: "Hard",
    opener: "Cute. Another mouth. What can you actually DO around here?",
  },
  abby: {
    name: "Abby",
    portrait: abbyPortrait.url,
    bg: abbyBg.url,
    difficulty: "Hard",
    opener: "This is MY house. Convince me you're worth the food.",
  },
};

export default function SagaGirlChat({
  girl,
  onDone,
  onBack,
}: {
  girl: GirlSlug;
  onDone: (verdict: "yes" | "no") => void;
  onBack: () => void;
}) {
  const meta = GIRL_META[girl];
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: meta.opener },
  ]);
  const [input, setInput] = useState("");
  const [vibe, setVibe] = useState(0);
  const [busy, setBusy] = useState(false);
  const [verdict, setVerdict] = useState<Verdict>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (verdict) {
      const t = window.setTimeout(() => onDone(verdict as "yes" | "no"), 2200);
      return () => window.clearTimeout(t);
    }
  }, [verdict, onDone]);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  const send = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || busy || verdict) return;
    setInput("");
    setError(null);
    const nextMsgs: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(nextMsgs);
    setBusy(true);
    try {
      const r = await fetch(`${supabaseUrl}/functions/v1/saga-persuade-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${anonKey}`,
          apikey: anonKey,
        },
        body: JSON.stringify({ girl, messages: nextMsgs, vibe }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error || `HTTP ${r.status}`);
      }
      const data = (await r.json()) as { reply: string; vibeDelta: number; verdict: null | "yes" | "no" };
      const newVibe = Math.max(-100, Math.min(100, vibe + (data.vibeDelta || 0)));
      setVibe(newVibe);
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      if (data.verdict) setVerdict(data.verdict);
    } catch (err: any) {
      setError(err?.message || "Something broke.");
      setMessages((m) => m.slice(0, -1));
      setInput(text);
    } finally {
      setBusy(false);
      window.setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const meter = Math.max(0, Math.min(100, 50 + vibe / 2));

  return (
    <div className="absolute inset-0 z-40 bg-black animate-fade-in overflow-hidden">
      {/* Character background — same layered treatment as the Anna car chat */}
      <img
        src={meta.bg}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Top fade so goal chip stays readable */}
      <div
        className="absolute inset-x-0 top-0 h-[28%] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 60%, transparent 100%)",
        }}
      />
      {/* Bottom veil for chat legibility */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.92) 100%)",
        }}
      />

      {/* Back to hub — top left, same pill style as Skip */}
      <div className="absolute top-3 left-3 z-30">
        <button
          onClick={onBack}
          disabled={!!verdict}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.1] backdrop-blur-xl border border-white/15 text-[10px] uppercase tracking-[0.2em] text-white/85 hover:bg-white/[0.18] transition disabled:opacity-40"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Hub
        </button>
      </div>

      {/* Goal + vibe progress — top center, mirrors the Anna persuasion card */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 animate-fade-in w-[min(70%,260px)]">
        <div className="rounded-2xl bg-black/55 backdrop-blur-xl border border-white/10 px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2 mb-1.5">
            <img
              src={meta.portrait}
              alt={meta.name}
              className="w-5 h-5 rounded-full object-cover border border-white/25 shrink-0"
            />
            <Target className="w-3 h-3 text-primary-v2 shrink-0" />
            <span className="text-[9px] uppercase tracking-[0.22em] text-white/60 font-medium truncate">
              Persuade {meta.name} · {meta.difficulty}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${Math.max(3, meter)}%`,
                background:
                  meter > 65
                    ? "linear-gradient(90deg, hsl(var(--primary-v2)), #34d399)"
                    : meter < 35
                    ? "linear-gradient(90deg, #f43f5e, #fb923c)"
                    : "linear-gradient(90deg, hsl(var(--primary-v2)/0.6), hsl(var(--primary-v2)))",
                boxShadow: "0 0 12px hsl(var(--primary-v2)/0.6)",
              }}
            />
          </div>
          <div className="mt-1 flex items-center justify-between text-[9px] uppercase tracking-[0.2em] text-white/45">
            <span>Vibe</span>
            <span>{Math.round(meter)} / 100</span>
          </div>
        </div>
      </div>

      {/* Bottom composer + transcript — matches ChatComposer visual */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-3 pt-4 pb-[max(14px,env(safe-area-inset-bottom))]">
        <div
          className="w-full"
          style={{ animation: "saga-slide-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) both" }}
        >
          <div className="flex flex-col gap-3">
            {/* Transcript — fades into the void */}
            {(messages.length > 0 || busy) && (
              <div
                ref={scrollRef}
                className="max-h-[42vh] overflow-y-auto scrollbar-hide flex flex-col gap-2 px-1 py-2"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 10%, rgba(0,0,0,0.6) 30%, #000 55%)",
                  maskImage:
                    "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 10%, rgba(0,0,0,0.6) 30%, #000 55%)",
                }}
              >
                {messages.slice(-8).map((m, i, arr) => {
                  const age = arr.length - 1 - i;
                  const opacity = age <= 2 ? 1 : age <= 4 ? 0.85 : 0.6;
                  return (
                    <div
                      key={i}
                      className={`flex animate-fade-in ${m.role === "user" ? "justify-end" : "justify-start"}`}
                      style={{ opacity }}
                    >
                      {m.role === "user" ? (
                        <div className="max-w-[75%] px-4 py-2 rounded-2xl rounded-br-md text-sm bg-white/90 text-[hsl(220_25%_10%)] shadow-lg">
                          {m.content}
                        </div>
                      ) : (
                        <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-bl-md text-sm text-white bg-white/[0.07] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.4)] leading-relaxed backdrop-blur-xl">
                          {m.content}
                        </div>
                      )}
                    </div>
                  );
                })}
                {busy && (
                  <div className="flex justify-start">
                    <div className="px-4 py-2 rounded-2xl rounded-bl-md bg-white/[0.08] backdrop-blur-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
                      <span className="inline-flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" style={{ animationDelay: "0.15s" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" style={{ animationDelay: "0.3s" }} />
                      </span>
                    </div>
                  </div>
                )}
                {verdict && (
                  <div className="flex justify-center pt-2">
                    <div
                      className={`px-5 py-3 rounded-2xl text-center font-bold uppercase tracking-[0.3em] text-[13px] border animate-scale-in ${
                        verdict === "yes"
                          ? "bg-emerald-500/25 border-emerald-400/60 text-emerald-200"
                          : "bg-rose-500/25 border-rose-400/60 text-rose-200"
                      }`}
                    >
                      {meta.name} votes {verdict}
                    </div>
                  </div>
                )}
                {error && (
                  <div className="text-center text-[11px] text-rose-300/90 bg-rose-500/10 border border-rose-400/30 rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}
              </div>
            )}

            {/* Composer — glass pill */}
            {!verdict && (
              <form
                onSubmit={send}
                className="flex items-center gap-2 pl-4 pr-2 h-14 rounded-full bg-white/[0.07] backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.4)]"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Message ${meta.name}…`}
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                  disabled={busy}
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  className="w-10 h-10 rounded-full bg-white text-[hsl(220_25%_10%)] flex items-center justify-center disabled:opacity-30 hover:scale-105 transition shrink-0"
                >
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
            )}
          </div>
        </div>
        <style>{`
          @keyframes saga-slide-up {
            from { transform: translateY(120%); opacity: 0; }
            to   { transform: translateY(0);    opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}
