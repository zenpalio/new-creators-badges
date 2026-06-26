import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  /** 0–1; drives mouth open parameter while speaking */
  mouthOpen?: number;
  /** When true, plays a talking body motion and loops gentle gestures */
  speaking?: boolean;
  /** degrees, -45..45 */
  rotation?: number;
  /** 0.5..1.5 */
  scale?: number;
  mirror?: boolean;
  /** Optional override of model3.json URL */
  modelUrl?: string;
  /** Show debug panel to trigger motions/expressions */
  debug?: boolean;
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
  speaking = false,
  rotation = 0,
  scale = 1,
  mirror = false,
  modelUrl = DEFAULT_MODEL,
  debug = false,
}: Props) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<any>(null);
  const modelRef = useRef<any>(null);
  const mouthRef = useRef(0);
  const fittedBoundsRef = useRef({ width: 0, height: 0 });
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string>("");
  const [motions, setMotions] = useState<Record<string, number>>({});
  const [expressions, setExpressions] = useState<string[]>([]);
  const [expIdx, setExpIdx] = useState(0);
  const [debugOpen, setDebugOpen] = useState(false);

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

        const PIXI: any = await import("pixi.js");
        // Expose PIXI globally so pixi-live2d-display can find Ticker
        (window as any).PIXI = PIXI;
        const { Live2DModel } = await import("pixi-live2d-display/cubism4");
        (Live2DModel as any).registerTicker(PIXI.Ticker);

        if (cancelled || !hostRef.current) return;

        const rect = hostRef.current.getBoundingClientRect();
        app = new PIXI.Application({
          width: Math.max(1, Math.floor(rect.width)),
          height: Math.max(1, Math.floor(rect.height)),
          backgroundAlpha: 0,
          antialias: true,
          autoDensity: true,
          resolution: window.devicePixelRatio || 1,
        } as any);
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
          // Measure intrinsic size at scale 1
          m.scale.set(1);
          const iw = m.width || 1;
          const ih = m.height || 1;
          const s = Math.min(r.width / iw, r.height / ih) * 0.9;
          m.scale.set(s);
          // Center using post-scale bounds (don't rely on anchor — Live2DModel
          // anchor behaviour varies and silently leaves origin at top-left)
          m.x = (r.width - m.width) / 2;
          m.y = (r.height - m.height) / 2;
          fittedBoundsRef.current = { width: m.width, height: m.height };
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

        // Discover motion groups and expressions for the debug panel
        try {
          const defs = model.internalModel?.motionManager?.definitions ?? {};
          const counts: Record<string, number> = {};
          for (const k of Object.keys(defs)) counts[k] = (defs[k] || []).length;
          setMotions(counts);
          const expDefs = model.internalModel?.motionManager?.expressionManager?.definitions ?? [];
          setExpressions(expDefs.map((e: any) => e.Name ?? e.name).filter(Boolean));
        } catch {}

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

  // Drag-to-pan + wheel-to-zoom
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const dragRef = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  const clampPan = useCallback((nextPan: { x: number; y: number }, nextZoom = zoom) => {
    const r = hostRef.current?.getBoundingClientRect();
    if (!r) return nextPan;

    const total = scale * nextZoom;
    const characterWidth = fittedBoundsRef.current.width * total;
    const characterHeight = fittedBoundsRef.current.height * total;

    // Always allow at least ~40% of viewport of slack so the user can reposition
    // even when the character fits entirely within the stage.
    const slackX = r.width * 0.4;
    const slackY = r.height * 0.4;
    const maxX = Math.max(slackX, (r.width - Math.min(characterWidth, r.width)) / 2 + slackX);
    const maxY = Math.max(slackY, (r.height - Math.min(characterHeight, r.height)) / 2 + slackY);

    return {
      x: Math.min(maxX, Math.max(-maxX, nextPan.x)),
      y: Math.min(maxY, Math.max(-maxY, nextPan.y)),
    };
  }, [scale, zoom]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const d = dragRef.current;
    setPan(clampPan({ x: d.px + (e.clientX - d.x), y: d.py + (e.clientY - d.y) }));
  };
  const endDrag = (e: React.PointerEvent) => {
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
    dragRef.current = null;
  };
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = Math.exp(-e.deltaY * 0.0015);
    setZoom((z) => {
      const nextZoom = Math.min(4, Math.max(0.3, z * factor));
      setPan((currentPan) => clampPan(currentPan, nextZoom));
      return nextZoom;
    });
  };

  useEffect(() => {
    setPan((currentPan) => clampPan(currentPan));
  }, [clampPan, zoom]);

  const totalScale = scale * zoom;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ perspective: "1600px" }}>
      {/* Soft floor glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-48 rounded-[50%] bg-[radial-gradient(ellipse_at_center,hsl(230_60%_40%/0.35),transparent_70%)] blur-2xl pointer-events-none" />

      {/* Stage canvas — visual only, no pointer events */}
      <div
        ref={hostRef}
        className="absolute inset-0 mina-idle pointer-events-none select-none"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) rotateY(${rotation}deg) scale(${totalScale}) scaleX(${mirror ? -1 : 1})`,
          transformOrigin: "center center",
          transition: dragRef.current ? "none" : "transform 200ms ease-out",
        }}
      />

      {/* Drag/zoom catcher — small area centered on Mina */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[90%] cursor-grab active:cursor-grabbing touch-none select-none z-10"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={onWheel}
      />


      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-white/60 pointer-events-none">
          Loading character…
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-x-0 bottom-6 mx-auto max-w-sm rounded-lg bg-white/[0.07] backdrop-blur px-4 py-3 text-xs text-white/80 text-center pointer-events-none">
          Couldn't load Live2D model. {error}
        </div>
      )}

      {debug && status === "ready" && (
        <div className="absolute top-16 left-3 sm:left-5 z-30 flex flex-col items-start gap-2">
          <button
            onClick={() => setDebugOpen((v) => !v)}
            aria-label="Toggle animation tester"
            title="Animations"
            className="h-9 w-9 rounded-full border border-white/15 bg-white/[0.08] backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.4)] text-white/80 hover:bg-white/15 transition flex items-center justify-center text-base"
          >
            {debugOpen ? "×" : "✦"}
          </button>
          {debugOpen && (
            <div className="w-[200px] sm:w-[230px] max-h-[55vh] overflow-y-auto rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.45)] p-3 text-xs text-white/90 space-y-2 ring-1 ring-inset ring-white/10 animate-fade-in">
              <div className="font-semibold text-white/70 uppercase tracking-wider text-[10px]">Animations</div>
              {Object.entries(motions).map(([group, count]) => (
                <div key={group} className="space-y-1">
                  <div className="text-white/60">{group} ({count})</div>
                  <div className="flex flex-wrap gap-1">
                    {Array.from({ length: count }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => { try { modelRef.current?.motion(group, i, 3); } catch {} }}
                        className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 transition"
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {expressions.length > 0 && (
                <div className="space-y-1 pt-1 border-t border-white/10">
                  <div className="text-white/60">Expression</div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        const next = (expIdx - 1 + expressions.length) % expressions.length;
                        setExpIdx(next);
                        try { modelRef.current?.expression(expressions[next]); } catch {}
                      }}
                      className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 transition"
                    >‹</button>
                    <span className="flex-1 text-center text-white/80 truncate">{expressions[expIdx]}</span>
                    <button
                      onClick={() => {
                        const next = (expIdx + 1) % expressions.length;
                        setExpIdx(next);
                        try { modelRef.current?.expression(expressions[next]); } catch {}
                      }}
                      className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 transition"
                    >›</button>
                  </div>
                </div>
              )}
            </div>
          )}
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
