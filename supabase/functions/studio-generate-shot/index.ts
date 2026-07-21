// Generates a shot image for a scene using cast + location preview images as references.
// POST { scene_id: string }
// Stores the resulting image in the drama-shots bucket and appends it to scenes.variants.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { scene_id } = await req.json();
    if (!scene_id) return json({ error: "scene_id required" }, 400);

    const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: scene } = await supa.from("scenes").select("*").eq("id", scene_id).maybeSingle();
    if (!scene) return json({ error: "scene not found" }, 404);

    const castIds: string[] = Array.isArray(scene.cast_ids) ? scene.cast_ids : [];
    const [{ data: castRows }, { data: loc }] = await Promise.all([
      castIds.length ? supa.from("cast_members").select("name,preview_url").in("id", castIds) : Promise.resolve({ data: [] as any[] }),
      scene.location_id ? supa.from("locations").select("name,description,preview_url").eq("id", scene.location_id).maybeSingle() : Promise.resolve({ data: null as any }),
    ]);

    const castNames = (castRows ?? []).map((c: any) => c.name).join(", ");
    const camera = scene.camera ?? "medium";
    const promptText = [
      "Cinematic vertical 9:16 frame for a serialized vertical drama.",
      `Camera: ${camera} shot.`,
      castNames ? `Featuring: ${castNames}. Keep faces consistent with the reference photos.` : "",
      loc ? `Location: ${loc.name}${loc.description ? " — " + loc.description : ""}. Match the reference background.` : "",
      `Shot: ${scene.shot_prompt}`,
      "Photoreal, dramatic lighting, high production value, no captions or text overlays.",
    ].filter(Boolean).join(" ");

    // Build multimodal content: prompt + reference images
    const refs: any[] = [];
    for (const c of (castRows ?? [])) if (c.preview_url) refs.push({ type: "image_url", image_url: { url: c.preview_url } });
    if (loc?.preview_url) refs.push({ type: "image_url", image_url: { url: loc.preview_url } });

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "no_api_key" }, 500);

    const up = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{
          role: "user",
          content: [{ type: "text", text: promptText }, ...refs],
        }],
        modalities: ["image", "text"],
      }),
    });
    if (up.status === 429) return json({ error: "rate_limited" }, 429);
    if (up.status === 402) return json({ error: "credits_exhausted" }, 402);
    if (!up.ok) return json({ error: "upstream", detail: (await up.text()).slice(0, 400) }, 502);

    const data = await up.json();
    const msg = data?.choices?.[0]?.message;
    // Extract image: Gemini returns { images: [{ image_url: { url: "data:image/png;base64,..." } }] } via OpenAI-compat
    let dataUrl: string | undefined;
    const imgs = msg?.images;
    if (Array.isArray(imgs) && imgs.length > 0) dataUrl = imgs[0]?.image_url?.url ?? imgs[0]?.url;
    if (!dataUrl && Array.isArray(msg?.content)) {
      const imgPart = msg.content.find((c: any) => c?.type === "image_url" || c?.type === "output_image");
      dataUrl = imgPart?.image_url?.url ?? imgPart?.url;
    }
    if (!dataUrl) return json({ error: "no_image", raw: JSON.stringify(msg).slice(0, 400) }, 502);

    // Parse data URL
    const m = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (!m) return json({ error: "bad_data_url" }, 502);
    const mime = m[1];
    const ext = mime.split("/")[1].replace("+xml", "");
    const bytes = Uint8Array.from(atob(m[2]), (c) => c.charCodeAt(0));

    const path = `${scene.episode_id}/${scene_id}-${Date.now()}.${ext}`;
    const { error: upErr } = await supa.storage.from("drama-shots").upload(path, bytes, { contentType: mime, upsert: false });
    if (upErr) return json({ error: "upload_failed", detail: upErr.message }, 500);
    const { data: signed } = await supa.storage.from("drama-shots").createSignedUrl(path, 60 * 60 * 24 * 365);
    const url = signed?.signedUrl ?? path;

    const existing = Array.isArray(scene.variants) ? scene.variants : [];
    const variant = { url, path, mime, prompt: promptText, created_at: new Date().toISOString() };
    await supa.from("scenes").update({ variants: [...existing, variant] }).eq("id", scene_id);

    return json({ variant });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
