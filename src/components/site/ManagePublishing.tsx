import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useVisibility } from '@/lib/visibility';
import { PUBLICATION_ITEMS, isPublished } from '@/lib/publication';
import { supabase } from '@/integrations/supabase/client';
import { BRAND_CLIENTS, SERVICES, WORK_SHOWCASE } from '@/data/studio';

type Item = (typeof PUBLICATION_ITEMS)[number];
const PAGES = [
  { name: 'Home', key: 'page_home' },
  { name: 'About', key: 'page_about' },
  { name: 'Services', key: 'page_services' },
  { name: 'Portfolio', key: 'page_portfolio' },
  { name: 'Contact', key: 'page_contact' },
  { name: 'Shared', key: '' },
];

/** Which page an item belongs to, and which sub-group inside that page. */
function placeOf(i: Item): { page: string; sub: string } {
  if (i.group === 'Home slides') return { page: 'Home', sub: 'Top slideshow' };
  if (i.group === 'Featured stories') return { page: 'Home', sub: 'Featured stories' };
  if (i.group === 'Brand kits') return { page: 'Portfolio', sub: 'Brand kits' };
  if (i.group === 'Portfolio slides') {
    const t = WORK_SHOWCASE.find(w => `work_${w.id}` === i.key);
    const brand = BRAND_CLIENTS.find(b => b.id === t?.client);
    const service = SERVICES.find(s => s.id === t?.service);
    return { page: 'Portfolio', sub: brand ? `${brand.name} slides` : service ? `${service.title} slides` : 'Slides' };
  }
  const page = i.label.split(' — ')[0] ?? 'Shared';
  return { page: PAGES.some(p => p.name === page) ? page : 'Shared', sub: 'Sections' };
}

export function ManagePublishing() {
  const { data, isError } = useVisibility();
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const update = async (key: string, published: boolean) => {
    setBusy(key);
    const { error } = await supabase.from('site_visibility').upsert({ key, published, updated_at: new Date().toISOString() });
    if (error) toast.error(error.message);
    else { await qc.invalidateQueries({ queryKey: ['site-visibility'] }); toast.success(published ? 'Published.' : 'Unpublished. Content is preserved.'); }
    setBusy(null);
  };
  if (!data) return <p>{isError ? 'Publishing settings could not be loaded.' : 'Loading…'}</p>;

  const q = search.toLowerCase();
  const row = (i: Item, label = i.label.replace(/^[^—]+— /, '')) => (
    <li key={i.key} className="flex items-center justify-between gap-4 py-3">
      <Label htmlFor={i.key} className="flex-1 leading-relaxed">{label}</Label>
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isPublished(data, i.key) ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>{isPublished(data, i.key) ? 'Published' : 'Unpublished'}</span>
      <Switch id={i.key} aria-label={`Publish ${i.label}`} checked={isPublished(data, i.key)} disabled={busy !== null} onCheckedChange={v => update(i.key, v)} />
    </li>
  );
  const children = PUBLICATION_ITEMS.filter(i => i.group !== 'Pages' && i.label.toLowerCase().includes(q));

  return <div>
    <Label htmlFor="publish-search">Find a page or content section</Label>
    <Input id="publish-search" className="mt-2" value={search} onChange={e => setSearch(e.target.value)} />
    <p className="mt-4 text-sm text-muted-foreground">Turning a page off hides the whole page. Turning a section off hides just that part. Nothing is deleted.</p>
    <Accordion type="multiple" className="mt-6 border-t border-border">
      {PAGES.map(p => {
        const pageItem = PUBLICATION_ITEMS.find(i => i.key === p.key);
        const items = children.filter(i => placeOf(i).page === p.name);
        if (!items.length && !(pageItem && p.name.toLowerCase().includes(q))) return null;
        const subs = [...new Set(items.map(i => placeOf(i).sub))];
        const pageOn = pageItem ? isPublished(data, pageItem.key) : true;
        return <AccordionItem key={p.name} value={p.name} className="border-border">
          <AccordionTrigger className="py-5 hover:no-underline">
            <span className="flex flex-wrap items-baseline gap-x-4 text-left">
              <span className="font-display text-xl md:text-2xl">{p.name === 'Shared' ? 'Shared (every page)' : `${p.name} page`}</span>
              <span className="text-sm font-normal text-muted-foreground">{pageItem ? (pageOn ? 'Published' : 'Unpublished') + ' · ' : ''}{items.length} sections & items</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            {pageItem && <ul className="mb-4 border-y border-border bg-card px-4">{row(pageItem, `Whole ${p.name} page`)}</ul>}
            {subs.map(sub => <div key={sub} className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{sub}</h3>
              <ul className="mt-2 divide-y divide-border border-y border-border">{items.filter(i => placeOf(i).sub === sub).map(i => row(i))}</ul>
            </div>)}
          </AccordionContent>
        </AccordionItem>;
      })}
    </Accordion>
  </div>;
}
