/**
 * Admin staff accounts.
 *
 * These sit ALONGSIDE the bootstrap owner in .env.local, never replacing it.
 * A fresh deploy has an empty table, so if the env account were not always
 * honoured there would be no way to log in and create the first user.
 */

export type AdminRole = "owner" | "editor";

export const ADMIN_ROLES: readonly AdminRole[] = ["owner", "editor"] as const;

export function isAdminRole(value: string): value is AdminRole {
  return (ADMIN_ROLES as readonly string[]).includes(value);
}

/** What each role may do. Enforced server-side in the API guards. */
export const ROLE_LABEL: Record<AdminRole, string> = {
  owner: "Owner",
  editor: "Editor",
};

export const ROLE_DESCRIPTION: Record<AdminRole, string> = {
  owner: "Full access, including adding and removing team members.",
  editor: "Can manage the gallery and view enquiries. Cannot change the team.",
};

export type AdminUser = {
  id: string;
  /** Always stored lowercased - the login lookup depends on it. */
  email: string;
  name: string;
  role: AdminRole;
  /** scrypt:<salt>:<key>. Never leaves the server. */
  password_hash: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
};

/**
 * The shape sent to the browser. `password_hash` is omitted at the type level
 * so it cannot be leaked into a JSON response by accident.
 */
export type PublicAdminUser = Omit<AdminUser, "password_hash">;

export function toPublicUser(user: AdminUser): PublicAdminUser {
  // Destructured out rather than deleted, so adding a future secret field is
  // a compile error here instead of a silent leak.
  const { password_hash: _hash, ...safe } = user;
  void _hash;
  return safe;
}

export type NewAdminUser = {
  email: string;
  name: string;
  role: AdminRole;
  password_hash: string;
  created_by: string | null;
};

export type AdminUserPatch = Partial<{
  name: string;
  role: AdminRole;
  is_active: boolean;
  password_hash: string;
}>;

export interface UserDriver {
  readonly name: string;
  list(): Promise<AdminUser[]>;
  findByEmail(email: string): Promise<AdminUser | null>;
  get(id: string): Promise<AdminUser | null>;
  create(input: NewAdminUser): Promise<AdminUser>;
  update(id: string, patch: AdminUserPatch): Promise<AdminUser | null>;
  remove(id: string): Promise<boolean>;
  touchLastLogin(id: string): Promise<void>;
}
