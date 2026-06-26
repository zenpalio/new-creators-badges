// Mints an ElevenLabs WebRTC conversation token and returns dynamic
// persona overrides built from the user's current affection/mood/streak.
import { createClient } from "npm:@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!apiKey) throw new Error("ElevenLabs not connected");

    const authHeader = req.headers.get("Authorization") ?? "";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userRes } = await supabase.auth.getUser().catch(() => ({ data: { user: null } } as any));
    const user = userRes?.user ?? null;

    const { slug = "mina", intimate = false } = await req.json().catch(() => ({}));

    // Load companion + bond
    const { data: comp } = await supabase.from("companions").select("*").eq("slug", slug).maybeSingle();
    if (!comp) throw new Error("companion not found");
    if (!comp.agent_id) {
      return new Response(JSON.stringify({ error: "agent_not_configured", message: "Mina's ElevenLabs agent hasn't been created yet. Create one in the ElevenLabs dashboard and save the agent_id to the companions table." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: bond } = user
      ? await supabase
          .from("user_companion")
          .select("*")
          .eq("user_id", user.id)
          .eq("companion_id", comp.id)
          .maybeSingle()
      : { data: null as any };

    const affection = bond?.affection ?? (user ? 0 : 45);
    const tier = affection >= 70 ? "obsessed" : affection >= 40 ? "lover" : affection >= 20 ? "crush" : "stranger";

    // Mint WebRTC token
    const r = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${comp.agent_id}`,
      { headers: { "xi-api-key": apiKey } },
    );
    if (!r.ok) {
      const t = await r.text();
      throw new Error(`token mint failed: ${r.status} ${t}`);
    }
    const { token } = await r.json();

    // Build persona override
    const persona = `${comp.base_persona}\n\nCURRENT STATE:\n- Affection: ${affection}/100 (tier: ${tier})\n- Mood: ${bond?.mood ?? "neutral"}\n- Streak: ${bond?.streak_days ?? 0} days\n- Intimate voice tier ${intimate && tier !== "stranger" && tier !== "crush" ? "ENABLED — be very flirty and explicit" : "off — keep it teasing and playful"}.\n\nReact in-character to her current mood. If pouty/cold, make the user earn your warmth.`;

    return new Response(JSON.stringify({
      token,
      agent_id: comp.agent_id,
      overrides: { agent: { prompt: { prompt: persona } } },
      tier,
      affection,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e instanceof Error ? e.message : e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
