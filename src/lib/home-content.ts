import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cachedSignedUrls } from "@/lib/signed-urls";
import { HERO_SLIDES, STATS } from "@/data/studio";
import { BUCKET, isStoragePath } from "@/lib/projects";

/** Editable home page content. Hero slides and stats live in the content table as JSON. */

export type HomeSlide = {
  id: string;
  tag: string;
  headline: string;
  subheadline: string;
  buttonLabel: string;
  buttonTo: string;
  /** Display URL: bundled public path, or a signed URL for an uploaded photo. */
  image: string;
  /** Bundled fallback path, used by "Use original" in the dashboard. */
  defaultImage: string;
  /** "storage:<path>" when the slide uses an uploaded photo. */
  stored?: string | undefined;
};

/** Shape saved in the content table; `image` is "storage:<path>" when custom. */
export type SavedSlide = {
  id: string;
  tag: string;
  headline: string;
  subheadline: string;
  buttonLabel: string;
  buttonTo: string;
  image?: string | undefined;
};

export type HomeStat = { value: string; label: string };

export const HOME_SLIDES_QUERY_KEY = ["home-slides"] as const;
export const HOME_STATS_QUERY_KEY = ["home-stats"] as const;

export function fallbackSlides(): HomeSlide[] {
  return HERO_SLIDES.map((s) => ({
    id: s.id,
    tag: s.tag,
    headline: s.headline,
    subheadline: s.subheadline,
    buttonLabel: s.button.label,
    buttonTo: s.button.to,
    image: s.image,
    defaultImage: s.image,
  }));
}

function parseJson<T>(value: string | null | undefined): T | null {
  if (!value?.trim()) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export async function fetchHomeSlides(): Promise<HomeSlide[]> {
  const { data, error } = await supabase.from("content").select("value").eq("key", "home_slides").maybeSingle();
  if (error) throw error;
  const saved = parseJson<Array<{ id: string; tag?: string; headline?: string; subheadline?: string; buttonLabel?: string; buttonTo?: string; image?: string }>>(data?.value);
  const slides = fallbackSlides();
  if (!saved) return slides;
  // Resolve any uploaded photos to signed URLs.
  const paths = saved.flatMap((s) => s.image && isStoragePath(s.image) ? [s.image.slice(8)] : []);
  const signed = new Map<string, string>();
  if (paths.length) {
    const { data: urls } = await cachedSignedUrls(BUCKET, paths, 60 * 60 * 24 * 7);
    for (const u of urls ?? []) if (u.path && u.signedUrl) signed.set(u.path, u.signedUrl);
  }
  return slides.map((base) => {
    const s = saved.find((x) => x.id === base.id);
    if (!s) return base;
    const stored = s.image && isStoragePath(s.image) ? s.image : undefined;
    const image = stored ? signed.get(stored.slice(8)) ?? base.image : base.image;
    return {
      ...base,
      tag: s.tag?.trim() || base.tag,
      headline: s.headline?.trim() || base.headline,
      subheadline: s.subheadline?.trim() || base.subheadline,
      buttonLabel: s.buttonLabel?.trim() || base.buttonLabel,
      buttonTo: ["/portfolio", "/services", "/contact"].includes(s.buttonTo ?? "") ? s.buttonTo ?? base.buttonTo : base.buttonTo,
      image,
      stored,
    };
  });
}

export function useHomeSlides() {
  return useQuery({ queryKey: HOME_SLIDES_QUERY_KEY, queryFn: fetchHomeSlides, staleTime: 10_000 });
}

export async function fetchHomeStats(): Promise<HomeStat[]> {
  const { data, error } = await supabase.from("content").select("value").eq("key", "home_stats").maybeSingle();
  if (error) throw error;
  const saved = parseJson<HomeStat[]>(data?.value);
  if (saved && saved.length === STATS.length && saved.every((s) => s.value?.trim() && s.label?.trim())) return saved;
  return STATS.map((s) => ({ ...s }));
}

export function useHomeStats() {
  return useQuery({ queryKey: HOME_STATS_QUERY_KEY, queryFn: fetchHomeStats, staleTime: 10_000 });
}
