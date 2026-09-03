import type { AdminRole, PublicAdminUser } from "@/lib/auth/users/types";

/**
 * Browser-side wrapper around the team API.
 *
 * Mirrors galleryService: every function throws an already-humanised Error, so
 * components never interpret a status code. Field-level validation errors are
 * carried on the thrown error so a form can highlight the offending input.
 */

export class FieldError extends Error {
  readonly fields: Record<string, string>;
  constructor(message: string, fields: Record<string, string>) {
    super(message);
    this.name = "FieldError";
    this.fields = fields;
  }
}

async function readError(response: Response, fallback: string): Promise<Error> {
  try {
    const data = (await response.json()) as { error?: string; errors?: Record<string, string> };
    if (data.errors && Object.keys(data.errors).length > 0) {
      return new FieldError(data.error ?? fallback, data.errors);
    }
    return new Error(data.error ?? fallback);
  } catch {
    return new Error(fallback);
  }
}

export async function fetchTeam(): Promise<PublicAdminUser[]> {
  const response = await fetch("/api/admin/users", { cache: "no-store" });
  if (!response.ok) throw await readError(response, "Could not load team members.");
  const data = (await response.json()) as { users: PublicAdminUser[] };
  return data.users ?? [];
}

export async function createTeamMember(input: {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
}): Promise<PublicAdminUser> {
  const response = await fetch("/api/admin/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw await readError(response, "Could not create the account.");
  const data = (await response.json()) as { user: PublicAdminUser };
  return data.user;
}

export async function updateTeamMember(
  id: string,
  patch: Partial<{ name: string; role: AdminRole; is_active: boolean; password: string }>,
): Promise<PublicAdminUser> {
  const response = await fetch(`/api/admin/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!response.ok) throw await readError(response, "Could not save your changes.");
  const data = (await response.json()) as { user: PublicAdminUser };
  return data.user;
}

export async function deleteTeamMember(id: string): Promise<void> {
  const response = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
  if (!response.ok) throw await readError(response, "Could not remove this team member.");
}
