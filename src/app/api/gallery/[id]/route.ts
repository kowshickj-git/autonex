import { NextResponse } from "next/server";
import { galleryStore } from "@/lib/gallery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/gallery/:id - public single-image lookup.
 * A hidden photo returns 404 here, exactly as if it did not exist.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const image = await galleryStore().get(id);
    if (!image || !image.is_visible) {
      return NextResponse.json({ error: "Photo not found." }, { status: 404 });
    }
    return NextResponse.json({ image });
  } catch (error) {
    console.error("[api/gallery/:id] failed:", error);
    return NextResponse.json({ error: "Unable to load this photo." }, { status: 503 });
  }
}
