import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Confirms the actual wiring this fix depends on: `useLessonProgress.ts`
 * registers a module-scope `window.addEventListener("storage", ...)` once
 * (see the guard next to `subscribe`), and that handler both updates
 * `localStorageStore`'s cache and calls `notify()` so every
 * `useSyncExternalStore`-subscribed listener in this tab re-renders.
 * There's no real DOM/jsdom in this project's vitest setup, so `window` is
 * stubbed as a plain object whose `addEventListener` just records the
 * handler — enough to invoke it directly, the same way the browser would.
 */
function makeFakeWindow() {
  const data = new Map<string, string>();
  const storageListeners: Array<(event: StorageEvent) => void> = [];
  return {
    localStorage: {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => {
        data.set(key, value);
      },
      removeItem: (key: string) => {
        data.delete(key);
      },
      get length() {
        return data.size;
      },
      key: (i: number) => Array.from(data.keys())[i] ?? null,
    },
    addEventListener: (type: string, listener: (event: StorageEvent) => void) => {
      if (type === "storage") storageListeners.push(listener);
    },
    removeEventListener: () => {},
    fireStorage(event: Partial<StorageEvent>) {
      storageListeners.forEach((listener) => listener(event as StorageEvent));
    },
  };
}

describe("useLessonProgress module-scope storage listener", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("registers a storage listener at import time and notifies subscribers for a relevant key", async () => {
    const fakeWindow = makeFakeWindow();
    vi.stubGlobal("window", fakeWindow);

    const { subscribe } = await import("./useLessonProgress");
    const listener = vi.fn();
    subscribe(listener);

    fakeWindow.fireStorage({
      key: "quantumlearn:lesson-progress:some-lesson",
      newValue: JSON.stringify({ completed: true, completedAt: 1 }),
    });

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("does not notify subscribers for an unrelated storage key", async () => {
    const fakeWindow = makeFakeWindow();
    vi.stubGlobal("window", fakeWindow);

    const { subscribe } = await import("./useLessonProgress");
    const listener = vi.fn();
    subscribe(listener);

    fakeWindow.fireStorage({ key: "quantumlearn:problem-progress:some-problem", newValue: "{}" });

    expect(listener).not.toHaveBeenCalled();
  });
});
