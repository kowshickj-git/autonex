import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { userStore, type AdminRole } from "./users";

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

const KEYLEN = 64;

/** Minimum length enforced everywhere a password is set. */
export const MIN_PASSWORD_LENGTH = 10;

/**
 * Password handling for admin accounts.
 *
 * Two sources, checked in this order:
 *   1. The bootstrap owner in .env.local (ADMIN_EMAIL + ADMIN_PASSWORD_HASH).
 *      Always honoured, has no database row, and cannot be deleted from the
 *      UI - without it a fresh deploy with an empty table would be unable to
 *      log in and create the first staff account.
 *   2. Staff accounts in the `admin_users` table, added from the Team screen.
 *
 * Node-only (scrypt). This module must never be imported from middleware.
 */

/**
 * Format: `scrypt:<salt-b64>:<key-b64>`
 *
 * The separator is a colon, NOT the conventional `$`. Next.js loads .env
 * files through dotenv-expand, which treats `$name` as a variable reference
 * and silently substitutes an empty string - so a `$`-delimited hash arrives
 * at the server mangled and every login fails with no useful error. Base64
 * never contains a colon, so this is unambiguous and survives the loader.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scryptAsync(password, salt, KEYLEN);
  return `scrypt:${salt.toString("base64")}:${derived.toString("base64")}`;
}

export async function verifyAgainstHash(password: string, stored: string): Promise<boolean> {
  const [scheme, saltB64, hashB64] = stored.split(":");
  if (scheme !== "scrypt" || !saltB64 || !hashB64) return false;

  const salt = Buffer.from(saltB64, "base64");
  const expected = Buffer.from(hashB64, "base64");
  const derived = await scryptAsync(password, salt, expected.length);

  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

/**
 * Burns roughly the same time as a real verification when no account matched,
 * so response timing does not reveal whether an email exists.
 */
async function dummyVerify(password: string): Promise<void> {
  await scryptAsync(password, Buffer.alloc(16), KEYLEN);
}

export type AuthIdentity = {
  email: string;
  name: string;
  role: AdminRole;
  /** null for the bootstrap owner from .env.local. */
  uid: string | null;
};

export type AuthResult =
  | ({ ok: true } & AuthIdentity)
  | { ok: false; reason: "invalid" | "not_configured" | "disabled" };

/** The .env.local bootstrap owner, if one is configured and usable. */
function envOwner(): { email: string; hash: string | null; plain: string | undefined } | null {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!email) return null;
  return {
    email,
    hash: process.env.ADMIN_PASSWORD_HASH?.trim() || null,
    plain: process.env.ADMIN_PASSWORD || undefined,
  };
}

/**
 * Validates a login attempt. Returns a deliberately vague `invalid` for both
 * a wrong email and a wrong password so the form cannot be used to enumerate
 * accounts.
 */
export async function authenticateAdmin(email: string, password: string): Promise<AuthResult> {
  const candidate = email.trim().toLowerCase();
  const owner = envOwner();

  /* ---- 1. Bootstrap owner from the environment ---- */
  if (owner && candidate === owner.email) {
    // A plain-text password is a development convenience only.
    const plainAllowed = process.env.NODE_ENV !== "production";

    if (!owner.hash && !(plainAllowed && owner.plain)) {
      return { ok: false, reason: "not_configured" };
    }

    const matches = owner.hash
      ? await verifyAgainstHash(password, owner.hash)
      : timingSafeEqualStrings(password, owner.plain ?? "");

    if (!matches) return { ok: false, reason: "invalid" };

    return {
      ok: true,
      email: owner.email,
      name: process.env.ADMIN_NAME?.trim() || "Owner",
      role: "owner",
      uid: null,
    };
  }

  /* ---- 2. Staff accounts in the database ---- */
  let user = null;
  try {
    user = await userStore().findByEmail(candidate);
  } catch (error) {
    console.error("[auth] could not reach the user store:", error);
    // Fall through to the generic failure below rather than confirming that
    // the account exists but the database is down.
  }

  if (!user) {
    // No such account. Spend the same time a real check would.
    await dummyVerify(password);
    // If nothing at all is configured, say so - it is an operator error, not
    // a failed login.
    if (!owner) return { ok: false, reason: "not_configured" };
    return { ok: false, reason: "invalid" };
  }

  const matches = await verifyAgainstHash(password, user.password_hash);
  if (!matches) return { ok: false, reason: "invalid" };

  // Correct credentials, but access has been revoked. Distinct from `invalid`
  // so the person is told to contact the owner instead of retyping forever.
  if (!user.is_active) return { ok: false, reason: "disabled" };

  void userStore()
    .touchLastLogin(user.id)
    .catch((error) => console.error("[auth] last_login_at update failed:", error));

  return { ok: true, email: user.email, name: user.name, role: user.role, uid: user.id };
}

/** Length-safe constant-time string compare for the dev plain-password path. */
function timingSafeEqualStrings(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  return bufferA.length === bufferB.length && timingSafeEqual(bufferA, bufferB);
}
