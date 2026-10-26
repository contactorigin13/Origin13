import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import type { Database } from '@/integrations/supabase/types';
export const getPageMetadata = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ page: z.enum(['home','about','services','portfolio','contact']) }))
  .handler(async ({ data }) => {
    const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
    const url = process.env['SUPABASE_URL'];
    if (!key || !url) return {} as Record<string, string>;
    const client = createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
      headers.set('apikey', key);
      return fetch(input, { ...init, headers });
    } } });
    const { data: rows, error } = await client.from('content').select('key, value').in('key', [`seo_${data.page}_title`, `seo_${data.page}_description`]);
    if (error) throw error;
    return Object.fromEntries((rows ?? []).map(row => [row.key, row.value]));
  });
