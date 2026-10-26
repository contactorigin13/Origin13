import type { ReactNode } from 'react';
import { DEFAULT_CONTENT, useSiteContent } from '@/lib/site-content';
export function SiteText({ name, children }: { name: string; children: ReactNode }) {
  const content = useSiteContent();
  return content[name] === DEFAULT_CONTENT[name] ? children : content[name] ?? children;
}
