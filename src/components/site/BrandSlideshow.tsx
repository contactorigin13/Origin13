import { SiteText } from "./SiteText";
import { useSiteContent } from "@/lib/site-content";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type IdentityBoard, type WorkTile } from "@/data/studio";
import { cn } from "@/lib/utils";

/** Home-style slideshow for a group of portfolio tiles (one brand, or one service). */
export function BrandSlideshow({ client, tiles }: {
  client: { id: string; name?: string; description?: string };
  tiles: WorkTile[];
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLElement>(null);
  const playing = visible && !paused && !reduced;
  const label = client.name ?? "Work";

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? false), { threshold: 0.25 });
    if (root.current) observer.observe(root.current);
    return () => { media.removeEventListener("change", sync); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (!playing || tiles.length < 2) return;
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % tiles.length), 7000);
    return () => window.clearTimeout(timer);
  }, [index, playing, tiles.length]);

  const tile = tiles[index] ?? tiles[0];
  if (!tile) return null;
  const go = (direction: number) => setIndex((i) => (i + direction + tiles.length) % tiles.length);

  return (
    <article ref={root} data-brand={client.id} aria-label={`${label} slideshow`} aria-roledescription="carousel" className="min-w-0">
      {client.name && (
        <div className="mb-4">
          <h3 className="text-3xl md:text-4xl">{client.name}</h3>
          {client.description && <p className="mt-1 text-xs leading-5 text-muted-foreground">{client.description}</p>}
        </div>
      )}
      <div className="media-tone relative aspect-[4/3] overflow-hidden bg-scrim">
        {tiles.map((slide, i) => (
          <div key={slide.id} data-slide={i} aria-hidden={i !== index} className={cn("absolute inset-0 transition-opacity duration-[1400ms] motion-reduce:transition-none", i === index ? "z-10 opacity-100" : "opacity-0")}>
            {slide.board ? (
              <div className={cn("h-full w-full", i === index && "animate-kenburns")} style={{ animationPlayState: playing ? "running" : "paused" }}><IdentityBoardView board={slide.board} /></div>
            ) : slide.image ? (
              <img src={slide.image} alt={slide.title} loading="eager" decoding="async" width={1280} height={960} className={cn("h-full w-full object-cover", i === index && "animate-kenburns")} style={{ animationPlayState: playing ? "running" : "paused" }} />
            ) : (
              <div className="video-placeholder flex h-full w-full items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-scrim/60 backdrop-blur"><Play className="h-5 w-5 fill-current text-foreground" /></span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex flex-1 gap-2">
          {tiles.map((slide, i) => (
            <Button key={slide.id} variant="ghost" onClick={() => setIndex(i)} aria-label={`Show ${slide.title}`} aria-pressed={i === index} className="h-8 min-w-0 flex-1 rounded-none p-0">
              <span className={cn("relative block h-px w-full overflow-hidden", i === index ? "bg-primary/30" : "bg-border")}>
                {i === index && <span key={`${index}-${playing}`} className={cn("absolute inset-0 bg-primary", playing && "animate-progress")} />}
              </span>
            </Button>
          ))}
        </div>
        {tiles.length > 1 && (
          <div className="flex shrink-0 gap-1">
            <Button variant="ghost" size="icon" onClick={() => go(-1)} aria-label={`Previous ${label}`} title="Previous"><ChevronLeft /></Button>
            <Button variant="ghost" size="icon" onClick={() => setPaused((value) => !value)} aria-label={`${paused ? "Play" : "Pause"} ${label} slideshow`} title={paused ? "Play" : "Pause"} disabled={reduced}>{paused ? <Play /> : <Pause />}</Button>
            <Button variant="ghost" size="icon" onClick={() => go(1)} aria-label={`Next ${label}`} title="Next"><ChevronRight /></Button>
          </div>
        )}
      </div>
      <div className="flex min-h-16 items-start gap-3" aria-live={playing ? "off" : "polite"}>
        <span className="shrink-0 whitespace-nowrap pt-1 font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")} / {String(tiles.length).padStart(2, "0")}</span>
        <div className="min-w-0">
          {tile.chapter && <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">( {tile.chapter} )</p>}
          <h4 className="font-display text-xl leading-snug">{tile.title.split(" — ")[1] ?? tile.title}</h4>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{tile.blurb}</p>
        </div>
      </div>
    </article>
  );
}

/** Identity boards use each client's own brand colours, so values come from data rather than site tokens. */
function IdentityBoardView({ board }: { board: IdentityBoard }) {
  const c = useSiteContent();
  if (board.type === "palette") {
    return (
      <div className="grid h-full w-full grid-cols-2 md:grid-cols-4">
        {board.colors.map((c, i) => (
          <div key={c.hex} className="flex flex-col justify-end p-4 md:p-5" style={{ backgroundColor: c.hex, color: i === 1 || isDark(c.hex) ? "#FAFAF7" : "#111111" }}>
            <span className="font-mono text-[10px] uppercase tracking-widest opacity-70">{c.role}</span>
            <span className="mt-1 text-base font-semibold leading-tight md:text-lg">{c.name}</span>
            <span className="font-mono text-xs opacity-80">{c.hex}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-col justify-between p-6 md:p-10" style={{ backgroundColor: board.paper, color: board.ink }}>
      <div className="flex items-start justify-between font-mono text-[10px] uppercase tracking-widest opacity-70">
        <span>{c["portfolio_typeface_label"] ?? "Typeface"}</span><span>{board.display.family}</span>
      </div>
      <div>
        {board.display.image ? <img src={board.display.image} alt={board.display.sample} className="h-auto w-[min(100%,26rem)] md:w-[30rem]" /> : <p className="leading-none" style={{ fontFamily: board.display.stack, fontWeight: board.display.weight, fontSize: "clamp(3rem, 11vw, 7.5rem)", letterSpacing: board.display.sample === board.display.sample.toUpperCase() ? "0.12em" : "-0.02em" }}>{board.display.sample}</p>}
        <p className="mt-4 text-lg tracking-wide md:text-2xl" style={{ fontFamily: board.text.stack, fontWeight: 300 }}>{c["portfolio_typeface_alphabet"] ?? "Aa Bb Cc Dd Ee Ff Gg 0123456789"}</p>
      </div>
      <p className="max-w-md text-sm leading-relaxed md:text-base" style={{ fontFamily: board.text.stack, color: board.accent }}>{board.text.sample}</p>
    </div>
  );
}

function isDark(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 < 128;
}
