import bg from "@/assets/popunder-nsfw-gay2/bg.jpg.asset.json";
import marco from "@/assets/popunder-nsfw-gay2/marco.jpg.asset.json";
import jake from "@/assets/popunder-nsfw-gay2/jake.jpg.asset.json";
import diego from "@/assets/popunder-nsfw-gay2/diego.jpg.asset.json";
import mybabesHeart from "@/assets/popunder/mybabes-heart.png.asset.json";

const dudes = [
  { src: marco.url, name: "Marco", age: 28, accent: "#ff3b6b" },
  { src: jake.url, name: "Jake", age: 26, accent: "#a78bfa" },
  { src: diego.url, name: "Diego", age: 30, accent: "#38bdf8" },
];

const PopNsfwGay2 = () => {
  return (
    <div
      className="min-h-screen w-full relative overflow-x-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bg.url})`, backgroundColor: "#0a0014" }}
    >
      <style>{`
        .dick-card .lower {
          filter: blur(26px) brightness(0.55) saturate(0.9);
          transition: filter 0.4s ease;
        }
        .dick-card:hover .lower,
        .dick-card:focus-within .lower,
        .dick-card:active .lower {
          filter: blur(0px) brightness(1) saturate(1);
        }
        .dick-card .send-btn {
          opacity: 1;
          transition: opacity 0.25s ease;
        }
        .dick-card:hover .send-btn,
        .dick-card:focus-within .send-btn,
        .dick-card:active .send-btn {
          opacity: 0;
          pointer-events: none;
        }
        .dick-card .lock-icon { transition: opacity 0.25s ease; }
        .dick-card:hover .lock-icon,
        .dick-card:focus-within .lock-icon,
        .dick-card:active .lock-icon { opacity: 0; }
      `}</style>

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/85 pointer-events-none" />

      {/* Logo */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30 flex items-center gap-2 pointer-events-none select-none">
        <img src={mybabesHeart.url} alt="mybabes" className="w-8 h-8 sm:w-9 sm:h-9" />
        <span
          className="font-semibold lowercase tracking-tight text-white"
          style={{ fontSize: "clamp(1rem, 2.2vw, 1.35rem)", fontFamily: "'Onest', sans-serif" }}
        >
          mybabes
        </span>
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 pt-20 sm:pt-24 pb-12 min-h-screen">
        {/* Headline */}
        <div className="text-center max-w-2xl mb-10 sm:mb-14">
          <p
            className="uppercase tracking-[0.3em] text-white/60 mb-3"
            style={{ fontSize: "clamp(0.65rem, 1.1vw, 0.8rem)", fontFamily: "'Onest', sans-serif" }}
          >
            Tonight's pick
          </p>
          <h1
            className="font-semibold text-white leading-[1.1] tracking-tight"
            style={{ fontSize: "clamp(1.75rem, 4.2vw, 2.75rem)", fontFamily: "'Onest', sans-serif" }}
          >
            Who's sending the best dick pic?
          </h1>
          <p
            className="mt-4 text-white/70"
            style={{ fontSize: "clamp(0.9rem, 1.6vw, 1.05rem)", fontFamily: "'Onest', sans-serif" }}
          >
            Hover to reveal — pick the one you want first.
          </p>
        </div>

        {/* Cards grid */}
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {dudes.map((d, i) => (
            <div key={i} className="dick-card group flex flex-col items-stretch cursor-pointer">
              {/* Upper portrait */}
              <div
                className="relative overflow-hidden rounded-t-2xl bg-black"
                style={{ aspectRatio: "1 / 1" }}
              >
                <img
                  src={d.src}
                  alt={d.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
                {/* subtle accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{ background: d.accent }}
                />
              </div>

              {/* Lower (blurred until hover) - 13:19 ratio */}
              <div
                className="relative overflow-hidden rounded-b-2xl bg-black"
                style={{ aspectRatio: "13 / 19" }}
              >
                <img
                  src={d.src}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="lower absolute inset-0 w-full h-full object-cover object-bottom"
                />
                {/* dark overlay */}
                <div className="lock-icon absolute inset-0 bg-black/55 pointer-events-none" />

                {/* Send dick pic button */}
                <button
                  type="button"
                  className="send-btn absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center gap-2 backdrop-blur-md bg-white/10 hover:bg-white/15 text-white border border-white/25 rounded-full whitespace-nowrap"
                  style={{
                    fontFamily: "'Onest', sans-serif",
                    fontSize: "clamp(0.75rem, 1.3vw, 0.9rem)",
                    fontWeight: 600,
                    padding: "0.65rem 1.2rem",
                    letterSpacing: "0.02em",
                    boxShadow: `0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px ${d.accent}40`,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Send dick pic
                </button>
              </div>

              {/* Name strip */}
              <div className="mt-4 flex items-baseline justify-between px-1">
                <div className="flex items-baseline gap-2">
                  <span
                    className="font-semibold text-white"
                    style={{ fontSize: "clamp(1rem, 1.8vw, 1.25rem)", fontFamily: "'Onest', sans-serif" }}
                  >
                    {d.name}
                  </span>
                  <span className="text-white/50" style={{ fontSize: "0.9rem" }}>
                    {d.age}
                  </span>
                </div>
                <span
                  className="text-xs uppercase tracking-widest"
                  style={{ color: d.accent, fontFamily: "'Onest', sans-serif", letterSpacing: "0.18em" }}
                >
                  Online
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopNsfwGay2;
