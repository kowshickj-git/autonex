import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guard";
import { galleryStore, isDevelopmentDriver } from "@/lib/gallery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/stats
 *
 * Dashboard tiles (spec section 30). Every number is computed from the store -
 * nothing here is hard-coded.
 */
export async function GET() {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  try {
    const stats = await galleryStore().stats();
    return NextResponse.json(
      { stats, driver: galleryStore().name, developmentDriver: isDevelopmentDriver() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[api/admin/stats] failed:", error);
    return NextResponse.json({ error: "Could not load statistics." }, { status: 503 });
  }
}
