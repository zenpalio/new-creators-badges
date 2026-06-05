import { ReactNode } from "react";
import { PopunderVariant, accentClasses } from "../../data/popunderVariants";

type Props = {
  variant: PopunderVariant;
  children: ReactNode;
};

export default function PopunderShell({ variant, children }: Props) {
  const accent = accentClasses[variant.accent];
  return (
    <div className="fixed inset-0 overflow-hidden bg-black text-white">
      {/* Ambient gradient orbs */}
      <div className={`pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl opacity-60 ${accent.orbA}`} />
      <div className={`pointer-events-none absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-50 ${accent.orbB}`} />

      {/* Particles */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="absolute block h-1 w-1 rounded-full bg-white/40 animate-pop-float"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              animationDelay: `${(i % 8) * 0.6}s`,
              animationDuration: `${6 + (i % 5)}s`,
            }}
          />
        ))}
      </div>

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)]" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-md flex-col items-stretch justify-between px-5 py-6">
        {children}
      </div>
    </div>
  );
}
