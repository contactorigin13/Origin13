import type { ReactNode } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { useVisibility } from '@/lib/visibility';
import { isPagePublished, isPublished } from '@/lib/publication';
import { useSiteReady } from '@/lib/site-ready';
export function Published({ name, children }: { name: string; children: ReactNode }) {
  const { data } = useVisibility();
  return data && isPublished(data, name) ? children : null;
}
export function PublishedPage({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: s => s.location.pathname });
  const { data, isError } = useVisibility();
  const ready = useSiteReady(pathname);
  if (!['/', '/about', '/services', '/portfolio', '/contact'].includes(pathname)) return children;
  if (!data || (!ready && !isError)) return <div className="min-h-screen pt-40 text-center text-muted-foreground">{isError ? 'This page could not be loaded.' : 'Loading…'}</div>;
  if (!isPagePublished(data, pathname)) return <div className="min-h-screen px-6 pt-40 text-center"><h1 className="text-4xl">Page unavailable</h1><p className="mt-4 text-muted-foreground">This page is not currently published.</p></div>;
  return children;
}
