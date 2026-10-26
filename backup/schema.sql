CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TABLE public.user_roles (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, role public.app_role NOT NULL, UNIQUE(user_id, role));
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles r JOIN auth.users u ON u.id = r.user_id WHERE r.user_id = auth.uid() AND r.role = 'admin' AND u.email_confirmed_at IS NOT NULL) $$;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;
CREATE OR REPLACE FUNCTION public.assign_origin_admin() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$ BEGIN IF lower(NEW.email) = 'contactorigin13@gmail.com' AND NEW.email_confirmed_at IS NOT NULL THEN INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT (user_id, role) DO NOTHING; END IF; RETURN NEW; END $$;
REVOKE ALL ON FUNCTION public.assign_origin_admin() FROM PUBLIC;
CREATE TRIGGER origin_admin_on_verified_user AFTER INSERT OR UPDATE OF email_confirmed_at, email ON auth.users FOR EACH ROW EXECUTE FUNCTION public.assign_origin_admin();
CREATE TABLE public.content (key text PRIMARY KEY, value text NOT NULL DEFAULT '', updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content TO authenticated;
GRANT ALL ON public.content TO service_role;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read content" ON public.content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin inserts content" ON public.content FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin updates content" ON public.content FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin deletes content" ON public.content FOR DELETE TO authenticated USING (public.is_admin());
CREATE TABLE public.projects (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL, description text NOT NULL DEFAULT '', media_type text NOT NULL CHECK (media_type IN ('image','video_embed')), media_url text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read projects" ON public.projects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin inserts projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin updates projects" ON public.projects FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin deletes projects" ON public.projects FOR DELETE TO authenticated USING (public.is_admin());
CREATE POLICY "Anyone can view portfolio assets" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'portfolio-assets');
CREATE POLICY "Admin uploads portfolio assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio-assets' AND public.is_admin());
CREATE POLICY "Admin updates portfolio assets" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio-assets' AND public.is_admin()) WITH CHECK (bucket_id = 'portfolio-assets' AND public.is_admin());
CREATE POLICY "Admin deletes portfolio assets" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio-assets' AND public.is_admin());
INSERT INTO public.projects (title, description, media_type, media_url, created_at) VALUES
('Pathways to Redress', 'A documentary series for ICTJ about truth-seeking and reparations, built on interviews with more than 60 elders, survivors and legal experts.', 'image', '/images/slide-3.jpg', now() - interval '8 minutes'),
('The Cold Chain Sentinel', 'A film for Africa CDC inside the laboratories that track disease across the continent.', 'image', '/images/slide-2.jpg', now() - interval '7 minutes'),
('Grain & Grace', 'A film for the Global Food Banking Network about school feeding groups and grain banks in southern Ethiopia.', 'image', '/images/slide-1.jpg', now() - interval '6 minutes'),
('The Frontline Midwives', 'A film for WI HER about women health workers making birth safer in the Afar Region.', 'image', '/images/slide-4.jpg', now() - interval '5 minutes'),
('Common Soil', 'A film for the Life and Peace Institute about peace agreements made by elder councils near the Kenya border.', 'image', '/images/elders.jpg', now() - interval '4 minutes'),
('Piazza Arcades', 'A black-and-white photo essay of old buildings, tailor shops and coffee houses in Piazza, Addis Ababa.', 'image', '/images/piazza.jpg', now() - interval '3 minutes'),
('Depression of White Gold', 'Photographs of salt workers and caravan guides in the Danakil Depression.', 'image', '/images/danakil.jpg', now() - interval '2 minutes'),
('The Loom, the Bamboo & the Hive', 'Portraits of weavers in their bamboo homes in Chencha and Dorze.', 'image', '/images/dorze.jpg', now() - interval '1 minute');REVOKE EXECUTE ON FUNCTION public.assign_origin_admin() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.assign_origin_admin() TO service_role;ALTER TABLE public.projects ADD COLUMN published boolean NOT NULL DEFAULT false;
DROP POLICY "Anyone can read projects" ON public.projects;
CREATE POLICY "Published projects are public" ON public.projects FOR SELECT TO anon, authenticated USING (published);
CREATE POLICY "Admins read unpublished projects" ON public.projects FOR SELECT TO authenticated USING (public.is_admin());
CREATE TABLE public.site_visibility (key text PRIMARY KEY, published boolean NOT NULL DEFAULT true, updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.site_visibility TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_visibility TO authenticated;
GRANT ALL ON public.site_visibility TO service_role;
ALTER TABLE public.site_visibility ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public visibility settings" ON public.site_visibility FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage visibility" ON public.site_visibility FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());ALTER TABLE public.projects ADD COLUMN kind text NOT NULL DEFAULT 'upload' CHECK (kind IN ('upload','story','brand_kit'));
ALTER TABLE public.projects ADD COLUMN service text;
ALTER TABLE public.projects ADD COLUMN subtitle text NOT NULL DEFAULT '';
ALTER TABLE public.projects ADD COLUMN slides jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.projects ADD COLUMN sort_order integer NOT NULL DEFAULT 0;