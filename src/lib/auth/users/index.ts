import { localUserDriver } from "./local-driver";
import { supabaseUserDriver } from "./supabase-driver";
import type { UserDriver } from "./types";

export * from "./types";

/**
 * Resolves the staff-account store from the environment, using the same
 * GALLERY_DRIVER switch as the gallery so the whole app is backed by one
 * database rather than two half-configured ones.
 */
export function userStore(): UserDriver {
  const configured = process.env.GALLERY_DRIVER?.toLowerCase();

  if (configured === "supabase") return supabaseUserDriver;
  if (configured === "local") return localUserDriver;

  const hasSupabase = Boolean(
    (process.env.STORAGE_URL || process.env.DATABASE_URL) && process.env.STORAGE_KEY,
  );
  return hasSupabase ? supabaseUserDriver : localUserDriver;
}
