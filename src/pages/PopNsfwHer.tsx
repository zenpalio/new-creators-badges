import bg from "@/assets/nsfw-her-bg.jpg";
import babe1 from "@/assets/popunder/babe1.png.asset.json";
import babe2 from "@/assets/popunder/babe2.png.asset.json";
import babe3 from "@/assets/popunder/babe3.png.asset.json";

const babes = [
  { src: babe1.url, name: "AMY", age: 21 },
  { src: babe2.url, name: "VIOLET", age: 23 },
  { src: babe3.url, name: "RAYNA", age: 22 },
];

const positions = ["18%", "50%", "82%"];

const PopNsfwHer = () => {
  return (
    <div
      className="min-h-screen w-full bg-no-repeat bg-center bg-cover relative overflow-hidden"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {positions.map((left, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left,
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "32%",
            maxWidth: "520px",
            zIndex: 5,
          }}
        >
          {/* Name frame */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -top-4 z-10 px-5 py-2 rounded-md ring-2 ring-white/30"
            style={{
              background: "linear-gradient(180deg, #ff2d87 0%, #c4006b 100%)",
              boxShadow: "0 8px 22px rgba(0,0,0,0.55), inset 0 2px 0 rgba(255,255,255,0.25)",
              transform: "translateX(-50%) rotate(-3deg)",
            }}
          >
            <div
              className="font-black uppercase leading-none tracking-tight text-white whitespace-nowrap"
              style={{
                fontSize: "1.5rem",
                WebkitTextStroke: "1.5px #5a002a",
                textShadow: "0 2px 0 #5a002a, 0 4px 10px rgba(0,0,0,0.6)",
              }}
            >
              {babes[i].name}
              <span className="ml-1.5 text-white/90" style={{ WebkitTextStroke: "1px #5a002a" }}>
                {babes[i].age}
              </span>
            </div>
          </div>

          {/* Image */}
          <img
            src={babes[i].src}
            alt={babes[i].name}
            loading="lazy"
            className="block w-full pointer-events-none select-none"
            style={{ filter: "drop-shadow(0 16px 30px rgba(0,0,0,0.6))" }}
          />
        </div>
      ))}
    </div>
  );
};

export default PopNsfwHer;
