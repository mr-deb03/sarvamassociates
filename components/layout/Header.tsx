import { ButtonLink } from "@/components/ui/Button";
import { DesktopNav } from "./DesktopNav";
import { HeaderShell } from "./HeaderShell";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <HeaderShell>
      <div className="container-page flex h-20 items-center justify-between gap-8">
        {/* priority: the header logo is in the first viewport on every route. */}
        <Logo priority />
        <DesktopNav />

        <div className="flex items-center gap-4">
          <ButtonLink href="/contact" size="sm" className="hidden sm:inline-flex">
            Book a Consultation
          </ButtonLink>
          <MobileNav />
        </div>
      </div>
    </HeaderShell>
  );
}
