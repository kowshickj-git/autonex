import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LogoMark } from "@/components/layout/Logo";
import { footerNav } from "@/lib/site";

export default function NotFound() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-navy-950 px-5 py-16 text-white">
      <div aria-hidden="true" className="tech-grid absolute inset-0" />
      <div
        aria-hidden="true"
        className="tech-bloom absolute inset-0"
        style={{ ["--bloom-y" as string]: "42%" }}
      />

      <div className="relative w-full max-w-lg text-center">
        <LogoMark className="mx-auto size-12" />

        <p className="eyebrow mt-8 text-royal-300">Error 404</p>
        <h1 className="mt-4 text-4xl font-extrabold !text-white sm:text-5xl">
          This page could not be found
        </h1>
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-white/60">
          The link may be out of date, or the page may have moved. Here are the sections most
          people are looking for.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Back to Home
            <ArrowRight className="btn-arrow size-4" strokeWidth={2.2} />
          </Link>
          <Link href="/contact" className="btn btn-outline-invert">
            Contact Us
          </Link>
        </div>

        <ul className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2.5 text-sm">
          {footerNav.company.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-white/50 transition-colors duration-200 hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
