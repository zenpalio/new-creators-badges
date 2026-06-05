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
      {/* Top brand bar */}
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
          Exclusive · {variant.nsfw ? "18+" : "Preview"}
        </div>
        <button
          type="button"
          className="text-xs text-white/40 hover:text-white/70"
          onClick={() => window.close()}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

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
