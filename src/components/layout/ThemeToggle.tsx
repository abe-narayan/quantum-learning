"use client";

import { useLayoutEffect, useSyncExternalStore, type ReactElement } from "react";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

/** Matches the `quantumlearn:lesson-progress:` prefix convention used by
 * src/lib/content/progress/localStorageStore.ts. "system" is represented by
 * the *absence* of a stored value, not an explicit "system" string — see
 * `applyTheme` below. */
const STORAGE_KEY = "quantumlearn:theme";

const THEME_CYCLE: readonly Theme[] = ["light", "dark", "system"];

const THEME_LABEL: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

// Store plumbing mirrors src/lib/content/progress/useLessonProgress.ts: a
// module-level listener set notified on write, read through
// `useSyncExternalStore` so the pre-hydration client render matches the
// server (both fall back to `getServerSnapshot`) with no
// setState-in-effect needed to reconcile them.
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Theme {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") return stored;
  } catch {
    // Storage unavailable (private browsing, quota, etc.) — fall back to the
    // site default for this session.
  }
  // Dark, not "system". The absence of a stored choice is not a preference
  // for the OS setting, it is the absence of a choice — and the site's answer
  // to that is its own identity. See the theme note at the top of
  // globals.css: a first-time visitor on a light-default OS used to get a
  // white page, which the dark-first palette exists to prevent. "System" is
  // now something a reader picks, not something they fall into.
  return "dark";
}

/** Matches the `<html>` server render in src/app/layout.tsx, which carries no
 * `data-theme` attribute until the inline no-flash script or this component
 * sets one — and the unattributed default is dark. */
function getServerSnapshot(): Theme {
  return "dark";
}

/** Mirrors the inline no-flash script in src/app/layout.tsx: all three states
 * write an explicit `data-theme`, including "system", which globals.css pairs
 * with a `prefers-color-scheme: light` query. Clearing the attribute would
 * now mean *dark*, not "follow the OS", so "system" can no longer be encoded
 * as its absence. */
function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

function SunIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-4.5 w-4.5">
      <circle cx="12" cy="12" r="4.25" />
      <path
        strokeLinecap="round"
        d="M12 2.75v2M12 19.25v2M4.223 4.223l1.415 1.415M18.362 18.362l1.415 1.415M2.75 12h2M19.25 12h2M4.223 19.777l1.415-1.415M18.362 5.638l1.415-1.415"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-4.5 w-4.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 0 1 8.646 3.646a9.003 9.003 0 1 0 11.708 11.708Z" />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-4.5 w-4.5">
      <rect x="3" y="4.5" width="18" height="12" rx="1.5" />
      <path strokeLinecap="round" d="M8.5 20h7M12 16.5v3.5" />
    </svg>
  );
}

const THEME_ICON: Record<Theme, () => ReactElement> = {
  light: SunIcon,
  dark: MoonIcon,
  system: SystemIcon,
};

/**
 * Cycles light -> dark -> system on click, persisting the choice to
 * `localStorage` so it survives reloads (read on load by the inline script
 * in src/app/layout.tsx, which sets `data-theme` on `<html>` before first
 * paint to avoid a flash of the wrong theme).
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Keeps <html data-theme> synced to the resolved theme — a legitimate
  // effect (syncing React state to an external system, the DOM outside this
  // component's own subtree), not the setState-in-effect anti-pattern. This
  // also re-applies the attribute after React's Strict Mode dev remount,
  // which resets attributes JSX doesn't own and would otherwise clear
  // whatever the inline script set (see the Next.js "preventing flash
  // before hydration" guide, "Re-applying attributes in development").
  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function cycleTheme() {
    const next = THEME_CYCLE[(THEME_CYCLE.indexOf(theme) + 1) % THEME_CYCLE.length];
    try {
      // "system" is stored explicitly rather than removed: with dark as the
      // unattributed default, removing the key would read back as "dark" on
      // the next load and silently discard the reader's choice.
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable — the effect above still applies the theme for
      // this page view, it just won't survive a reload.
    }
    notify();
  }

  const Icon = THEME_ICON[theme];
  const next = THEME_CYCLE[(THEME_CYCLE.indexOf(theme) + 1) % THEME_CYCLE.length];

  return (
    // `IconButton` owns the 40px painted face *and* the 44px hit area it
    // carries on a transparent `::after` — see TOUCH_TARGET_CLASSES for why
    // the target grows without the button visibly growing with it.
    <IconButton
      onClick={cycleTheme}
      className={cn(
        "border border-transparent text-muted-foreground transition-[color,background-color,border-color] duration-[--dur-fast] ease-[--ease-instrument] hover:border-border hover:bg-surface-muted hover:text-foreground",
        className
      )}
      aria-label={`Theme: ${THEME_LABEL[theme]}. Switch to ${THEME_LABEL[next]}.`}
      title={`Theme: ${THEME_LABEL[theme]}`}
    >
      <Icon />
    </IconButton>
  );
}
