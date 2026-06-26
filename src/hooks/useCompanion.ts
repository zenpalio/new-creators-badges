import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

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

export function useCompanion(slug: string) {
  const [state, setState] = useState<CompanionState | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { data: comp } = await supabase.from("companions").select("id, agent_id").eq("slug", slug).maybeSingle();
    if (!comp) return;
    const [{ data: bond }, { data: profile }] = await Promise.all([
      supabase.from("user_companion").select("*").eq("user_id", u.user.id).eq("companion_id", comp.id).maybeSingle(),
      supabase.from("profiles").select("tokens_balance").eq("user_id", u.user.id).maybeSingle(),
    ]);
    if (!bond) return;
    setState({
      affection: bond.affection,
      mood: bond.mood,
      streak_days: bond.streak_days,
      current_outfit: bond.current_outfit,
      unlocked_tiers: bond.unlocked_tiers ?? [],
      tokens_balance: profile?.tokens_balance ?? 0,
      free_call_seconds_today: bond.free_call_seconds_today ?? 0,
      companion_id: comp.id,
      agent_id: comp.agent_id,
    });
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Register visit on mount
      await supabase.rpc("register_visit", { _companion_slug: slug });
      if (!cancelled) await refresh();
    })();
    return () => { cancelled = true; };
  }, [slug, refresh]);

  return { state, loading, refresh };
}
