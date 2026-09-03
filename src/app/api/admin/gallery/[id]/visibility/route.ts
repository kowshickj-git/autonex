import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guard";
import { galleryStore } from "@/lib/gallery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * PUT /api/admin/gallery/:id/visibility  { is_visible: boolean }
 *
 * A dedicated endpoint so the Hide/Show toggle in the admin grid is a single,
 * cheap call rather than a full metadata update.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const { id } = await params;

  let isVisible: boolean;
  try {
    const body = (await request.json()) as { is_visible?: unknown };
    if (typeof body.is_visible !== "boolean") {
      return NextResponse.json({ error: "is_visible must be true or false." }, { status: 400 });
    }
    isVisible = body.is_visible;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const image = await galleryStore().update(id, { is_visible: isVisible });
    if (!image) return NextResponse.json({ error: "Photo not found." }, { status: 404 });
    return NextResponse.json({ image }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[api/admin/gallery/:id/visibility] failed:", error);
    return NextResponse.json({ error: "Could not update visibility." }, { status: 500 });
  }
}
