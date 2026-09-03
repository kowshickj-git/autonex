import type { Metadata } from "next";
import { SolutionHub } from "@/components/sections/SolutionHub";

export const metadata: Metadata = {
  title: "Automation Solutions",
  description:
    "Gate automation, home lighting automation and boom barrier systems for homes, apartments, industries and commercial properties in Chennai.",
  alternates: { canonical: "/automation" },
};

export default function AutomationPage() {
  return (
    <SolutionHub
      eyebrow="Automation"
      title="Automation Solutions"
      lead="Gates that open on approach, lighting that manages itself and vehicle access you control - built as engineered systems, not gadgets."
      group="automation"
      approachTitle="How we approach an automation project"
      approachLead="The mechanics decide everything. Get the sizing wrong and no amount of clever control logic will save the installation."
      approach={[
        {
          title: "Load Before Logic",
          body: "Gate leaf weight, arm length and duty cycle are measured first. The operator is selected from those numbers, not from a price list.",
        },
        {
          title: "Safety Is Not Optional",
          body: "Photocells, obstruction reversal and manual release are fitted on every installation and demonstrated at handover.",
        },
        {
          title: "Manual Always Works",
          body: "Every automated system keeps a manual path - a release key, a wall switch, a physical override. Automation adds control; it never removes it.",
        },
        {
          title: "Access That Can Be Revoked",
          body: "Rolling-code remotes, individually revocable RFID tags and named app users, so losing one credential does not mean re-keying everything.",
        },
        {
          title: "Clean Installation",
          body: "Conduited cabling, correctly rated supplies and terminations you would be happy to open in two years' time.",
        },
        {
          title: "Serviceable Design",
          body: "Standard components, documented wiring and spares we can actually source - so a fault is a service call, not a replacement.",
        },
      ]}
      applications={[
        "Residential Homes",
        "Apartments & Gated Communities",
        "Villas",
        "Factories",
        "Warehouses",
        "Commercial Offices",
        "Institutions",
        "Parking Facilities",
      ]}
      ctaTitle="Automate your gate, lighting or entrance"
      ctaLead="Send us the site details and we will recommend the right system with a written quotation."
      whatsappMessage="Hello Autonex Solutions, I am interested in your automation solutions."
    />
  );
}
