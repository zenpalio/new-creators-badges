import { useEffect, useMemo, useState } from "react";
import { scenarioById, type ScenarioId } from "./scenarios";

export default function MatchIntro({
  id,
  onReply,
  onBack,
}: {
  id: ScenarioId;
  onReply: () => void;
  onBack: () => void;
}) {
  const s = scenarioById(id);
  const [show, setShow] = useState(s.mode === "story" ? true : false);
  const [slide, setSlide] = useState(0);

  const storySlides = useMemo(() => s.introSlides ?? [], [s.introSlides]);
  const isStory = s.mode === "story" && storySlides.length > 0;
  const currentSlide = isStory ? storySlides[slide] : null;
  const liveMedia = s.heat[0];

  useEffect(() => {
    if (isStory) return;
    const t = window.setTimeout(() => setShow(true), 900);
    return () => window.clearTimeout(t);
  }, [isStory]);

  const advanceStory = () => {
    if (!isStory) return onReply();
    if (slide >= storySlides.length - 1) {
      onReply();
      return;
    }
    setSlide((value) => value + 1);
  };

  const rewindStory = () => {
    if (!isStory) {
      onBack();
      return;
    }
    if (slide === 0) {
      onBack();
      return;
    }
    setSlide((value) => value - 1);
  };

  return (
    <div className="fixed inset-0 z-40 overflow-hidden bg-black text-white">
      {isStory && currentSlide ? (
        <>
          <img
            src={currentSlide.media}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ animation: "cold-zoom 7s ease-out forwards" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/60" />
          <div className="absolute top-4 left-4 right-4 z-10 flex gap-1.5">
            {storySlides.map((_, i) => (
              <div key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/20">
                <div
                  className={`h-full rounded-full ${i <= slide ? "bg-white" : "bg-transparent"}`}
                />
              </div>
            ))}
          </div>

          <button className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={rewindStory} aria-label="Previous slide" />
          <button className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={advanceStory} aria-label="Next slide" />

          <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-[max(28px,env(safe-area-inset-bottom))]">
            <div className="mx-auto flex max-w-md flex-col gap-4">
              <div className="inline-flex w-fit rounded-full border border-white/15 bg-white/[0.08] px-4 py-1.5 text-[10px] uppercase tracking-[0.25em] text-white/80 backdrop-blur-xl">
                {s.modeLabel}
              </div>
              <div className="rounded-[28px] border border-white/12 bg-white/[0.08] p-5 backdrop-blur-xl shadow-2xl">
                <div className="mb-2 text-[10px] uppercase tracking-[0.28em] text-white/45">{s.name}</div>
                <h1 className="mb-3 text-[28px] font-black leading-none tracking-tight">{currentSlide.title}</h1>
                <p className="text-[15px] leading-relaxed text-white/86">{currentSlide.caption}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={rewindStory}
                  className="h-12 flex-1 rounded-full border border-white/12 bg-white/[0.06] text-[11px] font-semibold uppercase tracking-[0.24em] text-white/78 backdrop-blur-xl transition hover:bg-white/[0.1]"
                >
                  {slide === 0 ? "Back" : "Previous"}
                </button>
                <button
                  onClick={advanceStory}
                  className="h-12 flex-[1.2] rounded-full text-[11px] font-bold uppercase tracking-[0.24em] text-white shadow-[0_0_40px_hsl(var(--primary-v2)/0.45)] transition hover:scale-[1.01] active:scale-[0.98]"
                  style={{ background: `linear-gradient(135deg, hsl(var(--primary-v2)), ${s.accent})` }}
                >
                  {slide === storySlides.length - 1 ? `Start with ${s.name}` : "Next scene"}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {liveMedia.kind === "video" ? (
            <video
              key={liveMedia.src}
              src={liveMedia.src}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <img
              src={s.hero}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              style={{ animation: "cold-zoom 6s ease-out forwards" }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/60" />

          <div className="absolute top-6 left-1/2 z-10 -translate-x-1/2 animate-fade-in">
            <div className="rounded-full border border-white/15 bg-white/[0.08] px-4 py-1.5 text-[10px] uppercase tracking-[0.25em] text-white/80 backdrop-blur-xl">
              {s.modeLabel}
            </div>
          </div>

          {show && (
            <div className="absolute inset-x-0 bottom-0 px-6 pb-[max(28px,env(safe-area-inset-bottom))]">
              <div className="mx-auto flex max-w-md flex-col gap-5">
                <div className="flex items-end gap-3 animate-fade-in">
                  <img
                    src={s.portrait}
                    alt={s.name}
                    className="h-12 w-12 shrink-0 rounded-full border-2 object-cover"
                    style={{ borderColor: s.accent }}
                  />
                  <div className="flex-1 rounded-2xl rounded-bl-md border border-white/15 bg-white/[0.09] px-5 py-4 text-[15px] leading-relaxed text-white backdrop-blur-xl shadow-2xl">
                    {s.opener}
                  </div>
                </div>

                <div className="text-center text-[10px] uppercase tracking-[0.3em] text-white/40">{s.hook}</div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={onBack}
                    className="h-12 flex-1 rounded-full border border-white/12 bg-white/[0.06] text-[11px] font-semibold uppercase tracking-[0.24em] text-white/78 backdrop-blur-xl transition hover:bg-white/[0.1]"
                  >
                    Back
                  </button>
                  <button
                    onClick={onReply}
                    className="h-12 flex-[1.2] rounded-full text-[11px] font-bold uppercase tracking-[0.24em] text-white shadow-[0_0_40px_hsl(var(--primary-v2)/0.45)] transition hover:scale-[1.01] active:scale-[0.98]"
                    style={{ background: `linear-gradient(135deg, hsl(var(--primary-v2)), ${s.accent})` }}
                  >
                    Reply to {s.name}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <style>{`
        @keyframes cold-zoom {
          from { transform: scale(1.15); }
          to   { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
