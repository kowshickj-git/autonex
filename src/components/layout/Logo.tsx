"use client";

import Link from "next/link";
import { useState } from "react";
import { company } from "@/lib/site";

/** Where the real brand file lives. Drop the artwork here and it appears. */
export const LOGO_SRC = "/logo.png";

/**
 * Square icon mark, for slots too small for the full horizontal lockup -
 * the admin sidebar, the 404 page, the dark footer. Built from two structural
 * strokes and a copper signal node.
 *
 * Kept as SVG rather than the brand PNG on purpose: the real logo is a wide
 * lockup with dark-blue wordmark, which neither fits a square nor reads on a
 * navy background.
 */
export function LogoMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="autonex-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#133453" />
          <stop offset="100%" stopColor="#1a5ae0" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#autonex-mark)" />
      {/* The "A" */}
      <path
        d="M12 28.5 20 11.5 28 28.5"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M16 23h8" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" opacity="0.65" />
      {/* Signal node at the apex */}
      <circle cx="20" cy="11.5" r="2.8" fill="#f2760f" />
    </svg>
  );
}

/** The placeholder lockup, shown until the brand file is in place. */
function FallbackLockup({ invert, compact }: { invert: boolean; compact: boolean }) {
  return (
    <>
      <LogoMark className={compact ? "size-8" : "size-9"} />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display font-extrabold tracking-tight ${
            compact ? "text-[15px]" : "text-base"
          } ${invert ? "text-white" : "text-navy-900"}`}
        >
          AUTONEX
        </span>
        <span className={`eyebrow mt-1 text-[9px] ${invert ? "text-royal-300" : "text-slate-6"}`}>
          Solutions
        </span>
      </span>
    </>
  );
}

/**
 * Full brand lockup for the site header.
 *
 * Rendered as a plain <img> rather than next/image deliberately: the artwork
 * is supplied by the owner, so its exact pixel dimensions are unknown here.
 * next/image needs a declared width/height, and a declared ratio that did not
 * match the real file would visibly stretch the logo. The browser reads the
 * true aspect from the file itself, so `h-* w-auto` is always correct.
 *
 * If the file is missing the component falls back to the placeholder lockup,
 * so the header never shows a broken image.
 */
export function Logo({
  invert = false,
  compact = false,
}: {
  invert?: boolean;
  compact?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5"
      aria-label={`${company.name} - home`}
    >
      {failed ? (
        <FallbackLockup invert={invert} compact={compact} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={LOGO_SRC}
          alt={`${company.name} - automation, engineering, innovation`}
          onError={() => setFailed(true)}
          className={`w-auto transition-[height] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            compact ? "h-9" : "h-12"
          }`}
        />
      )}
    </Link>
  );
}
