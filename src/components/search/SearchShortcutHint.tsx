"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

/**
 * The name of the key that opens the search overlay, on the platform the
 * reader is actually using.
 *
 * This was already solved once, inside `SearchTrigger`, with the reasoning
 * that matters written on it: "a Mac user who reads 'Ctrl K' concludes the
 * site has no shortcut for them, which is exactly the discoverability failure
 * the badge exists to prevent." The detection then stayed private to that
 * file, so every *other* place that names the shortcut printed a hardcoded
 * "Ctrl K", the glossary's zero-result state being the one that matters,
 * since it is offered to a reader who has just failed to find something and
 * is being told how to search properly. Telling that reader to press a key
 * their laptop does not have is worse than saying nothing.
 *
 * Read through `useSyncExternalStore` rather than an effect (the same
 * plumbing `ThemeToggle` and `SearchTrigger` use, for the same reason): the
 * server render and the pre-hydration client render both take
 * `getServerSnapshot`, so there is no hydration mismatch and no
 * setState-in-effect cascade. The platform never changes mid-session, so
 * `subscribe` has nothing to subscribe to.
 */
const NEVER_CHANGES = () => () => {};

function isApplePlatformSnapshot(): boolean {
  return /mac|iphone|ipad|ipod/i.test(navigator.userAgent);
}

/** Non-Apple is the majority case, so it's what renders before hydration. */
function isApplePlatformServerSnapshot(): boolean {
  return false;
}

/** `"⌘ K"` on Apple hardware, `"Ctrl K"` everywhere else. */
export function useSearchShortcutLabel(): string {
  const isApplePlatform = useSyncExternalStore(
    NEVER_CHANGES,
    isApplePlatformSnapshot,
    isApplePlatformServerSnapshot
  );
  return isApplePlatform ? "⌘ K" : "Ctrl K";
}

/**
 * The shortcut rendered as a `<kbd>` for use mid-sentence in prose.
 *
 * `<kbd>`, not a styled `<span>`: this is literally "the key to press", which
 * is the element's one job, and it is what a screen reader needs in order to
 * announce it as input rather than as a stray word in the paragraph.
 */
export function SearchShortcutHint({ className }: { className?: string }) {
  const label = useSearchShortcutLabel();
  return (
    <kbd
      className={cn(
        "tech-value rounded-(--radius-tight) border border-border bg-surface-muted px-1.5 py-0.5 text-xs text-foreground",
        className
      )}
    >
      {label}
    </kbd>
  );
}
