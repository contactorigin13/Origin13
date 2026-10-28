import { NAV, SERVICES, BRAND_CLIENTS, WORK_SHOWCASE, HERO_SLIDES, FEATURED } from '@/data/studio';
export type VisibilityMap = Record<string, boolean>;
export const PAGE_KEYS: Record<string, string> = { '/': 'page_home', '/about': 'page_about', '/services': 'page_services', '/portfolio': 'page_portfolio', '/contact': 'page_contact' };
export const PUBLICATION_ITEMS = [
  ...NAV.map(n => ({ key: PAGE_KEYS[n.to] ?? '', label: `${n.label} page`, group: 'Pages' })),
  ...Object.entries({ home_intro: 'Home — Introduction & numbers', home_partners: 'Home — Partners', home_work: 'Home — Selected work', home_pillars: 'Home — How we work', home_services: 'Home — Services', about_story: 'About — Our story', about_pillars: 'About — Principles', about_team: 'About — Team', about_experience: 'About — Experience', about_partners: 'About — Partners', services_process: 'Services — Process', portfolio_uploads: 'Portfolio — Latest Uploads', contact_details: 'Contact — Details', contact_form: 'Contact — Form', site_footer: 'Shared — Footer' }).map(([key, label]) => ({ key, label, group: 'Sections' })),
  ...SERVICES.flatMap(s => [{ key: `services_${s.id}`, label: `Services — ${s.title}`, group: 'Sections' }, { key: `portfolio_${s.id}`, label: `Portfolio — ${s.title}`, group: 'Sections' }]),
  ...BRAND_CLIENTS.map(b => ({ key: `brand_${b.id}`, label: b.name, group: 'Brand kits' })),
  ...WORK_SHOWCASE.map(t => ({ key: `work_${t.id}`, label: t.title, group: 'Portfolio slides' })),
  ...HERO_SLIDES.map(s => ({ key: `slide_${s.id}`, label: s.tag, group: 'Home slides' })),
  ...FEATURED.map(s => ({ key: `featured_${s.id}`, label: s.title, group: 'Featured stories' })),
];
export function isPublished(map: VisibilityMap, key: string): boolean { return map[key] ?? key !== 'portfolio_uploads'; }
export function isPagePublished(map: VisibilityMap, pathname: string) { const key = PAGE_KEYS[pathname]; return !key || isPublished(map, key); }
