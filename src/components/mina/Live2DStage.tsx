import { useEffect, useRef, useState } from "react";

interface Props {
  /** 0–1; drives mouth open parameter while speaking */
  mouthOpen?: number;
  /** degrees, -45..45 */
  rotation?: number;
  /** 0.5..1.5 */
  scale?: number;
  mirror?: boolean;
  /** Optional override of model3.json URL */
  modelUrl?: string;
}

const CUBISM4_CORE = "https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js";
// Free Cubism 4 sample model (Haru) bundled with pixi-live2d-display tests
const DEFAULT_MODEL =
  "https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/test/assets/haru/haru_greeter_t03.model3.json";

let corePromise: Promise<void> | null = null;
const loadCubismCore = () => {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as any).Live2DCubismCore) return Promise.resolve();
  if (corePromise) return corePromise;
  corePromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = CUBISM4_CORE;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Live2D Cubism Core"));
    document.head.appendChild(s);
  });
  return corePromise;
};

const Live2DStage = ({
  mouthOpen = 0,
  rotation = 0,
  scale = 1,
  mirror = false,
  modelUrl = DEFAULT_MODEL,
}: Props) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<any>(null);
  const modelRef = useRef<any>(null);
  const mouthRef = useRef(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string>("");

  // Keep latest mouthOpen in a ref for the ticker
  useEffect(() => {
    mouthRef.current = mouthOpen;
  }, [mouthOpen]);

  useEffect(() => {
    let cancelled = false;
    let app: any;
    let model: any;
    let mouthTick: ((d: number) => void) | null = null;

    (async () => {
      try {
        await loadCubismCore();
        if (cancelled) return;

        const PIXI = await import("pixi.js");
        // Expose PIXI globally so pixi-live2d-display can find Ticker
        (window as any).PIXI = PIXI;
        const { Live2DModel } = await import("pixi-live2d-display/cubism4");
        Live2DModel.registerTicker(PIXI.Ticker);

        if (cancelled || !hostRef.current) return;

        const rect = hostRef.current.getBoundingClientRect();
        app = new PIXI.Application({
          width: Math.max(1, Math.floor(rect.width)),
          height: Math.max(1, Math.floor(rect.height)),
          backgroundAlpha: 0,
          antialias: true,
          autoDensity: true,
          resolution: window.devicePixelRatio || 1,
        });
        appRef.current = app;
        hostRef.current.appendChild(app.view as HTMLCanvasElement);

        model = await Live2DModel.from(modelUrl, { autoInteract: false });
        if (cancelled) {
          model?.destroy?.();
          return;
        }
        modelRef.current = model;
        app.stage.addChild(model);

        const fit = () => {
          if (!appRef.current || !modelRef.current || !hostRef.current) return;
          const r = hostRef.current.getBoundingClientRect();
          appRef.current.renderer.resize(r.width, r.height);
          const m = modelRef.current;
          const s = Math.min(r.width / m.width, r.height / m.height) * 0.95;
          m.scale.set(s);
          m.x = r.width / 2;
          m.y = r.height - m.height * s;
          m.anchor?.set?.(0.5, 0);
          // anchor may not exist; fall back to manual offset
          if (!m.anchor) {
            m.x = (r.width - m.width * s) / 2;
            m.y = r.height - m.height * s;
          }
        };
        fit();
        const ro = new ResizeObserver(fit);
        ro.observe(hostRef.current);
        (model as any).__ro = ro;

        // Drive mouth parameter each frame
        mouthTick = () => {
          try {
            const core = model.internalModel?.coreModel;
            if (core?.setParameterValueById) {
              core.setParameterValueById("ParamMouthOpenY", mouthRef.current);
            }
          } catch {}
        };
        app.ticker.add(mouthTick);

        // Idle motion if available
        try {
          model.motion("Idle");
        } catch {}

        setStatus("ready");
      } catch (e: any) {
        console.error("[Live2D] load failed", e);
        if (!cancelled) {
          setError(e?.message || String(e));
          setStatus("error");
        }
      }
    })();

    return () => {
      cancelled = true;
      try {
        if (model?.__ro) (model.__ro as ResizeObserver).disconnect();
        if (mouthTick && app?.ticker) app.ticker.remove(mouthTick);
        model?.destroy?.({ children: true });
        app?.destroy?.(true, { children: true, texture: true, baseTexture: true });
      } catch {}
      appRef.current = null;
      modelRef.current = null;
    };
  }, [modelUrl]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Soft floor glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-48 rounded-[50%] bg-[radial-gradient(ellipse_at_center,hsl(230_60%_40%/0.35),transparent_70%)] blur-2xl" />

      {/* Wrapper: user controls (rotation/scale/mirror) + subtle idle sway */}
      <div
        ref={hostRef}
        className="absolute inset-0 mina-idle transition-transform duration-300 ease-out"
        style={{
          transform: `rotate(${rotation}deg) scale(${scale}) scaleX(${mirror ? -1 : 1})`,
          transformOrigin: "bottom center",
        }}
      />

      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-white/60">
          Loading character…
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-x-0 bottom-6 mx-auto max-w-sm rounded-lg bg-white/[0.07] backdrop-blur px-4 py-3 text-xs text-white/80 text-center">
          Couldn't load Live2D model. {error}
        </div>
      )}

      <style>{`
        @keyframes minaIdle {
          0%   { translate: 0 0; }
          50%  { translate: 0 -4px; }
          100% { translate: 0 0; }
        }
        .mina-idle { animation: minaIdle 5.2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Live2DStage;
