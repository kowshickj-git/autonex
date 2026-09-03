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
  title: "Water Purifier & RO Plant",
  description:
    "Domestic water purifiers through to commercial and industrial reverse osmosis plants - sized from your source water report and supported with AMC.",
  alternates: { canonical: "/water-purifier-ro-plant" },
};

const stages = [
  "Sediment filtration removes suspended solids down to 5 microns",
  "Activated carbon removes chlorine, odour and organic compounds",
  "RO membrane rejects dissolved salts, heavy metals and hardness",
  "UV sterilisation inactivates bacteria and viruses at 254 nm",
  "Post-carbon polishing corrects taste before the outlet",
  "Mineral cartridge optionally restores essential minerals",
];

const systemTypes = [
  {
    title: "Domestic RO Purifier",
    body: "Under-sink or wall-mounted units for a household, typically 8-15 litres per hour with a storage tank.",
  },
  {
    title: "Commercial RO Plant",
    body: "100-1000 LPH systems for offices, restaurants, hostels and small institutions, with pre-treatment sized to the load.",
  },
  {
    title: "Industrial RO Plant",
    body: "Higher-capacity skid-mounted plants with multi-media filtration, dosing and automated flushing cycles.",
  },
  {
    title: "Borewell Water Treatment",
    body: "Systems designed around a hard, high-TDS borewell source - the most common situation across Chennai.",
  },
  {
    title: "Packaged Drinking Water",
    body: "Complete plant setups for bottling operations, including ozonation and filling-line integration.",
  },
  {
    title: "Annual Maintenance",
    body: "Scheduled cartridge changes, membrane cleaning and TDS verification, with service records maintained.",
  },
];

const applications = [
  "Homes & Apartments",
  "Offices",
  "Schools & Colleges",
  "Hostels",
  "Restaurants & Hotels",
  "Hospitals",
  "Factories",
  "Water Plants",
];

const faqs: FaqItem[] = [
  {
    q: "How do you decide which system I need?",
    a: "From your source water and your daily consumption. A borewell at 1800 TDS and a corporation supply at 300 TDS need different pre-treatment and different membranes. We ask for a water test report, or arrange one, before recommending anything - specifying a plant without knowing the input is guesswork.",
  },
  {
    q: "How often do filters and membranes need changing?",
    a: "Sediment and carbon cartridges typically every 6-12 months depending on input quality; RO membranes commonly 2-3 years. Heavy sediment or very hard input shortens both. Under an AMC we track this and schedule the change before performance drops rather than after.",
  },
  {
    q: "How much water does RO waste?",
    a: "Reverse osmosis always produces a reject stream - that is how it works. Well-configured domestic systems run around 1:1 to 1:2 product-to-reject; poorly set ones can waste far more. We set the recovery correctly and, where the site allows, route the reject to gardening or washing use.",
  },
  {
    q: "Do you handle installation and plumbing?",
    a: "Yes. Supply, plumbing connections, electrical points, commissioning and a TDS check at handover are all included. We also show you how to read the system and what a normal reading looks like, so you can spot a problem early.",
  },
];

export default function RoPlantPage() {
  return (
    <>
      <PageHero
        eyebrow="Water Solutions"
        title="Water Purifier & RO Plant"
        lead="From domestic purifiers to commercial and industrial reverse osmosis plants - sized to your source water and your daily demand."
        crumbs={[
          { label: "Water Solutions", href: "/water-solutions" },
          { label: "Water Purifier & RO Plant" },
        ]}
      >
        <Link href="/contact" className="btn btn-primary">
          Request a Water Consultation
          <ArrowRight className="btn-arrow size-4" strokeWidth={2.2} />
        </Link>
      </PageHero>

      {/* Purification stages */}
      <section className="section bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Treatment Process"
            title="Every stage removes something different"
            lead="Multi-stage treatment is not redundancy. Each stage protects the one after it - skip the sediment filter and the membrane pays for it."
            align="center"
          />

          <div className="mx-auto mt-12 max-w-3xl">
            <FeatureList items={stages} columns={1} />
          </div>
        </div>
      </section>

      {/* System types */}
      <section className="section bg-slate-1">
        <div className="container-page">
          <SectionHeading
            eyebrow="System Types"
            title="Sized for a kitchen or a plant floor"
            align="center"
          />
          <div className="mt-12">
            <InfoGrid items={systemTypes} />
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div aria-hidden="true" className="tech-grid absolute inset-0" />
        <div
          aria-hidden="true"
          className="tech-bloom absolute inset-0"
          style={{ ["--bloom-x" as string]: "75%" }}
        />
        <div className="container-page relative section">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Specification"
                title="Why we ask for a water test first"
                lead="The same purifier that works perfectly on one street can fail within months two kilometres away. Groundwater varies that much."
                invert
              />
            </div>
            <div className="lg:col-span-7">
              <FeatureList
                invert
                columns={1}
                items={[
                  "Total dissolved solids decide whether RO is required at all, and which membrane rejects enough",
                  "Hardness determines whether a softener must sit ahead of the RO to protect the membrane",
                  "Iron and manganese need dedicated pre-treatment or they foul every stage downstream",
                  "Turbidity sets the sediment filtration required before anything else can work",
                  "Daily consumption fixes the plant capacity and the storage volume",
                  "Input pressure decides whether a booster pump is part of the design",
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="section bg-white">
        <div className="container-page">
          <SectionHeading eyebrow="Applications" title="Where our systems are installed" align="center" />
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
              <SectionHeading eyebrow="FAQ" title="Water purification questions" />
            </div>
            <div className="lg:col-span-8">
              <Faq items={faqs} />
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Get your water tested and quoted"
        lead="Share your water source and daily requirement. If you already have a test report, send it - we will size the plant around it."
        primaryLabel="Request a Water Consultation"
        whatsappMessage="Hello Autonex Solutions, I would like a quote for a water purifier / RO plant."
      />
    </>
  );
}
