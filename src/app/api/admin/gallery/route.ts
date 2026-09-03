import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/guard";
import { galleryStore } from "@/lib/gallery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/gallery
 *
 * The admin listing: includes hidden photos, which is exactly why it is
 * behind `requireAdmin()`.
 */
export async function GET(request: NextRequest) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const params = request.nextUrl.searchParams;
  const visibility = params.get("visibility");

  try {
    const all = await galleryStore().list({
      visibleOnly: false,
      category: params.get("category") ?? undefined,
      search: params.get("search") ?? undefined,
    });

    const images =
      visibility === "visible"
        ? all.filter((image) => image.is_visible)
        : visibility === "hidden"
          ? all.filter((image) => !image.is_visible)
          : all;

    return NextResponse.json({ images }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[api/admin/gallery] list failed:", error);
    return NextResponse.json(
      { error: "Could not load the gallery. Please try again." },
      { status: 503 },
    );
  }
}
