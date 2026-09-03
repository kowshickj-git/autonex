import type { Metadata } from "next";
import { SolutionHub } from "@/components/sections/SolutionHub";

export const metadata: Metadata = {
  title: "Security Solutions",
  description:
    "CCTV surveillance and intrusion alarm systems planned from a site survey - real coverage and zoned detection for homes, offices and industry.",
  alternates: { canonical: "/security-solutions" },
};

export default function SecuritySolutionsPage() {
  return (
    <SolutionHub
      eyebrow="Security Solutions"
      title="Security & Surveillance Solutions"
      lead="Cameras that see what matters and alarms that tell you exactly where - planned from a walk of your site, not from a package deal."
      group="security"
      approachTitle="How we approach a security project"
      approachLead="Coverage beats count. Four cameras in the right positions protect a property better than eight in convenient ones."
      approach={[
        {
          title: "Survey Before Quote",
          body: "We walk the property, identify approaches and blind spots, and mark positions before a single camera is priced.",
        },
        {
          title: "Detail Level Defined",
          body: "Detection, recognition or identification - each needs different resolution and framing. We agree which one each position requires.",
        },
        {
          title: "Zoning That Fits Use",
          body: "Alarm zones follow how the building is actually occupied, so part-arming is practical and the system gets used.",
        },
        {
          title: "Verified After Dark",
          body: "Night performance is checked on site during commissioning, not taken from the camera datasheet.",
        },
        {
          title: "Accounts, Not Passwords",
          body: "Named user accounts for remote viewing, so access can be withdrawn from one person without disrupting everyone.",
        },
        {
          title: "Retention Sized Properly",
          body: "Storage calculated for the retention period you need at the resolution you chose - not whichever drive was in stock.",
        },
      ]}
      applications={[
        "Homes & Villas",
        "Apartments",
        "Retail & Showrooms",
        "Offices",
        "Warehouses",
        "Factories",
        "Schools & Colleges",
        "Hospitals",
      ]}
      ctaTitle="Book a security site survey"
      ctaLead="We will walk the property, mark the coverage and show you what each camera and sensor will actually do."
      whatsappMessage="Hello Autonex Solutions, I am interested in your CCTV and security solutions."
    />
  );
}
