import { NextResponse } from "next/server";
import { adminStore } from "@/lib/plan/admin-data";

/**
 * Delete a submission.
 *
 * Permanent, and intentionally so: a practice holding someone's income and
 * expense detail should be able to honour a deletion request without a support
 * ticket. There is no soft-delete flag because a record that is still on disk
 * has not been deleted.
 *
 * Returns 404 rather than 401 when signed out, so an unauthenticated caller
 * cannot use this route to learn whether a given reference exists.
 */
export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/admin/plans/[id]">,
) {
  const store = await adminStore();
  if (!store) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const { id } = await context.params;
  const removed = await store.remove(id);

  if (!removed) {
    return NextResponse.json(
      { ok: false, error: "That submission is already gone." },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true });
}
