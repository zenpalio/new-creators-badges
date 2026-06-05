import bg from "@/assets/nsfw-her-bg.jpg";
import bgMobile from "@/assets/nsfw-her-bg-mobile.jpg";
import guy1 from "@/assets/popunder-gay/guy1.png.asset.json";
import guy2 from "@/assets/popunder-gay/guy2.png.asset.json";
import guy3 from "@/assets/popunder-gay/guy3.png.asset.json";
import portrait1 from "@/assets/popunder-gay/guy_portrait1.png.asset.json";
import portrait2 from "@/assets/popunder-gay/guy_portrait2.png.asset.json";
import portrait3 from "@/assets/popunder-gay/guy_portrait3.png.asset.json";
import mybabesHeart from "@/assets/popunder/mybabes-heart.png.asset.json";

const dudes = [
  { src: guy1.url, portrait: portrait1.url, name: "MARCO", color: "#1d3a8a", size: '7"', label: "AVERAGE+", teaser: "GUESS MY SIZE 👇" },
  { src: guy2.url, portrait: portrait2.url, name: "JAKE", color: "#b026ff", size: '9"', label: "BIG BOY", teaser: "BET YOU CAN'T HANDLE IT 👇" },
  { src: guy3.url, portrait: portrait3.url, name: "DIEGO", color: "#1d3a8a", size: '11"', label: "MONSTER", teaser: "DARE TO SEE IT? 👇" },
];

const positions = ["18%", "50%", "82%"];

const PopNsfwGay2 = () => {
  return (
    <div
      className="min-h-screen w-full bg-no-repeat bg-center bg-cover relative overflow-x-hidden nsfw-bg"
      style={{ backgroundImage: `url(${bg})`, backgroundColor: "#0a0a14" }}
    >
      <style>{`
        @media (max-width: 1023px) {
          .nsfw-bg {
            background-image: url(${bgMobile}) !important;
            background-size: cover !important;
            background-position: center top !important;
            background-repeat: no-repeat !important;
          }
        }
        @media (max-width: 767px) {
          .headline-wrap { top: 3.5rem !important; }
          .babe-card {
            position: relative !important;
            left: auto !important;
            bottom: auto !important;
            top: auto !important;
            transform: none !important;
            width: 55% !important;
            max-width: 240px !important;
            margin: 0 auto;
          }
          .babe-card .babe-inner { transform: none !important; }
          .babes-stack {
            display: flex !important;
            flex-direction: column;
            align-items: center;
            gap: 3rem;
            padding: 13rem 0 2rem;
          }
          .pick-tooltip {
            top: 38% !important;
            transform: translate(-50%, -50%) rotate(-3deg) !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .babe-card { width: 30% !important; }
        }
        @keyframes babeShake {
          0%, 100% { transform: scale(1.28) rotate(0deg); }
          25% { transform: scale(1.28) rotate(-1deg); }
          50% { transform: scale(1.29) rotate(1deg); }
          75% { transform: scale(1.28) rotate(-0.8deg); }
        }
        .babe-card:hover .babe-inner,
        .babe-card:active .babe-inner,
        .babe-card:focus-within .babe-inner {
          animation: babeShake 0.7s ease-in-out infinite;
        }
        @keyframes sizePop {
          0% { transform: translate(-50%, -50%) scale(0.4) rotate(-12deg); opacity: 0; }
          60% { transform: translate(-50%, -50%) scale(1.15) rotate(-6deg); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1) rotate(-6deg); opacity: 1; }
        }
        .size-reveal {
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.15s;
        }
        .babe-card:hover .size-reveal,
        .babe-card:active .size-reveal,
        .babe-card:focus-within .size-reveal {
          opacity: 1;
          animation: sizePop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .censor-bar {
          opacity: 1;
          transition: opacity 0.2s;
        }
        .babe-card:hover .censor-bar,
        .babe-card:active .censor-bar,
        .babe-card:focus-within .censor-bar {
          opacity: 0;
        }
      `}</style>

      {/* Logo */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-30 flex items-center gap-1.5 sm:gap-2 pointer-events-none select-none">
        <img src={mybabesHeart.url} alt="mybabes logo" className="w-7 h-7 sm:w-10 sm:h-10 drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]" />
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
      <div className="headline-wrap absolute left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none w-[92%] max-w-[900px] px-2" style={{ top: "3%" }}>
        <h1
          className="font-black uppercase leading-[1.05] tracking-wider"
          style={{
            fontSize: "clamp(1.75rem, 6vw, 3.2rem)",
            color: "#ffdd00",
            WebkitTextStroke: "1.5px #000000",
            textShadow: "0 4px 0 rgba(0,0,0,0.55), 0 10px 24px rgba(0,0,0,0.7)",
            fontFamily: "'Permanent Marker', 'Onest', cursive",
            transform: "rotate(-2deg)",
          }}
        >
          Hover to reveal his size!
        </h1>
        <p
          className="mt-2 font-bold uppercase"
          style={{
            fontSize: "clamp(0.85rem, 2.2vw, 1.3rem)",
            color: "#ffffff",
            fontFamily: "'Permanent Marker', cursive",
            textShadow: "0 2px 0 rgba(0,0,0,0.6), 0 6px 14px rgba(0,0,0,0.7)",
            transform: "rotate(-1deg)",
          }}
        >
          Pick the one that makes your jaw drop 🍆
        </p>
      </div>

      {/* Graffiti */}
      {[
        { text: "HOW BIG?", top: "10%", left: "6%", rotate: -8, size: "clamp(1rem, 2.6vw, 2.4rem)", color: "#ff1f6b" },
        { text: "INCHES MATTER", top: "16%", left: "64%", rotate: 6, size: "clamp(1.1rem, 3vw, 2.6rem)", color: "#39ff14" },
        { text: "NO RULER NEEDED", top: "72%", left: "6%", rotate: -10, size: "clamp(0.9rem, 2.2vw, 2rem)", color: "#ffdd00" },
        { text: "SIZE QUEEN ZONE", top: "80%", left: "60%", rotate: 4, size: "clamp(1rem, 2.4vw, 2.2rem)", color: "#00e0ff" },
      ].map((g, i) => (
        <div
          key={`graf-${i}`}
          className="absolute pointer-events-none select-none uppercase font-black"
          style={{
            top: g.top,
            left: g.left,
            transform: `rotate(${g.rotate}deg)`,
            fontFamily: "'Permanent Marker', 'Marker Felt', cursive",
            fontSize: g.size,
            color: g.color,
            opacity: 0.8,
            mixBlendMode: "screen",
            textShadow: `2px 2px 0 rgba(0,0,0,0.6), 0 0 10px ${g.color}55`,
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
            zIndex: 2,
          }}
        >
          {g.text}
        </div>
      ))}

      <div className="babes-stack contents">
        {positions.map((left, i) => (
          <div
            key={i}
            className="babe-card absolute group"
            style={{
              left,
              top: "62%",
              transform: "translate(-50%, -50%)",
              width: "clamp(110px, 22vw, 270px)",
              zIndex: 5,
              cursor: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'><text x='4' y='38' font-size='38'>🍆</text></svg>") 24 24, pointer`,
            }}
          >
            {/* Hover teaser */}
            <div
              className="pick-tooltip absolute left-1/2 -translate-x-1/2 z-[60] pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out -translate-y-2 group-hover:translate-y-0"
              style={{ top: "clamp(-5.5rem, -11vw, -4rem)" }}
            >
              <div
                className="relative rounded-lg whitespace-nowrap"
                style={{
                  background: "#ffdd00",
                  color: "#000",
                  fontFamily: "'Permanent Marker', cursive",
                  fontSize: "clamp(0.65rem, 1.6vw, 1.1rem)",
                  padding: "clamp(0.25rem, 0.8vw, 0.5rem) clamp(0.5rem, 1.5vw, 1rem)",
                  transform: "rotate(-3deg)",
                  boxShadow: "0 6px 14px rgba(0,0,0,0.5)",
                  border: "2px solid #000",
                }}
              >
                {dudes[i].teaser}
                <div
                  className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0"
                  style={{
                    borderLeft: "8px solid transparent",
                    borderRight: "8px solid transparent",
                    borderTop: "10px solid #000",
                  }}
                />
              </div>
            </div>

            <div className="babe-inner flex flex-col items-center transition-transform duration-300 ease-out group-hover:scale-125 origin-bottom [filter:brightness(0.55)_saturate(0.35)_contrast(0.95)] group-hover:[filter:none]">
              <div className="mb-2 whitespace-nowrap pointer-events-none">
                <div
                  className="font-black uppercase leading-none tracking-wider"
                  style={{
                    fontSize: "clamp(1rem, 3.4vw, 2.6rem)",
                    color: dudes[i].color,
                    WebkitTextStroke: "2px #ffffff",
                    textShadow: "0 4px 0 rgba(0,0,0,0.4), 0 8px 18px rgba(0,0,0,0.6)",
                    fontFamily: "'Onest', sans-serif",
                  }}
                >
                  {dudes[i].name}
                </div>
              </div>

              <div
                className="relative"
                style={{
                  width: "55%",
                  aspectRatio: "1 / 1.15",
                  border: `4px solid ${dudes[i].color}`,
                  borderRadius: "8px",
                  boxShadow: `0 0 0 2px rgba(255,255,255,0.7), 0 14px 30px rgba(0,0,0,0.6)`,
                  background: "#000",
                  overflow: "hidden",
                }}
              >
                <img
                  src={dudes[i].portrait}
                  alt={`${dudes[i].name} portrait`}
                  loading="lazy"
                  className="block w-full h-full object-cover pointer-events-none select-none"
                />

                {/* Censor bar over crotch area */}
                <div
                  className="censor-bar absolute left-0 right-0 flex items-center justify-center"
                  style={{
                    bottom: "8%",
                    height: "18%",
                    background: "repeating-linear-gradient(45deg, #000 0 10px, #ffdd00 10px 20px)",
                    borderTop: "3px solid #000",
                    borderBottom: "3px solid #000",
                  }}
                >
                  <span
                    className="font-black uppercase"
                    style={{
                      color: "#fff",
                      fontFamily: "'Permanent Marker', cursive",
                      fontSize: "clamp(0.55rem, 1.2vw, 0.95rem)",
                      textShadow: "0 2px 0 #000",
                      letterSpacing: "0.1em",
                    }}
                  >
                    CENSORED
                  </span>
                </div>

                {/* Size reveal sticker */}
                <div
                  className="size-reveal absolute left-1/2 top-1/2 z-20"
                  style={{
                    transform: "translate(-50%, -50%) rotate(-6deg)",
                  }}
                >
                  <div
                    className="flex flex-col items-center justify-center rounded-full"
                    style={{
                      background: "radial-gradient(circle at 35% 25%, #ff3b6b, #b00030)",
                      border: "4px solid #ffdd00",
                      boxShadow: "0 0 0 3px #000, 0 10px 24px rgba(0,0,0,0.7), 0 0 30px rgba(255,59,107,0.6)",
                      width: "clamp(70px, 11vw, 130px)",
                      height: "clamp(70px, 11vw, 130px)",
                      padding: "6px",
                    }}
                  >
                    <span
                      className="font-black leading-none"
                      style={{
                        color: "#ffdd00",
                        fontFamily: "'Permanent Marker', cursive",
                        fontSize: "clamp(1.6rem, 3.6vw, 2.8rem)",
                        textShadow: "0 3px 0 #000, 0 0 12px rgba(0,0,0,0.6)",
                      }}
                    >
                      {dudes[i].size}
                    </span>
                    <span
                      className="font-black uppercase leading-none mt-1"
                      style={{
                        color: "#fff",
                        fontFamily: "'Permanent Marker', cursive",
                        fontSize: "clamp(0.55rem, 1.1vw, 0.85rem)",
                        textShadow: "0 2px 0 #000",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {dudes[i].label}
                    </span>
                  </div>
                </div>
              </div>

              <img
                src={dudes[i].src}
                alt={dudes[i].name}
                loading="lazy"
                className="block w-full pointer-events-none select-none mt-1"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopNsfwGay2;
