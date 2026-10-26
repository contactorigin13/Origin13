import websiteMedia10 from "@/assets/crew.jpg.asset.json";
import websiteMedia11 from "@/assets/danakil.jpg.asset.json";
import websiteMedia13 from "@/assets/elders.jpg.asset.json";
import websiteMedia17 from "@/assets/slide-3.jpg.asset.json";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
    const { data: urls } = await supabase.storage.from(BUCKET).createSignedUrls(paths, 60 * 60 * 24 * 7);
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

export function useCovers() {
  return useQuery({ queryKey: COVERS_QUERY_KEY, queryFn: fetchCovers, staleTime: 60_000 });
}

export function useCover(page: CoverPage): string {
  const { data } = useCovers();
  return data?.[page].url ?? (COVERS.find((c) => c.page === page)?.fallback ?? "");
}
