"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SearchTrigger } from "@/components/search/SearchTrigger";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { NAV_ITEMS, TRACK_NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Desktop-only dropdown grouping the four track/pillar pages. */
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
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className={cn(
          "flex items-center gap-1 rounded-full px-2.5 py-2 text-sm font-medium transition-colors",
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
        <div
          role="menu"
          className="absolute left-0 top-full z-50 mt-2 w-64 rounded-2xl border border-border bg-surface p-2 shadow-lg"
        >
          {TRACK_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className={cn(
                "block rounded-xl px-3 py-2 text-sm transition-colors",
                isActive(pathname, item.href)
                  ? "bg-surface-muted text-foreground"
                  : "text-foreground hover:bg-surface-muted"
              )}
            >
              <span className="font-medium">{item.label}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{item.description}</span>
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
        "rounded-full px-2.5 py-2 text-sm font-medium transition-colors",
        isActive(pathname, item.href)
          ? "bg-surface-muted text-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {item.label}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-semibold tracking-tight text-foreground"
          onClick={() => setIsMenuOpen(false)}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-brand-foreground">
            Q
          </span>
          QuantumLearn
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV_ITEMS.slice(0, 2).map((item) => (
            <DesktopNavLink key={item.href} item={item} pathname={pathname} />
          ))}
          <TracksDropdown pathname={pathname} />
          {NAV_ITEMS.slice(2).map((item) => (
            <DesktopNavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button href="/learn" size="sm">
            Start learning
          </Button>
        </div>

        <ThemeToggle className="ml-2" />

        <SearchTrigger className="ml-2" />

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-surface-muted lg:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
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
      </Container>

      {isMenuOpen ? (
        <div className="border-t border-border lg:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {NAV_ITEMS.slice(0, 2).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive(pathname, item.href)
                    ? "bg-surface-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}

            <p className="mt-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tracks</p>
            {TRACK_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive(pathname, item.href)
                    ? "bg-surface-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}

            {NAV_ITEMS.slice(2).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive(pathname, item.href)
                    ? "bg-surface-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Button href="/learn" size="sm" className="mt-2 w-full" onClick={() => setIsMenuOpen(false)}>
              Start learning
            </Button>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
