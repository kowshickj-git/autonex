import type { LucideIcon } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ServiceIcon } from "./ServiceIcon";

export type InfoItem = {
  title: string;
  body: string;
  icon?: LucideIcon;
};

/** Reusable feature / capability card grid used across the solution pages. */
export function InfoGrid({
  items,
  columns = 3,
  invert = false,
  tone = "royal",
}: {
  items: InfoItem[];
  columns?: 2 | 3 | 4;
  invert?: boolean;
  tone?: "royal" | "copper";
}) {
  const cols =
    columns === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : columns === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <RevealGroup each={0.05} className={`grid gap-4 ${cols}`}>
      {items.map((item) => (
        <RevealItem
          key={item.title}
          data-cursor="card"
          className={`card card-hover group flex h-full flex-col p-6 ${invert ? "card-dark" : ""}`}
        >
          {item.icon && (
            <ServiceIcon
              icon={item.icon}
              tone={invert ? "invert" : tone}
              gesture="scale"
              size="sm"
            />
          )}
          <h3
            className={`text-base font-bold leading-snug ${
              item.icon ? "mt-4" : ""
            } ${invert ? "!text-white" : "text-navy-900"}`}
          >
            {item.title}
          </h3>
          <p
            className={`mt-2 flex-1 text-sm leading-relaxed ${
              invert ? "text-white/60" : "text-slate-7"
            }`}
          >
            {item.body}
          </p>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

/** Compact chip list for applications / industries. */
export function TagGrid({ items, invert = false }: { items: string[]; invert?: boolean }) {
  return (
    <RevealGroup each={0.03} className="flex flex-wrap gap-2.5">
      {items.map((item) => (
        <RevealItem
          key={item}
          variant="text"
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
            invert
              ? "bg-white/6 text-white/70 hover:bg-white/12 hover:text-white"
              : "bg-white text-slate-7 ring-1 ring-slate-3 hover:text-navy-900 hover:ring-royal-300"
          }`}
        >
          {item}
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
