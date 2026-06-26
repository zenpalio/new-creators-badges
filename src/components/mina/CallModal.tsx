import { useEffect, useRef, useState } from "react";
import { Phone, PhoneOff, X } from "lucide-react";
import { useConversation, ConversationProvider } from "@elevenlabs/react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  onMouthLevel: (v: number) => void;
  onTick: () => void;
}

const CallModalInner = ({ open, onClose, onMouthLevel, onTick }: Props) => {
  const [status, setStatus] = useState<"idle" | "connecting" | "live" | "ended">("idle");
  const [seconds, setSeconds] = useState(0);
  const [freeLeft, setFreeLeft] = useState<number | null>(null);
  const [tokensLeft, setTokensLeft] = useState<number | null>(null);
  const tickAccum = useRef(0);

  const conversation = useConversation({
    onConnect: () => setStatus("live"),
    onDisconnect: () => setStatus("ended"),
    onError: (e: any) => { toast.error("Call dropped"); console.error(e); setStatus("ended"); },
  });

  // Drive mouth from output audio levels
  useEffect(() => {
    if (status !== "live") { onMouthLevel(0); return; }
    let raf = 0;
    const loop = () => {
      try {
        const level = conversation.getOutputVolume?.() ?? 0;
        onMouthLevel(Math.min(1, level * 1.5));
      } catch {}
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [status, conversation, onMouthLevel]);

  // Tick seconds + bill every 10s
  useEffect(() => {
    if (status !== "live") return;
    const id = setInterval(async () => {
      setSeconds((s) => s + 1);
      tickAccum.current += 1;
      if (tickAccum.current >= 10) {
        const chunk = tickAccum.current;
        tickAccum.current = 0;
        try {
          const { data, error } = await supabase.rpc("consume_call_seconds", {
            _companion_slug: "mina", _seconds: chunk, _intimate: false,
          });
          if (error) throw error;
          const row = (data as any[])?.[0];
          if (row) {
            setTokensLeft(row.tokens_balance);
            setFreeLeft(row.free_remaining);
            if (row.stopped) {
              toast.error("Out of tokens — call ended");
              await conversation.endSession();
              setStatus("ended");
              onTick();
            }
          }
        } catch (e) { console.error(e); }
      }
    }, 1000);
    return () => clearInterval(id);
  }, [status, conversation, onTick]);

  const startCall = async () => {
    setStatus("connecting");
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const { data, error } = await supabase.functions.invoke("elevenlabs-token", { body: { slug: "mina" } });
      if (error) throw error;
      if (data?.error) {
        toast.error(data.message ?? data.error);
        setStatus("idle");
        return;
      }
      await conversation.startSession({
        conversationToken: data.token,
        connectionType: "webrtc",
        overrides: data.overrides,
      });
    } catch (e: any) {
      toast.error(e.message ?? "Couldn't start call");
      setStatus("idle");
    }
  };

  const endCall = async () => {
    await conversation.endSession();
    setStatus("ended");
    onTick();
  };

  useEffect(() => {
    if (!open) {
      if (status === "live") { try { void conversation.endSession(); } catch {} }
      setStatus("idle");
      setSeconds(0);
      tickAccum.current = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-white/[0.07] backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] rounded-3xl p-7 text-center relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-white/70"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="w-24 h-24 mx-auto rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/15 flex items-center justify-center mb-5 relative">
          <span className="text-4xl">💋</span>
          {status === "live" && (
            <>
              <span className="absolute inset-0 rounded-full ring-2 ring-white/40 animate-ping" />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            </>
          )}
        </div>

        <h3 className="text-lg font-medium text-white/95">Mina</h3>
        <p className="text-xs text-white/50 mb-5">
          {status === "idle"       && "Tap to call · 60s free / day, then 1 token/min"}
          {status === "connecting" && "Connecting…"}
          {status === "live"       && fmt(seconds)}
          {status === "ended"      && "Call ended"}
        </p>

        {status === "live" && (
          <div className="flex justify-center gap-3 mb-5">
            {freeLeft !== null && freeLeft > 0 && (
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white/70 tabular-nums">
                Free {freeLeft}s
              </span>
            )}
            {tokensLeft !== null && (
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white/70 tabular-nums">
                {tokensLeft} tokens
              </span>
            )}
          </div>
        )}

        {(status === "idle" || status === "ended") ? (
          <button
            onClick={startCall}
            className="w-16 h-16 mx-auto rounded-full bg-white text-[hsl(220_25%_10%)] hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(255,255,255,0.15)] flex items-center justify-center transition"
            title="Start call"
          >
            <Phone className="w-6 h-6" />
          </button>
        ) : (
          <button
            onClick={endCall}
            className="w-16 h-16 mx-auto rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-white hover:scale-105 active:scale-95 flex items-center justify-center transition"
            title="End call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

const CallModal = (props: Props) => (
  <ConversationProvider>
    <CallModalInner {...props} />
  </ConversationProvider>
);

export default CallModal;
