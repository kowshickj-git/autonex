import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { AdminUser, AdminUserPatch, NewAdminUser, UserDriver } from "./types";

/**
 * Development driver: a JSON file in ./.data, mirroring the gallery's local
 * driver. Real persistence across restarts, so the whole team flow is testable
 * without cloud credentials - but single-instance and on the app's own disk,
 * so production must use GALLERY_DRIVER=supabase.
 *
 * The file contains password hashes, never plain passwords. It is inside
 * ./.data, which is gitignored.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "admin-users.json");

/** Serialises writes so two simultaneous creates cannot clobber each other. */
let queue: Promise<unknown> = Promise.resolve();
function withLock<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
}

async function readAll(): Promise<AdminUser[]> {
  try {
    const raw = await readFile(FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AdminUser[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(rows: AdminUser[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(FILE, JSON.stringify(rows, null, 2), "utf8");
}

export const localUserDriver: UserDriver = {
  name: "local",

  async list() {
    const rows = await readAll();
    return [...rows].sort((a, b) => a.created_at.localeCompare(b.created_at));
  },

  async findByEmail(email) {
    const needle = email.trim().toLowerCase();
    const rows = await readAll();
    return rows.find((row) => row.email === needle) ?? null;
  },

  async get(id) {
    const rows = await readAll();
    return rows.find((row) => row.id === id) ?? null;
  },

  async create(input: NewAdminUser) {
    return withLock(async () => {
      const rows = await readAll();
      const email = input.email.trim().toLowerCase();

      if (rows.some((row) => row.email === email)) {
        throw new Error("An account with that email already exists.");
      }

      const now = new Date().toISOString();
      const record: AdminUser = {
        id: crypto.randomUUID(),
        email,
        name: input.name,
        role: input.role,
        password_hash: input.password_hash,
        is_active: true,
        last_login_at: null,
        created_at: now,
        updated_at: now,
        created_by: input.created_by,
      };

      await writeAll([...rows, record]);
      return record;
    });
  },

  async update(id, patch: AdminUserPatch) {
    return withLock(async () => {
      const rows = await readAll();
      const index = rows.findIndex((row) => row.id === id);
      if (index === -1) return null;

      const updated: AdminUser = {
        ...rows[index],
        ...patch,
        updated_at: new Date().toISOString(),
      };
      rows[index] = updated;
      await writeAll(rows);
      return updated;
    });
  },

  async remove(id) {
    return withLock(async () => {
      const rows = await readAll();
      if (!rows.some((row) => row.id === id)) return false;
      await writeAll(rows.filter((row) => row.id !== id));
      return true;
    });
  },

  async touchLastLogin(id) {
    // Not queued behind the write lock: a login timestamp is not worth
    // blocking on, and losing one in a rare race is harmless.
    const rows = await readAll();
    const index = rows.findIndex((row) => row.id === id);
    if (index === -1) return;
    rows[index] = { ...rows[index], last_login_at: new Date().toISOString() };
    await writeAll(rows);
  },
};
