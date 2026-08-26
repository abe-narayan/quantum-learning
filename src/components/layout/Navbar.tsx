"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Pillar } from "@/lib/content/types";
import { PILLAR_VISUALS } from "@/lib/design/pillars";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SearchTrigger } from "@/components/search/SearchTrigger";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Wordmark } from "@/components/layout/Wordmark";
import { ROUTE_TO_PILLAR, detectPillar } from "@/components/layout/pillarRoutes";
import { NAV_ITEMS, TRACK_NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

// The one hover/focus/active convention every interactive element in this
// file converges on: the same transition list + pressed-state scale used by
// Button.tsx, and the same focus ring used by the skip-link in
// src/app/layout.tsx (focus-visible:ring-2 ring-brand ring-offset-2
// ring-offset-background) — kept identical everywhere rather than
// reinvented per element.
const INTERACTIVE_CLASSES =
  "transition-[color,background-color,border-color,transform] active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background";

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

/** The "where am I" readout in the chrome: the current pillar's short name,
 *  tinted with its own identity color regardless of the page's own pillar
 *  scope (or lack of one — the homepage, /learn, /glossary etc. carry no
 *  pillar, and this simply doesn't render). Route-level only (a pillar's
 *  landing page and everything under it, including its `/lessons/<pillar>/…`
 *  pages) — see the long comment on `detectPillar` in ./pillarRoutes for why
 *  finer-grained detection (e.g. a problem's pillar) isn't done client-side. */
function PillarIndicator({ pillar, className }: { pillar: Pillar; className?: string }) {
  const visual = PILLAR_VISUALS[pillar];
  return (
    <span
      data-pillar={pillar}
      className={cn(
        "items-center gap-2 border-l border-border pl-3 font-tech text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-pillar-text",
        className
      )}
    >
      <PillarDot pillar={pillar} />
      {visual.short}
    </span>
  );
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
        aria-controls="tracks-dropdown-panel"
        onClick={() => setIsOpen((open) => !open)}
        className={cn(
          "flex items-center gap-1 rounded-[var(--radius-tight)] px-2.5 py-2 text-sm font-medium",
          INTERACTIVE_CLASSES,
          isTrackActive || isOpen
            ? "bg-surface-muted text-foreground"
            : "text-muted-foreground hover:text-foreground"
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
          className="absolute left-0 top-full z-50 mt-2 grid w-[19rem] grid-cols-1 gap-1 rounded-[var(--radius-panel)] border border-border bg-surface p-2 shadow-lg sm:w-[27rem] sm:grid-cols-2"
        >
          {TRACK_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex flex-col gap-1 rounded-[var(--radius-tight)] border border-transparent px-3 py-2.5 text-sm",
                INTERACTIVE_CLASSES,
                isActive(pathname, item.href)
                  ? "border-border bg-surface-muted text-foreground"
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

function DesktopNavLink({ item, pathname }: { item: (typeof NAV_ITEMS)[number]; pathname: string }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "rounded-[var(--radius-tight)] px-2.5 py-2 text-sm font-medium",
        INTERACTIVE_CLASSES,
        isActive(pathname, item.href)
          ? "bg-surface-muted text-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {item.label}
    </Link>
  );
}

function MobileNavLink({ item, pathname, onNavigate }: { item: (typeof NAV_ITEMS)[number]; pathname: string; onNavigate: () => void }) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "rounded-[var(--radius-tight)] px-3 py-2 text-sm font-medium",
        INTERACTIVE_CLASSES,
        isActive(pathname, item.href)
          ? "bg-surface-muted text-foreground"
          : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
      )}
    >
      {item.label}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pillar = detectPillar(pathname);

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
            className={cn("flex items-center rounded-[var(--radius-tight)]", INTERACTIVE_CLASSES)}
            onClick={() => setIsMenuOpen(false)}
          >
            <Wordmark />
          </Link>
          {pillar ? <PillarIndicator pillar={pillar} className="hidden sm:inline-flex" /> : null}
        </div>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV_ITEMS.slice(0, 1).map((item) => (
            <DesktopNavLink key={item.href} item={item} pathname={pathname} />
          ))}
          <TracksDropdown pathname={pathname} />
          {NAV_ITEMS.slice(1).map((item) => (
            <DesktopNavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <div className="hidden lg:block">
            <Button href="/learn" size="sm">
              Start learning
            </Button>
          </div>

          <ThemeToggle />

          <SearchTrigger />

          <button
            type="button"
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-tight)] text-foreground hover:bg-surface-muted lg:hidden",
              INTERACTIVE_CLASSES
            )}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu-panel"
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
          </button>
        </div>
      </Container>

      {isMenuOpen ? (
        <div id="mobile-menu-panel" className="border-t border-border lg:hidden">
          {/* max-h + overflow: the combined Tracks (6) + Explore (7) lists
              can exceed the viewport on a short phone in landscape; without
              this the panel would push page content down instead of
              scrolling internally, and the fixed-position search/theme
              controls above it would be unreachable. */}
          <Container className="flex max-h-[calc(100vh-4rem)] flex-col gap-6 overflow-y-auto py-5">
            {pillar ? (
              <div
                data-pillar={pillar}
                className="flex items-center gap-2 rounded-[var(--radius-tight)] border border-pillar-edge bg-pillar-wash px-3 py-2"
              >
                <PillarDot pillar={pillar} />
                <p className="font-tech text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-pillar-text">
                  You&rsquo;re in {PILLAR_VISUALS[pillar].short}
                </p>
              </div>
            ) : null}

            <div className="flex flex-col gap-1">
              {NAV_ITEMS.slice(0, 1).map((item) => (
                <MobileNavLink key={item.href} item={item} pathname={pathname} onNavigate={() => setIsMenuOpen(false)} />
              ))}
            </div>

            <div>
              <p className="mb-2 px-3 font-tech text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-subtle-foreground">
                Tracks
              </p>
              <div className="grid grid-cols-2 gap-2">
                {TRACK_NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex flex-col gap-1 rounded-[var(--radius-tight)] border px-3 py-2.5 text-sm font-medium",
                      INTERACTIVE_CLASSES,
                      isActive(pathname, item.href)
                        ? "border-border-strong bg-surface-muted text-foreground"
                        : "border-border text-foreground hover:bg-surface-muted"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <PillarDot pillar={ROUTE_TO_PILLAR[item.href]} />
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 px-3 font-tech text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-subtle-foreground">
                Explore
              </p>
              <div className="flex flex-col gap-1">
                {NAV_ITEMS.slice(1).map((item) => (
                  <MobileNavLink key={item.href} item={item} pathname={pathname} onNavigate={() => setIsMenuOpen(false)} />
                ))}
              </div>
            </div>

            <Button href="/learn" size="sm" className="w-full" onClick={() => setIsMenuOpen(false)}>
              Start learning
            </Button>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
