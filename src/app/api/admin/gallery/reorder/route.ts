import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guard";
import { galleryStore } from "@/lib/gallery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * PUT /api/admin/gallery/reorder   { ids: string[] }
 *
 * The array is the new order, front to back. Each row's `display_order`
 * becomes its index, so the public gallery (which sorts by display_order ASC)
 * immediately reflects the drag-and-drop arrangement.
 */
export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  let ids: string[];
  try {
    const body = (await request.json()) as { ids?: unknown };
    if (!Array.isArray(body.ids) || body.ids.some((id) => typeof id !== "string")) {
      return NextResponse.json({ error: "ids must be an array of photo ids." }, { status: 400 });
    }
    ids = body.ids as string[];
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (ids.length === 0) {
    return NextResponse.json({ error: "Nothing to reorder." }, { status: 400 });
  }

  if (new Set(ids).size !== ids.length) {
    return NextResponse.json({ error: "Duplicate ids in the new order." }, { status: 400 });
  }

  try {
    await galleryStore().reorder(ids);
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[api/admin/gallery/reorder] failed:", error);
    return NextResponse.json({ error: "Could not save the new order." }, { status: 500 });
  }
}
