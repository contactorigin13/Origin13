import type { QueryClient } from "@tanstack/react-query";

/**
 * Remembers the last saved text and photos in the browser, so a returning visitor sees the
 * real content immediately while the site quietly checks for newer changes.
 * Bump STORE when the shape of this data changes.
 */
const STORE = "o13-cache-v1";
const MAX_AGE = 12 * 60 * 60 * 1000; // photo links stay valid for 7 days
const KEYS = ["site-content", "covers", "home-slides", "home-stats", "team"] as const;
type Saved = Record<string, { at: number; data: unknown }>;

export function restoreQueryCache(qc: QueryClient): void {
  try {
    const raw = localStorage.getItem(STORE);
    if (!raw) return;
    const saved = JSON.parse(raw) as Saved;
    const now = Date.now();
    for (const k of KEYS) {
      const entry = saved[k];
      if (entry && now - entry.at < MAX_AGE && qc.getQueryData([k]) === undefined) qc.setQueryData([k], entry.data, { updatedAt: entry.at });
    }
  } catch { /* an unreadable copy is simply ignored */ }
}

export function startQueryCachePersistence(qc: QueryClient): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const save = () => {
    try {
      const out: Saved = {};
      for (const k of KEYS) {
        const state = qc.getQueryState([k]);
        if (state?.data !== undefined) out[k] = { at: state.dataUpdatedAt, data: state.data };
      }
      localStorage.setItem(STORE, JSON.stringify(out));
    } catch { /* storage full or blocked: the site works without it */ }
  };
  const unsubscribe = qc.getQueryCache().subscribe((event) => {
    if (event.type === "updated" && event.action.type === "success") {
      clearTimeout(timer);
      timer = setTimeout(save, 400);
    }
  });
  return () => { unsubscribe(); clearTimeout(timer); };
}
