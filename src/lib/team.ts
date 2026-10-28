import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cachedSignedUrls } from "@/lib/signed-urls";
import { BUCKET, isStoragePath } from "@/lib/projects";
import { DEFAULT_TEAM, TEAM_CONTENT_KEY, parseTeam, placeholderPortrait, type TeamMember, type DisplayTeamMember } from "@/lib/team-data";

export const TEAM_QUERY_KEY = ["team"] as const;

export async function resolveTeam(members: TeamMember[]): Promise<DisplayTeamMember[]> {
  const paths = members.filter((member) => isStoragePath(member.portrait)).map((member) => member.portrait.slice(8));
  const signed = new Map<string, string>();
  if (paths.length) {
    const { data, error } = await cachedSignedUrls(BUCKET, paths, 60 * 60 * 24 * 7);
    if (error) throw error;
    for (const row of data ?? []) if (row.path && row.signedUrl) signed.set(row.path, row.signedUrl);
  }
  return members.map((member) => ({
    ...member,
    temporary: member.portrait.startsWith("placeholder:"),
    display_url: isStoragePath(member.portrait) ? signed.get(member.portrait.slice(8)) ?? "" : placeholderPortrait(member.portrait),
  }));
}

export async function fetchTeam(): Promise<DisplayTeamMember[]> {
  const { data, error } = await supabase.from("content").select("value").eq("key", TEAM_CONTENT_KEY).maybeSingle();
  if (error) throw error;
  return resolveTeam(parseTeam(data?.value));
}

export async function saveTeam(members: TeamMember[]): Promise<void> {
  const value = JSON.stringify(members.map(({ id, name, role, portrait }) => ({ id, name, role, portrait })));
  parseTeam(value);
  const { error } = await supabase.from("content").upsert({ key: TEAM_CONTENT_KEY, value, updated_at: new Date().toISOString() });
  if (error) throw error;
}

export function useTeam() {
  return useQuery({ queryKey: TEAM_QUERY_KEY, queryFn: fetchTeam, staleTime: 10_000 });
}

export const FALLBACK_TEAM: DisplayTeamMember[] = DEFAULT_TEAM.map((member) => ({
  ...member, display_url: placeholderPortrait(member.portrait), temporary: true,
}));