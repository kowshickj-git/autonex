import type { Metadata } from "next";
import { Award, Rocket, Target } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaBand } from "@/components/ui/CtaBand";
import { StatsBand } from "@/components/ui/StatsBand";
import { InfoGrid, TagGrid } from "@/components/ui/InfoGrid";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { company, coreValues, homeStats, industries } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Autonex Solutions provides integrated automation, engineering, water treatment, security and technology solutions from Porur, Chennai.",
  alternates: { canonical: "/about" },
};

const journey = [
  {
    year: "Foundation",
    title: "Started with engineering laboratory equipment",
    body: "Autonex Solutions began by supplying and commissioning laboratory equipment for engineering institutions - work that set the standard for how we document and hand over every system since.",
  },
  {
    year: "Expansion",
    title: "Automation and access control",
    body: "Gate automation, boom barriers and lighting automation followed, taking us from the laboratory bench onto residential, industrial and commercial sites.",
  },
  {
    year: "Integration",
    title: "Water treatment and security",
    body: "RO plants, softeners, CCTV and alarm systems joined the portfolio, so a single client could have their water, access and surveillance handled by one accountable team.",
  },
  {
    year: "Today",
    title: "Technology and student projects",
    body: "AI, computer vision, IoT and robotics project development now runs alongside our installation work - the same engineering discipline, applied to what students need to learn.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Autonex Solutions"
        title="Engineering Solutions Built for the Future"
        lead="Integrated automation, engineering, water treatment, security and technology solutions - designed, installed and supported by one team in Chennai."
        crumbs={[{ label: "About" }]}
      />

      {/* Who we are */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <SectionHeading eyebrow="Who We Are" title="One team across five disciplines" />
              <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-slate-7">
                <Reveal delay={0.1}>
                  <p>
                    {company.name} is an engineering and technology company based in Porur,
                    Chennai. We design, supply, install and maintain automation, water treatment
                    and security systems for homes, businesses and institutions - and we develop
                    engineering projects for students who need to build something real.
                  </p>
                </Reveal>
                <Reveal delay={0.16}>
                  <p>
                    What ties those together is not a product catalogue. It is a way of working:
                    understand the site before quoting, size the components against the actual
                    load, document the design, install it cleanly and stay reachable afterwards.
                    That approach came from supplying laboratory equipment, where a system that
                    fails in front of a class is a system that failed the engineer who specified it.
                  </p>
                </Reveal>
                <Reveal delay={0.22}>
                  <p>
                    We keep the disciplines under one roof deliberately. When your gate controller,
                    your camera network and your RO plant are handled by three different vendors,
                    the gaps between them become your problem. Here, they are ours.
                  </p>
                </Reveal>
              </div>
            </div>

            <div className="lg:col-span-5">
              <Reveal direction="left" delay={0.12}>
                <div className="card overflow-hidden p-7">
                  <p className="eyebrow text-royal-700">Leadership</p>
                  <p className="mt-4 text-xl font-bold text-navy-900">{company.owner}</p>
                  <p className="mt-1 text-sm text-slate-6">{company.ownerRole}</p>

                  <div className="rule-fade my-6" />

                  <dl className="space-y-4 text-sm">
                    <div>
                      <dt className="eyebrow text-[10px] text-slate-5">Based in</dt>
                      <dd className="mt-1 text-slate-7">
                        {company.address.line2}, {company.address.city} -{" "}
                        <span className="numeric">{company.address.pincode}</span>
                      </dd>
                    </div>
                    <div>
                      <dt className="eyebrow text-[10px] text-slate-5">Direct line</dt>
                      <dd className="mt-1">
                        <a
                          href={`tel:${company.phonesIntl[0]}`}
                          className="numeric text-royal-700 transition-colors hover:text-royal-800"
                        >
                          {company.phones[0]}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="eyebrow text-[10px] text-slate-5">Email</dt>
                      <dd className="mt-1">
                        <a
                          href={`mailto:${company.email}`}
                          className="break-all text-royal-700 transition-colors hover:text-royal-800"
                        >
                          {company.email}
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div aria-hidden="true" className="tech-grid absolute inset-0" />
        <div
          aria-hidden="true"
          className="tech-bloom absolute inset-0"
          style={{ ["--bloom-x" as string]: "80%", ["--bloom-y" as string]: "30%" }}
        />
        <div className="container-page relative section">
          <RevealGroup each={0.1} className="grid gap-5 lg:grid-cols-2">
            <RevealItem className="card card-dark p-8">
              <span className="grid size-12 place-items-center rounded-2xl bg-white/8 text-royal-300">
                <Target className="size-6" strokeWidth={1.7} aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-xl font-bold !text-white">Our Mission</h2>
              <p className="mt-3 leading-relaxed text-white/65">
                To deliver automation, engineering and technology systems that work reliably for
                years - specified honestly, installed properly and supported by the people who
                built them.
              </p>
            </RevealItem>

            <RevealItem className="card card-dark p-8">
              <span className="grid size-12 place-items-center rounded-2xl bg-white/8 text-copper-400">
                <Rocket className="size-6" strokeWidth={1.7} aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-xl font-bold !text-white">Our Vision</h2>
              <p className="mt-3 leading-relaxed text-white/65">
                To be the engineering partner that homes, industries and institutions across Tamil
                Nadu turn to first - for automation that simplifies daily life and for technology
                that trains the next generation of engineers.
              </p>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

      {/* Core values */}
      <section className="section bg-slate-1">
        <div className="container-page">
          <SectionHeading
            eyebrow="Core Values"
            title="What we hold ourselves to"
            lead="Six commitments that decide how we quote, how we build and how we respond when something needs attention."
            align="center"
          />
          <div className="mt-12">
            <InfoGrid
              items={coreValues.map((value) => ({
                title: value.title,
                body: value.body,
                icon: Award,
              }))}
            />
          </div>
        </div>
      </section>

      {/* Why choose us / expertise */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Why Choose Autonex"
                title="Our expertise, in plain terms"
                lead="Five practice areas, each with its own engineering depth - and one point of contact across all of them."
              />
            </div>
            <div className="lg:col-span-7">
              <InfoGrid
                columns={2}
                items={[
                  {
                    title: "Automation Engineering",
                    body: "Gate systems, boom barriers and lighting control - motor sizing, safety interlocks and access integration.",
                  },
                  {
                    title: "Laboratory Equipment",
                    body: "Trainer kits and complete lab setups, supplied with manuals and commissioned on site.",
                  },
                  {
                    title: "Water Treatment",
                    body: "RO plants and softeners sized from your source-water report, not from a generic chart.",
                  },
                  {
                    title: "Security Systems",
                    body: "CCTV coverage planned from a site survey, and alarm zoning that matches how the building is actually used.",
                  },
                  {
                    title: "Embedded & IoT",
                    body: "Custom firmware, sensor interfacing and connected dashboards for both products and projects.",
                  },
                  {
                    title: "AI & Software",
                    body: "Computer vision, machine learning and full-stack applications built to be understood, not just delivered.",
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="section bg-slate-1">
        <div className="container-page">
          <SectionHeading
            eyebrow="Our Journey"
            title="How the company grew"
            lead="From laboratory benches to complete building systems - each step built on the discipline of the one before it."
            align="center"
          />

          <RevealGroup each={0.08} className="mx-auto mt-14 max-w-3xl space-y-4">
            {journey.map((entry) => (
              <RevealItem key={entry.year} className="card p-6 sm:p-7">
                <p className="eyebrow text-copper-600">{entry.year}</p>
                <h3 className="mt-3 text-lg font-bold text-navy-900">{entry.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-7">{entry.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Statistics */}
      <section className="section bg-white">
        <div className="container-page">
          <SectionHeading eyebrow="By the numbers" title="Our reach so far" align="center" />
          <div className="mt-12">
            <StatsBand stats={homeStats} />
          </div>
          <Reveal delay={0.1}>
            <p className="mt-6 text-center text-xs text-slate-5">
              Placeholder figures - edit them in{" "}
              <code className="numeric rounded bg-slate-2 px-1.5 py-0.5 text-[11px]">
                src/lib/site.ts
              </code>
              .
            </p>
          </Reveal>
        </div>
      </section>

      {/* Industries */}
      <section className="section bg-slate-1">
        <div className="container-page">
          <SectionHeading
            eyebrow="Industries We Serve"
            title="Where our systems are running"
            align="center"
          />
          <div className="mt-10 flex justify-center">
            <TagGrid items={[...industries]} />
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Our Process"
            title="Six stages, every project"
            align="center"
          />
          <div className="mx-auto mt-16 max-w-4xl">
            <ProcessTimeline />
          </div>
        </div>
      </section>

      <CtaBand
        title="Work with an engineering team, not a reseller"
        lead="Tell us what you are trying to achieve and we will tell you honestly what it takes."
      />
    </>
  );
}
