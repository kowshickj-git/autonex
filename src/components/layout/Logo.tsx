import Link from "next/link";
import { company } from "@/lib/site";

/**
 * Square icon mark, for slots too small for the full horizontal lockup -
 * the admin sidebar, the 404 page, the dark footer. Built from two structural
 * strokes and a copper signal node.
 *
 * Kept as SVG rather than the brand artwork on purpose: the real logo is a
 * wide lockup with a dark-blue wordmark, which neither fits a square nor
 * reads on a navy background.
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

/** Typeset lockup, used whenever no brand file has been supplied. */
function FallbackLockup({ invert, compact }: { invert: boolean; compact: boolean }) {
  return (
    <>
      <LogoMark className={compact ? "size-8" : "size-10"} />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display font-extrabold tracking-tight ${
            compact ? "text-[15px]" : "text-[17px]"
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
 * `src` is resolved on the SERVER by resolveBrandLogo(), so this component
 * never has to guess whether the artwork exists. When it is null the
 * placeholder renders instead and the browser is never handed a URL that
 * 404s - which is what previously left broken alt text sitting in the header.
 * An onError fallback could not fix that, because the image fails during the
 * first paint, before React has hydrated and attached the handler.
 *
 * Rendered as a plain <img> rather than next/image deliberately: the artwork
 * is supplied by the owner, so its pixel dimensions are unknown at build
 * time. next/image requires a declared width/height, and a declared ratio
 * that did not match the real file would visibly stretch the logo. The
 * browser reads the true aspect from the file, so `h-* w-auto` is always right.
 */
export function Logo({
  src = null,
  invert = false,
  compact = false,
}: {
  src?: string | null;
  invert?: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5"
      aria-label={`${company.name} - home`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`${company.name} - automation, engineering, innovation`}
          className={`w-auto transition-[height] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            compact ? "h-9" : "h-12"
          }`}
        />
      ) : (
        <FallbackLockup invert={invert} compact={compact} />
      )}
    </Link>
  );
}
