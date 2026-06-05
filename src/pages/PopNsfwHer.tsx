import bg from "@/assets/nsfw-her-bg.jpg";
import bgMobile from "@/assets/nsfw-her-bg-mobile.jpg";
import babe1 from "@/assets/popunder/babe1.png.asset.json";
import babe2 from "@/assets/popunder/babe2.png.asset.json";
import babe3 from "@/assets/popunder/babe3.png.asset.json";
import portrait1 from "@/assets/popunder/portrait1.jpg.asset.json";
import portrait2 from "@/assets/popunder/portrait2.jpg.asset.json";
import portrait3 from "@/assets/popunder/portrait3.jpg.asset.json";
import mybabesHeart from "@/assets/popunder/mybabes-heart.png.asset.json";

const babes = [
  { src: babe1.url, portrait: portrait1.url, name: "AMY", color: "#1d3a8a" },
  { src: babe2.url, portrait: portrait2.url, name: "VIOLET", color: "#b026ff" },
  { src: babe3.url, portrait: portrait3.url, name: "RAYNA", color: "#1d3a8a" },
];

const positions = ["18%", "50%", "82%"];

const PopNsfwHer = () => {
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
          .babe-card .babe-inner {
            transform: none !important;
          }
          .babe-card:hover .babe-inner {
            transform: scale(1.05) !important;
            animation: none !important;
          }
          .babes-stack {
            display: flex !important;
            flex-direction: column;
            align-items: center;
            gap: 2.5rem;
            padding: 6rem 0 2rem;
          .pick-tooltip {
            top: 38% !important;
            opacity: 1 !important;
            transform: translate(-50%, -50%) !important;
          }
        }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .babe-card {
            width: 30% !important;
          }
        }
        @keyframes babeShake {
          0%, 100% { transform: scale(1.28) rotate(0deg); }
          25% { transform: scale(1.28) rotate(-1deg); }
          50% { transform: scale(1.29) rotate(1deg); }
          75% { transform: scale(1.28) rotate(-0.8deg); }
        }
        .babe-card:hover .babe-inner {
          animation: babeShake 0.7s ease-in-out infinite;
        }
      `}</style>
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
        className="absolute left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none w-[92%] max-w-[900px] px-2"
        style={{ top: "3%" }}
      >
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
          Pick your favorite hole to enjoy!
        </h1>
      </div>

      {/* Grime + cracks overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none mix-blend-multiply opacity-80"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="rough">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
            <feDisplacementMap in="SourceGraphic" scale="3" />
          </filter>
          <filter id="grime">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" seed="7" />
            <feColorMatrix values="0 0 0 0 0.05  0 0 0 0 0.04  0 0 0 0 0.08  0 0 0 0.35 0" />
          </filter>
        </defs>

        {/* Dirty grime wash */}
        <rect width="1000" height="1000" filter="url(#grime)" />

        {/* Cracks */}
        <g
          stroke="rgba(15,18,40,0.85)"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
          filter="url(#rough)"
        >
          {/* Top-left web */}
          <path d="M40 80 L180 220 L260 200 L340 310 L300 380" />
          <path d="M180 220 L120 320 L60 360" />
          <path d="M180 220 L240 130 L320 90" />
          <path d="M260 200 L330 170" />

          {/* Top-center */}
          <path d="M500 30 L470 180 L540 260 L500 360 L580 440" />
          <path d="M470 180 L380 230" />
          <path d="M540 260 L640 240" />
          <path d="M500 360 L420 410" />

          {/* Top-right web */}
          <path d="M960 70 L820 200 L760 180 L660 290 L700 360" />
          <path d="M820 200 L880 320 L940 360" />
          <path d="M820 200 L760 110 L680 70" />
          <path d="M760 180 L690 150" />

          {/* Mid horizontal cracks */}
          <path d="M0 520 L150 540 L260 510 L380 560 L520 530 L660 570 L800 540 L1000 580" />
          <path d="M260 510 L290 600 L240 700" />
          <path d="M660 570 L700 660 L640 760" />

          {/* Lower-left */}
          <path d="M60 820 L200 760 L320 820 L260 920 L340 980" />
          <path d="M200 760 L180 660" />
          <path d="M320 820 L420 800" />

          {/* Lower-center */}
          <path d="M480 880 L540 800 L620 860 L580 960" />
          <path d="M540 800 L520 720" />

          {/* Lower-right */}
          <path d="M940 820 L820 780 L720 850 L780 940 L700 990" />
          <path d="M820 780 L860 690" />
          <path d="M720 850 L620 820" />
        </g>

        {/* Tiny chipped paint specks */}
        <g fill="rgba(10,12,30,0.55)">
          <circle cx="120" cy="160" r="2" />
          <circle cx="340" cy="60" r="1.5" />
          <circle cx="610" cy="120" r="2.2" />
          <circle cx="880" cy="240" r="1.8" />
          <circle cx="220" cy="430" r="2" />
          <circle cx="450" cy="500" r="1.6" />
          <circle cx="730" cy="450" r="2.4" />
          <circle cx="160" cy="690" r="1.8" />
          <circle cx="380" cy="740" r="2" />
          <circle cx="660" cy="710" r="1.5" />
          <circle cx="900" cy="640" r="2.2" />
          <circle cx="510" cy="940" r="1.7" />
        </g>
      </svg>

      {/* Graffiti scrawls */}
      {[
        { text: "FREE TO USE", top: "8%", left: "6%", rotate: -8, size: "clamp(1rem, 2.6vw, 2.4rem)", color: "#ff1f6b" },
        { text: "CUMHOLE", top: "14%", left: "66%", rotate: 6, size: "clamp(1.1rem, 3vw, 2.8rem)", color: "#39ff14" },
        { text: "DON'T TELL MOM", top: "70%", left: "8%", rotate: -10, size: "clamp(0.9rem, 2.2vw, 2rem)", color: "#ffdd00" },
        { text: "FREE TO USE", top: "78%", left: "62%", rotate: 4, size: "clamp(1rem, 2.4vw, 2.2rem)", color: "#00e0ff" },
      ].map((g, i) => (
        <div
          key={`graf-${i}`}
          className="absolute pointer-events-none select-none uppercase font-black"
          style={{
            top: g.top,
            left: g.left,
            transform: `rotate(${g.rotate}deg)`,
            fontFamily: "'Permanent Marker', 'Marker Felt', 'Comic Sans MS', cursive",
            fontSize: g.size,
            color: g.color,
            opacity: 0.8,
            mixBlendMode: "screen",
            textShadow: `2px 2px 0 rgba(0,0,0,0.6), 0 0 10px ${g.color}55`,
            letterSpacing: "0.04em",
            filter: "blur(0.3px) contrast(1.1)",
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
            width: "clamp(110px, 26vw, 320px)",
            zIndex: 5,
            cursor: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'><text x='4' y='38' font-size='38'>🍆</text></svg>") 24 24, pointer`,
          }}
        >
          {/* PICK ME tooltip */}
          <div
            className="pick-tooltip absolute left-1/2 -translate-x-1/2 z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out -translate-y-2 group-hover:translate-y-0"
            style={{ top: "clamp(-3.5rem, -8vw, -2.2rem)" }}
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
              PICK MY HOLE DADDY 👇
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
            {/* Name above frame */}
            <div className="mb-2 whitespace-nowrap pointer-events-none">
              <div
                className="font-black uppercase leading-none tracking-wider"
                style={{
                  fontSize: "clamp(1rem, 3.4vw, 2.6rem)",
                  color: babes[i].color,
                  WebkitTextStroke: "2px #ffffff",
                  textShadow: "0 4px 0 rgba(0,0,0,0.4), 0 8px 18px rgba(0,0,0,0.6)",
                  fontFamily: "'Onest', sans-serif",
                }}
              >
                {babes[i].name}
              </div>
            </div>

            {/* Portrait inside frame */}
            <div
              className="relative"
              style={{
                width: "55%",
                aspectRatio: "1 / 1.15",
                border: `4px solid ${babes[i].color}`,
                borderRadius: "8px",
                boxShadow: `0 0 0 2px rgba(255,255,255,0.7), 0 14px 30px rgba(0,0,0,0.6)`,
                background: "#000",
                overflow: "hidden",
              }}
            >
              <img
                src={babes[i].portrait}
                alt={`${babes[i].name} portrait`}
                loading="lazy"
                className="block w-full h-full object-cover pointer-events-none select-none"
              />
            </div>

            {/* Full body babe image */}
            <img
              src={babes[i].src}
              alt={babes[i].name}
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

export default PopNsfwHer;
