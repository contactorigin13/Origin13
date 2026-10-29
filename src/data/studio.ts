import websiteMedia10 from "@/assets/crew.jpg.asset.json";
import websiteMedia11 from "@/assets/danakil.jpg.asset.json";
import websiteMedia12 from "@/assets/dorze.jpg.asset.json";
import websiteMedia13 from "@/assets/elders.jpg.asset.json";
import websiteMedia14 from "@/assets/piazza.jpg.asset.json";
import websiteMedia15 from "@/assets/slide-1.jpg.asset.json";
import websiteMedia16 from "@/assets/slide-2.jpg.asset.json";
import websiteMedia17 from "@/assets/slide-3.jpg.asset.json";
import websiteMedia18 from "@/assets/slide-4.jpg.asset.json";
import websiteMedia20 from "@/assets/work-digital.jpg.asset.json";
import websiteMedia21 from "@/assets/work-event.jpg.asset.json";
import websiteMedia22 from "@/assets/logo-africacdc.png.asset.json";
import websiteMedia24 from "@/assets/logo-ictj.png.asset.json";
import websiteMedia25 from "@/assets/logo-lpi.png.asset.json";
import websiteMedia26 from "@/assets/logo-wiher.png.asset.json";
import gfnLogo from "@/assets/partner-gfn-transparent.png.asset.json";
import seiLogo from "@/assets/partner-sei.png.asset.json";
import itaLogo from "@/assets/partner-ita-transparent.png.asset.json";
import edctpLogo from "@/assets/partner-edctp-transparent.png.asset.json";
import vitalLogo from "@/assets/partner-vital-transparent.png.asset.json";
import rcnLogo from "@/assets/partner-rcn-transparent.png.asset.json";
import abbroPackagingAsset from "@/assets/abbro-packaging-mockup.webp.asset.json";
const abbroPackaging = abbroPackagingAsset.url;
import abbroShoppingAsset from "@/assets/abbro-shopping-mockup.webp.asset.json";
const abbroShopping = abbroShoppingAsset.url;
import abbroBrandKitAsset from "@/assets/abbro-brand-kit-mockup-refined.webp.asset.json";
const abbroBrandKit = abbroBrandKitAsset.url;
import abbroOverview from "@/assets/abbro-overview-van.jpg";
import abbroWordmark from "@/assets/abbro-wordmark.svg";
import machaOverview from "@/assets/macha-overview-wedding.jpg";
import machaBrandKitAsset from "@/assets/macha-brand-kit-mockup.webp.asset.json";
const machaBrandKit = machaBrandKitAsset.url;
import machaAlbumAsset from "@/assets/macha-album-mockup.webp.asset.json";
const machaAlbum = machaAlbumAsset.url;
import machaScreenAsset from "@/assets/macha-screen-mockup.webp.asset.json";
const machaScreen = machaScreenAsset.url;

export type Story = {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  partner?: string;
  category: "documentary" | "stills";
  image: string;
  synopsis: string;
  fieldNotes: string;
  quote?: string;
};

export const COMPANY = {
  name: "Origin 13 Communication PLC",
  short: "Origin 13",
  domain: "www.origin13.com",
  email: "info@origin13.com",
  phone: "+251 9 58 38 78 38",
  phoneHref: "tel:+251958387838",
  address: "22, Rebka Bldg, 2nd Floor, Office no. 202",
  location: "Addis Ababa, Ethiopia",
  hours: "Monday – Friday, 8:30 AM – 5:30 PM (EAT)",
  years: "12+",
  region: "East Africa & Pan-African Engagements",
};

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/contact", label: "Contact" },
] as const;

export type HeroSlide = {
  id: string;
  tag: string;
  headline: string;
  subheadline: string;
  button: { label: string; to: "/portfolio" | "/services" | "/contact" };
  image: string;
};

/** Home hero slides — one per service, in order. */
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "hero-documentary",
    tag: "Documentary Films & Photography",
    headline: "The Truth, In Motion.",
    subheadline:
      "We go where the story lives. Cinematic filmmaking and raw photojournalism that capture the unfiltered pulse of East Africa, told with dignity, depth, and a proximity that defies distance.",
    button: { label: "Experience the Work", to: "/portfolio" },
    image: websiteMedia15.url,
  },
  {
    id: "hero-events",
    tag: "Live Event Coverage & Broadcasting",
    headline: "Capturing the Now.",
    subheadline:
      "When the room goes live, there are no second takes. Flawless multicamera broadcast engineering that turns high stakes summits and cultural milestones into borderless global experiences.",
    button: { label: "See Our Setup", to: "/services" },
    image: websiteMedia21.url,
  },
  {
    id: "hero-branding",
    tag: "Brand Design & Visual Identity",
    headline: "Visuals That Speak Volumes.",
    subheadline:
      "A brand is more than a logo; it is a legacy. We craft striking visual identities and bold design systems that command attention and anchor your institutional authority.",
    button: { label: "View Brand Systems", to: "/portfolio" },
    image: websiteMedia12.url,
  },
  {
    id: "hero-digital",
    tag: "Digital Marketing & Campaigns",
    headline: "Igniting Digital Movements.",
    subheadline:
      "We do not just add to the noise; we cut right through it. Precision campaigns and highly targeted digital strategies designed to spark conversations, move audiences, and deliver undeniable impact.",
    button: { label: "Amplify Your Reach", to: "/services" },
    image: websiteMedia20.url,
  },
  {
    id: "hero-communications",
    tag: "Strategic Communications & Creative Direction",
    headline: "Shaping the Narrative.",
    subheadline:
      "Complex missions require visionary translation. We provide the creative compass and strategic messaging to bridge the gap between your highest ambitions and the public imagination.",
    button: { label: "Start the Conversation", to: "/contact" },
    image: websiteMedia10.url,
  },
];

export const FEATURED: Story[] = [
  {
    id: "gfn-seedlings",
    title: "Misting the Highland Seedlings",
    subtitle: "Nursery propagation and community food security",
    location: "Highland Greenhouses, Ethiopia",
    partner: "Global Food Banking Network",
    category: "stills",
    image: websiteMedia15.url,
    synopsis:
      "Inside community-managed highland greenhouses, a worker sprays a fine mist across nursery beds as others carry trays of young seedlings. Origin 13 documented this vital chain of food security and smallholder climate resilience for the Global Food Banking Network.",
    fieldNotes:
      "Captured on prime cinema optics in morning mist and diffused skylight. No staging — only the quiet cadence of agricultural stewardship.",
    quote:
      "Food sovereignty begins in the quiet dedication of the nursery. Honoring the people who nurture life from soil requires unhurried observation.",
  },
  {
    id: "africa-cdc-lab",
    title: "The Cold Chain Sentinel",
    subtitle: "Continental genomic surveillance and African scientific leadership",
    location: "Addis Ababa, Ethiopia",
    partner: "Africa CDC",
    category: "documentary",
    image: websiteMedia16.url,
    synopsis:
      "Inside the laboratories powering continental disease surveillance, African scientists and technicians maintain the standards that protect millions. A film that shifts the narrative from vulnerability to leadership.",
    fieldNotes:
      "Filmed inside high-containment laboratories with sterile optical housings and minimal-footprint cinema kits.",
    quote: "Visual evidence that shifts the narrative from vulnerability to African scientific leadership.",
  },
  {
    id: "under-the-net",
    title: "Under the Net",
    subtitle: "Malaria prevention and the dignity of the household",
    location: "Rural Ethiopia",
    partner: "Community Health Programs",
    category: "stills",
    image: websiteMedia17.url,
    synopsis:
      "A single shaft of light, a mosquito net raised at dusk. A quiet study of the everyday rituals that stand between families and preventable disease.",
    fieldNotes: "Available light only. Shot with a fast prime to preserve the darkness of the room and the privacy of the subject.",
    quote: "Health diplomacy succeeds when evidence centers the household, not the statistic.",
  },
  {
    id: "field-visit",
    title: "Ground Truth",
    subtitle: "Field verification with frontline health and agriculture teams",
    location: "Ethiopia",
    partner: "Institutional Partners",
    category: "documentary",
    image: websiteMedia18.url,
    synopsis:
      "Program teams walk the ground with the people who run it every day. Origin 13 documents site visits so decision-makers far away can see what is really happening.",
    fieldNotes: "Run-and-gun coverage with a two-person crew and wireless lavaliers for natural conversation.",
  },
];

export const PARTNERS = [
  { name: "International Center for Transitional Justice", short: "ICTJ", logo: websiteMedia24.url, type: "Human Rights & Rule of Law" },
  { name: "Africa Centres for Disease Control and Prevention", short: "Africa CDC", logo: websiteMedia22.url, type: "Public Health" },
  { name: "Global Food Banking Network", short: "GFN", logo: gfnLogo.url, type: "Food Security" },
  { name: "Women in Health Education and Rights", short: "WI HER", logo: websiteMedia26.url, type: "Gender & Health" },
  { name: "Life and Peace Institute", short: "LPI", logo: websiteMedia25.url, type: "Peacebuilding" },
  { name: "Stockholm Environment Institute", short: "SEI", logo: seiLogo.url, type: "Environment & Sustainability" },
  { name: "Italian Trade Agency", short: "ITA", logo: itaLogo.url, type: "Trade & Investment" },
  { name: "European & Developing Countries Clinical Trials Partnership", short: "EDCTP", logo: edctpLogo.url, type: "Health Research" },
  { name: "Vital Strategies", short: "VS", logo: vitalLogo.url, type: "Public Health" },
  { name: "Resilient Cities Network", short: "RCN", logo: rcnLogo.url, type: "Urban Resilience" },
];

export const SERVICES = [
  {
    id: "documentary",
    number: "01",
    title: "Documentary Films & Photography",
    summary: "We film real stories and take photographs that show your work and the people behind it.",
    details: [
      "Short and long documentaries",
      "Films about project results and field evaluations",
      "4K and 8K filming equipment",
      "Editorial photography and photo essays",
    ],
    image: websiteMedia10.url,
  },
  {
    id: "events",
    number: "02",
    title: "Live Event Coverage & Broadcasting",
    summary: "We record and stream your events so people can take part from anywhere.",
    details: [
      "Multi-camera live streaming and switching",
      "Conference and summit coverage",
      "Audio and video recording of talks and panels",
      "Quick highlight videos for social media",
    ],
    image: websiteMedia18.url,
  },
  {
    id: "branding",
    number: "03",
    title: "Brand Design & Visual Identity",
    summary: "We give your organization a clear, consistent look, in print and online.",
    details: [
      "Logos, brand guidelines and visual identity",
      "Publications and annual reports",
      "Designs for websites, social media and print",
      "Exhibition design and gallery planning",
    ],
    image: abbroPackaging,
  },
  {
    id: "digital",
    number: "04",
    title: "Digital Marketing & Campaigns",
    summary: "We help you reach the right people, share your message and track what works.",
    details: [
      "Social media campaigns and account management",
      "Targeted paid online advertising",
      "Content planning and results tracking",
      "Community growth and public outreach",
    ],
    image: websiteMedia18.url,
  },
  {
    id: "communications",
    number: "05",
    title: "Strategic Communications & Creative Direction",
    summary: "We turn your goals into clear messages and guide the creative work from start to finish.",
    details: [
      "Creative ideas and project plans",
      "Visual direction for advocacy campaigns",
      "Recording and sharing organizational knowledge",
      "Color grading and sound design",
    ],
    image: websiteMedia10.url,
  },
];

export const PORTFOLIO: Story[] = [
  {
    id: "transitional-justice",
    title: "Pathways to Redress",
    subtitle: "Voices of transitional justice and survivor agency",
    location: "Tigray, Amhara & Oromia",
    partner: "ICTJ",
    category: "documentary",
    image: websiteMedia17.url,
    synopsis:
      "A multi-part documentary series examining community-level truth-seeking and survivor-centered reparations in post-conflict regions, built on trauma-informed interviews with more than 60 elders, survivors and legal scholars.",
    fieldNotes: "Produced under rigorous informed-consent protocols with anonymization where participants requested it.",
    quote: "Origin 13 captured nuanced testimony with dignity and ethical care that honored survivor agency above all.",
  },
  ...FEATURED.filter((story) => story.id === "africa-cdc-lab").map((story) => ({ ...story, id: "cdc-sentinel" })),
  {
    id: "grain-and-grace",
    title: "Grain & Grace",
    subtitle: "Community food security networks and school feeding",
    location: "Southern Ethiopia & Oromia",
    partner: "Global Food Banking Network",
    category: "documentary",
    image: websiteMedia15.url,
    synopsis:
      "An intimate portrait of volunteer-run school feeding cooperatives and grain banks that soften climate-driven drought shocks and prevent post-harvest loss.",
    fieldNotes: "Shot across four harvest seasons to show drought contrast and community grain reserves in action.",
    quote: "Direct, clear storytelling that resonated with global philanthropic partners and expanded funding lines.",
  },
  {
    id: "frontline-midwives",
    title: "The Frontline Midwives",
    subtitle: "Dignity in maternal care",
    location: "Afar Region",
    partner: "WI HER",
    category: "documentary",
    image: websiteMedia18.url,
    synopsis:
      "Documenting female community health workers dismantling barriers to safe delivery, and the trust built between pastoralist women and trained birth attendants.",
    fieldNotes: "Filmed with female camera operators to ensure cultural respect and safety for participants.",
    quote: "Our international stakeholders could finally see the human faces driving community health transformation.",
  },
  {
    id: "common-soil",
    title: "Common Soil",
    subtitle: "Cross-border peace dialogues",
    location: "Borena Zone & Kenya border",
    partner: "Life and Peace Institute",
    category: "documentary",
    image: websiteMedia13.url,
    synopsis:
      "A longitudinal chronicle of peace covenants negotiated by customary elder councils along migratory pasture routes, preserving customary proceedings and youth dialogue circles.",
    fieldNotes: "Multilingual audio capture in Afaan Oromo, Borana and Amharic with simultaneous editorial translation.",
    quote: "Origin 13’s team understands the delicate architecture of community peace processes.",
  },
  {
    id: "piazza",
    title: "Piazza Arcades",
    subtitle: "The shadow of stone — a monochrome essay",
    location: "Piazza, Addis Ababa",
    category: "stills",
    image: websiteMedia14.url,
    synopsis:
      "A 35-plate black-and-white monograph of Addis Ababa’s 1930s architectural hybrids, tailor workshops and coffee houses.",
    fieldNotes: "Medium-format digital capture; printed on 310gsm cotton rag baryta paper.",
    quote: "A visual testament to urban continuity and historic craftsmanship.",
  },
  {
    id: "danakil",
    title: "Depression of White Gold",
    subtitle: "Danakil salt trails, 120m below sea level",
    location: "Danakil Depression, Afar",
    category: "stills",
    image: websiteMedia11.url,
    synopsis:
      "A high-contrast study of centuries-old salt extraction traditions: geometric salt pans, heat mirages and the quiet dignity of the caravan guides.",
    fieldNotes: "Ambient temperature reached 48°C; dust-sealed bodies and solar charging rigs throughout.",
    quote: "Raw landscape minimalism juxtaposed with timeless human endurance.",
  },
  {
    id: "dorze",
    title: "The Loom, the Bamboo & the Hive",
    subtitle: "Southern artisans of the Gamo Highlands",
    location: "Chencha & Dorze",
    category: "stills",
    image: websiteMedia12.url,
    synopsis:
      "Portraits of master weavers creating tibeb patterns on hand-hewn looms inside soaring woven bamboo homesteads.",
    fieldNotes: "Lit solely by hearth fires and shafts of highland light through open doorways.",
    quote: "Honoring indigenous Ethiopian technology, design and intangible heritage.",
  },
];

export const PILLARS = [
  {
    title: "Local knowledge",
    body: "We know the places and communities we work in. We take time to listen and understand before we film.",
  },
  {
    title: "Quality work",
    body: "We use professional cameras, lighting and sound equipment to make films and photographs ready for TV, events and online use.",
  },
  {
    title: "Respect for people",
    body: "We ask permission, protect people's privacy and take care when working with sensitive stories.",
  },
];

export const HONORS = [
  { title: "LagosPhoto Festival", body: "Selected for curated exhibitions on African visual autonomy and contemporary documentary practice." },
  { title: "The New York Times Portfolio Review", body: "Recognized by international photo editors and curators for ethical long-form work." },
  { title: "12+ Years of East African Fieldwork", body: "On-the-ground operations across Ethiopia, Kenya, Somalia, Djibouti and South Sudan." },
];

export const PROCESS = [
  { step: "01", title: "Listen", body: "Tell us your goals, your audience and what you need." },
  { step: "02", title: "Plan", body: "We agree on the approach, schedule and budget." },
  { step: "03", title: "Create", body: "Our team films, photographs, designs or runs your campaign." },
  { step: "04", title: "Deliver", body: "We review the work with you and prepare the final files." },
];

export const STATS = [
  { value: "12+", label: "Years in the field" },
  { value: "5", label: "Countries operated" },
  { value: "60+", label: "Testimonies recorded for a single series" },
  { value: "4K", label: "Cinema-grade delivery" },
];

export type WorkTile = {
  id: string;
  title: string;
  service: string; // service id from SERVICES
  kind: "photo" | "video";
  image?: string; // photos only; videos use an animated placeholder
  blurb: string;
  client?: string;
  tall?: boolean; // taller tile in the grid
  /** Identity case-study chapter label, e.g. "01 — Overview". */
  chapter?: string;
  /** Code-drawn identity board shown instead of a photo. */
  board?: IdentityBoard;
};

export type IdentityBoard =
  | { type: "palette"; colors: { name: string; hex: string; role: string }[] }
  | { type: "type"; display: { family: string; stack: string; weight: number; sample: string; image?: string }; text: { family: string; stack: string; sample: string }; ink: string; paper: string; accent: string };

export const BRAND_CLIENTS = [
  { id: "abbro", name: "Abbro", description: "E-commerce platform · Addis Ababa, Ethiopia" },
  { id: "macha", name: "Macha Studios", description: "Documentary-style wedding photography & films · Addis Ababa, Ethiopia" },
];

/** Placeholder work tiles, one set per service, until real projects are uploaded. */
export const WORK_SHOWCASE: WorkTile[] = [
  { id: "w-doc-1", title: "Misting the Highland Seedlings", service: "documentary", kind: "photo", image: websiteMedia15.url, blurb: "Nursery work and community food security, filmed for the Global Food Banking Network." },
  { id: "w-doc-2", title: "The Cold Chain Sentinel", service: "documentary", kind: "video", blurb: "Inside the laboratories behind continental disease surveillance.", tall: true },
  { id: "w-doc-3", title: "Under the Net", service: "documentary", kind: "photo", image: websiteMedia17.url, blurb: "A quiet study of the everyday rituals that protect families from malaria." },
  { id: "w-evt-1", title: "Summit Live Coverage", service: "events", kind: "video", blurb: "Multi-camera live streaming for a continental conference.", tall: true },
  { id: "w-evt-2", title: "On Stage", service: "events", kind: "photo", image: websiteMedia21.url, blurb: "Full event coverage, from the main stage to the closing panel." },
  { id: "w-evt-3", title: "Highlight Reels", service: "events", kind: "photo", image: websiteMedia18.url, blurb: "Same-day highlight videos ready for social media." },
  // Abbro — full identity case study
  { id: "w-brd-kit", chapter: "01 — Overview", title: "Abbro — Shopping, together.", service: "branding", client: "abbro", kind: "photo", image: abbroOverview, blurb: "Abbro is an Ethiopian e-commerce platform that brings sellers and buyers into one trusted marketplace. The name comes from the Amharic አብሮ — “together” — and the identity was built around four qualities: connection, trust, speed and optimism." },
  { id: "w-brd-challenge", chapter: "02 — The Challenge", title: "Abbro — Making online shopping feel safe.", service: "branding", client: "abbro", kind: "photo", image: abbroShopping, blurb: "For many shoppers in Addis Ababa, buying online still feels uncertain. Abbro needed an identity that felt modern and energetic enough to stand out on a phone screen, yet warm and dependable enough to earn first-time trust." },
  { id: "w-brd-solution", chapter: "03 — The Solution", title: "Abbro — Two people, one connection.", service: "branding", client: "abbro", kind: "photo", image: abbroBrandKit, blurb: "The symbol shows two figures joined by a single line — a buyer and a seller, linked. Set inside a rounded yellow square, it reads clearly as an app icon. A friendly, rounded lowercase wordmark keeps the brand approachable and easy to say." },
  { id: "w-brd-palette", chapter: "04 — The Visual Language", title: "Abbro — A colour that means “go”.", service: "branding", client: "abbro", kind: "photo", blurb: "A bright signal yellow carries the brand’s optimism and is used for anything that invites action. Deep black brings confidence and clarity, while white and kraft keep the system calm and practical across screens and packaging.", board: { type: "palette", colors: [
    { name: "Signal Yellow", hex: "#F5E21B", role: "Primary · action" },
    { name: "Ink Black", hex: "#111111", role: "Text · contrast" },
    { name: "Paper White", hex: "#FAFAF7", role: "Space · calm" },
    { name: "Kraft", hex: "#C9A27A", role: "Packaging" },
  ] } },
  { id: "w-brd-type", chapter: "05 — Typography", title: "Abbro — Bold, rounded, friendly.", service: "branding", client: "abbro", kind: "photo", blurb: "Abbro is a custom typeface drawn for the brand: heavy, even strokes, soft circular bowls and rounded lowercase shapes that feel friendly and confident. Made only for Abbro, it gives the name a voice no other shop can borrow, and stays legible from an app icon to the side of a van.", board: { type: "type", display: { family: "Abbro", stack: "'Nunito', system-ui, sans-serif", weight: 800, sample: "abbro", image: abbroWordmark }, text: { family: "Nunito", stack: "'Nunito', system-ui, sans-serif", sample: "Order today, delivered tomorrow. Fresh finds from sellers across Addis Ababa." }, ink: "#111111", paper: "#F5E21B", accent: "#111111" } },
  { id: "w-brd-pattern", chapter: "06 — Brand Pattern", title: "Abbro — A network of connections.", service: "branding", client: "abbro", kind: "photo", image: abbroBrandKit, blurb: "The connecting line from the symbol extends into a network pattern of dots and links — every node a person, every line a delivery. It wraps tissue paper, mailers and social posts, so the idea of “together” travels with every order." },
  { id: "w-brd-1", chapter: "07 — Applications", title: "Abbro — From screen to doorstep.", service: "branding", client: "abbro", kind: "photo", image: abbroPackaging, blurb: "Kraft delivery boxes carry the yellow symbol so a package is recognised the moment it arrives. Stationery, business cards and courier materials share the same system, making every touchpoint feel like one brand." },
  { id: "w-brd-2", chapter: "08 — Digital Experience", title: "Abbro — Built for the phone first.", service: "branding", client: "abbro", kind: "photo", image: abbroShopping, blurb: "The online store uses yellow only for actions like “Add to cart” and “Checkout”, letting products take centre stage. The result is a fast, familiar shopping experience on desktop and mobile." },
  // Macha Studios — full identity case study
  { id: "w-macha-kit", chapter: "01 — Overview", title: "Macha Studios — Love stories, honestly told.", service: "branding", client: "macha", kind: "photo", image: machaOverview, blurb: "Macha Studios creates documentary-style wedding photography and films in Addis Ababa. The identity was shaped around four qualities: honesty, timelessness, intimacy and craft." },
  { id: "w-macha-challenge", chapter: "02 — The Challenge", title: "Macha Studios — Quiet in a loud market.", service: "branding", client: "macha", kind: "photo", image: machaAlbum, blurb: "Wedding photography is crowded with ornate, glossy branding. Macha needed to feel premium and editorial without decoration — a brand that steps back, so the couple’s real moments can lead." },
  { id: "w-macha-solution", chapter: "03 — The Solution", title: "Macha Studios — The frame as a promise.", service: "branding", client: "macha", kind: "photo", image: machaBrandKit, blurb: "The symbol is a single open frame with one softened corner — a viewfinder, a photograph and an album at once. The gap in the line stands for moments that are never staged. Clean capitals give the wordmark a calm, timeless confidence." },
  { id: "w-macha-palette", chapter: "04 — The Visual Language", title: "Macha Studios — Ivory and charcoal.", service: "branding", client: "macha", kind: "photo", blurb: "A restrained palette of warm ivory and deep charcoal recalls fine-art paper and darkroom prints. Soft linen and a muted stone grey add texture, letting the photographs bring all the colour.", board: { type: "palette", colors: [
    { name: "Ivory", hex: "#F3EFE4", role: "Primary · paper" },
    { name: "Charcoal", hex: "#2B2B2B", role: "Text · contrast" },
    { name: "Linen", hex: "#E3DCCB", role: "Texture" },
    { name: "Stone", hex: "#9C978C", role: "Details" },
  ] } },
  { id: "w-macha-type", chapter: "05 — Typography", title: "Macha Studios — Editorial and calm.", service: "branding", client: "macha", kind: "photo", blurb: "Montserrat in spaced capitals gives headings the feel of a gallery title card, while its lighter weights keep captions, letters and invoices quiet and elegant.", board: { type: "type", display: { family: "Montserrat", stack: "'Montserrat', system-ui, sans-serif", weight: 600, sample: "MACHA" }, text: { family: "Montserrat", stack: "'Montserrat', system-ui, sans-serif", sample: "Every wedding has a story. We are there to witness it, not to direct it." }, ink: "#F3EFE4", paper: "#2B2B2B", accent: "#9C978C" } },
  { id: "w-macha-album", chapter: "06 — Applications", title: "Macha Studios — An heirloom, delivered.", service: "branding", client: "macha", kind: "photo", image: machaAlbum, blurb: "Linen-wrapped albums and charcoal film boxes turn delivery into a keepsake. Each piece carries only the small frame symbol, so the experience feels personal rather than branded." },
  { id: "w-macha-screen", chapter: "07 — Digital Experience", title: "Macha Studios — A gallery, not a sales page.", service: "branding", client: "macha", kind: "photo", image: machaScreen, blurb: "The website uses generous ivory space and full-bleed images so couples browse real stories the way they would turn the pages of an album, on desktop and mobile." },
  { id: "w-dig-1", title: "Campaigns That Reach People", service: "digital", kind: "photo", image: websiteMedia20.url, blurb: "Social media campaigns with clear tracking of what works." },
  { id: "w-dig-2", title: "Community Growth", service: "digital", kind: "video", blurb: "Targeted online advertising and public outreach." },
  { id: "w-com-1", title: "Stories With Direction", service: "communications", kind: "photo", image: websiteMedia10.url, blurb: "Creative direction from the first idea to the final file.", tall: true },
  { id: "w-com-2", title: "Common Soil", service: "communications", kind: "photo", image: websiteMedia13.url, blurb: "Visual direction for peace dialogue campaigns." },
];
