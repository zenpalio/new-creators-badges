import { useState, type ReactNode } from "react";
import { X, Heart, Film, BookOpen } from "lucide-react";
import StatsPanel from "@/components/mina/StatsPanel";
import type { CompanionState } from "@/hooks/useCompanion";

type TabId = "vitals" | "episodes" | "lore";

const TABS: { id: TabId; label: string; icon: typeof Heart }[] = [
  { id: "vitals", label: "Vitals", icon: Heart },
  { id: "episodes", label: "Episodes", icon: Film },
  { id: "lore", label: "Lore", icon: BookOpen },
];

const EPISODES = [
  { id: "s1e1", code: "S1 · E1", title: "Ashes on the Shore", status: "current" as const },
  { id: "s1e2", code: "S1 · E2", title: "The Long Walk North", status: "locked" as const },
  { id: "s1e3", code: "S1 · E3", title: "Iron and Salt", status: "locked" as const },
  { id: "s1e4", code: "S1 · E4", title: "Names Remembered", status: "locked" as const },
];

interface Props {
  open: boolean;
  onClose: () => void;
  state: CompanionState;
  tier: number;
  affectionPulse: "up" | "down" | null;
  pulseTrigger: number;
  pulseDeltas: Record<string, number> | undefined;
}

const SagaSidebar = ({
  open,
  onClose,
  state,
  tier,
  affectionPulse,
  pulseTrigger,
  pulseDeltas,
}: Props) => {
  const [tab, setTab] = useState<TabId>("vitals");

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 z-40 bg-black/55 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`absolute top-0 left-0 bottom-0 z-50 w-[82%] max-w-[320px] bg-[hsl(220_25%_6%)]/95 backdrop-blur-2xl border-r border-white/10 shadow-[8px_0_40px_rgba(0,0,0,0.6)] flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b border-white/5">
          <div>
            <div className="text-[9px] uppercase tracking-[0.3em] text-white/45">
              Saga
            </div>
            <div className="text-[14px] font-semibold tracking-tight text-white/95">
              S1 · E1 · Ashes
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/[0.12] transition"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-3 pt-3 flex gap-1.5">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 h-9 rounded-lg flex items-center justify-center gap-1.5 text-[11px] font-medium tracking-wide transition border ${
                  active
                    ? "bg-white text-[hsl(220_25%_8%)] border-white"
                    : "bg-white/[0.04] text-white/70 border-white/10 hover:bg-white/[0.08]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          {tab === "vitals" && (
            <StatsPanel
              stats={state.stats}
              affection={state.affection}
              tier={tier}
              affectionPulse={affectionPulse}
              pulseTrigger={pulseTrigger}
              pulseDeltas={pulseDeltas as any}
            />
          )}

          {tab === "episodes" && (
            <div className="flex flex-col gap-2">
              {EPISODES.map((ep) => (
                <div
                  key={ep.id}
                  className={`px-3 py-3 rounded-xl border transition ${
                    ep.status === "current"
                      ? "bg-white/[0.08] border-white/20"
                      : "bg-white/[0.02] border-white/5 opacity-60"
                  }`}
                >
                  <div className="text-[9px] uppercase tracking-[0.25em] text-white/45">
                    {ep.code}
                  </div>
                  <div className="text-[13px] font-semibold text-white/90 mt-0.5">
                    {ep.title}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-white/40 mt-1">
                    {ep.status === "current" ? "In progress" : "Locked"}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "lore" && (
            <LoreEntry
              title="The Burning Hall"
              body="The longships came at first light. Your father's hall — Eikenholm, built by his father's father — burned before the sun was full in the sky. You watched from the treeline. You did not scream. You remembered faces."
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/40">
          <span>Chapter 1 / 8</span>
          <span>{state.tokens_balance ?? 0} tokens</span>
        </div>
      </aside>
    </>
  );
};

const LoreEntry = ({ title, body }: { title: string; body: ReactNode }) => (
  <div className="px-3 py-3 rounded-xl bg-white/[0.04] border border-white/10">
    <div className="text-[10px] uppercase tracking-[0.25em] text-amber-200/70 mb-1.5">
      {title}
    </div>
    <p className="text-[13px] leading-relaxed text-white/80 italic font-serif">
      {body}
    </p>
  </div>
);

export default SagaSidebar;
