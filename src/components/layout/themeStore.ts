/**
 * The theme store behind `ThemeToggle`.
 *
 * It lives in its own module, apart from the component, for two reasons. The
 * store is genuinely document-scoped rather than component-scoped (see
 * `readerHasChosen` below, and the fact that a cross-tab `storage` event
 * arrives at the module, not at a mounted component). And it makes the two
 * failure modes that used to be invisible here testable without a DOM
 * renderer: this repo's suite is pure-logic `.test.ts` files with no React
 * testing library, so anything reachable only through JSX is in practice
 * untested. See `themeStore.test.ts`.
 */

export type Theme = "light" | "dark" | "system";

/** Matches the `studyquantum:lesson-progress:` prefix convention used by
 * src/lib/content/progress/localStorageStore.ts, and the key the no-flash
 * script in src/app/layout.tsx reads and writes. */
export const THEME_STORAGE_KEY = "studyquantum:theme";

/**
 * The pre-rename key, still read as a fallback.
 *
 * The rename to StudyQuantum changed this namespace. A key rename with no
 * fallback silently throws away every returning visitor's explicit theme
 * choice, with no way to recover it, so reads try the new key and fall back
 * to this one. Writes only ever go to the new key.
 *
 * The forward-copy (old value written under the new key, once) is done by the
 * no-flash script in src/app/layout.tsx rather than here: that script runs
 * before first paint on every page, so it is already reading storage at the
 * one moment the value has to be right, and doing the copy there keeps
 * `getThemeSnapshot` below a pure read. `useSyncExternalStore` calls its
 * snapshot on every render and requires it to be side-effect-free and
 * referentially stable; writing from inside it would be neither.
 *
 * Once the copy has happened this fallback is dead weight for that visitor,
 * but it costs one `getItem` on a cold read and it is what makes the rename
 * invisible to someone whose first page load after it is a cached document
 * whose head script never ran. It can be deleted once returning-visitor
 * traffic from before the rename is gone.
 */
export const LEGACY_THEME_STORAGE_KEY = "quantumlearn:theme";

export const THEME_CYCLE: readonly Theme[] = ["light", "dark", "system"];

// Store plumbing mirrors src/lib/content/progress/useLessonProgress.ts: a
// module-level listener set notified on write, read through
// `useSyncExternalStore` so the pre-hydration client render matches the
// server (both fall back to the server snapshot) with no
// setState-in-effect needed to reconcile them.
const listeners = new Set<() => void>();

/** Exported (beyond being passed to `useSyncExternalStore`) so tests can
 *  subscribe a spy directly, matching `useLessonProgress`. */
export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notify() {
  listeners.forEach((listener) => listener());
}

/**
 * The reader's choice for *this page view*, held in memory.
 *
 * This is what makes the control work when nothing can be persisted. In
 * private browsing, with site data blocked, or over quota, `setItem` throws;
 * the snapshot below then reads back the same value it read before (or
 * throws on `getItem` too and falls through to the hard-coded default), the
 * store value never moves, `useSyncExternalStore` sees no change, and the
 * button does nothing at all on every click. Recording the choice here first
 * means the snapshot moves whether or not the write lands, so the toggle
 * behaves normally and only loses the setting on reload.
 *
 * It is the same shape as the `cache` in
 * src/lib/content/progress/localStorageStore.ts, which keeps lesson progress
 * working within a session for exactly the same readers.
 *
 * `null` means "nothing chosen in this page view yet, read storage".
 */
let sessionTheme: Theme | null = null;

/**
 * Set the first time the theme changes in this document, by a click here or
 * by a `storage` event from another tab. Until then the no-flash script's
 * attribute outranks this store's value; see `ThemeToggle`'s layout effect.
 *
 * Document-scoped rather than a `useRef`, because both of the things that set
 * it are document-scoped: the `storage` listener below has no component to
 * reach into, and the site renders `ThemeToggle` from `Navbar`, so a choice
 * made in one instance has to be a fact about the page and not about the
 * button that was clicked.
 */
let readerHasChosen = false;

export function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

export function getThemeSnapshot(): Theme {
  if (sessionTheme !== null) return sessionTheme;
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isTheme(stored)) return stored;
    // Nothing under the new key: a visitor from before the StudyQuantum
    // rename, whose choice is still under LEGACY_THEME_STORAGE_KEY. Honour it.
    const legacy = window.localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
    if (isTheme(legacy)) return legacy;
  } catch {
    // Storage unreadable (private browsing, blocked site data). Fall through
    // to the site default; `sessionTheme` above is what carries a choice made
    // in this page view, so the toggle still works for this reader.
  }
  // Dark, not "system". The absence of a stored choice is not a preference
  // for the OS setting, it is the absence of a choice, and the site's answer
  // to that is its own identity. See the theme note at the top of
  // globals.css: a first-time visitor on a light-default OS used to get a
  // white page, which the dark-first palette exists to prevent. "System" is
  // now something a reader picks, not something they fall into.
  return "dark";
}

/** Matches the `<html>` server render in src/app/layout.tsx, which carries no
 * `data-theme` attribute until the inline no-flash script or `ThemeToggle`
 * sets one, and the unattributed default is dark. */
export function getServerThemeSnapshot(): Theme {
  return "dark";
}

/** Whether the theme has been changed in this document yet, by this reader or
 *  by another tab. */
export function hasReaderChosenTheme(): boolean {
  return readerHasChosen;
}

/** Mirrors the inline no-flash script in src/app/layout.tsx: all three states
 * write an explicit `data-theme`, including "system", which globals.css pairs
 * with a `prefers-color-scheme: light` query. Clearing the attribute would
 * now mean *dark*, not "follow the OS", so "system" can no longer be encoded
 * as its absence. */
export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function nextTheme(theme: Theme): Theme {
  return THEME_CYCLE[(THEME_CYCLE.indexOf(theme) + 1) % THEME_CYCLE.length];
}

/** Records the reader's choice and persists it if storage will take it. */
export function setTheme(next: Theme) {
  // Before the write, and unconditionally: this is the value the snapshot
  // serves from here on, so the control moves even when persistence fails.
  sessionTheme = next;
  // From here on this store's value outranks whatever the inline no-flash
  // script put on <html>: the reader has made a choice in this document and
  // it has to win, including when it lands back on the value the script wrote.
  readerHasChosen = true;
  try {
    // "system" is stored explicitly rather than removed: with dark as the
    // unattributed default, removing the key would read back as "dark" on
    // the next load and silently discard the reader's choice.
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // Storage unavailable (private browsing, blocked site data, quota). The
    // choice above still drives this page view; it just will not survive a
    // reload, and no other tab will hear about it (the browser fires no
    // `storage` event for a write that never happened).
  }
  notify();
}

/**
 * Handles a `storage` event from another tab on this origin.
 *
 * The native event fires only in *other* tabs, never the one that made the
 * write, which is precisely why this exists: without it, switching to light
 * in one tab left every other open tab on the site dark until a manual
 * reload. `handleExternalStorageChange` in
 * src/lib/content/progress/localStorageStore.ts closes the same gap for
 * lesson progress and this follows it.
 *
 * Returns whether the event was ours, so the listener only notifies for
 * relevant keys.
 *
 * It drops `sessionTheme` rather than parsing `event.newValue`: shared
 * `localStorage` is already updated by the time the event dispatches, so the
 * next `getThemeSnapshot()` reads the truth, including the `key === null`
 * case (another tab called `localStorage.clear()`) and a `removeItem`, where
 * the right answer is the legacy-key-then-default fallback rather than
 * anything carried in the event.
 */
export function handleExternalThemeStorageChange(event: Pick<StorageEvent, "key">): boolean {
  if (event.key !== null && event.key !== THEME_STORAGE_KEY && event.key !== LEGACY_THEME_STORAGE_KEY) {
    return false;
  }
  sessionTheme = null;
  // The theme has now changed under this document too, so the layout effect
  // in `ThemeToggle` must stop deferring to the attribute the no-flash script
  // wrote and start applying the store's value.
  readerHasChosen = true;
  return true;
}

if (typeof window !== "undefined") {
  // Registered once for the lifetime of the page, so no corresponding
  // `removeEventListener` is needed, matching `useLessonProgress`.
  window.addEventListener("storage", (event) => {
    if (handleExternalThemeStorageChange(event)) {
      notify();
    }
  });
}
