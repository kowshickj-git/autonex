"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FolderOpen,
  GraduationCap,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { EASE } from "@/lib/motion";
import { adminLogout } from "@/lib/galleryService";
import { LogoMark } from "./Logo";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Services", href: "/admin/services", icon: Wrench },
  { label: "Engineering Equipment", href: "/admin/engineering-equipment", icon: FolderOpen },
  { label: "College Projects", href: "/admin/college-projects", icon: GraduationCap },
  { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
  /**
   * Owner-only. Hiding it is presentation - `/admin/team` redirects and every
   * /api/admin/users route calls requireOwner(), so an editor who types the
   * URL still gets nowhere.
   */
  { label: "Team", href: "/admin/team", icon: Users, ownerOnly: true },
];

export function AdminShell({
  children,
  role,
  name,
}: {
  children: ReactNode;
  role: "owner" | "editor";
  name: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNav, setMobileNav] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const visibleNav = NAV.filter((item) => !item.ownerOnly || role === "owner");

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const signOut = async () => {
    setSigningOut(true);
    await adminLogout();
    router.replace("/admin/login");
    router.refresh();
  };

  const navList = (
    <nav className="flex flex-col gap-1" aria-label="Admin">
      {visibleNav.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileNav(false)}
            aria-current={active ? "page" : undefined}
            className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
              active ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/6 hover:text-white"
            }`}
          >
            {active && (
              <motion.span
                layoutId="admin-nav-active"
                className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-copper-500"
                transition={{ duration: 0.28, ease: EASE.outQuint }}
              />
            )}
            <item.icon className="size-4 shrink-0" strokeWidth={1.9} />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-dvh bg-slate-1">
      {/* ---- Desktop sidebar ---- */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-navy-950 lg:flex">
        <div className="tech-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />

        <div className="relative flex items-center gap-3 px-5 py-6">
          <LogoMark className="size-9" />
          <div>
            <p className="font-display text-sm font-extrabold text-white">AUTONEX</p>
            <p className="eyebrow text-[8px] text-royal-300">Admin Console</p>
          </div>
        </div>

        <div className="relative flex-1 overflow-y-auto px-3 py-2">{navList}</div>

        <div className="relative border-t border-white/10 p-3">
          <div className="mb-1 px-3 py-2">
            <p className="truncate text-sm font-semibold text-white">{name}</p>
            <p className="eyebrow text-[8px] text-white/40">
              {role === "owner" ? "Owner" : "Editor"}
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/55 transition-colors hover:bg-white/6 hover:text-white"
          >
            <span aria-hidden="true" className="size-4 shrink-0 text-center">
              &#8599;
            </span>
            View website
          </Link>
          <button
            type="button"
            onClick={signOut}
            disabled={signingOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/55 transition-colors hover:bg-white/6 hover:text-white disabled:opacity-50"
          >
            <LogOut className="size-4 shrink-0" strokeWidth={1.9} />
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </aside>

      {/* ---- Mobile top bar ---- */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-3 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2.5">
          <LogoMark className="size-8" />
          <p className="font-display text-sm font-extrabold text-navy-900">Admin</p>
        </div>
        <button
          type="button"
          onClick={() => setMobileNav((value) => !value)}
          aria-label={mobileNav ? "Close menu" : "Open menu"}
          aria-expanded={mobileNav}
          className="grid size-9 place-items-center rounded-lg text-navy-900 hover:bg-slate-2"
        >
          {mobileNav ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>

      <AnimatePresence>
        {mobileNav && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileNav(false)}
              className="fixed inset-0 z-40 bg-navy-950/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.32, ease: EASE.outQuint }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-navy-950 lg:hidden"
            >
              <div className="flex items-center justify-between px-5 py-5">
                <div className="flex items-center gap-3">
                  <LogoMark className="size-8" />
                  <p className="font-display text-sm font-extrabold text-white">AUTONEX</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileNav(false)}
                  aria-label="Close menu"
                  className="grid size-8 place-items-center rounded-lg text-white/60 hover:bg-white/10"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-3">{navList}</div>
              <div className="border-t border-white/10 p-3">
                <Link href="/" className="block rounded-xl px-3 py-2.5 text-sm text-white/55">
                  View website
                </Link>
                <button
                  type="button"
                  onClick={signOut}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/55"
                >
                  <LogOut className="size-4" strokeWidth={1.9} />
                  Sign out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ---- Content ---- */}
      <div className="lg:pl-64">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: EASE.outQuint }}
          className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
