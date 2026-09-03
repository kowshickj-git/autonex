import Link from "next/link";
import { ArrowRight, FileCode2 } from "lucide-react";

/**
 * Honest placeholder for the admin sections that are not database-backed yet.
 *
 * The spec's scope is "Gallery should be fully functional" - so rather than
 * pretending these screens work, each one names the file where the content
 * actually lives today and what building it out would involve.
 */
export function AdminPlaceholder({
  title,
  description,
  sourceFile,
  publicHref,
  publicLabel,
  nextSteps,
}: {
  title: string;
  description: string;
  sourceFile: string;
  publicHref: string;
  publicLabel: string;
  nextSteps: string[];
}) {
  return (
    <>
      <header>
        <h1 className="text-2xl font-extrabold text-navy-900">{title}</h1>
        <p className="mt-1.5 text-sm text-slate-6">{description}</p>
      </header>

      <div className="mt-7 card p-6">
        <span className="grid size-11 place-items-center rounded-xl bg-royal-50 text-royal-700">
          <FileCode2 className="size-5" strokeWidth={1.8} aria-hidden="true" />
        </span>

        <h2 className="mt-4 text-base font-bold text-navy-900">
          Managed in code, not in the database
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-7">
          This content is currently defined in{" "}
          <code className="numeric rounded bg-slate-2 px-1.5 py-0.5 text-[12px] text-navy-800">
            {sourceFile}
          </code>
          . Editing that file and redeploying updates the website. The Gallery is the section
          that is fully database-backed today.
        </p>

        <h3 className="mt-6 text-sm font-semibold text-navy-900">
          To make this editable from here
        </h3>
        <ol className="mt-2.5 space-y-1.5">
          {nextSteps.map((step, index) => (
            <li key={step} className="flex gap-2.5 text-sm text-slate-7">
              <span className="numeric shrink-0 text-slate-5">{index + 1}.</span>
              {step}
            </li>
          ))}
        </ol>

        <Link href={publicHref} className="btn btn-outline mt-7">
          {publicLabel}
          <ArrowRight className="btn-arrow size-4" strokeWidth={2.2} />
        </Link>
      </div>
    </>
  );
}
