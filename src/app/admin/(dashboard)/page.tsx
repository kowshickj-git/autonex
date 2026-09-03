import Link from "next/link";
import { ArrowRight, EyeOff, Image as ImageIcon, Layers, TriangleAlert } from "lucide-react";
import { getAdminSession } from "@/lib/auth/guard";
import { galleryStore, isDevelopmentDriver } from "@/lib/gallery";
import { listEnquiries } from "@/lib/enquiries";
import type { GalleryStats } from "@/lib/gallery/types";

export const dynamic = "force-dynamic";

const EMPTY: GalleryStats = { total: 0, visible: 0, hidden: 0, categories: 0 };

function StatCard({
  label,
  value,
  icon: Icon,
  tone = "royal",
}: {
  label: string;
  value: number;
  icon: typeof ImageIcon;
  tone?: "royal" | "emerald" | "slate" | "copper";
}) {
  const tones = {
    royal: "bg-royal-50 text-royal-700",
    emerald: "bg-emerald-50 text-emerald-700",
    slate: "bg-slate-2 text-slate-6",
    copper: "bg-copper-50 text-copper-600",
  };

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <p className="eyebrow text-[10px] text-slate-5">{label}</p>
        <span className={`grid size-9 place-items-center rounded-xl ${tones[tone]}`}>
          <Icon className="size-4" strokeWidth={1.9} />
        </span>
      </div>
      <p className="numeric mt-4 text-3xl font-semibold text-navy-900">{value}</p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const session = await getAdminSession();

  let stats = EMPTY;
  let storeError: string | null = null;
  try {
    stats = await galleryStore().stats();
  } catch (error) {
    console.error("[admin dashboard] stats failed:", error);
    storeError = "The gallery store could not be reached. Check your storage configuration.";
  }

  let enquiryCount = 0;
  try {
    enquiryCount = (await listEnquiries(200)).length;
  } catch {
    /* Enquiries are secondary here - a failure must not blank the dashboard. */
  }

  return (
    <>
      <header>
        <h1 className="text-2xl font-extrabold text-navy-900">Dashboard</h1>
        <p className="mt-1.5 text-sm text-slate-6">
          Signed in as <span className="font-medium text-navy-800">{session?.sub}</span>
        </p>
      </header>

      {isDevelopmentDriver() && (
        <div className="mt-6 flex items-start gap-3 rounded-xl bg-amber-50 p-4 ring-1 ring-amber-200">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-600" strokeWidth={2.1} />
          <div className="text-sm text-amber-900">
            <p className="font-semibold">Development storage is active</p>
            <p className="mt-1 leading-relaxed text-amber-800">
              Photos are being written to this machine&apos;s disk. They survive refreshes,
              sign-outs and restarts, but not a redeploy onto new infrastructure. Set{" "}
              <code className="numeric rounded bg-amber-100 px-1 py-0.5 text-[12px]">
                GALLERY_DRIVER=supabase
              </code>{" "}
              with your Supabase credentials before going live.
            </p>
          </div>
        </div>
      )}

      {storeError && (
        <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-800 ring-1 ring-red-200">
          {storeError}
        </div>
      )}

      <section className="mt-7">
        <h2 className="sr-only">Gallery statistics</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Photos" value={stats.total} icon={ImageIcon} />
          <StatCard label="Visible" value={stats.visible} icon={ImageIcon} tone="emerald" />
          <StatCard label="Hidden" value={stats.hidden} icon={EyeOff} tone="slate" />
          <StatCard label="Categories" value={stats.categories} icon={Layers} tone="copper" />
        </div>
        <p className="mt-3 text-xs text-slate-5">
          All figures are read live from the gallery database.
        </p>
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-3">
        <Link
          href="/admin/gallery"
          className="card card-hover group flex flex-col justify-between p-6 lg:col-span-2"
        >
          <div>
            <h2 className="text-lg font-bold text-navy-900">Gallery Management</h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-6">
              Upload photographs, edit their titles and categories, control what appears on the
              public website and drag them into the order you want.
            </p>
          </div>
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-royal-700">
            Open gallery
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={2.2}
            />
          </span>
        </Link>

        <Link href="/admin/enquiries" className="card card-hover group flex flex-col justify-between p-6">
          <div>
            <h2 className="text-lg font-bold text-navy-900">Enquiries</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-6">
              Messages received through the website contact form.
            </p>
          </div>
          <p className="numeric mt-6 text-2xl font-semibold text-navy-900">{enquiryCount}</p>
        </Link>
      </section>
    </>
  );
}
