import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Loader2, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchContent } from "@/lib/site-content";
import { resolveStudio, type Partner } from "@/lib/editor-fields";

const BUCKET = "portfolio-assets";

/** Add, edit, reorder and delete the "Trusted by" partner logos. Saved as one list. */
export function ManagePartners() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-site-content"], queryFn: () => fetchContent(false) });
  const [list, setList] = useState<Partner[] | null>(null);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { if (data && !list) setList(resolveStudio(data).partners.map(p => ({ name: p.name, short: p.short, logo: p.logo, type: p.type }))); }, [data, list]);
  useEffect(() => {
    const refs = (list ?? []).map(p => p.logo).filter(l => l.startsWith("storage:") && !previews[l]);
    if (!refs.length) return;
    supabase.storage.from(BUCKET).createSignedUrls(refs.map(r => r.slice(8)), 3600).then(({ data: urls }) => {
      setPreviews(prev => ({ ...prev, ...Object.fromEntries((urls ?? []).map(u => [`storage:${u.path}`, u.signedUrl ?? ""])) }));
    });
  }, [list, previews]);

  if (!list) return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
  const show = (logo: string) => (logo.startsWith("storage:") ? previews[logo] ?? "" : logo);
  const change = (next: Partner[]) => { setList(next); setDirty(true); };
  const patch = (i: number, v: Partial<Partner>) => change(list.map((p, j) => (j === i ? { ...p, ...v } : p)));
  const move = (i: number, d: number) => { const n = [...list]; const t = n[i + d]; if (!t) return; n[i + d] = n[i]!; n[i] = t; change(n); };
  const upload = async (i: number, file: File) => {
    if (file.size > 5 * 1024 * 1024) { toast.error("Please choose a logo under 5 MB."); return; }
    setBusy(true);
    const path = `partners/${crypto.randomUUID()}.${file.name.split(".").pop() || "png"}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    setPreviews(prev => ({ ...prev, [`storage:${path}`]: URL.createObjectURL(file) }));
    patch(i, { logo: `storage:${path}` });
  };
  const save = async () => {
    const clean = list.filter(p => p.logo);
    if (clean.length !== list.length) { toast.error("Every partner needs a logo, or delete the empty one."); return; }
    setBusy(true);
    const { error } = await supabase.from("content").upsert({ key: "partners_list", value: JSON.stringify(clean), updated_at: new Date().toISOString() });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    setDirty(false);
    toast.success("Logos saved. The website now shows the new list.");
    qc.invalidateQueries({ queryKey: ["site-content"] });
    qc.invalidateQueries({ queryKey: ["admin-site-content"] });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-xl text-sm text-muted-foreground">These logos scroll under "Trusted by institutions shaping the continent" on Home and appear in the partners list on About. PNGs with a see-through background look best.</p>
        <Button onClick={() => { change([...list, { name: "", short: "", logo: "", type: "" }]); setEditing(list.length); }}><Plus className="h-4 w-4" /> Add logo</Button>
      </div>
      <ul className="mt-6 divide-y divide-border border-y border-border">
        {list.map((p, i) => (
          <li key={i} className="flex flex-wrap items-center gap-4 py-4">
            <div className="flex h-14 w-28 shrink-0 items-center justify-center bg-paper p-2">{p.logo && <img src={show(p.logo)} alt="" className="max-h-full max-w-full object-contain" />}</div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{p.name || "New logo"}</p>
              <p className="truncate text-sm text-muted-foreground">{[p.short, p.type].filter(Boolean).join(" · ")}</p>
            </div>
            <Button variant="outline" size="sm" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" aria-label="Move down" disabled={i === list.length - 1} onClick={() => move(i, 1)}><ArrowDown className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => setEditing(editing === i ? null : i)}><Pencil className="h-4 w-4" /> {editing === i ? "Close" : "Edit"}</Button>
            <Button variant="destructive" size="sm" onClick={() => { if (window.confirm(`Remove ${p.name || "this logo"}?`)) { change(list.filter((_, j) => j !== i)); setEditing(null); } }}><Trash2 className="h-4 w-4" /> Delete</Button>
            {editing === i && (
              <div className="grid w-full gap-4 border border-border bg-card p-5 md:grid-cols-2 animate-rise">
                <div className="space-y-2"><Label htmlFor={`pt-name-${i}`}>Organization name</Label><Input id={`pt-name-${i}`} value={p.name} onChange={e => patch(i, { name: e.target.value })} /></div>
                <div className="space-y-2"><Label htmlFor={`pt-short-${i}`}>Short name</Label><Input id={`pt-short-${i}`} value={p.short} onChange={e => patch(i, { short: e.target.value })} /></div>
                <div className="space-y-2"><Label htmlFor={`pt-type-${i}`}>Field of work</Label><Input id={`pt-type-${i}`} placeholder="Public Health" value={p.type} onChange={e => patch(i, { type: e.target.value })} /></div>
                <div className="space-y-2"><Label>Logo</Label>
                  <Button asChild variant="outline"><label className="cursor-pointer"><Upload className="h-4 w-4" />{busy ? "Uploading…" : p.logo ? "Replace logo" : "Upload logo"}<input type="file" accept="image/png,image/svg+xml,image/webp,image/jpeg" className="sr-only" disabled={busy} onChange={e => { const f = e.target.files?.[0]; e.target.value = ""; if (f) upload(i, f); }} /></label></Button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="sticky bottom-4 mt-8 flex justify-end">
        <Button onClick={save} disabled={busy || !dirty} size="lg" className="rounded-full">{busy && <Loader2 className="h-4 w-4 animate-spin" />} Save logos</Button>
      </div>
    </div>
  );
}
