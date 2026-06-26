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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-sm bg-card-v2 rounded-3xl border border-border-v2/50 p-6 text-center relative">
        <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full hover:bg-muted-v2 flex items-center justify-center">
          <X className="w-4 h-4" />
        </button>

        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center mb-4 relative">
          <span className="text-4xl">💋</span>
          {status === "live" && (
            <span className="absolute inset-0 rounded-full ring-4 ring-red-500/40 animate-ping" />
          )}
        </div>

        <h3 className="text-xl font-bold text-foreground-v2">Mina</h3>
        <p className="text-xs text-muted-v2-foreground mb-4">
          {status === "idle"   && "Tap to call · 60s free / day, then 1 🪙/min"}
          {status === "connecting" && "Connecting…"}
          {status === "live"   && fmt(seconds)}
          {status === "ended"  && "Call ended"}
        </p>

        {status === "live" && (
          <div className="flex justify-center gap-4 text-xs text-muted-v2-foreground mb-4">
            {freeLeft !== null && freeLeft > 0 && <span>Free: {freeLeft}s</span>}
            {tokensLeft !== null && <span>🪙 {tokensLeft}</span>}
          </div>
        )}

        {(status === "idle" || status === "ended") ? (
          <button onClick={startCall} className="w-16 h-16 mx-auto rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center text-white">
            <Phone className="w-6 h-6" />
          </button>
        ) : (
          <button onClick={endCall} className="w-16 h-16 mx-auto rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white">
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
