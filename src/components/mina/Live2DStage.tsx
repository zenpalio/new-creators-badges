import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

// Expose PIXI globally — pixi-live2d-display reads window.PIXI
(window as any).PIXI = PIXI;

interface Props {
  modelUrl?: string;
  /** 0–1; drives mouth open amount during voice playback */
  mouthOpen?: number;
  expression?: string | null;
}

// Free public Cubism 4 sample (Hiyori) hosted on jsdelivr
const DEFAULT_MODEL = "https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display@master/test/assets/haru/haru_greeter_t03.model3.json";

const Live2DStage = ({ modelUrl = DEFAULT_MODEL, mouthOpen = 0 }: Props) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<any>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    let disposed = false;
    let app: PIXI.Application;

    (async () => {
      const { Live2DModel } = await import("pixi-live2d-display/cubism4");
      if (disposed || !wrapRef.current) return;

      app = new PIXI.Application({
        resizeTo: wrapRef.current,
        backgroundAlpha: 0,
        antialias: true,
      });
      wrapRef.current.appendChild(app.view as any);
      appRef.current = app;

      try {
        const model = await Live2DModel.from(modelUrl, { autoInteract: true });
        if (disposed) return;
        app.stage.addChild(model as any);

        const fit = () => {
          const w = app.renderer.width;
          const h = app.renderer.height;
          const scale = Math.min(w / model.width, h / model.height) * 0.95;
          model.scale.set(scale);
          model.x = (w - model.width) / 2;
          model.y = (h - model.height) / 2;
        };
        fit();
        window.addEventListener("resize", fit);
        modelRef.current = model;
      } catch (e) {
        console.error("Live2D load failed", e);
      }
    })();

    return () => {
      disposed = true;
      try { appRef.current?.destroy(true, { children: true, texture: true, baseTexture: true }); } catch {}
      appRef.current = null;
      modelRef.current = null;
    };
  }, [modelUrl]);

  // Drive mouth open value
  useEffect(() => {
    const model = modelRef.current;
    if (!model) return;
    try {
      const core = model.internalModel?.coreModel;
      core?.setParameterValueById?.("ParamMouthOpenY", mouthOpen);
    } catch {}
  }, [mouthOpen]);

  return <div ref={wrapRef} className="absolute inset-0" />;
};

export default Live2DStage;
