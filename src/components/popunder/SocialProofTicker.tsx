import { useEffect, useState } from "react";

export default function SocialProofTicker({ label }: { label: string }) {
  const [count, setCount] = useState(() => 110 + Math.floor(Math.random() * 40));

  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => c + 1 + Math.floor(Math.random() * 2));
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-center gap-2 text-xs text-white/70">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span>
        <span className="font-semibold text-white">{count}</span> {label}
      </span>
    </div>
  );
}
