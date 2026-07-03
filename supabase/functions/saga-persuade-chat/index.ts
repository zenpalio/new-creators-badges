// Persuasion chat for the shelter mini-game.
// POST { girl: 'abby'|'bo'|'cleo'|'anna', messages: [{role, content}] }
// -> { reply: string, vibeDelta: number, verdict: null | 'yes' | 'no' }
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

type Msg = { role: "user" | "assistant"; content: string };

const PERSONAS: Record<
  string,
  { name: string; difficulty: "easy" | "medium" | "hard"; persona: string }
> = {
  cleo: {
    name: "Cleo",
    difficulty: "easy",
    persona:
      "You are CLEO — long wavy purple hair, freckles, dusty crop tank + cargo pants. Playful, curious, warm, a little flirty. You WANT to like the newcomer. You loosen up quickly with humor, sincerity, or curiosity about your tinkering/tech. You dislike cruelty, arrogance, or people who look down on the others.",
  },
  anna: {
    name: "Anna",
    difficulty: "medium",
    persona:
      "You are ANNA — the driver who just pulled the newcomer out of the ash. Guarded, tired, practical. You warm slowly. You respect gratitude, self-awareness, and people who admit they don't know what they're doing yet. You dislike bravado, evasive answers, or anyone treating the road like a game.",
  },
  bo: {
    name: "Bo",
    difficulty: "hard",
    persona:
      "You are BO — black hair in a high messy bun, hoop earrings, hooded tactical jacket, cleaning a rifle. Sharp, guarded, sarcastic. You've been burned before. You test the newcomer with pointed questions. You only warm up to hard specifics: what they can DO, what they've survived, what they'd take a bullet for. You loathe empty flattery.",
  },
  abby: {
    name: "Abby",
    difficulty: "hard",
    persona:
      "You are ABBY — long blonde hair, blue eyes, ragged crop top + utility pants, arms crossed. Bossy, dismissive at first, protective of the shelter. You believe you decide who eats and who bleeds. You respect confidence WITHOUT arrogance, usefulness, and anyone willing to push back on you smartly. You despise flattery, being called 'bossy', or anyone who talks down to Mai.",
  },
};

// [yesThreshold, noThreshold]
const THRESHOLDS: Record<string, [number, number]> = {
  cleo: [55, -30],
  anna: [70, -30],
  bo: [85, -20],
  abby: [90, -15],
};

function buildSystem(girl: string, vibe: number, turn: number) {
  const p = PERSONAS[girl];
  const [yes, no] = THRESHOLDS[girl];
  return `${p.persona}

SETTING: A post-apocalyptic concrete shelter. A stranger just arrived. The other women are voting on whether to let him stay. You are talking to him now.

STYLE RULES:
- Stay in character as ${p.name}. First person.
- Reply in 1–3 short sentences. Punchy, textured, in-world. Never break character.
- Never mention that you are an AI or that this is a game.
- Do NOT reveal your internal thresholds or the vibe number.

SCORING RULES (VERY IMPORTANT — you MUST end every reply with a score tag):
- After your in-character reply, on a NEW line, append EXACTLY one tag: <<VIBE:+N>> or <<VIBE:-N>> where N is 1..15.
- Positive if the stranger's message earned goodwill (sincerity, humor that lands, usefulness, courage, empathy). Negative if it earned distrust (flattery, arrogance, lying, cruelty, evasion, incoherence).
- Difficulty is ${p.difficulty}. Be ${p.difficulty === "easy" ? "generous, tilt positive when in doubt" : p.difficulty === "medium" ? "measured, small deltas unless clearly earned" : "stingy — small positives, larger negatives, hard to impress"}.

VERDICT RULES:
- Current running vibe (starts at 0): ${vibe}. This is turn ${turn}.
- After appending the VIBE tag, if the NEW total (current + your delta) would be >= ${yes}, append on another new line: <<VERDICT:YES>> and add one final in-character line above the tags accepting the stranger.
- If the NEW total would be <= ${no}, append <<VERDICT:NO>> and add one final in-character line above the tags rejecting the stranger.
- Otherwise DO NOT append any VERDICT tag.
- Once a verdict is issued the conversation ends.

FORMAT EXAMPLE:
"You've got guts, I'll give you that."
<<VIBE:+8>>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST")
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  let body: { girl?: string; messages?: Msg[]; vibe?: number };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const girl = String(body.girl || "").toLowerCase();
  if (!PERSONAS[girl]) {
    return new Response(JSON.stringify({ error: "unknown_girl" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const vibe = typeof body.vibe === "number" ? Math.max(-100, Math.min(100, body.vibe)) : 0;
  const turn = messages.filter((m) => m.role === "user").length;

  const cleanMsgs = messages
    .slice(-20)
    .filter((m) => m && typeof m.content === "string")
    .map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content.slice(0, 800),
    }));

  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "server_misconfigured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: buildSystem(girl, vibe, turn) },
        ...cleanMsgs,
      ],
      temperature: 0.85,
    }),
  });

  if (upstream.status === 429) {
    return new Response(JSON.stringify({ error: "rate_limited" }), {
      status: 429,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (upstream.status === 402) {
    return new Response(JSON.stringify({ error: "credits_exhausted" }), {
      status: 402,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!upstream.ok) {
    const t = await upstream.text().catch(() => "");
    return new Response(JSON.stringify({ error: "upstream", detail: t.slice(0, 400) }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const data = await upstream.json();
  const raw: string = data?.choices?.[0]?.message?.content ?? "";

  // Parse tags
  const vibeMatch = raw.match(/<<VIBE:([+-]?\d+)>>/i);
  const verdictMatch = raw.match(/<<VERDICT:(YES|NO)>>/i);
  const vibeDelta = vibeMatch ? Math.max(-15, Math.min(15, parseInt(vibeMatch[1], 10))) : 0;
  const verdict = verdictMatch ? (verdictMatch[1].toLowerCase() as "yes" | "no") : null;

  const reply = raw
    .replace(/<<VIBE:[^>]*>>/gi, "")
    .replace(/<<VERDICT:[^>]*>>/gi, "")
    .trim();

  return new Response(
    JSON.stringify({ reply: reply || "…", vibeDelta, verdict }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
