import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRM, VRMLoaderPlugin, VRMUtils, VRMExpressionPresetName } from "@pixiv/three-vrm";
import { RotateCw, Shirt, RefreshCw } from "lucide-react";

interface Props {
  mouthOpen?: number;
  speaking?: boolean;
  rotation?: number;
  scale?: number;
  mirror?: boolean;
  modelUrl: string;
}

interface MeshInfo {
  name: string;
  visible: boolean;
}

function VRMModel({
  url,
  mouthRef,
  speaking,
  spin,
  onMeshes,
  meshVisibility,
}: {
  url: string;
  mouthRef: React.MutableRefObject<number>;
  speaking: boolean;
  spin: number;
  onMeshes: (m: MeshInfo[]) => void;
  meshVisibility: Record<string, boolean>;
}) {
  const [vrm, setVrm] = useState<VRM | null>(null);
  const blinkRef = useRef({ next: 2 + Math.random() * 3, t: 0, closing: 0 });
  const { camera } = useThree();

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
        setVrm(v);
        onMeshes(meshes);
      },
      undefined,
      (err) => console.error("[VRM] load failed", err),
    );
    return () => {
      cancelled = true;
    };
  }, [url, onMeshes]);

  // Apply mesh visibility toggles
  useEffect(() => {
    if (!vrm) return;
    vrm.scene.traverse((obj: any) => {
      if (obj.isMesh || obj.isSkinnedMesh) {
        const v = meshVisibility[obj.name];
        if (typeof v === "boolean") obj.visible = v;
      }
    });
  }, [vrm, meshVisibility]);

  useFrame((_, dt) => {
    if (!vrm) return;
    vrm.update(dt);

    // Spin (turn-around) target — smoothly approach
    const target = Math.PI + spin;
    vrm.scene.rotation.y += (target - vrm.scene.rotation.y) * Math.min(1, dt * 6);

    const em = vrm.expressionManager;
    if (em) {
      const m = Math.max(0, Math.min(1, mouthRef.current));
      em.setValue(VRMExpressionPresetName.Aa, m);

      const b = blinkRef.current;
      b.t += dt;
      if (b.closing > 0) {
        b.closing -= dt * 6;
        const val = Math.max(0, Math.sin(Math.max(0, b.closing) * Math.PI));
        em.setValue(VRMExpressionPresetName.Blink, val);
      } else {
        em.setValue(VRMExpressionPresetName.Blink, 0);
        if (b.t > b.next) {
          b.closing = 1;
          b.t = 0;
          b.next = 2.5 + Math.random() * 3.5;
        }
      }
    }

    if (vrm.lookAt) vrm.lookAt.target = camera;

    const t = performance.now() / 1000;
    const head = vrm.humanoid?.getNormalizedBoneNode("head");
    const chest = vrm.humanoid?.getNormalizedBoneNode("chest") ?? vrm.humanoid?.getNormalizedBoneNode("spine");
    if (head) {
      head.rotation.x = Math.sin(t * 1.2) * 0.03 + (speaking ? Math.sin(t * 6) * 0.02 : 0);
      head.rotation.y = Math.sin(t * 0.8) * 0.05;
    }
    if (chest) {
      chest.rotation.x = Math.sin(t * 1.6) * 0.015;
    }
  });

  if (!vrm) return null;
  return <primitive object={vrm.scene} />;
}

const VRMStage = ({ mouthOpen = 0, speaking = false, rotation = 0, scale = 1, mirror = false, modelUrl }: Props) => {
  const mouthRef = useRef(0);
  useEffect(() => {
    mouthRef.current = mouthOpen;
  }, [mouthOpen]);

  const [spin, setSpin] = useState(0);
  const [meshes, setMeshes] = useState<MeshInfo[]>([]);
  const [meshVis, setMeshVis] = useState<Record<string, boolean>>({});
  const [outfitOpen, setOutfitOpen] = useState(false);

  const groupTransform = useMemo(
    () => ({
      rotation: [0, (rotation * Math.PI) / 180, 0] as [number, number, number],
      scale: [mirror ? -scale : scale, scale, scale] as [number, number, number],
    }),
    [rotation, scale, mirror],
  );

  const toggleMesh = (name: string) => {
    setMeshVis((prev) => ({ ...prev, [name]: prev[name] === undefined ? false : !prev[name] }));
  };
  const resetMeshes = () => setMeshVis({});

  // Heuristic: hide "essential" meshes (body/face/hair) from the outfit list
  const outfitMeshes = useMemo(
    () => meshes.filter((m) => !/^$/.test(m.name)),
    [meshes],
  );

  return (
    <div className="absolute inset-0">
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
              onMeshes={setMeshes}
              meshVisibility={meshVis}
            />
          </group>
        </Suspense>
        <OrbitControls
          target={[0, 1.35, 0]}
          enablePan
          enableZoom
          enableRotate
          minDistance={0.6}
          maxDistance={4}
          minPolarAngle={Math.PI * 0.15}
          maxPolarAngle={Math.PI * 0.85}
          makeDefault
        />
      </Canvas>

      {/* Floating controls overlay */}
      <div className="absolute left-3 sm:left-5 top-32 z-20 flex flex-col items-start gap-2 pointer-events-none">
        <button
          onClick={() => setSpin((s) => s + Math.PI)}
          className="pointer-events-auto h-9 w-9 rounded-full border border-white/15 bg-white/[0.08] backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.4)] text-white/80 hover:bg-white/15 transition flex items-center justify-center"
          title="Turn around"
        >
          <RotateCw className="w-4 h-4" />
        </button>
        <button
          onClick={() => setOutfitOpen((v) => !v)}
          className={`pointer-events-auto h-9 w-9 rounded-full border border-white/15 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.4)] transition flex items-center justify-center ${
            outfitOpen ? "bg-white text-[hsl(220_25%_10%)]" : "bg-white/[0.08] text-white/80 hover:bg-white/15"
          }`}
          title="Outfit pieces"
        >
          <Shirt className="w-4 h-4" />
        </button>

        {outfitOpen && (
          <div className="pointer-events-auto w-[230px] max-h-[55vh] overflow-y-auto rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.45)] p-3 text-xs text-white/90 space-y-1.5 ring-1 ring-inset ring-white/10 animate-fade-in">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-white/70 uppercase tracking-wider text-[10px]">Outfit pieces</span>
              <button
                onClick={resetMeshes}
                className="text-white/60 hover:text-white flex items-center gap-1 text-[10px]"
                title="Reset all"
              >
                <RefreshCw className="w-3 h-3" /> reset
              </button>
            </div>
            {outfitMeshes.length === 0 && <div className="text-white/50">Loading…</div>}
            {outfitMeshes.map((m) => {
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
    </div>
  );
};

export default VRMStage;
