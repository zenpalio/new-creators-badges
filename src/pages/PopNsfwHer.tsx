import bg from "@/assets/nsfw-her-bg.jpg";

const holes = [
  { left: "18%" },
  { left: "50%" },
  { left: "82%" },
];

const PopNsfwHer = () => {
  return (
    <div
      className="min-h-screen w-full bg-no-repeat bg-center bg-cover relative overflow-hidden"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {holes.map((h, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: h.left,
            top: "55%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Cracks radiating from hole */}
          <svg
            width="280"
            height="280"
            viewBox="0 0 280 280"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70 pointer-events-none"
          >
            <g stroke="rgba(30,30,60,0.55)" strokeWidth="1.2" fill="none" strokeLinecap="round">
              <path d="M140 140 L40 60" />
              <path d="M140 140 L60 50 L75 70" />
              <path d="M140 140 L240 55" />
              <path d="M140 140 L255 80 L235 95" />
              <path d="M140 140 L35 220" />
              <path d="M140 140 L55 240 L80 230" />
              <path d="M140 140 L245 235" />
              <path d="M140 140 L230 250 L210 235" />
              <path d="M140 140 L140 30" />
              <path d="M140 140 L140 255" />
            </g>
          </svg>

          {/* The hole */}
          <div
            className="relative rounded-full"
            style={{
              width: "140px",
              height: "140px",
              background:
                "radial-gradient(ellipse at 50% 35%, #1a1a22 0%, #050507 55%, #000 100%)",
              boxShadow:
                "inset 0 12px 24px rgba(0,0,0,0.95), inset 0 -6px 14px rgba(255,255,255,0.05), 0 6px 18px rgba(0,0,0,0.55)",
            }}
          >
            {/* Inner darkness depth */}
            <div
              className="absolute inset-3 rounded-full"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 40%, #0a0a0f 0%, #000 80%)",
                boxShadow: "inset 0 8px 20px rgba(0,0,0,0.9)",
              }}
            />
            {/* Rim highlight */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 8%, rgba(255,255,255,0.35) 0%, transparent 25%)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PopNsfwHer;
