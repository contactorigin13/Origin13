import { resolveStudio } from "@/lib/editor-fields";
import { useVisibility } from "@/lib/visibility";
import { isPagePublished } from "@/lib/publication";
import { useSiteContent } from "@/lib/site-content";
import { SiteText } from "@/components/site/SiteText";
import { Link } from "@tanstack/react-router";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { COMPANY, NAV } from "@/data/studio";

export function SiteFooter() {
  const c = useSiteContent();
  const { company, nav } = resolveStudio(c);
  const { data: visibility = {} } = useVisibility();
  return (
    <footer className="media-tone border-t border-border bg-scrim">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="eyebrow"><SiteText name="footer_eyebrow">Work with Origin 13</SiteText></p>
            <h2 className="mt-5 max-w-lg text-4xl leading-tight md:text-5xl">
              <SiteText name="footer_title">Have a project <em className="text-primary">in mind?</em></SiteText>
            </h2>
            <Link to="/contact" className="group mt-8 inline-flex items-center gap-3 text-lg font-semibold">
              <span className="border-b border-primary pb-1"><SiteText name="footer_cta">Let’s talk</SiteText></span>
              <ArrowUpRight className="h-5 w-5 text-primary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </Link>
          </div>
          <div>
            <p className="eyebrow !text-muted-foreground"><SiteText name="footer_studio_label">Studio</SiteText></p>
            <ul className="mt-5 space-y-3">
              {nav.filter(n => isPagePublished(visibility, n.to)).map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="text-foreground/80 transition-colors hover:text-primary">{n.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-5 text-sm text-foreground/80">
            <p className="eyebrow !text-muted-foreground"><SiteText name="footer_contact_label">Contact</SiteText></p>
            <a href={`mailto:${company.email}`} className="block hover:text-primary">{company.email}</a>
            <a href={company.phoneHref} className="block hover:text-primary">{company.phone}</a>
            <p>{company.address}</p>
            <p>{company.location}</p>
            <p className="text-muted-foreground">{company.hours}</p>
          </div>
        </div>
        <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row md:items-center">
          <img src={(c["site_logo"] ?? "") || "/images/logo-light.svg"} alt="Origin 13 Communication" className="h-10 w-auto opacity-80" width={79} height={40} />
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="group flex items-center gap-4 text-sm font-semibold text-foreground"
          >
            <span className="transition-colors group-hover:text-primary"><SiteText name="footer_top">Back to top</SiteText></span>
            <span className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-primary/60 transition-colors group-hover:bg-primary">
              <ArrowUp className="h-5 w-5 transition-transform duration-500 group-hover:-translate-y-14" />
              <ArrowUp className="absolute h-5 w-5 translate-y-14 text-primary-foreground transition-transform duration-500 group-hover:translate-y-0" />
            </span>
          </button>
          <p>© {new Date().getFullYear()} {company.name}. <SiteText name="footer_rights">All rights reserved.</SiteText></p>
        </div>

      </div>
    </footer>
  );
}
