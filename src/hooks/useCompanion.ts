import { useCallback, useEffect, useState } from "react";

export type Tier = "stranger" | "crush" | "lover" | "obsessed";

export interface MoodStats {
  // Body
  hunger: number;     // 0 = starving, 100 = full
  energy: number;     // 0 = sleepy,   100 = energized
  sleepiness: number; // 0 = awake,    100 = drowsy
  hygiene: number;    // 0 = grimy,    100 = fresh
  comfort: number;    // 0 = lonely,   100 = cozy
  calm: number;       // 0 = nervous,  100 = serene
  // Heart
  joy: number;        // 0 = sad,      100 = happy
  trust: number;      // 0 = guarded,  100 = open
  shyness: number;    // 0 = bold,     100 = blushing mess
  jealousy: number;   // 0 = secure,   100 = seething
  loneliness: number; // 0 = content,  100 = aching
  stress: number;     // 0 = relaxed,  100 = overwhelmed
  // Desire
  arousal: number;    // 0 = cold,     100 = horny (right now)
  lust: number;       // 0 = sated,    100 = craving (slow build)
  obedience: number;  // 0 = bratty,   100 = compliant
  dominance: number;  // 0 = submissive,100 = in control
  wetness: number;    // explicit sub-meter of arousal
}

export interface CompanionState {
  affection: number;
  mood: string;
  streak_days: number;
  current_outfit: string;
  unlocked_tiers: string[];
  tokens_balance: number;
  free_call_seconds_today: number;
  companion_id: string;
  agent_id: string | null;
  stats: MoodStats;
}

export function tierFromAffection(a: number): Tier {
  if (a >= 70) return "obsessed";
  if (a >= 40) return "lover";
  if (a >= 20) return "crush";
  return "stranger";
}

const clamp = (n: number) => Math.max(0, Math.min(100, n));

const MOCK_INITIAL: CompanionState = {
  affection: 12,
  mood: "curious",
  streak_days: 1,
  current_outfit: "default",
  unlocked_tiers: ["stranger"],
  tokens_balance: 50,
  free_call_seconds_today: 0,
  companion_id: "mock-mina",
  agent_id: null,
  stats: {
    hunger: 65, energy: 75, sleepiness: 20, hygiene: 80, comfort: 55, calm: 70,
    joy: 62, trust: 30, shyness: 65, jealousy: 10, loneliness: 35, stress: 25,
    arousal: 28, lust: 22, obedience: 55, dominance: 45, wetness: 18,
  },
};

// Per-minute drift toward "neglected" baselines.
const DRIFT_PER_MIN: Partial<Record<keyof MoodStats, number>> = {
  hunger: -0.6,
  energy: -0.4,
  sleepiness: +0.5,
  hygiene: -0.3,
  comfort: -0.2,
  calm: +0.25,
  joy: -0.25,
  trust: -0.05,
  loneliness: +0.4,
  stress: +0.15,
  arousal: -0.3,
  lust: +0.1,
  wetness: -0.4,
};

export function useCompanion(_slug: string) {
  const [state, setState] = useState<CompanionState>(MOCK_INITIAL);

  const refresh = useCallback(async () => {
    // no-op in mock mode
  }, []);

  const patch = useCallback((p: Partial<CompanionState>) => {
    setState((s) => ({ ...s, ...p }));
  }, []);

  const nudgeStats = useCallback((delta: Partial<MoodStats>) => {
    setState((s) => {
      const next = { ...s.stats };
      (Object.keys(delta) as (keyof MoodStats)[]).forEach((k) => {
        next[k] = clamp(next[k] + (delta[k] ?? 0));
      });
      return { ...s, stats: next };
    });
  }, []);

  // Slow live decay so the bars feel alive
  useEffect(() => {
    const id = window.setInterval(() => {
      setState((s) => {
        const next = { ...s.stats };
        (Object.keys(DRIFT_PER_MIN) as (keyof MoodStats)[]).forEach((k) => {
          // 5s tick → 5/60 of per-minute drift
          next[k] = clamp(next[k] + (DRIFT_PER_MIN[k] ?? 0) * (5 / 60));
        });
        return { ...s, stats: next };
      });
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  return { state, loading: false, refresh, patch, nudgeStats };
}
