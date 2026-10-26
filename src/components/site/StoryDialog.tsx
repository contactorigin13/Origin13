import { useSiteContent } from "@/lib/site-content";
import { SiteText } from "@/components/site/SiteText";
import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { MapPin, X } from "lucide-react";
import type { Story } from "@/data/studio";

export function StoryDialog({ story, onClose }: { story: Story | null; onClose: () => void }) {
  useEffect(() => {
    if (!story) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [story, onClose]);

  if (!story) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center md:items-center md:p-8" role="dialog" aria-modal="true" aria-label={story.title}>
      <button className="absolute inset-0 bg-scrim/90 backdrop-blur-sm animate-in fade-in" onClick={onClose} aria-label="Close story" />
      <article className="relative max-h-[94vh] w-full max-w-5xl overflow-y-auto bg-card shadow-elegant animate-in fade-in slide-in-from-bottom-8 duration-500">
        <button onClick={onClose} className="media-tone absolute right-4 top-4 z-10 rounded-full bg-scrim/70 p-2 text-foreground hover:bg-primary hover:text-primary-foreground" aria-label="Close">
          <X className="h-5 w-5" />
        </button>
        <div className="media-tone relative aspect-[16/9] overflow-hidden">
          <img src={story.image} alt={story.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-card-scrim" />
          <div className="absolute bottom-0 p-6 md:p-10">
            <p className="eyebrow">{story.category === "documentary" ? <SiteText name="story_documentary_label">Documentary</SiteText> : <SiteText name="story_photo_label">Photo essay</SiteText>}{story.partner ? ` · ${story.partner}` : ""}</p>
            <h2 className="mt-3 text-3xl md:text-5xl">{story.title}</h2>
          </div>
        </div>
        <div className="grid gap-10 p-6 md:grid-cols-[1.6fr_1fr] md:p-10">
          <div>
            <p className="text-lg text-foreground/90">{story.subtitle}</p>
            <p className="mt-5 leading-relaxed text-muted-foreground">{story.synopsis}</p>
            {story.quote && (
              <blockquote className="mt-8 border-l-2 border-primary pl-6 font-display text-xl italic leading-snug text-foreground">
                “{story.quote}”
              </blockquote>
            )}
          </div>
          <aside className="space-y-6 border-t border-border pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <div>
              <p className="eyebrow !text-muted-foreground"><SiteText name="story_location_label">Location</SiteText></p>
              <p className="mt-2 flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{story.location}</p>
            </div>
            <div>
              <p className="eyebrow !text-muted-foreground"><SiteText name="story_notes_label">Field notes</SiteText></p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{story.fieldNotes}</p>
            </div>
            <Link to="/contact" onClick={onClose} className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
              <SiteText name="story_cta">Commission a similar story</SiteText>
            </Link>
          </aside>
        </div>
      </article>
    </div>
  );
}
