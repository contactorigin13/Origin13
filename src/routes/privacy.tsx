import { createFileRoute } from "@tanstack/react-router";
import { canonicalLink, pageUrl } from "@/lib/site-url";
import { resolveStudio } from "@/lib/editor-fields";
import { emailList } from "@/lib/emails";
import { useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    links: [canonicalLink("/privacy")],
    meta: [
      { property: "og:url", content: pageUrl("/privacy") },
      { title: "Privacy Policy | Origin 13 Communication" },
      { name: "description", content: "How Origin 13 Communication handles personal information, what this website stores, and how to contact us about your data." },
      { property: "og:title", content: "Privacy Policy | Origin 13 Communication" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Privacy,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-2xl text-foreground md:text-3xl">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function Privacy() {
  const c = useSiteContent();
  const { company } = resolveStudio(c);
  const emails = emailList(company.email);
  const mail = emails[0];
  return (
    <article className="mx-auto max-w-3xl px-6 pb-28 pt-40 lg:px-10 lg:pt-48">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-6 text-5xl leading-[1.05] md:text-6xl">Privacy <em className="text-primary">policy.</em></h1>
      <p className="mt-6 text-sm text-muted-foreground">Last updated: 30 October 2026</p>

      <div className="mt-14 space-y-12 text-lg leading-relaxed text-muted-foreground">
        <Section title="Who we are">
          <p>
            This website is run by {company.name}, {company.address}, {company.location}. In this policy, “we” and “us” mean {company.name}.
            If you have any question about your personal information, write to <a className="text-primary" href={`mailto:${mail}`}>{mail}</a>.
          </p>
        </Section>

        <Section title="What we collect">
          <p>
            <strong className="text-foreground">Messages you send us.</strong> The contact form opens your own email app with your message ready to send.
            We receive your name, email address, message and anything else you choose to include only if you send that email. Nothing is sent to us just by filling in the form.
            We use it to reply to you and to handle your enquiry.
          </p>
          <p>
            <strong className="text-foreground">Technical data.</strong> Like any website, our hosting provider automatically records standard server information when a page is requested, such as your IP address,
            browser type, the page requested and the time. This is used to deliver the site and keep it secure. We do not use it to identify you or follow you across other websites.
          </p>
          <p>
            <strong className="text-foreground">Your browser’s storage.</strong> To load faster, the site saves a copy of its own content (text and photo addresses) in your browser’s local storage.
            It does not contain personal information about you.
          </p>
        </Section>

        <Section title="What we do not do">
          <p>
            We do not use advertising or tracking cookies, and we do not currently use website analytics. We do not sell your personal information.
            Some portfolio pages may show videos from other platforms such as YouTube or Vimeo; if you play one, that platform may set its own cookies under its own policy.
          </p>
        </Section>

        <Section title="Who handles data for us">
          <p>
            We use trusted providers to run this website: a hosting provider (Vercel) and a database and file storage provider (Supabase), which also holds the sign-in accounts of our own team members who edit the site.
            They process information on our behalf and may do so in countries outside Ethiopia. We do not share your messages with anyone else unless the law requires it or it is needed to answer your enquiry.
          </p>
        </Section>

        <Section title="How long we keep it">
          <p>We keep emails and enquiries for as long as needed to respond and to keep a record of our work with you, and delete them when they are no longer needed or when you ask us to.</p>
        </Section>

        <Section title="Your rights">
          <p>
            You can ask us what personal information we hold about you, ask us to correct or delete it, or object to how we use it. Write to <a className="text-primary" href={`mailto:${mail}`}>{mail}</a> and we will respond as soon as we reasonably can.
            We handle personal information in line with the data protection laws that apply to us.
          </p>
        </Section>

        <Section title="Children">
          <p>This website is for businesses and institutions. It is not aimed at children, and we do not knowingly collect information from them.</p>
        </Section>

        <Section title="Changes to this policy">
          <p>If we change how this website handles information, for example by adding analytics, we will update this page and its date.</p>
        </Section>

        <Section title="Contact">
          <p>
            {company.name}<br />
            {company.address}, {company.location}<br />
            {emails.map((e, i) => (
              <span key={e}>{i > 0 && ", "}<a className="text-primary" href={`mailto:${e}`}>{e}</a></span>
            ))}
          </p>
        </Section>
      </div>
    </article>
  );
}
