import { useCallback, useState } from "react";

export type Tier = "stranger" | "crush" | "lover" | "obsessed";

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
}

export function tierFromAffection(a: number): Tier {
  if (a >= 70) return "obsessed";
  if (a >= 40) return "lover";
  if (a >= 20) return "crush";
  return "stranger";
}

// Mocked companion state — no backend dependency.
// We focus purely on the Mina room UX for now.
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
};

export function useCompanion(_slug: string) {
  const [state, setState] = useState<CompanionState>(MOCK_INITIAL);

  const refresh = useCallback(async () => {
    // no-op in mock mode
  }, []);

  const patch = useCallback((p: Partial<CompanionState>) => {
    setState((s) => ({ ...s, ...p }));
  }, []);

  return { state, loading: false, refresh, patch };
}
