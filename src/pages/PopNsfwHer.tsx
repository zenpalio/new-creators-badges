import bg from "@/assets/nsfw-her-bg.jpg";
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
      className="min-h-screen w-full bg-no-repeat bg-center bg-cover relative overflow-hidden"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Headline */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none whitespace-nowrap"
        style={{ top: "3%" }}
      >
        <h1
          className="font-black uppercase leading-none tracking-wider"
          style={{
            fontSize: "clamp(1.6rem, 3.6vw, 3.2rem)",
            color: "#ffdd00",
            WebkitTextStroke: "2px #000000",
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
        { text: "CALL 4 A GOOD TIME", top: "8%", left: "6%", rotate: -8, size: "2.2rem", color: "#ff1f6b" },
        { text: "SLUTZ ONLY", top: "14%", left: "68%", rotate: 6, size: "2.6rem", color: "#39ff14" },
        { text: "XXX", top: "30%", left: "44%", rotate: -4, size: "4rem", color: "#ffdd00" },
        { text: "WET", top: "62%", left: "8%", rotate: -12, size: "3rem", color: "#00e0ff" },
        { text: "+1 555 0HOT", top: "78%", left: "55%", rotate: 4, size: "1.6rem", color: "#ffffff" },
        { text: "♥ JESS ♥", top: "70%", left: "78%", rotate: -6, size: "1.8rem", color: "#ff66cc" },
        { text: "DONT TELL MOM", top: "88%", left: "18%", rotate: 2, size: "1.4rem", color: "#ffdd00" },
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




      {positions.map((left, i) => (
        <div
          key={i}
          className="absolute group cursor-pointer"
          style={{
            left,
            bottom: "2%",
            transform: "translateX(-50%)",
            width: "20%",
            maxWidth: "320px",
            zIndex: 5,
          }}
        >
          <div className="flex flex-col items-center transition-transform duration-300 ease-out group-hover:scale-125 origin-bottom [filter:brightness(0.55)_saturate(0.35)_contrast(0.95)] group-hover:[filter:none]">
            {/* Name above frame */}
            <div className="mb-2 whitespace-nowrap pointer-events-none">
              <div
                className="font-black uppercase leading-none tracking-wider"
                style={{
                  fontSize: "2.6rem",
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
  );
};

export default PopNsfwHer;
