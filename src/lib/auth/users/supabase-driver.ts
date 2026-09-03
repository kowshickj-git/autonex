import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { AdminUser, AdminUserPatch, NewAdminUser, UserDriver } from "./types";

/**
 * Production driver: Supabase Postgres.
 *
 * Uses the service-role key, server-side only. The `admin_users` table has RLS
 * enabled with NO anon policy at all - unlike gallery_images, nothing here is
 * ever publicly readable, because the rows contain password hashes.
 */

const TABLE = "admin_users";

let cached: SupabaseClient | null = null;

function client(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.STORAGE_URL || process.env.DATABASE_URL;
  const key = process.env.STORAGE_KEY;

  if (!url || !key) {
    throw new Error(
      'Supabase is not configured. Set STORAGE_URL (or DATABASE_URL) and STORAGE_KEY, or switch GALLERY_DRIVER to "local".',
    );
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

/** Postgres unique-violation, raised when the email is already taken. */
const UNIQUE_VIOLATION = "23505";

export const supabaseUserDriver: UserDriver = {
  name: "supabase",

  async list() {
    const { data, error } = await client()
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as AdminUser[];
  },

  async findByEmail(email) {
    const { data, error } = await client()
      .from(TABLE)
      .select("*")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (data as AdminUser | null) ?? null;
  },

  async get(id) {
    const { data, error } = await client().from(TABLE).select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(error.message);
    return (data as AdminUser | null) ?? null;
  },

  async create(input: NewAdminUser) {
    const row = {
      email: input.email.trim().toLowerCase(),
      name: input.name,
      role: input.role,
      password_hash: input.password_hash,
      is_active: true,
      created_by: input.created_by,
    };

    const { data, error } = await client().from(TABLE).insert(row).select().single();

    if (error) {
      if (error.code === UNIQUE_VIOLATION) {
        throw new Error("An account with that email already exists.");
      }
      throw new Error(error.message);
    }
    return data as AdminUser;
  },

  async update(id, patch: AdminUserPatch) {
    const { data, error } = await client()
      .from(TABLE)
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw new Error(error.message);
    return (data as AdminUser | null) ?? null;
  },

  async remove(id) {
    const { error, count } = await client()
      .from(TABLE)
      .delete({ count: "exact" })
      .eq("id", id);
    if (error) throw new Error(error.message);
    return (count ?? 0) > 0;
  },

  async touchLastLogin(id) {
    await client()
      .from(TABLE)
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", id);
  },
};
