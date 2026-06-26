import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { VRM, VRMLoaderPlugin, VRMUtils, VRMExpressionPresetName } from "@pixiv/three-vrm";
import {
  VRMAnimationLoaderPlugin,
  createVRMAnimationClip,
  type VRMAnimation,
} from "@pixiv/three-vrm-animation";
import { RotateCw, Shirt, RefreshCw, Film, Upload, Square } from "lucide-react";
import kneelingIdle from "@/assets/kneeling-idle.fbx.asset.json";
import talkingAnim from "@/assets/talking.fbx.asset.json";
import standingPose from "@/assets/standing-pose.fbx.asset.json";
import idleAnim from "@/assets/idle.fbx.asset.json";
import boredAnim from "@/assets/bored.fbx.asset.json";
import dizzyIdleAnim from "@/assets/dizzy-idle.fbx.asset.json";
import lookAroundAnim from "@/assets/look-around.fbx.asset.json";
import lookingAroundAnim from "@/assets/looking-around.fbx.asset.json";
import relievedSighAnim from "@/assets/relieved-sigh.fbx.asset.json";
import shoulderRubAnim from "@/assets/shoulder-rubbing.fbx.asset.json";
import blowKissAnim from "@/assets/blow-a-kiss.fbx.asset.json";
import happyAnim from "@/assets/happy.fbx.asset.json";
import excitedAnim from "@/assets/excited.fbx.asset.json";
import angryAnim from "@/assets/angry.fbx.asset.json";


const DEFAULT_ANIM = { url: standingPose.url, name: "Standing", kind: "fbx" as const };

// Pool of idle animations cycled while the character is not speaking.
// Higher weight = appears more often. Plain standing gets the highest weight
// so the character regularly returns to a calm default.
const IDLE_POOL: { url: string; name: string; kind: "fbx"; weight: number }[] = [
  { url: standingPose.url, name: "Standing", kind: "fbx", weight: 4 },
  { url: idleAnim.url, name: "Idle", kind: "fbx", weight: 3 },
  { url: lookAroundAnim.url, name: "Look Around", kind: "fbx", weight: 2 },
  { url: lookingAroundAnim.url, name: "Looking Around", kind: "fbx", weight: 2 },
  { url: boredAnim.url, name: "Bored", kind: "fbx", weight: 1 },
  { url: dizzyIdleAnim.url, name: "Dizzy", kind: "fbx", weight: 1 },
  { url: relievedSighAnim.url, name: "Sigh", kind: "fbx", weight: 1 },
  { url: shoulderRubAnim.url, name: "Shoulder Rub", kind: "fbx", weight: 1 },
  { url: blowKissAnim.url, name: "Blow Kiss", kind: "fbx", weight: 1 },
];
const IDLE_URLS = new Set(IDLE_POOL.map((i) => i.url));
function pickIdle(currentUrl?: string | null) {
  const pool = IDLE_POOL.filter((i) => i.url !== currentUrl);
  const total = pool.reduce((s, i) => s + i.weight, 0);
  let r = Math.random() * total;
  for (const i of pool) { r -= i.weight; if (r <= 0) return i; }
  return pool[0];
}

// Mixamo bone name → VRM humanoid bone name
const MIXAMO_TO_VRM: Record<string, string> = {
  mixamorigHips: "hips",
  mixamorigSpine: "spine",
  mixamorigSpine1: "chest",
  mixamorigSpine2: "upperChest",
  mixamorigNeck: "neck",
  mixamorigHead: "head",
  mixamorigLeftShoulder: "leftShoulder",
  mixamorigLeftArm: "leftUpperArm",
  mixamorigLeftForeArm: "leftLowerArm",
  mixamorigLeftHand: "leftHand",
  mixamorigRightShoulder: "rightShoulder",
  mixamorigRightArm: "rightUpperArm",
  mixamorigRightForeArm: "rightLowerArm",
  mixamorigRightHand: "rightHand",
  mixamorigLeftUpLeg: "leftUpperLeg",
  mixamorigLeftLeg: "leftLowerLeg",
  mixamorigLeftFoot: "leftFoot",
  mixamorigLeftToeBase: "leftToes",
  mixamorigRightUpLeg: "rightUpperLeg",
  mixamorigRightLeg: "rightLowerLeg",
  mixamorigRightFoot: "rightFoot",
  mixamorigRightToeBase: "rightToes",
};

// Retarget a Mixamo FBX clip onto a VRM humanoid rig.
// Adapted from the official pixiv three-vrm Mixamo example.
function retargetMixamoClip(asset: THREE.Group, vrm: VRM): THREE.AnimationClip | null {
  const srcClip = asset.animations?.[0];
  if (!srcClip) return null;
  const tracks: THREE.KeyframeTrack[] = [];
  const restRotInv = new THREE.Quaternion();
  const parentRestRot = new THREE.Quaternion();
  const _q = new THREE.Quaternion();
  const _v = new THREE.Vector3();

  const motionHipsNode = asset.getObjectByName("mixamorigHips");
  const vrmHipsNode = vrm.humanoid?.getNormalizedBoneNode("hips");
  if (!motionHipsNode || !vrmHipsNode) return null;
  const motionHipsHeight = motionHipsNode.position.y;
  const vrmHipsY = vrmHipsNode.getWorldPosition(_v).y;
  const vrmRootY = vrm.scene.getWorldPosition(_v).y;
  const vrmHipsHeight = Math.abs(vrmHipsY - vrmRootY);
  const hipsScale = motionHipsHeight > 0 ? vrmHipsHeight / motionHipsHeight : 0.01;
  const isVRM0 = (vrm.meta as any)?.metaVersion === "0";

  for (const track of srcClip.tracks) {
    const [mixName, propName] = track.name.split(".");
    const vrmBoneName = MIXAMO_TO_VRM[mixName];
    if (!vrmBoneName) continue;
    const vrmNode = vrm.humanoid?.getNormalizedBoneNode(vrmBoneName as any);
    if (!vrmNode) continue;
    const mixNode = asset.getObjectByName(mixName);
    if (!mixNode) continue;

    mixNode.getWorldQuaternion(restRotInv).invert();
    mixNode.parent?.getWorldQuaternion(parentRestRot);

    if (track instanceof THREE.QuaternionKeyframeTrack) {
      const values = track.values.slice();
      for (let i = 0; i < values.length; i += 4) {
        _q.fromArray(values, i);
        _q.premultiply(parentRestRot).multiply(restRotInv);
        if (isVRM0) { _q.x = -_q.x; _q.z = -_q.z; }
        _q.toArray(values, i);
      }
      tracks.push(new THREE.QuaternionKeyframeTrack(`${vrmNode.name}.${propName}`, track.times as any, values as any));
    } else if (track instanceof THREE.VectorKeyframeTrack) {
      const values = track.values.slice();
      for (let i = 0; i < values.length; i += 3) {
        values[i] *= hipsScale * (isVRM0 ? -1 : 1);
        values[i + 1] *= hipsScale;
        values[i + 2] *= hipsScale * (isVRM0 ? -1 : 1);
      }
      tracks.push(new THREE.VectorKeyframeTrack(`${vrmNode.name}.${propName}`, track.times as any, values as any));
    }
  }
  return new THREE.AnimationClip("mixamoRetarget", srcClip.duration, tracks);
}

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

interface CharacterFrame {
  size: THREE.Vector3;
  center: THREE.Vector3;
  min: THREE.Vector3;
  focus: {
    full: number;
    upper: number;
    face: number;
  };
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

export type ViewPreset = "full" | "upper" | "face" | "back";

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
  reframeNonce,
  vrmaUrl,
  animKind,
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
  reframeNonce: number;
  vrmaUrl: string | null;
  animKind: "vrma" | "fbx" | null;
  onAnimEnd: () => void;
}) {
  const [vrm, setVrm] = useState<VRM | null>(null);
  const blinkRef = useRef({ next: 2 + Math.random() * 3, t: 0, closing: 0 });
  const tiltRef = useRef({ next: 5 + Math.random() * 6, t: 0, amount: 0, dir: 1 });
  const exprRef = useRef<Record<string, number>>({});
  const reactRef = useRef({ last: 0, intensity: 0 });
  const lookTargetRef = useRef(new THREE.Object3D());
  const bboxRef = useRef<CharacterFrame | null>(null);
  const hipsRestYRef = useRef(0);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionRef = useRef<THREE.AnimationAction | null>(null);
  const [animPlaying, setAnimPlaying] = useState(false);
  const { camera, scene, get } = useThree() as any;


  // Re-frame the camera based on current preset and the model's bbox
  const applyView = useCallback((preset: ViewPreset) => {
    const b = bboxRef.current;
    if (!b) return;
    const fovRad = ((camera as any).fov * Math.PI) / 180;
    const aspect = Math.max(0.1, (camera as any).aspect || 1);
    const fullH = b.size.y;
    let frameH: number;
    let focusY: number;
    let frameW = b.size.x * 1.15;
    if (preset === "face") {
      // Face + a little upper chest — frame head down to shoulders
      frameH = fullH * 0.48;
      focusY = b.focus.face - fullH * 0.08;
      frameW = b.size.x * 0.7;
    } else if (preset === "upper") {
      frameH = fullH * 0.7;
      focusY = b.focus.upper;
      frameW = b.size.x * 0.75;
    } else {
      // full body & back — center on the humanoid
      frameH = fullH * 1.15;
      focusY = b.focus.full;
    }
    const verticalDistance = (frameH / 2) / Math.tan(fovRad / 2);
    const horizontalDistance = (frameW / 2) / (Math.tan(fovRad / 2) * aspect);
    const distance = Math.max(verticalDistance, horizontalDistance) * 1.05;
    camera.position.set(b.center.x, focusY, b.center.z + distance);
    camera.lookAt(b.center.x, focusY, b.center.z);
    (camera as any).updateProjectionMatrix?.();
    const controls = get().controls as any;
    if (controls?.target) {
      controls.target.set(b.center.x, focusY, b.center.z);
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
        v.scene.updateMatrixWorld(true);

        // Normalize from humanoid bones, not mesh bounds. VRM outfits/accessory
        // bounds can be far outside the visible body and pull framing down.
        const getBoneWorld = (name: Parameters<VRM["humanoid"]["getNormalizedBoneNode"]>[0]) => {
          const node = v.humanoid?.getNormalizedBoneNode(name);
          return node ? node.getWorldPosition(new THREE.Vector3()) : null;
        };
        const rawBox = new THREE.Box3().setFromObject(v.scene);
        const rawCenter = new THREE.Vector3();
        rawBox.getCenter(rawCenter);
        const hips = getBoneWorld("hips");
        const head = getBoneWorld("head");
        const leftFoot = getBoneWorld("leftFoot") ?? getBoneWorld("leftToes");
        const rightFoot = getBoneWorld("rightFoot") ?? getBoneWorld("rightToes");
        const bodyCenterX = hips?.x ?? head?.x ?? rawCenter.x;
        const bodyCenterZ = hips?.z ?? head?.z ?? rawCenter.z;
        const footY = leftFoot || rightFoot
          ? Math.min(leftFoot?.y ?? Number.POSITIVE_INFINITY, rightFoot?.y ?? Number.POSITIVE_INFINITY)
          : rawBox.min.y;
        v.scene.position.x -= bodyCenterX;
        v.scene.position.y -= footY;
        v.scene.position.z -= bodyCenterZ;
        v.scene.position.y += 0.22;
        v.scene.updateMatrixWorld(true);

        // Measure a body frame from the normalized skeleton, then apply preset.
        const box = new THREE.Box3().setFromObject(v.scene);
        const size = new THREE.Vector3();
        box.getSize(size);
        const nHips = getBoneWorld("hips");
        const nHead = getBoneWorld("head");
        const nLeftFoot = getBoneWorld("leftFoot") ?? getBoneWorld("leftToes");
        const nRightFoot = getBoneWorld("rightFoot") ?? getBoneWorld("rightToes");
        const bodyMinY = nLeftFoot || nRightFoot
          ? Math.min(nLeftFoot?.y ?? Number.POSITIVE_INFINITY, nRightFoot?.y ?? Number.POSITIVE_INFINITY)
          : box.min.y;
        const bodyHeadY = nHead?.y ?? box.max.y;
        // Approximate top of head/hair from raw bounding box, fall back to head bone + offset
        const topOfHeadY = Math.max(box.max.y, bodyHeadY + 0.18);
        const bodyHeight = THREE.MathUtils.clamp(topOfHeadY - bodyMinY, 1.25, 2.05);
        const frameHeight = bodyHeight;
        const shoulderSpan = (() => {
          const l = getBoneWorld("leftUpperArm") ?? getBoneWorld("leftShoulder");
          const r = getBoneWorld("rightUpperArm") ?? getBoneWorld("rightShoulder");
          return l && r ? Math.abs(l.x - r.x) * 2.2 : bodyHeight * 0.45;
        })();
        const frameWidth = Math.max(shoulderSpan, bodyHeight * 0.42);
        const frameCenter = new THREE.Vector3(nHips?.x ?? 0, bodyMinY + frameHeight * 0.5, nHips?.z ?? 0);
        bboxRef.current = {
          size: new THREE.Vector3(frameWidth, frameHeight, Math.max(size.z, bodyHeight * 0.35)),
          center: frameCenter,
          min: new THREE.Vector3(frameCenter.x - frameWidth * 0.5, bodyMinY, frameCenter.z - size.z * 0.5),
          focus: {
            full: bodyMinY + bodyHeight * 0.5,
            // Upper body: chest-ish, midway between hips and head
            upper: (nHips?.y ?? bodyMinY + bodyHeight * 0.55) * 0.4 + bodyHeadY * 0.6,
            // Face: actual head bone y, nudged slightly up to center on the face, not the neck
            face: bodyHeadY + (topOfHeadY - bodyHeadY) * 0.35,
          },
        };
        hipsRestYRef.current = v.humanoid?.getNormalizedBoneNode("hips")?.position.y ?? 0;

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
    const playClip = (clip: THREE.AnimationClip) => {
      if (actionRef.current) actionRef.current.fadeOut(0.25);
      const action = mixer.clipAction(clip);
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.clampWhenFinished = true;
      action.reset().fadeIn(0.25).play();
      actionRef.current = action;
      setAnimPlaying(true);
    };
    if (animKind === "fbx") {
      const fbxLoader = new FBXLoader();
      fbxLoader.load(
        vrmaUrl,
        (asset) => {
          if (cancelled) return;
          const clip = retargetMixamoClip(asset, vrm);
          if (!clip) { console.warn("[FBX] retarget failed — no Mixamo rig or animation"); onAnimEnd(); return; }
          playClip(clip);
        },
        undefined,
        (err) => { console.error("[FBX] load failed", err); onAnimEnd(); },
      );
    } else {
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
          playClip(clip);
        },
        undefined,
        (err) => { console.error("[VRMA] load failed", err); onAnimEnd(); },
      );
    }
    return () => { cancelled = true; };
  }, [vrm, vrmaUrl, animKind, onAnimEnd]);


  // Re-frame when preset changes
  useEffect(() => { applyView(viewPreset); }, [viewPreset, reframeNonce, applyView]);


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
      const ml = Math.max(0, Math.min(1, mouthRef.current));
      // Subtle viseme variation driven by audio level + time so the mouth
      // doesn't look like a single open-close shape.
      const wob = 0.5 + 0.5 * Math.sin(t * 18);
      em.setValue(VRMExpressionPresetName.Aa, ml * (0.55 + 0.45 * wob));
      em.setValue(VRMExpressionPresetName.Ih, ml * 0.35 * (1 - wob));
      em.setValue(VRMExpressionPresetName.Ou, ml * 0.25 * wob);

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
        hips.position.y = hipsRestYRef.current + Math.sin(t * 1.8) * 0.005;
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
  const [animsOpen, setAnimsOpen] = useState(false);

  const [loadPct, setLoadPct] = useState(0);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [viewPreset, setViewPreset] = useState<ViewPreset>("full");
  const [reframeNonce, setReframeNonce] = useState(0);
  const [vrmaUrl, setVrmaUrl] = useState<string | null>(DEFAULT_ANIM.url);
  const [vrmaName, setVrmaName] = useState<string | null>(DEFAULT_ANIM.name);
  const [animKind, setAnimKind] = useState<"vrma" | "fbx" | null>(DEFAULT_ANIM.kind);
  const vrmaFileRef = useRef<HTMLInputElement | null>(null);
  const resetToDefault = useCallback(() => {
    setVrmaUrl((prev) => { if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev); return DEFAULT_ANIM.url; });
    setVrmaName(DEFAULT_ANIM.name);
    setAnimKind(DEFAULT_ANIM.kind);
  }, []);
  const playPreset = useCallback((url: string, name: string, kind: "vrma" | "fbx") => {
    setVrmaUrl((prev) => { if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev); return url; });
    setVrmaName(name);
    setAnimKind(kind);
  }, []);
  // When a one-shot finishes, pick a fresh idle instead of always returning to standing.
  const handleAnimEnd = useCallback(() => {
    const next = pickIdle(vrmaUrl);
    playPreset(next.url, next.name, next.kind);
  }, [vrmaUrl, playPreset]);
  const handlePickVrma = (file: File) => {
    if (vrmaUrl && vrmaUrl.startsWith("blob:")) URL.revokeObjectURL(vrmaUrl);
    const isFbx = /\.fbx$/i.test(file.name);
    setVrmaUrl(URL.createObjectURL(file));
    setVrmaName(file.name.replace(/\.(vrma|fbx|glb)$/i, ""));
    setAnimKind(isFbx ? "fbx" : "vrma");
  };

  // Auto-play Talking animation while the character is speaking.
  // Swaps from any idle-pool clip; restores idle rotation when done.
  const autoTalkingRef = useRef(false);
  useEffect(() => {
    if (speaking) {
      if (vrmaUrl && IDLE_URLS.has(vrmaUrl)) {
        autoTalkingRef.current = true;
        playPreset(talkingAnim.url, "Talking", "fbx");
      }
    } else if (autoTalkingRef.current) {
      autoTalkingRef.current = false;
      const next = pickIdle(talkingAnim.url);
      playPreset(next.url, next.name, next.kind);
    }
  }, [speaking, vrmaUrl, playPreset]);

  // Rotate idle animations every 10–18s while not speaking and not playing a
  // manual / talking clip. Stops cycling if the user picks a non-idle preset.
  useEffect(() => {
    if (speaking) return;
    if (!vrmaUrl || !IDLE_URLS.has(vrmaUrl)) return;
    const delay = 10000 + Math.random() * 8000;
    const t = window.setTimeout(() => {
      const next = pickIdle(vrmaUrl);
      playPreset(next.url, next.name, next.kind);
    }, delay);
    return () => window.clearTimeout(t);
  }, [vrmaUrl, speaking, playPreset]);



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
              reframeNonce={reframeNonce}
              vrmaUrl={vrmaUrl}
              animKind={animKind}
              onAnimEnd={handleAnimEnd}
            />
          </group>
        </Suspense>
        <OrbitControls
          enablePan
          screenSpacePanning
          enableZoom
          enableRotate
          mouseButtons={{ LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE }}
          touches={{ ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_ROTATE }}
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


      {/* Hidden file input shared by drop zone */}
      <input
        ref={vrmaFileRef}
        type="file"
        accept=".vrma,.glb,.fbx"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handlePickVrma(f);
          e.target.value = "";
        }}
      />

      {/* Animation sidebar — left, collapsible (drop zone + presets) */}
      <div className="absolute left-3 sm:left-5 top-20 z-20 pointer-events-auto flex flex-col items-start gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); setAnimsOpen((v) => !v); }}
          className={`h-9 w-9 rounded-full border border-white/15 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.4)] transition flex items-center justify-center ${
            animsOpen ? "bg-white text-[hsl(220_25%_10%)]" : "bg-white/[0.08] text-white/80 hover:bg-white/15"
          }`}
          title="Animations"
          aria-label="Toggle animations"
        >
          <Film className="w-4 h-4" />
        </button>

        {animsOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[170px] max-h-[60vh] overflow-y-auto rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.45)] p-2 flex flex-col gap-2 animate-fade-in"
          >
            {/* Drop zone */}
            <div
              onClick={(e) => { e.stopPropagation(); vrmaFileRef.current?.click(); }}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); e.currentTarget.classList.add("ring-2","ring-white/40"); }}
              onDragLeave={(e) => { e.currentTarget.classList.remove("ring-2","ring-white/40"); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.currentTarget.classList.remove("ring-2","ring-white/40");
                const f = e.dataTransfer.files?.[0];
                if (f) handlePickVrma(f);
              }}
              className="w-full h-[56px] rounded-lg border border-dashed border-white/20 bg-white/[0.03] hover:bg-white/[0.08] transition flex flex-col items-center justify-center gap-1 text-[10px] text-white/60 cursor-pointer"
              title="Drop .vrma / .fbx or click to load"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Drop anim</span>
            </div>

            <div className="text-[10px] uppercase tracking-[0.15em] text-white/45 font-medium px-1 pt-1">
              Presets
            </div>
            {[
              { url: kneelingIdle.url, name: "Kneeling" },
              { url: talkingAnim.url, name: "Talking" },
              ...IDLE_POOL.map((i) => ({ url: i.url, name: i.name })),
            ].map((a) => {
              const active = vrmaUrl === a.url;
              return (
                <button
                  key={a.url + a.name}
                  onClick={(e) => { e.stopPropagation(); playPreset(a.url, a.name, "fbx"); }}
                  className={`w-full text-left px-2 py-1.5 rounded-md border border-white/10 text-[11px] transition flex items-center gap-1.5 ${
                    active ? "bg-white text-[hsl(220_25%_10%)]" : "bg-white/[0.04] hover:bg-white/[0.12] text-white/80"
                  }`}
                  title={a.name}
                >
                  <Film className="w-3 h-3 shrink-0" />
                  <span className="truncate">{a.name}</span>
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
