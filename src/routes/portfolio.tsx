import { getPageMetadata } from "@/lib/page-metadata.functions";
import { canonicalLink, pageUrl } from "@/lib/site-url";
import { Published } from "@/components/site/Published";
import { useVisibility } from "@/lib/visibility";
import { isPublished } from "@/lib/publication";
import { SiteText } from "@/components/site/SiteText";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, Megaphone, MessageSquare, Palette, Play, Radio, X } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { BrandSlideshow } from "@/components/site/BrandSlideshow";
import { useSiteContent } from "@/lib/site-content";
import { useProjects, type Project } from "@/lib/projects";
import { BRAND_CLIENTS, SERVICES, WORK_SHOWCASE, type WorkTile } from "@/data/studio";
import { cn } from "@/lib/utils";
import { resolvePortfolioContent, type PortfolioContent } from "@/lib/portfolio-content";

export const Route = createFileRoute("/portfolio")({
  loader: () => getPageMetadata({ data: { page: "portfolio" } }),
  head: ({ loaderData }) => ({
    links: [canonicalLink("/portfolio")],
    meta: [
      { property: "og:url", content: pageUrl("/portfolio") },
      { title: loaderData?.["seo_portfolio_title"] || "Portfolio — Films, Events, Brands & Campaigns | Origin 13" },
      { name: "description", content: loaderData?.["seo_portfolio_description"] || "Work from all five Origin 13 services: documentaries, live event coverage, brand design, digital campaigns and communication plans." },
      { property: "og:title", content: loaderData?.["seo_portfolio_title"] || "Origin 13 Portfolio — Everything We Make" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:description", content: loaderData?.["seo_portfolio_description"] || "Five services, one team. See our films, broadcasts, brands and campaigns." },
    ],
  }),
  component: Portfolio,
});

/** Cursor-sized hover glyphs: the icon itself becomes the pointer. */
const CURSOR_SIZE = 28;


export function ProjectMedia({ project, autoplay = false, className }: { project: Project; autoplay?: boolean; className?: string | undefined }) {
  if (project.media_type === "video_embed") {
    const src = autoplay ? `${project.display_url}${project.display_url.includes("?") ? "&" : "?"}autoplay=1` : project.display_url;
    return <iframe src={src} title={project.title} className={cn("h-full w-full", className)} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen loading="lazy" />;
  }
  return <img src={project.display_url} alt={project.title} loading="lazy" className={cn("h-full w-full object-cover", className)} />;
}

function ProjectDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);
  if (!project) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8" role="dialog" aria-modal="true" aria-label={project.title}>
      <button className="absolute inset-0 bg-scrim/90 backdrop-blur-sm" onClick={onClose} aria-label="Close" />
      <article className="relative max-h-[94vh] w-full max-w-5xl overflow-y-auto bg-card shadow-elegant">
        <button onClick={onClose} className="media-tone absolute right-4 top-4 z-10 rounded-full bg-scrim/70 p-2 hover:bg-primary hover:text-primary-foreground" aria-label="Close">
          <X className="h-5 w-5" />
        </button>
        <div className="aspect-video bg-scrim">
          <ProjectMedia project={project} autoplay className={project.media_type === "image" ? "object-contain" : undefined} />
        </div>
        <div className="p-6 md:p-10">
          <p className="eyebrow">{project.media_type === "video_embed" ? <SiteText name="portfolio_video_label">Video</SiteText> : <SiteText name="portfolio_photo_label">Photo</SiteText>}</p>
          <h2 className="mt-3 text-3xl md:text-4xl">{project.title}</h2>
          {project.description && <p className="mt-4 max-w-3xl whitespace-pre-line leading-relaxed text-muted-foreground">{project.description}</p>}
        </div>
      </article>
    </div>
  );
}

/** Media area for a tile; each service gets its own small visual detail. */
function TileMedia({ tile }: { tile: WorkTile }) {
  const s = tile.service;
  return (
    <div className={cn("media-tone relative aspect-[4/3] w-full overflow-hidden bg-scrim", s === "documentary" && "film-frame")}>
      {tile.image ? (
        <img src={tile.image} alt={tile.title} loading="lazy" className={cn("h-full w-full object-cover", s !== "branding" && "transition-transform duration-[1400ms] ease-out group-hover:scale-110")} />
      ) : (
        <div className="video-placeholder flex h-full w-full items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-scrim/60 backdrop-blur transition-transform duration-500 group-hover:scale-110">
            <Play className="h-6 w-6 fill-current text-foreground" />
          </span>
        </div>
      )}

      {s === "documentary" && (
        <span className="absolute bottom-[11%] right-4 z-10 font-mono text-[0.7rem] tracking-widest text-foreground/80 transition-all duration-500 group-hover:bottom-4">00:0{tile.id.length % 9}:24:12</span>
      )}
      {s === "events" && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-scrim/70 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-widest backdrop-blur">
          <span className="live-dot h-2 w-2 rounded-full bg-primary" /> Live
        </span>
      )}
      {s === "digital" && (
        <div className="absolute bottom-4 left-4 flex gap-2 opacity-90">
          {["Reach", "Clicks", "Shares"].map((m, i) => (
            <span key={m} className="rounded-full bg-scrim/70 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest backdrop-blur transition-transform duration-500 group-hover:-translate-y-1" style={{ transitionDelay: `${i * 80}ms` }}>
              ↑ {m}
            </span>
          ))}
        </div>
      )}
      {s === "communications" && (
        <span className="absolute left-4 top-4 rounded-full bg-scrim/70 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest backdrop-blur">Idea → Plan → Result</span>
      )}
      {s !== "events" && s !== "communications" && tile.kind === "video" && (
        <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-scrim/70 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-widest backdrop-blur">
          <Play className="h-3 w-3 fill-current" /> Video
        </span>
      )}
    </div>
  );
}

function WorkCard({ tile, index }: { tile: WorkTile; index: number }) {
  return (
    <article className="group">
      <TileMedia tile={tile} />
      <div className="mt-4 flex items-start gap-4">
        <span className="font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span>
        <div>
          <h3 className="text-xl leading-snug transition-colors group-hover:text-primary">{tile.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{tile.blurb}</p>
        </div>
      </div>
    </article>
  );
}

/** Cursor glyphs drawn exactly like the Services page icons: plain blue lines, no fill, no glow. */
function ServiceGlyph({ id, className }: { id: string; className?: string }) {
  switch (id) {
    case "documentary":
      return (
        <svg
          viewBox="0 0 24 24"
          className={cn(className, "text-primary")}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="7" cy="5.5" r="3" />
          <circle cx="17" cy="5.5" r="3" />
          <rect x="3" y="9" width="15" height="11" rx="2.5" />
          <path d="M18 13l4-2.5v8L18 16" />
        </svg>
      );
    case "events":
      return <Radio className={cn(className, "text-primary")} strokeWidth={1.5} aria-hidden="true" />;
    case "branding":
      return <Palette className={cn(className, "text-primary")} strokeWidth={1.5} aria-hidden="true" />;
    case "digital":
      return <Megaphone className={cn(className, "text-primary")} strokeWidth={1.5} aria-hidden="true" />;
    default:
      return <MessageSquare className={cn(className, "text-primary")} strokeWidth={1.5} aria-hidden="true" />;
  }
}

/** Big service index; the service glyph replaces the pointer itself over each row. */
function ServiceIndex({ services, tiles }: { services: PortfolioContent["services"]; tiles: WorkTile[] }) {
  const c = useSiteContent();
  const [active, setActive] = useState<string | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  const half = CURSOR_SIZE / 2;
  const onMove = (e: React.MouseEvent) => {
    const el = preview.current;
    if (el) el.style.transform = `translate3d(${e.clientX - half}px, ${e.clientY - half}px, 0)`;
    if (!(e.target as HTMLElement).closest("a.service-row") && active) setActive(null);
  };
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10" onMouseMove={onMove} onMouseLeave={() => setActive(null)}>
      <p className="eyebrow"><SiteText name="portfolio_index_label">Choose a service</SiteText></p>
      <ul className="mt-8 border-t border-border">
        {services.map((s) => (
          <li key={s.id} className="border-b border-border">
            <a
              href={`#${s.id}`}
              onMouseEnter={() => setActive(s.id)}
              className="service-row group flex items-center gap-6 py-6 md:gap-10 md:py-8"
            >
              <span className={cn("text-outline font-display text-4xl md:text-6xl", active === s.id && "is-active")}>{s.number}</span>
              <span className="flex-1 font-display text-2xl leading-tight transition-transform duration-500 group-hover:translate-x-3 md:text-5xl">{s.title}</span>
              <span className="hidden text-sm text-muted-foreground md:block">{tiles.filter((t) => t.service === s.id).length} <SiteText name="portfolio_works_label">works</SiteText></span>
              <ArrowDownRight className="h-6 w-6 shrink-0 text-primary transition-transform duration-500 group-hover:rotate-[-45deg]" />
            </a>
          </li>
        ))}
      </ul>
      <div
        ref={preview}
        aria-hidden
        className="cursor-preview pointer-events-none fixed left-0 top-0 z-[100] hidden [@media(hover:hover)_and_(pointer:fine)]:block"
        style={{ opacity: active ? 1 : 0, width: CURSOR_SIZE, height: CURSOR_SIZE }}
      >
        {SERVICES.map((s) => (
          <span key={s.id} className={cn("glyph-pop absolute inset-0 flex items-center justify-center", active === s.id && "is-on")}>
            <ServiceGlyph id={s.id} className="h-full w-full" />
          </span>
        ))}
      </div>
    </section>
  );
}

/** Brand Design chapter: one full-size frame; brand tabs swap which brand's mockups slide inside it. */
function BrandCarousel({ tiles, brands }: { tiles: WorkTile[]; brands: PortfolioContent["brands"] }) {
  const [brandId, setBrandId] = useState(brands[0]?.id ?? "");
  const brand = brands.find((c) => (c["id"] ?? "") === brandId) ?? brands[0];
  if (!brand) return null;
  return (
    <div className="min-w-0">
      <div className="mb-4 flex flex-wrap items-end gap-x-8 gap-y-2" role="tablist" aria-label="Choose a brand">
        {brands.map((client) => {
          const active = client.id === brand.id;
          return (
            <button
              key={client.id}
              role="tab"
              aria-selected={active}
              onClick={() => setBrandId(client.id)}
              className={cn(
                "group relative pb-2 text-left font-display text-3xl transition-colors duration-300 md:text-4xl",
                active ? "text-foreground" : "text-muted-foreground/50 hover:text-muted-foreground",
              )}
            >
              {client.name}
              <span className={cn("absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-500 ease-out", active ? "w-full" : "w-0 group-hover:w-1/3")} />
            </button>
          );
        })}
      </div>
      <p className="mb-4 text-xs leading-5 text-muted-foreground">{brand.description}</p>
      <BrandSlideshow key={brand.id} client={{ id: brand.id }} tiles={tiles.filter((tile) => tile.client === brand.id)} />
    </div>
  );
}

/** One chapter per service: title on the left, its work as a home-style slideshow on the right. */
function Chapter({ service, content }: { service: PortfolioContent["services"][number]; content: PortfolioContent }) {
  const tiles = content.tiles.filter((t) => t.service === service.id);
  const isBranding = service.id === "branding";
  return (
    <section id={service.id} className="scroll-mt-24 border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:px-10 lg:py-24">
        <div className={cn(isBranding && "lg:sticky lg:top-28 lg:self-start")}>
          <span className="text-outline is-active block font-display text-[6rem] leading-none md:text-[8rem]">{service.number}</span>
          <h2 className="mt-4 text-4xl leading-tight md:text-5xl">{service.title}</h2>
          <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">{service.summary}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {service.formats.map((f) => (
              <span key={f} className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-foreground/75">{f}</span>
            ))}
          </div>
        {isBranding && <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-primary"><SiteText name="portfolio_identity_label">Full identity case studies</SiteText></p>}
        </div>
        {isBranding ? (
          <BrandCarousel tiles={tiles} brands={content.brands} />
        ) : (
          <BrandSlideshow client={{ id: service.id }} tiles={tiles} />
        )}
      </div>
    </section>
  );
}

function Portfolio() {
  const c = useSiteContent();
  const { data: visibility = {} } = useVisibility();
  const resolved = resolvePortfolioContent(c);
  const content: PortfolioContent = { ...resolved, services: resolved.services.filter(s => isPublished(visibility, `portfolio_${s.id}`)), brands: resolved.brands.filter(b => isPublished(visibility, `brand_${b.id}`)), tiles: resolved.tiles.filter(t => isPublished(visibility, `work_${t.id}`)) };
  const { data: allProjects = [] } = useProjects();
  const projects = allProjects.filter((p) => p.kind === "upload");
  for (const p of allProjects) {
    if (p.kind === "story" && p.service && p.display_url) content.tiles.push({ id: p.id, title: p.title, service: p.service, kind: "photo", image: p.display_url, blurb: p.description });
    if (p.kind === "brand_kit" && p.slides.length) {
      content.brands.push({ id: p.id, name: p.title, description: p.subtitle });
      p.slides.forEach((sl, i) => content.tiles.push({ id: `${p.id}-${i}`, title: sl.title, service: "branding", kind: "photo", client: p.id, blurb: sl.text, ...(sl.display_url ? { image: sl.display_url } : {}), ...(sl.chapter ? { chapter: sl.chapter } : {}) }));
    }
  }
  const [open, setOpen] = useState<Project | null>(null);

  return (
    <>
      <PageHero page="portfolio" eyebrow={(c["portfolio_eyebrow"] ?? "")} title={<><SiteText name="portfolio_title">Everything <em className="text-primary">we make.</em></SiteText></>} intro={(c["portfolio_intro"] ?? "")} />

      <ServiceIndex services={content.services} tiles={content.tiles.filter(t => !t.client || content.brands.some(b => b.id === t.client))} />
      {content.services.map((s) => <Chapter key={s.id} service={s} content={content} />)}

      <Published name="portfolio_uploads">
      {projects.length > 0 && (
        <section className="border-t border-border">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
            <p className="eyebrow"><SiteText name="portfolio_uploads_label">From the studio</SiteText></p>
            <h2 className="mt-3 text-3xl md:text-4xl"><SiteText name="portfolio_uploads_title">Latest uploads</SiteText></h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 100}>
                  <div className="group relative overflow-hidden bg-card shadow-elegant">
                    <div className="media-tone relative aspect-[4/3] w-full">
                      {p.media_type === "video_embed" ? (
                        <ProjectMedia project={p} />
                      ) : (
                        <button onClick={() => setOpen(p)} className="block h-full w-full" aria-label={`Open ${p.title}`}>
                          <ProjectMedia project={p} className="transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
                        </button>
                      )}
                    </div>
                    <button onClick={() => setOpen(p)} className="block w-full p-5 text-left">
                      <h3 className="text-xl transition-colors group-hover:text-primary">{p.title}</h3>
                      {p.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>}
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      </Published>
      <ProjectDialog project={open} onClose={() => setOpen(null)} />
    </>
  );
}
