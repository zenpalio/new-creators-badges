// Drafts a scene list for an episode. Assigns cast + locations from the workspace library.
// POST { episode_id: string, count?: number (default 8) }
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { episode_id, count = 8 } = await req.json();
    if (!episode_id) return json({ error: "episode_id required" }, 400);

    const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: ep } = await supa.from("episodes").select("*, dramas(*)").eq("id", episode_id).maybeSingle();
    if (!ep) return json({ error: "episode not found" }, 404);

    const [{ data: cast }, { data: locs }] = await Promise.all([
      supa.from("cast_members").select("id,name,role,personality"),
      supa.from("locations").select("id,name,description,mood_tags"),
    ]);

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "no_api_key" }, 500);

    const castList = (cast ?? []).map((c) => `- ${c.name} [${c.id}] role=${c.role}${c.personality ? " — " + c.personality : ""}`).join("\n") || "(none — leave cast_ids empty)";
    const locList = (locs ?? []).map((l) => `- ${l.name} [${l.id}]${l.description ? " — " + l.description : ""}`).join("\n") || "(none — leave location_id null)";

    const system = `You are a shot-list director for a 9:16 vertical drama. Break the episode into short scenes (2-8 seconds each). Return STRICT JSON only.`;
    const user = `SERIES: ${(ep as any).dramas?.title}
EPISODE ${ep.index}: ${ep.title}
Hook: ${ep.hook ?? ""}
Synopsis: ${ep.synopsis ?? ""}

CAST LIBRARY (use these ids in cast_ids):
${castList}

LOCATION LIBRARY (use these ids for location_id):
${locList}

Produce exactly ${count} scenes. Each scene:
{
  "shot_prompt": "vivid one-sentence visual description (framing + action + mood)",
  "camera": "wide" | "medium" | "close" | "pov",
  "duration_seconds": integer 3-8,
  "location_id": "<uuid from library or null>",
  "cast_ids": ["<uuid>", ...],
  "dialog": [ {"cast_id":"<uuid>","text":"line","delivery":"whisper|shout|calm|..."} ]
}

Return: {"scenes":[ ...${count} items... ]}
No commentary.`;

    const up = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: system }, { role: "user", content: user }],
        response_format: { type: "json_object" },
        temperature: 0.85,
      }),
    });
    if (up.status === 429) return json({ error: "rate_limited" }, 429);
    if (up.status === 402) return json({ error: "credits_exhausted" }, 402);
    if (!up.ok) return json({ error: "upstream", detail: (await up.text()).slice(0, 400) }, 502);

    const data = await up.json();
    const raw = data?.choices?.[0]?.message?.content ?? "{}";
    let parsed: any;
    try { parsed = JSON.parse(raw); } catch { return json({ error: "bad_json", raw: raw.slice(0, 400) }, 502); }

    const castIds = new Set((cast ?? []).map((c) => c.id));
    const locIds = new Set((locs ?? []).map((l) => l.id));

    const { data: existing } = await supa.from("scenes").select("order_index").eq("episode_id", episode_id).order("order_index", { ascending: false }).limit(1);
    const start = (existing?.[0]?.order_index ?? 0) + 1;

    const rows = (Array.isArray(parsed.scenes) ? parsed.scenes : []).slice(0, count).map((s: any, i: number) => {
      const filteredCast = Array.isArray(s.cast_ids) ? s.cast_ids.filter((x: string) => castIds.has(x)) : [];
      const dialog = Array.isArray(s.dialog) ? s.dialog.filter((l: any) => l && typeof l.text === "string").map((l: any) => ({
        cast_id: castIds.has(l.cast_id) ? l.cast_id : (filteredCast[0] ?? ""),
        text: String(l.text).slice(0, 300),
        delivery: l.delivery ? String(l.delivery).slice(0, 40) : undefined,
      })) : [];
      return {
        episode_id,
        order_index: start + i,
        shot_prompt: s.shot_prompt ? String(s.shot_prompt).slice(0, 1000) : "New scene",
        camera: ["wide","medium","close","pov"].includes(s.camera) ? s.camera : "medium",
        duration_seconds: Math.max(2, Math.min(15, parseInt(s.duration_seconds) || 6)),
        location_id: locIds.has(s.location_id) ? s.location_id : null,
        cast_ids: filteredCast,
        dialog,
      };
    });

    if (rows.length === 0) return json({ inserted: 0 });
    const { error } = await supa.from("scenes").insert(rows);
    if (error) return json({ error: error.message }, 500);
    return json({ inserted: rows.length });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
