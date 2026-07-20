import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send, Flame, Loader2, Lock } from "lucide-react";
import { scenarioById, type ScenarioId } from "./scenarios";

type Msg = { role: "user" | "assistant"; content: string; selfie?: string };

const FREE_MESSAGES = 5;

export default function MatchChat({
  id,
  onBack,
}: {
  id: ScenarioId;
  onBack: () => void;
}) {
  const s = scenarioById(id);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: s.opener },
  ]);
  const [input, setInput] = useState("");
  const [heat, setHeat] = useState(10);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gated, setGated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  const userTurns = messages.filter((m) => m.role === "user").length;
  const heatIdx = heat >= 60 ? 2 : heat >= 30 ? 1 : 0;
  const bg = s.heat[heatIdx];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const send = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || busy || done || gated) return;
    if (userTurns >= FREE_MESSAGES) {
      setGated(true);
      return;
    }
    setInput("");
    setError(null);
    const nextMsgs: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(nextMsgs);
    setBusy(true);
    try {
      const r = await fetch(`${supabaseUrl}/functions/v1/match-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${anonKey}`,
          apikey: anonKey,
        },
        body: JSON.stringify({ scenario: id, messages: nextMsgs, heat }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error || `HTTP ${r.status}`);
      }
      const data = (await r.json()) as {
        reply: string;
        heatDelta: number;
        selfie: boolean;
        done: boolean;
      };
      const newHeat = Math.max(0, Math.min(100, heat + (data.heatDelta || 0)));
      setHeat(newHeat);
      const nextHeatIdx = newHeat >= 60 ? 2 : newHeat >= 30 ? 1 : 0;
      const selfieUrl = data.selfie ? s.heat[nextHeatIdx] : undefined;
      setMessages((m) => [...m, { role: "assistant", content: data.reply, selfie: selfieUrl }]);
      if (data.done) setDone(true);
      if (userTurns + 1 >= FREE_MESSAGES) {
        window.setTimeout(() => setGated(true), 1200);
      }
    } catch (err: any) {
      setError(err?.message || "Something broke.");
      setMessages((m) => m.slice(0, -1));
      setInput(text);
    } finally {
      setBusy(false);
      window.setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const messagesLeft = Math.max(0, FREE_MESSAGES - userTurns);

  return (
    <div className="fixed inset-0 z-40 bg-black overflow-hidden animate-fade-in">
      <img
        src={bg}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover transition-all duration-1000"
        style={{ filter: heat >= 60 ? "saturate(1.1)" : "none" }}
        key={bg}
      />

      {/* Top scrim */}
      <div
        className="absolute inset-x-0 top-0 h-[30%] pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, transparent 100%)" }}
      />
      {/* Bottom scrim */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
        style={{ background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.95) 100%)" }}
      />

      {/* Back */}
      <div className="absolute top-3 left-3 z-30">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.1] backdrop-blur-xl border border-white/15 text-[10px] uppercase tracking-[0.2em] text-white/85 hover:bg-white/[0.18] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
      </div>

      {/* Heat meter */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 w-[min(72%,280px)]">
        <div className="rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 px-3 py-2 shadow-2xl">
          <div className="flex items-center gap-2 mb-1.5">
            <img
              src={s.portrait}
              alt={s.name}
              className="w-5 h-5 rounded-full object-cover border border-white/25 shrink-0"
            />
            <Flame className="w-3 h-3 shrink-0" style={{ color: s.accent }} />
            <span className="text-[9px] uppercase tracking-[0.22em] text-white/70 font-medium truncate">
              {s.name} · Heat
            </span>
            <span className="ml-auto text-[9px] uppercase tracking-[0.2em] text-white/40">
              {messagesLeft} left
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${Math.max(3, heat)}%`,
                background: `linear-gradient(90deg, ${s.accent}80, ${s.accent})`,
                boxShadow: `0 0 12px ${s.accent}`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Chat body */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-3 pt-4 pb-[max(14px,env(safe-area-inset-bottom))]">
        <div className="max-w-md mx-auto flex flex-col gap-3">
          <div
            ref={scrollRef}
            className="max-h-[52vh] overflow-y-auto scrollbar-hide flex flex-col gap-2 px-1 py-2"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 8%, rgba(0,0,0,0.7) 25%, #000 45%)",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 8%, rgba(0,0,0,0.7) 25%, #000 45%)",
            }}
          >
            {messages.slice(-10).map((m, i) => (
              <div
                key={i}
                className={`flex animate-fade-in ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "user" ? (
                  <div className="max-w-[75%] px-4 py-2 rounded-2xl rounded-br-md text-sm bg-white/95 text-[hsl(220_25%_10%)] shadow-lg">
                    {m.content}
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5 max-w-[82%]">
                    {m.selfie && (
                      <div className="rounded-2xl overflow-hidden border border-white/15 shadow-2xl animate-scale-in">
                        <img src={m.selfie} alt="" className="w-full h-40 object-cover" />
                      </div>
                    )}
                    <div className="px-4 py-2.5 rounded-2xl rounded-bl-md text-sm text-white bg-white/[0.08] border border-white/15 shadow-2xl leading-relaxed backdrop-blur-xl">
                      {m.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {busy && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-2xl rounded-bl-md bg-white/[0.08] backdrop-blur-2xl border border-white/10">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" style={{ animationDelay: "0.15s" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" style={{ animationDelay: "0.3s" }} />
                  </span>
                </div>
              </div>
            )}
            {done && !gated && (
              <div className="flex justify-center pt-2">
                <div
                  className="px-5 py-3 rounded-2xl text-center font-bold uppercase tracking-[0.3em] text-[12px] border animate-scale-in"
                  style={{
                    background: `${s.accent}30`,
                    borderColor: `${s.accent}90`,
                    color: "#fff",
                  }}
                >
                  {s.name} wants more
                </div>
              </div>
            )}
            {error && (
              <div className="text-center text-[11px] text-rose-300/90 bg-rose-500/10 border border-rose-400/30 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
          </div>

          {!gated && (
            <form
              onSubmit={send}
              className="flex items-center gap-2 pl-4 pr-2 h-14 rounded-full bg-white/[0.07] backdrop-blur-xl border border-white/10 shadow-2xl"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={done ? `Say yes to ${s.name}…` : `Message ${s.name}…`}
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                disabled={busy}
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-30 hover:scale-105 transition shrink-0 text-white"
                style={{ background: `linear-gradient(135deg, hsl(var(--primary-v2)), ${s.accent})` }}
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Paywall gate */}
      {gated && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center px-6 animate-fade-in">
          <div className="max-w-sm w-full rounded-3xl border border-white/15 bg-white/[0.06] p-7 text-center space-y-5 shadow-2xl">
            <div
              className="mx-auto w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: `${s.accent}30`, border: `2px solid ${s.accent}` }}
            >
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white leading-tight">
              {s.name} is waiting for your next move
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              Unlock unlimited messages, voice notes & private photos.
              Your chat is saved.
            </p>
            <button
              onClick={() => (window.location.href = "/pricing")}
              className="w-full h-14 rounded-full font-bold text-white text-sm uppercase tracking-[0.25em] shadow-[0_0_40px_hsl(var(--primary-v2)/0.5)] hover:scale-[1.02] active:scale-95 transition"
              style={{ background: `linear-gradient(135deg, hsl(var(--primary-v2)), ${s.accent})` }}
            >
              Continue with {s.name}
            </button>
            <button
              onClick={onBack}
              className="text-[11px] uppercase tracking-[0.25em] text-white/45 hover:text-white/80 transition"
            >
              Back to matches
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
