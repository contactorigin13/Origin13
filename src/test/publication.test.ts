import { describe, expect, it } from 'vitest';
import { isPublished, isPagePublished, PUBLICATION_ITEMS } from '@/lib/publication';
import { resolveStudio } from '@/lib/editor-fields';
import { BRAND_CLIENTS, WORK_SHOWCASE } from '@/data/studio';
describe('preserved website publication', () => {
  it('keeps Latest Uploads unpublished until explicitly published', () => {
    expect(isPublished({}, 'portfolio_uploads')).toBe(false);
    expect(isPublished({ portfolio_uploads: true }, 'portfolio_uploads')).toBe(true);
  });
  it('unpublishes pages without affecting admin access', () => {
    expect(isPagePublished({ page_portfolio: false }, '/portfolio')).toBe(false);
    expect(isPagePublished({ page_portfolio: false }, '/admin')).toBe(true);
  });
  it('retains both brand kits and all work when unpublished', () => {
    expect(BRAND_CLIENTS.map(b => b.id)).toEqual(['abbro', 'macha']);
    const map = { brand_abbro: false };
    expect(isPublished(map, 'brand_abbro')).toBe(false);
    expect(WORK_SHOWCASE.filter(t => t.client === 'abbro').length).toBe(8);
    expect(PUBLICATION_ITEMS.some(i => i.key === 'brand_abbro')).toBe(true);
  });
  it('keeps empty saved values instead of silently restoring defaults', () => {
    expect(resolveStudio({ company_phone: '' }).company.phone).toBe('');
  });
});
