"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Admin navigation and sign out.
 *
 * `mt-20` clears the site header, which is `fixed top-0` at `h-20`. Without it
 * this bar rendered UNDERNEATH the header: the links and the sign-out button
 * were drawn behind the logo and nav — visible, but impossible to click.
 * Ordinary pages never hit this because their heroes carry their own top
 * padding; the admin shell has no hero.
 *
 * `sticky top-20` then holds it in place while a long submissions table
 * scrolls, and `z-40` keeps it below the header rather than fighting it.
 *
 * The storage location used to sit here. It printed the full database host —
 * on a hosted database that is the provider, the region and the endpoint id,
 * all of it on screen in every screenshot of this page. It bought nothing day
 * to day: the one moment the target matters is when the store is unreachable,
 * and StorageError already names it then.
 */
export function AdminBar() {
  const router = useRouter();
  const pathname = usePathname();

  const signOut = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="border-line bg-mist sticky top-20 z-40 mt-20 border-b print:hidden">
      <div className="container-page flex flex-wrap items-center justify-between gap-4 py-3.5">
        <Link
          href="/admin/plans"
          className={cn(
            "text-sm font-medium transition-colors",
            pathname.startsWith("/admin/plans") ? "text-navy" : "text-muted hover:text-navy",
          )}
        >
          Plan submissions
        </Link>

        <button
          type="button"
          onClick={signOut}
          className="text-muted hover:text-navy flex items-center gap-1.5 text-xs font-medium transition-colors"
        >
          <LogOut strokeWidth={1.75} aria-hidden className="size-3.5" />
          Sign out
        </button>
      </div>
    </div>
  );
}
