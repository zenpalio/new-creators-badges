import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  PopunderCharacter,
  PopunderVariantId,
  popunderVariants,
} from "../data/popunderVariants";
import PopunderShell from "../components/popunder/PopunderShell";
import CharacterSelector from "../components/popunder/CharacterSelector";
import MatchingStep from "../components/popunder/MatchingStep";
import MatchReveal from "../components/popunder/MatchReveal";
import SocialProofTicker from "../components/popunder/SocialProofTicker";

type Step = "select" | "matching" | "reveal";

export default function Popunder() {
  const { variant: variantParam } = useParams<{ variant: string }>();
  const variant =
    popunderVariants[(variantParam as PopunderVariantId)] ??
    popunderVariants["hetero-nsfw"];

  const [step, setStep] = useState<Step>("select");
  const [picked, setPicked] = useState<PopunderCharacter | null>(null);

  return (
    <PopunderShell variant={variant}>
      {/* Close button (floats top-right) */}
      <button
        type="button"
        className="absolute right-3 top-3 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-sm text-white/60 ring-1 ring-white/10 hover:text-white"
        onClick={() => window.close()}
        aria-label="Close"
      >
        ✕
      </button>


      {/* Step */}
      {step === "select" && (
        <CharacterSelector
          variant={variant}
          onPick={(c) => {
            setPicked(c);
            setStep("matching");
          }}
        />
      )}
      {step === "matching" && picked && (
        <MatchingStep
          variant={variant}
          picked={picked}
          onDone={() => setStep("reveal")}
        />
      )}
      {step === "reveal" && picked && <MatchReveal variant={variant} picked={picked} />}

      {/* Bottom proof */}
      <div className="pt-3">
        <SocialProofTicker label={variant.proofLabel} />
      </div>
    </PopunderShell>
  );
}
