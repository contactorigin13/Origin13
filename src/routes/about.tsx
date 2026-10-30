import { getPageMetadata } from "@/lib/page-metadata.functions";
import { canonicalLink, pageUrl } from "@/lib/site-url";
import { resolveStudio } from "@/lib/editor-fields";
import { Published } from "@/components/site/Published";
import { SiteText } from "@/components/site/SiteText";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useSiteContent } from "@/lib/site-content";
import { PARTNERS, PILLARS } from "@/data/studio";
import { PageHero, SectionHeading } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { TeamSection } from "@/components/site/TeamSection";

export const Route = createFileRoute("/about")({
  loader: () => getPageMetadata({ data: { page: "about" } }),
  head: ({ loaderData }) => ({
    links: [canonicalLink("/about")],
    meta: [
      { property: "og:url", content: pageUrl("/about") },
      { title: loaderData?.["seo_about_title"] || "About — Origin 13 Communication" },
      { name: "description", content: loaderData?.["seo_about_description"] || "Meet Origin 13, an Addis Ababa team making films, photographs, designs and campaigns across East Africa." },
      { property: "og:title", content: loaderData?.["seo_about_title"] || "About Origin 13 Communication" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:description", content: loaderData?.["seo_about_description"] || "Meet the team behind Origin 13 and learn how we work." },
    ],
  }),
  component: About,
});

function About() {
  const c = useSiteContent();
  const { pillars, partners } = resolveStudio(c);
  const paras = (c["about_story"] ?? "").split(/\n\s*\n/).filter(Boolean);
  return (
    <>
      <PageHero
        page="about"
        eyebrow={(c["about_eyebrow"] ?? "")}
        title={<><SiteText name="about_title">Based in Ethiopia. <em className="text-primary">Working</em> across East Africa.</SiteText></>}
        intro={(c["about_intro"] ?? "")}
      />

      <Published name="about_story">
      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-28 lg:grid-cols-2 lg:px-10 lg:py-36">
        <Reveal>
          <SectionHeading eyebrow={(c["about_story_label"] ?? "")} title={<><SiteText name="about_story_title">Local knowledge. <br />Careful work.</SiteText></>} />
        </Reveal>
        <Reveal delay={120} className="space-y-6 text-lg leading-relaxed text-muted-foreground lg:pt-9">
          {paras.map((p, i) => (
            <p key={i} className={i === paras.length - 1 ? "text-foreground" : undefined}>{p}</p>
          ))}
        </Reveal>
      </section>
      </Published>

      <Published name="about_pillars">
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-px bg-border px-0 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 100} className="bg-card px-8 py-16 lg:px-12">
              <p className="font-display text-6xl text-primary/40">0{i + 1}</p>
              <h3 className="mt-6 text-3xl">{p.title}</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </section>
      </Published>

      <Published name="about_team"><TeamSection /></Published>

      <Published name="about_experience">
      <section aria-labelledby="experience-heading" className="border-t border-border">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-28 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-36">
          <Reveal>
            <p className="eyebrow"><SiteText name="about_experience_label">Our experience</SiteText></p>
            <p className="mt-6 font-display text-8xl leading-none text-primary"><SiteText name="about_years">12+</SiteText></p>
            <h2 id="experience-heading" className="mt-6 max-w-md text-4xl leading-tight"><SiteText name="about_experience_title">Years of working together. Experience in every project.</SiteText></h2>
          </Reveal>
          <Reveal delay={120} className="space-y-6 text-lg leading-relaxed text-muted-foreground lg:pt-10">
            {(c["about_experience"] ?? "").split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </Reveal>
        </div>
      </section>
      </Published>

      <Published name="about_partners">
      <section className="bg-paper text-paper-foreground">
        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-paper-foreground/60"><SiteText name="about_partners_label">Our partners</SiteText></p>
          <h2 className="mt-5 max-w-3xl text-4xl leading-tight md:text-5xl"><SiteText name="about_partners_title">Organizations we work with.</SiteText></h2>
          <div className="mt-14 grid grid-cols-2 gap-px bg-paper-foreground/10 md:grid-cols-5">
            {partners.map((p) => (
              <div key={p.short} className="flex flex-col items-center justify-between gap-6 bg-paper p-8 text-center">
                <img src={p.logo} alt={p.name} loading="lazy" className="h-16 w-auto max-w-full object-contain mix-blend-multiply" />
                <p className="text-xs uppercase tracking-widest text-paper-foreground/60">{p.type}</p>
              </div>
            ))}
          </div>
          <Link to="/portfolio" className="group mt-12 inline-flex items-center gap-2 font-semibold">
            <SiteText name="about_partners_link">See the work we made together</SiteText> <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
      </Published>
    </>
  );
}
