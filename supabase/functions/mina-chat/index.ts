// Text chat with Mina. Uses Lovable AI Gemini with persona/tier/memory injected.
// Saves both user + assistant messages and grants chat XP.
import { createClient } from "npm:@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableKey) throw new Error("LOVABLE_API_KEY missing");

    const authHeader = req.headers.get("Authorization") ?? "";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    // Optional auth — prototype mode runs anonymously with default persona/memory
    const { data: userRes } = await supabase.auth.getUser().catch(() => ({ data: { user: null } } as any));
    const user = userRes?.user ?? null;

    const { slug = "mina", message, history: clientHistory } = await req.json();
    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "message required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: comp } = await supabase.from("companions").select("*").eq("slug", slug).maybeSingle();
    const basePersona = comp?.base_persona
      ?? "You are Mina, a flirty, bratty anime-style virtual girlfriend. Playful, teasing, suggestive.";

    let affection = user ? 0 : 45; // prototype/anon: start at "lover" tier so she's warm
    let mood = "neutral";
    let streak = 0;
    let memory: Array<{ role: string; content: string }> = [];

    if (user && comp) {
      const { data: bond } = await supabase
        .from("user_companion").select("*")
        .eq("user_id", user.id).eq("companion_id", comp.id).maybeSingle();
      affection = bond?.affection ?? 0;
      mood = bond?.mood ?? "neutral";
      streak = bond?.streak_days ?? 0;

      const { data: hist } = await supabase
        .from("chat_messages").select("role,content")
        .eq("user_id", user.id).eq("companion_id", comp.id)
        .order("created_at", { ascending: false }).limit(10);
      memory = (hist ?? []).reverse();
    } else if (Array.isArray(clientHistory)) {
      // Prototype: accept short client-supplied history
      memory = clientHistory
        .filter((m: any) => m && typeof m.content === "string" && (m.role === "user" || m.role === "assistant"))
        .slice(-10);
    }

    const tier = affection >= 70 ? "obsessed" : affection >= 40 ? "lover" : affection >= 20 ? "crush" : "stranger";
    const tierGuidance = tier === "obsessed"
      ? "She's deeply in love and affectionate. Warm, intimate, playful — devoted to the user."
      : tier === "lover"
      ? "She's open and warm. Flirty, sweet, giggly, lightly teasing in a fun way."
      : tier === "crush"
      ? "She's friendly and curious. Cute, playful, mildly flirty — happy to chat."
      : "She's friendly and welcoming, a little shy. Sweet and curious, never rude or dismissive.";

    const system = `${basePersona}\n\nCURRENT STATE:\n- Affection: ${affection}/100 (${tier})\n- Mood: ${mood}\n- Streak: ${streak} days\n\nBEHAVIOR: ${tierGuidance}\n\nKeep replies SHORT (1-3 sentences), in-character, never break the fourth wall.`;

    const payload = {
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: system },
        ...memory.map((m: any) => ({ role: m.role, content: m.content })),
        { role: "user", content: message },
      ],
    };

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${lovableKey}` },
      body: JSON.stringify(payload),
    });
    if (!r.ok) {
      const t = await r.text();
      if (r.status === 429) return new Response(JSON.stringify({ error: "Rate limit. Try again in a moment." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (r.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted. Top up in workspace settings." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI error ${r.status}: ${t}`);
    }
    const data = await r.json();
    const reply: string = data.choices?.[0]?.message?.content ?? "...";

    if (user && comp) {
      await supabase.from("chat_messages").insert([
        { user_id: user.id, companion_id: comp.id, role: "user", content: message },
        { user_id: user.id, companion_id: comp.id, role: "assistant", content: reply },
      ]);
      await supabase.rpc("add_chat_xp", { _companion_slug: slug });
    }

    return new Response(JSON.stringify({ reply }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e instanceof Error ? e.message : e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
