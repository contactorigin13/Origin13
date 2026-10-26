import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function runtimeSources(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return entry.name === "test" ? [] : runtimeSources(path);
    return /\.[cm]?[jt]sx?$/.test(entry.name) ? [path] : [];
  });
}

describe("website operation without AI credits", () => {
  it("contains no runtime AI gateway, provider client or photo-edit endpoint", () => {
    const forbidden = /ai\.gateway\.lovable\.dev|LOVABLE_API_KEY|\/api\/studio-blue|@ai-sdk\/|from\s*["'](?:openai|@anthropic-ai\/sdk|@google\/generative-ai|@google\/genai|ai)["']/;
    const offenders = runtimeSources(join(process.cwd(), "src"))
      .filter((path) => forbidden.test(readFileSync(path, "utf8")));
    expect(offenders).toEqual([]);
  });
});