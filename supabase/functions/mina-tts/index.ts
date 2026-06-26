// deno-lint-ignore-file no-explicit-any
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { text, voice } = await req.json();
    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "missing text" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const upstream = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini-tts",
        input: text.slice(0, 1200),
        voice: voice || "coral",
        response_format: "mp3",
        instructions: "Speak as a cute, youthful anime-style girl. Bright, light, slightly breathy voice with a playful, flirty lilt and a small smile. Soft, warm, and a little teasing — never deep or mature.",
      }),
    });

    if (!upstream.ok) {
      const msg = await upstream.text().catch(() => "");
      return new Response(JSON.stringify({ error: `tts ${upstream.status}: ${msg}` }), {
        status: upstream.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(upstream.body, {
      headers: { ...corsHeaders, "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
