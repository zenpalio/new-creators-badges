import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import outroAsset from "../../assets/ads-outro.mp4.asset.json";
import logoAsset from "../../assets/mybabes-logo.svg.asset.json";
const OUTRO_URL = outroAsset.url;
const LOGO_URL = logoAsset.url;
import {
  drawIntroFrame,
  INTRO_FPS,
  INTRO_FRAMES,
  INTRO_H,
  INTRO_W,
  loadImage,
  type IntroConfig,
} from "./introFrames";
import { escapeDrawtext } from "./drawtextEscape";
import { generateIntroSfxWav } from "./introSfx";


export interface Caption {
  text: string;
  start: number;
  end: number;
  position: "top" | "middle" | "bottom";
}

export interface Headline {
  text: string;
  position: "top" | "bottom";
}

export interface RenderConfig {
  intro: IntroConfig;
  clip: File;
  headline: Headline | null;
  captions: Caption[];
  onProgress?: (stage: string, ratio: number) => void;
}

async function getMediaDuration(src: Blob | string): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = typeof src === "string" ? src : URL.createObjectURL(src);
    const v = document.createElement("video");
    v.preload = "metadata";
    v.src = url;
    v.onloadedmetadata = () => {
      const d = v.duration;
      if (typeof src !== "string") URL.revokeObjectURL(url);
      resolve(isFinite(d) ? d : 0);
    };
    v.onerror = () => {
      if (typeof src !== "string") URL.revokeObjectURL(url);
      reject(new Error("Failed to read media duration"));
    };
  });
}

async function getFFmpeg(onLog?: (msg: string) => void): Promise<FFmpeg> {
  const ffmpeg = new FFmpeg();
  if (onLog) ffmpeg.on("log", ({ message }) => onLog(message));
  // Single-threaded core — no SharedArrayBuffer / COOP-COEP required.
  const baseURL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm";
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, "text/javascript"),
  });
  return ffmpeg;
}

async function execOrThrow(
  ffmpeg: FFmpeg,
  args: string[],
  stage: string,
  logTail: string[],
) {
  const code = await ffmpeg.exec(args);
  if (code !== 0) {
    throw new Error(
      `${stage} failed (ffmpeg exit ${code}). Last log lines:\n${logTail.join("\n")}`,
    );
  }
}

async function renderIntroFrames(
  intro: IntroConfig,
  ffmpeg: FFmpeg,
  onProgress?: (r: number) => void,
) {
  const canvas = document.createElement("canvas");
  canvas.width = INTRO_W;
  canvas.height = INTRO_H;
  const ctx = canvas.getContext("2d")!;
  let bgImg: HTMLImageElement | null = null;
  if (intro.backgroundImage) {
    try {
      bgImg = await loadImage(intro.backgroundImage);
    } catch {
      bgImg = null;
    }
  }
  let logoImg: HTMLImageElement | null = null;
  try {
    logoImg = await loadImage(LOGO_URL);
  } catch {
    logoImg = null;
  }
  for (let f = 0; f < INTRO_FRAMES; f++) {
    drawIntroFrame(ctx, f, intro, bgImg, logoImg);
    const blob: Blob = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.9),
    );
    const buf = new Uint8Array(await blob.arrayBuffer());
    const name = `intro_${String(f).padStart(4, "0")}.jpg`;
    await ffmpeg.writeFile(name, buf);
    if (onProgress) onProgress((f + 1) / INTRO_FRAMES);
  }
}

function buildOverlayFilter(
  headline: Headline | null,
  captions: Caption[],
): string {
  // scale + center-crop to 1080x1920, then drawtext layers
  const filters: string[] = [
    `scale=1080:1920:force_original_aspect_ratio=increase`,
    `crop=1080:1920`,
  ];
  const addText = (
    text: string,
    y: string,
    fontSize: number,
    bg: boolean,
    enableExpr?: string,
  ) => {
    const safe = escapeDrawtext(text);
    const parts = [
      `text='${safe}'`,
      `fontcolor=white`,
      `fontsize=${fontSize}`,
      `x=(w-text_w)/2`,
      `y=${y}`,
      `borderw=4`,
      `bordercolor=black@0.85`,
    ];
    if (bg) {
      parts.push(`box=1`, `boxcolor=black@0.55`, `boxborderw=30`);
    }
    if (enableExpr) parts.push(`enable='${enableExpr}'`);
    filters.push(`drawtext=${parts.join(":")}`);
  };
  if (headline && headline.text.trim()) {
    const y = headline.position === "top" ? "120" : "h-text_h-160";
    addText(headline.text, y, 68, true);
  }
  captions.forEach((c) => {
    if (!c.text.trim()) return;
    const y =
      c.position === "top"
        ? "260"
        : c.position === "middle"
          ? "(h-text_h)/2"
          : "h-text_h-320";
    addText(c.text, y, 56, true, `between(t,${c.start},${c.end})`);
  });
  return filters.join(",");
}

export async function renderVideo(config: RenderConfig): Promise<Blob> {
  const { intro, clip, headline, captions, onProgress } = config;
  const ffmpegLogTail: string[] = [];
  const ffmpeg = await getFFmpeg((msg) => {
    ffmpegLogTail.push(msg);
    if (ffmpegLogTail.length > 60) ffmpegLogTail.shift();
  });

  ffmpeg.on("progress", ({ progress }) => {
    onProgress?.("encoding", Math.max(0, Math.min(1, progress)));
  });



  try {
    // 1. Intro frames
    onProgress?.("rendering-intro-frames", 0);
    await renderIntroFrames(intro, ffmpeg, (r) =>
      onProgress?.("rendering-intro-frames", r),
    );

    // 2. Encode intro to mp4
    onProgress?.("encoding-intro", 0);
    await execOrThrow(ffmpeg, [
      "-framerate",
      String(INTRO_FPS),
      "-i",
      "intro_%04d.jpg",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-r",
      String(INTRO_FPS),
      "-t",
      String(INTRO_FRAMES / INTRO_FPS),
      "intro.mp4",
    ], "intro encode", ffmpegLogTail);

    // 3. Process clip with overlays -> normalized to 1080x1920, 30fps
    onProgress?.("processing-clip", 0);
    const clipDur = await getMediaDuration(clip).catch(() => 15);
    const clipBuf = new Uint8Array(await clip.arrayBuffer());
    await ffmpeg.writeFile("input.mp4", clipBuf);
    const vf = buildOverlayFilter(headline, captions);
    await execOrThrow(ffmpeg, [
      "-i",
      "input.mp4",
      "-vf",
      vf,
      "-r",
      String(INTRO_FPS),
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-an",
      "clip_out.mp4",
    ], "clip processing", ffmpegLogTail);

    // 3b. Fetch + normalize outro to matching format
    onProgress?.("processing-outro", 0);
    const outroRes = await fetch(OUTRO_URL);
    if (!outroRes.ok) throw new Error(`Failed to fetch outro: ${outroRes.status}`);
    const outroArrayBuffer = await outroRes.arrayBuffer();
    const outroDur = await getMediaDuration(new Blob([outroArrayBuffer.slice(0)], { type: "video/mp4" })).catch(() => 4);
    await ffmpeg.writeFile("outro_in.mp4", new Uint8Array(outroArrayBuffer));
    await execOrThrow(ffmpeg, [
      "-i",
      "outro_in.mp4",
      "-vf",
      "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920",
      "-r",
      String(INTRO_FPS),
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-an",
      "outro.mp4",
    ], "outro processing", ffmpegLogTail);

    // 4. Fetch music track and write to ffmpeg FS
    onProgress?.("adding-music", 0);
    const musicRes = await fetch(MUSIC_URL);
    if (!musicRes.ok) throw new Error(`Failed to fetch music: ${musicRes.status}`);
    const musicBuf = new Uint8Array(await musicRes.arrayBuffer());
    await ffmpeg.writeFile("music.mp3", musicBuf);

    // 4b. Pre-generated intro SFX (whoosh + thump) as a WAV file
    const sfxBuf = generateIntroSfxWav();
    await ffmpeg.writeFile("sfx.wav", sfxBuf);

    // 5. Read durations for xfade offsets
    const introDur = INTRO_FRAMES / INTRO_FPS; // known: 3.0
    const xfadeDur = 0.5;
    const offset1 = Math.max(0.1, introDur - xfadeDur); // intro→clip
    const offset2 = Math.max(offset1 + 0.1, introDur + clipDur - xfadeDur * 2); // (intro+clip)→outro
    const totalDur = introDur + clipDur + outroDur - xfadeDur * 2;
    const musicFadeOutStart = Math.max(0, totalDur - 1.2);

    // 6. Final assembly — smooth video crossfades + music + intro SFX.
    // Audio is generated here so uploads/outros without audio tracks still render.
    onProgress?.("concatenating", 0);
    const filter = [
      `[0:v]fps=${INTRO_FPS},format=yuv420p,settb=AVTB,setpts=PTS-STARTPTS[v0]`,
      `[1:v]fps=${INTRO_FPS},format=yuv420p,settb=AVTB,setpts=PTS-STARTPTS[v1]`,
      `[2:v]fps=${INTRO_FPS},format=yuv420p,settb=AVTB,setpts=PTS-STARTPTS[v2]`,
      `[v0][v1]xfade=transition=fade:duration=${xfadeDur}:offset=${offset1.toFixed(3)}[vx1]`,
      `[vx1][v2]xfade=transition=fade:duration=${xfadeDur}:offset=${offset2.toFixed(3)}[vout]`,
      `[3:a]atrim=0:${totalDur.toFixed(3)},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=0.8,afade=t=out:st=${musicFadeOutStart.toFixed(3)}:d=1.2,volume=0.85[bg]`,
      `[4:a]aformat=channel_layouts=stereo,volume=1.4[sfx]`,
      `[bg][sfx]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[aout]`,
    ].join(";");

    await execOrThrow(ffmpeg, [
      "-i", "intro.mp4",
      "-i", "clip_out.mp4",
      "-i", "outro.mp4",
      "-stream_loop", "-1",
      "-i", "music.mp3",
      "-i", "sfx.wav",
      "-filter_complex", filter,
      "-map", "[vout]",
      "-map", "[aout]",
      "-c:v", "libx264",
      "-pix_fmt", "yuv420p",
      "-r", String(INTRO_FPS),
      "-c:a", "aac",
      "-b:a", "192k",
      "-movflags", "+faststart",
      "final.mp4",
    ], "final assembly", ffmpegLogTail);

    const data = (await ffmpeg.readFile("final.mp4")) as Uint8Array;
    const finalBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
    return new Blob([finalBuffer], { type: "video/mp4" });
  } catch (e) {
    console.error("[ads-studio] render failed. Last ffmpeg log lines:\n" + ffmpegLogTail.join("\n"));
    throw e;
  } finally {
    for (let f = 0; f < INTRO_FRAMES; f++) {
      await ffmpeg.deleteFile(`intro_${String(f).padStart(4, "0")}.jpg`).catch(() => undefined);
    }
    await Promise.all([
      "intro.mp4",
      "input.mp4",
      "clip_out.mp4",
      "outro_in.mp4",
      "outro.mp4",
      "music.mp3",
      "sfx.wav",
      "final.mp4",
    ].map((name) => ffmpeg.deleteFile(name).catch(() => undefined)));
    ffmpeg.terminate();
  }
}

// re-export helper for consumers
export { fetchFile };
