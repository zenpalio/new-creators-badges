import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Drama = { id: string; title: string; logline: string | null; description: string | null; genre: string | null; tone: string | null; target_episode_seconds: number; aspect_ratio: string; status: string };
type Episode = { id: string; index: number; title: string; hook: string | null; synopsis: string | null; status: string };
type Scene = { id: string; order_index: number; shot_prompt: string | null; camera: string; duration_seconds: number; location_id: string | null; cast_ids: string[] | null; dialog: DialogLine[]; status: string };
type DialogLine = { cast_id: string; text: string; delivery?: string };

export default function DramaEditor() {
  const { id } = useParams<{ id: string }>();
  const [drama, setDrama] = useState<Drama | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  useEffect(() => { if (id) load(); }, [id]);

  async function load() {
    const [d, e] = await Promise.all([
      supabase.from("dramas").select("*").eq("id", id!).maybeSingle(),
      supabase.from("episodes").select("*").eq("drama_id", id!).order("index"),
    ]);
    if (d.data) { setDrama(d.data as Drama); document.title = `${(d.data as Drama).title} — Drama Studio`; }
    if (e.data) setEpisodes(e.data as Episode[]);
  }

  async function saveOverview(patch: Partial<Drama>) {
    if (!drama) return;
    const { error } = await supabase.from("dramas").update(patch).eq("id", drama.id);
    if (error) return toast.error(error.message);
    setDrama({ ...drama, ...patch });
    toast.success("Saved");
  }

  if (!drama) {
    return <div className="min-h-[100dvh] bg-black p-8 text-white/60">Loading…</div>;
  }

  return (
    <div className="min-h-[100dvh] bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <Link to="/studio" className="mb-4 inline-flex items-center gap-2 text-xs text-white/50 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to studio</Link>
        <header className="mb-8">
          <div className="text-[10px] uppercase tracking-[0.3em] text-white/40">{drama.status} · {drama.aspect_ratio} · {drama.target_episode_seconds}s per ep</div>
          <h1 className="mt-1 text-3xl font-black tracking-tight">{drama.title}</h1>
          {drama.logline && <p className="mt-2 text-sm text-white/60">{drama.logline}</p>}
        </header>

        <Tabs defaultValue="overview">
          <TabsList className="bg-white/[0.04] border border-white/10">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="episodes">Episodes ({episodes.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 max-w-2xl space-y-4">
            <OverviewField label="Title" value={drama.title} onSave={v => saveOverview({ title: v })} />
            <OverviewField label="Logline" value={drama.logline ?? ""} onSave={v => saveOverview({ logline: v })} textarea />
            <OverviewField label="Description" value={drama.description ?? ""} onSave={v => saveOverview({ description: v })} textarea />
            <div className="grid grid-cols-2 gap-4">
              <OverviewField label="Genre" value={drama.genre ?? ""} onSave={v => saveOverview({ genre: v })} />
              <OverviewField label="Tone" value={drama.tone ?? ""} onSave={v => saveOverview({ tone: v })} />
            </div>
          </TabsContent>

          <TabsContent value="episodes" className="mt-6">
            <EpisodesTab dramaId={drama.id} episodes={episodes} onChanged={load} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function OverviewField({ label, value, onSave, textarea }: { label: string; value: string; onSave: (v: string) => void; textarea?: boolean }) {
  const [v, setV] = useState(value);
  useEffect(() => setV(value), [value]);
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.2em] text-white/40">{label}</label>
      {textarea
        ? <Textarea value={v} onChange={e => setV(e.target.value)} onBlur={() => v !== value && onSave(v)} className="mt-1" />
        : <Input value={v} onChange={e => setV(e.target.value)} onBlur={() => v !== value && onSave(v)} className="mt-1" />}
    </div>
  );
}

function EpisodesTab({ dramaId, episodes, onChanged }: { dramaId: string; episodes: Episode[]; onChanged: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", hook: "", synopsis: "" });

  useEffect(() => { if (!selected && episodes[0]) setSelected(episodes[0].id); }, [episodes, selected]);

  async function create() {
    if (!form.title.trim()) return toast.error("Title required");
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;
    const nextIndex = (episodes[episodes.length - 1]?.index ?? 0) + 1;
    const { error, data } = await supabase.from("episodes").insert({
      user_id: user.user.id, drama_id: dramaId, index: nextIndex,
      title: form.title, hook: form.hook || null, synopsis: form.synopsis || null,
    }).select().single();
    if (error) return toast.error(error.message);
    toast.success("Episode added");
    setOpen(false);
    setForm({ title: "", hook: "", synopsis: "" });
    if (data) setSelected(data.id);
    onChanged();
  }

  async function remove(id: string) {
    if (!confirm("Delete this episode and all its scenes?")) return;
    const { error } = await supabase.from("episodes").delete().eq("id", id);
    if (error) return toast.error(error.message);
    if (selected === id) setSelected(null);
    onChanged();
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
      <aside>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">Episodes</div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button size="sm" variant="ghost"><Plus className="h-4 w-4" /></Button></DialogTrigger>
            <DialogContent className="bg-neutral-950 border-white/10 text-white">
              <DialogHeader><DialogTitle>New episode</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                <Input placeholder="Hook (one-line teaser)" value={form.hook} onChange={e => setForm({ ...form, hook: e.target.value })} />
                <Textarea placeholder="Synopsis / beat sheet" value={form.synopsis} onChange={e => setForm({ ...form, synopsis: e.target.value })} />
              </div>
              <DialogFooter><Button onClick={create}>Add episode</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-1">
          {episodes.map(ep => (
            <button key={ep.id} onClick={() => setSelected(ep.id)} className={`group w-full rounded-lg border px-3 py-2 text-left text-sm transition ${selected === ep.id ? "border-primary-v2 bg-primary-v2/10" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"}`}>
              <div className="flex items-center justify-between">
                <div className="text-[10px] text-white/40">EP {String(ep.index).padStart(2, "0")}</div>
                <button onClick={(e) => { e.stopPropagation(); remove(ep.id); }} className="opacity-0 group-hover:opacity-100"><Trash2 className="h-3 w-3 text-white/40 hover:text-red-400" /></button>
              </div>
              <div className="mt-0.5 truncate font-medium">{ep.title}</div>
            </button>
          ))}
          {episodes.length === 0 && <div className="rounded-lg border border-dashed border-white/10 p-4 text-center text-xs text-white/40">No episodes yet</div>}
        </div>
      </aside>

      <section>
        {selected ? <EpisodeDetail episodeId={selected} /> : <div className="rounded-2xl border border-dashed border-white/10 p-16 text-center text-sm text-white/40">Select or create an episode</div>}
      </section>
    </div>
  );
}

function EpisodeDetail({ episodeId }: { episodeId: string }) {
  const [ep, setEp] = useState<Episode | null>(null);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [cast, setCast] = useState<{ id: string; name: string }[]>([]);
  const [locs, setLocs] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => { load(); }, [episodeId]);

  async function load() {
    const [e, s, c, l] = await Promise.all([
      supabase.from("episodes").select("*").eq("id", episodeId).maybeSingle(),
      supabase.from("scenes").select("*").eq("episode_id", episodeId).order("order_index"),
      supabase.from("cast_members").select("id,name"),
      supabase.from("locations").select("id,name"),
    ]);
    if (e.data) setEp(e.data as Episode);
    if (s.data) setScenes(s.data as unknown as Scene[]);
    if (c.data) setCast(c.data as { id: string; name: string }[]);
    if (l.data) setLocs(l.data as { id: string; name: string }[]);
  }

  async function addScene() {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;
    const nextIndex = (scenes[scenes.length - 1]?.order_index ?? 0) + 1;
    const { error } = await supabase.from("scenes").insert({
      user_id: user.user.id, episode_id: episodeId, order_index: nextIndex, shot_prompt: "New scene", camera: "medium", duration_seconds: 6,
    });
    if (error) return toast.error(error.message);
    load();
  }

  async function updateScene(id: string, patch: Partial<Scene>) {
    const { error } = await supabase.from("scenes").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }

  async function removeScene(id: string) {
    if (!confirm("Delete this scene?")) return;
    await supabase.from("scenes").delete().eq("id", id);
    load();
  }

  if (!ep) return null;

  return (
    <div>
      <div className="mb-4">
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">EP {String(ep.index).padStart(2, "0")}</div>
        <h2 className="text-2xl font-bold">{ep.title}</h2>
        {ep.hook && <p className="mt-1 text-sm text-white/60">{ep.hook}</p>}
      </div>

      <div className="mb-3 flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">Scenes ({scenes.length})</div>
        <Button size="sm" onClick={addScene} className="bg-primary-v2 hover:bg-primary-v2/90"><Plus className="mr-1 h-3 w-3" /> Scene</Button>
      </div>

      <div className="space-y-3">
        {scenes.map(s => (
          <SceneRow key={s.id} scene={s} cast={cast} locs={locs} onChange={p => updateScene(s.id, p)} onDelete={() => removeScene(s.id)} />
        ))}
        {scenes.length === 0 && <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-xs text-white/40">No scenes yet — add your first shot.</div>}
      </div>
    </div>
  );
}

function SceneRow({ scene, cast, locs, onChange, onDelete }: { scene: Scene; cast: { id: string; name: string }[]; locs: { id: string; name: string }[]; onChange: (p: Partial<Scene>) => void; onDelete: () => void }) {
  const [prompt, setPrompt] = useState(scene.shot_prompt ?? "");
  const dialog: DialogLine[] = Array.isArray(scene.dialog) ? scene.dialog : [];

  function toggleCast(id: string) {
    const next = (scene.cast_ids ?? []).includes(id) ? (scene.cast_ids ?? []).filter(x => x !== id) : [...(scene.cast_ids ?? []), id];
    onChange({ cast_ids: next });
  }

  function addLine() {
    const first = (scene.cast_ids ?? [])[0];
    onChange({ dialog: [...dialog, { cast_id: first ?? "", text: "" }] });
  }

  function updateLine(i: number, patch: Partial<DialogLine>) {
    const next = dialog.map((l, idx) => idx === i ? { ...l, ...patch } : l);
    onChange({ dialog: next });
  }

  function removeLine(i: number) {
    onChange({ dialog: dialog.filter((_, idx) => idx !== i) });
  }

  return (
    <Card className="border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">Scene {scene.order_index}</div>
        <button onClick={onDelete}><Trash2 className="h-4 w-4 text-white/30 hover:text-red-400" /></button>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_140px_120px]">
        <Textarea placeholder="Shot description" value={prompt} onChange={e => setPrompt(e.target.value)} onBlur={() => prompt !== (scene.shot_prompt ?? "") && onChange({ shot_prompt: prompt })} className="min-h-[60px]" />
        <select className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm" value={scene.location_id ?? ""} onChange={e => onChange({ location_id: e.target.value || null })}>
          <option value="">— Location —</option>
          {locs.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <div className="flex gap-2">
          <select className="flex-1 rounded-md border border-white/10 bg-white/[0.03] px-2 py-2 text-xs" value={scene.camera} onChange={e => onChange({ camera: e.target.value })}>
            <option value="wide">Wide</option>
            <option value="medium">Medium</option>
            <option value="close">Close</option>
            <option value="pov">POV</option>
          </select>
          <input type="number" min={2} max={15} value={scene.duration_seconds} onChange={e => onChange({ duration_seconds: parseInt(e.target.value) || 6 })} className="w-14 rounded-md border border-white/10 bg-white/[0.03] px-2 py-2 text-xs" />
        </div>
      </div>

      <div className="mt-3">
        <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-white/40">Cast in shot</div>
        <div className="flex flex-wrap gap-1.5">
          {cast.map(c => {
            const on = (scene.cast_ids ?? []).includes(c.id);
            return <button key={c.id} onClick={() => toggleCast(c.id)} className={`rounded-full border px-3 py-1 text-xs ${on ? "border-primary-v2 bg-primary-v2/20 text-white" : "border-white/10 text-white/50 hover:bg-white/5"}`}>{c.name}</button>;
          })}
          {cast.length === 0 && <span className="text-xs text-white/40">Add cast members from the Cast tab first.</span>}
        </div>
      </div>

      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">Dialog</div>
          <button onClick={addLine} className="text-[10px] text-primary-v2 hover:underline">+ line</button>
        </div>
        <div className="space-y-1.5">
          {dialog.map((l, i) => (
            <div key={i} className="flex gap-2">
              <select className="w-28 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1.5 text-xs" value={l.cast_id} onChange={e => updateLine(i, { cast_id: e.target.value })}>
                <option value="">who?</option>
                {cast.filter(c => (scene.cast_ids ?? []).includes(c.id)).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input value={l.text} onChange={e => updateLine(i, { text: e.target.value })} placeholder="line…" className="flex-1 rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm" />
              <input value={l.delivery ?? ""} onChange={e => updateLine(i, { delivery: e.target.value })} placeholder="delivery" className="w-24 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1.5 text-xs" />
              <button onClick={() => removeLine(i)}><Trash2 className="h-4 w-4 text-white/30 hover:text-red-400" /></button>
            </div>
          ))}
          {dialog.length === 0 && <div className="text-xs text-white/30">No dialog yet.</div>}
        </div>
      </div>
    </Card>
  );
}
