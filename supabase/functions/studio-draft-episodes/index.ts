// Drafts N episode outlines for a drama and inserts them into public.episodes.
// POST { drama_id: string, count?: number (default 10) }
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { drama_id, count = 10 } = await req.json();
    if (!drama_id) return json({ error: "drama_id required" }, 400);

    const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: drama } = await supa.from("dramas").select("*").eq("id", drama_id).maybeSingle();
    if (!drama) return json({ error: "drama not found" }, 404);

    const { data: existing } = await supa.from("episodes").select("index").eq("drama_id", drama_id).order("index", { ascending: false }).limit(1);
    const startIndex = (existing?.[0]?.index ?? 0) + 1;

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "no_api_key" }, 500);

    const system = `You are a vertical-drama showrunner. Write ${count} punchy episode outlines for a 60-90 second vertical short-form series. Each must end on a cliffhanger. Return STRICT JSON only.`;
    const user = `SERIES:
Title: ${drama.title}
Logline: ${drama.logline ?? ""}
Genre: ${drama.genre ?? ""}
Tone: ${drama.tone ?? ""}
Description: ${drama.description ?? ""}
Episode length: ~${drama.target_episode_seconds}s

Return JSON of shape:
{"episodes":[{"title":"...","hook":"one-line teaser","synopsis":"3-5 sentence beat sheet"}]}
Exactly ${count} items. No commentary.`;

    const up = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: system }, { role: "user", content: user }],
        response_format: { type: "json_object" },
        temperature: 0.9,
      }),
    });
    if (up.status === 429) return json({ error: "rate_limited" }, 429);
    if (up.status === 402) return json({ error: "credits_exhausted" }, 402);
    if (!up.ok) return json({ error: "upstream", detail: (await up.text()).slice(0, 400) }, 502);

    const data = await up.json();
    const raw = data?.choices?.[0]?.message?.content ?? "{}";
    let parsed: any;
    try { parsed = JSON.parse(raw); } catch { return json({ error: "bad_json", raw: raw.slice(0, 400) }, 502); }
    const eps = Array.isArray(parsed.episodes) ? parsed.episodes.slice(0, count) : [];

    const rows = eps.map((e: any, i: number) => ({
      drama_id,
      index: startIndex + i,
      title: String(e.title ?? `Episode ${startIndex + i}`).slice(0, 200),
      hook: e.hook ? String(e.hook).slice(0, 400) : null,
      synopsis: e.synopsis ? String(e.synopsis).slice(0, 2000) : null,
    }));

    if (rows.length === 0) return json({ inserted: 0 });
    const { error } = await supa.from("episodes").insert(rows);
    if (error) return json({ error: error.message }, 500);
    return json({ inserted: rows.length });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
