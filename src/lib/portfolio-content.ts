import { type IdentityBoard, BRAND_CLIENTS, SERVICES, WORK_SHOWCASE } from "@/data/studio";

export const PORTFOLIO_FORMATS: Record<string, string[]> = {
  documentary: ["Films", "Photo essays", "Field reports"],
  events: ["Live streams", "Recordings", "Highlight reels"],
  branding: ["Logos", "Guidelines", "Reports", "Exhibitions"],
  digital: ["Social posts", "Ads", "Monthly results"],
  communications: ["Plans", "Key messages", "Creative direction"],
};

export const PORTFOLIO_CONTENT_FIELDS = [
  ...SERVICES.flatMap((service) => [
    { key: `portfolio_service_${service.id}_number` as const, label: `Portfolio — ${service.title} — number`, multiline: false, default: service.number },
    { key: `portfolio_service_${service.id}_title` as const, label: `Portfolio — ${service.number}. ${service.title} — heading`, multiline: false, default: service.title },
    { key: `portfolio_service_${service.id}_summary` as const, label: `Portfolio — ${service.number}. ${service.title} — description`, multiline: true, default: service.summary },
    { key: `portfolio_service_${service.id}_formats` as const, label: `Portfolio — ${service.number}. ${service.title} — labels (one per line)`, multiline: true, default: (PORTFOLIO_FORMATS[service.id] ?? []).join("\n") },
  ]),
  ...BRAND_CLIENTS.flatMap((brand) => [
    { key: `portfolio_brand_${brand.id}_name` as const, label: `Portfolio — ${brand.name} — name`, multiline: false, default: brand.name },
    { key: `portfolio_brand_${brand.id}_description` as const, label: `Portfolio — ${brand.name} — description`, multiline: true, default: brand.description },
  ]),
  ...WORK_SHOWCASE.flatMap((tile) => [
    { key: `portfolio_work_${tile.id}_title` as const, label: `Portfolio — ${tile.title} — caption heading`, multiline: false, default: tile.title },
    { key: `portfolio_work_${tile.id}_blurb` as const, label: `Portfolio — ${tile.title} — caption text`, multiline: true, default: tile.blurb },
  ]),
];

export function parseIdentityBoard(value: string | undefined, fallback: IdentityBoard | undefined): IdentityBoard | undefined {
  if (value === undefined) return fallback;
  try {
    const board = JSON.parse(value);
    const color = (v: unknown) => typeof v === "string" && /^#[0-9a-fA-F]{6}$/.test(v);
    if (board.type === "palette" && Array.isArray(board.colors) && board.colors.length > 0 && board.colors.every((c: {name?: unknown; hex?: unknown; role?: unknown}) => typeof c.name === "string" && typeof c.role === "string" && color(c.hex))) return board;
    if (board.type === "type" && typeof board.display?.family === "string" && typeof board.display?.stack === "string" && typeof board.display?.sample === "string" && typeof board.display?.weight === "number" && typeof board.text?.family === "string" && typeof board.text?.stack === "string" && typeof board.text?.sample === "string" && color(board.ink) && color(board.paper) && color(board.accent)) return board;
  } catch { /* Preserve the original board when malformed. */ }
  return fallback;
}

/** Apply portfolio-only overrides without changing service copy on other pages. */
export function resolvePortfolioContent(content: Record<string, string>) {
  return {
    services: SERVICES.map((service) => ({
      ...service,
      number: content[`portfolio_service_${service.id}_number`] ?? service.number,
      title: content[`portfolio_service_${service.id}_title`] ?? service.title,
      summary: content[`portfolio_service_${service.id}_summary`] ?? service.summary,
      formats: (content[`portfolio_service_${service.id}_formats`] ?? (PORTFOLIO_FORMATS[service.id] ?? []).join("\n"))
        .split("\n").map((label) => label.trim()).filter(Boolean),
    })),
    brands: BRAND_CLIENTS.map((brand) => ({
      ...brand,
      name: content[`portfolio_brand_${brand.id}_name`] ?? brand.name,
      description: content[`portfolio_brand_${brand.id}_description`] ?? brand.description,
    })),
    tiles: WORK_SHOWCASE.map((tile) => ({
      ...tile,
      title: content[`portfolio_work_${tile.id}_title`] ?? tile.title,
      blurb: content[`portfolio_work_${tile.id}_blurb`] ?? tile.blurb,
      ...(content[`portfolio_work_${tile.id}_image`] !== undefined ? { image: content[`portfolio_work_${tile.id}_image`] } : {}),
      ...(tile.chapter ? { chapter: content[`portfolio_work_${tile.id}_chapter`] ?? tile.chapter } : {}),
      ...(tile.board ? { board: parseIdentityBoard(content[`portfolio_work_${tile.id}_board`], tile.board) ?? tile.board } : {}),
    })),
  };
}

export type PortfolioContent = ReturnType<typeof resolvePortfolioContent>;