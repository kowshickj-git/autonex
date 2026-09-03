import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureList } from "@/components/ui/FeatureList";
import { InfoGrid, TagGrid } from "@/components/ui/InfoGrid";
import { CtaBand } from "@/components/ui/CtaBand";
import { Faq, type FaqItem } from "@/components/ui/Faq";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Gate Automation Solutions",
  description:
    "Smart, secure and convenient automatic swing and sliding gate systems for homes, apartments, industries and commercial properties in Chennai.",
  alternates: { canonical: "/gate-automation" },
};

const swingFeatures = [
  "Automatic opening and closing on remote command",
  "Remote control handsets, with additional units available",
  "Safety photocell sensors across the opening",
  "Manual override release for power failures",
  "Obstacle detection that reverses the leaf on contact",
  "Access control integration - RFID, keypad or intercom",
];

const slidingFeatures = [
  "Heavy-duty motor matched to the gate leaf weight",
  "Remote operation with adjustable opening speed",
  "Safety photocell sensors and warning lamp",
  "Limit switches for precise open and close positions",
  "Manual release key for emergency operation",
  "Access control integration for shared entrances",
];

const capabilities = [
  { title: "Remote Control", body: "Rolling-code handsets that cannot be captured and replayed by a scanner." },
  { title: "RFID & Access Cards", body: "Tag-based entry for residents or staff, with cards revoked individually." },
  { title: "Mobile Control", body: "Open, close and check gate status from a phone, on site or away." },
  { title: "Safety Sensors", body: "Photocell beams across the opening stop and reverse the gate if anything is in the path." },
  { title: "Vehicle Detection", body: "Loop or radar detection for automatic opening on approach from inside." },
  { title: "Battery Backup", body: "The gate keeps operating through a power cut, and releases manually if the battery is flat." },
];

const applications = [
  "Residential Homes",
  "Apartments",
  "Villas",
  "Factories",
  "Warehouses",
  "Offices",
  "Institutions",
  "Parking Areas",
];

const faqs: FaqItem[] = [
  {
    q: "Can my existing gate be automated?",
    a: "Usually yes. We check the leaf weight, the hinge or track condition and whether the gate runs freely by hand. A gate that binds or sags has to be corrected first - automating a mechanically poor gate simply transfers the strain to the motor and shortens its life.",
  },
  {
    q: "What happens during a power cut?",
    a: "Every installation includes a manual release so the gate can be operated by hand. Where uninterrupted operation matters, we fit a battery backup that keeps the system running for a number of cycles depending on gate size and battery capacity.",
  },
  {
    q: "Is it safe around children and vehicles?",
    a: "Safety photocells are fitted across the opening as standard, and the controller is set to reverse on obstruction. For sliding gates we also fit a warning lamp. We test these at handover and we recommend testing them yourself periodically.",
  },
  {
    q: "Swing or sliding - which should I choose?",
    a: "It depends on the space. Swing gates need clear arc room on the inside; sliding gates need clear run-off space alongside the wall. If the driveway slopes toward the gate, sliding is usually the better answer. We advise on this during the site visit.",
  },
];

export default function GateAutomationPage() {
  return (
    <>
      <PageHero
        eyebrow="Automation"
        title="Gate Automation Solutions"
        lead="Smart, secure and convenient automatic gate systems for homes, apartments, industries and commercial properties."
        crumbs={[{ label: "Automation", href: "/automation" }, { label: "Gate Automation" }]}
      >
        <Link href="/contact" className="btn btn-primary">
          Get Gate Automation Quote
          <ArrowRight className="btn-arrow size-4" strokeWidth={2.2} />
        </Link>
      </PageHero>

      {/* Gate types */}
      <section className="section bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Gate Types"
            title="Two mechanisms, one control philosophy"
            lead="Swing and sliding systems differ in how they move, but both are specified around leaf weight, duty cycle and the safety devices protecting the opening."
            align="center"
          />

          <div className="mx-auto mt-14 max-w-3xl space-y-14">
            {/* Swing */}
            <div>
              <Reveal>
                <h3 className="text-2xl font-extrabold text-navy-900">Swing Gate Automation</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-7">
                  Articulated or ram-type operators mounted at each pillar, opening the leaves
                  inward or outward. Best where there is clear arc space and a level approach.
                </p>
              </Reveal>
              <div className="mt-7">
                <FeatureList items={swingFeatures} columns={2} />
              </div>
            </div>

            {/* Sliding */}
            <div>
              <Reveal>
                <h3 className="text-2xl font-extrabold text-navy-900">Sliding Gate Automation</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-7">
                  Rack-and-pinion drive running the gate along a track beside the wall. The right
                  choice for heavy gates, sloping driveways and wide industrial openings.
                </p>
              </Reveal>
              <div className="mt-7">
                <FeatureList items={slidingFeatures} columns={2} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section bg-slate-1">
        <div className="container-page">
          <SectionHeading
            eyebrow="Features"
            title="What can be built into the system"
            lead="Specify only what the site needs - every option below can be added at installation or retrofitted later."
            align="center"
          />
          <div className="mt-12">
            <InfoGrid items={capabilities} />
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="section bg-white">
        <div className="container-page">
          <SectionHeading eyebrow="Applications" title="Where we install gate automation" align="center" />
          <div className="mt-10 flex justify-center">
            <TagGrid items={applications} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-slate-1">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <SectionHeading eyebrow="FAQ" title="Gate automation questions" />
            </div>
            <div className="lg:col-span-8">
              <Faq items={faqs} />
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Get a gate automation quote"
        lead="Send us the gate dimensions and a photograph, or book a site visit - we will recommend the right operator and quote it in writing."
        primaryLabel="Get Gate Automation Quote"
        whatsappMessage="Hello Autonex Solutions, I would like a quote for gate automation."
      />
    </>
  );
}
