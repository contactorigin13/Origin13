import { getPageMetadata } from "@/lib/page-metadata.functions";
import { resolveStudio } from "@/lib/editor-fields";
import { useVisibility } from "@/lib/visibility";
import { isPublished } from "@/lib/publication";
import { Published } from "@/components/site/Published";
import { SiteText } from "@/components/site/SiteText";
import websiteMedia10 from "@/assets/crew.jpg.asset.json";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { FEATURED, PILLARS, SERVICES, STATS, type Story } from "@/data/studio";
import { fallbackSlides, useHomeSlides, useHomeStats } from "@/lib/home-content";
import { useSiteContent } from "@/lib/site-content";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/PageHero";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { StoryDialog } from "@/components/site/StoryDialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  loader: () => getPageMetadata({ data: { page: "home" } }),
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.["seo_home_title"] || "Origin 13 Communication — Documentary Film & Visual Storytelling, Ethiopia" },
      { name: "description", content: loaderData?.["seo_home_description"] || "Films, photography, live events, brand design and campaigns from an Addis Ababa team working across East Africa." },
      { property: "og:title", content: loaderData?.["seo_home_title"] || "Origin 13 Communication — Films, design & communications" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:description", content: loaderData?.["seo_home_description"] || "Addis Ababa documentary studio trusted by Africa CDC, ICTJ, GFN, WI HER and LPI." },
    ],
  }),
  component: Home,
});

function Hero() {
  const { data: saved } = useHomeSlides();
  const { data: visibility = {} } = useVisibility();
  const slides = (saved ?? fallbackSlides()).filter(s => isPublished(visibility, `slide_${s.id}`));
  const [i, setI] = useState(0);
  const go = useCallback((d: number) => setI((x) => (x + d + slides.length) % slides.length), [slides.length]);
  useEffect(() => {
    const t = setTimeout(() => go(1), 7000);
    return () => clearTimeout(t);
  }, [i, go]);
  const s = slides[i] ?? slides[0];
  if (!s) return null;

  return (
    <section className="home-hero media-tone grain relative min-h-[calc(100svh-1.5rem)] overflow-hidden">
      {slides.map((f, idx) => (
        <div key={f.id} className={cn("absolute inset-0 transition-opacity duration-[1400ms]", idx === i ? "opacity-100" : "opacity-0")} aria-hidden={idx !== i}>
          <img src={f.image} alt={f.tag} className={cn("h-full w-full object-cover", idx === i && "animate-kenburns")} fetchPriority={idx === 0 ? "high" : "auto"} />
        </div>
      ))}
      <div className="absolute inset-0 bg-hero-scrim" />

      <div className="relative mx-auto flex min-h-[inherit] max-w-7xl flex-col justify-end px-6 pb-8 pt-28 lg:px-10">
        <div key={s.id} className="max-w-3xl">
          <p className="eyebrow animate-rise">{s.tag}</p>
          <h1 className="home-hero-title mt-5 text-5xl leading-[1.02] animate-rise [animation-delay:100ms] md:text-7xl lg:text-[5.5rem]">{s.headline}</h1>
          <p className="mt-6 max-w-xl text-lg text-foreground/80 animate-rise [animation-delay:200ms]">{s.subheadline}</p>
          <div className="mt-9 flex flex-wrap items-center gap-6 animate-rise [animation-delay:300ms]">
            <Link to={s.buttonTo} className="group inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]">
              {s.buttonLabel} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-6 border-t border-border pt-6">
          <div className="flex flex-1 gap-3">
            {slides.map((f, idx) => (
              <button key={f.id} onClick={() => setI(idx)} className="group flex-1 text-left" aria-label={`Show ${f.tag}`}>
                <span className="relative block h-px w-full overflow-hidden bg-foreground/20">
                  {idx === i && <span key={i} className="absolute inset-0 bg-primary animate-progress" />}
                  {idx < i && <span className="absolute inset-0 bg-foreground/60" />}
                </span>
                <span className={cn("mt-3 hidden text-xs font-medium transition-colors md:block", idx === i ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>
                  0{idx + 1} — {f.tag}
                </span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => go(-1)} className="rounded-full border border-border p-3 transition-colors hover:border-primary hover:text-primary" aria-label="Previous"><ChevronLeft className="h-4 w-4" /></button>
            <button onClick={() => go(1)} className="rounded-full border border-border p-3 transition-colors hover:border-primary hover:text-primary" aria-label="Next"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
      </section>
    );
}

function Home() {
  const [story, setStory] = useState<Story | null>(null);
  const c = useSiteContent();
  const { data: savedStats } = useHomeStats();
  const stats = savedStats ?? STATS;
  const { featured, pillars, services } = resolveStudio(c);
  const { data: visibility = {} } = useVisibility();
  return (
    <>
      <Hero />

      <Published name="home_intro">
      {/* Manifesto */}
      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40">
        <Reveal>
          <p className="eyebrow"><SiteText name="home_identity">Origin 13 Communication PLC · Addis Ababa</SiteText></p>
          <p className="mt-8 max-w-5xl font-display text-3xl leading-[1.25] md:text-5xl">
            {(c["home_intro"] ?? "")}
          </p>
        </Reveal>
        <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden border border-border bg-border md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 90} className="bg-background p-8">
              <p className="font-display text-5xl text-foreground md:text-6xl">{s.value}</p>
              <p className="mt-3 text-sm text-muted-foreground">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      </Published>

      <Published name="home_partners"><PartnerStrip /></Published>

      <Published name="home_work">
      {/* Featured work */}
      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow={(c["home_selected_label"] ?? "")} title={(c["home_work_title"] ?? "")} />
          <Link to="/portfolio" className="group inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <SiteText name="home_work_link">See our work</SiteText> <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-12">
          {featured.filter(f => isPublished(visibility, `featured_${f.id}`)).map((f, i) => (
            <Reveal key={f.id} delay={(i % 2) * 120} className={cn(i === 0 || i === 3 ? "md:col-span-7" : "md:col-span-5")}>
              <button onClick={() => setStory(f)} className="media-tone group relative block aspect-[4/3] w-full overflow-hidden text-left md:aspect-auto md:h-[520px]">
                <img src={f.image} alt={f.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-card-scrim" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <p className="eyebrow">{f.partner}</p>
                  <h3 className="mt-3 text-2xl md:text-3xl">{f.title}</h3>
                  <p className="mt-2 max-h-0 overflow-hidden text-sm text-foreground/75 opacity-0 transition-all duration-500 group-hover:max-h-20 group-hover:opacity-100">{f.subtitle}</p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      </Published>

      <Published name="home_pillars">
      {/* Pillars */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-28 lg:grid-cols-[1fr_1.4fr] lg:px-10">
          <Reveal>
            <SectionHeading eyebrow={(c["home_pillars_label"] ?? "")} title={<><SiteText name="home_pillars_title">Good work starts with <em className="text-primary">listening.</em></SiteText></>} />
            <img src={(c["home_pillars_image"] ?? "")} alt="Origin 13 crew filming at dawn in the Ethiopian highlands" loading="lazy" className="mt-12 aspect-[4/3] w-full object-cover" />
          </Reveal>
          <div className="divide-y divide-border">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 100} className="py-10 first:pt-0">
                <p className="font-display text-sm text-primary">0{i + 1}</p>
                <h3 className="mt-3 text-3xl">{p.title}</h3>
                <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      </Published>

      <Published name="home_services">
      {/* Services teaser */}
      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
        <SectionHeading eyebrow={(c["home_services_label"] ?? "")} title={(c["home_services_title"] ?? "")} />
        <ul className="mt-14 border-t border-border">
          {services.filter(s => isPublished(visibility, `services_${s.id}`)).map((s) => (
            <li key={s.id}>
              <Link to="/services" hash={s.id} className="group grid items-center gap-4 border-b border-border py-8 transition-colors hover:bg-card md:grid-cols-[80px_1fr_1fr_40px] md:px-4">
                <span className="font-display text-primary">{s.number}</span>
                <span className="font-display text-2xl md:text-3xl">{s.title}</span>
                <span className="text-sm text-muted-foreground">{s.summary}</span>
                <ArrowUpRight className="hidden h-5 w-5 text-primary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 md:block" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      </Published>

      <StoryDialog story={story} onClose={() => setStory(null)} />
    </>
  );
}
