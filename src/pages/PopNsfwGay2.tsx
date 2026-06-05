import bg from "@/assets/popunder-nsfw-gay2/bg.jpg.asset.json";
import marco from "@/assets/popunder-nsfw-gay2/marco.jpg.asset.json";
import jake from "@/assets/popunder-nsfw-gay2/jake.jpg.asset.json";
import diego from "@/assets/popunder-nsfw-gay2/diego.jpg.asset.json";
import mybabesHeart from "@/assets/popunder/mybabes-heart.png.asset.json";

const subjects = [
  {
    id: "SBJ-001",
    src: marco.url,
    name: "MARCO",
    age: 28,
    handle: "@marco.exe",
    accent: "#22d3ee", // cyan
    vitals: { stack: '7.2"', girth: "5.1", heat: "98°" },
    tag: "CALIBRATED",
  },
  {
    id: "SBJ-002",
    src: jake.url,
    name: "JAKE",
    age: 26,
    handle: "@jake.404",
    accent: "#f0abfc", // magenta
    vitals: { stack: '8.6"', girth: "5.8", heat: "104°" },
    tag: "OVERCLOCKED",
  },
  {
    id: "SBJ-003",
    src: diego.url,
    name: "DIEGO",
    age: 30,
    handle: "@diego.root",
    accent: "#a3e635", // lime
    vitals: { stack: '9.4"', girth: "6.2", heat: "111°" },
    tag: "MAX_THROUGHPUT",
  },
];

const PopNsfwGay2 = () => {
  return (
    <div
      className="min-h-screen w-full relative overflow-x-hidden"
      style={{
        background: `radial-gradient(ellipse at 20% 10%, rgba(34,211,238,0.18), transparent 55%), radial-gradient(ellipse at 80% 90%, rgba(240,171,252,0.18), transparent 55%), #04060a`,
      }}
    >
      <style>{`
        @keyframes hud-scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes hud-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        @keyframes hud-flicker {
          0%, 100% { opacity: 1; }
          92% { opacity: 1; }
          93% { opacity: 0.4; }
          94% { opacity: 1; }
          96% { opacity: 0.7; }
          97% { opacity: 1; }
        }
        @keyframes hud-grid {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        @keyframes glitch-x {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-1px); }
          40% { transform: translateX(1px); }
          60% { transform: translateX(-0.5px); }
          80% { transform: translateX(0.5px); }
        }
        @keyframes decrypt-stream {
          0% { background-position: 0 0; }
          100% { background-position: 0 100%; }
        }
        .hud-grid {
          background-image:
            linear-gradient(rgba(34,211,238,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,0.08) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: hud-grid 8s linear infinite;
        }
        .scanlines::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            0deg,
            rgba(255,255,255,0.05) 0px,
            rgba(255,255,255,0.05) 1px,
            transparent 1px,
            transparent 3px
          );
          pointer-events: none;
          mix-blend-mode: overlay;
        }
        .subj-card .vault {
          --reveal: 0;
        }
        .subj-card:hover .vault,
        .subj-card:focus-within .vault,
        .subj-card:active .vault {
          --reveal: 1;
        }
        .subj-card .vault-img {
          filter: blur(28px) brightness(0.35) saturate(1.2) hue-rotate(15deg);
          transform: scale(1.08);
          transition: filter 0.6s ease, transform 0.6s ease;
        }
        .subj-card:hover .vault-img,
        .subj-card:focus-within .vault-img,
        .subj-card:active .vault-img {
          filter: blur(0px) brightness(1) saturate(1) hue-rotate(0deg);
          transform: scale(1);
        }
        .subj-card .vault-noise {
          opacity: 1;
          transition: opacity 0.5s ease;
        }
        .subj-card:hover .vault-noise,
        .subj-card:focus-within .vault-noise,
        .subj-card:active .vault-noise {
          opacity: 0;
        }
        .subj-card .decrypt-bar {
          width: 0%;
          transition: width 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .subj-card:hover .decrypt-bar,
        .subj-card:focus-within .decrypt-bar,
        .subj-card:active .decrypt-bar {
          width: 100%;
        }
        .subj-card .decrypt-label .locked { display: inline; }
        .subj-card .decrypt-label .unlocked { display: none; }
        .subj-card:hover .decrypt-label .locked,
        .subj-card:focus-within .decrypt-label .locked,
        .subj-card:active .decrypt-label .locked { display: none; }
        .subj-card:hover .decrypt-label .unlocked,
        .subj-card:focus-within .decrypt-label .unlocked,
        .subj-card:active .decrypt-label .unlocked { display: inline; }
        .subj-card .scan-sweep {
          opacity: 0;
        }
        .subj-card:hover .scan-sweep,
        .subj-card:focus-within .scan-sweep,
        .subj-card:active .scan-sweep {
          opacity: 1;
          animation: hud-scan 1.2s linear;
        }
        .corner {
          position: absolute;
          width: 14px;
          height: 14px;
          border-color: var(--accent);
          border-style: solid;
          border-width: 0;
        }
        .corner.tl { top: -1px; left: -1px; border-top-width: 2px; border-left-width: 2px; }
        .corner.tr { top: -1px; right: -1px; border-top-width: 2px; border-right-width: 2px; }
        .corner.bl { bottom: -1px; left: -1px; border-bottom-width: 2px; border-left-width: 2px; }
        .corner.br { bottom: -1px; right: -1px; border-bottom-width: 2px; border-right-width: 2px; }
        .mono { font-family: 'JetBrains Mono', 'Courier New', monospace; }
      `}</style>

      {/* Animated tech grid */}
      <div className="absolute inset-0 hud-grid opacity-60 pointer-events-none" />
      {/* Soft bg image very dim */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-screen pointer-events-none"
        style={{ backgroundImage: `url(${bg.url})` }}
      />
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.85))] pointer-events-none" />

      {/* Top status bar */}
      <div className="relative z-20 flex items-center justify-between px-4 sm:px-8 py-4 border-b border-cyan-400/15">
        <div className="flex items-center gap-2 select-none">
          <img src={mybabesHeart.url} alt="" className="w-7 h-7" />
          <span className="text-white font-semibold lowercase tracking-tight text-base sm:text-lg" style={{ fontFamily: "'Onest', sans-serif" }}>
            mybabes
          </span>
          <span className="mono text-[10px] text-cyan-400/70 ml-2 px-2 py-0.5 border border-cyan-400/30 rounded-sm">
            ◉ SECURE_LINK
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 mono text-[10px] text-white/50">
          <span style={{ animation: "hud-flicker 4s infinite" }}>NODE_77 / ENCRYPTED</span>
          <span className="text-cyan-400" style={{ animation: "hud-blink 1.4s infinite" }}>● LIVE</span>
        </div>
      </div>

      <div className="relative z-10 px-4 sm:px-8 pt-8 sm:pt-12 pb-12 max-w-7xl mx-auto">
        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <p className="mono text-[11px] tracking-[0.4em] text-cyan-400 mb-3" style={{ animation: "hud-flicker 6s infinite" }}>
            /// VAULT_DROP — 03 SUBJECTS UPLINKED
          </p>
          <h1
            className="font-bold text-white leading-[1.05] tracking-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontFamily: "'Onest', sans-serif" }}
          >
            Hover to <span style={{ color: "#22d3ee", textShadow: "0 0 24px rgba(34,211,238,0.6)" }}>decrypt</span> the drop.
          </h1>
          <p
            className="mt-4 text-white/60 mono"
            style={{ fontSize: "clamp(0.8rem, 1.4vw, 0.95rem)" }}
          >
            03 dicks. encrypted in transit. pick one and unlock the payload.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {subjects.map((s) => (
            <div
              key={s.id}
              className="subj-card group relative"
              style={{ ["--accent" as string]: s.accent }}
            >
              {/* Outer HUD frame */}
              <div
                className="relative bg-black/60 backdrop-blur-sm border border-white/10 overflow-hidden"
                style={{
                  boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${s.accent}20`,
                }}
              >
                <span className="corner tl" />
                <span className="corner tr" />
                <span className="corner bl" />
                <span className="corner br" />

                {/* Subject ID header strip */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-gradient-to-r from-black/80 to-transparent">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.accent, boxShadow: `0 0 8px ${s.accent}` }} />
                    <span className="mono text-[10px] tracking-widest text-white/70">{s.id}</span>
                  </div>
                  <span className="mono text-[10px] tracking-widest" style={{ color: s.accent }}>
                    {s.tag}
                  </span>
                </div>

                {/* Upper: face (clear) */}
                <div className="relative overflow-hidden bg-black scanlines" style={{ aspectRatio: "1 / 1" }}>
                  <img
                    src={s.src}
                    alt={s.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                  {/* Face frame brackets */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <g stroke={s.accent} strokeWidth="0.3" fill="none" opacity="0.6">
                      <path d="M 25 18 L 35 18 M 65 18 L 75 18 M 25 18 L 25 25 M 75 18 L 75 25" />
                      <path d="M 25 82 L 35 82 M 65 82 L 75 82 M 25 75 L 25 82 M 75 75 L 75 82" />
                    </g>
                  </svg>
                  {/* Bio readout overlay */}
                  <div className="absolute top-2 left-2 mono text-[9px] text-white/80 leading-tight">
                    <div>BIO_SCAN ●</div>
                    <div style={{ color: s.accent }}>{s.handle}</div>
                  </div>
                  <div className="absolute bottom-2 right-2 mono text-[9px] text-white/80 text-right leading-tight">
                    <div>AGE {s.age}</div>
                    <div style={{ color: s.accent }}>MATCH 99.8%</div>
                  </div>
                </div>

                {/* Vault: encrypted dick pic - 13:19 */}
                <div className="vault relative overflow-hidden bg-black scanlines" style={{ aspectRatio: "13 / 19" }}>
                  <img
                    src={s.src}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className="vault-img absolute inset-0 w-full h-full object-cover object-bottom"
                  />
                  {/* Encrypted noise overlay */}
                  <div
                    className="vault-noise absolute inset-0 pointer-events-none"
                    style={{
                      background: `
                        repeating-linear-gradient(0deg, rgba(0,0,0,0.85) 0px, rgba(0,0,0,0.85) 2px, transparent 2px, transparent 4px),
                        repeating-linear-gradient(90deg, ${s.accent}15 0px, ${s.accent}15 1px, transparent 1px, transparent 6px),
                        linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3))
                      `,
                      animation: "decrypt-stream 3s linear infinite",
                      backgroundSize: "auto, auto, auto",
                    }}
                  />
                  {/* Hex code rain texture */}
                  <div
                    className="vault-noise absolute inset-0 mono text-[8px] leading-[10px] overflow-hidden p-2 break-all"
                    style={{ color: `${s.accent}80`, mixBlendMode: "screen" }}
                  >
                    4f 8a 3e 2b 91 c7 ff 02 1a 5d 6e 88 a4 b3 0c 7f 39 cd 11 e2 b8 47 5c d0 9a 22 fe 6b 31 88 a4 b3 0c 7f 39 cd 11 e2 b8 47 5c d0 9a 22 fe 6b 31 4f 8a 3e 2b 91 c7 ff 02 1a 5d 6e 88 a4 b3 0c 7f
                  </div>
                  {/* Scan sweep line on hover */}
                  <div
                    className="scan-sweep absolute left-0 right-0 h-[40%] pointer-events-none"
                    style={{
                      background: `linear-gradient(180deg, transparent, ${s.accent}40, transparent)`,
                      boxShadow: `0 0 30px ${s.accent}`,
                    }}
                  />

                  {/* Center HUD: decrypt CTA */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-4 pointer-events-none">
                    <div
                      className="vault-noise w-16 h-16 rounded-full border-2 flex items-center justify-center mb-4 backdrop-blur-sm"
                      style={{
                        borderColor: s.accent,
                        background: `${s.accent}15`,
                        boxShadow: `0 0 24px ${s.accent}60, inset 0 0 12px ${s.accent}30`,
                      }}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={s.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <div className="vault-noise mono text-[10px] tracking-[0.3em] text-white/80 mb-1">PAYLOAD ENCRYPTED</div>
                    <div className="vault-noise mono text-[9px] text-white/40">AES-256 // KEY REQUIRED</div>
                  </div>

                  {/* Bottom: decrypt progress + label */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent pointer-events-none">
                    <div className="flex items-center justify-between mono text-[10px] mb-1.5">
                      <span className="decrypt-label" style={{ color: s.accent }}>
                        <span className="locked">▲ HOVER_TO_DECRYPT</span>
                        <span className="unlocked">✓ PAYLOAD_RECEIVED</span>
                      </span>
                      <span className="text-white/50">.dckpic</span>
                    </div>
                    <div className="h-[2px] w-full bg-white/10 overflow-hidden rounded-full">
                      <div
                        className="decrypt-bar h-full rounded-full"
                        style={{ background: s.accent, boxShadow: `0 0 8px ${s.accent}` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer stats panel */}
                <div className="grid grid-cols-3 border-t border-white/10 bg-black/40">
                  {[
                    { k: "STACK", v: s.vitals.stack },
                    { k: "GIRTH", v: s.vitals.girth },
                    { k: "HEAT", v: s.vitals.heat },
                  ].map((stat, j) => (
                    <div
                      key={j}
                      className={`px-3 py-2.5 ${j < 2 ? "border-r border-white/10" : ""}`}
                    >
                      <div className="mono text-[9px] text-white/40 tracking-widest">{stat.k}</div>
                      <div className="mono text-sm font-semibold" style={{ color: s.accent }}>
                        {stat.v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Name below frame */}
              <div className="mt-3 flex items-baseline justify-between px-1">
                <div className="flex items-baseline gap-2">
                  <span
                    className="font-bold text-white tracking-tight"
                    style={{ fontSize: "1.15rem", fontFamily: "'Onest', sans-serif", animation: "glitch-x 4s infinite" }}
                  >
                    {s.name}
                  </span>
                </div>
                <span className="mono text-[10px] tracking-widest" style={{ color: s.accent }}>
                  &gt; SELECT_
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom status */}
        <div className="mt-10 text-center mono text-[10px] text-white/40 tracking-[0.3em]">
          /// END_OF_FEED — REFRESH FOR NEW SUBJECTS
        </div>
      </div>
    </div>
  );
};

export default PopNsfwGay2;
