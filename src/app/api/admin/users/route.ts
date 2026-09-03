import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/auth/guard";
import { hashPassword, MIN_PASSWORD_LENGTH } from "@/lib/auth/password";
import { isAdminRole, toPublicUser, userStore } from "@/lib/auth/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** GET /api/admin/users - list staff accounts. Owner only. */
export async function GET() {
  const session = await requireOwner();
  if (session instanceof NextResponse) return session;

  try {
    const users = await userStore().list();
    return NextResponse.json(
      { users: users.map(toPublicUser) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[api/admin/users] list failed:", error);
    return NextResponse.json({ error: "Could not load team members." }, { status: 500 });
  }
}

/** POST /api/admin/users - create a staff account. Owner only. */
export async function POST(request: Request) {
  const session = await requireOwner();
  if (session instanceof NextResponse) return session;

  let body: { email?: string; name?: string; password?: string; role?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const name = String(body.name ?? "").trim();
  const password = String(body.password ?? "");
  const role = String(body.role ?? "editor");

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Enter a name.";
  if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address.";
  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (!isAdminRole(role)) errors.role = "Choose a valid role.";

  // The bootstrap owner lives in .env.local, not the table. Allowing a row
  // with the same email would create two accounts that both claim that
  // address, and the environment one would always win at login.
  if (email && email === process.env.ADMIN_EMAIL?.trim().toLowerCase()) {
    errors.email = "That email is already used by the owner account in the environment.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Please check the form.", errors }, { status: 400 });
  }

  try {
    const user = await userStore().create({
      email,
      name,
      role: isAdminRole(role) ? role : "editor",
      password_hash: await hashPassword(password),
      created_by: session.sub,
    });

    return NextResponse.json(
      { user: toPublicUser(user) },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create the account.";
    // Duplicate email is a user-fixable validation problem, not a server fault.
    const isDuplicate = message.toLowerCase().includes("already exists");
    if (isDuplicate) {
      return NextResponse.json(
        { error: "Please check the form.", errors: { email: message } },
        { status: 409 },
      );
    }
    console.error("[api/admin/users] create failed:", error);
    return NextResponse.json({ error: "Could not create the account." }, { status: 500 });
  }
}
