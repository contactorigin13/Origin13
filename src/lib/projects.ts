import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cachedSignedUrls } from "@/lib/signed-urls";

export const BUCKET = "portfolio-assets";

export type Project = {
  id: string;
  title: string;
  description: string;
  media_type: "image" | "video_embed";
  media_url: string;
  created_at: string;
  published: boolean;
  kind: ProjectKind;
  service: string | null;
  subtitle: string;
  sort_order: number;
  slides: ProjectSlide[];
  /** Ready-to-show URL (image src or iframe src). */
  display_url: string;
};

export type ProjectKind = "upload" | "story" | "brand_kit";
export const PROJECT_KINDS: { id: ProjectKind; label: string; hint: string }[] = [
  { id: "story", label: "Story in a service", hint: "One photo with a heading and text, shown in a service slideshow" },
  { id: "brand_kit", label: "Brand kit", hint: "A full identity slideshow, shown as a new brand tab under Brand Design" },
  { id: "upload", label: "Simple photo or video", hint: "Shown in Latest Uploads" },
];
export type ProjectSlide = { media_url: string; chapter: string; title: string; text: string; display_url?: string };

export function parseSlides(value: unknown): ProjectSlide[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is Record<string, unknown> => !!v && typeof v === "object").map((v) => ({
    media_url: String(v["media_url"] ?? ""), chapter: String(v["chapter"] ?? ""), title: String(v["title"] ?? ""), text: String(v["text"] ?? ""),
  }));
}

/** Turns a normal YouTube/Vimeo link into a link that can play inside the page. */
export function toEmbedUrl(url: string): string {
  const u = url.trim();
  const yt = u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return u;
}

/** Uploaded files are stored as "storage:<path>". Others are normal links. */
export const isStoragePath = (url: string) => url.startsWith("storage:");

export async function fetchProjects(includeUnpublished = false): Promise<Project[]> {
  let query = supabase.from("projects").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
  if (!includeUnpublished) query = query.eq("published", true);
  const { data, error } = await query;
  if (error) throw error;
  const rows = (data ?? []).map((r) => ({ ...r, slides: parseSlides(r.slides) }));
  const paths = [...rows.map((r) => r.media_url), ...rows.flatMap((r) => r.slides.map((sl) => sl.media_url))].filter(isStoragePath).map((u) => u.slice(8));
  const signed = new Map<string, string>();
  if (paths.length) {
    const { data: urls } = await cachedSignedUrls(BUCKET, paths, 60 * 60 * 24 * 7);
    for (const s of urls ?? []) if (s.path && s.signedUrl) signed.set(s.path, s.signedUrl);
  }
  const show = (u: string) => (isStoragePath(u) ? signed.get(u.slice(8)) ?? "" : u);
  return rows.map((r) => ({
    ...r,
    kind: (["story", "brand_kit"].includes(r.kind) ? r.kind : "upload") as ProjectKind,
    slides: r.slides.map((sl) => ({ ...sl, display_url: show(sl.media_url) })),
    media_type: r.media_type as Project["media_type"],
    display_url: isStoragePath(r.media_url)
      ? signed.get(r.media_url.slice(8)) ?? ""
      : r.media_type === "video_embed"
        ? toEmbedUrl(r.media_url)
        : r.media_url,
  }));
}

export function useProjects() {
  return useQuery({ queryKey: ["projects"], queryFn: () => fetchProjects(), staleTime: 15_000 });
}
