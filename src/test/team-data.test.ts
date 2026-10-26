import { describe, expect, it } from "vitest";
import { DEFAULT_TEAM, moveTeamMember, parseTeam } from "@/lib/team-data";

describe("core team", () => {
  it.each([
    ["Geremew Tigabu", "GM, Lead Photographer and Director"],
    ["Meliksenay Debas", "Director of Visuals"],
    ["Kidus Yoseph", "Senior Editor"],
    ["Brook Getachew", "Brand Design Consultant"],
  ])("assigns %s the requested position", (name, role) => {
    expect(DEFAULT_TEAM.find((member) => member.name === name)?.role).toBe(role);
  });
  it("keeps new members and positions in saved data", () => {
    const next = [...DEFAULT_TEAM, { id: "new", name: "New Member", role: "Producer", portrait: "" }];
    expect(parseTeam(JSON.stringify(next))).toEqual(next);
  });
  it("allows all members to be removed without restoring defaults", () => {
    expect(parseTeam("[]")).toEqual([]);
  });
  it("uses defaults only before a team has been saved", () => {
    expect(parseTeam(undefined)).toEqual(DEFAULT_TEAM);
    expect(() => parseTeam("broken")).toThrow();
  });
  it("reorders without changing the original members", () => {
    expect(moveTeamMember(DEFAULT_TEAM, "brook", -1).map((member) => member.id)).toEqual(["geremew", "meliksenay", "brook", "kidus"]);
    expect(DEFAULT_TEAM.map((member) => member.id)).toEqual(["geremew", "meliksenay", "kidus", "brook"]);
  });
});