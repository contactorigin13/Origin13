/**
 * The public address of the website, used for share previews and (later) search-engine links.
 * To test sharing before the domain is connected, set VITE_SITE_URL in Vercel to the temporary
 * vercel.app address and redeploy.
 */
export const SITE_URL = ((import.meta.env["VITE_SITE_URL"] as string | undefined) || "https://origin13.com").replace(/\/+$/, "");
