import bg from "@/assets/popunder-nsfw-gay2/bg.jpg.asset.json";
import marco from "@/assets/popunder-nsfw-gay2/marco.png.asset.json";
import jake from "@/assets/popunder-nsfw-gay2/jake2.jpg.asset.json";
import diego from "@/assets/popunder-nsfw-gay2/diego.png.asset.json";
import mybabesHeart from "@/assets/popunder/mybabes-heart.png.asset.json";

const dudes = [
  { src: marco.url, name: "MARCO", age: 28, color: "#ff3b6b", teaser: "Ride me till sunrise 💋" },
  { src: jake.url, name: "JAKE", age: 26, color: "#39ff14", teaser: "Choke on it, baby 🥵" },
  { src: diego.url, name: "DIEGO", age: 30, color: "#00e0ff", teaser: "I'll stretch you open 💦" },
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
          transition: backdrop-filter 0.4s ease, -webkit-backdrop-filter 0.4s ease, opacity 0.4s ease;
        }
        .dick-card:hover .lower-blur,
        .dick-card:active .lower-blur,
        .dick-card:focus-within .lower-blur {
          -webkit-backdrop-filter: blur(0px) brightness(1) !important;
          backdrop-filter: blur(0px) brightness(1) !important;
          opacity: 0;
        }
        @keyframes idleJump {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        .dick-card .frame {
          animation: idleJump 2.4s ease-in-out infinite;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .dick-card:nth-of-type(2) .frame { animation-delay: 0.35s; }
        .dick-card:nth-of-type(3) .frame { animation-delay: 0.7s; }
        .dick-card:hover .frame {
          animation-play-state: paused;
          transform: scale(1.04) translateY(-4px);
        }
        @keyframes ctaPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        .chat-cta { animation: ctaPulse 1.4s ease-in-out infinite; }
        .chat-cta:hover { filter: brightness(1.15); }
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
          Hover to unblur · Tap to fuck 💦
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
              width: "clamp(220px, 30vw, 400px)",
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
                aspectRatio: "3 / 4.2",
                border: `2px solid ${dudes[i].color}`,
                borderRadius: "20px",
                boxShadow: `0 20px 40px rgba(0,0,0,0.6), 0 0 32px ${dudes[i].color}40`,
                background: "#000",
                overflow: "hidden",
              }}
            >
              {/* Single image */}
              <img
                src={dudes[i].src}
                alt={dudes[i].name}
                loading="lazy"
                className="block w-full h-full object-cover pointer-events-none select-none"
              />

              {/* Backdrop-blur overlay on bottom half */}
              <div
                className="lower-blur absolute inset-x-0 bottom-0 pointer-events-none"
                style={{
                  height: "45%",
                  WebkitBackdropFilter: "blur(22px) brightness(0.7)",
                  backdropFilter: "blur(22px) brightness(0.7)",
                  WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 18%)",
                  maskImage: "linear-gradient(180deg, transparent 0%, #000 18%)",
                }}
              />
            </div>

            {/* Teaser line — below card */}
            <p
              className="mt-3 text-center font-bold leading-tight px-2"
              style={{
                color: "#fff",
                fontSize: "clamp(0.8rem, 1.6vw, 1.05rem)",
                fontFamily: "'Onest', sans-serif",
                textShadow: "0 2px 8px rgba(0,0,0,0.9)",
                fontStyle: "italic",
              }}
            >
              "{dudes[i].teaser}"
            </p>

            {/* Chat CTA — always visible, obvious */}
            <div className="mt-3 flex justify-center">
              <button
                type="button"
                className="chat-cta whitespace-nowrap flex items-center gap-2"
                style={{
                  background: `linear-gradient(180deg, ${dudes[i].color}, ${dudes[i].color}cc)`,
                  color: "#fff",
                  fontFamily: "'Onest', sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(0.85rem, 1.5vw, 1.05rem)",
                  padding: "clamp(0.7rem, 1.4vw, 0.95rem) clamp(1.3rem, 2.6vw, 1.8rem)",
                  borderRadius: "999px",
                  boxShadow: `0 8px 24px rgba(0,0,0,0.6), 0 0 28px ${dudes[i].color}aa`,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                💬 Fuck me now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopNsfwGay2;
