import { useEffect, useState } from "react";
import MatchDeck from "@/components/match/MatchDeck";
import MatchFlash from "@/components/match/MatchFlash";
import MatchColdOpen from "@/components/match/MatchColdOpen";
import MatchChat from "@/components/match/MatchChat";
import MatchProfile from "@/components/match/MatchProfile";
import type { ScenarioId } from "@/components/match/scenarios";

type Phase = "deck" | "profile" | "flash" | "coldopen" | "chat";

export default function Match() {
  const [phase, setPhase] = useState<Phase>("deck");
  const [picked, setPicked] = useState<ScenarioId | null>(null);

  useEffect(() => {
    document.title = "Sparks — Match & chat with your fantasy";
  }, []);

  return (
    <div className="min-h-[100dvh] bg-black text-white">
      {phase === "deck" && (
        <MatchDeck
          onMatch={(id) => {
            setPicked(id);
            setPhase("flash");
          }}
          onPreview={(id) => {
            setPicked(id);
            setPhase("profile");
          }}
        />
      )}
      {phase === "profile" && picked && (
        <MatchProfile
          id={picked}
          onBack={() => setPhase("deck")}
          onMatch={() => setPhase("flash")}
          onPass={() => {
            setPicked(null);
            setPhase("deck");
          }}
        />
      )}
      {phase === "flash" && picked && (
        <MatchFlash id={picked} onDone={() => setPhase("coldopen")} />
      )}
      {phase === "coldopen" && picked && (
        <MatchColdOpen id={picked} onReply={() => setPhase("chat")} />
      )}
      {phase === "chat" && picked && (
        <MatchChat
          id={picked}
          onBack={() => {
            setPicked(null);
            setPhase("deck");
          }}
        />
      )}
    </div>
  );
}

