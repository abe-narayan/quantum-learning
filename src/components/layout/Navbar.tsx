"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Pillar } from "@/lib/content/types";
import { PILLAR_VISUALS } from "@/lib/design/pillars";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { IconButton, TOUCH_TARGET_CLASSES } from "@/components/ui/IconButton";
import { SearchTrigger } from "@/components/search/SearchTrigger";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Wordmark } from "@/components/layout/Wordmark";
import { ROUTE_TO_PILLAR, detectPillar, isProblemPage } from "@/components/layout/pillarRoutes";
import { useFieldState } from "@/components/field/fieldStore";
import { NAV_ITEMS, START_LEARNING_HREF, TRACK_NAV_ITEMS, navDescription } from "@/lib/nav";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * `aria-current` for a nav link, or `undefined` when it isn't the current
 * one. `"page"` only for an exact match; a section root while you're on a
 * page nested under it gets `"true"` ("the current item in this set")
 * instead, because claiming to *be* the page you're on when you aren't is a
 * lie a screen reader repeats on every focus.
 */
function navCurrent(pathname: string, href: string): "page" | "true" | undefined {
  if (!isActive(pathname, href)) return undefined;
  return pathname === href ? "page" : "true";
}

/**
 * The visible half of "where am I".
 *
 * `aria-current` alone satisfies the audit and nothing else: a sighted
 * first-time visitor got only a slightly lighter background on the active
 * link, which reads as hover, not as location. This adds a 2px rule under
 * the active item, sitting exactly on the header's own bottom border
 * (`-bottom-[14px]` = half the 64px header row minus half the ~36px link
 * box), so the current section reads as a lit tab on an instrument face.
 */
const ACTIVE_MARK_CLASSES =
  "relative after:absolute after:inset-x-2.5 after:-bottom-[14px] after:h-[2px] after:bg-brand after:content-['']";

// The one hover/focus/active convention every interactive element in this
// file converges on: the same transition list + pressed-state scale used by
// Button.tsx, and the same pillar focus ring (`ring-2 ring-pillar
// ring-offset-2 ring-offset-background`) used by Button.tsx, Footer.tsx and
// the skip-link in src/app/layout.tsx — kept identical everywhere rather
// than reinvented per element. (This note used to say the skip-link ringed
// in `--brand`; it did, alone, and now matches the rest.)
const INTERACTIVE_CLASSES =
  "transition-[color,background-color,border-color,transform] active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** A small pillar-tinted dot, used next to track links so the color-as-identity
 *  channel (globals.css §2) shows up even in compact chrome, not just on the
 *  pillar's own landing page. `data-pillar` re-resolves `--pillar-*` for just
 *  this element, independent of whatever pillar (if any) the current page is
 *  scoped to. */
function PillarDot({ pillar, className }: { pillar?: Pillar; className?: string }) {
  if (!pillar) return null;
  return (
    <span
      data-pillar={pillar}
      aria-hidden="true"
      className={cn("inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-pillar", className)}
    />
  );
}

/**
 * The "where am I" readout in the chrome.
 *
 * Two cases, because the old version only handled one and left every
 * non-pillar page (/glossary, /problems, /simulators, /map, /about — a large
 * share of the site) with no location readout at all between `sm` and `lg`,
 * which is exactly the width range where the nav bar itself is hidden behind
 * the hamburger:
 *
 *  - Inside a pillar: its short name, tinted with its own identity color
 *    regardless of the page's own pillar scope. Route-level only (a pillar's
 *    landing page and everything under it, including its `/lessons/<pillar>/…`
 *    pages) — see the long comment on `detectPillar` in ./pillarRoutes for why
 *    finer-grained detection isn't done client-side.
 *  - Otherwise: the top-level section the pathname falls in, in neutral ink
 *    (no pillar identity to borrow, and inventing one would be a lie).
 *
 * The homepage matches neither and renders nothing — the wordmark next to it
 * already says where you are.
 */
function SectionIndicator({
  pillar,
  label,
  className,
}: {
  pillar?: Pillar;
  label: string;
  className?: string;
}) {
  return (
    <span
      data-pillar={pillar}
      className={cn(
        // `.tech-label`, not the same declarations spelled out: the class sets
        // exactly `font-tech`, `--text-meta` (0.6875rem), `--tracking-meta`
        // (0.14em), uppercase and weight 500. `text-pillar-text` /
        // `text-muted-foreground` below still win the colour, because
        // utilities sit in a later cascade layer than `@layer components`.
        "tech-label items-center gap-2 border-l border-border pl-3",
        pillar ? "text-pillar-text" : "text-muted-foreground",
        className
      )}
    >
      <PillarDot pillar={pillar} />
      <span className="sr-only">Current section: </span>
      {label}
    </span>
  );
}

/** The label `SectionIndicator` shows: pillar short name if the route is in a
 *  pillar, else the matching top-level nav item, else nothing (homepage). */
function sectionLabel(pathname: string, pillar: Pillar | undefined): string | undefined {
  if (pillar) return PILLAR_VISUALS[pillar].short;
  return NAV_ITEMS.find((item) => isActive(pathname, item.href))?.label;
}

/** Desktop-only dropdown grouping the six track/pillar pages. */
function TracksDropdown({ pathname }: { pathname: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isTrackActive = TRACK_NAV_ITEMS.some((item) => isActive(pathname, item.href));

  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        // Focus was likely on a menuitem link inside the panel that's about
        // to unmount — without this, closing via Escape drops focus to
        // <body>, which is a keyboard trap-adjacent dead end.
        if (containerRef.current?.contains(document.activeElement)) {
          buttonRef.current?.focus();
        }
        setIsOpen(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onBlur={(event) => {
        // A WAI-ARIA disclosure pattern must close when focus leaves it, not
        // just on Escape/click-outside — otherwise Tab-ing past this button
        // leaves the panel floating open indefinitely with nothing visibly
        // wrong to a keyboard user (a real bug found by review, not
        // hypothetical). `relatedTarget` is the element receiving focus;
        // only close if it's genuinely leaving this container.
        if (!containerRef.current?.contains(event.relatedTarget as Node | null)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        // Only while open: the panel is unmounted when closed, and an
        // `aria-controls` IDREF that resolves to nothing is invalid — some
        // screen readers announce "controls, invalid" or drop the
        // relationship entirely. This matches how `SearchTrigger` handles the
        // same situation. `aria-expanded` alone is what carries the state
        // while the panel does not exist.
        aria-controls={isOpen ? "tracks-dropdown-panel" : undefined}
        // The other half of "where am I", which this trigger was missing. When
        // the reader is on one of the six track pages this button carries the
        // lit-tab underline every other current nav item gets, but the panel
        // holding the `aria-current="page"` link is unmounted, so a screen
        // reader user tabbing the bar had no equivalent of that underline at
        // all. `aria-current` is a global attribute and `"true"` is the right
        // value here: this is the current *item in the set*, not the page.
        aria-current={isTrackActive ? "true" : undefined}
        onClick={() => setIsOpen((open) => !open)}
        className={cn(
          "flex items-center gap-1 rounded-(--radius-tight) px-2.5 py-2 text-sm font-medium",
          INTERACTIVE_CLASSES,
          isTrackActive || isOpen
            ? "bg-surface-muted text-foreground"
            : "text-muted-foreground hover:text-foreground",
          // Only the *active* case gets the underline — an open-but-not-current
          // dropdown is a hover state, not a location.
          isTrackActive && ACTIVE_MARK_CLASSES
        )}
      >
        Tracks
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-180")}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m5 7.5 5 5 5-5" />
        </svg>
      </button>

      {isOpen ? (
        // Plain nav links, not `role="menu"`/`"menuitem"` — those roles
        // commit to the ARIA APG "menu" widget contract (arrow-key
        // navigation between items, Tab closing the menu entirely), which
        // this disclosure doesn't implement: it relies on ordinary Tab
        // order through real links, closing on Escape/outside-click/blur
        // instead. Announcing "menu" while behaving like a link list is
        // its own bug — a screen-reader user who tries the arrow keys a
        // real menu promises gets nothing.
        //
        // Two columns (rather than one long list) once there are six pillar
        // entries: it keeps the panel roughly square instead of a scroll-y
        // column, and reads as an instrument grid of six gauges rather than
        // a menu. Tab order still follows source order (row-major), which
        // matches how the grid reads visually.
        <div
          id="tracks-dropdown-panel"
          className="absolute left-0 top-full z-50 mt-2 grid w-[19rem] grid-cols-1 gap-1 rounded-panel border border-border bg-surface p-2 shadow-lg sm:w-[27rem] sm:grid-cols-2"
        >
          {TRACK_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              aria-current={navCurrent(pathname, item.href)}
              // Scopes `--pillar-*` to this track so the active entry's edge
              // is tinted with *its own* identity color rather than whatever
              // pillar the page behind the dropdown happens to be scoped to.
              data-pillar={ROUTE_TO_PILLAR[item.href]}
              className={cn(
                "flex flex-col gap-1 rounded-(--radius-tight) border border-transparent px-3 py-2.5 text-sm",
                INTERACTIVE_CLASSES,
                isActive(pathname, item.href)
                  ? "border-pillar-edge bg-surface-muted text-foreground"
                  : "text-foreground hover:border-border hover:bg-surface-muted"
              )}
            >
              <span className="flex items-center gap-2 font-medium">
                <PillarDot pillar={ROUTE_TO_PILLAR[item.href]} />
                {item.label}
              </span>
              <span className="text-xs leading-snug text-muted-foreground">{item.description}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function DesktopNavLink({
  item,
  pathname,
  problemCount,
}: {
  item: (typeof NAV_ITEMS)[number];
  pathname: string;
  problemCount: number;
}) {
  const current = navCurrent(pathname, item.href);
  return (
    <Link
      href={item.href}
      aria-current={current}
      // `navDescription`, not `item.description`: the "Problems" copy carries
      // a `{problems}` token that only the server-supplied count can fill.
      title={navDescription(item, problemCount)}
      className={cn(
        "rounded-(--radius-tight) px-2.5 py-2 text-sm font-medium",
        INTERACTIVE_CLASSES,
        current ? `bg-surface-muted text-foreground ${ACTIVE_MARK_CLASSES}` : "text-muted-foreground hover:text-foreground"
      )}
    >
      {item.label}
    </Link>
  );
}

function MobileNavLink({ item, pathname, onNavigate }: { item: (typeof NAV_ITEMS)[number]; pathname: string; onNavigate: () => void }) {
  const current = navCurrent(pathname, item.href);
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={current}
      className={cn(
        // The drawer has no header border to hang the desktop underline
        // from, so the current item is marked with a left rule instead —
        // the same "lit edge" idea rotated 90°, and legible in a vertical
        // list in a way a background tint alone was not.
        //
        // `min-h-11`: `px-3 py-2` around a 14px line box is 36px, and these
        // eight rows *are* the site's navigation on a phone — the only route
        // to it at every width below `lg`. 36px clears WCAG 2.5.8's 24px floor
        // and misses the 44px this codebase holds every other control to
        // (`IconButton`, `FilterChips`, `PillarLessonStrip`'s rows), which is
        // the wrong place to be a rounding error. `gap-1` (4px) between rows
        // means the expanded boxes still do not touch.
        "flex min-h-11 items-center rounded-(--radius-tight) px-3 py-2 text-sm font-medium",
        INTERACTIVE_CLASSES,
        current
          ? "border-l-2 border-brand bg-surface-muted pl-2.5 text-foreground"
          : "border-l-2 border-transparent pl-2.5 text-muted-foreground hover:bg-surface-muted hover:text-foreground"
      )}
    >
      {item.label}
    </Link>
  );
}

export function Navbar({
  startLessonMinutes,
  problemCount,
}: {
  /**
   * Authored length, in minutes, of the lesson `START_LEARNING_HREF` opens —
   * resolved by the server component that renders this (`app/layout.tsx`) and
   * passed in, because this is a Client Component and the lesson registry
   * must never cross that boundary (docs/DESIGN_SYSTEM.md §10). The drawer's
   * "First lesson · N min" line used to state a hardcoded 20 against a lesson
   * authored at 30; `estimatedMinutes` is recalibrated corpus-wide, so the
   * number has to come from the data or it drifts again. Optional so the
   * line degrades to "First lesson · no prerequisites" rather than
   * to a wrong figure if the slug ever stops resolving.
   */
  startLessonMinutes?: number;
  /**
   * Size of the problem corpus, for the "Problems" item's description (the
   * desktop tooltip and the drawer's copy). Same contract as
   * `startLessonMinutes` and for the same reason: the only derivation of this
   * figure is `PROBLEM_COUNT` in `lib/structuredData.ts`, which counts the
   * generated problem-meta array — a module no client bundle may reach. See
   * `navDescription` in `lib/nav.ts`.
   */
  problemCount: number;
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const routePillar = detectPillar(pathname);
  /**
   * The pillar the *page* declared, for the one route shape whose pathname
   * cannot name it: `/problems/<slug>`. `ProblemLayout` resolves it on the
   * server and `<PillarScope>` publishes it to the field store, so this is a
   * subscription to a value the page already produced, not a second lookup —
   * and it replaces the 556-row slug->pillar table that used to be shipped to
   * every route to answer the same question. See ./pillarRoutes.ts.
   *
   * `FieldRegimeSetter` publishes from an effect, so this is `null` in the
   * server-rendered HTML and arrives on hydration. That is why it tints the
   * readout but does not *name* it: `section` below stays route-derived, so
   * the label ("Problems") is correct in the first painted frame and never
   * changes. What arrives late is the colour and the 6px dot beside it.
   */
  const scopePillar = useFieldState().pillar ?? undefined;
  const pillar = routePillar ?? (isProblemPage(pathname) ? scopePillar : undefined);
  const section = sectionLabel(pathname, routePillar);

  // Same disclosure contract `TracksDropdown` implements above (§9 of
  // docs/DESIGN_SYSTEM.md names it as the standard to match): Escape closes
  // and hands focus back to the trigger, and a pointerdown outside closes.
  //
  // Two deliberate differences from `TracksDropdown`, both forced by this
  // panel's shape:
  //
  // 1. No `onBlur` close. `TracksDropdown` can use one because its trigger
  //    and panel share a single container element. Here they don't — the
  //    trigger lives in the header row, the panel is a sibling below the
  //    `Container` — so the equivalent would have to sit on `<header>` and
  //    would fire with a null `relatedTarget` whenever the user taps a
  //    non-focusable part of this tall, scrollable panel, closing the menu
  //    out from under them. Outside-pointerdown already covers the case
  //    blur exists to catch.
  // 2. No focus move on open, and no focus trap. This panel is in normal
  //    flow and pushes the page down rather than covering it, so it isn't a
  //    modal; and it renders immediately after the trigger in DOM order, so
  //    Tab from the trigger already walks straight into it. Moving focus
  //    would only fight the natural order.
  //
  // Both listeners are attached only while the menu is open, and the whole
  // effect is skipped otherwise — same shape as `TracksDropdown`'s.
  useEffect(() => {
    if (!isMenuOpen) return;
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      // The trigger has to be excluded explicitly, unlike in
      // `TracksDropdown` where its shared container covered it: without
      // this, tapping the (open) menu button would close the panel here and
      // then have its own `onClick` toggle it straight back open.
      if (menuPanelRef.current?.contains(target) || menuButtonRef.current?.contains(target)) return;
      setIsMenuOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      // Focus is likely on a link inside the panel that's about to unmount;
      // without this, Escape drops focus to <body> and a keyboard user
      // restarts the tab order from the top of the document.
      if (menuPanelRef.current?.contains(document.activeElement)) {
        menuButtonRef.current?.focus();
      }
      setIsMenuOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    // Solid `bg-surface`, no backdrop-blur: the design system explicitly
    // rejects glassmorphism stacks, and this bar sits above the persistent
    // animated canvas field (src/components/field/QuantumField.tsx) that
    // repaints on every scroll frame — a blur here would mean the compositor
    // re-blurring that canvas on every one of those frames, on every page,
    // for a translucency effect the design language doesn't want anyway. An
    // opaque instrument-panel fill reads as "mounted equipment" instead and
    // costs nothing.
    <header className="sticky top-0 z-50 border-b border-border bg-surface">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            // `TOUCH_TARGET_CLASSES`: below 400px the word is `sr-only` and
            // this link is the 32x32 mark alone, which is the smallest tap
            // target in the chrome and sits at the very edge of the screen,
            // where a thumb is least accurate. Measured at 32x32 by
            // `scripts/audit/responsive.mjs` at both 320 and 375px. The
            // shared idiom gives it the same `max(44px, own size)` hit area
            // the three icon buttons on the other end of the row already
            // carry, without growing the painted mark — which must stay 32px,
            // because the row's whole width budget is accounted for down to
            // the pixel in the comment below.
            className={cn("flex items-center rounded-(--radius-tight)", TOUCH_TARGET_CLASSES, INTERACTIVE_CLASSES)}
            onClick={() => setIsMenuOpen(false)}
          >
            {/* The word is dropped below 400px, and the arithmetic is why.
                Nothing in this row can shrink: the three icon controls carry
                `shrink-0`, the Start button's padding and five-character label
                are fixed, and "StudyQuantum" is one unbreakable word, so the
                row's minimum width is the sum of its parts and the flex
                container can only overflow.

                Measured at 16px semibold: mark 32 + gap 10 + word ~104 = 146
                on the left; Start (24px padding + ~32px label + 2px border)
                ~58, three 40px controls, and three 6px gaps = ~196 on the
                right; plus the `gap-4` between them = ~358px of content.
                `Container` leaves 288px at 320px wide and 343px at 375px, so
                the row overflowed by ~70px on an iPhone SE and ~15px on every
                375px phone — and because `html, body { overflow-x: clip }`
                absorbs it (globals.css), there was no scrollbar and no
                symptom except the menu button being sliced off the right
                edge. The hamburger is the only route to the navigation at
                these widths, so the failure took the whole site's navigation
                with it.

                400px (`max-[25rem]`) is where the full row stops fitting
                (358 + 32px of padding = 390), rounded up to the next clean
                value. Above it nothing changes. The mark stays at every
                width and keeps its link to the homepage, and the `<Link>`
                has no other content, so its accessible name comes from the
                word when it renders and from the mark's own alt-free
                `aria-hidden` span when it doesn't — hence `sr-only` rather
                than `hidden`, which would leave this link nameless. */}
            <Wordmark labelClassName="max-[25rem]:sr-only" />
          </Link>
          {/* `sm:inline-flex lg:hidden`, not `sm:inline-flex`. This readout
              exists for the band where the nav links are folded into the
              hamburger and nothing else on screen says where you are. At `lg`
              and up every section is listed in the bar *and* the current one
              carries a visible rule, so this is redundant — and worse than
              redundant in practice: it shares a `min-w-0` flex row with the
              wordmark, so at desktop widths it was compressed to a 25px
              sliver rendering as a truncated "LE…". A broken-looking fragment
              of a word beside the logo reads as a rendering bug, which is a
              poor thing for the first element on every page to look like. */}
          {section ? (
            <SectionIndicator
              pillar={pillar}
              label={section}
              className="hidden truncate sm:inline-flex lg:hidden"
            />
          ) : null}
        </div>

        <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
          {NAV_ITEMS.slice(0, 1).map((item) => (
            <DesktopNavLink key={item.href} item={item} pathname={pathname} problemCount={problemCount} />
          ))}
          <TracksDropdown pathname={pathname} />
          {NAV_ITEMS.slice(1).map((item) => (
            <DesktopNavLink key={item.href} item={item} pathname={pathname} problemCount={problemCount} />
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          {/* Goes to the on-ramp lesson, not to /learn — see the comment on
              START_LEARNING_HREF in src/lib/nav.ts. This button's job is to
              make that lesson reachable in one click from every page — at
              *every* width, not just desktop: hiding it below `lg` left
              phones with no visible way to start except a link buried at the
              bottom of the hamburger drawer. The header row is tight there
              (wordmark + three icon buttons), so the label shortens to
              "Start" rather than the button disappearing. */}
          <Button
            href={START_LEARNING_HREF}
            size="sm"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="lg:hidden">Start</span>
            <span className="hidden lg:inline">Start learning</span>
          </Button>

          <ThemeToggle />

          <SearchTrigger />

          {/* `IconButton` carries the shared 44px hit area on a transparent
              `::after` while the painted face stays 40px, so this button
              still lines up with the theme toggle and search trigger beside
              it — see TOUCH_TARGET_CLASSES in src/components/ui/IconButton.tsx. */}
          <IconButton
            ref={menuButtonRef}
            className={cn("text-foreground hover:bg-surface-muted lg:hidden", INTERACTIVE_CLASSES)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            // Same as TracksDropdown above: the drawer is unmounted when
            // closed, so the IDREF is only pointed at a real element.
            aria-controls={isMenuOpen ? "mobile-menu-panel" : undefined}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              className="h-5 w-5"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              )}
            </svg>
          </IconButton>
        </div>
      </Container>

      {isMenuOpen ? (
        <div ref={menuPanelRef} id="mobile-menu-panel" className="border-t border-border lg:hidden">
          {/* max-h + overflow: the combined Tracks (6) + Explore (7) lists
              can exceed the viewport on a short phone in landscape; without
              this the panel would push page content down instead of
              scrolling internally, and the fixed-position search/theme
              controls above it would be unreachable. */}
          <Container className="max-h-[calc(100vh-4rem)] overflow-y-auto py-5">
            <nav aria-label="Site" className="flex flex-col gap-6">
              {section ? (
                <div
                  data-pillar={pillar}
                  className={cn(
                    "flex items-center gap-2 rounded-(--radius-tight) border px-3 py-2",
                    pillar ? "border-pillar-edge bg-pillar-wash" : "border-border bg-surface-muted"
                  )}
                >
                  <PillarDot pillar={pillar} />
                  <p
                    className={cn(
                      "tech-label",
                      pillar ? "text-pillar-text" : "text-muted-foreground"
                    )}
                  >
                    You&rsquo;re in {section}
                  </p>
                </div>
              ) : null}

              {/* Start sits at the *top* of the drawer, not the bottom: a
                  first-time visitor who opens the menu looking for a way in
                  should not have to scroll past thirteen links to find the
                  one primary action. It duplicates the header-row Start
                  button deliberately — inside the open drawer, the header
                  row reads as chrome, not as part of the menu — and carries
                  the same one-line reassurance the hero gives it. */}
              <div className="flex flex-col gap-1.5">
                <Button
                  href={START_LEARNING_HREF}
                  size="sm"
                  className="w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Start learning
                </Button>
                {/* `tracking-[0.12em]` here was a 0.3px difference from the
                    0.14em everywhere else at this size, which is exactly the
                    unusable distinction the tracking tokens collapsed. */}
                <p className="tech-label text-center text-subtle-foreground">
                  First lesson{startLessonMinutes ? ` · ${startLessonMinutes} min` : ""} · no
                  prerequisites
                </p>
              </div>

              <div className="flex flex-col gap-1">
                {NAV_ITEMS.slice(0, 1).map((item) => (
                  <MobileNavLink key={item.href} item={item} pathname={pathname} onNavigate={() => setIsMenuOpen(false)} />
                ))}
              </div>

              {/* The six tracks are listed flat and in full here — never
                  behind a second disclosure inside this one. The desktop bar
                  can afford to collapse them into a dropdown because the bar
                  itself is always visible; in the drawer that would mean a
                  visitor had to open a menu, then open a menu inside it,
                  before learning that the site has six subjects at all. Each
                  entry carries its one-line description for the same reason
                  the desktop dropdown does: "Mechanics" and "Mastery" are not
                  self-explanatory to someone on their first visit. */}
              <div>
                <p className="tech-label mb-2 px-3 text-subtle-foreground">
                  Tracks
                </p>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {TRACK_NAV_ITEMS.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        aria-current={navCurrent(pathname, item.href)}
                        data-pillar={ROUTE_TO_PILLAR[item.href]}
                        className={cn(
                          "flex h-full flex-col gap-1 rounded-(--radius-tight) border px-3 py-2.5 text-sm font-medium",
                          INTERACTIVE_CLASSES,
                          isActive(pathname, item.href)
                            ? "border-pillar-edge bg-surface-muted text-foreground"
                            : "border-border text-foreground hover:bg-surface-muted"
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <PillarDot pillar={ROUTE_TO_PILLAR[item.href]} />
                          {item.label}
                        </span>
                        <span className="text-xs font-normal leading-snug text-muted-foreground">
                          {item.description}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="tech-label mb-2 px-3 text-subtle-foreground">
                  Explore
                </p>
                <div className="flex flex-col gap-1">
                  {NAV_ITEMS.slice(1).map((item) => (
                    <MobileNavLink key={item.href} item={item} pathname={pathname} onNavigate={() => setIsMenuOpen(false)} />
                  ))}
                </div>
              </div>
            </nav>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
