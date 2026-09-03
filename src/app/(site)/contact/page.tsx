import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/sections/ContactForm";
import { addressLines, addressOneLine, company, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Autonex Solutions in Porur, Chennai for automation, engineering lab equipment, water treatment, security systems and college project development.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const mapQuery = encodeURIComponent(`${addressOneLine}, ${company.address.state}, India`);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell Us What You Need"
        lead="Send us the details of your site or project and we will come back with a clear technical recommendation and a written quotation."
        crumbs={[{ label: "Contact" }]}
      />

      <section className="section bg-slate-1">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Details */}
            <div className="lg:col-span-5">
              <SectionHeading eyebrow="Get in touch" title="Reach us directly" />

              <RevealGroup each={0.07} className="mt-8 space-y-4">
                <RevealItem className="card p-5">
                  <div className="flex gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-copper-50 text-copper-600">
                      <Phone className="size-4.5" strokeWidth={1.9} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="eyebrow text-[10px] text-slate-5">Call us</p>
                      <div className="mt-1.5 flex flex-col gap-1">
                        {company.phones.map((phone, index) => (
                          <a
                            key={phone}
                            href={`tel:${company.phonesIntl[index]}`}
                            className="numeric text-[15px] font-medium text-navy-900 transition-colors hover:text-royal-700"
                          >
                            {phone}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </RevealItem>

                <RevealItem className="card p-5">
                  <div className="flex gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-royal-50 text-royal-700">
                      <Mail className="size-4.5" strokeWidth={1.9} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="eyebrow text-[10px] text-slate-5">Email</p>
                      <a
                        href={`mailto:${company.email}`}
                        className="mt-1.5 block break-all text-[15px] font-medium text-navy-900 transition-colors hover:text-royal-700"
                      >
                        {company.email}
                      </a>
                    </div>
                  </div>
                </RevealItem>

                <RevealItem className="card p-5">
                  <div className="flex gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-royal-50 text-royal-700">
                      <MapPin className="size-4.5" strokeWidth={1.9} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="eyebrow text-[10px] text-slate-5">Visit us</p>
                      <address className="mt-1.5 text-[15px] not-italic leading-relaxed text-navy-900">
                        {addressLines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </address>
                    </div>
                  </div>
                </RevealItem>

                <RevealItem className="card p-5">
                  <div className="flex gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-2 text-slate-6">
                      <Clock className="size-4.5" strokeWidth={1.9} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="eyebrow text-[10px] text-slate-5">Working hours</p>
                      <div className="mt-1.5 space-y-1 text-sm text-slate-7">
                        {company.hours.map((entry) => (
                          <p key={entry.days}>
                            {entry.days}:{" "}
                            <span className="numeric text-navy-900">{entry.time}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </RevealItem>
              </RevealGroup>

              <Reveal delay={0.2}>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={`tel:${company.phonesIntl[0]}`}
                    className="btn btn-royal flex-1 !py-3.5 text-sm"
                  >
                    <Phone className="size-4" strokeWidth={2} />
                    Call Now
                  </a>
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline flex-1 !py-3.5 text-sm"
                  >
                    WhatsApp Us
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Form */}
            <div className="lg:col-span-7">
              <Reveal direction="left">
                <ContactForm />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-white pb-16 sm:pb-20">
        <div className="container-page">
          <Reveal>
            <div className="overflow-hidden rounded-2xl ring-1 ring-slate-3">
              <iframe
                title={`Map showing the location of ${company.name}`}
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[380px] w-full border-0 sm:h-[440px]"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
