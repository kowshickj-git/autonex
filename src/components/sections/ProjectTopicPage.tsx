import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureList } from "@/components/ui/FeatureList";
import { CtaBand } from "@/components/ui/CtaBand";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

export type ProjectIdea = {
  title: string;
  body: string;
  stack: string[];
};

/**
 * Shared layout for the five College Project topic pages.
 *
 * Every one follows the same shape - project ideas, what is delivered,
 * technologies - so a student comparing two topics is comparing like with
 * like rather than re-learning a new page each time.
 */
export function ProjectTopicPage({
  eyebrow,
  title,
  lead,
  ideas,
  deliverables,
  technologies,
  whatsappMessage,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  ideas: ProjectIdea[];
  deliverables: string[];
  technologies: string[];
  whatsappMessage: string;
}) {
  return (
    <>
      <PageHero
        eyebrow="College Projects"
        title={title}
        lead={lead}
        crumbs={[{ label: "College Projects", href: "/college-projects" }, { label: eyebrow }]}
      >
        <Link href="/contact" className="btn btn-primary">
          Discuss Your Project
          <ArrowRight className="btn-arrow size-4" strokeWidth={2.2} />
        </Link>
      </PageHero>

      {/* Project ideas */}
      <section className="section bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Project Ideas"
            title="Directions students take this"
            lead="Starting points, not a fixed menu. Bring your own idea and we will tell you honestly whether it is achievable in your timeframe."
            align="center"
          />

          <RevealGroup each={0.06} className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ideas.map((idea) => (
              <RevealItem
                key={idea.title}
                data-cursor="card"
                className="card card-hover group flex h-full flex-col p-6"
              >
                <h3 className="text-base font-bold leading-snug text-navy-900 transition-colors duration-300 group-hover:text-royal-700">
                  {idea.title}
                </h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-7">{idea.body}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {idea.stack.map((item) => (
                    <li
                      key={item}
                      className="numeric rounded-md bg-slate-2 px-2 py-0.5 text-[10px] text-slate-6 transition-colors duration-300 group-hover:bg-royal-50 group-hover:text-royal-700"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Deliverables + technologies */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div aria-hidden="true" className="tech-grid absolute inset-0" />
        <div
          aria-hidden="true"
          className="tech-bloom absolute inset-0"
          style={{ ["--bloom-x" as string]: "25%", ["--bloom-y" as string]: "40%" }}
        />
        <div className="container-page relative section">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="What You Get"
                title="Delivered so you can defend it"
                lead="A working project you cannot explain is worth very little at a viva. Everything below exists so you can answer the question behind the demo."
                invert
              />

              <Reveal delay={0.2}>
                <div className="mt-8">
                  <p className="eyebrow text-[10px] text-white/40">Technologies</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {technologies.map((technology) => (
                      <li
                        key={technology}
                        className="numeric rounded-md bg-white/8 px-2.5 py-1 text-[11px] text-royal-300"
                      >
                        {technology}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <FeatureList items={deliverables} columns={1} invert />
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Talk through your project idea"
        lead="Tell us your topic, your deadline and what your department expects. We will tell you what is realistic before you commit to it."
        primaryLabel="Discuss Your Project"
        whatsappMessage={whatsappMessage}
      />
    </>
  );
}
