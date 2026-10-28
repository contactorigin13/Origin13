import { supabase } from "@/integrations/supabase/client";

/**
 * Signs several storage files in one request and remembers the links for the session,
 * so the same photo keeps the same link (no re-download, no flicker) and pages load faster.
 */
const cache = new Map<string, { url: string; expires: number }>();

export async function cachedSignedUrls(bucket: string, paths: string[], ttlSeconds: number) {
  const now = Date.now();
  const unique = [...new Set(paths)];
  const missing = unique.filter((p) => {
    const hit = cache.get(`${bucket}/${p}`);
    return !hit || hit.expires < now;
  });
  let error: unknown = null;
  if (missing.length) {
    const res = await supabase.storage.from(bucket).createSignedUrls(missing, ttlSeconds);
    if (res.error) error = res.error;
    for (const row of res.data ?? []) {
      if (row.path && row.signedUrl) cache.set(`${bucket}/${row.path}`, { url: row.signedUrl, expires: now + ttlSeconds * 700 });
    }
  }
  const data = unique.flatMap((p) => {
    const hit = cache.get(`${bucket}/${p}`);
    return hit ? [{ path: p, signedUrl: hit.url }] : [];
  });
  return { data, error };
}
