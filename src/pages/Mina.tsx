import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Gift, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCompanion } from "@/hooks/useCompanion";
import Live2DStage from "@/components/mina/Live2DStage";
import AffectionHUD from "@/components/mina/AffectionHUD";
import ChatComposer from "@/components/mina/ChatComposer";
import GiftDrawer from "@/components/mina/GiftDrawer";
import CallModal from "@/components/mina/CallModal";

const Mina = () => {
  const nav = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [mouth, setMouth] = useState(0);
  const [giftOpen, setGiftOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const { state, refresh } = useCompanion("mina");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { nav("/mina/auth", { replace: true }); return; }
      setAuthed(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) nav("/mina/auth", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [nav]);

  if (!authed || !state) {
    return <div className="min-h-screen bg-background-v2 flex items-center justify-center text-muted-v2-foreground text-sm">Waking Mina…</div>;
  }

  const signOut = async () => {
    await supabase.auth.signOut();
    nav("/mina/auth", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background-v2 relative overflow-hidden">
      {/* Ambient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(0,0%,6%)] via-[hsl(350,30%,10%)] to-[hsl(0,0%,4%)]" />
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,hsl(350_95%_55%/0.25),transparent_60%),radial-gradient(circle_at_70%_80%,hsl(213_100%_50%/0.18),transparent_60%)]" />

      {/* Live2D model — takes the upper area, leaves bottom for chat */}
      <div className="absolute inset-0 bottom-[40vh] md:bottom-0 md:right-[360px]">
        <Live2DStage mouthOpen={mouth} />
      </div>

      <AffectionHUD state={state} />

      {/* Sign out */}
      <button
        onClick={signOut}
        className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-background-v2/70 backdrop-blur-md border border-border-v2/40 flex items-center justify-center text-muted-v2-foreground hover:text-foreground-v2"
        title="Sign out"
      >
        <LogOut className="w-4 h-4" />
      </button>

      {/* Action rail */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3 md:right-[376px]">
        <button
          onClick={() => setCallOpen(true)}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-900/40 flex items-center justify-center text-white hover:scale-105 transition"
          title="Call Mina"
        >
          <Phone className="w-5 h-5" />
        </button>
        <button
          onClick={() => setGiftOpen(true)}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-600 shadow-lg shadow-red-900/40 flex items-center justify-center text-white hover:scale-105 transition"
          title="Send a gift"
        >
          <Gift className="w-5 h-5" />
        </button>
      </div>

      {/* Chat — bottom sheet on mobile, right rail on desktop */}
      <div className="absolute bottom-0 left-0 right-0 h-[40vh] md:top-0 md:left-auto md:bottom-0 md:right-0 md:w-[360px] md:h-screen z-10 bg-background-v2/40 backdrop-blur-xl border-t md:border-t-0 md:border-l border-border-v2/40 flex flex-col">
        <ChatComposer onAfterReply={refresh} />
      </div>

      <GiftDrawer open={giftOpen} onClose={() => setGiftOpen(false)} balance={state.tokens_balance} onPurchased={refresh} />
      <CallModal open={callOpen} onClose={() => { setCallOpen(false); refresh(); }} onMouthLevel={setMouth} onTick={refresh} />
    </div>
  );
};

export default Mina;
