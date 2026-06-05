import bg from "@/assets/popunder-sfw-him/bg.png.asset.json";
import mafia from "@/assets/popunder-sfw-him/mafia.png.asset.json";
import guard from "@/assets/popunder-sfw-him/guard.png.asset.json";
import bully from "@/assets/popunder-sfw-him/bully.png.asset.json";
import mybabesHeart from "@/assets/popunder/mybabes-heart.png.asset.json";

const guys = [
  {
    src: mafia.url,
    name: "KENJI",
    role: "MAFIA BOSS",
    accent: "#ff2d6f",
    tooltip: "claim me, boss 💋",
  },
  {
    src: guard.url,
    name: "RYU",
    role: "BODYGUARD",
    accent: "#5ac8ff",
    tooltip: "i'll keep you safe 🛡️",
  },
  {
    src: bully.url,
    name: "HARU",
    role: "SCHOOL BULLY",
    accent: "#ffd23f",
    tooltip: "tease me, senpai 😈",
  },
];

const positions = ["18%", "50%", "82%"];

const PopSfwHim = () => {
  return (
    <div
      className="min-h-screen w-full bg-no-repeat bg-center bg-cover relative overflow-x-hidden sfw-bg"
      style={{ backgroundImage: `url(${bg.url})`, backgroundColor: "#1a0b2e" }}
    >
      <style>{`
        @media (max-width: 767px) {
          .headline-wrap {
            top: 4rem !important;
          }
          .babe-card {
            position: relative !important;
            left: auto !important;
            bottom: auto !important;
            top: auto !important;
            transform: none !important;
            width: 70% !important;
            max-width: 280px !important;
            margin: 0 auto;
          }
          .babe-card .babe-inner {
            transform: none !important;
          }
          .babes-stack {
            display: flex !important;
            flex-direction: column;
            align-items: center;
            gap: 2.5rem;
            padding: 14rem 0 3rem;
          }
          .pick-tooltip {
            top: 42% !important;
            transform: translate(-50%, -50%) rotate(-3deg) !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .babe-card {
            width: 28% !important;
          }
        }
        @keyframes floatY {
          0%, 100% { transform: scale(1.18) translateY(0); }
          50% { transform: scale(1.18) translateY(-8px); }
        }
        .babe-card:hover .babe-inner,
        .babe-card:active .babe-inner,
        .babe-card:focus-within .babe-inner {
          animation: floatY 2s ease-in-out infinite;
        }
        @keyframes petalFall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.9; }
          100% { transform: translateY(110vh) rotate(540deg); opacity: 0; }
        }
        .petal {
          position: absolute;
          top: -5vh;
          width: 14px;
          height: 14px;
          background: radial-gradient(circle at 30% 30%, #ffd6e8, #ff80aa);
          border-radius: 80% 0 80% 0;
          opacity: 0.85;
          pointer-events: none;
          animation: petalFall linear infinite;
          filter: drop-shadow(0 0 4px rgba(255,128,170,0.6));
        }
      `}</style>

      {/* Dark gradient overlay for legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(20,5,40,0.25) 0%, rgba(10,2,25,0.75) 80%)",
          zIndex: 1,
        }}
      />

      {/* Falling sakura petals */}
      {Array.from({ length: 14 }).map((_, i) => (
        <div
          key={`petal-${i}`}
          className="petal"
          style={{
            left: `${(i * 7 + 3) % 100}%`,
            animationDuration: `${8 + (i % 5) * 2}s`,
            animationDelay: `${-(i * 1.3)}s`,
            zIndex: 2,
          }}
        />
      ))}

      {/* Logo */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-30 flex items-center gap-1.5 sm:gap-2 pointer-events-none select-none">
        <img
          src={mybabesHeart.url}
          alt="mybabes logo"
          className="w-7 h-7 sm:w-10 sm:h-10 drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]"
        />
        <span
          className="font-black lowercase tracking-tight"
          style={{
            fontSize: "clamp(1rem, 3.2vw, 1.75rem)",
            color: "#ffffff",
            fontFamily: "'Onest', sans-serif",
            textShadow: "0 2px 0 rgba(0,0,0,0.5), 0 6px 14px rgba(0,0,0,0.6)",
          }}
        >
          mybabes
        </span>
      </div>

      {/* Headline */}
      <div
        className="headline-wrap absolute left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none w-[92%] max-w-[900px] px-2"
        style={{ top: "4%" }}
      >
        <div
          className="font-bold uppercase tracking-[0.3em] mb-2"
          style={{
            fontSize: "clamp(0.7rem, 1.4vw, 1rem)",
            color: "#ff80aa",
            textShadow: "0 0 12px rgba(255,128,170,0.8), 0 2px 4px rgba(0,0,0,0.8)",
            fontFamily: "'Onest', sans-serif",
          }}
        >
          ✦ Choose your story ✦
        </div>
        <h1
          className="font-black leading-[1.05]"
          style={{
            fontSize: "clamp(1.6rem, 5.2vw, 3rem)",
            color: "#ffffff",
            textShadow:
              "0 0 20px rgba(255,128,170,0.6), 0 0 40px rgba(180,100,255,0.4), 0 4px 12px rgba(0,0,0,0.8)",
            fontFamily: "'Onest', serif",
            letterSpacing: "-0.01em",
          }}
        >
          Who will steal your heart tonight?
        </h1>
        <div
          className="mt-2 font-medium"
          style={{
            fontSize: "clamp(0.8rem, 1.7vw, 1.15rem)",
            color: "#e8d5ff",
            textShadow: "0 2px 6px rgba(0,0,0,0.8)",
            fontFamily: "'Onest', sans-serif",
          }}
        >
          Pick a role-play. Live the fantasy.
        </div>
      </div>

      <div className="babes-stack contents">
        {positions.map((left, i) => {
          const g = guys[i];
          return (
            <div
              key={i}
              className="babe-card absolute group"
              style={{
                left,
                top: "60%",
                transform: "translate(-50%, -50%)",
                width: "clamp(140px, 22vw, 280px)",
                zIndex: 5,
                cursor: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'><text x='4' y='38' font-size='38'>💖</text></svg>") 24 24, pointer`,
              }}
            >
              {/* Hover tooltip */}
              <div
                className="pick-tooltip absolute left-1/2 -translate-x-1/2 z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out -translate-y-2 group-hover:translate-y-0"
                style={{ top: "clamp(-5rem, -10vw, -3.5rem)" }}
              >
                <div
                  className="relative rounded-full whitespace-nowrap backdrop-blur-md"
                  style={{
                    background: "rgba(255,255,255,0.92)",
                    color: "#1a0b2e",
                    fontFamily: "'Onest', sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(0.7rem, 1.5vw, 1.05rem)",
                    padding:
                      "clamp(0.4rem, 0.9vw, 0.6rem) clamp(0.9rem, 1.8vw, 1.4rem)",
                    boxShadow: `0 0 24px ${g.accent}aa, 0 10px 30px rgba(0,0,0,0.5)`,
                    border: `2px solid ${g.accent}`,
                  }}
                >
                  {g.tooltip}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0"
                    style={{
                      borderLeft: "8px solid transparent",
                      borderRight: "8px solid transparent",
                      borderTop: `10px solid ${g.accent}`,
                    }}
                  />
                </div>
              </div>

              <div className="babe-inner flex flex-col items-center transition-all duration-300 ease-out group-hover:scale-[1.18] origin-bottom [filter:brightness(0.75)_saturate(0.85)] group-hover:[filter:brightness(1.05)_saturate(1.15)_drop-shadow(0_0_30px_var(--accent))]"
                style={{ ['--accent' as never]: g.accent }}
              >
                {/* Portrait card */}
                <div
                  className="relative w-full"
                  style={{
                    aspectRatio: "3 / 4",
                    borderRadius: "14px",
                    overflow: "hidden",
                    boxShadow: `0 0 0 3px rgba(255,255,255,0.9), 0 0 0 5px ${g.accent}, 0 18px 40px rgba(0,0,0,0.7)`,
                    background: "#0a0414",
                  }}
                >
                  <img
                    src={g.src}
                    alt={`${g.name} - ${g.role}`}
                    loading="lazy"
                    className="block w-full h-full object-cover pointer-events-none select-none"
                  />
                  {/* Bottom gradient + role tag */}
                  <div
                    className="absolute inset-x-0 bottom-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(10,2,25,0.95) 0%, rgba(10,2,25,0.6) 50%, transparent 100%)",
                      padding: "1.4rem 0.6rem 0.7rem",
                    }}
                  >
                    <div
                      className="text-center font-black uppercase tracking-wider"
                      style={{
                        fontSize: "clamp(0.95rem, 2.2vw, 1.65rem)",
                        color: "#ffffff",
                        fontFamily: "'Onest', sans-serif",
                        textShadow: `0 2px 8px rgba(0,0,0,0.9), 0 0 16px ${g.accent}aa`,
                        lineHeight: 1.1,
                      }}
                    >
                      {g.name}
                    </div>
                    <div
                      className="text-center font-semibold uppercase tracking-[0.2em] mt-0.5"
                      style={{
                        fontSize: "clamp(0.55rem, 1.1vw, 0.8rem)",
                        color: g.accent,
                        fontFamily: "'Onest', sans-serif",
                        textShadow: "0 2px 6px rgba(0,0,0,0.9)",
                      }}
                    >
                      {g.role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PopSfwHim;
