import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileCta } from "@/components/layout/MobileCta";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { SITE, SITE_URL } from "@/lib/seo";
import { cormorant, manrope } from "./fonts";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE.name} — Tax, Wealth & Financial Solutions in Mumbai`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  formatDetection: { telephone: false },
  // Both derived from public/image/sarvam_logo.png by
  // scripts/build-brand-assets.mjs. The supplied original is 3157×2481 and
  // 119 KB — far too heavy for a tab icon, and not square, so it would be
  // squashed. icon-512 is the mark trimmed to its true square and resized;
  // apple-icon is flattened onto paper because iOS composites transparent
  // icons onto black, which would bury the navy half of the mark.
  icons: {
    icon: [{ url: "/image/icon-512.png", sizes: "512x512", type: "image/png" }],
    apple: [{ url: "/image/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  // Warm paper — the browser chrome should match the page ground, not the
  // dark sections further down.
  themeColor: "#F4F8FF",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${cormorant.variable} ${manrope.variable}`}
      // The bootstrap script below adds `js` to this element before React
      // hydrates, so the server and client class lists differ by design.
      // Scoped to this element's own attributes only.
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        {/*
          Reveal bootstrap. Runs synchronously as the first thing in <body>, so
          `.js` is set before any [data-reveal] element is parsed — no flash of
          visible-then-hidden content.

          The timer is the failsafe that makes this safe to use on a site with
          mandatory risk disclosure: if hydration never happens, `.js` is
          removed and every revealed-on-scroll section — disclaimers included —
          becomes visible anyway. RevealObserver sets data-reveal-ready on mount.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');" +
              "setTimeout(function(){var d=document.documentElement;" +
              "if(!d.hasAttribute('data-reveal-ready'))d.classList.remove('js')},2500)",
          }}
        />

        <OrganizationJsonLd />

        <a
          href="#main"
          className="focus:bg-navy focus:text-paper sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-200 focus:rounded-sm focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>

        <Providers>
          <RevealObserver />
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <MobileCta />
        </Providers>
      </body>
    </html>
  );
}
