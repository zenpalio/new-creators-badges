import bg from "@/assets/popunder-nsfw-gay2/bg.jpg.asset.json";
import marco from "@/assets/popunder-nsfw-gay2/marco.png.asset.json";
import jake from "@/assets/popunder-nsfw-gay2/jake2.jpg.asset.json";
import diego from "@/assets/popunder-nsfw-gay2/diego.png.asset.json";
import mybabesHeart from "@/assets/popunder/mybabes-heart.png.asset.json";

const dudes = [
  { src: marco.url, name: "MARCO", age: 28, color: "#ff3b6b", teaser: "WANNA SEE IT? 👇" },
  { src: jake.url, name: "JAKE", age: 26, color: "#39ff14", teaser: "TAP FOR DICK PIC 👇" },
  { src: diego.url, name: "DIEGO", age: 30, color: "#00e0ff", teaser: "UNLOCK MY BULGE 👇" },
];

const positions = ["18%", "50%", "82%"];

const PopNsfwGay2 = () => {
  return (
    <div
      className="min-h-screen w-full bg-no-repeat bg-center bg-cover relative overflow-x-hidden nsfw-bg"
      style={{ backgroundImage: `url(${bg.url})`, backgroundColor: "#0a0014" }}
    >
      <style>{`
        @media (max-width: 767px) {
          .headline-wrap { top: 3.5rem !important; }
          .babes-stack {
            position: relative !important;
            display: flex !important;
            flex-direction: column;
            align-items: center;
            gap: 2.5rem;
            padding: 12rem 0 3rem;
          }
          .dick-card {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            transform: none !important;
            width: 75% !important;
            max-width: 320px !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .dick-card { width: 28% !important; }
        }
        .dick-card .lower-blur {
          filter: blur(22px) brightness(0.6);
          transition: filter 0.35s ease;
        }
        .dick-card:hover .lower-blur,
        .dick-card:active .lower-blur,
        .dick-card:focus-within .lower-blur {
          filter: blur(0px) brightness(1);
        }
        .dick-card .send-btn {
          opacity: 1;
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .dick-card:hover .send-btn,
        .dick-card:active .send-btn,
        .dick-card:focus-within .send-btn {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.85);
        }
        .dick-card .frame {
          transform: scale(1);
          transition: transform 0.3s ease;
        }
        .dick-card:hover .frame { transform: scale(1.04); }
        @keyframes wiggle {
          0%, 100% { transform: translate(-50%, -50%) rotate(-3deg); }
          50% { transform: translate(-50%, -50%) rotate(3deg); }
        }
        .dick-card .send-btn { animation: wiggle 1.4s ease-in-out infinite; }
      `}</style>

      {/* Dim vignette */}
      <div className="absolute inset-0 bg-black/55 pointer-events-none" />

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
            textShadow: "0 4px 0 rgba(0,0,0,0.6), 0 10px 24px rgba(0,0,0,0.8)",
            fontFamily: "'Permanent Marker', 'Onest', cursive",
            transform: "rotate(-2deg)",
          }}
        >
          Who's sending the best dick pic?
        </h1>
        <p
          className="mt-3 font-bold uppercase"
          style={{
            fontSize: "clamp(0.85rem, 2.2vw, 1.3rem)",
            color: "#ffffff",
            fontFamily: "'Permanent Marker', cursive",
            textShadow: "0 2px 0 rgba(0,0,0,0.6), 0 6px 14px rgba(0,0,0,0.7)",
            transform: "rotate(-1deg)",
          }}
        >
          Hover to unblur — pick your favorite 🍆
        </p>
      </div>

      {/* Cards */}
      <div className="babes-stack contents">
        {positions.map((left, i) => (
          <div
            key={i}
            className="dick-card absolute group"
            style={{
              left,
              top: "58%",
              transform: "translate(-50%, -50%)",
              width: "clamp(180px, 26vw, 340px)",
              zIndex: 5,
              cursor: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'><text x='4' y='38' font-size='38'>🍆</text></svg>") 24 24, pointer`,
            }}
          >
            {/* Name banner */}
            <div className="mb-2 flex items-end justify-center gap-2 whitespace-nowrap pointer-events-none">
              <span
                className="font-black uppercase leading-none"
                style={{
                  fontSize: "clamp(1.4rem, 3.4vw, 2.4rem)",
                  color: dudes[i].color,
                  WebkitTextStroke: "2px #ffffff",
                  textShadow: "0 4px 0 rgba(0,0,0,0.5), 0 8px 18px rgba(0,0,0,0.7)",
                  fontFamily: "'Onest', sans-serif",
                }}
              >
                {dudes[i].name}
              </span>
              <span
                className="font-black"
                style={{
                  fontSize: "clamp(0.9rem, 2vw, 1.4rem)",
                  color: "#ffffff",
                  fontFamily: "'Permanent Marker', cursive",
                  textShadow: "0 2px 0 rgba(0,0,0,0.6)",
                }}
              >
                {dudes[i].age}
              </span>
            </div>

            <div
              className="frame relative origin-bottom"
              style={{
                aspectRatio: "3 / 4.5",
                border: `4px solid ${dudes[i].color}`,
                borderRadius: "10px",
                boxShadow: `0 0 0 2px rgba(255,255,255,0.7), 0 18px 40px rgba(0,0,0,0.7), 0 0 40px ${dudes[i].color}55`,
                background: "#000",
                overflow: "hidden",
              }}
            >
              {/* Upper (sharp) */}
              <div
                className="absolute inset-x-0 top-0 overflow-hidden"
                style={{ height: "60%" }}
              >
                <img
                  src={dudes[i].src}
                  alt={dudes[i].name}
                  loading="lazy"
                  className="block w-full pointer-events-none select-none"
                  style={{ height: "auto", width: "100%" }}
                />
              </div>

              {/* Lower (blurred until hover) */}
              <div
                className="lower-blur absolute inset-x-0 bottom-0 overflow-hidden"
                style={{ height: "40%" }}
              >
                <img
                  src={dudes[i].src}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="block w-full pointer-events-none select-none"
                  style={{
                    width: "100%",
                    height: "auto",
                    transform: "translateY(-60%)",
                  }}
                />
              </div>

              {/* Send dick pic button - centered over the blur */}
              <button
                type="button"
                className="send-btn absolute left-1/2 z-20 whitespace-nowrap"
                style={{
                  top: "80%",
                  transform: "translate(-50%, -50%) rotate(-3deg)",
                  background: "linear-gradient(180deg, #ff3b6b, #b00030)",
                  color: "#ffdd00",
                  fontFamily: "'Permanent Marker', cursive",
                  fontSize: "clamp(0.7rem, 1.5vw, 1.05rem)",
                  padding: "clamp(0.5rem, 1.2vw, 0.9rem) clamp(0.9rem, 2vw, 1.4rem)",
                  border: "3px solid #000",
                  borderRadius: "999px",
                  boxShadow: "0 6px 0 #000, 0 14px 30px rgba(0,0,0,0.6), 0 0 24px rgba(255,59,107,0.6)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                📩 Send dick pic
              </button>
            </div>

            {/* Teaser sticker under card */}
            <div
              className="mt-3 mx-auto w-fit pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <div
                className="rounded-lg whitespace-nowrap"
                style={{
                  background: "#ffdd00",
                  color: "#000",
                  fontFamily: "'Permanent Marker', cursive",
                  fontSize: "clamp(0.65rem, 1.5vw, 1rem)",
                  padding: "clamp(0.25rem, 0.7vw, 0.45rem) clamp(0.5rem, 1.4vw, 0.9rem)",
                  transform: "rotate(-2deg)",
                  boxShadow: "0 6px 14px rgba(0,0,0,0.5)",
                  border: "2px solid #000",
                }}
              >
                {dudes[i].teaser}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopNsfwGay2;
