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
  title: "CCTV Surveillance Systems",
  description:
    "HD and IP CCTV camera systems with recording, remote viewing and night vision - planned from a site survey for real coverage, not camera count.",
  alternates: { canonical: "/cctv" },
};

const features = [
  "Site survey to plan coverage before any camera is quoted",
  "IP and HD analogue camera options to suit the budget",
  "Indoor domes, outdoor bullets and PTZ cameras",
  "Night vision with infrared illumination",
  "NVR or DVR recording with configurable retention",
  "Remote viewing from phone and desktop",
  "Motion-triggered recording and alerts",
  "Structured cabling, conduiting and clean termination",
];

const cameraTypes = [
  {
    title: "Dome Cameras",
    body: "Discreet indoor coverage for receptions, corridors and shop floors, with a vandal-resistant housing option.",
  },
  {
    title: "Bullet Cameras",
    body: "Directional outdoor cameras for perimeters, gates and car parks, weather-rated for continuous exposure.",
  },
  {
    title: "PTZ Cameras",
    body: "Pan, tilt and zoom units for large open areas where one camera must cover several approaches.",
  },
  {
    title: "IP Camera Systems",
    body: "Higher resolution over network cable, with power over Ethernet so each camera needs one cable, not two.",
  },
  {
    title: "Night Vision",
    body: "Infrared illumination sized to the actual distance being watched - a common place where systems disappoint.",
  },
  {
    title: "Remote Monitoring",
    body: "Secure app access to live and recorded footage, with user accounts rather than one shared password.",
  },
];

const applications = [
  "Homes & Villas",
  "Apartments",
  "Retail & Showrooms",
  "Offices",
  "Warehouses",
  "Factories",
  "Schools & Colleges",
  "Hospitals",
];

const faqs: FaqItem[] = [
  {
    q: "How many cameras do I need?",
    a: "The honest answer is that camera count is the wrong question. What matters is coverage: which approaches, doors and blind spots need watching, and at what detail level - detection, recognition or identification. We survey the site, mark the positions and show you what each camera will actually see. Four well-placed cameras routinely outperform eight badly placed ones.",
  },
  {
    q: "How long is footage retained?",
    a: "That depends on hard-disk capacity, camera count, resolution and whether recording is continuous or motion-triggered. Fifteen to thirty days is typical for a domestic or small commercial system. Tell us the retention you need and we will size the storage for it.",
  },
  {
    q: "Can I view the cameras from my phone?",
    a: "Yes. Remote viewing is configured at handover on the devices you nominate. We set up individual user accounts rather than sharing one login, so access can be withdrawn from one person without changing everyone's password.",
  },
  {
    q: "What about night-time footage?",
    a: "Infrared range varies enormously between cameras, and an IR range that is too short is the most common cause of unusable night footage. We specify the illumination to the distance being covered, and we check it after dark during commissioning rather than assuming the datasheet.",
  },
];

export default function CctvPage() {
  return (
    <>
      <PageHero
        eyebrow="Security Solutions"
        title="CCTV Surveillance Systems"
        lead="HD and IP camera systems with recording, remote viewing and analytics - designed around actual coverage, not camera count."
        crumbs={[
          { label: "Security Solutions", href: "/security-solutions" },
          { label: "CCTV" },
        ]}
      >
        <Link href="/contact" className="btn btn-primary">
          Book a Site Survey
          <ArrowRight className="btn-arrow size-4" strokeWidth={2.2} />
        </Link>
      </PageHero>

      {/* Coverage planning */}
      <section className="section bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Coverage Planning"
            title="A camera is only as good as what it can see"
            lead="Field of view, mounting height, lens focal length and lighting decide whether footage is useful evidence or an unidentifiable shape. We plan all four before quoting."
            align="center"
          />
          <div className="mx-auto mt-10 max-w-2xl">
            <FeatureList items={features.slice(0, 4)} columns={1} />
          </div>
        </div>
      </section>

      {/* Camera types */}
      <section className="section bg-slate-1">
        <div className="container-page">
          <SectionHeading
            eyebrow="Camera Types"
            title="The right camera for each position"
            align="center"
          />
          <div className="mt-12">
            <InfoGrid items={cameraTypes} />
          </div>
        </div>
      </section>

      {/* Full features */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div aria-hidden="true" className="tech-grid absolute inset-0" />
        <div className="container-page relative section">
          <SectionHeading
            eyebrow="What Is Included"
            title="Survey, supply, install, commission"
            align="center"
            invert
          />
          <div className="mx-auto mt-12 max-w-4xl">
            <FeatureList items={features} columns={2} invert />
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="section bg-white">
        <div className="container-page">
          <SectionHeading eyebrow="Applications" title="Where we install CCTV" align="center" />
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
              <SectionHeading eyebrow="FAQ" title="CCTV questions" />
            </div>
            <div className="lg:col-span-8">
              <Faq items={faqs} />
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Book a CCTV site survey"
        lead="We will walk the property, mark the camera positions and show you the coverage before you spend anything."
        primaryLabel="Book a Site Survey"
        whatsappMessage="Hello Autonex Solutions, I would like a CCTV site survey and quote."
      />
    </>
  );
}
