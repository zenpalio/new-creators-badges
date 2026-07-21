import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send, Sparkles, Loader2, Check, Wand2, Users, MapPin, Film, Clapperboard } from "lucide-react";
import { toast } from "sonner";

type Drama = { id: string; title: string; logline: string | null; description: string | null; genre: string | null; tone: string | null; target_episode_seconds: number; aspect_ratio: string; status: string };
type ChatMsg = { role: "user" | "assistant"; content: string; proposals?: Proposal[] };
type Proposal =
  | { type: "concept"; title?: string; logline?: string; description?: string; genre?: string; tone?: string }
  | { type: "cast"; options: { name: string; role: string; personality?: string; portrait_prompt: string }[] }
  | { type: "locations"; options: { name: string; description?: string; mood_tags?: string[]; image_prompt?: string }[] }
  | { type: "episodes"; options: { index: number; title: string; hook?: string; synopsis?: string }[] }
  | { type: "scenes"; episode_index: number; options: { order_index: number; shot_prompt: string; camera: string; duration_seconds: number; cast_names?: string[]; location_name?: string; dialog?: { cast_name: string; text: string; delivery?: string }[] }[] };

export default function DramaShowrunner() {
  const { id } = useParams<{ id: string }>();
  const [drama, setDrama] = useState<Drama | null>(null);
  const [cast, setCast] = useState<{ id: string; name: string; preview_url: string | null }[]>([]);
  const [locs, setLocs] = useState<{ id: string; name: string }[]>([]);
  const [episodes, setEpisodes] = useState<{ id: string; index: number; title: string }[]>([]);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (id) refresh(); }, [id]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, busy]);

  async function refresh() {
    const [d, c, l, e] = await Promise.all([
      supabase.from("dramas").select("*").eq("id", id!).maybeSingle(),
      supabase.from("cast_members").select("id,name,preview_url").order("created_at"),
      supabase.from("locations").select("id,name").order("created_at"),
      supabase.from("episodes").select("id,index,title").eq("drama_id", id!).order("index"),
    ]);
    if (d.data) { setDrama(d.data as Drama); document.title = `${(d.data as Drama).title} — Showrunner`; }
    if (c.data) setCast(c.data as any);
    if (l.data) setLocs(l.data as any);
    if (e.data) setEpisodes(e.data as any);
    if (d.data && messages.length === 0) {
      // kickoff
      send("", true);
    }
  }

  async function send(text: string, kickoff = false) {
    if (busy || !id) return;
    const next: ChatMsg[] = kickoff
      ? [...messages]
      : [...messages, { role: "user", content: text }];
    if (!kickoff) setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/studio-showrunner`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({
          drama_id: id,
          messages: kickoff
            ? [{ role: "user", content: "Let's begin. Take a look at where we are and suggest the next step." }]
            : next.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (data.error) { toast.error(data.error); return; }
      setMessages(prev => [...(kickoff ? prev : next), { role: "assistant", content: data.reply ?? "", proposals: data.proposals ?? [] }]);
    } catch (e: any) {
      toast.error(e.message ?? "Chat failed");
    } finally { setBusy(false); }
  }

  async function applyConcept(p: Extract<Proposal, { type: "concept" }>) {
    const patch: any = {};
    if (p.title) patch.title = p.title;
    if (p.logline) patch.logline = p.logline;
    if (p.description) patch.description = p.description;
    if (p.genre) patch.genre = p.genre;
    if (p.tone) patch.tone = p.tone;
    const { error } = await supabase.from("dramas").update(patch).eq("id", id!);
    if (error) return toast.error(error.message);
    toast.success("Concept applied");
    refresh();
  }

  async function generateCast(opt: { name: string; role: string; personality?: string; portrait_prompt: string }) {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/studio-generate-portrait`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
      body: JSON.stringify(opt),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data;
  }

  async function addLocation(opt: { name: string; description?: string; mood_tags?: string[] }) {
    const { error } = await supabase.from("locations").insert({
      name: opt.name, description: opt.description ?? null, mood_tags: opt.mood_tags ?? [],
    });
    if (error) throw new Error(error.message);
  }

  async function addEpisodes(opts: { index: number; title: string; hook?: string; synopsis?: string }[]) {
    const startIndex = (episodes[episodes.length - 1]?.index ?? 0) + 1;
    const rows = opts.map((e, i) => ({
      drama_id: id!, index: startIndex + i,
      title: e.title, hook: e.hook ?? null, synopsis: e.synopsis ?? null,
    }));
    const { error } = await supabase.from("episodes").insert(rows);
    if (error) throw new Error(error.message);
  }

  async function addScenes(episode_index: number, opts: any[]) {
    const ep = episodes.find(e => e.index === episode_index);
    if (!ep) throw new Error(`Episode ${episode_index} not found`);
    const rows = opts.map(s => ({
      episode_id: ep.id,
      order_index: s.order_index,
      shot_prompt: s.shot_prompt,
      camera: s.camera ?? "medium",
      duration_seconds: s.duration_seconds ?? 6,
      cast_ids: (s.cast_names ?? []).map((n: string) => cast.find(c => c.name.toLowerCase() === n.toLowerCase())?.id).filter(Boolean),
      location_id: opts && s.location_name ? locs.find(l => l.name.toLowerCase() === s.location_name.toLowerCase())?.id ?? null : null,
      dialog: (s.dialog ?? []).map((d: any) => ({
        cast_id: cast.find(c => c.name.toLowerCase() === d.cast_name?.toLowerCase())?.id ?? "",
        text: d.text, delivery: d.delivery,
      })),
    }));
    const { error } = await supabase.from("scenes").insert(rows);
    if (error) throw new Error(error.message);
  }

  if (!drama) return <div className="min-h-[100dvh] bg-black p-8 text-white/60">Loading…</div>;

  return (
    <div className="min-h-[100dvh] bg-black text-white">
      <div className="mx-auto grid h-[100dvh] max-w-7xl grid-cols-1 lg:grid-cols-[1fr_320px]">
        {/* CHAT */}
        <div className="flex h-[100dvh] flex-col">
          <header className="border-b border-white/10 px-6 py-4">
            <Link to="/studio" className="mb-1 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white"><ArrowLeft className="h-3 w-3" /> Studio</Link>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary-v2" />
              <h1 className="text-lg font-bold">{drama.title}</h1>
              <span className="text-[10px] uppercase tracking-widest text-white/40">showrunner</span>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
            <div className="mx-auto max-w-2xl space-y-6">
              {messages.length === 0 && !busy && (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-white/40">
                  Loading your showrunner…
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i}>
                  {m.role === "user" ? (
                    <div className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary-v2 px-4 py-2.5 text-sm text-primary-v2-foreground">{m.content}</div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {m.content && <div className="text-[15px] leading-relaxed text-white/85">{m.content}</div>}
                      {(m.proposals ?? []).map((p, j) => (
                        <ProposalCard key={j} p={p} cast={cast} locs={locs} episodes={episodes}
                          onApplyConcept={applyConcept}
                          onGenerateCast={generateCast}
                          onAddLocation={addLocation}
                          onAddEpisodes={addEpisodes}
                          onAddScenes={addScenes}
                          onDone={refresh} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {busy && <div className="flex items-center gap-2 text-sm text-white/40"><Loader2 className="h-4 w-4 animate-spin" /> Thinking…</div>}
            </div>
          </div>

          <div className="border-t border-white/10 bg-black px-6 py-4">
            <div className="mx-auto flex max-w-2xl gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && input.trim()) send(input.trim()); }}
                placeholder="Tell the showrunner what you want next…"
                className="flex-1 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm outline-none focus:border-primary-v2"
              />
              <Button onClick={() => input.trim() && send(input.trim())} disabled={busy || !input.trim()} className="rounded-full bg-primary-v2 hover:bg-primary-v2/90">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="hidden border-l border-white/10 bg-white/[0.02] p-5 lg:block overflow-y-auto">
          <SidebarSection icon={<Sparkles className="h-3.5 w-3.5" />} label="Concept">
            <div className="text-sm">{drama.logline || <span className="text-white/30">not defined yet</span>}</div>
            {drama.genre && <div className="mt-1 text-[10px] uppercase tracking-widest text-white/40">{drama.genre} · {drama.tone}</div>}
          </SidebarSection>

          <SidebarSection icon={<Users className="h-3.5 w-3.5" />} label={`Cast (${cast.length})`}>
            {cast.length === 0 ? <div className="text-xs text-white/30">no cast yet</div> : (
              <div className="grid grid-cols-3 gap-1.5">
                {cast.map(c => (
                  <div key={c.id} className="overflow-hidden rounded-md border border-white/10 bg-white/5">
                    <div className="aspect-square bg-white/5">
                      {c.preview_url && <img src={c.preview_url} alt={c.name} className="h-full w-full object-cover" />}
                    </div>
                    <div className="truncate px-1.5 py-1 text-[10px]">{c.name}</div>
                  </div>
                ))}
              </div>
            )}
          </SidebarSection>

          <SidebarSection icon={<MapPin className="h-3.5 w-3.5" />} label={`Locations (${locs.length})`}>
            {locs.length === 0 ? <div className="text-xs text-white/30">no locations yet</div> : (
              <div className="space-y-1">{locs.map(l => <div key={l.id} className="text-xs text-white/70">· {l.name}</div>)}</div>
            )}
          </SidebarSection>

          <SidebarSection icon={<Film className="h-3.5 w-3.5" />} label={`Episodes (${episodes.length})`}>
            {episodes.length === 0 ? <div className="text-xs text-white/30">no episodes yet</div> : (
              <div className="space-y-1">{episodes.map(e => <div key={e.id} className="text-xs text-white/70">EP{String(e.index).padStart(2, "0")} · {e.title}</div>)}</div>
            )}
            {episodes.length > 0 && (
              <Link to={`/studio/drama/${id}/legacy`} className="mt-2 inline-block text-[10px] uppercase tracking-widest text-primary-v2 hover:underline">Open scene editor →</Link>
            )}
          </SidebarSection>
        </aside>
      </div>
    </div>
  );
}

function SidebarSection({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-white/40">{icon} {label}</div>
      {children}
    </div>
  );
}

function ProposalCard({ p, cast, locs, episodes, onApplyConcept, onGenerateCast, onAddLocation, onAddEpisodes, onAddScenes, onDone }: {
  p: Proposal;
  cast: { id: string; name: string; preview_url: string | null }[];
  locs: { id: string; name: string }[];
  episodes: { id: string; index: number; title: string }[];
  onApplyConcept: (p: any) => Promise<void>;
  onGenerateCast: (o: any) => Promise<any>;
  onAddLocation: (o: any) => Promise<void>;
  onAddEpisodes: (o: any[]) => Promise<void>;
  onAddScenes: (idx: number, o: any[]) => Promise<void>;
  onDone: () => void;
}) {
  if (p.type === "concept") {
    return (
      <Card className="border-primary-v2/30 bg-primary-v2/5 p-4">
        <Badge icon={<Sparkles className="h-3 w-3" />} label="Concept" />
        {p.title && <div className="mt-2 text-lg font-bold">{p.title}</div>}
        {p.logline && <div className="mt-1 text-sm italic text-white/80">"{p.logline}"</div>}
        {p.description && <div className="mt-2 text-sm text-white/70">{p.description}</div>}
        <div className="mt-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-widest text-white/40">
          {p.genre && <span>{p.genre}</span>}{p.tone && <span>· {p.tone}</span>}
        </div>
        <ActionBtn onClick={() => onApplyConcept(p).then(onDone)}>Apply concept</ActionBtn>
      </Card>
    );
  }
  if (p.type === "cast") {
    return (
      <Card className="border-white/10 bg-white/[0.03] p-4">
        <Badge icon={<Users className="h-3 w-3" />} label="Cast suggestions" />
        <div className="mt-3 space-y-3">
          {p.options.map((o, i) => <CastOptionRow key={i} opt={o} onGenerate={onGenerateCast} onDone={onDone} />)}
        </div>
      </Card>
    );
  }
  if (p.type === "locations") {
    return (
      <Card className="border-white/10 bg-white/[0.03] p-4">
        <Badge icon={<MapPin className="h-3 w-3" />} label="Locations" />
        <div className="mt-3 space-y-2">
          {p.options.map((o, i) => (
            <div key={i} className="flex items-start justify-between gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <div>
                <div className="font-semibold">{o.name}</div>
                {o.description && <div className="mt-0.5 text-xs text-white/60">{o.description}</div>}
                {o.mood_tags && <div className="mt-1 flex flex-wrap gap-1">{o.mood_tags.map(t => <span key={t} className="rounded-full border border-white/10 px-2 py-0.5 text-[9px] uppercase tracking-widest text-white/50">{t}</span>)}</div>}
              </div>
              <SmallBtn onClick={async () => { try { await onAddLocation(o); toast.success(`Added ${o.name}`); onDone(); } catch (e: any) { toast.error(e.message); } }}>Add</SmallBtn>
            </div>
          ))}
        </div>
      </Card>
    );
  }
  if (p.type === "episodes") {
    return (
      <Card className="border-white/10 bg-white/[0.03] p-4">
        <Badge icon={<Film className="h-3 w-3" />} label={`${p.options.length} episodes`} />
        <div className="mt-3 space-y-2">
          {p.options.map((e, i) => (
            <div key={i} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <div className="text-[10px] uppercase tracking-widest text-white/40">EP {String(e.index).padStart(2, "0")}</div>
              <div className="font-semibold">{e.title}</div>
              {e.hook && <div className="mt-1 text-xs italic text-white/60">{e.hook}</div>}
              {e.synopsis && <div className="mt-1 text-xs text-white/50">{e.synopsis}</div>}
            </div>
          ))}
        </div>
        <ActionBtn onClick={async () => { try { await onAddEpisodes(p.options); toast.success(`Added ${p.options.length} episodes`); onDone(); } catch (e: any) { toast.error(e.message); } }}>Add all episodes</ActionBtn>
      </Card>
    );
  }
  if (p.type === "scenes") {
    const ep = episodes.find(e => e.index === p.episode_index);
    return (
      <Card className="border-white/10 bg-white/[0.03] p-4">
        <Badge icon={<Clapperboard className="h-3 w-3" />} label={`${p.options.length} scenes · EP${p.episode_index}`} />
        <div className="mt-3 space-y-2">
          {p.options.map((s, i) => (
            <div key={i} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <div className="text-[10px] uppercase tracking-widest text-white/40">SCENE {s.order_index} · {s.camera} · {s.duration_seconds}s</div>
              <div className="mt-1 text-xs text-white/70">{s.shot_prompt}</div>
              {s.cast_names?.length ? <div className="mt-1 text-[10px] text-white/40">Cast: {s.cast_names.join(", ")}</div> : null}
              {s.location_name && <div className="text-[10px] text-white/40">Loc: {s.location_name}</div>}
              {s.dialog?.length ? (
                <div className="mt-2 space-y-0.5">{s.dialog.map((d: any, k: number) => <div key={k} className="text-xs"><span className="text-white/50">{d.cast_name}:</span> <span className="text-white/80">"{d.text}"</span></div>)}</div>
              ) : null}
            </div>
          ))}
        </div>
        {ep ? (
          <ActionBtn onClick={async () => { try { await onAddScenes(p.episode_index, p.options); toast.success(`Added ${p.options.length} scenes to EP${p.episode_index}`); onDone(); } catch (e: any) { toast.error(e.message); } }}>Add scenes to EP{p.episode_index}</ActionBtn>
        ) : (
          <div className="mt-3 text-[11px] text-amber-400/80">Add EP{p.episode_index} first, then re-run this proposal.</div>
        )}
      </Card>
    );
  }
  return null;
}

function CastOptionRow({ opt, onGenerate, onDone }: { opt: { name: string; role: string; personality?: string; portrait_prompt: string }; onGenerate: (o: any) => Promise<any>; onDone: () => void }) {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">{opt.name} <span className="ml-1 text-[10px] uppercase tracking-widest text-white/40">{opt.role}</span></div>
          {opt.personality && <div className="mt-0.5 text-xs text-white/60">{opt.personality}</div>}
        </div>
        {state === "done" ? (
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400"><Check className="h-3 w-3" /> saved</span>
        ) : (
          <SmallBtn
            disabled={state === "busy"}
            onClick={async () => {
              setState("busy");
              try { await onGenerate(opt); toast.success(`Generated ${opt.name}`); setState("done"); onDone(); }
              catch (e: any) { toast.error(e.message); setState("idle"); }
            }}
          >
            {state === "busy" ? <><Loader2 className="mr-1 h-3 w-3 animate-spin" /> Generating…</> : <><Wand2 className="mr-1 h-3 w-3" /> Generate</>}
          </SmallBtn>
        )}
      </div>
      <div className="mt-2 rounded bg-black/40 px-2 py-1.5 text-[10px] text-white/40">{opt.portrait_prompt}</div>
    </div>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-white/60">{icon} {label}</div>;
}
function ActionBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return <Button size="sm" onClick={onClick} className="mt-3 bg-primary-v2 hover:bg-primary-v2/90">{children}</Button>;
}
function SmallBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return <Button size="sm" variant="outline" onClick={onClick} disabled={disabled} className="border-white/20 bg-white/5 hover:bg-white/10">{children}</Button>;
}
