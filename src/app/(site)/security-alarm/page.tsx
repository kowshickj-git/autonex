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
  title: "Security Alarm Systems",
  description:
    "Intrusion detection with zoned sensors, control panel, siren and instant mobile alerts for homes, offices and industrial premises.",
  alternates: { canonical: "/security-alarm" },
};

const sensors = [
  "Magnetic door and window contacts",
  "PIR motion detectors for internal spaces",
  "Glass-break detectors for large windows",
  "Vibration sensors for shutters and safes",
  "Panic buttons at reception and bedside",
  "Smoke and gas detectors integrated into the same panel",
];

const capabilities = [
  {
    title: "Zoned Detection",
    body: "The premises are divided into zones so the panel reports exactly where a trigger came from, not just that something happened.",
  },
  {
    title: "Part-Arming",
    body: "Arm the perimeter at night while the bedrooms stay unmonitored, so the system gets used instead of switched off.",
  },
  {
    title: "Mobile Alerts",
    body: "Instant notification to nominated numbers the moment a zone triggers, with the zone name in the message.",
  },
  {
    title: "Siren & Strobe",
    body: "Loud local sounder with an optional external strobe, on a timed cut-off so it does not run indefinitely.",
  },
  {
    title: "Battery Backup",
    body: "The panel keeps running through a power cut - an alarm that dies with the mains is not an alarm.",
  },
  {
    title: "Tamper Protection",
    body: "Sensors and panel report if their housings are opened or their cabling is cut, whether armed or not.",
  },
];

const applications = [
  "Homes & Villas",
  "Apartments",
  "Retail Shops",
  "Jewellery Stores",
  "Offices",
  "Warehouses",
  "Factories",
  "Institutions",
];

const faqs: FaqItem[] = [
  {
    q: "What happens when the alarm triggers?",
    a: "The local siren sounds and a notification goes immediately to the phone numbers you nominate, naming the zone that triggered. Where you want it, the panel can also dial through to a monitoring service or a security office.",
  },
  {
    q: "Will pets set it off?",
    a: "Not with the right detectors. Pet-immune PIR sensors ignore movement below a weight threshold, and detector placement matters as much as the model chosen. Tell us about pets during the survey and we will select and position accordingly.",
  },
  {
    q: "Can it work alongside my CCTV?",
    a: "Yes, and the combination is genuinely better than either alone. The alarm detects and alerts; the cameras let you verify what actually happened before calling anyone. We can configure the recorder to bookmark footage at the moment a zone triggers.",
  },
  {
    q: "Wired or wireless sensors?",
    a: "Wired is more reliable and needs no battery changes, and is the default where cabling is practical - typically during construction or renovation. Wireless suits finished buildings where running cable would mean cutting walls. Mixed systems are common and perfectly sound.",
  },
];

export default function SecurityAlarmPage() {
  return (
    <>
      <PageHero
        eyebrow="Security Solutions"
        title="Security Alarm Systems"
        lead="Intrusion detection with zoned sensors, a control panel and instant alerting - so you know immediately, and specifically, where."
        crumbs={[
          { label: "Security Solutions", href: "/security-solutions" },
          { label: "Security Alarm" },
        ]}
      >
        <Link href="/contact" className="btn btn-primary">
          Get an Alarm System Quote
          <ArrowRight className="btn-arrow size-4" strokeWidth={2.2} />
        </Link>
      </PageHero>

      {/* Signal path */}
      <section className="section bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Signal Path"
            title="From sensor to siren in under a second"
            lead="Every sensor reports to the panel over a supervised connection. If a sensor stops answering, the panel tells you rather than quietly ignoring it."
            align="center"
          />
        </div>
      </section>

      {/* Sensors */}
      <section className="section bg-slate-1">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Detection"
                title="Sensors matched to the opening"
                lead="A door needs a different detector from a large window or a roller shutter. Using one type everywhere is what produces false alarms."
              />
            </div>
            <div className="lg:col-span-7">
              <FeatureList items={sensors} columns={1} />
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="section bg-white">
        <div className="container-page">
          <SectionHeading eyebrow="System Features" title="How the panel behaves" align="center" />
          <div className="mt-12">
            <InfoGrid items={capabilities} />
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="section bg-slate-1">
        <div className="container-page">
          <SectionHeading eyebrow="Applications" title="Where alarm systems are installed" align="center" />
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
              <SectionHeading eyebrow="FAQ" title="Alarm system questions" />
            </div>
            <div className="lg:col-span-8">
              <Faq items={faqs} />
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Protect your premises properly"
        lead="Tell us the building layout and which openings concern you most - we will design the zoning around it."
        primaryLabel="Get an Alarm System Quote"
        whatsappMessage="Hello Autonex Solutions, I would like a quote for a security alarm system."
      />
    </>
  );
}
