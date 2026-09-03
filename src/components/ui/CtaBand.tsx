import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticCta } from "./MagneticCta";
import { company, whatsappLink } from "@/lib/site";

type Props = {
  eyebrow?: string;
  title: string;
  lead?: string;
  /** Label for the primary action. Defaults to "Get a Quote". */
  primaryLabel?: string;
  primaryHref?: string;
  /** Pre-fills the WhatsApp message for this specific service. */
  whatsappMessage?: string;
};

export function CtaBand({
  eyebrow = "Get Started",
  title,
  lead,
  primaryLabel = "Get a Quote",
  primaryHref = "/contact",
  whatsappMessage,
}: Props) {
  return (
    <section className="relative overflow-hidden bg-navy-900 text-white">
      <div aria-hidden="true" className="tech-grid absolute inset-0" />
      <div
        aria-hidden="true"
        className="tech-bloom absolute inset-0"
        style={{ ["--bloom-x" as string]: "20%", ["--bloom-y" as string]: "80%" }}
      />

      <div className="container-page relative py-16 sm:py-20">
        <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Reveal duration={0.5}>
              <p className="eyebrow flex items-center gap-2.5 text-royal-300">
                <span aria-hidden="true" className="h-px w-6 bg-copper-500" />
                {eyebrow}
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight !text-white sm:text-4xl">
                {title}
              </h2>
            </Reveal>
            {lead && (
              <Reveal delay={0.12}>
                <p className="mt-4 text-white/65">{lead}</p>
              </Reveal>
            )}
          </div>

          <Reveal delay={0.18} direction="up" distance={24}>
            <div className="flex flex-wrap items-center gap-3">
              <MagneticCta>
                <Link href={primaryHref} className="btn btn-primary">
                  {primaryLabel}
                  <ArrowRight className="btn-arrow size-4" strokeWidth={2.2} />
                </Link>
              </MagneticCta>

              <a href={`tel:${company.phonesIntl[0]}`} className="btn btn-outline-invert">
                <Phone className="size-4" strokeWidth={2} />
                Call Now
              </a>

              <a
                href={whatsappLink(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-invert"
              >
                WhatsApp Us
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
