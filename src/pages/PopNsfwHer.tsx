import bg from "@/assets/nsfw-her-bg.jpg";
import babe1 from "@/assets/popunder/babe1.png.asset.json";
import babe2 from "@/assets/popunder/babe2.png.asset.json";
import babe3 from "@/assets/popunder/babe3.png.asset.json";

const babes = [
  { src: babe1.url, name: "AMY" },
  { src: babe2.url, name: "VIOLET" },
  { src: babe3.url, name: "RAYNA" },
];

const positions = ["18%", "50%", "82%"];

const PopNsfwHer = () => {
  return (
    <div
      className="min-h-screen w-full bg-no-repeat bg-center bg-cover relative overflow-hidden"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Holes + babes */}
      {positions.map((left, i) => (
        <div key={i}>
          {/* Hole + cracks at hip level */}
          <div
            className="absolute"
            style={{ left, top: "58%", transform: "translate(-50%, -50%)" }}
          >
            <svg
              width="320"
              height="320"
              viewBox="0 0 320 320"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70 pointer-events-none"
            >
              <g stroke="rgba(20,30,70,0.6)" strokeWidth="1.3" fill="none" strokeLinecap="round">
                <path d="M160 160 L40 60" />
                <path d="M160 160 L60 50 L80 75" />
                <path d="M160 160 L280 55" />
                <path d="M160 160 L295 85 L270 100" />
                <path d="M160 160 L35 260" />
                <path d="M160 160 L60 285 L90 270" />
                <path d="M160 160 L285 275" />
                <path d="M160 160 L270 290 L245 270" />
                <path d="M160 160 L160 25" />
                <path d="M160 160 L160 295" />
              </g>
            </svg>

            <div
              className="relative rounded-full"
              style={{
                width: "150px",
                height: "150px",
                background:
                  "radial-gradient(ellipse at 50% 35%, #1a1a22 0%, #050507 55%, #000 100%)",
                boxShadow:
                  "inset 0 14px 28px rgba(0,0,0,0.95), inset 0 -6px 14px rgba(255,255,255,0.05), 0 8px 22px rgba(0,0,0,0.6)",
              }}
            >
              <div
                className="absolute inset-3 rounded-full"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 40%, #0a0a0f 0%, #000 80%)",
                  boxShadow: "inset 0 8px 20px rgba(0,0,0,0.9)",
                }}
              />
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 8%, rgba(255,255,255,0.35) 0%, transparent 25%)",
                }}
              />
            </div>
          </div>

          {/* Babe sticking out of the hole */}
          <img
            src={babes[i].src}
            alt={babes[i].name}
            loading="lazy"
            className="absolute pointer-events-none select-none"
            style={{
              left,
              bottom: 0,
              transform: "translateX(-50%)",
              width: "30%",
              maxWidth: "420px",
              filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.55))",
              zIndex: 5,
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default PopNsfwHer;
