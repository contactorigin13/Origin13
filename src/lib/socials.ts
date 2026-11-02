/** Social profiles shown in the footer. A profile appears only when its address is filled in the Admin. */
export const SOCIALS = [
  ["linkedin", "LinkedIn"],
  ["youtube", "YouTube"],
  ["vimeo", "Vimeo"],
  ["instagram", "Instagram"],
  ["facebook", "Facebook"],
  ["x", "X"],
  ["tiktok", "TikTok"],
] as const;

export type SocialLink = { label: string; url: string };

export function socialLinks(content: Record<string, string> | undefined): SocialLink[] {
  const links: SocialLink[] = [];
  for (const [key, label] of SOCIALS) {
    const raw = (content?.[`social_${key}`] ?? "").trim();
    if (!raw) continue;
    const url = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    try {
      const parsed = new URL(url);
      if (parsed.protocol === "https:" || parsed.protocol === "http:") links.push({ label, url: parsed.toString() });
    } catch {
      /* an invalid address is simply not shown */
    }
  }
  return links;
}

/** Click-to-chat address for a WhatsApp number written in any style, e.g. "+251 91 122 3344". Empty when the number looks wrong. */
export function whatsappLink(number: string | undefined): string {
  const digits = (number ?? "").replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15 ? `https://wa.me/${digits}` : "";
}
