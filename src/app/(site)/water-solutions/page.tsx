import type { Metadata } from "next";
import { SolutionHub } from "@/components/sections/SolutionHub";

export const metadata: Metadata = {
  title: "Water Solutions",
  description:
    "Water purifiers, RO plants and ion-exchange water softeners for homes, businesses and institutions - sized from your source water report.",
  alternates: { canonical: "/water-solutions" },
};

export default function WaterSolutionsPage() {
  return (
    <SolutionHub
      eyebrow="Water Solutions"
      title="Water Treatment Solutions"
      lead="Purification and softening designed around your actual water - because groundwater in Chennai varies street by street."
      group="water"
      approachTitle="How we approach a water project"
      approachLead="Every recommendation starts with a test report. Specifying treatment without knowing the input is guesswork with someone else's money."
      approach={[
        {
          title: "Test First",
          body: "TDS, hardness, iron and turbidity are measured before anything is proposed. The numbers decide the system.",
        },
        {
          title: "Right-Sized Capacity",
          body: "Plant capacity and storage volume are calculated from daily consumption, so the system is not straining or idling.",
        },
        {
          title: "Protect Each Stage",
          body: "Pre-treatment exists to protect what follows it. A softener ahead of an RO plant costs less than replacing membranes early.",
        },
        {
          title: "Honest About Waste",
          body: "RO produces a reject stream. We set recovery correctly and, where the site allows, route the reject to useful purposes.",
        },
        {
          title: "Serviceable Layout",
          body: "Cartridges and membranes positioned so they can actually be changed without dismantling the plumbing around them.",
        },
        {
          title: "Maintenance That Happens",
          body: "AMC with scheduled changes and recorded TDS readings, so performance is verified rather than assumed.",
        },
      ]}
      applications={[
        "Homes & Apartments",
        "Offices",
        "Schools & Colleges",
        "Hostels",
        "Restaurants & Hotels",
        "Hospitals",
        "Factories",
        "Packaged Water Plants",
      ]}
      ctaTitle="Get your water tested and treated"
      ctaLead="Share your water source and daily requirement, or send an existing test report, and we will size the system around it."
      whatsappMessage="Hello Autonex Solutions, I am interested in your water treatment solutions."
    />
  );
}
