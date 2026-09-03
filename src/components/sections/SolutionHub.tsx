import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SolutionCard } from "@/components/ui/SolutionCard";
import { InfoGrid, TagGrid, type InfoItem } from "@/components/ui/InfoGrid";
import { CtaBand } from "@/components/ui/CtaBand";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { solutions, type Solution } from "@/lib/services";

/**
 * Shared layout for the three category hubs (Automation, Water, Security).
 * Each one lists the solutions in its group, then explains the approach that
 * ties them together.
 */
export function SolutionHub({
  eyebrow,
  title,
  lead,
  group,
  approachTitle,
  approachLead,
  approach,
  applications,
  ctaTitle,
  ctaLead,
  whatsappMessage,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  group: Solution["group"];
  approachTitle: string;
  approachLead: string;
  approach: InfoItem[];
  applications: string[];
  ctaTitle: string;
  ctaLead: string;
  whatsappMessage: string;
}) {
  const items = solutions.filter((solution) => solution.group === group);

  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} lead={lead} crumbs={[{ label: eyebrow }]} />

      <section className="section bg-slate-1">
        <div className="container-page">
          <SectionHeading
            eyebrow="Solutions"
            title="What we deliver in this area"
            align="center"
          />

          <RevealGroup
            each={0.06}
            className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((solution) => (
              <RevealItem key={solution.slug}>
                <SolutionCard solution={solution} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Our Approach"
            title={approachTitle}
            lead={approachLead}
            align="center"
          />
          <div className="mt-12">
            <InfoGrid items={approach} />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div aria-hidden="true" className="tech-grid absolute inset-0" />
        <div
          aria-hidden="true"
          className="tech-bloom absolute inset-0"
          style={{ ["--bloom-x" as string]: "70%" }}
        />
        <div className="container-page relative section">
          <SectionHeading eyebrow="Applications" title="Where these systems run" align="center" invert />
          <div className="mt-10 flex justify-center">
            <TagGrid items={applications} invert />
          </div>
        </div>
      </section>

      <CtaBand title={ctaTitle} lead={ctaLead} whatsappMessage={whatsappMessage} />
    </>
  );
}
