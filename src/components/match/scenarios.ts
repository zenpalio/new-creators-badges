import maiPortrait from "@/assets/chars/mai.png.asset.json";
import cleoPortrait from "@/assets/chars/cleo.png.asset.json";
import annaPortrait from "@/assets/chars/anna.png.asset.json";
import abbyPortrait from "@/assets/chars/abby.png.asset.json";
import boPortrait from "@/assets/chars/bo.png.asset.json";
import maiHero from "@/assets/vn/h7-s02-mai-tour.jpg.asset.json";
import cleoBg from "@/assets/saga-chat-cleo.jpg.asset.json";
import cleoWarm from "@/assets/saga-chat-cleo-warm.jpg.asset.json";
import cleoWin from "@/assets/saga-chat-cleo-win.jpg.asset.json";
import annaBg from "@/assets/saga-chat-anna.jpg.asset.json";
import annaWarm from "@/assets/saga-chat-anna-warm.jpg.asset.json";
import annaWin from "@/assets/saga-chat-anna-win.jpg.asset.json";
import abbyBg from "@/assets/saga-chat-abby.jpg.asset.json";
import abbyWarm from "@/assets/saga-chat-abby-warm.jpg.asset.json";
import abbyWin from "@/assets/saga-chat-abby-win.jpg.asset.json";
import boBg from "@/assets/saga-chat-bo.jpg.asset.json";
import boWarm from "@/assets/saga-chat-bo-warm.jpg.asset.json";
import boWin from "@/assets/saga-chat-bo-win.jpg.asset.json";

export type ScenarioId =
  | "mai-roommate"
  | "cleo-app"
  | "anna-rescue"
  | "abby-boss"
  | "bo-ex";

export type Scenario = {
  id: ScenarioId;
  name: string;
  age: number;
  tag: string;
  hook: string;
  opener: string;
  portrait: string;
  hero: string;
  heat: string[]; // [cold, warm, hot]
  accent: string; // hex color for match flash
};

export const SCENARIOS: Scenario[] = [
  {
    id: "mai-roommate",
    name: "Mai",
    age: 22,
    tag: "Your new roommate",
    hook: "first night · she 'accidentally' walked in",
    opener: "hey…sorry. i thought this was my room 🙈 you unpacking?",
    portrait: maiPortrait.url,
    hero: maiHero.url,
    heat: [maiHero.url, maiHero.url, maiHero.url],
    accent: "#f472b6",
  },
  {
    id: "cleo-app",
    name: "Cleo",
    age: 24,
    tag: "Matched on Sparks",
    hook: "she messaged first · 11:42pm",
    opener: "ok your bio genuinely made me laugh. dangerous move.",
    portrait: cleoPortrait.url,
    hero: cleoBg.url,
    heat: [cleoBg.url, cleoWarm.url, cleoWin.url],
    accent: "#a78bfa",
  },
  {
    id: "anna-rescue",
    name: "Anna",
    age: 27,
    tag: "The stranger who saved you",
    hook: "her cabin · no signal · storm outside",
    opener: "you're awake. drink this. don't talk yet — just nod if it hurts.",
    portrait: annaPortrait.url,
    hero: annaBg.url,
    heat: [annaBg.url, annaWarm.url, annaWin.url],
    accent: "#fb923c",
  },
  {
    id: "abby-boss",
    name: "Abby",
    age: 25,
    tag: "The boss's daughter",
    hook: "office party · after hours · she cornered you",
    opener: "so. you're the one everyone's scared of my dad hiring. cute.",
    portrait: abbyPortrait.url,
    hero: abbyBg.url,
    heat: [abbyBg.url, abbyWarm.url, abbyWin.url],
    accent: "#facc15",
  },
  {
    id: "bo-ex",
    name: "Bo",
    age: 26,
    tag: "Your ex",
    hook: "1:47am · 'you up?'",
    opener: "you up?",
    portrait: boPortrait.url,
    hero: boBg.url,
    heat: [boBg.url, boWarm.url, boWin.url],
    accent: "#f43f5e",
  },
];

export const scenarioById = (id: ScenarioId) =>
  SCENARIOS.find((s) => s.id === id)!;
