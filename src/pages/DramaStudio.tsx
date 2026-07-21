import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Film, Users, MapPin } from "lucide-react";
import { toast } from "sonner";

type Drama = { id: string; title: string; logline: string | null; genre: string | null; status: string; poster_url: string | null; aspect_ratio: string; target_episode_seconds: number; updated_at: string };
type Cast = { id: string; name: string; role: string; element_id: string | null; preview_url: string | null; voice_id: string | null; personality: string | null };
type Loc = { id: string; name: string; description: string | null; element_id: string | null; preview_url: string | null; mood_tags: string[] | null };

export default function DramaStudio() {
  const [dramas, setDramas] = useState<Drama[]>([]);
  const [cast, setCast] = useState<Cast[]>([]);
  const [locs, setLocs] = useState<Loc[]>([]);
  const [tab, setTab] = useState("dramas");

  useEffect(() => { document.title = "Drama Studio"; refresh(); }, []);

  async function refresh() {
    const [d, c, l] = await Promise.all([
      supabase.from("dramas").select("*").order("updated_at", { ascending: false }),
      supabase.from("cast_members").select("*").order("created_at", { ascending: false }),
      supabase.from("locations").select("*").order("created_at", { ascending: false }),
    ]);
    if (d.data) setDramas(d.data as Drama[]);
    if (c.data) setCast(c.data as Cast[]);
    if (l.data) setLocs(l.data as Loc[]);
  }

  return (
    <div className="min-h-[100dvh] bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <header className="mb-8 flex items-end justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/40">Production</div>
            <h1 className="mt-1 text-3xl font-black tracking-tight">Drama Studio</h1>
            <p className="mt-2 text-sm text-white/60">Build vertical drama series — cast, locations, episodes, scenes.</p>
          </div>
        </header>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-white/[0.04] border border-white/10">
            <TabsTrigger value="dramas"><Film className="mr-2 h-4 w-4" /> Dramas</TabsTrigger>
            <TabsTrigger value="cast"><Users className="mr-2 h-4 w-4" /> Cast</TabsTrigger>
            <TabsTrigger value="locations"><MapPin className="mr-2 h-4 w-4" /> Locations</TabsTrigger>
          </TabsList>

          <TabsContent value="dramas" className="mt-6">
            <DramasTab dramas={dramas} onCreated={refresh} />
          </TabsContent>
          <TabsContent value="cast" className="mt-6">
            <CastTab cast={cast} onChanged={refresh} />
          </TabsContent>
          <TabsContent value="locations" className="mt-6">
            <LocationsTab locs={locs} onChanged={refresh} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function DramasTab({ dramas, onCreated }: { dramas: Drama[]; onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", logline: "", genre: "", target_episode_seconds: 75 });

  async function create() {
    if (!form.title.trim()) return toast.error("Title required");
    const { error } = await supabase.from("dramas").insert({
      title: form.title,
      logline: form.logline || null,
      genre: form.genre || null,
      target_episode_seconds: form.target_episode_seconds,
    });
    if (error) return toast.error(error.message);
    toast.success("Drama created");
    setOpen(false);
    setForm({ title: "", logline: "", genre: "", target_episode_seconds: 75 });
    onCreated();
  }


  return (
    <>
      <div className="mb-4 flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary-v2 hover:bg-primary-v2/90"><Plus className="mr-2 h-4 w-4" /> New drama</Button>
          </DialogTrigger>
          <DialogContent className="bg-neutral-950 border-white/10 text-white">
            <DialogHeader><DialogTitle>New drama</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <Textarea placeholder="One-line logline" value={form.logline} onChange={e => setForm({ ...form, logline: e.target.value })} />
              <Input placeholder="Genre (romance, thriller…)" value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} />
              <div>
                <label className="text-xs text-white/60">Target episode length (seconds)</label>
                <Input type="number" min={30} max={180} value={form.target_episode_seconds} onChange={e => setForm({ ...form, target_episode_seconds: parseInt(e.target.value) || 75 })} />
              </div>
            </div>
            <DialogFooter><Button onClick={create}>Create</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {dramas.length === 0 ? (
        <EmptyState icon={<Film className="h-8 w-8" />} title="No dramas yet" hint="Create your first show to start building episodes and scenes." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dramas.map(d => (
            <Link key={d.id} to={`/studio/drama/${d.id}`}>
              <Card className="group overflow-hidden border-white/10 bg-white/[0.03] transition hover:bg-white/[0.06]">
                <div className="aspect-[9/12] w-full bg-gradient-to-br from-white/5 to-white/[0.02]">
                  {d.poster_url && <img src={d.poster_url} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40">
                    <span>{d.status}</span>·<span>{d.aspect_ratio}</span>·<span>{d.target_episode_seconds}s</span>
                  </div>
                  <div className="mt-1 text-lg font-bold">{d.title}</div>
                  {d.logline && <div className="mt-1 line-clamp-2 text-sm text-white/60">{d.logline}</div>}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

function CastTab({ cast, onChanged }: { cast: Cast[]; onChanged: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", role: "supporting", element_id: "", preview_url: "", voice_id: "", personality: "" });

  async function save() {
    if (!form.name.trim()) return toast.error("Name required");
    const { error } = await supabase.from("cast_members").insert({ ...form, element_id: form.element_id || null, preview_url: form.preview_url || null, voice_id: form.voice_id || null, personality: form.personality || null });
    if (error) return toast.error(error.message);
    toast.success("Cast member added");
    setOpen(false);
    setForm({ name: "", role: "supporting", element_id: "", preview_url: "", voice_id: "", personality: "" });
    onChanged();
  }


  async function remove(id: string) {
    if (!confirm("Delete this cast member?")) return;
    const { error } = await supabase.from("cast_members").delete().eq("id", id);
    if (error) return toast.error(error.message);
    onChanged();
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-white/60">Workspace-wide. Reuse the same faces across every drama.</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="bg-primary-v2 hover:bg-primary-v2/90"><Plus className="mr-2 h-4 w-4" /> New cast</Button></DialogTrigger>
          <DialogContent className="bg-neutral-950 border-white/10 text-white">
            <DialogHeader><DialogTitle>Add cast member</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Name (e.g. Mai)" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <select className="w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="lead">Lead</option>
                <option value="supporting">Supporting</option>
                <option value="cameo">Cameo</option>
              </select>
              <Input placeholder="Higgsfield element_id (locked reference)" value={form.element_id} onChange={e => setForm({ ...form, element_id: e.target.value })} />
              <Input placeholder="Preview image URL" value={form.preview_url} onChange={e => setForm({ ...form, preview_url: e.target.value })} />
              <Input placeholder="ElevenLabs voice_id" value={form.voice_id} onChange={e => setForm({ ...form, voice_id: e.target.value })} />
              <Textarea placeholder="Personality & tone notes" value={form.personality} onChange={e => setForm({ ...form, personality: e.target.value })} />
            </div>
            <DialogFooter><Button onClick={save}>Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {cast.length === 0 ? (
        <EmptyState icon={<Users className="h-8 w-8" />} title="No cast yet" hint="Add characters with locked reference elements so they stay consistent across scenes." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {cast.map(c => <CastCard key={c.id} c={c} onChanged={onChanged} onDelete={() => remove(c.id)} />)}
        </div>
      )}
    </>
  );
}

function LocationsTab({ locs, onChanged }: { locs: Loc[]; onChanged: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", element_id: "", preview_url: "", mood_tags: "" });

  async function save() {
    if (!form.name.trim()) return toast.error("Name required");
    const { error } = await supabase.from("locations").insert({
      name: form.name,
      description: form.description || null,
      element_id: form.element_id || null,
      preview_url: form.preview_url || null,
      mood_tags: form.mood_tags ? form.mood_tags.split(",").map(s => s.trim()).filter(Boolean) : [],
    });
    if (error) return toast.error(error.message);
    toast.success("Location added");
    setOpen(false);
    setForm({ name: "", description: "", element_id: "", preview_url: "", mood_tags: "" });
    onChanged();
  }


  async function remove(id: string) {
    if (!confirm("Delete this location?")) return;
    const { error } = await supabase.from("locations").delete().eq("id", id);
    if (error) return toast.error(error.message);
    onChanged();
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-white/60">Reusable backgrounds and settings for every scene.</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="bg-primary-v2 hover:bg-primary-v2/90"><Plus className="mr-2 h-4 w-4" /> New location</Button></DialogTrigger>
          <DialogContent className="bg-neutral-950 border-white/10 text-white">
            <DialogHeader><DialogTitle>Add location</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Name (e.g. Neon rooftop)" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <Textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <Input placeholder="Higgsfield element_id (optional)" value={form.element_id} onChange={e => setForm({ ...form, element_id: e.target.value })} />
              <Input placeholder="Preview image URL" value={form.preview_url} onChange={e => setForm({ ...form, preview_url: e.target.value })} />
              <Input placeholder="Mood tags, comma separated (night, rain, neon)" value={form.mood_tags} onChange={e => setForm({ ...form, mood_tags: e.target.value })} />
            </div>
            <DialogFooter><Button onClick={save}>Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {locs.length === 0 ? (
        <EmptyState icon={<MapPin className="h-8 w-8" />} title="No locations yet" hint="Add reusable backgrounds — apartments, streets, alleys, offices." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {locs.map(l => (
            <Card key={l.id} className="overflow-hidden border-white/10 bg-white/[0.03]">
              <div className="aspect-video bg-white/5">
                {l.preview_url && <img src={l.preview_url} alt={l.name} className="h-full w-full object-cover" />}
              </div>
              <div className="p-3">
                <div className="font-semibold">{l.name}</div>
                {l.description && <div className="mt-1 line-clamp-2 text-xs text-white/60">{l.description}</div>}
                {l.mood_tags && l.mood_tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {l.mood_tags.map(t => <span key={t} className="rounded-full border border-white/10 px-2 py-0.5 text-[9px] uppercase tracking-widest text-white/50">{t}</span>)}
                  </div>
                )}
                <button onClick={() => remove(l.id)} className="mt-2 text-[10px] text-white/40 hover:text-red-400">Delete</button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

function EmptyState({ icon, title, hint }: { icon: React.ReactNode; title: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-16 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-white/50">{icon}</div>
      <div className="text-lg font-semibold">{title}</div>
      <div className="mt-1 text-sm text-white/50">{hint}</div>
    </div>
  );
}
