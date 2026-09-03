import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircuitBoard } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaBand } from "@/components/ui/CtaBand";
import { Faq, type FaqItem } from "@/components/ui/Faq";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { equipmentCategories, equipmentProducts } from "@/lib/equipment";

export const metadata: Metadata = {
  title: "Engineering Lab Equipment",
  description:
    "Practical engineering equipment designed for learning, experimentation and technical education - trainer kits and complete laboratory setups.",
  alternates: { canonical: "/engineering-lab-equipment" },
};

const faqs: FaqItem[] = [
  {
    q: "Do you supply complete laboratory setups?",
    a: "Yes. We handle the full scope: equipment selection against your syllabus, supply, installation, commissioning and a demonstration session for the faculty who will run the lab. For new departments we can also advise on bench layout and power distribution before the room is fitted out.",
  },
  {
    q: "Why do you not show prices?",
    a: "Because institutional pricing genuinely depends on configuration, quantity and whether installation and training are included. Publishing a figure that will not apply to your order would waste your time. Send us your requirement list and you will get a written quotation against it.",
  },
  {
    q: "Can equipment be customised to our syllabus?",
    a: "Yes, and this is a large part of what we do. Universities specify different experiment sets, and a trainer that covers the wrong ones is of limited use. Share the practical list from your syllabus and we will configure the kits against it.",
  },
  {
    q: "Do you provide lab manuals and support?",
    a: "Experiment manuals are supplied with the trainer kits, and we run a handover session with the lab staff. Ongoing support, spares and repairs are handled directly by us rather than routed through a distributor.",
  },
];

export default function EquipmentPage() {
  return (
    <>
      <PageHero
        eyebrow="Engineering"
        title="Engineering Lab Equipment"
        lead="Practical engineering equipment designed for learning, experimentation and technical education."
        crumbs={[{ label: "Engineering Lab Equipment" }]}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/contact" className="btn btn-primary">
            Request Lab Consultation
            <ArrowRight className="btn-arrow size-4" strokeWidth={2.2} />
          </Link>
          <Link href="#products" className="btn btn-outline-invert">
            View equipment
          </Link>
        </div>
      </PageHero>

      {/* Categories */}
      <section className="section bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Categories"
            title="Twelve laboratory disciplines"
            lead="From basic electrical measurement through to robotics and IoT - equipment supplied, installed and commissioned against your syllabus."
            align="center"
          />

          <RevealGroup each={0.04} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {equipmentCategories.map((category) => (
              <RevealItem
                key={category.slug}
                data-cursor="card"
                className="card card-hover group flex gap-4 p-5"
              >
                <ServiceIcon icon={CircuitBoard} gesture="rotate" size="sm" />
                <div>
                  <h3 className="text-[15px] font-bold leading-snug text-navy-900">
                    {category.name}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-7">{category.blurb}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="section bg-slate-1">
        <div className="container-page">
          <SectionHeading
            eyebrow="Equipment"
            title="Representative trainer kits"
            lead="A sample of what we supply. Configurations are adjusted to your experiment list - tell us the practicals and we will match the kit."
            align="center"
          />

          <RevealGroup each={0.06} className="mt-12 grid gap-5 lg:grid-cols-2">
            {equipmentProducts.map((product) => (
              <RevealItem
                key={product.name}
                data-cursor="card"
                className="card card-hover group flex h-full flex-col overflow-hidden"
              >
                {/*
                  A technical plate rather than a stock photograph: the real
                  product photographs belong in the admin-managed Gallery, and
                  we do not put placeholder imagery in front of customers.
                */}
                <div className="zoom-frame relative h-36 shrink-0 overflow-hidden bg-navy-950">
                  <div aria-hidden="true" className="tech-grid zoom-target absolute inset-0" />
                  <div
                    aria-hidden="true"
                    className="tech-bloom absolute inset-0"
                    style={{ ["--bloom-y" as string]: "60%" }}
                  />
                  <div className="relative flex h-full items-center px-6">
                    <div>
                      <p className="eyebrow text-[9px] text-royal-300">{product.category}</p>
                      <p className="mt-2 font-display text-lg font-bold text-white">
                        {product.name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <p className="text-sm leading-relaxed text-slate-7">{product.description}</p>

                  <div className="mt-5">
                    <p className="eyebrow text-[10px] text-slate-5">Applications</p>
                    <ul className="mt-2.5 flex flex-wrap gap-1.5">
                      {product.applications.map((application) => (
                        <li
                          key={application}
                          className="rounded-full bg-slate-2 px-2.5 py-1 text-[11px] text-slate-7 transition-colors duration-300 group-hover:bg-royal-50 group-hover:text-royal-700"
                        >
                          {application}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 flex-1">
                    <p className="eyebrow text-[10px] text-slate-5">Specifications</p>
                    <dl className="mt-2.5 space-y-1.5">
                      {product.specifications.map((spec) => (
                        <div
                          key={spec.label}
                          className="flex justify-between gap-4 border-b border-slate-2 pb-1.5 text-xs last:border-0"
                        >
                          <dt className="text-slate-6">{spec.label}</dt>
                          <dd className="numeric text-right text-navy-800">{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <Link href="/contact" className="btn btn-outline mt-6 w-full !py-3 text-sm">
                    Request Quote
                    <ArrowRight className="btn-arrow size-4" strokeWidth={2.2} />
                  </Link>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.1}>
            <p className="mt-8 text-center text-xs text-slate-5">
              Prices are quoted against your requirement rather than published, because
              institutional pricing depends on configuration, quantity and installation scope.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Custom lab CTA */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div aria-hidden="true" className="tech-grid absolute inset-0" />
        <div
          aria-hidden="true"
          className="tech-bloom absolute inset-0"
          style={{ ["--bloom-x" as string]: "30%", ["--bloom-y" as string]: "40%" }}
        />
        <div className="container-page relative section">
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading
              eyebrow="Custom Setups"
              title="Need a Customized Lab Setup?"
              lead="Send us your syllabus and the practicals you need to run. We will propose an equipment list, a bench layout and a commissioning plan for the whole laboratory."
              align="center"
              invert
            />
            <Reveal delay={0.2}>
              <Link href="/contact" className="btn btn-primary mt-9">
                Request Lab Consultation
                <ArrowRight className="btn-arrow size-4" strokeWidth={2.2} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <SectionHeading eyebrow="FAQ" title="Lab equipment questions" />
            </div>
            <div className="lg:col-span-8">
              <Faq items={faqs} />
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Equip your laboratory properly"
        lead="Share your requirement list or your syllabus and we will send a written quotation with configurations against each practical."
        primaryLabel="Request Lab Consultation"
        whatsappMessage="Hello Autonex Solutions, I would like a quote for engineering lab equipment."
      />
    </>
  );
}
