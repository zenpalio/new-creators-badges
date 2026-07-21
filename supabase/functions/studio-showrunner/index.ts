// Chat-driven Drama showrunner. Returns { reply, proposals }.
// POST { drama_id, messages: [{role, content}] }
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { drama_id, messages = [] } = await req.json();
    if (!drama_id) return j({ error: "drama_id required" }, 400);

    const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const [{ data: drama }, { data: cast }, { data: locs }, { data: episodes }] = await Promise.all([
      supa.from("dramas").select("*").eq("id", drama_id).maybeSingle(),
      supa.from("cast_members").select("id,name,role,personality"),
      supa.from("locations").select("id,name,description"),
      supa.from("episodes").select("index,title,hook").eq("drama_id", drama_id).order("index"),
    ]);
    if (!drama) return j({ error: "drama not found" }, 404);

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return j({ error: "no_api_key" }, 500);

    const system = `You are a vertical drama showrunner working with the producer in a chat.
You help them build a 9:16 short-form series step by step: concept → cast → locations → episodes → scenes.

RESPOND WITH STRICT JSON:
{
  "reply": "conversational message to the producer",
  "proposals": [ /* zero or more, see types below */ ]
}

PROPOSAL TYPES:
- {"type":"concept","title":"...","logline":"...","description":"...","genre":"...","tone":"..."}
- {"type":"cast","options":[{"name":"Mai","role":"lead","personality":"warm, playful","portrait_prompt":"cinematic 9:16 portrait, asian woman early 20s, warm smile, moody amber light, post-apocalyptic shelter setting"}]}
- {"type":"locations","options":[{"name":"Neon rooftop","description":"...","mood_tags":["night","rain","neon"],"image_prompt":"..."}]}
- {"type":"episodes","options":[{"index":1,"title":"...","hook":"...","synopsis":"3-5 sentence beat sheet"}]}
- {"type":"scenes","episode_index":1,"options":[{"order_index":1,"shot_prompt":"...","camera":"medium","duration_seconds":6,"cast_names":["Mai"],"location_name":"Shelter corridor","dialog":[{"cast_name":"Mai","text":"Follow me.","delivery":"whispered"}]}]}

WORKFLOW:
1. If drama has no logline/description → propose a "concept" first, ask what direction they like.
2. Once concept exists and cast is empty → propose 3-5 "cast" options with vivid portrait_prompts.
3. Then propose "locations" (3-5).
4. Then propose "episodes" (10 with cliffhangers).
5. When they pick an episode, propose "scenes" for it (6-10 scenes, referencing cast_names and location_name from the library).

Keep reply short and conversational (1-3 sentences). Include proposals whenever it moves the project forward. Never invent cast/location that don't exist when referencing them in scenes — only use names from the CURRENT LIBRARY below.`;

    const ctx = `CURRENT DRAMA:
Title: ${drama.title}
Logline: ${drama.logline ?? "(empty)"}
Description: ${drama.description ?? "(empty)"}
Genre: ${drama.genre ?? "(empty)"}
Tone: ${drama.tone ?? "(empty)"}
Episode length: ~${drama.target_episode_seconds}s, ${drama.aspect_ratio}

CAST LIBRARY (${cast?.length ?? 0}):
${(cast ?? []).map(c => `- ${c.name} [${c.role}] ${c.personality ?? ""}`).join("\n") || "(empty)"}

LOCATIONS LIBRARY (${locs?.length ?? 0}):
${(locs ?? []).map(l => `- ${l.name}: ${l.description ?? ""}`).join("\n") || "(empty)"}

EPISODES (${episodes?.length ?? 0}):
${(episodes ?? []).map(e => `EP${e.index}: ${e.title} — ${e.hook ?? ""}`).join("\n") || "(empty)"}`;

    const up = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        response_format: { type: "json_object" },
        temperature: 0.9,
        messages: [
          { role: "system", content: system },
          { role: "system", content: ctx },
          ...messages,
        ],
      }),
    });
    if (up.status === 429) return j({ error: "rate_limited" }, 429);
    if (up.status === 402) return j({ error: "credits_exhausted" }, 402);
    if (!up.ok) return j({ error: "upstream", detail: (await up.text()).slice(0, 500) }, 502);

    const data = await up.json();
    const raw = data?.choices?.[0]?.message?.content ?? "{}";
    let parsed: any;
    try { parsed = JSON.parse(raw); } catch { return j({ reply: raw, proposals: [] }); }
    return j({ reply: parsed.reply ?? "", proposals: Array.isArray(parsed.proposals) ? parsed.proposals : [] });
  } catch (e) {
    return j({ error: String(e) }, 500);
  }
});

function j(b: unknown, s = 200) {
  return new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
