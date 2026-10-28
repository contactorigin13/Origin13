import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchContent } from "@/lib/site-content";
import { COVERS_QUERY_KEY, fetchCovers } from "@/lib/covers";
import { HOME_SLIDES_QUERY_KEY, fetchHomeSlides } from "@/lib/home-content";
import { TEAM_QUERY_KEY, fetchTeam } from "@/lib/team";

const FRESH = 10_000;

/**
 * True once the saved text and photos this page needs have loaded, so the page appears
 * with its final content instead of flashing the built-in originals first.
 * Gives up waiting after 4 seconds so a slow connection never blocks the page.
 */
export function useSiteReady(pathname: string): boolean {
  const home = pathname === "/";
  const about = pathname === "/about";
  const content = useQuery({ queryKey: ["site-content"], queryFn: () => fetchContent(), staleTime: FRESH });
  const covers = useQuery({ queryKey: COVERS_QUERY_KEY, queryFn: fetchCovers, staleTime: FRESH, enabled: !home });
  const slides = useQuery({ queryKey: HOME_SLIDES_QUERY_KEY, queryFn: fetchHomeSlides, staleTime: FRESH, enabled: home });
  const team = useQuery({ queryKey: TEAM_QUERY_KEY, queryFn: fetchTeam, staleTime: FRESH, enabled: about });
  const done = (q: { isSuccess: boolean; isError: boolean }, needed: boolean) => !needed || q.isSuccess || q.isError;
  const settled = done(content, true) && done(covers, !home) && done(slides, home) && done(team, about);
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 4000);
    return () => clearTimeout(t);
  }, []);
  return settled || timedOut;
}
