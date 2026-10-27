import { getPageMetadata } from "@/lib/page-metadata.functions";
import { resolveStudio } from "@/lib/editor-fields";
import { useVisibility } from "@/lib/visibility";
import { isPublished } from "@/lib/publication";
import { Published } from "@/components/site/Published";
import { SiteText } from "@/components/site/SiteText";
import { useSiteContent } from "@/lib/site-content";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight, Camera, Radio, Palette, Megaphone, MessageSquare, Check } from "lucide-react";
import { PROCESS, SERVICES } from "@/data/studio";
import { PageHero, SectionHeading } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/services")({
  loader: () => getPageMetadata({ data: { page: "services" } }),
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.["seo_services_title"] || "Films, Events, Design & Marketing Services | Origin 13" },
      { name: "description", content: loaderData?.["seo_services_description"] || "Documentary films and photography, live events, brand design, digital marketing and communications from Origin 13 in Addis Ababa." },
      { property: "og:title", content: loaderData?.["seo_services_title"] || "Services — Origin 13 Communication" },
      { property: "og:description", content: loaderData?.["seo_services_description"] || "Films, photography, live broadcasts, brand design and campaigns across East Africa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Services,
});

const serviceIcons = [Camera, Radio, Palette, Megaphone, MessageSquare];

function Services() {
  const c = useSiteContent();
  const { services: allServices, process } = resolveStudio(c);
  const { data: visibility = {} } = useVisibility();
  const services = allServices.filter(s => isPublished(visibility, `services_${s.id}`));
  return (
    <>
      <PageHero
        page="services"
        eyebrow={(c["services_eyebrow"] ?? "")}
        title={<><SiteText name="services_title">Our <em className="text-primary">services.</em></SiteText></>}
        intro={(c["services_intro"] ?? "")}
      />

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="flex items-center justify-between gap-6 border-b border-border pb-6">
          <p className="text-sm text-muted-foreground"><SiteText name="services_index_label">Five services. One team.</SiteText></p>
          <ArrowDown className="h-5 w-5 text-primary" aria-hidden="true" />
        </div>
        <nav aria-label="Our services" className="grid gap-x-10 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="group flex items-start gap-4 border-b border-border py-5 text-sm font-medium transition-colors hover:text-primary">
              <span className="text-primary">{s.number}</span>
              <span className="flex-1">{s.title}</span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
            </a>
          ))}
        </nav>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 pt-8 lg:px-10">
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((s, i) => {
            const Icon = serviceIcons[i] ?? MessageSquare;
            return (
              <Reveal key={s.id} className={i === services.length - 1 ? "md:col-span-2" : ""}>
                <article id={s.id} className="h-full scroll-mt-28 rounded-lg border border-border bg-card p-7 md:p-10">
                  <div className="mb-8 flex items-center justify-between">
                    <Icon className="h-7 w-7 text-primary" strokeWidth={1.5} aria-hidden="true" />
                    <span className="font-display text-3xl text-muted-foreground/60">{s.number}</span>
                  </div>
                  <div className={i === services.length - 1 ? "grid gap-8 lg:grid-cols-2 lg:gap-16" : ""}>
                    <div>
                      <h2 className="max-w-lg text-3xl leading-tight">{s.title}</h2>
                      <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">{s.summary}</p>
                    </div>
                    <div className={i === services.length - 1 ? "" : "mt-8"}>
                      <p className="border-t border-border pt-6 text-xs font-semibold text-primary"><SiteText name="services_offer_label">What we offer</SiteText></p>
                      <ul className="mt-5 space-y-4">
                        {s.details.map((d) => (
                          <li key={d} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                            <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <Published name="services_process">
      <section className="border-y border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <SectionHeading eyebrow={(c["services_process_label"] ?? "")} title={(c["services_process_title"] ?? "")} />
          <ol className="mt-12 grid gap-10 md:grid-cols-4">
            {process.map((p) => (
              <li key={p.step} className="border-t border-border pt-6">
                <p className="text-sm text-primary">{p.step}</p>
                <h3 className="mt-3 text-2xl">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      </Published>
      <Published name="services_cta">
      <section className="bg-paper text-paper-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-16 md:flex-row md:items-center lg:px-10">
          <div>
            <h2 className="text-4xl"><SiteText name="services_cta_title">Have a project in mind?</SiteText></h2>
            <p className="mt-4 text-paper-foreground/70"><SiteText name="services_cta_body">Tell us what you need. Let’s make it happen.</SiteText></p>
          </div>
          <Button asChild size="lg" className="h-12 shrink-0">
            <Link to="/contact"><SiteText name="services_cta_button">Let’s talk</SiteText> <ArrowUpRight /></Link>
          </Button>
        </div>
      </section>
      </Published>
    </>
  );
}
