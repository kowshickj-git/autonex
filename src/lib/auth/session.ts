/**
 * Admin session tokens.
 *
 * Deliberately built on Web Crypto (`crypto.subtle`) rather than `node:crypto`
 * so the exact same verification code runs in Next.js middleware (Edge
 * runtime) and in Node route handlers. One implementation, no drift.
 *
 * Token format:  base64url(payload).base64url(hmac-sha256)
 * The payload is signed, not encrypted - it carries no secret, only the
 * admin's email, role and expiry.
 */

export const SESSION_COOKIE = "autonex_admin";

/**
 * Duplicated from `./users/types` rather than imported: this module runs in
 * the Edge middleware, and importing the users barrel would drag the Supabase
 * client and node:fs local driver into the Edge bundle.
 */
export type SessionRole = "owner" | "editor";

export type SessionPayload = {
  /** Email address. */
  sub: string;
  role: SessionRole;
  /** Display name, so the shell can greet without a database round trip. */
  name: string;
  /**
   * Staff-account id, or null for the bootstrap owner configured in
   * .env.local (which has no database row).
   */
  uid: string | null;
  /** Expiry, epoch milliseconds. */
  exp: number;
};

const encoder = new TextEncoder();

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded.padEnd(padded.length + ((4 - (padded.length % 4)) % 4), "="));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function getSecret(): string {
  const secret = process.env.ADMIN_AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "ADMIN_AUTH_SECRET is missing or too short. Set a long random value in .env.local.",
    );
  }
  return secret;
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

/** Constant-time comparison so a wrong signature leaks no timing information. */
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function createSessionToken(
  identity: { sub: string; role: SessionRole; name: string; uid: string | null },
  hours = Number(process.env.ADMIN_SESSION_HOURS ?? 12),
): Promise<{ token: string; expires: Date }> {
  const exp = Date.now() + hours * 60 * 60 * 1000;
  const payload: SessionPayload = { ...identity, exp };

  const body = base64UrlEncode(encoder.encode(JSON.stringify(payload)));
  const key = await hmacKey();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(body));

  return {
    token: `${body}.${base64UrlEncode(new Uint8Array(signature))}`,
    expires: new Date(exp),
  };
}

/** Returns the payload if the token is authentic and unexpired, else null. */
export async function verifySessionToken(
  token: string | undefined | null,
): Promise<SessionPayload | null> {
  if (!token) return null;

  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  try {
    const key = await hmacKey();
    const expected = new Uint8Array(
      await crypto.subtle.sign("HMAC", key, encoder.encode(body)),
    );
    if (!timingSafeEqual(base64UrlDecode(signature), expected)) return null;

    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(body))) as SessionPayload;
    if (payload.role !== "owner" && payload.role !== "editor") return null;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = (expires: Date) =>
  ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires,
  }) as const;
