import { useSiteContent } from "@/lib/site-content";
import logoSource from "../../../public/images/logo-light.svg?raw";

// Only this bundled, trusted artwork is inlined; no editable content enters it.
const artwork = logoSource
  .replace(/<\?xml[^>]*\?>\s*/, "")
  .replaceAll("cls-", "origin-header-logo-")
  .replace("#1b94bc", "var(--logo-mark)")
  .replace("#ffffff", "var(--foreground)");

export function SiteLogo({ className = "h-11 w-[87px]" }: { className?: string }) {
  const c = useSiteContent();
  if ((c["site_logo"] ?? "")) return <img src={(c["site_logo"] ?? "")} alt="Origin 13" className={className} />;
  return (
    <span
      className={`site-logo block ${className}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: artwork }}
    />
  );
}