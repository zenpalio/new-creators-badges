import { useState } from "react";
import bg from "@/assets/popunder-sfw-gay/bg.jpg.asset.json";
import bgTwink from "@/assets/popunder-sfw-gay/bg_twink.jpg.asset.json";
import bgCoach from "@/assets/popunder-sfw-gay/bg_coach.jpg.asset.json";
import bgJock from "@/assets/popunder-sfw-gay/bg_jock.jpg.asset.json";
import twinkA from "@/assets/popunder-sfw-gay/twink_a.jpg.asset.json";
import twinkB from "@/assets/popunder-sfw-gay/twink_b.jpg.asset.json";
import coachA from "@/assets/popunder-sfw-gay/coach_a.jpg.asset.json";
import coachB from "@/assets/popunder-sfw-gay/coach_b.jpg.asset.json";
import jockA from "@/assets/popunder-sfw-gay/jock_a.jpg.asset.json";
import jockB from "@/assets/popunder-sfw-gay/jock_b.jpg.asset.json";
import mybabesHeart from "@/assets/popunder/mybabes-heart.png.asset.json";

const guys = [
  {
    name: "JIN",
    role: "GYM TWINK",
    tag: "Smooth · Flirty Tease",
    desc: "Caught him stretching in front of you on purpose. Corner him in the locker room and find out why.",
    tooltip: "did you notice me? 😉",
    default: twinkA.url,
    spicy: twinkB.url,
    sceneBg: bgTwink.url,
    accent: "#5ac8ff",
  },
  {
    name: "MARCO",
    role: "COACH DADDY",
    tag: "Older · Dominant",
    desc: "Your muscular Latino coach pinned you against the lockers. Says you've been staring at him for weeks.",
    tooltip: "eyes on me, boy 💪",
    default: coachA.url,
    spicy: coachB.url,
    sceneBg: bgCoach.url,
    accent: "#ff7a3a",
  },
  {
    name: "TYLER",
    role: "COLLEGE JOCK",
    tag: "Cocky · Alpha Frat",
    desc: "The frat star pushed you onto his bed. He's been waiting for you to make a move all season.",
    tooltip: "you flirted first 😏",
    default: jockA.url,
    spicy: jockB.url,
    sceneBg: bgJock.url,
    accent: "#ffd23f",
  },
];

const positions = ["18%", "50%", "82%"];

const PopSfwGay = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div
      className="min-h-screen w-full bg-no-repeat bg-center bg-cover relative sfw-bg"
      style={{
        backgroundImage: `url(${bg.url})`,
        backgroundColor: "#1a0b2e",
        overflow: "hidden",
      }}
    >
      <style>{`
        html, body { overflow-x: hidden; }
        @media (max-width: 1023px) {
          .sfw-root {
            min-height: auto !important;
            height: auto !important;
            padding-bottom: 3rem;
          }
          .headline-wrap {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            transform: none !important;
            margin: 0 auto;
            padding-top: 4.5rem;
          }
          .babe-card {
            position: relative !important;
            left: auto !important;
            bottom: auto !important;
            top: auto !important;
            transform: none !important;
            width: 86% !important;
            max-width: 360px !important;
            margin: 0 auto;
          }
          .babe-card .babe-inner {
            transform: none !important;
          }
          .babes-stack {
            display: flex !important;
            flex-direction: column;
            align-items: center;
            gap: 2rem;
            padding: 1.5rem 0 2rem;
          }
        }
        @media (max-width: 480px) {
          .babe-card {
            width: 90% !important;
            max-width: 300px !important;
          }
          .headline-wrap { padding-top: 4rem; }
          .babes-stack { gap: 1.5rem; padding: 1rem 0 1.5rem; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .babes-stack {
            gap: 2.5rem;
            padding: 2rem 0 3rem;
          }
        }
        @keyframes floatY {
          0%, 100% { transform: scale(1.06) translateY(0); }
          50% { transform: scale(1.06) translateY(-6px); }
        }
        .babe-card:hover .babe-inner,
        .babe-card:active .babe-inner,
        .babe-card:focus-within .babe-inner {
          animation: floatY 2.6s ease-in-out infinite;
        }
        .img-default { opacity: 1; transition: opacity 500ms ease; }
        .img-spicy { opacity: 0; transition: opacity 500ms ease; }
        .babe-card:hover .img-default,
        .babe-card:active .img-default,
        .babe-card:focus-within .img-default { opacity: 0; }
        .babe-card:hover .img-spicy,
        .babe-card:active .img-spicy,
        .babe-card:focus-within .img-spicy { opacity: 1; }
        @keyframes sparkleRise {
          0% { transform: translateY(110vh) scale(0.6) rotate(0deg); opacity: 0; }
          15% { opacity: 0.9; }
          100% { transform: translateY(-10vh) scale(1) rotate(360deg); opacity: 0; }
        }
        .sparkle {
          position: absolute;
          bottom: -5vh;
          width: 12px;
          height: 12px;
          background: radial-gradient(circle at 40% 40%, #ffffff, #b88dff 60%, transparent 70%);
          border-radius: 50%;
          opacity: 0.85;
          pointer-events: none;
          animation: sparkleRise linear infinite;
          filter: drop-shadow(0 0 6px rgba(184,141,255,0.8));
        }
      `}</style>

      <div className="sfw-root relative w-full h-screen">
        {/* Scenario backgrounds — crossfade in on hover */}
        {guys.map((g, idx) => (
          <div
            key={`scene-${idx}`}
            className="absolute inset-0 pointer-events-none bg-no-repeat bg-center bg-cover"
            style={{
              backgroundImage: `url(${g.sceneBg})`,
              opacity: hovered === idx ? 1 : 0,
              transition: "opacity 700ms ease",
              zIndex: 0,
            }}
          />
        ))}

        {/* Dark gradient overlay for legibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(20,5,40,0.25) 0%, rgba(10,2,25,0.78) 80%)",
            zIndex: 1,
          }}
        />

        {/* Rising sparkles */}
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="sparkle"
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
          style={{ top: "3%" }}
        >
          <div
            className="font-bold uppercase tracking-[0.3em] mb-2"
            style={{
              fontSize: "clamp(0.7rem, 1.4vw, 1rem)",
              color: "#8ed1ff",
              textShadow: "0 0 12px rgba(142,209,255,0.8), 0 2px 4px rgba(0,0,0,0.8)",
              fontFamily: "'Onest', sans-serif",
            }}
          >
            ✦ Choose your fantasy ✦
          </div>
          <h1
            className="font-black leading-[1.05]"
            style={{
              fontSize: "clamp(1.5rem, 4.6vw, 2.8rem)",
              color: "#ffffff",
              textShadow:
                "0 0 20px rgba(142,209,255,0.6), 0 0 40px rgba(180,100,255,0.4), 0 4px 12px rgba(0,0,0,0.8)",
              fontFamily: "'Onest', sans-serif",
              letterSpacing: "-0.01em",
            }}
          >
            Who's gonna pin you down tonight?
          </h1>
          <div
            className="mt-2 font-medium"
            style={{
              fontSize: "clamp(0.78rem, 1.5vw, 1.05rem)",
              color: "#e8d5ff",
              textShadow: "0 2px 6px rgba(0,0,0,0.8)",
              fontFamily: "'Onest', sans-serif",
            }}
          >
            Pick a roleplay. Hover to see what he'd do to you.
          </div>
        </div>

        <div className="babes-stack contents">
          {positions.map((left, i) => {
            const g = guys[i];
            return (
              <div
                key={i}
                className="babe-card absolute group"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered((h) => (h === i ? null : h))}
                style={{
                  left,
                  top: "58%",
                  transform: "translate(-50%, -50%)",
                  width: "clamp(160px, 23vw, 290px)",
                  zIndex: 5,
                  cursor: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'><text x='4' y='38' font-size='38'>💙</text></svg>") 24 24, pointer`,
                }}
              >
                {/* Hover tooltip */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 z-30 pointer-events-none opacity-0 group-hover:opacity-100 group-active:opacity-100 group-focus-within:opacity-100 transition-all duration-300 ease-out -translate-y-2 group-hover:translate-y-0"
                  style={{ top: "-3.2rem" }}
                >
                  <div
                    className="relative rounded-full whitespace-nowrap backdrop-blur-md"
                    style={{
                      background: "rgba(255,255,255,0.95)",
                      color: "#1a0b2e",
                      fontFamily: "'Onest', sans-serif",
                      fontWeight: 700,
                      fontSize: "clamp(0.72rem, 1.3vw, 0.95rem)",
                      padding:
                        "clamp(0.35rem, 0.7vw, 0.5rem) clamp(0.85rem, 1.5vw, 1.2rem)",
                      boxShadow: `0 0 24px ${g.accent}cc, 0 10px 30px rgba(0,0,0,0.5)`,
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

                <div
                  className="babe-inner flex flex-col items-center transition-all duration-500 ease-out group-hover:scale-[1.06] origin-bottom"
                  style={{ ['--accent' as never]: g.accent }}
                >
                  {/* Portrait card with crossfade */}
                  <div
                    className="relative w-full"
                    style={{
                      aspectRatio: "3 / 4",
                      borderRadius: "14px",
                      overflow: "hidden",
                      boxShadow: `0 0 0 3px rgba(255,255,255,0.92), 0 0 0 5px ${g.accent}, 0 18px 40px rgba(0,0,0,0.7), 0 0 0px ${g.accent}00`,
                      background: "#0a0414",
                      transition: "box-shadow 500ms ease",
                    }}
                  >
                    <img
                      src={g.default}
                      alt={`${g.name} - ${g.role}`}
                      loading="lazy"
                      className="img-default absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                    />
                    <img
                      src={g.spicy}
                      alt={`${g.name} - intimate scene`}
                      loading="lazy"
                      className="img-spicy absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                    />

                    {/* Spicy glow overlay on hover */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(ellipse at center, transparent 40%, ${g.accent}33 100%)`,
                        mixBlendMode: "screen",
                      }}
                    />

                    {/* Bottom gradient + name + role */}
                    <div
                      className="absolute inset-x-0 bottom-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(10,2,25,0.97) 0%, rgba(10,2,25,0.7) 50%, transparent 100%)",
                        padding: "1.6rem 0.7rem 0.8rem",
                      }}
                    >
                      <div
                        className="text-center font-black uppercase tracking-wider"
                        style={{
                          fontSize: "clamp(0.95rem, 2.2vw, 1.7rem)",
                          color: "#ffffff",
                          fontFamily: "'Onest', sans-serif",
                          textShadow: `0 2px 8px rgba(0,0,0,0.95), 0 0 16px ${g.accent}aa`,
                          lineHeight: 1.05,
                        }}
                      >
                        {g.name}
                      </div>
                      <div
                        className="text-center font-semibold uppercase tracking-[0.22em] mt-0.5"
                        style={{
                          fontSize: "clamp(0.55rem, 1.05vw, 0.78rem)",
                          color: g.accent,
                          fontFamily: "'Onest', sans-serif",
                          textShadow: "0 2px 6px rgba(0,0,0,0.9)",
                        }}
                      >
                        {g.role}
                      </div>
                    </div>
                  </div>

                  {/* Description card */}
                  <div
                    className="mt-3 w-full text-center px-1"
                    style={{ fontFamily: "'Onest', sans-serif" }}
                  >
                    <div
                      className="font-bold uppercase tracking-[0.15em] mb-1"
                      style={{
                        fontSize: "clamp(0.6rem, 1.1vw, 0.78rem)",
                        color: g.accent,
                        textShadow: `0 0 10px ${g.accent}88, 0 2px 4px rgba(0,0,0,0.8)`,
                      }}
                    >
                      {g.tag}
                    </div>
                    <p
                      className="font-medium leading-snug"
                      style={{
                        fontSize: "clamp(0.72rem, 1.25vw, 0.92rem)",
                        color: "#f0e6ff",
                        textShadow: "0 2px 6px rgba(0,0,0,0.95)",
                      }}
                    >
                      {g.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PopSfwGay;
