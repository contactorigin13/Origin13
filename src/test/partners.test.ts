import { describe, expect, it } from "vitest";
import { parsePartners, resolveStudio } from "@/lib/editor-fields";
import { PARTNERS } from "@/data/studio";
describe("partner logos", () => {
  it("shows the original logos until a list is saved", () => {
    expect(resolveStudio({}).partners).toHaveLength(PARTNERS.length);
  });
  it("uses the saved list, dropping entries without a logo", () => {
    const saved = JSON.stringify([{ name: "A", short: "A", logo: "x.png", type: "" }, { name: "B", logo: "" }]);
    expect(parsePartners(saved)?.map(p => p.name)).toEqual(["A"]);
    expect(resolveStudio({ partners_list: saved }).partners).toHaveLength(1);
  });
});
