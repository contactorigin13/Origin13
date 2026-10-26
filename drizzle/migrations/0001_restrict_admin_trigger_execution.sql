REVOKE EXECUTE ON FUNCTION public.assign_origin_admin() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.assign_origin_admin() TO service_role;