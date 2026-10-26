ALTER TABLE public.projects ADD COLUMN kind text NOT NULL DEFAULT 'upload' CHECK (kind IN ('upload','story','brand_kit'));
ALTER TABLE public.projects ADD COLUMN service text;
ALTER TABLE public.projects ADD COLUMN subtitle text NOT NULL DEFAULT '';
ALTER TABLE public.projects ADD COLUMN slides jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.projects ADD COLUMN sort_order integer NOT NULL DEFAULT 0;