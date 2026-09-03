import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Solution } from "@/lib/services";
import { ServiceIcon } from "./ServiceIcon";

/**
 * The card used by "Our Solutions" and every solution index.
 *
 * Hover behaviour (spec section 9) lives in globals.css under `.card-hover`:
 * the card lifts 6px, the shadow deepens, the border becomes visible, the
 * icon tile lifts 3px and the icon plays its own gesture. All CSS, all
 * transform/opacity, all 0.3s.
 */
export function SolutionCard({ solution }: { solution: Solution }) {
  return (
    <Link
      href={solution.href}
      data-cursor="card"
      className="card card-hover group flex h-full flex-col p-6"
    >
      <ServiceIcon icon={solution.icon} gesture={solution.motion} />

      <h3 className="mt-5 text-lg font-bold leading-snug text-navy-900 transition-colors duration-300 group-hover:text-royal-700">
        {solution.title}
      </h3>

      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-7">{solution.short}</p>

      <ul className="mt-5 flex flex-wrap gap-1.5">
        {solution.highlights.map((tag) => (
          <li
            key={tag}
            className="rounded-full bg-slate-2 px-2.5 py-1 text-[11px] font-medium text-slate-7 transition-colors duration-300 group-hover:bg-royal-50 group-hover:text-royal-700"
          >
            {tag}
          </li>
        ))}
      </ul>

      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-royal-700">
        Learn More
        <ArrowRight
          className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
          strokeWidth={2.2}
        />
      </span>
    </Link>
  );
}
