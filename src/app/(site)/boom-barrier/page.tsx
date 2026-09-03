import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureList } from "@/components/ui/FeatureList";
import { InfoGrid, TagGrid } from "@/components/ui/InfoGrid";
import { CtaBand } from "@/components/ui/CtaBand";
import { Faq, type FaqItem } from "@/components/ui/Faq";

export const metadata: Metadata = {
  title: "Automatic Boom Barrier Systems",
  description:
    "Automatic vehicle entry and exit control with RFID, access cards, loop detection and remote operation for parking, campuses and industrial gates.",
  alternates: { canonical: "/boom-barrier" },
};

const features = [
  "Automatic barrier arm with adjustable opening speed",
  "RFID long-range and proximity reader integration",
  "Access card and PIN keypad options",
  "Remote control operation for security staff",
  "Inductive loop detector for vehicle presence",
  "Anti-crash protection - the arm will not drop on a vehicle",
  "Manual release for power failure",
  "High duty cycle motors for busy entrances",
];

const capabilities = [
  {
    title: "Vehicle Detection",
    body: "An inductive loop cast into the road detects a vehicle under the arm and prevents it closing on one.",
  },
  {
    title: "Access Verification",
    body: "RFID tags, access cards or a keypad decide who gets through. Individual tags can be revoked instantly.",
  },
  {
    title: "Fast Cycle Time",
    body: "Barrier arms rated for high-frequency operation, so a busy office or apartment entrance does not queue.",
  },
  {
    title: "Integration",
    body: "Connects to visitor management, ANPR cameras and parking software where those systems are already in use.",
  },
  {
    title: "Safety Interlocks",
    body: "Loop detection and photocells prevent the arm from lowering while a vehicle or person is in the path.",
  },
  {
    title: "Weather Resistance",
    body: "Outdoor-rated housings and sealed electronics designed for continuous exposure to sun and monsoon.",
  },
];

const applications = [
  "Apartment Complexes",
  "Corporate Offices",
  "Industrial Gates",
  "Parking Facilities",
  "Hospitals",
  "Educational Campuses",
  "Hotels & Resorts",
  "Toll & Checkpoints",
];

const faqs: FaqItem[] = [
  {
    q: "How long does a boom barrier last with heavy daily use?",
    a: "That comes down to duty-cycle rating. A barrier specified for a low-traffic gate will fail early on a busy apartment entrance handling hundreds of cycles a day. We size the operator to your expected traffic, which is one of the first things we ask about.",
  },
  {
    q: "Can it drop on a car?",
    a: "Not when correctly installed. The inductive loop detector holds the arm up while any vehicle is over it, and photocells add a second layer. We test both at handover.",
  },
  {
    q: "Can it work with our existing RFID tags?",
    a: "Often yes, depending on the frequency and protocol your current tags use. Tell us what you have and we will confirm compatibility before quoting rather than after.",
  },
  {
    q: "What arm lengths are available?",
    a: "Standard arms cover typical driveway widths, with longer arms and articulated (folding) arms available where headroom is restricted. Arm length affects the motor rating, so it is specified together with the operator.",
  },
];

export default function BoomBarrierPage() {
  return (
    <>
      <PageHero
        eyebrow="Automation"
        title="Automatic Boom Barrier Systems"
        lead="Controlled vehicle entry and exit for campuses, parking facilities, industrial gates and commercial properties."
        crumbs={[{ label: "Automation", href: "/automation" }, { label: "Boom Barrier" }]}
      >
        <Link href="/contact" className="btn btn-primary">
          Get a Boom Barrier Quote
          <ArrowRight className="btn-arrow size-4" strokeWidth={2.2} />
        </Link>
      </PageHero>

      {/* Features */}
      <section className="section bg-slate-1">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Features"
                title="Specified around your traffic volume"
                lead="The single biggest cause of premature barrier failure is an operator rated for lighter duty than the gate actually sees."
              />
            </div>
            <div className="lg:col-span-7">
              <FeatureList items={features} columns={1} />
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="section bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Capabilities"
            title="What the system handles"
            align="center"
          />
          <div className="mt-12">
            <InfoGrid items={capabilities} />
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="section bg-slate-1">
        <div className="container-page">
          <SectionHeading eyebrow="Applications" title="Where boom barriers are installed" align="center" />
          <div className="mt-10 flex justify-center">
            <TagGrid items={applications} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <SectionHeading eyebrow="FAQ" title="Boom barrier questions" />
            </div>
            <div className="lg:col-span-8">
              <Faq items={faqs} />
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Control who drives in"
        lead="Tell us the entrance width and roughly how many vehicles pass each day - that is enough for us to specify and quote."
        whatsappMessage="Hello Autonex Solutions, I would like a quote for a boom barrier system."
      />
    </>
  );
}
