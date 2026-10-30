import { resolveStudio } from "@/lib/editor-fields";
import { emailList } from "@/lib/emails";
import { SITE_URL } from "@/lib/site-url";
import { socialLinks } from "@/lib/socials";

/**
 * Business details for search engines (schema.org), built from the company settings in the Admin,
 * so a change there updates this too.
 */
export function structuredDataJson(content: Record<string, string> = {}): string {
  const { company } = resolveStudio(content);
  const locality = company.location.split(",")[0]?.trim() || company.location;
  const country = /ethiopia/i.test(company.location) ? "ET" : (company.location.split(",").pop()?.trim() ?? "");
  const orgId = `${SITE_URL}/#organization`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": orgId,
        name: company.name,
        alternateName: company.short,
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/images/logo-dark.svg`,
        image: `${SITE_URL}/og-image.jpg`,
        description: "Films, photography, live events, brand design and campaigns from an Addis Ababa team working across East Africa.",
        email: emailList(company.email)[0],
        telephone: company.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: company.address,
          addressLocality: locality,
          addressCountry: country,
        },
        areaServed: ["Ethiopia", "East Africa"],
        sameAs: socialLinks(content).length ? socialLinks(content).map((s) => s.url) : undefined,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: "Origin 13 Communication",
        inLanguage: "en",
        publisher: { "@id": orgId },
      },
    ],
  };
  // "<" is escaped so no saved text can ever close the script tag early.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
