import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { QuantumField } from "@/components/field/QuantumField";
import { getLessonMeta } from "@/lib/content/lessons";
import { START_LEARNING_SLUG } from "@/lib/nav";
import {
  BASE_URL,
  PROBLEM_COUNT,
  SITE_DESCRIPTION,
  SITE_NAME,
  buildOrganizationSchema,
  buildWebSiteSchema,
} from "@/lib/structuredData";
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
// face everywhere else. Variable, so the whole weight range comes from one
// file instead of several static cuts.
//
// `axes: ["opsz"]`, not `["opsz", "SOFT", "WONK"]`. Every axis requested here
// is a dimension of design space Google Fonts has to keep in the served
// file, and the three were not costing the same thing. Measured, latin
// subset, straight from the Google Fonts CSS2 API:
//
//   opsz + SOFT + WONK + wght   121.0 KB   (what shipped)
//   opsz + SOFT + wght          120.8 KB
//   opsz + WONK + wght           67.5 KB
//   opsz + wght                  67.3 KB
//   wght alone                   36.6 KB
//
// SOFT alone was 53.5 KB of the file — 44% of the total — and WONK was
// 200 bytes. Neither is reachable: an axis that is not `opsz` can only be
// driven by an explicit `font-variation-settings`, and nothing in this
// codebase writes one (§7 of globals.css styles the display voice with
// `font-family`, `font-weight` and `font-size` only; the 35 `font-display`
// call sites use `font-medium` and `font-semibold` and nothing else). Both
// therefore rendered at their default instance — SOFT 0, WONK 0 — which is
// exactly what the file without them is instanced to. Byte-identical
// rendering, 53.7 KB smaller.
//
// `opsz` stays, and is load-bearing rather than decorative: `font-optical-
// sizing: auto` is the CSS *initial* value, so a font exposing `opsz` has it
// driven automatically by `font-size` with no CSS asking for it. This site
// sets display type from 14px (the Start here cards in
// GlossaryStartHere.tsx) to `clamp(3.75rem, 13vw, 9.5rem)` — up to 152px on
// the Apex hero — which is most of Fraunces' 9–144 optical range. Dropping
// it would flatten every large heading onto the 14pt drawing and save a
// further 30.7 KB by visibly changing the design. It is the one axis
// something actually varies.
//
// `preload: false` because `font-display: swap` (which next/font sets)
// already paints every heading immediately in the fallback, so the preload
// does not bring the largest text on screen any sooner — it only shortens
// the window before the swap, while competing at high priority with the
// resource that *does* decide LCP. That trade is worth making for the body
// and metadata faces above, whose swap restyles the whole page; it is not
// worth 67 KB on all 821 routes for one h1 and a handful of h2s. The swap
// is free of layout shift either way: `adjustFontFallback` defaults on and
// does emit the metric overrides — verified in the built CSS,
// `@font-face{font-family:Fraunces Fallback;src:local(Times New Roman);
// ascent-override:84.71%;descent-override:22.09%;line-gap-override:0.0%;
// size-adjust:115.45%}`.
//
// Net: 173 KB of high-priority font preload on every route becomes 52.4 KB.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz"],
  preload: false,
});

// The tab title and the search-result snippet are the first sentences anyone
// reads about this site, usually before they have seen a single page of it, so
// they carry the whole "what is this, who is it for, why should I care" load.
// The description names the three things a visitor can actually do here and the
// range they span, rather than describing the site as a platform: "219 lessons
// and 14 simulators" tells someone what they are getting, "an interactive
// platform" tells them nothing.
//
// It is now *imported* from `SITE_DESCRIPTION` rather than kept in step with
// it by hand. It carries a problem count, and a count that has to be retyped
// in four files is a count that is wrong: this one said 549 against a real
// corpus of 556 that grew twice in a day. `SITE_DESCRIPTION` derives that
// figure from the generated problem-meta array, so the search snippet, the
// JSON-LD and the web-app manifest cannot drift apart or fall behind the
// corpus. See the note on `PROBLEM_COUNT` in src/lib/structuredData.ts for why
// counting there is free of the build-memory cost the full registry carries.
const title = {
  default: "StudyQuantum: Quantum Mechanics and Quantum Computing from Scratch",
  template: "%s · StudyQuantum",
};
const description = SITE_DESCRIPTION;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title,
  description,
  alternates: { canonical: BASE_URL },
  // No `images` key here, deliberately. Next merges the file-convention card
  // (src/app/opengraph-image.tsx) into a segment's `openGraph` only when that
  // segment does not declare `images` itself, so writing one here would trade
  // this route's `og:image:alt` and `og:image:type` for a URL it already has.
  // Every *other* route declares its own `openGraph`, which replaces this
  // object wholesale and so loses the merged image — those re-declare the card
  // through `SITE_OG_IMAGES` in src/lib/pageMetadata.ts. `siteName` is new and
  // has to be stated on both paths: it was absent site-wide, so a shared link
  // showed a title and a description with nothing naming the site they came
  // from.
  openGraph: {
    title: title.default,
    description,
    url: BASE_URL,
    siteName: SITE_NAME,
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
            first. "system" is written as its own attribute value, not encoded
            as the absence of one: globals.css §4 gates the light palette on
            `:root[data-theme="system"]` inside `prefers-color-scheme: light`,
            so an unset attribute means dark, full stop. That is the site's
            dark-first default and what a first-time visitor gets whatever
            their OS is set to (globals.css §"Three selectors drive the
            theme"). This comment used to claim the opposite, that an unset
            attribute let `prefers-color-scheme` drive; it described the
            selector the stylesheet had before the dark-first decision landed.
            suppressHydrationWarning
            above tells React to accept the DOM attribute this sets rather
            than treat it as a mismatch. Keep this in sync with the storage
            key/values ThemeToggle reads and writes.

            The rename to StudyQuantum moved the key from `quantumlearn:theme`
            to `studyquantum:theme`. This script is the single place the
            forward-copy happens, and it happens here rather than in
            ThemeToggle because it has to run before first paint anyway: a
            returning visitor who chose light must not see one dark frame
            while React boots. Read the new key; only if it is absent, read
            the old one, use it, and copy it forward once so every later read
            (this script, ThemeToggle, global-error.tsx) finds the new key. The
            old key is left in place rather than removed: deleting it buys
            nothing, and keeping it means a rollback to the previous build
            still finds the reader's choice.

            The whole body is inside one try/catch because `localStorage`
            itself throws (not just its methods) when a browser is set to
            block site data, and an uncaught throw in a synchronous head
            script is a blank page. The inner try/catch around `setItem`
            covers the quota/read-only case separately, so a failed copy
            still leaves the theme applied for this page view. With nothing
            stored at all, no attribute is written and globals.css's
            dark-first default renders, which is the correct first-visit
            page. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){try{var k="studyquantum:theme",t=localStorage.getItem(k);if(t===null){var o=localStorage.getItem("quantumlearn:theme");if(o!==null){t=o;try{localStorage.setItem(k,o)}catch(e){}}}if(t==="light"||t==="dark"||t==="system")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()',
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
        {/* The two hosts the lesson figures load from, and the only two
            `img-src` allows (next.config.ts): of 141 external figures in 141
            lessons, 138 come from `upload.wikimedia.org` and three from
            `www.nist.gov`. Two components load them, not one: 133
            `ExternalFigure` (130 Wikimedia, 3 NIST) and 8 `AnnotatedFigure`
            (all Wikimedia), which renders the same plain `<img>`. Nothing on this
            origin resolved either name before, so the first figure a reader
            scrolled to paid a cold DNS lookup plus TCP plus TLS before a byte
            of image arrived — on a connection where the document, the CSS and
            the fonts had all been served from `self` already.

            `dns-prefetch`, not `preconnect`. Preconnect would open a TCP and
            TLS connection on all 823 routes, including the ~680 that load no
            external figure at all, to save a handshake on the 133 that do. A
            DNS hint is a resolver query the browser is free to drop, costs
            nothing on a route that never uses it, and covers the part of the
            delay that is pure latency. */}
        <link rel="dns-prefetch" href="https://upload.wikimedia.org" />
        <link rel="dns-prefetch" href="https://www.nist.gov" />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        {/* `ring-pillar`, not `ring-brand`: the site's one focus treatment is
            the pillar channel (globals.css `:focus-visible`, and
            INTERACTIVE_CLASSES in Navbar/Footer/Button), so a keyboard user in
            Hardware sees amber here as they do on every other control. This
            was the last element still ringing in `--brand`, which made the
            first focusable thing on every page the one that did not match.
            `focus:` rather than `focus-visible:` is deliberate and stays: this
            link is only ever reached by keyboard, and it must appear when it
            is. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-brand-foreground focus:outline-none focus:ring-2 focus:ring-pillar focus:ring-offset-2 focus:ring-offset-background"
        >
          Skip to content
        </a>
        {/* The drawer's "First lesson · N min" reassurance needs the real
            authored length of the lesson `START_LEARNING_HREF` opens, and
            `Navbar` is a Client Component — so the registry lookup happens
            here, on the server, and only the number crosses the boundary.
            `getLessonMeta` is a synchronous registry lookup (plain data, no
            MDX import), so this layout stays non-async. */}
        {/* `problemCount` travels the same way and for the same reason: the
            only derivation of it counts the generated problem-meta array,
            which no client bundle may reach, so the number crosses the
            boundary rather than the module that knows it. */}
        <Navbar
          startLessonMinutes={getLessonMeta(START_LEARNING_SLUG)?.estimatedMinutes}
          problemCount={PROBLEM_COUNT}
        />
        {/* `tabIndex={-1}` is what makes the skip link above actually skip.
            A fragment link to a non-focusable element only moves the scroll
            position and sets the sequential-focus starting point; browsers
            have never agreed on the latter, and where it is not honoured the
            next Tab goes back to the top of the document — so the reader
            lands in the content visually, presses Tab, and is returned to the
            navigation they just asked to skip. Making the target
            programmatically focusable moves real focus and is what every
            implementation of this pattern does. `-1` keeps it out of the Tab
            order itself, so nothing else changes.

            `focus:outline-none` here is the one place on this site that
            suppresses a focus indicator without substituting another, and it
            is deliberate: `<main>` is `flex-1` inside a column flexbox, so
            the sitewide 2px `:focus-visible` outline would trace the entire
            content region — the full width and height of the page — which
            reads as a rendering fault, not as "you are here". This element is
            a landmark, not an operable control, and it is not in the Tab
            order, so SC 2.4.7 Focus Visible does not apply to it; the visible
            confirmation the reader gets is the page moving to the content
            they asked for. Every actual control keeps its ring. */}
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer />
        {/* The persistent background environment. Sits behind everything at a
            negative z-index, renders nothing before hydration, and nothing at
            all under reduced motion or on a data-saver connection — the page
            never depends on it for color or legibility (see
            src/components/field/QuantumField.tsx).

            Rendered *last*, after the footer, even though it paints first.
            Both of its DOM nodes are `position: fixed`, so source order costs
            it nothing visually — but it also emits an `sr-only` paragraph
            describing what the animation depicts, and mounted above the
            Navbar that paragraph was the first thing a screen-reader user
            heard on every page of the site, ahead of the navigation: two
            sentences about wave packets before you can find out where you
            are. The description is worth having and worth having last. */}
        <QuantumField />
      </body>
    </html>
  );
}
