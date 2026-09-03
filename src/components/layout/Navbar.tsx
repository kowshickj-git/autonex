"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Mail, Menu, Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EASE, LOAD_DELAY } from "@/lib/motion";
import { company, navigation, type NavItem } from "@/lib/site";
import { usePrefersReducedMotion } from "@/hooks/useMotionPreference";
import { Logo } from "./Logo";

/* ------------------------------------------------------------------ *
 * Slim contact strip above the bar. Collapses away once you scroll.
 * ------------------------------------------------------------------ */
function TopStrip({ hidden }: { hidden: boolean }) {
  return (
    <div
      className="hidden overflow-hidden bg-navy-950 text-white transition-[height,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:block"
      style={{ height: hidden ? 0 : 38, opacity: hidden ? 0 : 1 }}
    >
      <div className="container-page flex h-[38px] items-center justify-between text-[13px]">
        <p className="eyebrow text-royal-300">{company.tagline}</p>
        <div className="flex items-center gap-6">
          <a
            href={`tel:${company.phonesIntl[0]}`}
            className="flex items-center gap-2 text-white/75 transition-colors hover:text-white"
          >
            <Phone className="size-3.5" strokeWidth={2} />
            <span className="numeric text-xs">{company.phones[0]}</span>
          </a>
          <a
            href={`mailto:${company.email}`}
            className="flex items-center gap-2 text-white/75 transition-colors hover:text-white"
          >
            <Mail className="size-3.5" strokeWidth={2} />
            <span className="text-xs">{company.email}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Desktop dropdown
 * ------------------------------------------------------------------ */
function NavDropdown({ item, active }: { item: NavItem; active: boolean }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  // Small grace period so the pointer can cross the gap to the panel.
  const closeSoon = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  return (
    <div className="relative" onMouseEnter={openNow} onMouseLeave={closeSoon}>
      <Link
        href={item.href}
        data-active={active}
        aria-expanded={open}
        className="nav-link flex items-center gap-1 py-2 text-sm font-semibold text-navy-800 hover:text-navy-950"
      >
        {item.label}
        <ChevronDown
          className={`size-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          strokeWidth={2.4}
        />
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.99 }}
            transition={{ duration: 0.22, ease: EASE.outQuint }}
            className="absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-4"
          >
            <div className="overflow-hidden rounded-2xl bg-white p-2 shadow-e3 ring-1 ring-slate-3">
              {item.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={() => setOpen(false)}
                  className="group block rounded-xl px-3 py-2.5 transition-colors duration-200 hover:bg-slate-1"
                >
                  <span className="block text-sm font-semibold text-navy-900 transition-colors group-hover:text-royal-700">
                    {child.label}
                  </span>
                  {child.blurb && (
                    <span className="mt-0.5 block text-xs text-slate-6">{child.blurb}</span>
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Navbar
 * ------------------------------------------------------------------ */
export function Navbar({ logoSrc = null }: { logoSrc?: string | null }) {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();
  const { scrollY } = useScroll();

  const [condensed, setCondensed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  /**
   * Condense past 80px and expand again only below 24px. The hysteresis gap
   * stops the bar flickering when a scroll lands exactly on the threshold.
   */
  useMotionValueEvent(scrollY, "change", (y) => {
    setCondensed((prev) => (prev ? y > 24 : y > 80));
  });

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
    setOpenSection(null);
  }, [pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (item: NavItem) =>
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href ||
        pathname.startsWith(item.href + "/") ||
        (item.children?.some((c) => pathname === c.href || pathname.startsWith(c.href + "/")) ?? false);

  return (
    <motion.header
      initial={reduced ? false : { opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE.outQuint, delay: LOAD_DELAY.nav }}
      className="no-print fixed inset-x-0 top-0 z-50"
    >
      <TopStrip hidden={condensed} />

      <div
        className={`transition-[height,background-color,box-shadow,backdrop-filter] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          condensed
            ? "h-16 border-b border-slate-3/70 bg-white/85 shadow-e1 backdrop-blur-xl"
            : "h-20 border-b border-transparent bg-white"
        }`}
      >
        {/*
          Header layout: logo hard left, then open space, the services
          navigation centred, more open space, and the actions hard right.
          The two flex-1 spacers are what centre the nav and give the logo
          room to breathe rather than being crowded by the menu.
        */}
        <div className="container-page flex h-full items-center gap-4">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE.outQuint, delay: LOAD_DELAY.logo }}
            className="shrink-0"
          >
            <Logo src={logoSrc} compact={condensed} />
          </motion.div>

          {/* Open space to the right of the logo */}
          <div className="hidden flex-1 xl:block" aria-hidden="true" />

          {/* Services navigation, centred in the header */}
          <nav className="hidden items-center gap-6 xl:flex" aria-label="Main">
            {navigation.map((item) =>
              item.children ? (
                <NavDropdown key={item.href} item={item} active={isActive(item)} />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  data-active={isActive(item)}
                  className="nav-link py-2 text-sm font-semibold text-navy-800 hover:text-navy-950"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          {/* Balancing space so the nav sits centred, not pushed right */}
          <div className="hidden flex-1 xl:block" aria-hidden="true" />

          {/* Below xl the nav is a drawer, so this keeps actions on the right */}
          <div className="flex-1 xl:hidden" aria-hidden="true" />

          <div className="flex shrink-0 items-center gap-3">
            <a
              href={`tel:${company.phonesIntl[0]}`}
              className="btn btn-outline hidden !px-4 !py-2.5 text-[13px] lg:inline-flex xl:hidden"
            >
              <Phone className="size-4" strokeWidth={2} />
              Call
            </a>
            <Link href="/contact" className="btn btn-primary hidden !py-3 text-[13px] sm:inline-flex">
              Get a Quote
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="grid size-10 place-items-center rounded-xl text-navy-900 transition-colors hover:bg-slate-2 xl:hidden"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 top-16 bg-navy-950/45 backdrop-blur-sm xl:hidden"
            />
            <motion.nav
              key="drawer"
              aria-label="Mobile"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE.outQuint }}
              className="fixed inset-x-0 top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-slate-3 bg-white px-5 pb-8 pt-4 shadow-e3 xl:hidden"
            >
              <ul className="flex flex-col">
                {navigation.map((item, index) => {
                  const expanded = openSection === item.label;
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: EASE.outQuint, delay: 0.03 * index }}
                      className="border-b border-slate-2 last:border-0"
                    >
                      <div className="flex items-center">
                        <Link
                          href={item.href}
                          className={`flex-1 py-3.5 text-[15px] font-semibold ${
                            isActive(item) ? "text-royal-700" : "text-navy-900"
                          }`}
                        >
                          {item.label}
                        </Link>
                        {item.children && (
                          <button
                            type="button"
                            aria-label={`${expanded ? "Collapse" : "Expand"} ${item.label}`}
                            aria-expanded={expanded}
                            onClick={() => setOpenSection(expanded ? null : item.label)}
                            className="grid size-9 place-items-center rounded-lg text-slate-6 hover:bg-slate-2"
                          >
                            <ChevronDown
                              className={`size-4 transition-transform duration-300 ${
                                expanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      <AnimatePresence initial={false}>
                        {item.children && expanded && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: EASE.outQuint }}
                            className="overflow-hidden"
                          >
                            {item.children.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  className="block border-l-2 border-slate-3 py-2.5 pl-4 text-sm text-slate-7 transition-colors hover:border-copper-500 hover:text-navy-900"
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                            <li className="h-2" />
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  );
                })}
              </ul>

              <div className="mt-6 flex flex-col gap-3">
                <Link href="/contact" className="btn btn-primary w-full">
                  Get a Quote
                </Link>
                <a href={`tel:${company.phonesIntl[0]}`} className="btn btn-outline w-full">
                  <Phone className="size-4" strokeWidth={2} />
                  Call {company.phones[0]}
                </a>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
