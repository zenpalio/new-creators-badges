import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send, Flame, Loader2, Lock } from "lucide-react";
import { scenarioById, type MediaStage, type ScenarioId } from "./scenarios";

type Msg = { role: "user" | "assistant"; content: string; selfie?: string };

const FREE_MESSAGES = 5;

const renderBackground = (bg: MediaStage) => {
  if (bg.kind === "video") {
    return (
      <video
        key={bg.src}
        src={bg.src}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover transition-all duration-1000"
      />
    );
  }

  return (
    <img
      key={bg.src}
      src={bg.src}
      alt=""
      aria-hidden
      className="absolute inset-0 h-full w-full object-cover transition-all duration-1000"
    />
  );
};

export default function MatchChat({
  id,
  onBack,
}: {
  id: ScenarioId;
  onBack: () => void;
}) {
  const s = scenarioById(id);
  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: s.opener }]);
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

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
      const selfieUrl = data.selfie ? s.selfies?.[heatIdx] ?? s.heat[heatIdx]?.src : undefined;
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
    <div className="fixed inset-0 z-40 overflow-hidden bg-black animate-fade-in">
      {renderBackground(bg)}

      <div
        className="absolute inset-x-0 top-0 h-[30%] pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, transparent 100%)" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
        style={{ background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.95) 100%)" }}
      />

      <div className="absolute left-3 top-3 z-30">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.1] px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white/85 backdrop-blur-xl transition hover:bg-white/[0.18]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
      </div>

      <div className="absolute left-1/2 top-3 z-30 w-[min(72%,280px)] -translate-x-1/2">
        <div className="rounded-2xl border border-white/10 bg-black/60 px-3 py-2 shadow-2xl backdrop-blur-xl">
          <div className="mb-1.5 flex items-center gap-2">
            <img
              src={s.portrait}
              alt={s.name}
              className="h-5 w-5 shrink-0 rounded-full border border-white/25 object-cover"
            />
            <Flame className="h-3 w-3 shrink-0" style={{ color: s.accent }} />
            <span className="truncate text-[9px] font-medium uppercase tracking-[0.22em] text-white/70">
              {s.name} · Heat
            </span>
            <span className="ml-auto text-[9px] uppercase tracking-[0.2em] text-white/40">
              {messagesLeft} left
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
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

      <div className="absolute inset-x-0 bottom-0 z-20 px-3 pb-[max(14px,env(safe-area-inset-bottom))] pt-4">
        <div className="mx-auto flex max-w-md flex-col gap-3">
          <div
            ref={scrollRef}
            className="scrollbar-hide flex max-h-[52vh] flex-col gap-2 overflow-y-auto px-1 py-2"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 8%, rgba(0,0,0,0.7) 25%, #000 45%)",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 8%, rgba(0,0,0,0.7) 25%, #000 45%)",
            }}
          >
            {messages.slice(-10).map((m, i) => (
              <div
                key={`${m.role}-${i}-${m.content.slice(0, 24)}`}
                className={`flex animate-fade-in ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "user" ? (
                  <div className="max-w-[75%] rounded-2xl rounded-br-md bg-white/95 px-4 py-2 text-sm text-[hsl(220_25%_10%)] shadow-lg">
                    {m.content}
                  </div>
                ) : (
                  <div className="flex max-w-[82%] flex-col gap-1.5">
                    {m.selfie && (
                      <div className="animate-scale-in overflow-hidden rounded-2xl border border-white/15 shadow-2xl">
                        <img src={m.selfie} alt="" className="h-40 w-full object-cover" />
                      </div>
                    )}
                    <div className="rounded-2xl rounded-bl-md border border-white/15 bg-white/[0.08] px-4 py-2.5 text-sm leading-relaxed text-white shadow-2xl backdrop-blur-xl">
                      {m.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {busy && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.08] px-4 py-2 backdrop-blur-2xl">
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/70" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/70" style={{ animationDelay: "0.15s" }} />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/70" style={{ animationDelay: "0.3s" }} />
                  </span>
                </div>
              </div>
            )}
            {done && !gated && (
              <div className="flex justify-center pt-2">
                <div
                  className="animate-scale-in rounded-2xl border px-5 py-3 text-center text-[12px] font-bold uppercase tracking-[0.3em]"
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
              <div className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-center text-[11px] text-rose-300/90">
                {error}
              </div>
            )}
          </div>

          {!gated && (
            <form
              onSubmit={send}
              className="flex h-14 items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] pl-4 pr-2 shadow-2xl backdrop-blur-xl"
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
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition hover:scale-105 disabled:opacity-30"
                style={{ background: `linear-gradient(135deg, hsl(var(--primary-v2)), ${s.accent})` }}
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </form>
          )}
        </div>
      </div>

      {gated && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 px-6 backdrop-blur-2xl animate-fade-in">
          <div className="w-full max-w-sm space-y-5 rounded-3xl border border-white/15 bg-white/[0.06] p-7 text-center shadow-2xl">
            <div
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: `${s.accent}30`, border: `2px solid ${s.accent}` }}
            >
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-black leading-tight text-white">
              {s.name} is waiting for your next move
            </h2>
            <p className="text-sm leading-relaxed text-white/70">
              Unlock unlimited messages, voice notes & private photos.
              Your chat is saved.
            </p>
            <button
              onClick={() => (window.location.href = "/pricing")}
              className="h-14 w-full rounded-full text-sm font-bold uppercase tracking-[0.25em] text-white shadow-[0_0_40px_hsl(var(--primary-v2)/0.5)] transition hover:scale-[1.02] active:scale-95"
              style={{ background: `linear-gradient(135deg, hsl(var(--primary-v2)), ${s.accent})` }}
            >
              Continue with {s.name}
            </button>
            <button
              onClick={onBack}
              className="text-[11px] uppercase tracking-[0.25em] text-white/45 transition hover:text-white/80"
            >
              Back to matches
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
