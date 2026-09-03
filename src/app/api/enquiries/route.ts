import { NextResponse } from "next/server";
import { saveEnquiry } from "@/lib/enquiries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const limitByIp = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 5;

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
const isPhone = (value: string) => /^[0-9+\-\s()]{8,18}$/.test(value);

/**
 * POST /api/enquiries - the public contact form.
 *
 * Protections that matter here: a per-IP rate limit, a honeypot field that
 * real users never see, and strict length caps. No CAPTCHA, because the
 * volume does not justify the friction.
 */
export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const now = Date.now();
  const entry = limitByIp.get(ip);
  if (!entry || entry.resetAt < now) {
    limitByIp.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  } else if (++entry.count > MAX_PER_WINDOW) {
    return NextResponse.json(
      { error: "You have sent several enquiries already. Please call us instead." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: a hidden input only a bot would fill in. Accept silently so the
  // bot learns nothing, but store nothing.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const subject = String(body.subject ?? "General Enquiry").trim();
  const message = String(body.message ?? "").trim();

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Please enter your name.";
  if (!isEmail(email)) errors.email = "Please enter a valid email address.";
  if (!isPhone(phone)) errors.phone = "Please enter a valid phone number.";
  if (message.length < 10) errors.message = "Please tell us a little more about what you need.";
  if (message.length > 3000) errors.message = "Please keep your message under 3000 characters.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Please check the form.", errors }, { status: 400 });
  }

  try {
    await saveEnquiry({
      name: name.slice(0, 120),
      email: email.slice(0, 160),
      phone: phone.slice(0, 24),
      subject: subject.slice(0, 160),
      message: message.slice(0, 3000),
      source: String(body.source ?? "website").slice(0, 80),
    });

    return NextResponse.json({
      ok: true,
      message: "Thank you! Our team will contact you shortly.",
    });
  } catch (error) {
    console.error("[api/enquiries] save failed:", error);
    return NextResponse.json(
      { error: "We could not send your enquiry. Please call us on 9003242334." },
      { status: 500 },
    );
  }
}
