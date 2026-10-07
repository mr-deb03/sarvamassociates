"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

/** Admin navigation and sign out. */
export function AdminBar({ storagePath }: { storagePath: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const signOut = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="border-line bg-mist border-b print:hidden">
      <div className="container-page flex flex-wrap items-center justify-between gap-4 py-3.5">
        <div className="flex items-center gap-6">
          <Link
            href="/admin/plans"
            className={cn(
              "text-sm font-medium transition-colors",
              pathname.startsWith("/admin/plans") ? "text-navy" : "text-muted hover:text-navy",
            )}
          >
            Plan submissions
          </Link>
          <span className="text-muted hidden text-xs sm:inline" title={storagePath}>
            Stored in {storagePath}
          </span>
        </div>

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
