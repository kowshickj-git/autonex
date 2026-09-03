#!/usr/bin/env node
/**
 * Generates the ADMIN_PASSWORD_HASH value for .env.local
 *
 *   npm run admin:hash -- "your-password-here"
 *
 * Also prints a fresh ADMIN_AUTH_SECRET if you need one.
 */
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

const password = process.argv[2];

if (!password) {
  console.error("\nUsage: npm run admin:hash -- \"your-password-here\"\n");
  process.exit(1);
}

if (password.length < 10) {
  console.error("\nUse at least 10 characters for the admin password.\n");
  process.exit(1);
}

const salt = randomBytes(16);
const derived = await scryptAsync(password, salt, 64);

console.log("\nAdd these to .env.local:\n");
console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt.toString("base64")}:${derived.toString("base64")}`);
console.log(`ADMIN_AUTH_SECRET=${randomBytes(48).toString("hex")}`);
console.log("\nThen remove ADMIN_PASSWORD from the file - the hash replaces it.\n");
