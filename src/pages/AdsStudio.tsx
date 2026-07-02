import "@fontsource/bebas-neue/400.css";
import { useEffect, useMemo, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import PreviewStage from "../components/ads/PreviewStage";
import IntroConfigPanel from "../components/ads/IntroConfig";
import ClipDropzone from "../components/ads/ClipDropzone";
import OverlayEditor from "../components/ads/OverlayEditor";
import type { IntroConfig } from "../lib/adsStudio/introFrames";
import type { Caption, Headline } from "../lib/adsStudio/ffmpegClient";
import { renderVideo } from "../lib/adsStudio/ffmpegClient";
import { toast } from "sonner";

const AdsStudio = () => {
  const [intro, setIntro] = useState<IntroConfig>({
    title: "Anna's Diary",
    subtitle: "A POV Roleplay",
    theme: "anna",
  });
  const [clip, setClip] = useState<File | null>(null);
  const [headline, setHeadline] = useState<Headline | null>(null);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [rendering, setRendering] = useState(false);
  const [stage, setStage] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const clipUrl = useMemo(() => (clip ? URL.createObjectURL(clip) : null), [clip]);
  useEffect(() => {
    return () => {
      if (clipUrl) URL.revokeObjectURL(clipUrl);
    };
  }, [clipUrl]);

  useEffect(() => {
    document.title = "Ads Studio — Internal";
  }, []);

  const handleExport = async () => {
    if (!clip) {
      toast.error("Upload a clip first");
      return;
    }
    setRendering(true);
    setDownloadUrl(null);
    setStage("preparing");
    setProgress(0);
    try {
      const blob = await renderVideo({
        intro,
        clip,
        headline,
        captions,
        onProgress: (s, r) => {
          setStage(s);
          setProgress(r);
        },
      });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      toast.success("Video ready!");
    } catch (e) {
      console.error(e);
      toast.error("Render failed — check console");
    } finally {
      setRendering(false);
      setStage("");
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <header className="border-b border-white/5 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Ads Studio</h1>
            <p className="text-xs text-white/50">Internal — 9:16 ad stitcher</p>
          </div>
          <button
            onClick={handleExport}
            disabled={rendering || !clip}
            className="inline-flex items-center gap-2 rounded-full bg-primary-v2 px-4 py-2 text-sm font-semibold text-primary-v2-foreground shadow-lg shadow-primary-v2/20 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {rendering ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {rendering ? "Rendering…" : "Export MP4"}
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-6 py-8 lg:grid-cols-[minmax(0,380px)_1fr]">
        {/* Preview */}
        <section>
          <PreviewStage intro={intro} clipUrl={clipUrl} headline={headline} captions={captions} />
          {(rendering || downloadUrl) && (
            <div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-4">
              {rendering && (
                <>
                  <div className="mb-2 flex items-center justify-between text-xs text-white/60">
                    <span className="capitalize">{stage.replace(/-/g, " ")}</span>
                    <span>{Math.round(progress * 100)}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full bg-primary-v2 transition-all"
                      style={{ width: `${Math.max(4, progress * 100)}%` }}
                    />
                  </div>
                </>
              )}
              {downloadUrl && !rendering && (
                <a
                  href={downloadUrl}
                  download={`ads-studio-${Date.now()}.mp4`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-v2 px-4 py-2.5 text-sm font-semibold text-primary-v2-foreground hover:opacity-90"
                >
                  <Download className="h-4 w-4" />
                  Download final.mp4
                </a>
              )}
            </div>
          )}
        </section>

        {/* Controls */}
        <section className="space-y-6">
          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/80">Intro</h2>
            <IntroConfigPanel value={intro} onChange={setIntro} />
          </div>

          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/80">Clip</h2>
            <ClipDropzone file={clip} onChange={setClip} />
          </div>

          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/80">
              Overlays
            </h2>
            <OverlayEditor
              headline={headline}
              captions={captions}
              onHeadline={setHeadline}
              onCaptions={setCaptions}
            />
          </div>

          <div className="rounded-xl border border-dashed border-white/10 bg-black/20 p-4 text-sm text-white/50">
            <div className="font-semibold text-white/70">Outro</div>
            <div className="mt-1">Awaiting assets — will be appended after the clip.</div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdsStudio;
