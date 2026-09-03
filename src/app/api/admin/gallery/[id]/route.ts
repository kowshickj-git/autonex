import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guard";
import { galleryStore, type GalleryPatch } from "@/lib/gallery";
import { isGalleryCategory } from "@/lib/services";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * PUT /api/admin/gallery/:id
 * Edits metadata only - title, description, category, visibility and order.
 * The image itself is never re-uploaded to change a caption (spec section 16).
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const patch: GalleryPatch = {};

  if (typeof body.title === "string") {
    const title = body.title.trim();
    if (!title) {
      return NextResponse.json({ error: "Title cannot be empty." }, { status: 400 });
    }
    patch.title = title.slice(0, 160);
  }

  if (typeof body.description === "string") {
    patch.description = body.description.trim().slice(0, 800) || null;
  } else if (body.description === null) {
    patch.description = null;
  }

  if (typeof body.category === "string") {
    if (!isGalleryCategory(body.category)) {
      return NextResponse.json({ error: "Unknown category." }, { status: 400 });
    }
    patch.category = body.category;
  }

  if (typeof body.is_visible === "boolean") patch.is_visible = body.is_visible;

  if (typeof body.display_order === "number" && Number.isFinite(body.display_order)) {
    patch.display_order = Math.max(0, Math.trunc(body.display_order));
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  try {
    const image = await galleryStore().update(id, patch);
    if (!image) return NextResponse.json({ error: "Photo not found." }, { status: 404 });
    return NextResponse.json({ image }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[api/admin/gallery/:id] update failed:", error);
    return NextResponse.json({ error: "Could not save your changes." }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/gallery/:id
 * Removes the database row AND both stored objects (spec section 15).
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const { id } = await params;

  try {
    const removed = await galleryStore().remove(id);
    if (!removed) return NextResponse.json({ error: "Photo not found." }, { status: 404 });
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[api/admin/gallery/:id] delete failed:", error);
    return NextResponse.json(
      { error: "Could not delete this photo. Please try again." },
      { status: 500 },
    );
  }
}
