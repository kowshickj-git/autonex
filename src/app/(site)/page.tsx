import Link from "next/link";
import { ArrowRight, Gauge, ShieldCheck, Wrench } from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SolutionCard } from "@/components/ui/SolutionCard";
import { StatsBand } from "@/components/ui/StatsBand";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";
import { CtaBand } from "@/components/ui/CtaBand";
import { Faq, type FaqItem } from "@/components/ui/Faq";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { ProjectCategoryCard } from "@/components/ui/ProjectCategoryCard";
import { projectCategories, solutions } from "@/lib/services";
import { homeStats } from "@/lib/site";

const differentiators = [
  {
    icon: Wrench,
    title: "One team, every discipline",
    body: "Automation, electrical, water treatment and software handled in-house - so nothing falls between two vendors.",
  },
  {
    icon: Gauge,
    title: "Engineered, not assembled",
    body: "Load calculations, correct component sizing and a documented wiring schematic before a single part is ordered.",
  },
  {
    icon: ShieldCheck,
    title: "Support that answers",
    body: "The engineer who commissioned your system is the one who picks up the phone when you need service.",
  },
];

const faqs: FaqItem[] = [
  {
    q: "Which areas do you serve?",
    a: "We are based in Porur, Chennai and take up installations across Chennai and the surrounding districts. Engineering lab equipment and college project work is supplied to institutions more widely - contact us with your location and we will confirm.",
  },
  {
    q: "Do you handle both supply and installation?",
    a: "Yes. For every solution we offer - gate automation, boom barriers, lighting automation, RO plants, softeners, CCTV and alarms - we handle site survey, supply, installation, commissioning and handover as a single scope of work.",
  },
  {
    q: "Can you automate an existing gate or existing home wiring?",
    a: "In most cases, yes. Existing swing and sliding gates can be retrofitted with the correct motor once we verify the leaf weight, track condition and hinge alignment. Home lighting can usually be automated using smart switch modules behind your existing switchboards, without rewiring the house.",
  },
  {
    q: "How do you price a project?",
    a: "We quote after understanding the site and the requirement, because the honest answer depends on gate weight, cable runs, camera coverage, water quality report or project scope. Share your requirement and we will send a written quotation - we do not publish fixed prices that would not apply to your site.",
  },
  {
    q: "What support do you provide for college final year projects?",
    a: "End-to-end: topic selection, feasibility, hardware and software development, testing, documentation and a working demonstration. The emphasis is on you understanding the system well enough to defend it, so we walk through the design and the code with you.",
  },
  {
    q: "Do you provide maintenance contracts?",
    a: "Yes. Annual maintenance contracts are available for gate automation, boom barriers, CCTV, alarm systems, RO plants and water softeners, covering scheduled preventive visits and priority breakdown support.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* ---------------- Solutions ---------------- */}
      <section id="solutions" className="section bg-slate-1">
        <div className="container-page">
          <SectionHeading
            eyebrow="Our Solutions"
            title="Engineering across automation, water and security"
            lead="Nine core capabilities, delivered as complete systems - specified, installed, tested and supported by one team."
            align="center"
          />

          <RevealGroup
            each={0.05}
            className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {solutions.map((solution) => (
              <RevealItem key={solution.slug}>
                <SolutionCard solution={solution} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ---------------- Why Autonex ---------------- */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div aria-hidden="true" className="tech-grid absolute inset-0" />
        <div
          aria-hidden="true"
          className="tech-bloom absolute inset-0"
          style={{ ["--bloom-x" as string]: "15%", ["--bloom-y" as string]: "30%" }}
        />

        <div className="container-page relative section">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Why Autonex"
                title="Built like infrastructure, not like a product demo"
                lead="Systems that run every day for years need to be designed that way from the first drawing. That is the standard we hold ourselves to on every site."
                invert
              />
              <Reveal delay={0.2}>
                <Link href="/about" className="btn btn-outline-invert mt-9">
                  About Autonex Solutions
                  <ArrowRight className="btn-arrow size-4" strokeWidth={2.2} />
                </Link>
              </Reveal>
            </div>

            <RevealGroup each={0.08} className="grid gap-4 lg:col-span-7">
              {differentiators.map((item) => (
                <RevealItem
                  key={item.title}
                  className="card card-dark card-hover group flex gap-5 p-6"
                  data-cursor="card"
                >
                  <ServiceIcon icon={item.icon} tone="invert" gesture="rotate" />
                  <div>
                    <h3 className="text-base font-bold !text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">{item.body}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* ---------------- Statistics ---------------- */}
      <section className="section bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="At a glance"
            title="A track record measured in working systems"
            align="center"
          />
          <div className="mt-12">
            <StatsBand stats={homeStats} />
          </div>
          <Reveal delay={0.1}>
            <p className="mt-6 text-center text-xs text-slate-5">
              Figures shown are placeholders and can be edited in{" "}
              <code className="numeric rounded bg-slate-2 px-1.5 py-0.5 text-[11px]">
                src/lib/site.ts
              </code>
              .
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Process ---------------- */}
      <section className="section bg-slate-1">
        <div className="container-page">
          <SectionHeading
            eyebrow="Our Process"
            title="How a project moves from enquiry to handover"
            lead="Six stages, each with a clear output. You always know what has been decided and what happens next."
            align="center"
          />
          <div className="mx-auto mt-16 max-w-4xl">
            <ProcessTimeline />
          </div>
        </div>
      </section>

      {/* ---------------- College projects teaser ---------------- */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="College Projects"
              title="Final-year projects you can actually defend"
              lead="AI, computer vision, IoT, embedded and robotics projects - built with you, documented properly, demonstrated live."
            />
            <Reveal delay={0.16}>
              <Link href="/college-projects" className="btn btn-outline shrink-0">
                All Categories
                <ArrowRight className="btn-arrow size-4" strokeWidth={2.2} />
              </Link>
            </Reveal>
          </div>

          <RevealGroup each={0.05} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projectCategories.slice(0, 6).map((category) => (
              <RevealItem key={category.title}>
                <ProjectCategoryCard category={category} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="section bg-slate-1">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <SectionHeading
                eyebrow="FAQ"
                title="Questions we are asked most"
                lead="If your question is not here, call us - a direct answer is faster than a form."
              />
            </div>
            <div className="lg:col-span-8">
              <Faq items={faqs} />
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Tell us what you need automated"
        lead="Send us the site details or call directly. We will come back with a clear technical recommendation and a written quotation."
      />
    </>
  );
}
