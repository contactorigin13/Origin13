import { useSiteContent } from "@/lib/site-content";
import { SiteText } from "@/components/site/SiteText";
import { SectionHeading } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { FALLBACK_TEAM, useTeam } from "@/lib/team";
import { TeamPortrait } from "@/components/site/TeamPortrait";

export function TeamSection() {
  const c = useSiteContent();
  const { data } = useTeam();
  const members = data ?? FALLBACK_TEAM;
  if (!members.length) return null;
  return (
    <section aria-labelledby="team-heading" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
        <div id="team-heading"><SectionHeading eyebrow={(c["about_team_label"] ?? "")} title={(c["about_team_title"] ?? "")} /></div>
        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => (
            <Reveal key={member.id} delay={index * 80}>
              <div className="team-card">
                <TeamPortrait member={member} />
                <div className="team-caption relative mt-6 border-t border-border pt-5">
                  <h3 className="team-name text-2xl leading-tight">{member.name}</h3>
                  <p className="team-role mt-3 inline-block border-l-2 border-transparent text-sm leading-relaxed text-muted-foreground">{member.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}