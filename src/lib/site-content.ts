import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EXTRA_CONTENT_FIELDS } from "@/lib/editor-fields";
import { PORTFOLIO_CONTENT_FIELDS } from "@/lib/portfolio-content";

/** Editable website text. The default is shown until a saved value exists. */
export const CONTENT_FIELDS = [
  { key: "home_intro", label: "Home — intro paragraph", multiline: true, default: "We are Origin 13, a communications team based in Ethiopia. We make films, photographs, designs and campaigns that help you share your work with the people you want to reach." },
  { key: "home_work_title", label: "Home — work section title", multiline: false, default: "Our work, told with care." },
  { key: "about_intro", label: "About — top text", multiline: true, default: "We are a communications team based in Addis Ababa. We make films, take photographs, cover events and help organizations with design and campaigns." },
  { key: "about_experience", label: "About — company experience (leave an empty line between paragraphs)", multiline: true, default: "For more than 12 years, our team has worked with organizations across Ethiopia and East Africa. From filming in rural communities to covering events and creating brand designs, we bring practical experience to every project.\n\nThat experience helps us ask the right questions, plan for the conditions on the ground and keep the work focused on your goals. We understand that each project needs clear communication, careful preparation and respect for the people involved.\n\nWe bring our skills in film, photography, editing, design and communications together as one team. From the first conversation to the final files, we work with you to make sure the result is clear, useful and ready to share." },
  { key: "about_story", label: "About — our story (leave an empty line between paragraphs)", multiline: true, default: "For more than 12 years our team has worked across Ethiopia, Kenya, Somalia, Djibouti and South Sudan — in laboratories, rural communities, courtrooms and highland farms.\n\nWe believe the people in front of the lens deserve the same respect as the institutions behind the project. That is why we spend time before we film, ask before we photograph, and stay long enough to understand.\n\nWe make films and photographs that show the work clearly and treat people with respect." },
  { key: "services_intro", label: "Services — top text", multiline: true, default: "Films, photography, live events, design and campaigns. One team, based in Addis Ababa and working across East Africa." },
  { key: "portfolio_intro", label: "Portfolio — top text", multiline: true, default: "Five services, one team. Films, live broadcasts, brands, campaigns and communication plans — made in Ethiopia for clients across Africa." },
  ...PORTFOLIO_CONTENT_FIELDS,
  ...EXTRA_CONTENT_FIELDS,
  { key: "contact_intro", label: "Contact — top text", multiline: true, default: "Need a film, event coverage, a new brand or a campaign? Tell us about your project." },
] as const;

export type ContentKey = string;
export type ContentMap = Record<ContentKey, string>;

export const DEFAULT_CONTENT = { ...Object.fromEntries(CONTENT_FIELDS.map((f) => [f.key, f.default])), partners_list: "" } as ContentMap;

export async function fetchContent(resolveMedia = true): Promise<ContentMap> {
  const { data, error } = await supabase.from("content").select("key, value");
  if (error) throw error;
  const map = { ...DEFAULT_CONTENT };
  for (const row of data ?? []) {
    if (row.key in map) map[row.key as ContentKey] = row.value;
  }
  const paths = Object.values(map).filter(v => v.startsWith("storage:")).map(v => v.slice(8));
  if (resolveMedia && paths.length) {
    const { data: urls } = await supabase.storage.from("portfolio-assets").createSignedUrls(paths, 604800);
    const signed = new Map((urls ?? []).map(u => [u.path, u.signedUrl]));
    for (const key of Object.keys(map)) if (map[key]?.startsWith("storage:")) map[key] = signed.get(map[key].slice(8)) ?? "";
  }
  if (resolveMedia && map["partners_list"]) {
    try {
      const list = JSON.parse(map["partners_list"]);
      const refs = Array.isArray(list) ? list.filter(p => typeof p?.logo === "string" && p.logo.startsWith("storage:")).map(p => p.logo.slice(8)) : [];
      if (refs.length) {
        const { data: urls } = await supabase.storage.from("portfolio-assets").createSignedUrls(refs, 604800);
        const signed = new Map((urls ?? []).map(u => [u.path, u.signedUrl]));
        for (const p of list) if (typeof p?.logo === "string" && p.logo.startsWith("storage:")) p.logo = signed.get(p.logo.slice(8)) ?? "";
        map["partners_list"] = JSON.stringify(list);
      }
    } catch { /* Invalid lists fall back to the original logos. */ }
  }
  if (resolveMedia) {
    for (const key of Object.keys(map).filter(key => key.endsWith("_board"))) {
      try {
        const board = JSON.parse(map[key] ?? "");
        const image = board.display?.image;
        if (typeof image === "string" && image.startsWith("storage:")) {
          const { data } = await supabase.storage.from("portfolio-assets").createSignedUrl(image.slice(8), 604800);
          if (data?.signedUrl) { board.display.image = data.signedUrl; map[key] = JSON.stringify(board); }
        }
      } catch { /* Invalid boards fall back to their original design. */ }
    }
  }
  return map;
}

export function useSiteContent(): ContentMap {
  const { data } = useQuery({ queryKey: ["site-content"], queryFn: () => fetchContent(), staleTime: 60_000 });
  return data ?? DEFAULT_CONTENT;
}
