import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRM, VRMLoaderPlugin, VRMUtils, VRMExpressionPresetName } from "@pixiv/three-vrm";
import {
  VRMAnimationLoaderPlugin,
  createVRMAnimationClip,
  type VRMAnimation,
} from "@pixiv/three-vrm-animation";
import { RotateCw, Shirt, RefreshCw, Film, Upload, Square } from "lucide-react";

export type VrmSentiment =
  | "neutral"
  | "love"
  | "happy"
  | "playful"
  | "sad"
  | "angry"
  | "surprised"
  | "intimate";

interface Props {
  mouthOpen?: number;
  speaking?: boolean;
  rotation?: number;
  scale?: number;
  mirror?: boolean;
  modelUrl: string;
  /** Drives reactive expressions (smile / pout / blush etc.) */
  sentiment?: VrmSentiment;
  /** Increment to trigger a one-shot reaction (head turn + expression pop) */
  reactTrigger?: number;
}

interface MeshInfo {
  name: string;
  visible: boolean;
}

const EXPR_MAP: Record<VrmSentiment, Partial<Record<string, number>>> = {
  neutral:   { happy: 0.05, angry: 0, sad: 0, surprised: 0, relaxed: 0.15 },
  love:      { happy: 0.85, relaxed: 0.5, angry: 0, sad: 0, surprised: 0 },
  happy:     { happy: 0.7, relaxed: 0.3, angry: 0, sad: 0 },
  playful:   { happy: 0.55, surprised: 0.2, relaxed: 0.2, angry: 0, sad: 0 },
  sad:       { sad: 0.7, relaxed: 0.1, happy: 0, angry: 0, surprised: 0 },
  angry:     { angry: 0.7, sad: 0.1, happy: 0, surprised: 0, relaxed: 0 },
  surprised: { surprised: 0.8, happy: 0.2, angry: 0, sad: 0, relaxed: 0 },
  intimate:  { happy: 0.4, relaxed: 0.6, surprised: 0.15, angry: 0, sad: 0 },
};

export type ViewPreset = "full" | "upper" | "face";

function VRMModel({
  url,
  mouthRef,
  speaking,
  spin,
  sentiment,
  reactTrigger,
  pointerRef,
  onMeshes,
  onProgress,
  onError,
  meshVisibility,
  viewPreset,
  vrmaUrl,
  onAnimEnd,
}: {
  url: string;
  mouthRef: React.MutableRefObject<number>;
  speaking: boolean;
  spin: number;
  sentiment: VrmSentiment;
  reactTrigger: number;
  pointerRef: React.MutableRefObject<{ x: number; y: number; active: boolean }>;
  onMeshes: (m: MeshInfo[]) => void;
  onProgress: (pct: number) => void;
  onError: (msg: string | null) => void;
  meshVisibility: Record<string, boolean>;
  viewPreset: ViewPreset;
  vrmaUrl: string | null;
  onAnimEnd: () => void;
}) {
  const [vrm, setVrm] = useState<VRM | null>(null);
  const blinkRef = useRef({ next: 2 + Math.random() * 3, t: 0, closing: 0 });
  const tiltRef = useRef({ next: 5 + Math.random() * 6, t: 0, amount: 0, dir: 1 });
  const exprRef = useRef<Record<string, number>>({});
  const reactRef = useRef({ last: 0, intensity: 0 });
  const lookTargetRef = useRef(new THREE.Object3D());
  const bboxRef = useRef<{ size: THREE.Vector3; center: THREE.Vector3; min: THREE.Vector3 } | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionRef = useRef<THREE.AnimationAction | null>(null);
  const [animPlaying, setAnimPlaying] = useState(false);
  const { camera, scene, get } = useThree() as any;


  // Re-frame the camera based on current preset and the model's bbox
  const applyView = useCallback((preset: ViewPreset) => {
    const b = bboxRef.current;
    if (!b) return;
    const fovRad = ((camera as any).fov * Math.PI) / 180;
    const fullH = b.size.y;
    let frameH: number;
    let focusY: number;
    if (preset === "face") {
      frameH = fullH * 0.28;
      focusY = b.min.y + fullH * 0.92;
    } else if (preset === "upper") {
      frameH = fullH * 0.55;
      focusY = b.min.y + fullH * 0.78;
    } else {
      // full body — pad 10%
      frameH = fullH * 1.1;
      focusY = b.min.y + fullH * 0.5;
    }
    const distance = (frameH / 2) / Math.tan(fovRad / 2) * 1.05;
    camera.position.set(b.center.x, focusY, distance);
    camera.lookAt(b.center.x, focusY, 0);
    (camera as any).updateProjectionMatrix?.();
    const controls = get().controls as any;
    if (controls?.target) {
      controls.target.set(b.center.x, focusY, 0);
      controls.update?.();
    }
  }, [camera, get]);





  useEffect(() => {
    scene.add(lookTargetRef.current);
    return () => { scene.remove(lookTargetRef.current); };
  }, [scene]);

  useEffect(() => {
    let cancelled = false;
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));
    loader.load(
      url,
      (gltf) => {
        if (cancelled) return;
        const v: VRM = gltf.userData.vrm;
        VRMUtils.removeUnnecessaryVertices(gltf.scene);
        VRMUtils.combineSkeletons(gltf.scene);
        const meshes: MeshInfo[] = [];
        const seen = new Set<string>();
        v.scene.traverse((obj: any) => {
          if (obj.isMesh || obj.isSkinnedMesh) {
            obj.frustumCulled = false;
            const name = obj.name || "(unnamed)";
            if (!seen.has(name)) {
              seen.add(name);
              meshes.push({ name, visible: obj.visible });
            }
          }
        });
        v.scene.rotation.y = Math.PI;

        // Measure and store bbox, then apply current view preset
        const box = new THREE.Box3().setFromObject(v.scene);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);
        bboxRef.current = { size, center, min: box.min.clone() };

        // Mixer for VRMA clips
        mixerRef.current = new THREE.AnimationMixer(v.scene);
        mixerRef.current.addEventListener("finished", () => {
          actionRef.current = null;
          setAnimPlaying(false);
          onAnimEnd();
        });

        setVrm(v);
        onProgress(100);
        onMeshes(meshes);
        // Defer to next tick so controls are mounted
        requestAnimationFrame(() => applyView(viewPreset));
      },
      (evt) => {
        if (evt.total) onProgress(Math.round((evt.loaded / evt.total) * 100));
      },
      (err) => {
        console.error("[VRM] load failed", err);
        onError(err instanceof Error ? err.message : "Failed to load model");
      },
    );
    return () => { cancelled = true; };
  }, [url, onMeshes]);

  useEffect(() => {
    if (!vrm) return;
    vrm.scene.traverse((obj: any) => {
      if (obj.isMesh || obj.isSkinnedMesh) {
        const v = meshVisibility[obj.name];
        if (typeof v === "boolean") obj.visible = v;
      }
    });
  }, [vrm, meshVisibility]);

  // One-shot reaction on trigger change
  useEffect(() => {
    if (reactTrigger > reactRef.current.last) {
      reactRef.current.last = reactTrigger;
      reactRef.current.intensity = 1;
    }
  }, [reactTrigger]);

  // Load + play a VRMA animation when vrmaUrl is set; clear when null
  useEffect(() => {
    if (!vrm || !mixerRef.current) return;
    const mixer = mixerRef.current;
    if (!vrmaUrl) {
      if (actionRef.current) {
        actionRef.current.fadeOut(0.3);
        actionRef.current = null;
      }
      setAnimPlaying(false);
      return;
    }
    let cancelled = false;
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMAnimationLoaderPlugin(parser));
    loader.load(
      vrmaUrl,
      (gltf) => {
        if (cancelled) return;
        const vrmAnims = (gltf.userData as any).vrmAnimations as VRMAnimation[] | undefined;
        if (!vrmAnims || vrmAnims.length === 0) {
          console.warn("[VRMA] No animations in file");
          onAnimEnd();
          return;
        }
        const clip = createVRMAnimationClip(vrmAnims[0], vrm as any);
        if (actionRef.current) actionRef.current.fadeOut(0.25);
        const action = mixer.clipAction(clip);
        action.reset().fadeIn(0.25).play();
        actionRef.current = action;
        setAnimPlaying(true);
      },
      undefined,
      (err) => {
        console.error("[VRMA] load failed", err);
        onAnimEnd();
      },
    );
    return () => { cancelled = true; };
  }, [vrm, vrmaUrl, onAnimEnd]);


  // Re-frame when preset changes
  useEffect(() => { applyView(viewPreset); }, [viewPreset, applyView]);


  useFrame((_, dt) => {
    if (!vrm) return;
    // Tick VRMA mixer BEFORE vrm.update so springs/lookAt run on top
    mixerRef.current?.update(dt);
    vrm.update(dt);
    const hasAnim = animPlaying;

    // Smooth turn-around target
    const target = Math.PI + spin;
    vrm.scene.rotation.y += (target - vrm.scene.rotation.y) * Math.min(1, dt * 6);

    const t = performance.now() / 1000;
    const em = vrm.expressionManager;

    // Lip-sync + blink + expressions
    if (em) {
      em.setValue(VRMExpressionPresetName.Aa, Math.max(0, Math.min(1, mouthRef.current)));

      // Blink
      const b = blinkRef.current;
      b.t += dt;
      if (b.closing > 0) {
        b.closing -= dt * 6;
        em.setValue(VRMExpressionPresetName.Blink, Math.max(0, Math.sin(Math.max(0, b.closing) * Math.PI)));
      } else {
        em.setValue(VRMExpressionPresetName.Blink, 0);
        if (b.t > b.next) { b.closing = 1; b.t = 0; b.next = 2.5 + Math.random() * 3.5; }
      }

      // Reactive expression — smoothly lerp toward sentiment targets
      const targets = EXPR_MAP[sentiment] ?? {};
      const reactBoost = reactRef.current.intensity;
      reactRef.current.intensity = Math.max(0, reactBoost - dt * 1.4);
      const keys = ["happy", "angry", "sad", "surprised", "relaxed"] as const;
      for (const k of keys) {
        const goal = (targets[k] ?? 0) + (k === "happy" || k === "surprised" ? reactBoost * 0.4 : 0);
        const cur = exprRef.current[k] ?? 0;
        const next = cur + (goal - cur) * Math.min(1, dt * 2.5);
        exprRef.current[k] = next;
        try { em.setValue(k, next); } catch {}
      }
    }

    // Pointer-driven look target (fallback to camera)
    const p = pointerRef.current;
    if (p.active) {
      // Convert NDC into a world point ~2m in front of camera
      const ndc = new THREE.Vector3(p.x, p.y, 0.5).unproject(camera);
      lookTargetRef.current.position.copy(ndc);
      if (vrm.lookAt) vrm.lookAt.target = lookTargetRef.current;
    } else if (vrm.lookAt) {
      vrm.lookAt.target = camera;
    }

    // Procedural idle (skipped when a VRMA clip is driving the body)
    if (!hasAnim) {
      const hum = vrm.humanoid;
      const head = hum?.getNormalizedBoneNode("head");
      const neck = hum?.getNormalizedBoneNode("neck");
      const chest = hum?.getNormalizedBoneNode("chest") ?? hum?.getNormalizedBoneNode("spine");
      const spine = hum?.getNormalizedBoneNode("spine");
      const hips = hum?.getNormalizedBoneNode("hips");
      const lUpper = hum?.getNormalizedBoneNode("leftUpperArm");
      const rUpper = hum?.getNormalizedBoneNode("rightUpperArm");
      const lLower = hum?.getNormalizedBoneNode("leftLowerArm");
      const rLower = hum?.getNormalizedBoneNode("rightLowerArm");

      // Head tilt scheduler
      const tilt = tiltRef.current;
      tilt.t += dt;
      if (tilt.t > tilt.next) {
        tilt.amount = 0.12 + Math.random() * 0.1;
        tilt.dir = Math.random() < 0.5 ? -1 : 1;
        tilt.next = tilt.t + 6 + Math.random() * 6;
      }
      const tiltDecay = Math.max(0, 1 - (tilt.t % (tilt.next || 1)) / 2.5);
      const tiltZ = tilt.amount * tilt.dir * tiltDecay;

      const talk = speaking ? 1 : 0;
      if (head) {
        head.rotation.x = Math.sin(t * 1.2) * 0.03 + talk * Math.sin(t * 7) * 0.04;
        head.rotation.y = Math.sin(t * 0.8) * 0.05 + talk * Math.sin(t * 3.3) * 0.05;
        head.rotation.z = tiltZ + reactRef.current.intensity * 0.1 * Math.sin(t * 9);
      }
      if (neck) neck.rotation.x = Math.sin(t * 1.2 + 0.3) * 0.015;
      if (chest) chest.rotation.x = Math.sin(t * 1.8) * 0.02 + talk * Math.sin(t * 6) * 0.01;
      if (spine) spine.rotation.x = Math.sin(t * 1.8 + 0.4) * 0.012;
      if (hips) {
        hips.rotation.y = Math.sin(t * 0.45) * 0.04;
        hips.position.y = Math.sin(t * 1.8) * 0.005;
      }
      if (lUpper) lUpper.rotation.z = Math.sin(t * 0.9) * 0.04 + 0.02;
      if (rUpper) rUpper.rotation.z = -Math.sin(t * 0.9 + 0.4) * 0.04 - 0.02;
      if (lLower) lLower.rotation.y = Math.sin(t * 1.1) * 0.05;
      if (rLower) rLower.rotation.y = -Math.sin(t * 1.1 + 0.3) * 0.05;
    }
  });

  if (!vrm) return null;
  return <primitive object={vrm.scene} />;
}

const VRMStage = ({
  mouthOpen = 0,
  speaking = false,
  rotation = 0,
  scale = 1,
  mirror = false,
  modelUrl,
  sentiment = "neutral",
  reactTrigger = 0,
}: Props) => {
  const mouthRef = useRef(0);
  useEffect(() => { mouthRef.current = mouthOpen; }, [mouthOpen]);

  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const [spin, setSpin] = useState(0);
  const [localReact, setLocalReact] = useState(0);
  const reactCombined = reactTrigger + localReact;

  const [meshes, setMeshes] = useState<MeshInfo[]>([]);
  const [meshVis, setMeshVis] = useState<Record<string, boolean>>({});
  const [outfitOpen, setOutfitOpen] = useState(false);
  const [loadPct, setLoadPct] = useState(0);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [viewPreset, setViewPreset] = useState<ViewPreset>("full");


  const groupTransform = useMemo(
    () => ({
      rotation: [0, (rotation * Math.PI) / 180, 0] as [number, number, number],
      scale: [mirror ? -scale : scale, scale, scale] as [number, number, number],
    }),
    [rotation, scale, mirror],
  );

  const toggleMesh = (name: string) =>
    setMeshVis((prev) => ({ ...prev, [name]: prev[name] === undefined ? false : !prev[name] }));
  const resetMeshes = () => setMeshVis({});

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    pointerRef.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointerRef.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    pointerRef.current.active = true;
  }, []);
  const handlePointerLeave = useCallback(() => { pointerRef.current.active = false; }, []);
  const handleStageClick = useCallback(() => { setLocalReact((n) => n + 1); }, []);

  return (
    <div
      className="absolute inset-0"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleStageClick}
    >
      <Canvas
        camera={{ position: [0, 1.4, 1.8], fov: 30 }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: false }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[2, 4, 3]} intensity={1.1} />
        <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#88aaff" />
        <Suspense fallback={null}>
          <group position={[0, 0, 0]} rotation={groupTransform.rotation} scale={groupTransform.scale}>
            <VRMModel
              url={modelUrl}
              mouthRef={mouthRef}
              speaking={speaking}
              spin={spin}
              sentiment={sentiment}
              reactTrigger={reactCombined}
              pointerRef={pointerRef}
              onMeshes={setMeshes}
              onProgress={setLoadPct}
              onError={setLoadErr}
              meshVisibility={meshVis}
              viewPreset={viewPreset}
            />
          </group>
        </Suspense>
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={0.4}
          maxDistance={8}
          minPolarAngle={Math.PI * 0.05}
          maxPolarAngle={Math.PI * 0.95}
          makeDefault
        />
      </Canvas>

      {loadPct < 100 && !loadErr && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10 px-5 py-3 text-xs text-white/80">
            Loading character… {loadPct}%
          </div>
        </div>
      )}
      {loadErr && (
        <div className="absolute inset-x-0 bottom-24 mx-auto max-w-sm rounded-lg bg-red-500/15 border border-red-400/30 backdrop-blur px-4 py-3 text-xs text-red-100 text-center pointer-events-none">
          Couldn't load character: {loadErr}
        </div>
      )}


      <div className="absolute left-3 sm:left-5 top-32 z-20 flex flex-col items-start gap-2 pointer-events-none">
        <button
          onClick={(e) => { e.stopPropagation(); setSpin((s) => s + Math.PI); }}
          className="pointer-events-auto h-9 w-9 rounded-full border border-white/15 bg-white/[0.08] backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.4)] text-white/80 hover:bg-white/15 transition flex items-center justify-center"
          title="Turn around"
        >
          <RotateCw className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setOutfitOpen((v) => !v); }}
          className={`pointer-events-auto h-9 w-9 rounded-full border border-white/15 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.4)] transition flex items-center justify-center ${
            outfitOpen ? "bg-white text-[hsl(220_25%_10%)]" : "bg-white/[0.08] text-white/80 hover:bg-white/15"
          }`}
          title="Outfit pieces"
        >
          <Shirt className="w-4 h-4" />
        </button>

        {outfitOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="pointer-events-auto w-[230px] max-h-[55vh] overflow-y-auto rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.45)] p-3 text-xs text-white/90 space-y-1.5 ring-1 ring-inset ring-white/10 animate-fade-in"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-white/70 uppercase tracking-wider text-[10px]">Outfit pieces</span>
              <button onClick={resetMeshes} className="text-white/60 hover:text-white flex items-center gap-1 text-[10px]">
                <RefreshCw className="w-3 h-3" /> reset
              </button>
            </div>
            {meshes.length === 0 && <div className="text-white/50">Loading…</div>}
            {meshes.map((m) => {
              const on = meshVis[m.name] !== false;
              return (
                <button
                  key={m.name}
                  onClick={() => toggleMesh(m.name)}
                  className={`w-full text-left px-2 py-1.5 rounded-md border border-white/10 transition ${
                    on ? "bg-white/10 hover:bg-white/20 text-white" : "bg-white/[0.02] text-white/40 line-through"
                  }`}
                  title={m.name}
                >
                  <span className="truncate block">{m.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* View preset switcher */}
      <div className="absolute right-3 sm:right-5 top-32 z-20 pointer-events-auto flex flex-col gap-1.5 rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.4)] p-1.5">
        {(["full", "upper", "face"] as ViewPreset[]).map((p) => (
          <button
            key={p}
            onClick={(e) => { e.stopPropagation(); setViewPreset(p); }}
            className={`px-3 py-1.5 rounded-lg text-[11px] uppercase tracking-wider transition ${
              viewPreset === p
                ? "bg-white text-[hsl(220_25%_10%)]"
                : "text-white/70 hover:bg-white/10"
            }`}
            title={`${p} view`}
          >
            {p === "full" ? "Full" : p === "upper" ? "Upper" : "Face"}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VRMStage;
