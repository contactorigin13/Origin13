import { getPageMetadata } from "@/lib/page-metadata.functions";
import { canonicalLink, pageUrl } from "@/lib/site-url";
import { resolveStudio } from "@/lib/editor-fields";
import { emailList } from "@/lib/emails";
import { Published } from "@/components/site/Published";
import { SiteText } from "@/components/site/SiteText";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/lib/site-content";
import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Clock, Mail, MapPin, Phone, Send, type LucideIcon } from "lucide-react";
import { COMPANY, SERVICES } from "@/data/studio";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/contact")({
  loader: () => getPageMetadata({ data: { page: "contact" } }),
  head: ({ loaderData }) => ({
    links: [canonicalLink("/contact")],
    meta: [
      { property: "og:url", content: pageUrl("/contact") },
      { title: loaderData?.["seo_contact_title"] || "Contact | Origin 13 Communication" },
      { name: "description", content: loaderData?.["seo_contact_description"] || "Contact Origin 13 in Addis Ababa for films, photography, event coverage, design, marketing and communications." },
      { property: "og:title", content: loaderData?.["seo_contact_title"] || "Contact Origin 13 Communication" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:description", content: loaderData?.["seo_contact_description"] || "Let's start a conversation about your next story." },
    ],
  }),
  component: Contact,
});

const field =
  "w-full border-0 border-b border-input bg-transparent px-0 py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-0 transition-colors";


function Contact() {
  const [sent, setSent] = useState(false);
  const site = useSiteContent();
  const { company, services } = resolveStudio(site);
  const emails = emailList(company.email);
  const contactRows: { icon: LucideIcon; label: string; lines: string[]; href?: string; hrefs?: string[] }[] = [
  { icon: Mail, label: (site["contact_email_label"] ?? ""), lines: emails, hrefs: emails.map((e) => `mailto:${e}`) },
  { icon: Phone, label: (site["contact_phone_label"] ?? ""), lines: [company.phone], href: company.phoneHref },
  { icon: MapPin, label: (site["contact_address_label"] ?? ""), lines: [company.address, company.location] },
  { icon: Clock, label: (site["contact_hours_label"] ?? ""), lines: [company.hours] },
];


  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const subject = `Project inquiry — ${d.get("service")} — ${d.get("organization") || d.get("name")}`;
    const body = `Name: ${d.get("name")}\nOrganization: ${d.get("organization")}\nEmail: ${d.get("email")}\nService: ${d.get("service")}\n\n${d.get("message")}`;
    window.location.href = `mailto:${emails[0]}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <>
      <PageHero
        page="contact"
        eyebrow={(site["contact_eyebrow"] ?? "")}
        title={<><SiteText name="contact_title">Let’s start a <em className="text-primary">conversation.</em></SiteText></>}
        intro={(site["contact_intro"] ?? "")}
      />

      <section className="mx-auto grid max-w-7xl gap-20 px-6 py-28 lg:grid-cols-[1fr_1.5fr] lg:px-10">
        <Published name="contact_details"><aside className="space-y-10">
          {contactRows.map((c) => (
            <div key={(c["label"] ?? "")} className="flex gap-5">
              <c.icon className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="eyebrow !text-muted-foreground">{(c["label"] ?? "")}</p>
                {c.lines.map((l, i) => {
                  const href = c.hrefs?.[i] ?? c.href ?? "";
                  return href ? (
                    <a key={l} href={href} className="mt-2 block text-lg hover:text-primary">{l}</a>
                  ) : (
                    <p key={l} className="mt-2 text-lg">{l}</p>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="border-l-2 border-primary pl-5 text-sm leading-relaxed text-muted-foreground">
            {(site["contact_reply_note"] ?? "")}
          </div>
        </aside></Published>

        <Published name="contact_form"><div className="bg-card p-8 shadow-elegant md:p-12">
          {sent ? (
            <div className="py-16 text-center">
              <Send className="mx-auto h-10 w-10 text-primary" />
              <h2 className="mt-6 text-4xl">{(site["contact_thanks"] ?? "")}</h2>
              <p className="mx-auto mt-4 max-w-md text-muted-foreground">
                {(site["contact_success"] ?? "")}{" "}
                <a className="text-primary" href={`mailto:${emails[0]}`}>{emails[0]}</a>.
              </p>
              <button onClick={() => setSent(false)} className="mt-8 text-sm font-semibold underline underline-offset-4">{(site["contact_another"] ?? "")}</button>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-8 md:grid-cols-2">
              <h2 className="text-3xl md:col-span-2">{(site["contact_form_title"] ?? "")}</h2>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{(site["contact_name_label"] ?? "")}</span>
                <input name="name" required maxLength={100} className={field} placeholder={(site["contact_name_placeholder"] ?? "")} />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{(site["contact_org_label"] ?? "")}</span>
                <input name="organization" maxLength={120} className={field} placeholder={(site["contact_org_placeholder"] ?? "")} />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{(site["contact_form_email_label"] ?? "")}</span>
                <input name="email" type="email" required maxLength={255} className={field} placeholder={(site["contact_email_placeholder"] ?? "")} />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{(site["contact_service_label"] ?? "")}</span>
                <select name="service" required defaultValue="" className={`${field} [&>option]:bg-card`}>
                  <option value="" disabled>{(site["contact_service_placeholder"] ?? "")}</option>
                  {services.map((s) => <option key={s.id}>{s.title}</option>)}
                  <option>{(site["contact_service_other"] ?? "")}</option>
                </select>
              </label>
              <label className="block md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{(site["contact_message_label"] ?? "")}</span>
                <textarea name="message" required maxLength={2000} rows={5} className={`${field} resize-none`} placeholder={(site["contact_message_placeholder"] ?? "")} />
              </label>
              <Button type="submit" className="inline-flex items-center justify-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] md:col-span-2 md:justify-self-start">
                {(site["contact_submit"] ?? "")} <Send className="h-4 w-4" />
              </Button>
            </form>
          )}
        </div></Published>
      </section>
    </>
  );
}
