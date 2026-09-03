import { Check } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

/**
 * Checked feature list used across the solution pages.
 * `columns` controls the grid at md and above.
 */
export function FeatureList({
  items,
  columns = 2,
  invert = false,
}: {
  items: string[];
  columns?: 1 | 2 | 3;
  invert?: boolean;
}) {
  const cols =
    columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : columns === 2 ? "sm:grid-cols-2" : "";

  return (
    <RevealGroup each={0.04} className={`grid gap-x-8 gap-y-3.5 ${cols}`}>
      {items.map((item) => (
        <RevealItem key={item} variant="text" className="flex items-start gap-3">
          <span
            className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${
              invert ? "bg-royal-500/20 text-royal-300" : "bg-royal-50 text-royal-700"
            }`}
          >
            <Check className="size-3" strokeWidth={3} aria-hidden="true" />
          </span>
          <span className={`text-sm leading-relaxed ${invert ? "text-white/70" : "text-slate-7"}`}>
            {item}
          </span>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
