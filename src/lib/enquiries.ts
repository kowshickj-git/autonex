import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

/**
 * Contact-form enquiries.
 *
 * Mirrors the gallery's driver pattern but much smaller: Supabase when it is
 * configured, otherwise a JSON file under ./.data so nothing is lost during
 * development. Wiring in an email or CRM notification means adding one call
 * inside `saveEnquiry` - the shape below is already what you would send.
 */

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  source: string;
  created_at: string;
};

export type NewEnquiry = Omit<Enquiry, "id" | "created_at">;

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "enquiries.json");
const TABLE = "enquiries";

function supabase() {
  const url = process.env.STORAGE_URL || process.env.DATABASE_URL;
  const key = process.env.STORAGE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

async function readAll(): Promise<Enquiry[]> {
  try {
    const raw = await readFile(FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Enquiry[]) : [];
  } catch {
    return [];
  }
}

export async function saveEnquiry(input: NewEnquiry): Promise<Enquiry> {
  const record: Enquiry = {
    ...input,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };

  const client = supabase();
  if (client) {
    const { error } = await client.from(TABLE).insert({
      name: record.name,
      email: record.email,
      phone: record.phone,
      subject: record.subject,
      message: record.message,
      source: record.source,
    });
    if (error) throw new Error(error.message);
    return record;
  }

  await mkdir(DATA_DIR, { recursive: true });
  const existing = await readAll();
  await writeFile(FILE, JSON.stringify([record, ...existing], null, 2), "utf8");
  return record;
}

export async function listEnquiries(limit = 100): Promise<Enquiry[]> {
  const client = supabase();
  if (client) {
    const { data, error } = await client
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message);
    return (data ?? []) as Enquiry[];
  }

  return (await readAll()).slice(0, limit);
}
