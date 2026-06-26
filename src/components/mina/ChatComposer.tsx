import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface Msg { role: "user" | "assistant"; content: string; }

const MOCK_REPLIES = [
  "Mm, tell me more~",
  "I was just thinking about you.",
  "You always know what to say.",
  "Stay a little longer?",
  "That made me smile.",
];

const ChatComposer = ({ onAfterReply }: { onAfterReply?: () => void }) => {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, sending]);

  useEffect(() => { inputRef.current?.focus(); }, []);

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
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Transcript — floats above input, transparent surface */}
      {(msgs.length > 0 || sending) && (
        <div
          ref={scrollRef}
          className="max-h-[28vh] overflow-y-auto scrollbar-hide flex flex-col gap-2 px-1"
        >
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "user" ? (
                <div className="max-w-[75%] px-4 py-2 rounded-2xl rounded-br-md text-sm bg-white/90 text-[hsl(220_25%_10%)] shadow-lg">
                  {m.content}
                </div>
              ) : (
                <div className="max-w-[80%] text-sm text-white/95 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  {m.content}
                </div>
              )}
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <span className="inline-flex gap-1 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" style={{ animationDelay: "0.15s" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" style={{ animationDelay: "0.3s" }} />
              </span>
            </div>
          )}
        </div>
      )}

      {/* Composer — glass pill */}
      <form
        onSubmit={send}
        className="flex items-center gap-2 pl-5 pr-2 h-14 rounded-full bg-white/[0.07] backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.4)]"
      >
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
          className="w-10 h-10 rounded-full bg-white text-[hsl(220_25%_10%)] flex items-center justify-center disabled:opacity-30 hover:scale-105 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatComposer;
