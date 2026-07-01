import { useState, useRef, useEffect } from "react";
import { Send, Volume2, VolumeX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";


interface Msg { role: "user" | "assistant"; content: string; }

const VOICE_KEY = "mina.voiceOn";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export type Sentiment = "love" | "like" | "neutral" | "dislike" | "hate";
export interface Reaction {
  sentiment: Sentiment;
  emotion?: string;
  deltas?: Partial<Record<"affection" | "hunger" | "energy" | "sleepiness" | "hygiene" | "comfort" | "calm" | "joy" | "trust" | "shyness" | "jealousy" | "loneliness" | "stress" | "arousal" | "lust" | "wetness" | "obedience" | "dominance", number>>;
}

interface Props {
  onAfterReply?: () => void;
  /** Receives a 0–1 lip-sync amplitude while Mina is speaking. */
  onMouthLevel?: (v: number) => void;
  /** Fires true when audio playback starts, false when it stops. */
  onSpeakingChange?: (speaking: boolean) => void;
  /** Fires whenever a reply arrives with the model's sentiment + deltas. */
  onReaction?: (r: Reaction) => void;
  /** Optional scripted assistant messages to play on mount (story intro). */
  scriptedIntro?: string[];
}

const ChatComposer = ({ onAfterReply, onMouthLevel, onSpeakingChange, onReaction, scriptedIntro }: Props) => {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [voiceOn, setVoiceOn] = useState(() => {
    try { return localStorage.getItem(VOICE_KEY) === "1"; } catch { return false; }
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, sending]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    try { localStorage.setItem(VOICE_KEY, voiceOn ? "1" : "0"); } catch {}
    if (!voiceOn) stopSpeaking();
  }, [voiceOn]);

  useEffect(() => () => stopSpeaking(), []);

  // Scripted story intro — Anna sends the first messages automatically.
  useEffect(() => {
    if (!scriptedIntro || scriptedIntro.length === 0) return;
    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(() => resolve(), ms);
        timers.push(id);
      });
    (async () => {
      await wait(700);
      for (const line of scriptedIntro) {
        if (cancelled) return;
        setSending(true);
        // Typing time scales with message length, clamped for pacing.
        const typing = Math.min(2600, Math.max(900, line.length * 38));
        await wait(typing);
        if (cancelled) return;
        setSending(false);
        setMsgs((p) => [...p, { role: "assistant", content: line }]);
        if (voiceOn) void speak(line);
        await wait(650);
      }
    })();
    return () => {
      cancelled = true;
      timers.forEach((id) => clearTimeout(id));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // External injection from Activity/Roleplay drawer
  useEffect(() => {
    const onInject = (e: Event) => {
      const detail = (e as CustomEvent<{ text: string }>).detail;
      if (detail?.text) void send(undefined, detail.text);
    };
    window.addEventListener("mina:inject-message", onInject);
    return () => window.removeEventListener("mina:inject-message", onInject);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sending, msgs, voiceOn]);

  const stopSpeaking = () => {
    try { sourceRef.current?.stop(); } catch {}
    sourceRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    onMouthLevel?.(0);
    onSpeakingChange?.(false);
  };

  const speak = async (line: string) => {
    try {
      // Fetch raw audio bytes directly — supabase.functions.invoke
      // parses bodies as JSON/text and corrupts binary.
      const res = await fetch(`${SUPABASE_URL}/functions/v1/mina-tts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_ANON}`,
          apikey: SUPABASE_ANON,
        },
        body: JSON.stringify({ text: line }),
      });
      if (!res.ok) throw new Error(`tts ${res.status}: ${await res.text().catch(() => "")}`);
      const arrayBuf = await res.arrayBuffer();

      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") await ctx.resume().catch(() => {});

      const buffer = await ctx.decodeAudioData(arrayBuf.slice(0));

      stopSpeaking();
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.25;
      src.connect(analyser);
      analyser.connect(ctx.destination);
      src.start();
      sourceRef.current = src;
      onSpeakingChange?.(true);

      const data = new Uint8Array(analyser.frequencyBinCount);
      let env = 0;
      const tick = () => {
        analyser.getByteTimeDomainData(data);
        // RMS deviation from 128 → 0..1
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const d = (data[i] - 128) / 128;
          sum += d * d;
        }
        const rms = Math.sqrt(sum / data.length);
        const target = Math.min(1, rms * 4.5);
        // Asymmetric envelope: fast attack, slower release for natural mouth motion
        const k = target > env ? 0.55 : 0.18;
        env = env + (target - env) * k;
        onMouthLevel?.(env);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);

      src.onended = () => {
        if (sourceRef.current === src) stopSpeaking();
      };
    } catch (e) {
      console.error("[tts] failed", e);
      onMouthLevel?.(0);
    }
  };

  const send = async (e?: React.FormEvent, override?: string) => {
    e?.preventDefault();
    const m = (override ?? text).trim();
    if (!m || sending) return;
    if (!override) setText("");
    setMsgs((p) => [...p, { role: "user", content: m }]);
    setSending(true);
    let reply = "...";
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch(`${SUPABASE_URL}/functions/v1/mina-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token ?? SUPABASE_ANON}`,
          apikey: SUPABASE_ANON,
        },
        body: JSON.stringify({
          slug: "mina",
          message: m,
          history: msgs.slice(-10).map((x) => ({ role: x.role, content: x.content })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `chat ${res.status}`);
      reply = data.reply ?? "...";
      if (data.reaction) onReaction?.(data.reaction as Reaction);
    } catch (err: any) {
      console.error("[mina-chat] failed", err);
      reply = `Mmh… ${err?.message || "something got tangled"}. Try again?`;
    }
    setMsgs((p) => [...p, { role: "assistant", content: reply }]);
    setSending(false);
    onAfterReply?.();
    if (voiceOn) void speak(reply);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Transcript — fades into the void */}
      {(msgs.length > 0 || sending) && (
        <div
          ref={scrollRef}
          className="max-h-[32vh] overflow-y-auto scrollbar-hide flex flex-col gap-2 px-1 py-2"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 10%, rgba(0,0,0,0.6) 30%, #000 55%)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 10%, rgba(0,0,0,0.6) 30%, #000 55%)",
          }}
        >
          {msgs.slice(-8).map((m, i, arr) => {
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
          {sending && (
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
        </div>
      )}


      {/* Composer — glass pill */}
      <form
        onSubmit={send}
        className="flex items-center gap-2 pl-3 pr-2 h-14 rounded-full bg-white/[0.07] backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.4)]"
      >
        <button
          type="button"
          onClick={() => setVoiceOn((v) => !v)}
          title={voiceOn ? "Voice replies on" : "Voice replies off"}
          className={`w-10 h-10 rounded-full flex items-center justify-center border transition shrink-0 ${
            voiceOn
              ? "bg-white text-[hsl(220_25%_10%)] border-white"
              : "bg-white/[0.06] hover:bg-white/[0.12] text-white/70 border-white/10"
          }`}
        >
          {voiceOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message Mina…"
          className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="w-10 h-10 rounded-full bg-white text-[hsl(220_25%_10%)] flex items-center justify-center disabled:opacity-30 hover:scale-105 transition shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatComposer;
