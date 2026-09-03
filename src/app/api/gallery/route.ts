import { NextResponse, type NextRequest } from "next/server";
import { galleryStore } from "@/lib/gallery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/gallery
 *
 * Public read endpoint. Returns ONLY `is_visible = true` rows, ordered by
 * display_order ASC then created_at DESC (spec section 19). No authentication,
 * no way to reach a hidden photo from here.
 *
 * Query: ?category=Gate%20Automation&search=gate&limit=60&offset=0
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  try {
    const images = await galleryStore().list({
      visibleOnly: true,
      category: params.get("category") ?? undefined,
      search: params.get("search") ?? undefined,
      limit: params.get("limit") ? Number(params.get("limit")) : undefined,
      offset: params.get("offset") ? Number(params.get("offset")) : undefined,
    });

    return NextResponse.json(
      { images },
      { headers: { "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300" } },
    );
  } catch (error) {
    // Log the detail server-side; return something a visitor can act on.
    console.error("[api/gallery] list failed:", error);
    return NextResponse.json(
      { error: "The gallery is temporarily unavailable. Please try again shortly.", images: [] },
      { status: 503 },
    );
  }
}
