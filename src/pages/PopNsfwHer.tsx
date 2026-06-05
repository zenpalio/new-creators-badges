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
      {positions.map((left, i) => (
        <img
          key={i}
          src={babes[i].src}
          alt={babes[i].name}
          loading="lazy"
          className="absolute pointer-events-none select-none"
          style={{
            left,
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "32%",
            maxWidth: "520px",
            filter: "drop-shadow(0 16px 30px rgba(0,0,0,0.6))",
            zIndex: 5,
          }}
        />
      ))}
    </div>
  );
};

export default PopNsfwHer;
