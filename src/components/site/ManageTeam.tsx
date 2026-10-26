import { useEffect, useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Loader2, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { BUCKET } from "@/lib/projects";
import { TEAM_QUERY_KEY, saveTeam, useTeam } from "@/lib/team";
import { moveTeamMember, type TeamMember, type DisplayTeamMember } from "@/lib/team-data";
import { usePhotoCropper } from "@/components/site/PhotoCropDialog";

export function ManageTeam() {
  const { data: members, isPending, error, refetch } = useTeam();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const cropper = usePhotoCropper();
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const reset = () => {
    setEditing(null); setName(""); setRole(""); setFile(null); setFileKey((key) => key + 1);
  };
  const edit = (member: DisplayTeamMember) => {
    setEditing(member); setName(member.name); setRole(member.role); setFile(null); setFileKey((key) => key + 1);
    document.getElementById("team-form")?.scrollIntoView({ block: "center", behavior: "smooth" });
  };
  const persist = async (next: TeamMember[]) => {
    await saveTeam(next);
    await queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEY });
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!members || !name.trim() || !role.trim()) return;
    setBusy(true);
    let uploadedPath: string | undefined;
    let saved = false;
    try {
      let portrait = editing?.portrait ?? "";
      if (file) {
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("Choose a JPG, PNG or WebP photo.");
        if (file.size > 10 * 1024 * 1024) throw new Error("Choose a photo smaller than 10 MB.");
        const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
        const path = `team/${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
        if (uploadError) throw uploadError;
        uploadedPath = path;
        portrait = `storage:${path}`;
      }
      const member: TeamMember = { id: editing?.id ?? crypto.randomUUID(), name: name.trim(), role: role.trim(), portrait };
      const next = editing ? members.map((row) => row.id === editing.id ? member : row) : [...members, member];
      await saveTeam(next);
      saved = true;
      await queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEY });
      toast.success(editing ? "Team member updated." : "Team member added.");
      reset();
    } catch (err) {
      if (uploadedPath && !saved) await supabase.storage.from(BUCKET).remove([uploadedPath]);
      toast.error(err instanceof Error ? err.message : "Could not save your team. Please try again.");
    } finally { setBusy(false); }
  };
  const remove = async (member: TeamMember) => {
    if (!members || !window.confirm(`Remove ${member.name} from the team?`)) return;
    setBusy(true);
    try {
      await persist(members.filter((row) => row.id !== member.id));
      if (editing?.id === member.id) reset();
      toast.success("Team member removed.");
    } catch { toast.error("Could not remove this team member. Please try again."); }
    finally { setBusy(false); }
  };
  const move = async (member: TeamMember, direction: -1 | 1) => {
    if (!members) return;
    setBusy(true);
    try { await persist(moveTeamMember(members, member.id, direction)); }
    catch { toast.error("Could not change the order. Please try again."); }
    finally { setBusy(false); }
  };

  return (
    <section aria-label="Manage team">
      {isPending ? <Loader2 className="mt-8 h-5 w-5 animate-spin text-primary" aria-label="Loading team" /> : error ? (
        <div className="mt-6"><p role="alert" className="text-destructive">Could not load your team.</p><Button onClick={() => refetch()} variant="outline" className="mt-3">Try again</Button></div>
      ) : (
        <>
          <ul className="mt-8 divide-y divide-border border-y border-border">
            {members?.map((member, index) => (
              <li key={member.id} className="flex flex-wrap items-center gap-4 py-5">
                <div className="h-20 w-16 shrink-0 bg-muted">{member.display_url && <img src={member.display_url} alt="" className="h-full w-full object-cover" />}</div>
                <div className="min-w-0 flex-1"><p className="font-semibold">{member.name}</p><p className="mt-1 text-sm text-muted-foreground">{member.role}</p>{member.temporary && <p className="mt-1 text-xs text-muted-foreground">Temporary portrait</p>}</div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" title="Move up" aria-label={`Move ${member.name} up`} disabled={busy || index === 0} onClick={() => move(member, -1)}><ArrowUp /></Button>
                  <Button variant="ghost" size="icon" title="Move down" aria-label={`Move ${member.name} down`} disabled={busy || index === (members?.length ?? 0) - 1} onClick={() => move(member, 1)}><ArrowDown /></Button>
                  <Button variant="outline" size="icon" title="Edit member" aria-label={`Edit ${member.name}`} disabled={busy} onClick={() => edit(member)}><Pencil /></Button>
                  <Button variant="destructive" size="icon" title="Remove member" aria-label={`Remove ${member.name}`} disabled={busy} onClick={() => remove(member)}><Trash2 /></Button>
                </div>
              </li>
            ))}
          </ul>
          <form id="team-form" onSubmit={submit} className="mt-8 space-y-5 border border-border bg-card p-6">
            {cropper.element}
            <h3 className="text-2xl">{editing ? `Edit ${editing.name}` : "Add team member"}</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="team-name">Full name</Label><Input id="team-name" required value={name} onChange={(event) => setName(event.target.value)} disabled={busy} /></div>
              <div className="space-y-2"><Label htmlFor="team-role">Position</Label><Input id="team-role" required value={role} onChange={(event) => setRole(event.target.value)} disabled={busy} /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="team-photo">{editing ? "Replace photo (optional)" : "Photo (optional)"}</Label><Input key={fileKey} id="team-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={async (event) => { const f = event.target.files?.[0] ?? null; event.target.value = ""; if (!f) return; const cropped = await cropper.crop(f, 3 / 4); if (cropped) setFile(cropped); }} disabled={busy} /><p className="text-xs text-muted-foreground">JPG, PNG or WebP, up to 10 MB. After choosing, you can move and zoom the photo to fit the frame.</p></div>
            {preview && <div className="flex items-end gap-4"><img src={preview} alt="New portrait preview" className="h-40 w-30 object-cover" /></div>}
            <div className="flex flex-wrap gap-3"><Button type="submit" disabled={busy}>{busy ? <Loader2 className="animate-spin" /> : editing ? <Save /> : <Plus />}{editing ? "Save team member" : "Add team member"}</Button>{editing && <Button type="button" variant="outline" disabled={busy} onClick={reset}>Cancel</Button>}</div>
          </form>
        </>
      )}
    </section>
  );
}