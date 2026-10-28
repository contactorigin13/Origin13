import type { QueryClient } from "@tanstack/react-query";
import { fetchContent, type ContentMap } from "@/lib/site-content";
import { fetchVisibility } from "@/lib/visibility";
import type { VisibilityMap } from "@/lib/publication";
import { COVERS_QUERY_KEY, fetchCovers, type CoverMap } from "@/lib/covers";
import { HOME_SLIDES_QUERY_KEY, HOME_STATS_QUERY_KEY, fetchHomeSlides, fetchHomeStats, type HomeSlide, type HomeStat } from "@/lib/home-content";
import { TEAM_QUERY_KEY, fetchTeam } from "@/lib/team";
import type { DisplayTeamMember } from "@/lib/team-data";

/**
 * The saved text, photos and publish settings a page needs, loaded on the server
 * so the page arrives already complete instead of loading everything in the browser.
 */
export type SiteSnapshot = {
  at: number;
  content?: ContentMap | undefined;
  visibility?: VisibilityMap | undefined;
  covers?: CoverMap | undefined;
  slides?: HomeSlide[] | undefined;
  stats?: HomeStat[] | undefined;
  team?: DisplayTeamMember[] | undefined;
};

// Never hold up the page for long: anything slower than this loads in the browser as before.
const WAIT_MS = 1500;
const soon = <T,>(job: () => Promise<T>): Promise<T | undefined> =>
  Promise.race([
    Promise.resolve().then(job).catch(() => undefined),
    new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), WAIT_MS)),
  ]);

export async function loadSiteSnapshot(pathname?: string): Promise<SiteSnapshot> {
  // Runs on the server only; later page changes in the browser use the normal loading.
  if (typeof window !== "undefined") return { at: Date.now() };
  const all = pathname === undefined;
  const home = all || pathname === "/";
  const about = all || pathname === "/about";
  const covers = all || pathname !== "/";
  const [content, visibility, coverMap, slides, stats, team] = await Promise.all([
    soon(() => fetchContent()),
    soon(() => fetchVisibility()),
    covers ? soon(() => fetchCovers()) : Promise.resolve(undefined),
    home ? soon(() => fetchHomeSlides()) : Promise.resolve(undefined),
    home ? soon(() => fetchHomeStats()) : Promise.resolve(undefined),
    about ? soon(() => fetchTeam()) : Promise.resolve(undefined),
  ]);
  return { at: Date.now(), content, visibility, covers: coverMap, slides, stats, team };
}

/** Puts the server-loaded data into the query cache before the page renders. */
export function seedQueryClient(qc: QueryClient, snapshot: SiteSnapshot | undefined): void {
  if (!snapshot) return;
  const put = (key: readonly unknown[], data: unknown) => {
    if (data !== undefined && qc.getQueryData(key) === undefined) qc.setQueryData(key, data, { updatedAt: snapshot.at });
  };
  put(["site-content"], snapshot.content);
  put(["site-visibility"], snapshot.visibility);
  put(COVERS_QUERY_KEY, snapshot.covers);
  put(HOME_SLIDES_QUERY_KEY, snapshot.slides);
  put(HOME_STATS_QUERY_KEY, snapshot.stats);
  put(TEAM_QUERY_KEY, snapshot.team);
}
