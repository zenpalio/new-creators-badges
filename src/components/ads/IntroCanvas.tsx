import { useEffect, useRef } from "react";
import { drawIntroFrame, INTRO_FPS, INTRO_FRAMES, INTRO_H, INTRO_W, type IntroConfig } from "../../lib/adsStudio/introFrames";

interface Props {
  config: IntroConfig;
  playing: boolean;
  frame?: number; // if provided, render this specific frame instead of animating
  onEnd?: () => void;
  className?: string;
}

const IntroCanvas = ({ config, playing, frame, onEnd, className }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    if (typeof frame === "number") {
      drawIntroFrame(ctx, Math.max(0, Math.min(INTRO_FRAMES - 1, frame)), config);
      return;
    }

    if (!playing) {
      drawIntroFrame(ctx, 0, config);
      return;
    }

    startRef.current = null;
    const tick = (ts: number) => {
      if (startRef.current == null) startRef.current = ts;
      const elapsed = (ts - startRef.current) / 1000;
      const f = Math.floor(elapsed * INTRO_FPS);
      if (f >= INTRO_FRAMES) {
        drawIntroFrame(ctx, INTRO_FRAMES - 1, config);
        onEnd?.();
        return;
      }
      drawIntroFrame(ctx, f, config);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, frame, config, onEnd]);

  return (
    <canvas
      ref={canvasRef}
      width={INTRO_W}
      height={INTRO_H}
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
};

export default IntroCanvas;
