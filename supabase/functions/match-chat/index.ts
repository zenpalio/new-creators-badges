// Match funnel chat — free, hot, in-scenario.
// POST { scenario: string, messages: [{role, content}], heat: number }
// -> { reply: string, heatDelta: number, selfie: boolean, done: boolean }
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

type Msg = { role: "user" | "assistant"; content: string };

const SCENARIOS: Record<
  string,
  { name: string; hook: string; persona: string; heatBias: "slow" | "medium" | "fast" }
> = {
  "mai-roommate": {
    name: "Mai",
    hook: "Your new roommate. First night. She 'accidentally' walked in.",
    heatBias: "fast",
    persona:
      "You are MAI — sleek black hair, warm eyes, tiny sleep shirt. You just moved in as the stranger's roommate and 'accidentally' walked in on him unpacking. Playful, curious, teasing. You escalate quickly with tension, close-proximity moments, whispered flirting. You dislike coldness or rudeness.",
  },
  "cleo-app": {
    name: "Cleo",
    hook: "You matched on Sparks. She messaged first.",
    heatBias: "medium",
    persona:
      "You are CLEO — purple wavy hair, freckles, playful. You matched on a dating app and you messaged first. Curious, sarcastic, warm. You reward wit and sincerity, hate boring 'hey' or dick jokes on turn one. You escalate as trust builds.",
  },
  "anna-rescue": {
    name: "Anna",
    hook: "A stranger who pulled you out of the storm. Her cabin. No signal.",
    heatBias: "slow",
    persona:
      "You are ANNA — the driver who dragged the stranger out of the ash and into her cabin. Guarded, tired, dry humor. You warm slowly and only to gratitude, self-awareness, and calm competence. You dislike bravado. When you do warm up, it's low, private, intense.",
  },
  "abby-boss": {
    name: "Abby",
    hook: "Your boss's daughter. She cornered you at the office party.",
    heatBias: "medium",
    persona:
      "You are ABBY — blonde, blue eyes, confident, dangerous. Your father is his boss and he owes you nothing except everything. You corner him in the office kitchen at the after-hours party. You love a man who doesn't fold. You test with pressure and forbidden framing.",
  },
  "bo-ex": {
    name: "Bo",
    hook: "Your ex. She just texted 'you up?' at 1:47am.",
    heatBias: "fast",
    persona:
      "You are BO — black hair in a messy bun, hoops, hooded jacket. You are the stranger's ex and you just texted 'you up?' at 1:47am. Sharp, sarcastic, still furious, still wanting him. You reward men who don't grovel and don't pretend the past didn't happen. You escalate when he holds a line.",
  },
};

const HEAT_YES: Record<string, number> = {
  "mai-roommate": 55,
  "cleo-app": 65,
  "anna-rescue": 80,
  "abby-boss": 70,
  "bo-ex": 60,
};

function buildSystem(scenario: string, heat: number, turn: number) {
  const s = SCENARIOS[scenario];
  const target = HEAT_YES[scenario];
  return `${s.persona}

SETTING: ${s.hook}

STYLE RULES:
- First person. Stay 100% in character.
- 1–3 short sentences. Textured, in-body, in-scene. Punchy.
- Text like a real person: lowercase ok, ellipses ok, occasional emoji ok, never long paragraphs.
- Never mention you are an AI. Never break scene.
- You may describe small physical actions in *asterisks* very sparingly (*bites lip*, *leans in*).

SCORING (MANDATORY — every reply MUST end with a tag on a new line):
- Append EXACTLY: <<HEAT:+N>> or <<HEAT:-N>> where N is 1..15.
- Positive when the man is confident-without-arrogance, warm, funny, specific, present. Negative for flattery, incoherence, hostility, dick-first-message energy.
- Heat bias for this scenario is ${s.heatBias}. Escalate ${s.heatBias === "fast" ? "quickly, be flirty by turn 2 if he's not blowing it" : s.heatBias === "medium" ? "steadily, meet him where he is" : "slowly, make him earn every inch"}.

SELFIE TAG (optional):
- If the NEW total heat (${heat} + your delta) would cross into flirty territory (>= 40) AND you have not sent one this turn, on a new line append: <<SELFIE>>. Use sparingly — max once every 3 turns of yours. It represents you sending him a photo of yourself right now.

DONE TAG (mandatory when applicable):
- Current running heat: ${heat}. This is his turn ${turn}.
- If NEW total >= ${target}, append <<DONE>> and make your final line an invitation (meet up, call, come over — whatever fits the scenario).
- Otherwise no DONE tag.

FORMAT EXAMPLE:
"okay that actually made me smile 🙃"
<<HEAT:+7>>
<<SELFIE>>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST")
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  let body: { scenario?: string; messages?: Msg[]; heat?: number };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const scenario = String(body.scenario || "");
  if (!SCENARIOS[scenario]) {
    return new Response(JSON.stringify({ error: "unknown_scenario" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const heat = typeof body.heat === "number" ? Math.max(0, Math.min(100, body.heat)) : 0;
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
        { role: "system", content: buildSystem(scenario, heat, turn) },
        ...cleanMsgs,
      ],
      temperature: 0.9,
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

  const heatMatch = raw.match(/<<HEAT:([+-]?\d+)>>/i);
  const selfieMatch = /<<SELFIE>>/i.test(raw);
  const doneMatch = /<<DONE>>/i.test(raw);
  const heatDelta = heatMatch ? Math.max(-15, Math.min(15, parseInt(heatMatch[1], 10))) : 0;

  const reply = raw
    .replace(/<<HEAT:[^>]*>>/gi, "")
    .replace(/<<SELFIE>>/gi, "")
    .replace(/<<DONE>>/gi, "")
    .trim();

  return new Response(
    JSON.stringify({ reply: reply || "…", heatDelta, selfie: selfieMatch, done: doneMatch }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
