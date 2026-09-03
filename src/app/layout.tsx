import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Manrope } from "next/font/google";
import { company, siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${company.name} | ${company.tagline}`,
    template: `%s | ${company.name}`,
  },
  description:
    "Autonex Solutions delivers automation, engineering lab equipment, gate and home automation, water purification, security systems and college project development in Chennai.",
  keywords: [
    "automation Chennai",
    "gate automation",
    "home automation",
    "boom barrier",
    "RO plant",
    "water softener",
    "CCTV installation",
    "security alarm",
    "engineering lab equipment",
    "college final year projects",
    "Autonex Solutions",
  ],
  authors: [{ name: company.owner }],
  openGraph: {
    type: "website",
    siteName: company.name,
    title: `${company.name} | ${company.tagline}`,
    description:
      "Complete automation, engineering, water treatment, security and technology solutions for homes, businesses, institutions and engineering students.",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${company.name} | ${company.tagline}`,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#071b31",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
