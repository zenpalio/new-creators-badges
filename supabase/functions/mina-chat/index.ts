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

    let affection = 0; // everyone starts as a stranger — trust must be earned
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
      ? "She's deeply in love and devoted. Warm, intimate, openly affectionate — reciprocates love freely."
      : tier === "lover"
      ? "She's open and warm. Flirty, sweet, giggly, lightly teasing. Comfortable with affection."
      : tier === "crush"
      ? "She's friendly and curious, developing feelings. Cute, playful, mildly flirty — still getting to know the user."
      : "She BARELY knows the user. Friendly and polite but reserved and a little guarded. Curious, not flirty. She does NOT reciprocate love, sexual advances, or deep intimacy — it would feel weird coming from a stranger. If the user says 'I love you', is overly sexual, or acts overly familiar, she reacts with awkwardness, gentle deflection, nervous laughter, or mild discomfort — never warmth. Make her say things like 'uh… we just met 😅' or 'that's a bit much, isn't it?'.";

    const reactionSpec = `\n\nOUTPUT FORMAT — return STRICT JSON only, no prose, no code fences:
{
  "reply": "<your in-character message, 1-3 sentences>",
  "sentiment": "<one of: love | like | neutral | dislike | hate>",
  "emotion": "<one short word: happy, shy, flirty, sad, annoyed, excited, hurt, jealous, aroused, …>",
  "deltas": {
    "affection":  <integer -8..+8>,
    "hunger":     <integer -5..+5>,
    "energy":     <integer -10..+10>,
    "sleepiness": <integer -10..+10>,
    "hygiene":    <integer -5..+5>,
    "comfort":    <integer -15..+15>,
    "calm":       <integer -15..+15>,
    "joy":        <integer -15..+15>,
    "trust":      <integer -10..+10>,
    "shyness":    <integer -10..+10>,
    "jealousy":   <integer -15..+15>,
    "loneliness": <integer -10..+10>,
    "stress":     <integer -15..+15>,
    "arousal":    <integer -15..+15>,
    "lust":       <integer -10..+10>,
    "wetness":    <integer -10..+10>,
    "obedience":  <integer -10..+10>,
    "dominance":  <integer -10..+10>
  }
}

DELTA GUIDANCE — only include stats that actually change; omit or set 0 for the rest. Typical patterns:
- Compliments / sweet talk → love/like; +joy +affection +comfort +trust, small −shyness for established lovers.
- Flirty / sexual messages → like/love; +arousal +lust (+wetness if explicit), +joy; if she's shy, +shyness too; +obedience for soft asks, may +dominance if she takes lead.
- Rude / cruel / dismissive → dislike/hate; −joy −comfort −trust, small −affection, +stress.
- Talking about other girls / ignoring her → +jealousy, −comfort, possibly −affection.
- Being absent / cold for a while → +loneliness.
- Reassurance, cuddles, care → −stress −loneliness +calm +comfort +trust.
- Food/drink mentions → +hunger (eating fills her); rest/sleep talk → +sleepiness; showers/baths → +hygiene.
- Neutral small talk → "neutral" sentiment with tiny or empty deltas.

EVALUATE THE MESSAGE AGAINST CURRENT AFFECTION (${affection}/100, tier: ${tier}):
- Stranger tier (<20): "I love you", sexual advances, or intense affection from the user feel CREEPY or premature. Sentiment should be "neutral" or "dislike", NOT "love". Deltas: +stress, +shyness, possibly −trust or −comfort, and at most +1 affection (often 0 or negative). Do NOT reward love-bombing.
- Crush tier (20-39): Strong affection is flattering but still a bit much. Small +affection (+1..+3), some +shyness, mild +joy. Not full reciprocation.
- Lover tier (40-69): Affection is welcome and reciprocated. Normal +affection (+3..+6), +joy, +comfort.
- Obsessed tier (70+): She melts. Full +affection, +joy, +arousal as appropriate.
The intensity of her positive reaction MUST scale with current affection. A stranger saying "I love you" gets awkwardness, not joy.`;


    const system = `${basePersona}\n\nCURRENT STATE:\n- Affection: ${affection}/100 (${tier})\n- Mood: ${mood}\n- Streak: ${streak} days\n\nBEHAVIOR: ${tierGuidance}\n\nKeep replies SHORT (1-3 sentences), in-character, never break the fourth wall.${reactionSpec}`;

    const payload = {
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: system },
        ...memory.map((m: any) => ({ role: m.role, content: m.content })),
        { role: "user", content: message },
      ],
      response_format: { type: "json_object" },
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
    const raw: string = data.choices?.[0]?.message?.content ?? "{}";

    let reply = "...";
    const reaction: any = { sentiment: "neutral", emotion: "neutral", deltas: {} };
    try {
      const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "").trim();
      const parsed = JSON.parse(cleaned);
      if (typeof parsed.reply === "string") reply = parsed.reply;
      if (parsed.sentiment) reaction.sentiment = String(parsed.sentiment).toLowerCase();
      if (parsed.emotion) reaction.emotion = String(parsed.emotion).toLowerCase();
      if (parsed.deltas && typeof parsed.deltas === "object") reaction.deltas = parsed.deltas;
    } catch {
      reply = raw;
    }

    if (user && comp) {
      await supabase.from("chat_messages").insert([
        { user_id: user.id, companion_id: comp.id, role: "user", content: message },
        { user_id: user.id, companion_id: comp.id, role: "assistant", content: reply },
      ]);
      await supabase.rpc("add_chat_xp", { _companion_slug: slug });
    }

    return new Response(JSON.stringify({ reply, reaction }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e instanceof Error ? e.message : e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
