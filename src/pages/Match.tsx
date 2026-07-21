import { useEffect, useMemo, useState } from "react";
import MatchDeck from "@/components/match/MatchDeck";
import MatchFlash from "@/components/match/MatchFlash";
import MatchIntro from "@/components/match/MatchIntro";
import MatchChat from "@/components/match/MatchChat";
import MatchProfile from "@/components/match/MatchProfile";
import CreateYourOwnDialog from "@/components/funnel/CreateYourOwnDialog";
import {
  createCardById,
  type CreateCardId,
  type ScenarioId,
} from "@/components/match/scenarios";

type Phase = "deck" | "profile" | "flash" | "intro" | "chat";

export default function Match() {
  const [phase, setPhase] = useState<Phase>("deck");
  const [picked, setPicked] = useState<ScenarioId | null>(null);
  const [createCard, setCreateCard] = useState<CreateCardId | null>(null);

  useEffect(() => {
    document.title = "Sparks — Match & chat with your fantasy";
  }, []);

  const selectedCreate = useMemo(
    () => (createCard ? createCardById(createCard) : null),
    [createCard],
  );

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
          onCreate={(id) => setCreateCard(id)}
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
        <MatchFlash id={picked} onDone={() => setPhase("intro")} />
      )}
      {phase === "intro" && picked && (
        <MatchIntro
          id={picked}
          onReply={() => setPhase("chat")}
          onBack={() => setPhase("deck")}
        />
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

      {selectedCreate && (
        <CreateYourOwnDialog
          open={!!selectedCreate}
          onClose={() => setCreateCard(null)}
          imageUrl={selectedCreate.imageUrl}
          accent={selectedCreate.accent}
          title={selectedCreate.title}
          description={selectedCreate.description}
          benefits={selectedCreate.benefits}
          ctaLabel={selectedCreate.ctaLabel}
          ctaUrl={selectedCreate.ctaUrl}
        />
      )}
    </div>
  );
}
