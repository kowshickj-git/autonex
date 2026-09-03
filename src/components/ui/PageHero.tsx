import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

type Crumb = { label: string; href?: string };

type Props = {
  eyebrow?: string;
  title: string;
  lead?: string;
  crumbs?: Crumb[];
  children?: ReactNode;
};

/**
 * Dark hero for every inner page: a near-black navy canvas, a drifting
 * technical grid at ~7% opacity and a single soft royal bloom. No imagery
 * required, so it never shifts layout while loading.
 */
export function PageHero({ eyebrow, title, lead, crumbs, children }: Props) {
  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      <div aria-hidden="true" className="tech-grid absolute inset-0" />
      <div
        aria-hidden="true"
        className="tech-bloom absolute inset-0"
        style={{ ["--bloom-x" as string]: "78%", ["--bloom-y" as string]: "18%" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-navy-950"
      />

      <div className="container-page relative py-16 sm:py-20 lg:py-24">
        {crumbs && crumbs.length > 0 && (
          <Reveal duration={0.5}>
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 text-xs text-white/45">
                <li>
                  <Link href="/" className="transition-colors hover:text-white">
                    Home
                  </Link>
                </li>
                {crumbs.map((crumb) => (
                  <li key={crumb.label} className="flex items-center gap-1.5">
                    <ChevronRight className="size-3.5" aria-hidden="true" />
                    {crumb.href ? (
                      <Link href={crumb.href} className="transition-colors hover:text-white">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-white/80">{crumb.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </Reveal>
        )}

        {eyebrow && (
          <Reveal delay={0.06} duration={0.5}>
            <p className="eyebrow mt-7 flex items-center gap-2.5 text-royal-300">
              <span aria-hidden="true" className="h-px w-6 bg-copper-500" />
              {eyebrow}
            </p>
          </Reveal>
        )}

        <Reveal delay={0.12}>
          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold leading-[1.08] !text-white sm:text-5xl lg:text-[3.5rem]">
            {title}
          </h1>
        </Reveal>

        {lead && (
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
              {lead}
            </p>
          </Reveal>
        )}

        {children && (
          <Reveal delay={0.28}>
            <div className="mt-9">{children}</div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
