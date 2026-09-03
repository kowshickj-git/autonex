import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/auth/password";
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Very small in-memory throttle: 8 attempts per IP per 10 minutes. */
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);

  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

/**
 * POST /api/admin/login  { email, password }
 *
 * On success sets an HttpOnly, SameSite=Lax, signed session cookie. The token
 * is an HMAC over a small payload - no password or secret ever reaches the
 * browser, and the cookie is unreadable from JavaScript.
 */
export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many sign-in attempts. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  let email = "";
  let password = "";
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    email = String(body.email ?? "");
    password = String(body.password ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!email || !password) {
    return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
  }

  const result = await authenticateAdmin(email, password);

  if (!result.ok) {
    if (result.reason === "not_configured") {
      console.error(
        "[admin/login] Admin credentials are not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD_HASH in the environment.",
      );
      return NextResponse.json(
        { error: "Admin access is not configured yet. Please contact the site administrator." },
        { status: 503 },
      );
    }
    if (result.reason === "disabled") {
      // The password was right - telling them to keep guessing would be
      // actively unhelpful, and the account state is not a secret from
      // someone who already holds its credentials.
      return NextResponse.json(
        { error: "This account has been deactivated. Please contact the site owner." },
        { status: 403 },
      );
    }
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  try {
    const { token, expires } = await createSessionToken({
      sub: result.email,
      role: result.role,
      name: result.name,
      uid: result.uid,
    });
    const response = NextResponse.json({
      ok: true,
      email: result.email,
      name: result.name,
      role: result.role,
    });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(expires));
    attempts.delete(ip);
    return response;
  } catch (error) {
    console.error("[admin/login] session creation failed:", error);
    return NextResponse.json(
      { error: "Sign-in is unavailable. Please contact the site administrator." },
      { status: 503 },
    );
  }
}
