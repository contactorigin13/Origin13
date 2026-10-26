import { ManagePartners } from "@/components/site/ManagePartners";
import { ManageProjects } from "@/components/site/ManageProjects";
import { IdentityBoardEditor } from "@/components/site/IdentityBoardEditor";
import { createFileRoute } from "@tanstack/react-router";
import { usePhotoCropper } from "@/components/site/PhotoCropDialog";
import { useEffect, useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronRight, ExternalLink, FileText, House, Image as ImageIcon, LayoutGrid, Loader2, LogOut, Pencil, RotateCcw, Trash2, Upload, Users } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { COVERS, COVERS_QUERY_KEY, coverKey, useCovers, type CoverPage } from "@/lib/covers";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CONTENT_FIELDS, fetchContent, type ContentMap } from "@/lib/site-content";
import { BUCKET, fetchProjects, isStoragePath, type Project } from "@/lib/projects";
import { fetchHomeSlides, fetchHomeStats, type HomeSlide, type HomeStat, type SavedSlide } from "@/lib/home-content";
import { ManagePublishing } from "@/components/site/ManagePublishing";
import { EditableMediaField } from "@/components/site/EditableMediaField";
import { Switch } from "@/components/ui/switch";
import { ManageTeam } from "@/components/site/ManageTeam";

export const ADMIN_EMAIL = "contactorigin13@gmail.com";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin — Origin 13" },
      { name: "description", content: "Private area for managing the Origin 13 website." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin — Origin 13" },
      { property: "og:description", content: "Private area for managing the Origin 13 website." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const check = async (u: User | null) => {
      setUser(u);
      if (!u) {
        setIsAdmin(null);
      } else {
        const { data } = await supabase.rpc("is_admin");
        setIsAdmin(Boolean(data));
      }
      setReady(true);
    };
    supabase.auth.getUser().then(({ data }) => check(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") check(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <main className="min-h-screen pt-28">
      {!ready ? (
        <Loader2 className="mx-auto mt-20 h-6 w-6 animate-spin text-primary" />
      ) : !user ? (
        <div className="px-6 pb-24"><LoginForm /></div>
      ) : !isAdmin ? (
        <div className="mx-auto max-w-md px-6 text-center">
          <h1 className="text-3xl">No access</h1>
          <p className="mt-4 text-muted-foreground">This account cannot manage the website. Only {ADMIN_EMAIL} can.</p>
          <Button className="mt-6" variant="outline" onClick={signOut}>Sign out</Button>
        </div>
      ) : (
        <Dashboard email={user.email ?? ""} onSignOut={signOut} />
      )}
    </main>
  );
}

const SECTIONS = [
  { id: "publishing", label: "Publishing", hint: "Published and unpublished pages, sections and slides", icon: FileText },
  { id: "home", label: "Home", hint: "The slideshow, intro text and numbers on the home page", icon: House },
  { id: "covers", label: "Cover photos", hint: "The big photo at the top of each page", icon: ImageIcon },
  { id: "text", label: "Page text", hint: "The words on each page", icon: FileText },
  { id: "partners", label: "Partner logos", hint: "The \"Trusted by\" logos on Home and About", icon: ImageIcon },
  { id: "team", label: "Team", hint: "People on the About page", icon: Users },
  { id: "portfolio", label: "Portfolio", hint: "Add projects, publish or unpublish them, and edit the page text", icon: LayoutGrid },
] as const;
type SectionId = (typeof SECTIONS)[number]["id"];

function Dashboard({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  const [active, setActive] = useState<SectionId>("covers");
  const current = (SECTIONS.find((s) => s.id === active) ?? SECTIONS[0]);
  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-24 lg:grid-cols-[260px_1fr] lg:px-10">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="border border-border bg-card p-6">
          <p className="eyebrow">Dashboard</p>
          <p className="mt-3 truncate text-sm text-muted-foreground" title={email}>{email}</p>
          <nav className="mt-6 flex gap-2 overflow-x-auto lg:flex-col lg:gap-1" aria-label="Dashboard sections">
            {SECTIONS.map((s) => {
              const on = s.id === active;
              return (
                <button key={s.id} type="button" onClick={() => setActive(s.id)} aria-current={on ? "page" : undefined}
                  className={`group flex shrink-0 items-center gap-3 border-l-2 px-3 py-3 text-left text-sm font-semibold transition-colors ${on ? "border-primary bg-primary/10 text-foreground" : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"}`}>
                  <s.icon className="h-4 w-4 text-primary" strokeWidth={1.75} />
                  <span className="flex-1">{s.label}</span>
                  <ChevronRight className={`hidden h-4 w-4 transition-transform lg:block ${on ? "translate-x-0 text-primary" : "-translate-x-1 opacity-0 group-hover:opacity-100"}`} />
                </button>
              );
            })}
          </nav>
          <div className="mt-6 flex flex-col gap-2 border-t border-border pt-6">
            <Button asChild variant="ghost" size="sm" className="justify-start"><Link to="/" target="_blank"><ExternalLink className="h-4 w-4" /> View website</Link></Button>
            <Button variant="ghost" size="sm" className="justify-start" onClick={onSignOut}><LogOut className="h-4 w-4" /> Sign out</Button>
          </div>
        </div>
      </aside>
      <section key={active} className="animate-rise">
        <div className="border-b border-border pb-6">
          <p className="eyebrow">Manage</p>
          <h1 className="mt-3 text-4xl md:text-5xl">{current.label}</h1>
          <p className="mt-3 text-muted-foreground">{current.hint}.</p>
        </div>
        <div className="mt-10">
          {active === "publishing" && <ManagePublishing />}
          {active === "home" && <ManageHome />}
          {active === "covers" && <ManageCovers />}
          {active === "text" && <ManageText />}
          {active === "team" && <ManageTeam />}
          {active === "partners" && <ManagePartners />}
          {active === "portfolio" && <><ManageProjects /><h2 className="mb-6 mt-16 border-t border-border pt-10 font-display text-3xl">Portfolio text</h2><ManageText portfolioOnly /></>}
        </div>
      </section>
    </div>
  );
}

function ManageCovers() {
  const qc = useQueryClient();
  const { data, isLoading } = useCovers();
  const [busy, setBusy] = useState<CoverPage | null>(null);
  const cropper = usePhotoCropper();

  const upload = async (page: CoverPage, file: File) => {
    if (file.size > 10 * 1024 * 1024) { toast.error("Please choose a photo under 10 MB."); return; }
    setBusy(page);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `covers/${page}-${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
      if (error) throw error;
      const old = data?.[page].stored;
      const { error: e2 } = await supabase.from("content").upsert({ key: coverKey(page), value: `storage:${path}`, updated_at: new Date().toISOString() });
      if (e2) throw e2;
      if (old && isStoragePath(old)) await supabase.storage.from(BUCKET).remove([old.slice(8)]);
      toast.success("Cover photo updated.");
      qc.invalidateQueries({ queryKey: COVERS_QUERY_KEY });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    }
    setBusy(null);
  };

  const reset = async (page: CoverPage) => {
    if (!window.confirm("Go back to the original photo?")) return;
    setBusy(page);
    const old = data?.[page].stored;
    const { error } = await supabase.from("content").delete().eq("key", coverKey(page));
    if (error) toast.error(error.message);
    else {
      if (old && isStoragePath(old)) await supabase.storage.from(BUCKET).remove([old.slice(8)]);
      toast.success("Original photo restored.");
      qc.invalidateQueries({ queryKey: COVERS_QUERY_KEY });
    }
    setBusy(null);
  };

  if (isLoading) return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {cropper.element}
      {COVERS.map((c) => {
        const cover = data?.[(c["page"] ?? "")];
        return (
          <article key={(c["page"] ?? "")} className="group overflow-hidden border border-border bg-card">
            <div className="media-tone relative aspect-[16/9] overflow-hidden">
              <img src={cover?.url ?? (c["fallback"] ?? "")} alt={`${(c["label"] ?? "")} cover`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-hero-scrim" />
              <p className="absolute bottom-4 left-4 font-display text-2xl">{(c["label"] ?? "")}</p>
              <span className="absolute right-4 top-4 border border-foreground/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest">{cover?.custom ? "Your photo" : "Original"}</span>
              {busy === (c["page"] ?? "") && <div className="absolute inset-0 flex items-center justify-center bg-background/60"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>}
            </div>
            <div className="flex flex-wrap items-center gap-3 p-4">
              <Label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
                <Upload className="h-4 w-4" /> Change photo
                <input type="file" accept="image/*" className="sr-only" disabled={busy !== null}
                  onChange={async (e) => { const f = e.target.files?.[0]; e.target.value = ""; if (!f) return; const cropped = await cropper.crop(f, 16 / 9); if (cropped) upload((c["page"] ?? ""), cropped); }} />
              </Label>
              {cover?.custom && <Button variant="ghost" size="sm" onClick={() => reset((c["page"] ?? ""))} disabled={busy !== null}><RotateCcw className="h-4 w-4" /> Use original</Button>}
            </div>
          </article>
        );
      })}
      <p className="text-sm text-muted-foreground md:col-span-2">Wide photos work best (at least 1920 px across). Up to 10 MB.</p>
    </div>
  );
}

function ManageHome() {
  const qc = useQueryClient();
  const slidesQ = useQuery({ queryKey: ["home-slides"], queryFn: fetchHomeSlides });
  const statsQ = useQuery({ queryKey: ["home-stats"], queryFn: fetchHomeStats });
  const contentQ = useQuery({ queryKey: ["admin-site-content"], queryFn: () => fetchContent(false) });
  const ready = slidesQ.isSuccess && statsQ.isSuccess && contentQ.isSuccess;

  const [slides, setSlides] = useState<HomeSlide[] | null>(null);
  const [stats, setStats] = useState<HomeStat[] | null>(null);
  const [texts, setTexts] = useState<{ intro: string; work: string } | null>(null);
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const cropper = usePhotoCropper();

  useEffect(() => {
    const savedSlides = slidesQ.data;
    const savedStats = statsQ.data;
    const savedContent = contentQ.data;
    if (!ready || !savedSlides || !savedStats || !savedContent) return;
    setSlides((s) => s ?? savedSlides);
    setStats((s) => s ?? savedStats);
    setTexts((t) => t ?? { intro: (savedContent["home_intro"] ?? ""), work: (savedContent["home_work_title"] ?? "") });
  }, [ready, slidesQ.data, statsQ.data, contentQ.data]);

  const patchSlide = (id: string, patch: Partial<HomeSlide>) =>
    setSlides((list) => list?.map((s) => (s.id === id ? { ...s, ...patch } : s)) ?? list ?? null);

  const choosePhoto = (id: string, file: File | null) => {
    setFiles((f) => ({ ...f, [id]: file }));
    setPreviews((p) => {
      const next = { ...p };
      if (next[id]) URL.revokeObjectURL(next[id]);
      delete next[id];
      if (file) next[id] = URL.createObjectURL(file);
      return next;
    });
  };

  const clearPhoto = (id: string) => {
    choosePhoto(id, null);
    setSlides((list) => list?.map((s) => (s.id === id ? { ...s, image: s.defaultImage, stored: undefined } : s)) ?? list ?? null);
  };

  const save = async () => {
    if (!slides || !stats || !texts) return;
    setSaving(true);
    const replaced: string[] = [];
    try {
      const out: SavedSlide[] = [];
      for (const s of slides) {
        const row: SavedSlide = {
          id: s.id,
          tag: s.tag,
          headline: s.headline,
          subheadline: s.subheadline,
          buttonLabel: s.buttonLabel,
          buttonTo: s.buttonTo,
        };
        const f = files[s.id];
        if (f) {
          if (f.size > 10 * 1024 * 1024) throw new Error("Please choose photos under 10 MB.");
          const ext = f.name.split(".").pop() || "jpg";
          const path = `home/${s.id}-${crypto.randomUUID()}.${ext}`;
          const { error } = await supabase.storage.from(BUCKET).upload(path, f, { contentType: f.type });
          if (error) throw error;
          row.image = `storage:${path}`;
          if (s.stored) replaced.push(s.stored.slice(8));
        } else if (s.stored) {
          row.image = s.stored;
        }
        out.push(row);
      }
      const now = new Date().toISOString();
      const rows = [
        { key: "home_slides", value: JSON.stringify(out), updated_at: now },
        { key: "home_stats", value: JSON.stringify(stats), updated_at: now },
        { key: "home_intro", value: texts.intro, updated_at: now },
        { key: "home_work_title", value: texts.work, updated_at: now },
      ];
      const { error } = await supabase.from("content").upsert(rows);
      if (error) throw error;
      if (replaced.length) await supabase.storage.from(BUCKET).remove(replaced);
      toast.success("Changes saved. The home page now shows the new content.");
      setFiles({});
      setPreviews({});
      qc.invalidateQueries({ queryKey: ["home-slides"] });
      qc.invalidateQueries({ queryKey: ["home-stats"] });
      qc.invalidateQueries({ queryKey: ["site-content"] });
      qc.invalidateQueries({ queryKey: ["admin-site-content"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    }
    setSaving(false);
  };

  if (!slides || !stats || !texts) return <Loader2 className="h-5 w-5 animate-spin text-primary" />;

  return (
    <div>
      {cropper.element}
      <h3 className="font-display text-2xl">Top slideshow</h3>
      <p className="mt-2 text-sm text-muted-foreground">Five slides, one for each service. Photos work best wide (at least 1920 px across), up to 10 MB.</p>
      <div className="mt-6 space-y-6">
        {slides.map((s, idx) => (
          <article key={s.id} className="border border-border bg-card">
            <div className="flex flex-col gap-6 p-6 md:flex-row">
              <div className="media-tone relative aspect-[16/9] w-full shrink-0 overflow-hidden md:w-56">
                <img src={previews[s.id] ?? s.image} alt="" className="h-full w-full object-cover" />
                <span className="absolute bottom-2 left-2 font-display text-lg">{`0${idx + 1}`}</span>
              </div>
              <div className="w-full space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`s-tag-${s.id}`}>Small label</Label>
                    <Input id={`s-tag-${s.id}`} value={s.tag} onChange={(e) => patchSlide(s.id, { tag: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`s-head-${s.id}`}>Big title</Label>
                    <Input id={`s-head-${s.id}`} value={s.headline} onChange={(e) => patchSlide(s.id, { headline: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`s-sub-${s.id}`}>Description</Label>
                  <Textarea id={`s-sub-${s.id}`} rows={2} value={s.subheadline} onChange={(e) => patchSlide(s.id, { subheadline: e.target.value })} />
                </div>
                <div className="flex flex-wrap items-end gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`s-btn-${s.id}`}>Button text</Label>
                    <Input id={`s-btn-${s.id}`} value={s.buttonLabel} onChange={(e) => patchSlide(s.id, { buttonLabel: e.target.value })} />
                  </div>
                  <div className="space-y-2"><Label htmlFor={`s-destination-${s.id}`}>Button destination</Label><select id={`s-destination-${s.id}`} className="h-10 border border-input bg-background px-3 text-sm" value={s.buttonTo} onChange={e => patchSlide(s.id, { buttonTo: e.target.value })}><option value="/portfolio">Portfolio</option><option value="/services">Services</option><option value="/contact">Contact</option></select></div>
                  <div className="flex flex-wrap items-center gap-3 pb-1">
                    <Label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary">
                      <Upload className="h-4 w-4" /> {previews[s.id] ? "Photo chosen" : "Change photo"}
                      <input type="file" accept="image/*" className="sr-only" onChange={async (e) => { const f = e.target.files?.[0] ?? null; e.target.value = ""; if (!f) return; choosePhoto(s.id, await cropper.crop(f, 16 / 9)); }} />
                    </Label>
                    {(s.stored || previews[s.id] || files[s.id]) && (
                      <Button variant="ghost" size="sm" onClick={() => clearPhoto(s.id)}><RotateCcw className="h-4 w-4" /> Use original</Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <h3 className="mt-14 font-display text-2xl">Intro text</h3>
      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="home-intro">Big paragraph under the slideshow</Label>
          <Textarea id="home-intro" rows={3} value={texts.intro} onChange={(e) => setTexts({ ...texts, intro: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="home-work">Title above the selected work</Label>
          <Input id="home-work" value={texts.work} onChange={(e) => setTexts({ ...texts, work: e.target.value })} />
        </div>
      </div>

      <h3 className="mt-14 font-display text-2xl">Numbers</h3>
      <p className="mt-2 text-sm text-muted-foreground">The four numbers shown under the intro paragraph.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {stats.map((s, i) => (
          <div key={i} className="space-y-3 border border-border bg-card p-4">
            <div className="space-y-2">
              <Label htmlFor={`st-v-${i}`}>Number</Label>
              <Input id={`st-v-${i}`} value={s.value} onChange={(e) => setStats(stats.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`st-l-${i}`}>What it counts</Label>
              <Input id={`st-l-${i}`} value={s.label} onChange={(e) => setStats(stats.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-4 mt-10 flex justify-end">
        <Button onClick={save} disabled={saving} size="lg" className="rounded-full">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save Changes
        </Button>
      </div>
    </div>
  );
}

function LoginForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      toast.error("Only the site owner can sign in here.");
      return;
    }
    setBusy(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      if (error) toast.error(error.message);
      else toast.success("Check your email and click the link to confirm your account.");
    }
    setBusy(false);
  };

  const reset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(ADMIN_EMAIL, { redirectTo: `${window.location.origin}/reset-password` });
    if (error) toast.error(error.message);
    else toast.success("We sent a password reset link to your email.");
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-sm space-y-5">
      <div>
        <p className="eyebrow">Admin</p>
        <h1 className="mt-2 text-4xl">{mode === "signin" ? "Sign in" : "Create your admin account"}</h1>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <Button type="submit" className="w-full" disabled={busy}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} {mode === "signin" ? "Sign in" : "Create account"}
      </Button>
      <div className="flex justify-between text-sm text-muted-foreground">
        <button type="button" className="hover:text-primary" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
          {mode === "signin" ? "First time? Create account" : "Have an account? Sign in"}
        </button>
        {mode === "signin" && <button type="button" className="hover:text-primary" onClick={reset}>Forgot password?</button>}
      </div>
    </form>
  );
}

function ManageText({ portfolioOnly = false }: { portfolioOnly?: boolean }) {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-site-content"], queryFn: () => fetchContent(false) });
  const [values, setValues] = useState<ContentMap | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (data && !values) setValues(data);
  }, [data, values]);

  const save = async () => {
    if (!values) return;
    setSaving(true);
    const rows = CONTENT_FIELDS.filter((f) => !portfolioOnly || f.label.startsWith("Portfolio ")).map((f) => ({ key: f.key, value: values[f.key] ?? f.default, updated_at: new Date().toISOString() }));
    const { error } = await supabase.from("content").upsert(rows);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Changes saved. The website now shows the new text.");
    qc.invalidateQueries({ queryKey: ["site-content"] });
      qc.invalidateQueries({ queryKey: ["admin-site-content"] });
  };

  const groups = (portfolioOnly ? ["Portfolio"] : ["Home", "About", "Services", "Portfolio", "Contact", "Shared"]).map((g) => ({
    name: g,
    fields: CONTENT_FIELDS.filter((f) => f.label.startsWith(g + " ") && f.label.toLowerCase().includes(search.toLowerCase())),
  }));

  if (!values) return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
  const renderField = (f: (typeof CONTENT_FIELDS)[number], label?: string) => (
    <div key={f.key} className="space-y-2">
                  <Label htmlFor={f.key}>{label ?? f.label.replace(/^[^—]+— /, "")}</Label>
                  {f.key.endsWith("_board") ? <IdentityBoardEditor id={f.key} value={values[f.key] ?? f.default} onChange={value => setValues({ ...values, [f.key]: value })} /> : "media" in f && f.media ? <EditableMediaField id={f.key} value={values[f.key] ?? ""} onChange={value => setValues({ ...values, [f.key]: value })} /> : f.multiline ? (
                    <Textarea id={f.key} rows={f.key === "about_story" || f.key === "about_experience" ? 8 : 3} value={values[f.key]} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} />
                  ) : (
                    <Input id={f.key} value={values[f.key]} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} />
                  )}
                </div>
  );
  return (
    <div>
      <Label htmlFor="content-search">Find text or an image</Label><Input id="content-search" className="mb-6 mt-2" value={search} onChange={e => setSearch(e.target.value)} />
      {portfolioOnly ? <PortfolioGroups fields={groups[0]?.fields ?? []} renderField={renderField} /> : <Accordion type="multiple" defaultValue={[]} className="border-t border-border">
        {groups.map((g) => (
          <AccordionItem key={g.name} value={g.name} className="border-border">
            <AccordionTrigger className="py-6 hover:no-underline">
              <span className="flex items-baseline gap-4">
                <span className="font-display text-2xl">{g.name}</span>
                <span className="text-sm font-normal text-muted-foreground">{g.fields.length} {g.fields.length === 1 ? "field" : "fields"}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pb-8">
              {g.fields.map((f) => renderField(f))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>}
      <div className="sticky bottom-4 mt-8 flex justify-end">
        <Button onClick={save} disabled={saving} size="lg" className="rounded-full">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save Changes
        </Button>
      </div>
    </div>
  );
}

type ContentField = (typeof CONTENT_FIELDS)[number];
const PORTFOLIO_SECTIONS: { name: string; match: string[] }[] = [
  { name: "Page introduction", match: ["(top)"] },
  { name: "01. Documentary Films & Photography", match: ["Documentary Films & Photography", "Misting the Highland Seedlings", "The Cold Chain Sentinel", "Under the Net"] },
  { name: "02. Live Event Coverage & Broadcasting", match: ["Live Event Coverage & Broadcasting", "Summit Live Coverage", "On Stage", "Highlight Reels"] },
  { name: "03. Brand Design & Visual Identity", match: ["Brand Design & Visual Identity"] },
  { name: "Brand kit — Abbro", match: ["Abbro"] },
  { name: "Brand kit — Macha Studios", match: ["Macha Studios"] },
  { name: "04. Digital Marketing & Campaigns", match: ["Digital Marketing & Campaigns", "Campaigns That Reach People", "Community Growth"] },
  { name: "05. Strategic Communications & Creative Direction", match: ["Strategic Communications & Creative Direction", "Stories With Direction", "Common Soil"] },
];
function portfolioParts(label: string) {
  const parts = label.split(" — ").slice(1);
  const field = parts.pop() ?? label;
  const head = (parts[0] ?? "(top)").replace(/^\d+\.\s*/, "");
  const sub = parts.length > 1 ? parts.slice(1).join(" — ") : parts[0] ? parts[0].replace(/^\d+\.\s*/, "") : "General";
  return { head, sub: head === "(top)" ? "General" : sub, field };
}
function PortfolioGroups({ fields, renderField }: { fields: ContentField[]; renderField: (f: ContentField, label?: string) => React.ReactNode }) {
  const sections = PORTFOLIO_SECTIONS.map((s) => ({ ...s, fields: [] as ContentField[] }));
  const other = { name: "Other", match: [], fields: [] as ContentField[] };
  for (const f of fields) {
    const { head } = portfolioParts(f.label);
    (sections.find((s) => s.match.includes(head)) ?? other).fields.push(f);
  }
  const all = [...sections, other].filter((s) => s.fields.length);
  return (
    <Accordion type="multiple" className="border-t border-border">
      {all.map((s) => {
        const subs = new Map<string, ContentField[]>();
        for (const f of s.fields) { const k = portfolioParts(f.label).sub; subs.set(k, [...(subs.get(k) ?? []), f]); }
        return (
          <AccordionItem key={s.name} value={s.name} className="border-border">
            <AccordionTrigger className="py-5 hover:no-underline">
              <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-left">
                <span className="font-display text-xl md:text-2xl">{s.name}</span>
                <span className="text-sm font-normal text-muted-foreground">{s.fields.length} fields</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              {subs.size === 1 ? <div className="space-y-6">{s.fields.map((f) => renderField(f, portfolioParts(f.label).field))}</div> : (
                <Accordion type="multiple" className="border-l border-border pl-4">
                  {[...subs].map(([sub, fs]) => (
                    <AccordionItem key={sub} value={sub} className="border-border">
                      <AccordionTrigger className="py-4 text-base hover:no-underline">{sub} <span className="ml-auto mr-3 text-xs font-normal text-muted-foreground">{fs.length}</span></AccordionTrigger>
                      <AccordionContent className="space-y-6 pb-6">{fs.map((f) => renderField(f, portfolioParts(f.label).field))}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

