import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { VisibilityMap } from './publication';
export async function fetchVisibility(): Promise<VisibilityMap> {
  const { data, error } = await supabase.from('site_visibility').select('key, published');
  if (error) throw error;
  return Object.fromEntries((data ?? []).map(row => [row.key, row.published]));
}
export function useVisibility() { return useQuery({ queryKey: ['site-visibility'], queryFn: fetchVisibility, staleTime: 0 }); }
