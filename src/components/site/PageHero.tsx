import type { ReactNode } from "react";
import { useCover, type CoverPage } from "@/lib/covers";

export function PageHero({ page, eyebrow, title, intro }: { page: CoverPage; eyebrow: string; title: ReactNode; intro: string }) {
  const image = useCover(page);
  return (
    <section className="media-tone grain relative flex min-h-[78vh] items-end overflow-hidden">
      <img key={image} src={image} alt="" className="absolute inset-0 h-full w-full object-cover animate-kenburns" />
      <div className="absolute inset-0 bg-hero-scrim" />
      <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 pt-40 lg:px-10">
        <p className="eyebrow animate-rise">{eyebrow}</p>
        <h1 className="mt-6 max-w-4xl text-5xl leading-[1.02] animate-rise [animation-delay:120ms] md:text-7xl lg:text-8xl">{title}</h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-foreground/80 animate-rise [animation-delay:240ms]">{intro}</p>
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, className }: { eyebrow: string; title: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-5 text-4xl leading-tight md:text-6xl">{title}</h2>
    </div>
  );
}
