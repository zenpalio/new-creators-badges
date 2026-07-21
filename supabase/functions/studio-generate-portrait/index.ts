// Generate a 9:16 character portrait, upload to drama-shots, insert cast_member with preview_url.
// POST { name, role, personality, portrait_prompt }
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { name, role = "supporting", personality = null, portrait_prompt } = await req.json();
    if (!name || !portrait_prompt) return j({ error: "name and portrait_prompt required" }, 400);

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return j({ error: "no_api_key" }, 500);

    const up = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: `Full-body cinematic 9:16 vertical portrait. ${portrait_prompt}. Consistent character reference sheet quality, sharp focus, single subject, no text.` }],
        modalities: ["image", "text"],
      }),
    });
    if (up.status === 429) return j({ error: "rate_limited" }, 429);
    if (up.status === 402) return j({ error: "credits_exhausted" }, 402);
    if (!up.ok) return j({ error: "upstream", detail: (await up.text()).slice(0, 400) }, 502);

    const data = await up.json();
    const imgUrl: string | undefined = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!imgUrl) return j({ error: "no_image", detail: JSON.stringify(data).slice(0, 400) }, 502);

    const b64 = imgUrl.split(",")[1];
    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));

    const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const path = `cast/${crypto.randomUUID()}.png`;
    const upl = await supa.storage.from("drama-shots").upload(path, bytes, { contentType: "image/png", upsert: false });
    if (upl.error) return j({ error: upl.error.message }, 500);
    const { data: pub } = supa.storage.from("drama-shots").getPublicUrl(path);

    const { data: row, error } = await supa.from("cast_members").insert({
      name, role, personality, preview_url: pub.publicUrl,
    }).select().single();
    if (error) return j({ error: error.message }, 500);

    return j({ cast: row });
  } catch (e) {
    return j({ error: String(e) }, 500);
  }
});

function j(b: unknown, s = 200) {
  return new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
