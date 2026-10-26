import { useState, type FormEvent, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { usePhotoCropper } from "@/components/site/PhotoCropDialog";
import { BUCKET, PROJECT_KINDS, fetchProjects, isStoragePath, type Project, type ProjectKind, type ProjectSlide } from "@/lib/projects";
import { BRAND_CLIENTS, SERVICES, WORK_SHOWCASE } from "@/data/studio";
import { useVisibility } from "@/lib/visibility";
import { isPublished } from "@/lib/publication";

/** One uniform row used for every item in the admin: thumbnail, name, status, publish switch, actions. */
export function ItemRow({ thumb, title, note, published, onPublish, busy, actions, children }: {
  thumb?: string | undefined; title: string; note?: string | undefined; published: boolean; onPublish: (v: boolean) => void; busy?: boolean; actions?: ReactNode; children?: ReactNode;
}) {
  return (
    <li className="flex flex-wrap items-center gap-4 py-4">
      <div className="h-14 w-20 shrink-0 overflow-hidden bg-muted">{thumb ? <img src={thumb} alt="" className="h-full w-full object-cover" /> : null}</div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{title}</p>
        {note && <p className="truncate text-sm text-muted-foreground">{note}</p>}
      </div>
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${published ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>{published ? "Published" : "Unpublished"}</span>
      <Switch aria-label={`Publish ${title}`} checked={published} disabled={busy} onCheckedChange={onPublish} />
      {actions}
      {children}
    </li>
  );
}

async function uploadPhoto(file: File) {
  if (file.size > 10 * 1024 * 1024) throw new Error("Please choose a photo under 10 MB.");
  const path = `${crypto.randomUUID()}.${file.name.split(".").pop() || "jpg"}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
  if (error) throw error;
  return `storage:${path}`;
}

type SlideDraft = ProjectSlide & { file?: File | null; preview?: string };

function ProjectForm({ project, onDone }: { project?: Project; onDone: () => void }) {
  const qc = useQueryClient();
  const cropper = usePhotoCropper();
  const [kind, setKind] = useState<ProjectKind>(project?.kind ?? "story");
  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [subtitle, setSubtitle] = useState(project?.subtitle ?? "");
  const [service, setService] = useState(project?.service ?? SERVICES[0]?.id ?? "");
  const [mediaType, setMediaType] = useState<Project["media_type"]>(project?.media_type ?? "image");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(project?.media_type === "image" ? project.display_url : "");
  const [videoUrl, setVideoUrl] = useState(project?.media_type === "video_embed" ? project.media_url : "");
  const [slides, setSlides] = useState<SlideDraft[]>(project?.slides.length ? project.slides.map((s) => ({ ...s, ...(s.display_url ? { preview: s.display_url } : {}) })) : [{ media_url: "", chapter: "01 — Overview", title: "", text: "" }]);
  const [busy, setBusy] = useState(false);
  const pick = async (f: File | undefined) => (f ? cropper.crop(f, 4 / 3) : null);
  const patch = (i: number, v: Partial<SlideDraft>) => setSlides((all) => all.map((s, j) => (j === i ? { ...s, ...v } : s)));
  const move = (i: number, d: number) => setSlides((all) => { const n = [...all]; const t = n[i + d]; if (!t) return all; n[i + d] = n[i]!; n[i] = t; return n; });

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      let media_url = project?.media_url ?? "";
      let media_type: Project["media_type"] = kind === "upload" ? mediaType : "image";
      let savedSlides: ProjectSlide[] = [];
      if (kind === "brand_kit") {
        if (!slides.length) throw new Error("Add at least one slide.");
        for (const s of slides) if (!s.file && !s.media_url) throw new Error("Every slide needs a photo.");
        savedSlides = await Promise.all(slides.map(async (s) => ({ media_url: s.file ? await uploadPhoto(s.file) : s.media_url, chapter: s.chapter, title: s.title, text: s.text })));
        media_url = savedSlides[0]!.media_url;
      } else if (media_type === "image") {
        if (file) media_url = await uploadPhoto(file);
        else if (!media_url || project?.media_type !== "image") throw new Error("Please choose a photo.");
      } else {
        media_url = videoUrl.trim();
        if (!/^https?:\/\//.test(media_url)) throw new Error("Please paste a full video link, starting with https://");
      }
      const row = { kind, title, description, subtitle, service: kind === "story" ? service : kind === "brand_kit" ? "branding" : null, media_type, media_url, slides: savedSlides };
      const { error } = project ? await supabase.from("projects").update(row).eq("id", project.id) : await supabase.from("projects").insert(row);
      if (error) throw error;
      toast.success(project ? "Changes saved." : "Saved as unpublished. Turn it on when it's ready.");
      await qc.invalidateQueries({ queryKey: ["admin-projects"] });
      await qc.invalidateQueries({ queryKey: ["projects"] });
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    }
    setBusy(false);
  };

  return (
    <form onSubmit={save} className="w-full space-y-5 border border-border bg-card p-6 animate-rise">
      {cropper.element}
      <div className="space-y-2">
        <Label>What kind of project is this?</Label>
        <div className="grid gap-3 md:grid-cols-3" role="radiogroup" aria-label="Project type">
          {PROJECT_KINDS.map((k) => (
            <button key={k.id} type="button" role="radio" aria-checked={kind === k.id} onClick={() => setKind(k.id)}
              className={`border p-4 text-left transition-colors ${kind === k.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}>
              <span className="block font-semibold">{k.label}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{k.hint}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2"><Label htmlFor="pf-title">{kind === "brand_kit" ? "Brand name" : "Title"}</Label><Input id="pf-title" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
      {kind === "story" && (
        <div className="space-y-2"><Label htmlFor="pf-service">Show it in</Label>
          <select id="pf-service" className="h-10 w-full border border-input bg-background px-3 text-sm" value={service} onChange={(e) => setService(e.target.value)}>
            {SERVICES.filter((s) => s.id !== "branding").map((s) => <option key={s.id} value={s.id}>{s.number}. {s.title}</option>)}
          </select>
        </div>
      )}
      {kind === "brand_kit" ? (
        <>
          <div className="space-y-2"><Label htmlFor="pf-sub">Short line under the name</Label><Input id="pf-sub" placeholder="E-commerce platform · Addis Ababa, Ethiopia" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} /></div>
          <div className="space-y-4">
            <Label>Slides ({slides.length})</Label>
            {slides.map((s, i) => (
              <div key={i} className="grid gap-4 border border-border p-4 md:grid-cols-[140px_1fr]">
                <div className="space-y-2">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-muted">{s.preview && <img src={s.preview} alt="" className="h-full w-full object-cover" />}</div>
                  <Input type="file" accept="image/*" aria-label={`Slide ${i + 1} photo`} onChange={async (e) => { const f = await pick(e.target.files?.[0]); e.target.value = ""; if (f) patch(i, { file: f, preview: URL.createObjectURL(f) }); }} />
                </div>
                <div className="space-y-3">
                  <Input aria-label="Chapter label" placeholder="02 — Challenge" value={s.chapter} onChange={(e) => patch(i, { chapter: e.target.value })} />
                  <Input aria-label="Slide heading" placeholder="Heading" value={s.title} onChange={(e) => patch(i, { title: e.target.value })} />
                  <Textarea aria-label="Slide text" rows={2} placeholder="Text" value={s.text} onChange={(e) => patch(i, { text: e.target.value })} />
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move slide up"><ArrowUp className="h-4 w-4" /></Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => move(i, 1)} disabled={i === slides.length - 1} aria-label="Move slide down"><ArrowDown className="h-4 w-4" /></Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setSlides((all) => all.filter((_, j) => j !== i))}><X className="h-4 w-4" /> Remove</Button>
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setSlides((all) => [...all, { media_url: "", chapter: `${String(all.length + 1).padStart(2, "0")} — `, title: "", text: "" }])}><Plus className="h-4 w-4" /> Add slide</Button>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2"><Label htmlFor="pf-desc">{kind === "story" ? "Text under the photo" : "Description"}</Label><Textarea id="pf-desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          {kind === "upload" && (
            <div className="flex gap-3" role="radiogroup" aria-label="Media">
              {(["image", "video_embed"] as const).map((t) => (
                <button key={t} type="button" role="radio" aria-checked={mediaType === t} onClick={() => setMediaType(t)}
                  className={`rounded-full border px-5 py-2 text-sm font-semibold ${mediaType === t ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{t === "image" ? "Photo" : "Video link"}</button>
              ))}
            </div>
          )}
          {kind === "upload" && mediaType === "video_embed" ? (
            <div className="space-y-2"><Label htmlFor="pf-video">YouTube or Vimeo link</Label><Input id="pf-video" placeholder="https://www.youtube.com/watch?v=..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} /></div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="pf-file">Photo (up to 10 MB)</Label>
              {preview && <img src={preview} alt="" className="aspect-[4/3] w-48 object-cover" />}
              <Input id="pf-file" type="file" accept="image/*" onChange={async (e) => { const f = await pick(e.target.files?.[0]); e.target.value = ""; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); } }} />
            </div>
          )}
        </>
      )}
      <div className="flex gap-3">
        <Button type="submit" disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />} {project ? "Save changes" : "Save unpublished"}</Button>
        <Button type="button" variant="ghost" onClick={onDone}>Cancel</Button>
      </div>
    </form>
  );
}

export function ManageProjects() {
  const qc = useQueryClient();
  const { data: projects = [], isLoading } = useQuery({ queryKey: ["admin-projects"], queryFn: () => fetchProjects(true) });
  const { data: visibility = {} } = useVisibility();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const setVisible = async (key: string, published: boolean) => {
    setBusy(true);
    const { error } = await supabase.from("site_visibility").upsert({ key, published, updated_at: new Date().toISOString() });
    if (error) toast.error(error.message); else await qc.invalidateQueries({ queryKey: ["site-visibility"] });
    setBusy(false);
  };
  const refresh = async () => { await qc.invalidateQueries({ queryKey: ["admin-projects"] }); await qc.invalidateQueries({ queryKey: ["projects"] }); };
  const setProject = async (p: Project, published: boolean) => {
    setBusy(true);
    const { error } = await supabase.from("projects").update({ published }).eq("id", p.id);
    if (error) toast.error(error.message); else await refresh();
    setBusy(false);
  };
  const reorder = async (list: Project[], i: number, d: number) => {
    const a = list[i], b = list[i + d];
    if (!a || !b) return;
    setBusy(true);
    const ordered = [...list]; ordered[i] = b; ordered[i + d] = a;
    await Promise.all(ordered.map((p, idx) => supabase.from("projects").update({ sort_order: idx }).eq("id", p.id)));
    await refresh();
    setBusy(false);
  };
  const remove = async (p: Project) => {
    if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("projects").delete().eq("id", p.id);
    if (error) { toast.error(error.message); return; }
    const files = [p.media_url, ...p.slides.map((s) => s.media_url)].filter(isStoragePath).map((u) => u.slice(8));
    if (files.length) await supabase.storage.from(BUCKET).remove([...new Set(files)]);
    toast.success("Deleted.");
    await refresh();
  };

  const projectRows = (list: Project[]) => list.map((p, i) => (
    <ItemRow key={p.id} thumb={p.media_type === "image" ? p.display_url : undefined} title={p.title} note={p.kind === "brand_kit" ? `${p.slides.length} slides · added by you` : "Added by you"} published={p.published} busy={busy} onPublish={(v) => setProject(p, v)}
      actions={<>
        <Button variant="outline" size="sm" aria-label="Move up" disabled={busy || i === 0} onClick={() => reorder(list, i, -1)}><ArrowUp className="h-4 w-4" /></Button>
        <Button variant="outline" size="sm" aria-label="Move down" disabled={busy || i === list.length - 1} onClick={() => reorder(list, i, 1)}><ArrowDown className="h-4 w-4" /></Button>
        <Button variant="outline" size="sm" onClick={() => setEditing(editing === p.id ? null : p.id)}><Pencil className="h-4 w-4" /> {editing === p.id ? "Close" : "Edit"}</Button>
        <Button variant="destructive" size="sm" onClick={() => remove(p)}><Trash2 className="h-4 w-4" /> Delete</Button>
      </>}>
      {editing === p.id && <ProjectForm project={p} onDone={() => setEditing(null)} />}
    </ItemRow>
  ));
  const builtIn = (key: string, title: string, thumb?: string) => (
    <ItemRow key={key} thumb={thumb} title={title} note="Original work · edit its text in Portfolio text below" published={isPublished(visibility, key)} busy={busy} onPublish={(v) => setVisible(key, v)} />
  );

  const groups = [
    ...SERVICES.filter((s) => s.id !== "branding").map((s) => ({
      id: s.id, name: `${s.number}. ${s.title}`,
      builtIn: WORK_SHOWCASE.filter((t) => t.service === s.id && !t.client).map((t) => builtIn(`work_${t.id}`, t.title, t.image)),
      mine: projects.filter((p) => p.kind === "story" && p.service === s.id),
    })),
    { id: "brand", name: "Brand kits", builtIn: BRAND_CLIENTS.map((b) => builtIn(`brand_${b.id}`, b.name, WORK_SHOWCASE.find((t) => t.client === b.id && t.image)?.image)), mine: projects.filter((p) => p.kind === "brand_kit") },
    { id: "uploads", name: "Latest Uploads", builtIn: [builtIn("portfolio_uploads", "Show the Latest Uploads section on the website")], mine: projects.filter((p) => p.kind === "upload") },
  ];

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl">Projects</h2>
          <p className="mt-1 text-sm text-muted-foreground">Add a project, then turn it on when it's ready. Turning it off hides it but keeps everything.</p>
        </div>
        {!adding && <Button onClick={() => setAdding(true)}><Plus className="h-4 w-4" /> Add new project</Button>}
      </div>
      {adding && <div className="mt-6"><ProjectForm onDone={() => setAdding(false)} /></div>}
      {isLoading ? <Loader2 className="mt-6 h-5 w-5 animate-spin text-primary" /> : (
        <Accordion type="multiple" className="mt-6 border-t border-border">
          {groups.map((g) => (
            <AccordionItem key={g.id} value={g.id} className="border-border">
              <AccordionTrigger className="py-5 hover:no-underline">
                <span className="flex flex-wrap items-baseline gap-x-4 text-left">
                  <span className="font-display text-xl md:text-2xl">{g.name}</span>
                  <span className="text-sm font-normal text-muted-foreground">{g.builtIn.length + g.mine.length} items</span>
                </span>
              </AccordionTrigger>
              <AccordionContent><ul className="divide-y divide-border border-y border-border">{g.builtIn}{projectRows(g.mine)}</ul></AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </section>
  );
}
