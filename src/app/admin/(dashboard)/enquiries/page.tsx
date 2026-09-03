import { Mail, MessageSquare, Phone } from "lucide-react";
import { listEnquiries, type Enquiry } from "@/lib/enquiries";

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  let enquiries: Enquiry[] = [];
  let error: string | null = null;

  try {
    enquiries = await listEnquiries(100);
  } catch (cause) {
    console.error("[admin enquiries] load failed:", cause);
    error = "Could not load enquiries.";
  }

  return (
    <>
      <header>
        <h1 className="text-2xl font-extrabold text-navy-900">Enquiries</h1>
        <p className="mt-1.5 text-sm text-slate-6">
          Messages submitted through the website contact form.
        </p>
      </header>

      {error ? (
        <div className="mt-7 rounded-xl bg-red-50 p-4 text-sm text-red-800 ring-1 ring-red-200">
          {error}
        </div>
      ) : enquiries.length === 0 ? (
        <div className="mt-7 rounded-2xl bg-white px-6 py-20 text-center ring-1 ring-slate-3">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-2 text-slate-5">
            <MessageSquare className="size-6" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <p className="mt-6 text-base font-semibold text-navy-900">No enquiries yet</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-6">
            Messages sent through the contact form will appear here.
          </p>
        </div>
      ) : (
        <ul className="mt-7 space-y-3">
          {enquiries.map((enquiry) => (
            <li key={enquiry.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-navy-900">{enquiry.name}</p>
                  <p className="mt-0.5 text-xs text-slate-6">{enquiry.subject}</p>
                </div>
                <p className="numeric text-[11px] text-slate-5">
                  {new Date(enquiry.created_at).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-7">
                {enquiry.message}
              </p>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-2 pt-3 text-xs">
                <a
                  href={`tel:${enquiry.phone}`}
                  className="flex items-center gap-1.5 text-royal-700 transition-colors hover:text-royal-800"
                >
                  <Phone className="size-3.5" strokeWidth={2} />
                  <span className="numeric">{enquiry.phone}</span>
                </a>
                <a
                  href={`mailto:${enquiry.email}`}
                  className="flex items-center gap-1.5 text-royal-700 transition-colors hover:text-royal-800"
                >
                  <Mail className="size-3.5" strokeWidth={2} />
                  {enquiry.email}
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
