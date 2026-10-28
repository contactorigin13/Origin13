import type { PointerEvent } from "react";
import type { DisplayTeamMember } from "@/lib/team-data";

export function TeamPortrait({ member }: { member: DisplayTeamMember }) {
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const frame = event.currentTarget;
    const bounds = frame.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    frame.style.setProperty("--portrait-x", `${x * 14}px`);
    frame.style.setProperty("--portrait-y", `${y * 14}px`);
  };
  const reset = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.removeProperty("--portrait-x");
    event.currentTarget.style.removeProperty("--portrait-y");
  };
  return (
    <div className="team-portrait relative aspect-[3/4] overflow-hidden bg-[oklch(0.17_0_0)]" onPointerMove={move} onPointerLeave={reset}>
      {member.display_url ? (
        <>
          <img src={member.display_url} alt={member.temporary ? `Temporary portrait for ${member.name}` : member.name} width={768} height={1024} loading="lazy" className="team-portrait-image h-full w-full object-cover" />
          <span aria-hidden="true" className="team-portrait-shade pointer-events-none absolute inset-0" />
          <span aria-hidden="true" className="portrait-viewfinder pointer-events-none absolute inset-5">
            <span className="absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 border-primary" />
            <span className="absolute right-0 top-0 h-5 w-5 border-r-2 border-t-2 border-primary" />
            <span className="absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 border-primary" />
            <span className="absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-primary" />
          </span>
        </>
      ) : (
        <div className="flex h-full items-center justify-center font-display text-6xl text-muted-foreground" aria-label={`No portrait for ${member.name}`}>
          {member.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("")}
        </div>
      )}
    </div>
  );
}