import { resolveStudio } from "@/lib/editor-fields";
import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { useSiteContent } from "@/lib/site-content";
import { SiteText } from "@/components/site/SiteText";
import { PARTNERS } from "@/data/studio";

export function PartnerStrip() {
  const c = useSiteContent();
  const { partners } = resolveStudio(c);
  const row = [...partners, ...partners];
  const [paused, setPaused] = useState(false);
  return (
    <section className="relative bg-paper py-16 text-paper-foreground" aria-label="Institutional partners">
      <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play logo scrolling" : "Pause logo scrolling"} title={paused ? "Play" : "Pause"} className="absolute right-4 top-4 rounded-full border border-paper-foreground/25 p-2 text-paper-foreground/70 transition-colors hover:text-paper-foreground md:right-8 md:top-6">
        {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
      </button>
      <p className="text-center text-xs font-bold uppercase tracking-[0.28em] text-paper-foreground/60">
        <SiteText name="home_partners_label">Trusted by institutions shaping the continent</SiteText>
      </p>
      <div className="relative mt-10 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <ul style={paused ? { animationPlayState: "paused" } : undefined} className="partner-marquee flex w-max animate-marquee items-center gap-10 pr-10 md:gap-20 md:pr-20">
          {row.map((p, i) => (
            // The second copy only makes the scroll loop seamless, so screen readers skip it.
            <li key={i} aria-hidden={i >= partners.length ? true : undefined} className="flex h-14 w-32 shrink-0 items-center justify-center md:h-16 md:w-44">
              <img src={p.logo} alt={i >= partners.length ? "" : p.name} title={p.name} className="max-h-14 max-w-full md:max-h-16 object-contain grayscale transition-[filter] duration-500 hover:grayscale-0 motion-reduce:transition-none" loading="lazy" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
