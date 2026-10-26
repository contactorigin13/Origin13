import { describe, expect, it } from "vitest";
import { SERVICES, WORK_SHOWCASE } from "@/data/studio";
import { PORTFOLIO_CONTENT_FIELDS, resolvePortfolioContent } from "@/lib/portfolio-content";

describe("extended portfolio editing", () => {
  it.each(["documentary", "events", "branding", "digital", "communications"])("applies independently saved headings and descriptions for %s", (id) => {
    const original = SERVICES.find((service) => service.id === id);
    const edited = resolvePortfolioContent({
      [`portfolio_service_${id}_title`]: "Updated heading",
      [`portfolio_service_${id}_summary`]: "Updated description",
    }).services.find((service) => service.id === id);
    expect(edited?.title).toBe("Updated heading");
    expect(edited?.summary).toBe("Updated description");
    expect(original?.title).not.toBe("Updated heading");
    expect(PORTFOLIO_CONTENT_FIELDS.some((field) => field.key === `portfolio_service_${id}_title`)).toBe(true);
    expect(PORTFOLIO_CONTENT_FIELDS.some((field) => field.key === `portfolio_service_${id}_summary`)).toBe(true);
  });

  it("applies accompanying work captions and brand text", () => {
    const edited = resolvePortfolioContent({
      "portfolio_work_w-doc-1_title": "New film",
      "portfolio_work_w-doc-1_blurb": "New film description",
      "portfolio_brand_abbro_name": "Updated brand",
      "portfolio_brand_abbro_description": "Updated brand description",
    });
    expect(edited.tiles.find((tile) => tile.id === "w-doc-1")).toMatchObject({ title: "New film", blurb: "New film description" });
    expect(edited.brands.find((brand) => brand.id === "abbro")).toMatchObject({ name: "Updated brand", description: "Updated brand description" });
  });

  it("preserves all bundled work and default descriptions before edits", () => {
    expect(resolvePortfolioContent({}).tiles).toEqual(WORK_SHOWCASE);
    expect(resolvePortfolioContent({}).services.map(({ formats, ...service }) => service)).toEqual(SERVICES);
  });

  it("parses saved service labels one per line", () => {
    const edited = resolvePortfolioContent({ portfolio_service_documentary_formats: " Films\n\nPhoto stories " });
    expect(edited.services.find((service) => service.id === "documentary")?.formats).toEqual(["Films", "Photo stories"]);
  });
});