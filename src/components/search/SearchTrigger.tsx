"use client";

import { useEffect, useRef, useState } from "react";
import { SearchOverlay } from "./SearchOverlay";
import { useSearchShortcutLabel } from "./SearchShortcutHint";
import { TOUCH_TARGET_CLASSES } from "@/components/ui/IconButton";
import { SEARCH_DIALOG_ID } from "@/lib/search/ids";
import { cn } from "@/lib/utils";

/**
 * The shortcut is Cmd+K on macOS and Ctrl+K everywhere else, and the badge in
 * the trigger has to say which one, a Mac user who reads "Ctrl K" concludes
 * the site has no shortcut for them, which is exactly the discoverability
 * failure the badge exists to prevent.
 *
 * The detection itself moved to ./SearchShortcutHint so the prose that *also*
 * names this shortcut (the glossary's zero-result state) resolves it the same
 * way instead of hardcoding one platform's answer.
 */
export function SearchTrigger({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const shortcutLabel = useSearchShortcutLabel();
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Ctrl+K / Cmd+K opens search from anywhere on the page. No existing
  // keyboard-shortcut pattern elsewhere in this codebase to follow, so this
  // is a plain document-level keydown listener.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const modifierPressed = event.metaKey || event.ctrlKey;
      if (modifierPressed && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        // `aria-controls` may only name an id that is actually in the
        // document, and the dialog only exists while open, so this is
        // conditional rather than always-on. Closes the last open item from
        // docs/A11Y_AUDIT.md for this control.
        aria-controls={open ? SEARCH_DIALOG_ID : undefined}
        aria-keyshortcuts="Control+K Meta+K"
        // Below `sm` the word "Search" is hidden and only the magnifier
        // shows, which would leave the button with no accessible name at
        // all. The label contains the visible text verbatim, so WCAG 2.5.3
        // (Label in Name) still holds where the text does render.
        aria-label="Search"
        title={`Search (${shortcutLabel})`}
        className={cn(
          // Painted face stays 40px tall to share the header row's baseline
          // with the theme toggle and menu button; TOUCH_TARGET_CLASSES adds
          // the WCAG 2.5.5 44px hit area on a transparent `::after` without
          // growing the visible control. See IconButton.tsx for the full
          // reasoning, this is the site's chrome standard, not an exception.
          "inline-flex h-10 items-center gap-2 rounded-(--radius-tight) border border-border bg-surface px-3 text-sm text-muted-foreground transition-[color,border-color] duration-(--dur-fast) ease-instrument hover:border-border-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          TOUCH_TARGET_CLASSES,
          className
        )}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          className="h-4 w-4 shrink-0"
        >
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="m20 20-3.5-3.5" />
        </svg>
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded-[calc(var(--radius-tight)-2px)] border border-border bg-surface-muted px-1.5 py-0.5 font-tech text-micro font-medium text-muted-foreground sm:inline">
          {shortcutLabel}
        </kbd>
      </button>
      {open ? <SearchOverlay onClose={() => setOpen(false)} triggerRef={triggerRef} /> : null}
    </>
  );
}
