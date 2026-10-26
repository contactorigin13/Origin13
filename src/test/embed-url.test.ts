import { describe, expect, it } from "vitest";
import { toEmbedUrl } from "@/lib/projects";

describe("toEmbedUrl", () => {
  it("converts YouTube watch links", () => {
    expect(toEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
  });
  it("converts youtu.be short links", () => {
    expect(toEmbedUrl("https://youtu.be/dQw4w9WgXcQ?t=3")).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
  });
  it("converts Vimeo links", () => {
    expect(toEmbedUrl("https://vimeo.com/76979871")).toBe("https://player.vimeo.com/video/76979871");
  });
});
