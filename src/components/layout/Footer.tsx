import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { addressLines, company, footerNav } from "@/lib/site";
import { LogoMark } from "./Logo";

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="eyebrow text-royal-300">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group inline-flex text-sm text-white/65 transition-colors duration-200 hover:text-white"
            >
              <span className="relative">
                {link.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-copper-500 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white">
      <div aria-hidden="true" className="tech-grid absolute inset-0 opacity-50" />
      <div
        aria-hidden="true"
        className="tech-bloom absolute inset-x-0 -top-40 h-96"
        style={{ ["--bloom-y" as string]: "100%" }}
      />

      <div className="container-page relative">
        <div className="grid gap-12 py-16 lg:grid-cols-12 lg:py-20">
          {/* Identity + contact */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <LogoMark className="size-10" />
              <div>
                <p className="font-display text-lg font-extrabold tracking-tight">AUTONEX</p>
                <p className="eyebrow text-[9px] text-royal-300">Solutions</p>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              Integrated automation, engineering, water treatment, security and technology
              solutions for homes, businesses, institutions and engineering students.
            </p>

            <ul className="mt-7 space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-copper-400" strokeWidth={2} />
                <address className="not-italic leading-relaxed text-white/70">
                  {addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-copper-400" strokeWidth={2} />
                <span className="flex flex-col gap-1">
                  {company.phones.map((phone, i) => (
                    <a
                      key={phone}
                      href={`tel:${company.phonesIntl[i]}`}
                      className="numeric text-white/70 transition-colors hover:text-white"
                    >
                      {phone}
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-copper-400" strokeWidth={2} />
                <a
                  href={`mailto:${company.email}`}
                  className="break-all text-white/70 transition-colors hover:text-white"
                >
                  {company.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-copper-400" strokeWidth={2} />
                <span className="flex flex-col gap-1 text-white/70">
                  {company.hours.map((h) => (
                    <span key={h.days}>
                      {h.days}: <span className="numeric text-xs">{h.time}</span>
                    </span>
                  ))}
                </span>
              </li>
            </ul>
          </div>

          {/* Link columns */}
          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
            <LinkColumn title="Solutions" links={footerNav.solutions} />
            <LinkColumn title="Engineering" links={footerNav.engineering} />
            <LinkColumn title="Company" links={footerNav.company} />
          </div>
        </div>

        <div className="h-px bg-white/10" />

        <div className="flex flex-col gap-4 py-7 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {company.name}. All rights reserved.
          </p>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>
              {company.owner} &middot; {company.ownerRole}
            </span>
            <span aria-hidden="true" className="hidden sm:inline">
              &middot;
            </span>
            <Link href="/admin" className="transition-colors hover:text-white/80">
              Admin
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
