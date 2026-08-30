"use client";

import { useLayoutEffect, useSyncExternalStore, type ReactElement } from "react";
import { IconButton } from "@/components/ui/IconButton";
import {
  applyTheme,
  getServerThemeSnapshot,
  getThemeSnapshot,
  hasReaderChosenTheme,
  isTheme,
  nextTheme,
  setTheme,
  subscribe,
  type Theme,
} from "@/components/layout/themeStore";
import { cn } from "@/lib/utils";

const THEME_LABEL: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

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
 *
 * All of the state lives in `themeStore.ts`, including the `storage` listener
 * that keeps other tabs on this origin in step.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, getServerThemeSnapshot);

  // Keeps <html data-theme> synced to the resolved theme — a legitimate
  // effect (syncing React state to an external system, the DOM outside this
  // component's own subtree), not the setState-in-effect anti-pattern. This
  // also re-applies the attribute after React's Strict Mode dev remount,
  // which resets attributes JSX doesn't own and would otherwise clear
  // whatever the inline script set (see the Next.js "preventing flash
  // before hydration" guide, "Re-applying attributes in development").
  //
  // WHY IT DEFERS TO AN ATTRIBUTE ALREADY ON <html>
  // ----------------------------------------------
  // Unconditionally writing `theme` here reintroduced exactly the flash the
  // no-flash script exists to prevent, for every reader whose theme is not
  // dark. `useSyncExternalStore` serves `getServerThemeSnapshot()` (hard-coded
  // "dark", to match the attribute-less server HTML) for the whole hydration
  // render, and reconciles with `getThemeSnapshot()` in a **passive** effect:
  // `mountSyncExternalStore` in react-dom pushes `updateStoreInstance` with
  // `HasEffect | Passive`. Layout effects run before passive effects and
  // before paint, so the order on a cold load was:
  //
  //   inline script writes data-theme="light"  ->  page paints light
  //   hydration commit, layout effect          ->  applyTheme("dark")
  //   browser paints                           ->  DARK FLASH
  //   passive effect reconciles to "light"     ->  re-render
  //   layout effect                            ->  applyTheme("light")
  //
  // A reader on "light" or on "system" with a light OS therefore saw the site
  // blink dark on every full page load. The attribute the script wrote is the
  // authority until the theme is changed in this document, so honour it: once
  // the store has reconciled, `theme` equals what is already on the element
  // and this writes nothing anyway. After a real change — a click here, or a
  // `storage` event from another tab, both of which set the store's
  // `readerHasChosen` flag — every subsequent value is let through. Also
  // correct when the script wrote nothing (storage blocked): there is no
  // attribute to defer to, and both this component and the script agree the
  // answer is dark.
  useLayoutEffect(() => {
    if (!hasReaderChosenTheme()) {
      const current = document.documentElement.getAttribute("data-theme");
      if (isTheme(current)) return;
    }
    applyTheme(theme);
  }, [theme]);

  function cycleTheme() {
    setTheme(nextTheme(theme));
  }

  const Icon = THEME_ICON[theme];
  const next = nextTheme(theme);

  return (
    // `IconButton` owns the 40px painted face *and* the 44px hit area it
    // carries on a transparent `::after` — see TOUCH_TARGET_CLASSES for why
    // the target grows without the button visibly growing with it.
    <IconButton
      onClick={cycleTheme}
      className={cn(
        "border border-transparent text-muted-foreground transition-[color,background-color,border-color] duration-(--dur-fast) ease-instrument hover:border-border hover:bg-surface-muted hover:text-foreground",
        className
      )}
      aria-label={`Theme: ${THEME_LABEL[theme]}. Switch to ${THEME_LABEL[next]}.`}
      title={`Theme: ${THEME_LABEL[theme]}`}
    >
      <Icon />
    </IconButton>
  );
}
