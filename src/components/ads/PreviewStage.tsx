import { useEffect, useRef, useState } from "react";
import IntroCanvas from "./IntroCanvas";
import type { IntroConfig } from "../../lib/adsStudio/introFrames";
import type { Caption, Headline } from "../../lib/adsStudio/ffmpegClient";
import { Play, Pause, RotateCcw } from "lucide-react";

interface Props {
  intro: IntroConfig;
  clipUrl: string | null;
  headline: Headline | null;
  captions: Caption[];
}

type Stage = "idle" | "intro" | "clip" | "done";

const INTRO_SECONDS = 3;

const PreviewStage = ({ intro, clipUrl, headline, captions }: Props) => {
  const [stage, setStage] = useState<Stage>("idle");
  const [videoTime, setVideoTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const play = () => {
    setStage("intro");
  };
  const reset = () => {
    setStage("idle");
    setVideoTime(0);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };
  const pause = () => {
    if (stage === "clip" && videoRef.current) videoRef.current.pause();
    setStage("idle");
  };

  useEffect(() => {
    if (stage !== "clip" || !videoRef.current) return;
    const v = videoRef.current;
    v.currentTime = 0;
    v.play().catch(() => {});
    const onTime = () => setVideoTime(v.currentTime);
    const onEnd = () => setStage("done");
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnd);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnd);
    };
  }, [stage]);

  const showHeadline = stage === "clip" && headline && headline.text.trim();
  const activeCaption =
    stage === "clip"
      ? captions.find((c) => c.text.trim() && videoTime >= c.start && videoTime <= c.end)
      : undefined;

  return (
    <div className="relative w-full max-w-[380px] mx-auto">
      <div
        className="relative w-full overflow-hidden rounded-2xl bg-black ring-1 ring-white/10"
        style={{ aspectRatio: "9 / 16" }}
      >
        {/* Intro layer */}
        {(stage === "idle" || stage === "intro") && (
          <div className="absolute inset-0">
            <IntroCanvas
              config={intro}
              playing={stage === "intro"}
              onEnd={() => setStage(clipUrl ? "clip" : "done")}
            />
          </div>
        )}

        {/* Clip layer */}
        {clipUrl && (stage === "clip" || stage === "done") && (
          <video
            ref={videoRef}
            src={clipUrl}
            className="absolute inset-0 h-full w-full object-cover"
            playsInline
          />
        )}

        {/* Overlays */}
        {showHeadline && headline && (
          <div
            className={`absolute inset-x-0 flex justify-center px-4 ${
              headline.position === "top" ? "top-6" : "bottom-24"
            }`}
          >
            <div className="rounded-lg bg-black/60 px-4 py-2 text-center text-lg font-bold text-white shadow-lg">
              {headline.text}
            </div>
          </div>
        )}
        {activeCaption && (
          <div
            className={`absolute inset-x-0 flex justify-center px-4 ${
              activeCaption.position === "top"
                ? "top-24"
                : activeCaption.position === "middle"
                  ? "top-1/2 -translate-y-1/2"
                  : "bottom-40"
            }`}
          >
            <div className="rounded-md bg-black/60 px-3 py-1.5 text-center text-base font-medium text-white">
              {activeCaption.text}
            </div>
          </div>
        )}

        {stage === "done" && (
          <div className="absolute inset-0 flex items-end justify-center bg-black/40 pb-8">
            <button
              onClick={reset}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur hover:bg-white/20"
            >
              Replay
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        {stage === "idle" || stage === "done" ? (
          <button
            onClick={play}
            className="inline-flex items-center gap-2 rounded-full bg-primary-v2 px-4 py-2 text-sm font-semibold text-primary-v2-foreground hover:opacity-90"
          >
            <Play className="h-4 w-4" /> Preview
          </button>
        ) : (
          <button
            onClick={pause}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
          >
            <Pause className="h-4 w-4" /> Pause
          </button>
        )}
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PreviewStage;
