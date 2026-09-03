import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaBand } from "@/components/ui/CtaBand";
import { Faq, type FaqItem } from "@/components/ui/Faq";
import { FeatureList } from "@/components/ui/FeatureList";
import { ProjectCategoryCard } from "@/components/ui/ProjectCategoryCard";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { projectCategories } from "@/lib/services";

export const metadata: Metadata = {
  title: "College Final Year Projects",
  description:
    "End-to-end final year project development and consultation - AI/ML, computer vision, IoT, embedded, robotics and software projects with full documentation.",
  alternates: { canonical: "/college-projects" },
};

const stages = [
  {
    number: "01",
    title: "Topic Selection",
    body: "We help you choose something achievable in your timeframe that still satisfies your department. Ambition that misses the deadline helps nobody.",
  },
  {
    number: "02",
    title: "Feasibility Review",
    body: "Before any work starts we check the components are available, the dataset exists and the scope fits the weeks you actually have.",
  },
  {
    number: "03",
    title: "Design & Architecture",
    body: "Block diagram, data flow and component selection are documented first, so the report writes itself later instead of being reverse-engineered.",
  },
  {
    number: "04",
    title: "Development",
    body: "Hardware assembly and software written in stages you can follow, with sessions to walk through what was built and why.",
  },
  {
    number: "05",
    title: "Testing & Results",
    body: "Measured results across the operating range - the numbers your report needs, obtained honestly.",
  },
  {
    number: "06",
    title: "Documentation & Viva",
    body: "Report, presentation and a demonstration rehearsal, so nothing about the live demo is a surprise on the day.",
  },
];

const included = [
  "Project title selection and feasibility guidance",
  "Complete hardware assembly where the project needs it",
  "Full source code, commented so it can be explained line by line",
  "Circuit diagrams, block diagrams and data-flow documentation",
  "Testing results measured across the operating range",
  "Project report formatted to your department requirements",
  "Presentation slides and a demonstration rehearsal",
  "Explanation sessions until you can defend every design decision",
];

const faqs: FaqItem[] = [
  {
    q: "Will you just build it and hand it over?",
    a: "No, and we would not want to. A project you cannot explain falls apart in the first two minutes of a viva. We build it with you and walk through the design decisions and the code until you can defend them yourself. That is the part that determines your marks.",
  },
  {
    q: "Can I bring my own project idea?",
    a: "Yes, and we prefer it. Bring the idea and we will give you an honest feasibility assessment - what is achievable in your timeframe, what components you will actually be able to source, and where the difficulty is hiding. Sometimes that means scaling the idea down, and we will say so.",
  },
  {
    q: "How long does a project take?",
    a: "It depends on the scope, but most final-year projects run over 6-12 weeks of real work. Start early. The projects that go badly are almost always the ones that started three weeks before submission.",
  },
  {
    q: "Do you support the documentation as well?",
    a: "Yes. Report, block diagrams, flowcharts, result tables and presentation slides are all part of the scope. Because we document the design before development rather than after, the report reflects what was actually built.",
  },
  {
    q: "What about the demonstration on the day?",
    a: "We rehearse it with you, including the failure modes - what to do if the Wi-Fi drops, the servo stalls or the camera will not focus. Knowing the recovery step is what keeps a live demo calm.",
  },
];

export default function CollegeProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="College Projects"
        title="Final-Year Projects You Can Actually Defend"
        lead="AI, computer vision, IoT, embedded, robotics and software projects - built with you, documented properly and demonstrated live."
        crumbs={[{ label: "College Projects" }]}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/contact" className="btn btn-primary">
            Discuss Your Project
            <ArrowRight className="btn-arrow size-4" strokeWidth={2.2} />
          </Link>
          <Link href="#categories" className="btn btn-outline-invert">
            Browse categories
          </Link>
        </div>
      </PageHero>

      {/* Categories */}
      <section id="categories" className="section bg-slate-1">
        <div className="container-page">
          <SectionHeading
            eyebrow="Categories"
            title="Eleven project domains"
            lead="Pick a direction, or bring your own idea and we will place it. Categories with a dedicated page go deeper into the pipeline and example projects."
            align="center"
          />

          <RevealGroup each={0.05} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projectCategories.map((category) => (
              <RevealItem key={category.title}>
                <ProjectCategoryCard category={category} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Process */}
      <section className="section bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="How We Work"
            title="Six stages from topic to viva"
            lead="Each stage produces something concrete, so you always know where the project stands rather than hoping it comes together at the end."
            align="center"
          />

          <RevealGroup each={0.06} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stages.map((stage) => (
              <RevealItem key={stage.number} className="card card-hover p-6" data-cursor="card">
                <span className="numeric text-xs font-medium text-copper-600">{stage.number}</span>
                <h3 className="mt-2 text-base font-bold text-navy-900">{stage.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-7">{stage.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* What is included */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div aria-hidden="true" className="tech-grid absolute inset-0" />
        <div
          aria-hidden="true"
          className="tech-bloom absolute inset-0"
          style={{ ["--bloom-x" as string]: "75%", ["--bloom-y" as string]: "35%" }}
        />
        <div className="container-page relative section">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="What Is Included"
                title="The whole project, not just the working part"
                lead="Marks come from the report, the presentation and the questions afterwards as much as from the demonstration itself."
                invert
              />
            </div>
            <div className="lg:col-span-7">
              <FeatureList items={included} columns={1} invert />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <SectionHeading eyebrow="FAQ" title="Student questions" />
            </div>
            <div className="lg:col-span-8">
              <Faq items={faqs} />
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Start your final-year project properly"
        lead="Tell us your branch, your topic area and your submission deadline. We will tell you honestly what is achievable."
        primaryLabel="Discuss Your Project"
        whatsappMessage="Hello Autonex Solutions, I would like help with my college final year project."
      />
    </>
  );
}
