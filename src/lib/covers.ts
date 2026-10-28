import websiteMedia10 from "@/assets/crew.jpg.asset.json";
import websiteMedia11 from "@/assets/danakil.jpg.asset.json";
import websiteMedia13 from "@/assets/elders.jpg.asset.json";
import websiteMedia17 from "@/assets/slide-3.jpg.asset.json";
import { useQuery, type QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cachedSignedUrls } from "@/lib/signed-urls";
import { BUCKET, isStoragePath } from "@/lib/projects";

/** Page cover photos. Saved in the content table as "storage:<path>" under cover_<page>. */
export const COVERS = [
  { page: "about", label: "About page", fallback: websiteMedia13.url },
  { page: "services", label: "Services page", fallback: websiteMedia10.url },
  { page: "portfolio", label: "Portfolio page", fallback: websiteMedia11.url },
  { page: "contact", label: "Contact page", fallback: websiteMedia17.url },
] as const;

export type CoverPage = (typeof COVERS)[number]["page"];
export const coverKey = (page: CoverPage) => `cover_${page}`;
export const COVERS_QUERY_KEY = ["covers"] as const;

export type CoverMap = Record<CoverPage, { url: string; custom: boolean; stored?: string | undefined }>;

export async function fetchCovers(): Promise<CoverMap> {
  const { data, error } = await supabase.from("content").select("key, value").in("key", COVERS.map((c) => coverKey(c.page)));
  if (error) throw error;
  const stored = new Map((data ?? []).map((r) => [r.key, r.value]));
  const paths = [...stored.values()].filter(isStoragePath).map((v) => v.slice(8));
  const signed = new Map<string, string>();
  if (paths.length) {
    const { data: urls } = await cachedSignedUrls(BUCKET, paths, 60 * 60 * 24 * 7);
    for (const u of urls ?? []) if (u.path && u.signedUrl) signed.set(u.path, u.signedUrl);
  }
  const out = {} as CoverMap;
  for (const c of COVERS) {
    const v = stored.get(coverKey(c.page));
    const url = v && isStoragePath(v) ? signed.get(v.slice(8)) : undefined;
    out[c.page] = url ? { url, custom: true, stored: v } : { url: c.fallback, custom: false };
  }
  return out;
}

const COVERS_STALE_MS = 10_000;

export function useCovers() {
  return useQuery({ queryKey: COVERS_QUERY_KEY, queryFn: fetchCovers, staleTime: COVERS_STALE_MS });
}

/** Cover URL for a page, or "" while the saved covers are still loading (so no placeholder flashes first). */
export function useCover(page: CoverPage): string {
  const { data, isError } = useCovers();
  if (data) return data[page].url;
  return isError ? (COVERS.find((c) => c.page === page)?.fallback ?? "") : "";
}

/** Load the saved covers and download the images in the background, so page heroes are ready before you navigate. */
export async function warmCovers(qc: QueryClient): Promise<void> {
  try {
    const covers = await qc.fetchQuery({ queryKey: COVERS_QUERY_KEY, queryFn: fetchCovers, staleTime: COVERS_STALE_MS });
    for (const c of COVERS) {
      const img = new Image();
      img.src = covers[c.page].url;
    }
  } catch {
    /* the hero falls back to the built-in photo */
  }
}
