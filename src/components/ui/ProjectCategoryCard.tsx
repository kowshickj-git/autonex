import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProjectCategory } from "@/lib/services";
import { ServiceIcon } from "./ServiceIcon";

const CARD = "card card-hover group flex h-full flex-col p-6";

function Body({ category }: { category: ProjectCategory }) {
  return (
    <>
      <ServiceIcon icon={category.icon} tone="copper" gesture="scale" size="sm" />

      <h3 className="mt-4 text-base font-bold text-navy-900 transition-colors duration-300 group-hover:text-royal-700">
        {category.title}
      </h3>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-7">{category.blurb}</p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {category.tags.map((tag) => (
          <li
            key={tag}
            className="numeric rounded-md bg-slate-2 px-2 py-0.5 text-[10px] text-slate-6 transition-colors duration-300 group-hover:bg-royal-50 group-hover:text-royal-700"
          >
            {tag}
          </li>
        ))}
      </ul>

      {category.href && (
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-royal-700">
          View Projects
          <ArrowRight
            className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
            strokeWidth={2.2}
          />
        </span>
      )}
    </>
  );
}

/**
 * Project category card. Categories with a dedicated page become links;
 * the rest stay as static cards so nothing points at a route that does not
 * exist.
 */
export function ProjectCategoryCard({ category }: { category: ProjectCategory }) {
  if (category.href) {
    return (
      <Link href={category.href} data-cursor="card" className={CARD}>
        <Body category={category} />
      </Link>
    );
  }

  return (
    <div data-cursor="card" className={CARD}>
      <Body category={category} />
    </div>
  );
}
