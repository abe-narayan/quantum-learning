import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { QuantumField } from "@/components/field/QuantumField";
import { buildOrganizationSchema, buildWebSiteSchema } from "@/lib/structuredData";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display face for the loudest headings only (lesson h1, page-header h1,
// section-moment h2s inside lesson prose) — Geist Sans stays the body/UI
// face everywhere else. Variable font, so weight/optical-size/softness/
// "wonkiness" are all sampled from one file via `axes` instead of loading
// multiple static weights.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

// Placeholder domain — no production domain is configured anywhere in this
// repo. Matches the placeholder used in src/app/sitemap.ts and robots.ts;
// swap all three for the real deployed domain together.
const BASE_URL = "https://quantumlearn.example";

const title = {
  default: "QuantumLearn — Learn Quantum Mechanics & Quantum Computing",
  template: "%s · QuantumLearn",
};
const description =
  "An interactive platform for learning quantum mechanics and quantum computing — lessons, simulators, and problem sets for advanced high-school and early-college students.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title,
  description,
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: title.default,
    description,
    url: BASE_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: title.default,
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // Site-wide JSON-LD: who publishes this site (Organization) and what this
  // site is (WebSite). Per-page structured data (LearningResource, Course,
  // BreadcrumbList, ...) is emitted by the individual pages themselves.
  const siteJsonLd = [buildOrganizationSchema(), buildWebSiteSchema()];

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* No-flash theme script: runs synchronously during HTML parsing,
            before first paint, so a returning visitor's explicit light/dark
            choice (ThemeToggle, src/components/layout/ThemeToggle.tsx)
            applies immediately instead of flashing the OS-default theme
            first. Left unset (no attribute) for the "system" choice or a
            first-time visitor, so the `prefers-color-scheme` fallback in
            globals.css keeps driving the theme. suppressHydrationWarning
            above tells React to accept the DOM attribute this sets rather
            than treat it as a mismatch. Keep this in sync with the storage
            key/values ThemeToggle reads and writes. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){try{var t=localStorage.getItem("quantumlearn:theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()',
          }}
        />
        {/* Scroll-reveal safety net. `[data-reveal]` starts at `opacity: 0`
            in globals.css and is revealed by an IntersectionObserver
            (src/components/motion/Reveal.tsx). With scripting disabled that
            observer never runs, and every revealed section would be
            permanently invisible — the worst possible failure mode for a
            site whose content is the point. This is the one case a
            `<noscript>` style block is the right tool: it applies only when
            scripting is off, costs nothing otherwise, and needs no
            JS-detection class on <html> that could itself be wrong.
            (The reduced-motion and print cases are handled in globals.css;
            the JS-enabled-but-hydration-failed case is handled by Reveal's
            own `revealAfterMs` timer.) */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-brand-foreground focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-background"
        >
          Skip to content
        </a>
        {/* The persistent background environment. Sits behind everything at a
            negative z-index, renders nothing before hydration, and nothing at
            all under reduced motion or on a data-saver connection — the page
            never depends on it for color or legibility (see
            src/components/field/QuantumField.tsx). */}
        <QuantumField />
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
