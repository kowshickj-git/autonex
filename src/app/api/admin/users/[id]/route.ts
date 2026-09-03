import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/auth/guard";
import { hashPassword, MIN_PASSWORD_LENGTH } from "@/lib/auth/password";
import { isAdminRole, toPublicUser, userStore, type AdminUserPatch } from "@/lib/auth/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

/**
 * PATCH /api/admin/users/:id - update name, role, active state or password.
 * Owner only.
 */
export async function PATCH(request: Request, { params }: Context) {
  const session = await requireOwner();
  if (session instanceof NextResponse) return session;

  const { id } = await params;

  let body: { name?: string; role?: string; is_active?: boolean; password?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const store = userStore();
  const existing = await store.get(id);
  if (!existing) {
    return NextResponse.json({ error: "That team member no longer exists." }, { status: 404 });
  }

  const patch: AdminUserPatch = {};
  const errors: Record<string, string> = {};

  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (!name) errors.name = "Enter a name.";
    else patch.name = name;
  }

  if (body.role !== undefined) {
    const role = String(body.role);
    if (!isAdminRole(role)) errors.role = "Choose a valid role.";
    else patch.role = role;
  }

  if (body.password !== undefined) {
    const password = String(body.password);
    if (password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
    } else {
      patch.password_hash = await hashPassword(password);
    }
  }

  if (body.is_active !== undefined) {
    patch.is_active = Boolean(body.is_active);
  }

  // Locking yourself out is never the intent, and recovering from it needs
  // database access most people will not have to hand.
  if (session.uid === id) {
    if (patch.is_active === false) {
      errors.is_active = "You cannot deactivate your own account.";
    }
    if (patch.role && patch.role !== "owner") {
      errors.role = "You cannot remove your own owner access.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Please check the form.", errors }, { status: 400 });
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ user: toPublicUser(existing) });
  }

  try {
    const updated = await store.update(id, patch);
    if (!updated) {
      return NextResponse.json({ error: "That team member no longer exists." }, { status: 404 });
    }
    return NextResponse.json(
      { user: toPublicUser(updated) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[api/admin/users/:id] update failed:", error);
    return NextResponse.json({ error: "Could not save your changes." }, { status: 500 });
  }
}

/** DELETE /api/admin/users/:id - remove a staff account. Owner only. */
export async function DELETE(_request: Request, { params }: Context) {
  const session = await requireOwner();
  if (session instanceof NextResponse) return session;

  const { id } = await params;

  if (session.uid === id) {
    return NextResponse.json(
      { error: "You cannot delete the account you are signed in with." },
      { status: 400 },
    );
  }

  try {
    const removed = await userStore().remove(id);
    if (!removed) {
      return NextResponse.json({ error: "That team member no longer exists." }, { status: 404 });
    }
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[api/admin/users/:id] delete failed:", error);
    return NextResponse.json({ error: "Could not remove this team member." }, { status: 500 });
  }
}
