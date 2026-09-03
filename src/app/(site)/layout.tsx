import type { ReactNode } from "react";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { Footer } from "@/components/layout/Footer";
import { IntroScreen } from "@/components/layout/IntroScreen";
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/layout/PageTransition";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { company, addressOneLine, siteUrl } from "@/lib/site";
import { resolveBrandLogo } from "@/lib/brandLogo";

/**
 * Structured data so search engines read the business correctly.
 * Kept in the public layout only - the admin area is noindex.
 */
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: company.name,
  slogan: company.tagline,
  email: company.email,
  telephone: company.phonesIntl,
  founder: { "@type": "Person", name: company.owner },
  url: siteUrl,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${company.address.line1}, ${company.address.line2}`,
    addressLocality: company.address.city,
    postalCode: company.address.pincode,
    addressRegion: company.address.state,
    addressCountry: "IN",
  },
  description: `Automation, engineering, water treatment and security solutions at ${addressOneLine}.`,
};

export default function SiteLayout({ children }: { children: ReactNode }) {
  // Resolved on the server so a missing file never reaches the browser.
  const logoSrc = resolveBrandLogo();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <IntroScreen />
      <ScrollProgress />
      <CustomCursor />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-lg focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <Navbar logoSrc={logoSrc} />

      {/* Spacer matching the fixed header: 80px, +38px contact strip from lg. */}
      <div aria-hidden="true" className="h-20 lg:h-[118px]" />

      <main id="main">
        <PageTransition>{children}</PageTransition>
      </main>

      <Footer />
      <FloatingActions />
    </>
  );
}
