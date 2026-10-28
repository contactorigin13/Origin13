import { COMPANY, NAV, FEATURED, PILLARS, PROCESS, SERVICES, PARTNERS, WORK_SHOWCASE } from '@/data/studio';
export type EditorField = { key: string; label: string; default: string; multiline: boolean; media?: boolean };
const field = (key: string, label: string, value: string, multiline = false, media = false): EditorField => ({ key, label, default: value, multiline, media });
const copy: Record<string, Record<string, string>> = {
  Home: { home_identity: 'Origin 13 Communication PLC · Addis Ababa', home_selected_label: 'Selected work', home_work_link: 'See our work', home_pillars_label: 'How we work', home_pillars_title: 'Good work starts with listening.', home_services_label: 'Our services', home_services_title: 'What we do', home_partners_label: 'Trusted by institutions shaping the continent' },
  About: { about_eyebrow: 'About Origin 13', about_title: 'Based in Ethiopia. Working across East Africa.', about_story_label: 'Our story', about_story_title: 'Local knowledge. Careful work.', about_team_label: 'Our team', about_team_title: 'The people behind Origin 13.', about_portrait_note: 'Generated portraits are temporary, not actual team photos.', about_experience_label: 'Our experience', about_years: '12+', about_experience_title: 'Years of working together. Experience in every project.', about_partners_label: 'Our partners', about_partners_title: 'Organizations we work with.', about_partners_link: 'See the work we made together' },
  Services: { services_eyebrow: 'Origin 13 Communication', services_title: 'Our services.', services_index_label: 'Five services. One team.', services_offer_label: 'What we offer', services_brand_caption: 'Abbro · Packaging mockup concept · Addis Ababa', services_process_label: 'Our process', services_process_title: 'How we work' },
  Portfolio: { portfolio_eyebrow: 'Our work', portfolio_title: 'Everything we make.', portfolio_index_label: 'Choose a service', portfolio_identity_label: 'Full identity case studies', portfolio_uploads_label: 'From the studio', portfolio_uploads_title: 'Latest uploads' },
  Contact: { contact_eyebrow: 'Get in touch', contact_title: 'Let’s start a conversation.', contact_email_label: 'Email', contact_phone_label: 'Phone', contact_address_label: 'Address', contact_hours_label: 'Office hours', contact_reply_note: 'We usually reply within one business day. For time-sensitive event coverage, please mention your dates.', contact_form_title: 'Tell us about your project', contact_name_label: 'Full name *', contact_name_placeholder: 'Your name', contact_org_label: 'Organization', contact_org_placeholder: 'Your organization', contact_form_email_label: 'Email *', contact_email_placeholder: 'you@organization.org', contact_service_label: 'Service *', contact_service_placeholder: 'Choose a service', contact_service_other: 'Something else', contact_message_label: 'Message *', contact_message_placeholder: 'Goals, locations, timeline, budget range…', contact_submit: 'Send message', contact_thanks: 'Thank you.', contact_success: "Your email app should have opened with your message ready to send. If it didn't, write to us directly at", contact_another: 'Send another message' },
  Shared: { footer_eyebrow: 'Work with Origin 13', footer_title: 'Have a project in mind?', footer_cta: 'Let’s talk', footer_studio_label: 'Studio', footer_contact_label: 'Contact', footer_top: 'Back to top', footer_rights: 'All rights reserved.', story_location_label: 'Location', story_notes_label: 'Field notes', story_cta: 'Commission a similar story', story_documentary_label: 'Documentary', story_photo_label: 'Photo essay' },
};
export const EXTRA_CONTENT_FIELDS: EditorField[] = [
  ...Object.entries({ home: ['Origin 13 Communication — Documentary Film & Visual Storytelling, Ethiopia', 'Films, photography, live events, brand design and campaigns from an Addis Ababa team working across East Africa.'], about: ['About — Origin 13 Communication', 'Meet Origin 13, an Addis Ababa team making films, photographs, designs and campaigns across East Africa.'], services: ['Films, Events, Design & Marketing Services | Origin 13', 'Documentary films and photography, live events, brand design, digital marketing and communications from Origin 13 in Addis Ababa.'], portfolio: ['Portfolio — Films, Events, Brands & Campaigns | Origin 13', 'Work from all five Origin 13 services: documentaries, live event coverage, brand design, digital campaigns and communication plans.'], contact: ['Contact | Origin 13 Communication', 'Contact Origin 13 in Addis Ababa for films, photography, event coverage, design, marketing and communications.'] }).flatMap(([page, values]) => [field(`seo_${page}_title`, `${page[0]?.toUpperCase()}${page.slice(1)} — Search title`, values[0] ?? ''), field(`seo_${page}_description`, `${page[0]?.toUpperCase()}${page.slice(1)} — Search description`, values[1] ?? '', true)]),
  ...Object.entries(copy).flatMap(([group, values]) => Object.entries(values).map(([key, value]) => field(key, `${group} — ${key.replace(`${group.toLowerCase()}_`, '').replaceAll('_', ' ')}`, value))),
  ...Object.entries(COMPANY).map(([key, value]) => field(`company_${key}`, `Shared — Company — ${key}`, value)),
  ...NAV.map((n, i) => field(`nav_${i}_label`, `Shared — Navigation — ${n.label}`, n.label)),
  field("portfolio_works_label", "Portfolio — Work count label", "works"),
  field("portfolio_video_label", "Portfolio — Video label", "Video"),
  field("portfolio_photo_label", "Portfolio — Photo label", "Photo"),
  field("portfolio_typeface_label", "Portfolio — Typeface label", "Typeface"),
  field("portfolio_typeface_alphabet", "Portfolio — Typeface alphabet sample", "Aa Bb Cc Dd Ee Ff Gg 0123456789"),
  field('site_logo', 'Shared — Website logo', '', false, true),
  field('home_pillars_image', 'Home — How we work photo', SERVICES[0]?.image ?? '', false, true),
  ...PILLARS.flatMap((p, i) => [field(`pillar_${i}_title`, `Shared — Principle ${i + 1} — title`, p.title), field(`pillar_${i}_body`, `Shared — Principle ${i + 1} — text`, p.body, true)]),
  ...PROCESS.flatMap((p, i) => Object.entries(p).map(([key, value]) => field(`process_${i}_${key}`, `Services — Process ${i + 1} — ${key}`, value, key === 'body'))),
  ...SERVICES.flatMap(s => [field(`service_${s.id}_number`, `Services — ${s.title} — number`, s.number), field(`service_${s.id}_title`, `Services — ${s.title} — title`, s.title), field(`service_${s.id}_summary`, `Services — ${s.title} — description`, s.summary, true), field(`service_${s.id}_details`, `Services — ${s.title} — offerings (one per line)`, s.details.join('\n'), true), field(`service_${s.id}_image`, `Services — ${s.title} — image`, s.image, false, true)]),
  ...FEATURED.flatMap(s => Object.entries(s).filter(([key]) => key !== 'id').map(([key, value]) => field(`featured_${s.id}_${key}`, `Home — ${s.title} — ${key}`, value ?? '', ['synopsis','fieldNotes','quote','subtitle'].includes(key), key === 'image'))),
  ...PARTNERS.flatMap((p, i) => Object.entries(p).map(([key, value]) => field(`partner_${i}_${key}`, `Legacy — Partner ${i + 1} — ${key}`, value, false, key === 'logo'))),
  ...WORK_SHOWCASE.flatMap(t => [field(`portfolio_work_${t.id}_image`, `Portfolio — ${t.title} — image`, t.image ?? '', false, true), ...(t.chapter ? [field(`portfolio_work_${t.id}_chapter`, `Portfolio — ${t.title} — chapter`, t.chapter)] : []), ...(t.board ? [field(`portfolio_work_${t.id}_board`, `Portfolio — ${t.title} — identity board`, JSON.stringify(t.board, null, 2), true)] : [])]),
];
export function resolveStudio(content: Record<string, string>) {
  const value = (key: string, fallback: string) => content[key] ?? fallback;
  return {
    company: Object.fromEntries(Object.entries(COMPANY).map(([key, v]) => [key, value(`company_${key}`, v)])) as typeof COMPANY,
    nav: NAV.map((n, i) => ({ ...n, label: value(`nav_${i}_label`, n.label) })),
    pillars: PILLARS.map((p, i) => ({ title: value(`pillar_${i}_title`, p.title), body: value(`pillar_${i}_body`, p.body) })),
    process: PROCESS.map((p, i) => ({ step: value(`process_${i}_step`, p.step), title: value(`process_${i}_title`, p.title), body: value(`process_${i}_body`, p.body) })),
    services: SERVICES.map(s => ({ ...s, number: value(`service_${s.id}_number`, s.number), title: value(`service_${s.id}_title`, s.title), summary: value(`service_${s.id}_summary`, s.summary), details: value(`service_${s.id}_details`, s.details.join('\n')).split('\n').filter(Boolean), image: value(`service_${s.id}_image`, s.image) })),
    featured: FEATURED.map(s => ({ ...s, ...Object.fromEntries(Object.entries(s).filter(([key]) => key !== 'id').map(([key, v]) => [`${key}`, value(`featured_${s.id}_${key}`, v ?? '')])) })) as typeof FEATURED,
    partners: parsePartners(content['partners_list']) ?? PARTNERS.map((p, i) => ({ ...p, ...Object.fromEntries(Object.entries(p).map(([key, v]) => [key, value(`partner_${i}_${key}`, v)])) })),
  };
}

export type Partner = { name: string; short: string; logo: string; type: string };
/** The admin-managed logo list, saved as JSON. Returns null when nothing valid is saved yet. */
export function parsePartners(value: string | undefined): Partner[] | null {
  if (!value) return null;
  try {
    const list = JSON.parse(value);
    if (!Array.isArray(list)) return null;
    return list.filter(p => p && typeof p.logo === 'string' && p.logo).map(p => ({ name: String(p.name ?? ''), short: String(p.short ?? ''), logo: p.logo, type: String(p.type ?? '') }));
  } catch { return null; }
}
