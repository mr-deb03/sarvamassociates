import { NextResponse } from "next/server";
import { adminStore } from "@/lib/plan/admin-data";

/**
 * CSV of every submission.
 *
 * Summary fields only — the goal-by-goal detail belongs in the plan itself,
 * and a spreadsheet of everyone's expense breakdown is a liability nobody
 * asked for. This is the list a practice actually works from: who got in
 * touch, how to reach them, and how big the conversation is.
 */
export async function GET() {
  const store = await adminStore();
  if (!store) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const items = await store.list();

  const header = [
    "Reference",
    "Received",
    "Status",
    "Name",
    "Mobile",
    "Email",
    "Monthly income",
    "Goals",
    "Monthly shortfall to close",
  ];

  const rows = items.map((item) => [
    item.id,
    item.createdAt,
    item.status,
    item.name,
    item.phone,
    item.email,
    String(item.monthlyIncome),
    String(item.goalCount),
    String(item.requiredMonthlyTotal),
  ]);

  const csv = [header, ...rows].map((row) => row.map(cell).join(",")).join("\r\n");

  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(`﻿${csv}`, {
    headers: {
      // The BOM above makes Excel open this as UTF-8 rather than mangling any
      // non-ASCII name in the Name column.
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="sarvam-plans-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

/**
 * Quote every cell and double any embedded quote.
 *
 * The leading apostrophe guard stops a spreadsheet treating a cell that starts
 * with =, +, - or @ as a formula. Names and emails come from a public form, so
 * this is the CSV-injection case, not a theoretical one.
 */
function cell(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}
