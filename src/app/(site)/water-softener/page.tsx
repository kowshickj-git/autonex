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
  title: "Water Softener Systems",
  description:
    "Ion-exchange water softeners that remove calcium and magnesium hardness, protecting plumbing, geysers, washing machines and bathroom fittings.",
  alternates: { canonical: "/water-softener" },
};

const symptoms = [
  "White scale on taps, tiles and shower heads",
  "Soap and shampoo that will not lather properly",
  "Geyser and washing machine heating elements failing early",
  "Stiff, dull laundry after washing",
  "Reduced flow from pipes narrowed by scale deposits",
  "Dry skin and hair after bathing",
];

const capabilities = [
  {
    title: "Ion Exchange Resin",
    body: "Food-grade cation resin exchanges calcium and magnesium for sodium, removing hardness rather than merely suspending it.",
  },
  {
    title: "Automatic Regeneration",
    body: "A metered or timed valve flushes the resin with brine on schedule, restoring capacity without anyone intervening.",
  },
  {
    title: "Correct Sizing",
    body: "Resin volume is calculated from your hardness level and daily consumption, so regeneration frequency stays practical.",
  },
  {
    title: "Appliance Protection",
    body: "Geysers, washing machines, dishwashers and bathroom fittings last significantly longer on softened water.",
  },
  {
    title: "Whole-House or Point-of-Use",
    body: "Install at the inlet to soften everything, or at specific lines where hardness causes the most damage.",
  },
  {
    title: "RO Pre-Treatment",
    body: "Where hardness is high, a softener ahead of an RO plant protects the membrane and extends its working life.",
  },
];

const applications = [
  "Homes & Villas",
  "Apartments",
  "Hotels",
  "Hostels",
  "Hospitals",
  "Laundries",
  "Salons & Spas",
  "Industrial Boilers",
];

const faqs: FaqItem[] = [
  {
    q: "Is softened water the same as purified water?",
    a: "No, and this is the most common misunderstanding. A softener removes hardness minerals so water stops scaling your plumbing and appliances. It does not make water safe to drink - dissolved salts, bacteria and other contaminants pass straight through. For drinking water you need an RO or UV system, often fed from the softened line.",
  },
  {
    q: "How often does it regenerate?",
    a: "Depends on hardness and consumption - typically every 2-5 days for a household. A metered valve regenerates based on actual litres used rather than a fixed clock, which wastes less salt and water.",
  },
  {
    q: "How much salt does it use?",
    a: "A typical domestic softener uses a few kilograms of salt per regeneration. We calculate the expected monthly consumption during sizing so you know the running cost before you commit.",
  },
  {
    q: "Can I install a softener with my existing RO purifier?",
    a: "Yes, and where hardness is high it is the right thing to do. The softener sits upstream and protects the RO membrane from scaling, which noticeably extends membrane life and keeps the purifier's output steady.",
  },
];

export default function WaterSoftenerPage() {
  return (
    <>
      <PageHero
        eyebrow="Water Solutions"
        title="Water Softener Systems"
        lead="Ion-exchange softening that removes calcium and magnesium hardness, protecting your plumbing, geysers and appliances."
        crumbs={[
          { label: "Water Solutions", href: "/water-solutions" },
          { label: "Water Softener" },
        ]}
      >
        <Link href="/contact" className="btn btn-primary">
          Get a Softener Quote
          <ArrowRight className="btn-arrow size-4" strokeWidth={2.2} />
        </Link>
      </PageHero>

      {/* How softening works */}
      <section className="section bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="How Softening Works"
            title="Hardness ions swapped for sodium"
            lead="Hard water passes through a bed of resin beads. Calcium and magnesium bind to the resin, sodium is released in their place, and what leaves the tank no longer forms scale."
            align="center"
          />
        </div>
      </section>

      {/* Symptoms */}
      <section className="section bg-slate-1">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Do You Need One"
                title="Signs your water is hard"
                lead="If several of these sound familiar, a hardness test is worth doing before you replace another geyser element."
              />
            </div>
            <div className="lg:col-span-7">
              <FeatureList items={symptoms} columns={1} />
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="section bg-white">
        <div className="container-page">
          <SectionHeading eyebrow="System Features" title="What the softener does" align="center" />
          <div className="mt-12">
            <InfoGrid items={capabilities} />
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="section bg-slate-1">
        <div className="container-page">
          <SectionHeading eyebrow="Applications" title="Where softeners are installed" align="center" />
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
              <SectionHeading eyebrow="FAQ" title="Water softener questions" />
            </div>
            <div className="lg:col-span-8">
              <Faq items={faqs} />
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Stop scale damaging your plumbing"
        lead="Tell us your water source and household size. We will confirm the hardness level and size a softener around it."
        primaryLabel="Get a Softener Quote"
        whatsappMessage="Hello Autonex Solutions, I would like a quote for a water softener."
      />
    </>
  );
}
