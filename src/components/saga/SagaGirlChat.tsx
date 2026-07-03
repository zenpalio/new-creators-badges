import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
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
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    if (verdict) {
      const t = window.setTimeout(() => onDone(verdict as "yes" | "no"), 2200);
      return () => window.clearTimeout(t);
    }
  }, [verdict, onDone]);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  const send = async () => {
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
    } catch (e: any) {
      setError(e?.message || "Something broke.");
      setMessages((m) => m.slice(0, -1));
      setInput(text);
    } finally {
      setBusy(false);
      window.setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const meter = Math.max(0, Math.min(100, 50 + vibe / 2));

  return (
    <div className="absolute inset-0 z-40 bg-black flex flex-col animate-fade-in overflow-hidden">
      <img
        src={meta.bg}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "brightness(0.5) saturate(1.05)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 30%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.95) 100%)",
        }}
      />

      {/* Top bar */}
      <div className="relative z-20 pt-6 px-4 flex items-center gap-3">
        <button
          onClick={onBack}
          disabled={!!verdict}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.1] backdrop-blur-xl border border-white/15 text-[10px] uppercase tracking-[0.2em] text-white/85 hover:bg-white/[0.18] transition disabled:opacity-40"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Hub
        </button>
        <div className="flex items-center gap-2 flex-1">
          <img
            src={meta.portrait}
            alt={meta.name}
            className="w-9 h-9 rounded-full object-cover border border-white/20"
          />
          <div className="flex-1 min-w-0">
            <div className="text-white text-[14px] font-semibold leading-none">{meta.name}</div>
            <div className="text-white/50 text-[9px] uppercase tracking-[0.25em] mt-1">
              {meta.difficulty} · Vibe
            </div>
          </div>
        </div>
      </div>

      {/* Vibe meter */}
      <div className="relative z-20 px-4 mt-2">
        <div className="h-1.5 rounded-full bg-white/[0.08] overflow-hidden border border-white/10">
          <div
            className="h-full transition-all duration-700 ease-out"
            style={{
              width: `${meter}%`,
              background:
                meter > 65
                  ? "linear-gradient(90deg, hsl(var(--primary-v2)), #34d399)"
                  : meter < 35
                  ? "linear-gradient(90deg, #f43f5e, #fb923c)"
                  : "linear-gradient(90deg, hsl(var(--primary-v2)/0.6), hsl(var(--primary-v2)))",
            }}
          />
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="relative z-20 flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
          >
            <div
              className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-[14px] leading-snug ${
                m.role === "user"
                  ? "bg-primary-v2 text-primary-v2-foreground rounded-br-sm"
                  : "bg-white/10 backdrop-blur-md border border-white/15 text-white rounded-bl-sm"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex justify-start">
            <div className="px-3.5 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white/70 text-[13px] inline-flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> {meta.name} is thinking…
            </div>
          </div>
        )}
        {verdict && (
          <div className="flex justify-center pt-4">
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

      {/* Composer */}
      {!verdict && (
        <div className="relative z-20 px-4 pb-5 pt-2">
          <div className="flex items-end gap-2 bg-black/50 backdrop-blur-xl border border-white/15 rounded-2xl p-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              autoFocus
              placeholder={`Say something to ${meta.name}…`}
              className="flex-1 bg-transparent text-white text-[14px] placeholder:text-white/40 resize-none max-h-24 focus:outline-none px-2 py-2"
            />
            <button
              onClick={send}
              disabled={!input.trim() || busy}
              className="w-9 h-9 grid place-items-center rounded-full bg-primary-v2 text-primary-v2-foreground disabled:opacity-40 disabled:pointer-events-none hover:bg-primary-v2/90 transition"
              aria-label="Send"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-center text-[9px] uppercase tracking-[0.25em] text-white/35 mt-2">
            Be real. She'll know if you're faking it.
          </p>
        </div>
      )}
    </div>
  );
}
