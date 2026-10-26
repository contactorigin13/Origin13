import { z } from "zod";
import geremewBlue from "@/assets/team-geremew-blue.jpg";
const geremew = geremewBlue;
import meliksenayBlue from "@/assets/team-meliksenay-blue.jpg";
const meliksenay = meliksenayBlue;
import kidusBlue from "@/assets/team-kidus-blue.jpg";
const kidus = kidusBlue;
import brookBlue from "@/assets/team-brook-blue.jpg";
const brook = brookBlue;

export const TEAM_CONTENT_KEY = "about_team";
export const teamMemberSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1),
  role: z.string().trim().min(1),
  portrait: z.string(),
});
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type DisplayTeamMember = TeamMember & { display_url: string; temporary: boolean };

export const DEFAULT_TEAM: TeamMember[] = [
  { id: "geremew", name: "Geremew Tigabu", role: "GM, Lead Photographer and Director", portrait: "placeholder:geremew" },
  { id: "meliksenay", name: "Meliksenay Debas", role: "Director of Visuals", portrait: "placeholder:meliksenay" },
  { id: "kidus", name: "Kidus Yoseph", role: "Senior Editor", portrait: "placeholder:kidus" },
  { id: "brook", name: "Brook Getachew", role: "Brand Design Consultant", portrait: "placeholder:brook" },
];

const portraits: Record<string, string> = { geremew, meliksenay, kidus, brook };
export function placeholderPortrait(portrait: string): string {
  return portraits[portrait.replace(/^placeholder:/, "")] ?? "";
}

export function parseTeam(value: string | undefined): TeamMember[] {
  if (value === undefined) return DEFAULT_TEAM.map((member) => ({ ...member }));
  try {
    return z.array(teamMemberSchema).parse(JSON.parse(value));
  } catch {
    throw new Error("The saved team could not be loaded. Please try again.");
  }
}

export function moveTeamMember(members: TeamMember[], id: string, direction: -1 | 1): TeamMember[] {
  const index = members.findIndex((member) => member.id === id);
  const destination = index + direction;
  if (index < 0 || destination < 0 || destination >= members.length) return members;
  const next = [...members];
  const member = next[index];
  const adjacent = next[destination];
  if (!member || !adjacent) return members;
  next[index] = adjacent;
  next[destination] = member;
  return next;
}