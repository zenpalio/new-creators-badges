import { useState, useRef, useEffect } from "react";
import { Send, Volume2, VolumeX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Msg { role: "user" | "assistant"; content: string; }

const MOCK_REPLIES = [
  "Mm, tell me more~",
  "I was just thinking about you.",
  "You always know what to say.",
  "Stay a little longer?",
  "That made me smile.",
];

const VOICE_KEY = "mina.voiceOn";

const ChatComposer = ({ onAfterReply }: { onAfterReply?: () => void }) => {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [voiceOn, setVoiceOn] = useState(() => {
    try { return localStorage.getItem(VOICE_KEY) === "1"; } catch { return false; }
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, sending]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    try { localStorage.setItem(VOICE_KEY, voiceOn ? "1" : "0"); } catch {}
    if (!voiceOn && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, [voiceOn]);

  const speak = async (line: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("mina-tts", {
        body: { text: line },
      });
      if (error) throw error;
      // edge function returns audio/mpeg blob via invoke
      const blob = data instanceof Blob ? data : new Blob([data], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      // stop any previous line
      if (audioRef.current) { try { audioRef.current.pause(); } catch {} }
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => URL.revokeObjectURL(url);
      await audio.play().catch(() => {});
    } catch (e) {
      console.error("[tts] failed", e);
    }
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const m = text.trim();
    if (!m || sending) return;
    setText("");
    setMsgs((p) => [...p, { role: "user", content: m }]);
    setSending(true);
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
    const reply = MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];
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
            // Older items toward the top get a touch lower opacity to enhance the void feel
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
                  <div className="max-w-[80%] px-4 py-2 rounded-2xl rounded-bl-md text-sm text-white bg-white/[0.08] backdrop-blur-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.45)] leading-relaxed">
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
