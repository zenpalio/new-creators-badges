import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRM, VRMLoaderPlugin, VRMUtils, VRMExpressionPresetName } from "@pixiv/three-vrm";

interface Props {
  mouthOpen?: number;
  speaking?: boolean;
  rotation?: number; // degrees, Y axis
  scale?: number;
  mirror?: boolean;
  modelUrl: string;
}

function VRMModel({
  url,
  mouthRef,
  speaking,
}: {
  url: string;
  mouthRef: React.MutableRefObject<number>;
  speaking: boolean;
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
        v.scene.traverse((obj: any) => {
          if (obj.isMesh) obj.frustumCulled = false;
        });
        // Face camera
        v.scene.rotation.y = Math.PI;
        setVrm(v);
      },
      undefined,
      (err) => console.error("[VRM] load failed", err),
    );
    return () => {
      cancelled = true;
    };
  }, [url]);

  useFrame((_, dt) => {
    if (!vrm) return;
    vrm.update(dt);

    const em = vrm.expressionManager;
    if (em) {
      // Lip-sync via 'aa' preset
      const m = Math.max(0, Math.min(1, mouthRef.current));
      em.setValue(VRMExpressionPresetName.Aa, m);

      // Blink
      const b = blinkRef.current;
      b.t += dt;
      if (b.closing > 0) {
        b.closing -= dt * 6;
        const v = Math.max(0, Math.sin(Math.max(0, b.closing) * Math.PI));
        em.setValue(VRMExpressionPresetName.Blink, v);
      } else {
        em.setValue(VRMExpressionPresetName.Blink, 0);
        if (b.t > b.next) {
          b.closing = 1;
          b.t = 0;
          b.next = 2.5 + Math.random() * 3.5;
        }
      }
    }

    // Look at camera
    if (vrm.lookAt) vrm.lookAt.target = camera;

    // Idle breathing / gentle sway
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

  const groupTransform = useMemo(() => {
    return {
      rotation: [0, (rotation * Math.PI) / 180, 0] as [number, number, number],
      scale: [mirror ? -scale : scale, scale, scale] as [number, number, number],
    };
  }, [rotation, scale, mirror]);

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 1.35, 1.6], fov: 28 }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: false }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[2, 4, 3]} intensity={1.1} />
        <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#88aaff" />
        <Suspense fallback={null}>
          <group position={[0, 0, 0]} rotation={groupTransform.rotation} scale={groupTransform.scale}>
            <VRMModel url={modelUrl} mouthRef={mouthRef} speaking={speaking} />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default VRMStage;
