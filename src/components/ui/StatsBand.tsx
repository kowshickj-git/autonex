import { CountUp } from "@/components/motion/CountUp";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import type { Stat } from "@/lib/site";

/**
 * Count-up statistics (spec section 28).
 *
 * NOTE FOR THE SITE OWNER: the numbers passed in from `src/lib/site.ts` are
 * placeholders, not audited business figures. Edit them there before launch.
 */
export function StatsBand({
  stats,
  invert = false,
}: {
  stats: Stat[];
  invert?: boolean;
}) {
  return (
    <RevealGroup
      each={0.08}
      className={`grid grid-cols-2 gap-px overflow-hidden rounded-2xl lg:grid-cols-4 ${
        invert ? "bg-white/10" : "bg-slate-3"
      }`}
    >
      {stats.map((stat) => (
        <RevealItem
          key={stat.label}
          className={`px-6 py-8 text-center sm:px-8 sm:py-10 ${
            invert ? "bg-navy-900" : "bg-white"
          }`}
        >
          <p
            className={`numeric text-4xl font-semibold tracking-tight sm:text-5xl ${
              invert ? "text-white" : "text-navy-900"
            }`}
          >
            <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
          </p>
          <p
            className={`mt-3 text-[13px] font-medium ${
              invert ? "text-white/60" : "text-slate-6"
            }`}
          >
            {stat.label}
          </p>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
