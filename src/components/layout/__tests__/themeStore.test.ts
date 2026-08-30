import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Two things about the theme control are invisible in normal development and
 * were both broken until this file existed.
 *
 * The first is a *silently dead control*. With site data blocked (private
 * browsing, a "block third-party and site data" setting, a full quota),
 * `localStorage.setItem` throws. The store used to write only to storage, so
 * the snapshot read back the same value it had before, `useSyncExternalStore`
 * saw no change, and clicking the toggle did nothing at all: no icon change,
 * no label change, no theme change. Nothing logs, nothing renders an error,
 * and nobody develops in that browser mode, so the only way this gets caught
 * is a test that stubs a throwing `localStorage` the way
 * `src/lib/content/progress/renameMigration.test.ts` does.
 *
 * The second is cross-tab sync. The native `storage` event fires only in
 * *other* tabs on the origin, never the one that made the write, so it cannot
 * be observed from the tab a person is clicking in.
 *
 * The store registers its `storage` listener at module scope, so every test
 * resets the module registry and re-stubs `window` before importing.
 */

type StorageEventLike = { key: string | null };
type StorageEventHandler = (event: StorageEventLike) => void;

function makeFakeLocalStorage(seed: Record<string, string> = {}) {
  const data = new Map<string, string>(Object.entries(seed));
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
    removeItem: (key: string) => {
      data.delete(key);
    },
  };
}

/** Storage that throws on every access, as a browser with site data blocked does. */
function makeBlockedLocalStorage() {
  const blocked = () => {
    throw new Error("SecurityError: storage is blocked");
  };
  return {
    getItem: blocked,
    setItem: blocked,
    removeItem: blocked,
  };
}

function stubWindow(localStorage: unknown) {
  const handlers = new Map<string, StorageEventHandler[]>();
  const fakeWindow = {
    localStorage,
    addEventListener(type: string, handler: StorageEventHandler) {
      const existing = handlers.get(type) ?? [];
      existing.push(handler);
      handlers.set(type, existing);
    },
  };
  vi.stubGlobal("window", fakeWindow);
  return {
    /** Plays back an event the browser would only deliver to *another* tab. */
    dispatchStorage(event: StorageEventLike) {
      (handlers.get("storage") ?? []).forEach((handler) => handler(event));
    },
    storageListenerCount: () => (handlers.get("storage") ?? []).length,
  };
}

describe("theme toggle when storage is unavailable", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("still changes the theme for this page view when the write throws", async () => {
    stubWindow(makeBlockedLocalStorage());
    const { getThemeSnapshot, setTheme } = await import("../themeStore");

    expect(getThemeSnapshot()).toBe("dark");
    expect(() => setTheme("light")).not.toThrow();
    // The regression this guards: the snapshot used to stay "dark" here, so
    // the button was inert on every click for these readers.
    expect(getThemeSnapshot()).toBe("light");
  });

  it("notifies subscribers so the button actually re-renders", async () => {
    stubWindow(makeBlockedLocalStorage());
    const { setTheme, subscribe } = await import("../themeStore");

    const listener = vi.fn();
    subscribe(listener);
    setTheme("system");

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("keeps cycling, rather than sticking on the first pick", async () => {
    stubWindow(makeBlockedLocalStorage());
    const { getThemeSnapshot, nextTheme, setTheme } = await import("../themeStore");

    const seen: string[] = [];
    for (let i = 0; i < 3; i++) {
      setTheme(nextTheme(getThemeSnapshot()));
      seen.push(getThemeSnapshot());
    }
    expect(seen).toEqual(["system", "light", "dark"]);
  });

  it("lets the layout effect apply the theme, instead of deferring to <html>", async () => {
    stubWindow(makeBlockedLocalStorage());
    const { hasReaderChosenTheme, setTheme } = await import("../themeStore");

    expect(hasReaderChosenTheme()).toBe(false);
    setTheme("light");
    // False here would mean `ThemeToggle`'s layout effect keeps honouring
    // whatever `data-theme` the no-flash script left on <html>, and the page
    // would not visibly change even though the store did.
    expect(hasReaderChosenTheme()).toBe(true);
  });
});

describe("theme sync across tabs", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("registers exactly one storage listener when the module loads", async () => {
    const win = stubWindow(makeFakeLocalStorage());
    await import("../themeStore");

    expect(win.storageListenerCount()).toBe(1);
  });

  it("picks up a theme another tab wrote", async () => {
    const storage = makeFakeLocalStorage({ "studyquantum:theme": "dark" });
    const win = stubWindow(storage);
    const { getThemeSnapshot, subscribe, THEME_STORAGE_KEY } = await import("../themeStore");

    expect(getThemeSnapshot()).toBe("dark");

    const listener = vi.fn();
    subscribe(listener);
    // What the browser does: the other tab's write already landed in shared
    // storage, then this tab gets the event.
    storage.data.set(THEME_STORAGE_KEY, "light");
    win.dispatchStorage({ key: THEME_STORAGE_KEY });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(getThemeSnapshot()).toBe("light");
  });

  it("overrides a choice made in this tab when a later tab changes it", async () => {
    const storage = makeFakeLocalStorage();
    const win = stubWindow(storage);
    const { getThemeSnapshot, setTheme, THEME_STORAGE_KEY } = await import("../themeStore");

    setTheme("light");
    expect(getThemeSnapshot()).toBe("light");

    storage.data.set(THEME_STORAGE_KEY, "system");
    win.dispatchStorage({ key: THEME_STORAGE_KEY });

    expect(getThemeSnapshot()).toBe("system");
  });

  it("ignores writes to keys that are not the theme", async () => {
    const storage = makeFakeLocalStorage({ "studyquantum:theme": "light" });
    const win = stubWindow(storage);
    const { subscribe } = await import("../themeStore");

    const listener = vi.fn();
    subscribe(listener);
    win.dispatchStorage({ key: "studyquantum:lesson-progress:what-is-a-qubit" });

    expect(listener).not.toHaveBeenCalled();
  });

  it("falls back to the pre-rename key another tab wrote", async () => {
    const storage = makeFakeLocalStorage();
    const win = stubWindow(storage);
    const { getThemeSnapshot, LEGACY_THEME_STORAGE_KEY } = await import("../themeStore");

    storage.data.set(LEGACY_THEME_STORAGE_KEY, "light");
    win.dispatchStorage({ key: LEGACY_THEME_STORAGE_KEY });

    expect(getThemeSnapshot()).toBe("light");
  });

  it("returns to the site default when another tab clears storage", async () => {
    const storage = makeFakeLocalStorage({ "studyquantum:theme": "light" });
    const win = stubWindow(storage);
    const { getThemeSnapshot } = await import("../themeStore");

    expect(getThemeSnapshot()).toBe("light");
    storage.data.clear();
    // `localStorage.clear()` in another tab dispatches an event with a null key.
    win.dispatchStorage({ key: null });

    expect(getThemeSnapshot()).toBe("dark");
  });

  it("lets the receiving tab apply the change instead of deferring to <html>", async () => {
    const storage = makeFakeLocalStorage({ "studyquantum:theme": "dark" });
    const win = stubWindow(storage);
    const { hasReaderChosenTheme, THEME_STORAGE_KEY } = await import("../themeStore");

    expect(hasReaderChosenTheme()).toBe(false);
    storage.data.set(THEME_STORAGE_KEY, "light");
    win.dispatchStorage({ key: THEME_STORAGE_KEY });

    // Without this the other tab's change would update the icon and the
    // aria-label but leave the page itself on the no-flash script's theme.
    expect(hasReaderChosenTheme()).toBe(true);
  });
});
