import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  invert?: boolean;
  className?: string;
  /** Heading level - defaults to h2 since these sit inside page sections. */
  as?: "h1" | "h2" | "h3";
};

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  invert = false,
  className = "",
  as: Tag = "h2",
}: Props) {
  const centered = align === "center";

  return (
    <div
      className={`${centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`}
    >
      {eyebrow && (
        <Reveal duration={0.5}>
          <p
            className={`eyebrow flex items-center gap-2.5 ${centered ? "justify-center" : ""} ${
              invert ? "text-royal-300" : "text-royal-700"
            }`}
          >
            <span
              aria-hidden="true"
              className={`h-px w-6 ${invert ? "bg-royal-400/60" : "bg-copper-500"}`}
            />
            {eyebrow}
          </p>
        </Reveal>
      )}

      <Reveal delay={0.06}>
        <Tag
          className={`mt-4 text-3xl leading-[1.14] font-extrabold sm:text-4xl lg:text-[2.75rem] ${
            invert ? "!text-white" : ""
          }`}
        >
          {title}
        </Tag>
      </Reveal>

      {lead && (
        <Reveal delay={0.12}>
          <p
            className={`mt-5 text-base leading-relaxed sm:text-[17px] ${
              invert ? "text-white/65" : "text-slate-7"
            }`}
          >
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  );
}
