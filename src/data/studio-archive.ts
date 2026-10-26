/**
 * Archived brand case study — Ethio Edge.
 *
 * The copy, slide order and identity boards are kept here so the section can be
 * restored later, but nothing in the live site imports this file: the Portfolio
 * page currently shows only the Abbro and Macha Studios brand kits.
 */
import type { WorkTile } from "@/data/studio";
import ethioEdgeOverview from "@/assets/ethio-edge-overview-v5.jpg";
import ethioEdgeIconAsset from "@/assets/ethio-edge-icon.png.asset.json";
import ethioEdgeLogoNavyAsset from "@/assets/ethio-edge-logo-navy.jpg.asset.json";

const ethioEdgeIcon = ethioEdgeIconAsset.url;
const ethioEdgeLogoNavy = ethioEdgeLogoNavyAsset.url;

export const ARCHIVED_BRAND_CLIENTS = [
  { id: "ethioedge", name: "Ethio Edge", description: "Technology & entertainment YouTube channel · Addis Ababa, Ethiopia" },
];

export const ARCHIVED_WORK_SHOWCASE: WorkTile[] = [
  { id: "w-edge-kit", chapter: "01 — Overview", title: "Ethio Edge — Tech, told from here.", service: "branding", client: "ethioedge", kind: "photo", image: ethioEdgeOverview, blurb: "Ethio Edge is an upcoming YouTube channel covering technology and entertainment from an Ethiopian perspective — reviews, explainers and stories about the tools shaping everyday life. The identity was built around four qualities: curiosity, clarity, energy and optimism." },
  { id: "w-edge-challenge", chapter: "02 — The Challenge", title: "Ethio Edge — Standing out in the feed.", service: "branding", client: "ethioedge", kind: "photo", image: ethioEdgeIcon, blurb: "Tech channels all look the same: dark gradients, neon glow, shouting thumbnails. Ethio Edge needed to feel bold enough to win the click, yet credible enough to be trusted — and unmistakably Ethiopian without leaning on clichés." },
  { id: "w-edge-solution", chapter: "03 — The Solution", title: "Ethio Edge — Four tiles, one spark.", service: "branding", client: "ethioedge", kind: "photo", image: ethioEdgeLogoNavy, blurb: "The symbol is a grid of four rounded tiles — a nod to app icons, video grids and building blocks — with a single orange tile breaking the pattern: the edge. A heavy condensed wordmark gives the name the confidence of a headline, and the mark scales down cleanly to a channel avatar." },
  { id: "w-edge-palette", chapter: "04 — The Visual Language", title: "Ethio Edge — Deep navy, live signal.", service: "branding", client: "ethioedge", kind: "photo", blurb: "Royal blue leads, exactly as it does in the mark, with a single move of signal orange. Deep navy is the studio at night — the canvas every video starts from — and a volt yellow-green is kept only for rare, loud moments.", board: { type: "palette", colors: [
    { name: "Edge Blue", hex: "#1B5FAD", role: "Primary · interface" },
    { name: "Signal Orange", hex: "#F15A24", role: "Accent · action" },
    { name: "Deep Navy", hex: "#211E4E", role: "Canvas · night" },
    { name: "Volt", hex: "#C8D92E", role: "Rare · loud" },
  ] } },
  { id: "w-edge-type", chapter: "05 — Typography", title: "Ethio Edge — Built like a headline.", service: "branding", client: "ethioedge", kind: "photo", blurb: "Bebas Neue matches the wordmark's tall, condensed capitals, so titles and thumbnails read at a glance on any screen. Archivo's lighter weights keep descriptions, lower thirds and captions calm and legible.", board: { type: "type", display: { family: "Bebas Neue", stack: "'Bebas Neue', system-ui, sans-serif", weight: 400, sample: "ETHIO EDGE" }, text: { family: "Archivo", stack: "'Archivo', system-ui, sans-serif", sample: "New videos every week — technology and entertainment, explained from Addis Ababa." }, ink: "#F4F3EE", paper: "#211E4E", accent: "#F15A24" } },
  { id: "w-edge-merch", chapter: "06 — Applications", title: "Ethio Edge — A studio you can wear.", service: "branding", client: "ethioedge", kind: "photo", image: ethioEdgeOverview, blurb: "The four-tile mark works anywhere an app icon does: mugs, notebooks, stickers and set dressing. On screen it anchors intros, lower thirds and end cards, so every upload feels like it comes from one place." },
  { id: "w-edge-digital", chapter: "07 — Digital Experience", title: "Ethio Edge — Made for the platform.", service: "branding", client: "ethioedge", kind: "photo", image: ethioEdgeLogoNavy, blurb: "The channel page, thumbnails and avatar share one system: navy ground, blue structure, one orange move. The mark stays recognisable at favicon size, and the palette keeps every thumbnail consistent in a crowded subscription feed." },
];
