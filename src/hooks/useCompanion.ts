import { useCallback, useEffect, useState } from "react";

export type Tier = "stranger" | "crush" | "lover" | "obsessed";

export interface MoodStats {
  hunger: number;   // 0 = starving, 100 = full
  energy: number;   // 0 = sleepy,   100 = energized
  arousal: number;  // 0 = cold,     100 = horny
  calm: number;     // 0 = nervous,  100 = serene
  joy: number;      // 0 = sad,      100 = happy
  comfort: number;  // 0 = lonely,   100 = cozy
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
  stats: { hunger: 65, energy: 75, arousal: 28, calm: 70, joy: 62, comfort: 55 },
};

// Per-minute drift toward "neglected" baselines.
const DRIFT_PER_MIN: Partial<Record<keyof MoodStats, number>> = {
  hunger: -0.6,
  energy: -0.4,
  arousal: -0.3,
  calm: +0.25,
  joy: -0.25,
  comfort: -0.2,
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
