import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import outroAsset from "../../assets/ads-outro.mp4.asset.json";
import logoAsset from "../../assets/mybabes-logo.svg.asset.json";
import musicAsset from "../../assets/ads-music.mp3.asset.json";
const OUTRO_URL = outroAsset.url;
const LOGO_URL = logoAsset.url;
const MUSIC_URL = musicAsset.url;
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

let ffmpegInstance: FFmpeg | null = null;

async function getFFmpeg(onLog?: (msg: string) => void): Promise<FFmpeg> {
  if (ffmpegInstance) return ffmpegInstance;
  const ffmpeg = new FFmpeg();
  if (onLog) ffmpeg.on("log", ({ message }) => onLog(message));
  // Single-threaded core — no SharedArrayBuffer / COOP-COEP required.
  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });
  ffmpegInstance = ffmpeg;
  return ffmpeg;
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
  const ffmpeg = await getFFmpeg();

  ffmpeg.on("progress", ({ progress }) => {
    onProgress?.("encoding", Math.max(0, Math.min(1, progress)));
  });

  // 1. Intro frames
  onProgress?.("rendering-intro-frames", 0);
  await renderIntroFrames(intro, ffmpeg, (r) =>
    onProgress?.("rendering-intro-frames", r),
  );

  // 2. Encode intro to mp4 (silent audio track for concat compatibility)
  onProgress?.("encoding-intro", 0);
  await ffmpeg.exec([
    "-framerate",
    String(INTRO_FPS),
    "-i",
    "intro_%04d.jpg",
    "-f",
    "lavfi",
    "-i",
    "anullsrc=channel_layout=stereo:sample_rate=44100",
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-r",
    String(INTRO_FPS),
    "-c:a",
    "aac",
    "-shortest",
    "-t",
    String(INTRO_FRAMES / INTRO_FPS),
    "intro.mp4",
  ]);

  // 3. Process clip with overlays -> normalized to 1080x1920, 30fps, aac
  onProgress?.("processing-clip", 0);
  const clipBuf = new Uint8Array(await clip.arrayBuffer());
  await ffmpeg.writeFile("input.mp4", clipBuf);
  const vf = buildOverlayFilter(headline, captions);
  await ffmpeg.exec([
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
    "-c:a",
    "aac",
    "-ar",
    "44100",
    "-ac",
    "2",
    "clip_out.mp4",
  ]);

  // 3b. Fetch + normalize outro to matching format
  onProgress?.("processing-outro", 0);
  const outroRes = await fetch(OUTRO_URL);
  if (!outroRes.ok) throw new Error(`Failed to fetch outro: ${outroRes.status}`);
  const outroBuf = new Uint8Array(await outroRes.arrayBuffer());
  await ffmpeg.writeFile("outro_in.mp4", outroBuf);
  await ffmpeg.exec([
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
    "-c:a",
    "aac",
    "-ar",
    "44100",
    "-ac",
    "2",
    "outro.mp4",
  ]);

  // 4. Concat intro + clip + outro
  onProgress?.("concatenating", 0);
  const list = "file 'intro.mp4'\nfile 'clip_out.mp4'\nfile 'outro.mp4'\n";
  await ffmpeg.writeFile("list.txt", new TextEncoder().encode(list));
  await ffmpeg.exec([
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    "list.txt",
    "-c",
    "copy",
    "final.mp4",
  ]);

  const data = (await ffmpeg.readFile("final.mp4")) as Uint8Array;
  // Cleanup
  try {
    for (let f = 0; f < INTRO_FRAMES; f++) {
      await ffmpeg.deleteFile(`intro_${String(f).padStart(4, "0")}.jpg`);
    }
    await ffmpeg.deleteFile("intro.mp4");
    await ffmpeg.deleteFile("input.mp4");
    await ffmpeg.deleteFile("clip_out.mp4");
    await ffmpeg.deleteFile("outro_in.mp4");
    await ffmpeg.deleteFile("outro.mp4");
    await ffmpeg.deleteFile("list.txt");
    await ffmpeg.deleteFile("final.mp4");
  } catch {
    // ignore cleanup errors
  }
  return new Blob([data.buffer as ArrayBuffer], { type: "video/mp4" });
}

// re-export helper for consumers
export { fetchFile };
