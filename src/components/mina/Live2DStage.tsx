import { useEffect, useState } from "react";
import minaImg from "@/assets/mina-character.png";

interface Props {
  /** 0–1; subtle mouth/head bounce while speaking */
  mouthOpen?: number;
  expression?: string | null;
}

/**
 * Animated VTuber stage. Uses a high-quality portrait with
 * idle breathing + sway + speak bounce. Reliable replacement
 * for the Live2D runtime which has incompatibilities with Pixi v7.
 */
const Live2DStage = ({ mouthOpen = 0 }: Props) => {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    let t: number;
    const loop = () => {
      setBlink(true);
      window.setTimeout(() => setBlink(false), 140);
      t = window.setTimeout(loop, 2800 + Math.random() * 2600);
    };
    t = window.setTimeout(loop, 1800);
    return () => window.clearTimeout(t);
  }, []);

  const speaking = mouthOpen > 0.05;

  return (
    <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
      {/* Soft floor glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-40 rounded-[50%] bg-[radial-gradient(ellipse_at_center,hsl(350_95%_55%/0.35),transparent_70%)] blur-2xl pointer-events-none" />

      <div
        className="relative h-[92%] max-h-[820px] aspect-[7/10] mina-idle"
        style={{
          transform: speaking ? "translateY(-2px) scale(1.005)" : undefined,
          transition: "transform 120ms ease-out",
        }}
      >
        <img
          src={minaImg}
          alt="Mina"
          className="w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)] select-none"
          draggable={false}
        />
        {/* Blink overlay — thin dark line across eye region */}
        <div
          className="absolute left-0 right-0 mx-auto pointer-events-none transition-opacity duration-100"
          style={{
            top: "32%",
            height: "3.5%",
            width: "44%",
            background:
              "linear-gradient(to bottom, transparent, rgba(20,10,15,0.85), transparent)",
            borderRadius: "40%",
            opacity: blink ? 0.95 : 0,
            filter: "blur(1px)",
          }}
        />
      </div>

      <style>{`
        @keyframes minaIdle {
          0%   { transform: translateY(0px) rotate(0deg); }
          50%  { transform: translateY(-6px) rotate(0.4deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .mina-idle { animation: minaIdle 5.2s ease-in-out infinite; transform-origin: bottom center; }
      `}</style>
    </div>
  );
};

export default Live2DStage;
