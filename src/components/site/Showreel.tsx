import { useState } from "react";
import { Play } from "lucide-react";
import { SiteText } from "@/components/site/SiteText";
import { Reveal } from "@/components/site/Reveal";
import { useSiteContent } from "@/lib/site-content";
import { parseVideo, withAutoplay } from "@/lib/video";

/** Home page showreel: shows only when a YouTube or Vimeo link is set in the Admin. The player loads when it is pressed. */
export function Showreel() {
  const c = useSiteContent();
  const video = parseVideo(c["home_showreel_url"] ?? "");
  const [playing, setPlaying] = useState(false);
  if (!video) return null;
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32" aria-label="Showreel">
      <Reveal>
        <p className="eyebrow"><SiteText name="home_showreel_label">Showreel</SiteText></p>
        <h2 className="mt-5 max-w-3xl text-4xl leading-tight md:text-6xl"><SiteText name="home_showreel_title">Watch our work.</SiteText></h2>
      </Reveal>
      <div className="media-tone relative mt-12 aspect-video w-full overflow-hidden bg-scrim">
        {playing ? (
          <iframe src={withAutoplay(video.embed)} title="Origin 13 showreel" className="absolute inset-0 h-full w-full" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} aria-label="Play the showreel" className="group absolute inset-0 block h-full w-full">
            {video.thumbnail ? <img src={video.thumbnail} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105" /> : <div className="video-placeholder h-full w-full" />}
            <span className="absolute inset-0 bg-scrim/30 transition-colors group-hover:bg-scrim/45" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-elegant transition-transform duration-300 group-hover:scale-110"><Play className="h-7 w-7 fill-current" /></span>
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
