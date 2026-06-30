import { useState, useRef, useEffect } from "react";
import { Send, Play, Swords, Flame } from "lucide-react";

type Msg = { role: "narrator" | "user" | "character"; speaker?: string; content: string };

const OPENING: Msg[] = [
  {
    role: "narrator",
    content:
      "The longships cut the morning fog. You are eight winters old when their shadows fall across the shore.",
  },
  {
    role: "narrator",
    content:
      "From the treeline you watch the thatch of your father's hall catch fire. You do not scream. You remember faces.",
  },
];

const CHOICES = [
  { id: "hide", label: "Stay hidden. Watch. Remember.", icon: Flame },
  { id: "run", label: "Run for the river before they see you.", icon: Play },
  { id: "fight", label: "Pick up your father's axe.", icon: Swords },
];

const Saga = () => {
  const [msgs, setMsgs] = useState<Msg[]>(OPENING);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [choicesVisible, setChoicesVisible] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, sending]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const send = async (override?: string) => {
    const m = (override ?? text).trim();
    if (!m || sending) return;
    if (!override) setText("");
    setMsgs((p) => [...p, { role: "user", content: m }]);
    setChoicesVisible(false);
    setSending(true);

    // TODO: wire to edge function. Local placeholder reply.
    await new Promise((r) => setTimeout(r, 900));
    setMsgs((p) => [
      ...p,
      {
        role: "narrator",
        content:
          "The wind takes your decision and scatters it across the sand. Somewhere, a raven answers.",
      },
    ]);
    setSending(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const pickChoice = (label: string) => {
    void send(label);
  };

  return (
    <div className="min-h-screen w-full bg-[hsl(220_25%_4%)] text-white flex flex-col">
      {/* Chapter header */}
      <div className="px-5 sm:px-8 pt-5 pb-3 flex items-center justify-between border-b border-white/5">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-white/40">
            Season I · Episode 1
          </div>
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
            Ashes on the Shore
          </h1>
        </div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">
          Chapter 1 of 8
        </div>
      </div>

      {/* Cinematic stage — video placeholder */}
      <div className="relative w-full aspect-video bg-black overflow-hidden">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse at 30% 40%, hsl(15 60% 25% / 0.7), transparent 60%), radial-gradient(ellipse at 70% 70%, hsl(220 40% 10% / 0.9), transparent 70%), linear-gradient(180deg, hsl(220 30% 8%), hsl(15 40% 6%))",
          }}
        />
        {/* film grain */}
        <div
          className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-xl text-[11px] tracking-wide text-white/70">
              <Play className="w-3 h-3" />
              Cutscene · loading shot
            </div>
            <div className="mt-3 text-[11px] uppercase tracking-[0.3em] text-white/30">
              Vikings make shore
            </div>
          </div>
        </div>
        {/* letterbox */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-black" />
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-black" />
      </div>

      {/* Transcript */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 flex flex-col gap-4 max-w-3xl w-full mx-auto"
      >
        {msgs.map((m, i) => {
          if (m.role === "narrator") {
            return (
              <div key={i} className="animate-fade-in">
                <div className="text-[10px] uppercase tracking-[0.25em] text-white/30 mb-1.5">
                  Narrator
                </div>
                <p className="text-[15px] leading-relaxed text-white/85 italic font-serif">
                  {m.content}
                </p>
              </div>
            );
          }
          if (m.role === "character") {
            return (
              <div key={i} className="animate-fade-in">
                <div className="text-[10px] uppercase tracking-[0.25em] text-amber-200/70 mb-1.5">
                  {m.speaker ?? "Unknown"}
                </div>
                <p className="text-[15px] leading-relaxed text-white/90">
                  "{m.content}"
                </p>
              </div>
            );
          }
          return (
            <div key={i} className="animate-fade-in self-end max-w-[80%]">
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-1.5 text-right">
                You
              </div>
              <div className="px-4 py-2.5 rounded-2xl rounded-br-md bg-white text-[hsl(220_25%_8%)] text-sm shadow-lg">
                {m.content}
              </div>
            </div>
          );
        })}

        {sending && (
          <div className="animate-fade-in">
            <div className="text-[10px] uppercase tracking-[0.25em] text-white/30 mb-1.5">
              Narrator
            </div>
            <span className="inline-flex gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
              <span
                className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse"
                style={{ animationDelay: "0.15s" }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse"
                style={{ animationDelay: "0.3s" }}
              />
            </span>
          </div>
        )}

        {choicesVisible && !sending && (
          <div className="mt-2 flex flex-col gap-2 animate-fade-in">
            <div className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-1">
              What do you do?
            </div>
            {CHOICES.map((c) => {
              const Icon = c.icon;
              return (
                <button
                  key={c.id}
                  onClick={() => pickChoice(c.label)}
                  className="group text-left px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition flex items-center gap-3"
                >
                  <span className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/70 group-hover:text-white">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-[14px] text-white/85 group-hover:text-white">
                    {c.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-white/5 bg-[hsl(220_25%_5%)]/80 backdrop-blur-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
          className="max-w-3xl mx-auto px-5 sm:px-8 py-4 flex items-center gap-2"
        >
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Or write your own action…"
            disabled={sending}
            className="flex-1 h-12 px-4 rounded-full bg-white/[0.05] border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/25"
          />
          <button
            type="submit"
            disabled={sending || !text.trim()}
            className="h-12 w-12 rounded-full bg-white text-[hsl(220_25%_8%)] flex items-center justify-center disabled:opacity-30 hover:scale-105 transition shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Saga;
