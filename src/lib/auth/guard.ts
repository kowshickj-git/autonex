import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken, type SessionPayload } from "./session";

/** Reads and verifies the admin session from the request cookies. */
export async function getAdminSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/**
 * Guard for admin API routes.
 *
 * Usage:
 *   const session = await requireAdmin();
 *   if (session instanceof NextResponse) return session;
 *
 * Every mutating gallery endpoint calls this first. Public read endpoints do
 * not - they only ever return `is_visible = true` rows.
 */
export async function requireAdmin(): Promise<SessionPayload | NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }
  return session;
}

/**
 * Guard for team-management routes.
 *
 * Editors can run the gallery but must not be able to create accounts, change
 * roles or remove colleagues - otherwise the distinction between the two roles
 * would be cosmetic, and any compromised editor session could mint itself a
 * permanent owner account.
 */
export async function requireOwner(): Promise<SessionPayload | NextResponse> {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  if (session.role !== "owner") {
    return NextResponse.json(
      { error: "Only an owner can manage team members." },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );
  }
  return session;
}
