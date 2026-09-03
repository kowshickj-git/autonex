import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureList } from "@/components/ui/FeatureList";
import { InfoGrid } from "@/components/ui/InfoGrid";
import { CtaBand } from "@/components/ui/CtaBand";
import { Faq, type FaqItem } from "@/components/ui/Faq";

export const metadata: Metadata = {
  title: "Home Lighting Automation",
  description:
    "Transform your home into a smarter, more comfortable and energy-efficient environment with smart switches, scenes, scheduling and mobile control.",
  alternates: { canonical: "/home-lighting-automation" },
};

const features = [
  "Smart lights and dimmable circuits",
  "Mobile app control from anywhere",
  "Physical remote control options",
  "Motion sensors for corridors and utility areas",
  "Automatic scheduling by time or sunset",
  "Voice assistant integration",
  "Scene control for whole-room presets",
  "Energy monitoring per circuit",
  "Timer-based control for outdoor lighting",
];

const capabilities = [
  {
    title: "Smart Lighting",
    body: "Individual circuits become addressable, so any light can be switched, dimmed or grouped without rewiring the house.",
  },
  {
    title: "Motion-Based Lighting",
    body: "Corridors, staircases, bathrooms and car porches light up on approach and switch off after a set idle period.",
  },
  {
    title: "Scheduled Lighting",
    body: "Outdoor and facade lighting follows sunset and sunrise automatically, adjusting through the year without intervention.",
  },
  {
    title: "Remote Lighting Control",
    body: "Check what is on and switch it off from anywhere - useful when the house is empty for a few days.",
  },
  {
    title: "Smart Switches",
    body: "Modules fit behind your existing switchboards. The wall switches keep working exactly as before, so nothing is lost.",
  },
  {
    title: "Energy Saving",
    body: "Lights that turn themselves off, dim when full output is not needed, and report which circuits consume the most.",
  },
];

const faqs: FaqItem[] = [
  {
    q: "Do you need to rewire my house?",
    a: "In most homes, no. Smart switch modules are installed behind the existing switchboards and use the wiring already in place. Rewiring is only needed where a circuit has no neutral at the switch box, or where you want to split an existing circuit into separately controllable groups.",
  },
  {
    q: "Will the wall switches still work?",
    a: "Yes, and this matters more than people expect. Every installation keeps the physical switches functional, so guests, children and anyone without the app can still operate the lights normally. The automation adds control; it never takes the manual option away.",
  },
  {
    q: "What happens if the internet goes down?",
    a: "Wall switches keep working, and local automations such as motion sensing continue to run on the controller. Only remote access from outside the house and voice assistant commands need the internet.",
  },
  {
    q: "Can I start small and expand later?",
    a: "Yes. A common approach is to start with the living room, outdoor lighting and one corridor, then extend to bedrooms and utility areas once you have lived with it. The controller is sized at the start so expansion does not mean replacing it.",
  },
];

export default function HomeLightingPage() {
  return (
    <>
      <PageHero
        eyebrow="Automation"
        title="Home Lighting Automation"
        lead="Transform your home into a smarter, more comfortable and energy-efficient environment."
        crumbs={[
          { label: "Automation", href: "/automation" },
          { label: "Home Lighting Automation" },
        ]}
      >
        <Link href="/contact" className="btn btn-primary">
          Automate Your Home
          <ArrowRight className="btn-arrow size-4" strokeWidth={2.2} />
        </Link>
      </PageHero>

      {/* Control path */}
      <section className="section bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Control Path"
            title="From your phone to the light fitting"
            lead="Four links in the chain, each one replaceable and each one working on its own if the link above it is unavailable."
            align="center"
          />
          <div className="mx-auto mt-10 max-w-3xl">
            <FeatureList items={features.slice(0, 5)} columns={1} />
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="section bg-slate-1">
        <div className="container-page">
          <SectionHeading
            eyebrow="What You Can Automate"
            title="Six ways lighting automation earns its place"
            lead="Convenience is the obvious benefit. Lower bills and lights that never get left on are the ones people notice after a month."
            align="center"
          />
          <div className="mt-12">
            <InfoGrid items={capabilities} />
          </div>
        </div>
      </section>

      {/* Full feature list */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div aria-hidden="true" className="tech-grid absolute inset-0" />
        <div
          aria-hidden="true"
          className="tech-bloom absolute inset-0"
          style={{ ["--bloom-x" as string]: "25%" }}
        />
        <div className="container-page relative section">
          <SectionHeading
            eyebrow="Features"
            title="Everything available in a lighting automation package"
            align="center"
            invert
          />
          <div className="mx-auto mt-12 max-w-4xl">
            <FeatureList items={features} columns={2} invert />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <SectionHeading eyebrow="FAQ" title="Lighting automation questions" />
            </div>
            <div className="lg:col-span-8">
              <Faq items={faqs} />
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Automate your home"
        lead="Share your floor plan or a few photographs of your switchboards and we will propose a staged automation plan."
        primaryLabel="Automate Your Home"
        whatsappMessage="Hello Autonex Solutions, I am interested in home lighting automation."
      />
    </>
  );
}
