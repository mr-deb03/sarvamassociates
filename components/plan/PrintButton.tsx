"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Download as PDF.
 *
 * This opens the browser's print dialog, where "Save as PDF" is the default
 * destination on every current desktop browser and an option on mobile.
 *
 * It is a deliberate choice over server-side PDF generation. The print
 * stylesheet in app/globals.css restyles this very page, so the PDF is the
 * document the visitor is already looking at — same typography, same figures,
 * selectable text, no second renderer to keep in step, and no font embedding
 * problem (the ₹ glyph in particular, which has already caused trouble on this
 * site). If a server-rendered PDF is ever needed — to attach to an email, say
 * — the right move is to point headless Chrome at this same route rather than
 * to build a second layout.
 */
export function PrintButton({
  label = "Download as PDF",
  variant = "primary",
}: {
  label?: string;
  variant?: "primary" | "secondary";
}) {
  return (
    <Button
      type="button"
      variant={variant}
      onClick={() => window.print()}
      className="print:hidden"
    >
      <Printer strokeWidth={1.75} aria-hidden className="size-4" />
      {label}
    </Button>
  );
}
