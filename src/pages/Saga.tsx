import { useState, useRef, useEffect } from "react";
import { Send, Play, Swords, Flame, Volume2, VolumeX } from "lucide-react";

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
  const [muted, setMuted] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, sending, choicesVisible]);

  const send = async (override?: string) => {
    const m = (override ?? text).trim();
    if (!m || sending) return;
    if (!override) setText("");
    setMsgs((p) => [...p, { role: "user", content: m }]);
    setChoicesVisible(false);
    setSending(true);
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

  return (
    <div className="min-h-screen w-full bg-black text-white flex items-center justify-center">
      {/* 9:16 stage — mobile-first, centered on larger screens */}
      <div className="relative w-full h-screen sm:h-[100dvh] sm:max-w-[min(100vw,calc(100dvh*9/16))] sm:aspect-[9/16] sm:max-h-[100dvh] overflow-hidden bg-black">
        {/* Background video / cutscene placeholder — fills entire stage */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 30% 30%, hsl(15 70% 28% / 0.85), transparent 55%), radial-gradient(ellipse at 70% 80%, hsl(220 50% 8% / 0.95), transparent 65%), linear-gradient(180deg, hsl(220 35% 6%), hsl(15 45% 5%))",
            }}
          />
          {/* film grain */}
          <div
            className="absolute inset-0 opacity-[0.1] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")",
            }}
          />
          {/* center marker for the awaiting-video state */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-xl text-[11px] tracking-wide text-white/60">
              <Play className="w-3 h-3" />
              Vikings make shore
            </div>
          </div>
        </div>

        {/* Bottom gradient veil — keeps chat readable over video */}
        <div
          className="absolute inset-x-0 bottom-0 h-[70%] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.75) 65%, rgba(0,0,0,0.92) 100%)",
          }}
        />

        {/* Top HUD */}
        <div className="absolute top-0 inset-x-0 px-4 pt-4 pb-6 flex items-start justify-between z-20 pointer-events-none">
          <div className="pointer-events-auto">
            <div className="text-[9px] uppercase tracking-[0.25em] text-white/60">
              S1 · E1
            </div>
            <h1 className="text-[15px] font-semibold tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Ashes on the Shore
            </h1>
          </div>
          <button
            onClick={() => setMuted((m) => !m)}
            className="pointer-events-auto w-9 h-9 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/15 flex items-center justify-center text-white/80 hover:bg-white/[0.14] transition"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Chat layer — bottom half overlays the video */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col max-h-[62%]">
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-8 pb-2 flex flex-col gap-3"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 12%, #000 30%)",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 12%, #000 30%)",
            }}
          >
            {msgs.map((m, i) => {
              if (m.role === "narrator") {
                return (
                  <p
                    key={i}
                    className="animate-fade-in text-[14px] leading-relaxed text-white/90 italic font-serif text-center px-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
                  >
                    {m.content}
                  </p>
                );
              }
              if (m.role === "character") {
                return (
                  <div key={i} className="animate-fade-in self-start max-w-[85%]">
                    <div className="text-[9px] uppercase tracking-[0.25em] text-amber-200/80 mb-1">
                      {m.speaker ?? "Unknown"}
                    </div>
                    <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-md bg-white/[0.1] backdrop-blur-xl border border-white/15 text-[14px] text-white leading-snug shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                      {m.content}
                    </div>
                  </div>
                );
              }
              return (
                <div key={i} className="animate-fade-in self-end max-w-[85%]">
                  <div className="px-3.5 py-2.5 rounded-2xl rounded-br-md bg-white text-[hsl(220_25%_8%)] text-[14px] leading-snug shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
                    {m.content}
                  </div>
                </div>
              );
            })}

            {sending && (
              <div className="animate-fade-in self-center">
                <span className="inline-flex gap-1.5 px-3 py-2 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse"
                    style={{ animationDelay: "0.15s" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse"
                    style={{ animationDelay: "0.3s" }}
                  />
                </span>
              </div>
            )}

            {choicesVisible && !sending && (
              <div className="mt-1 flex flex-col gap-2 animate-fade-in">
                {CHOICES.map((c) => {
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.id}
                      onClick={() => void send(c.label)}
                      className="group text-left px-3.5 py-3 rounded-xl bg-black/40 hover:bg-black/55 backdrop-blur-xl border border-white/15 hover:border-white/30 transition flex items-center gap-3 shadow-[0_6px_20px_rgba(0,0,0,0.5)]"
                    >
                      <span className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-white/85 shrink-0">
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="text-[13.5px] text-white/95 leading-snug">
                        {c.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
            className="px-3 pt-2 pb-[max(12px,env(safe-area-inset-bottom))] flex items-center gap-2"
          >
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your action…"
              disabled={sending}
              className="flex-1 h-11 px-4 rounded-full bg-white/[0.1] backdrop-blur-xl border border-white/15 text-[14px] text-white placeholder:text-white/40 focus:outline-none focus:border-white/30"
            />
            <button
              type="submit"
              disabled={sending || !text.trim()}
              className="h-11 w-11 rounded-full bg-white text-[hsl(220_25%_8%)] flex items-center justify-center disabled:opacity-30 hover:scale-105 transition shrink-0 shadow-[0_6px_20px_rgba(0,0,0,0.5)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Saga;
