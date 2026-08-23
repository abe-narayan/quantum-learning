import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Regression test for a real bug caught by browser-testing this feature:
 * `getProblemProgress` originally ran `JSON.parse` fresh on every call,
 * returning a new object each time. `useProblemProgress` feeds this
 * straight into `useSyncExternalStore`, which requires `getSnapshot` to
 * return a referentially stable value when nothing changed — a fresh
 * object every call makes React think the store changed on every render,
 * causing an infinite render loop (React error #185) the instant a
 * problem page mounted. Fixed by caching reads until the next write; this
 * test pins that invariant so it can't silently regress.
 */
function makeFakeLocalStorage() {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
    removeItem: (key: string) => {
      data.delete(key);
    },
  };
}

describe("LocalStorageProgressStore — stable snapshot references", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("window", { localStorage: makeFakeLocalStorage() });
  });

  it("returns the exact same object reference across repeated reads with no write in between", async () => {
    const { getProgressStore } = await import("../progress/localStorageStore");
    const store = getProgressStore();

    const first = store.getProblemProgress("some-problem");
    const second = store.getProblemProgress("some-problem");
    expect(first).toBe(second);
  });

  it("returns a new reference only after a write actually happens", async () => {
    const { getProgressStore } = await import("../progress/localStorageStore");
    const store = getProgressStore();

    const before = store.getProblemProgress("some-problem");
    const after = store.revealHint("some-problem", 1);
    expect(after).not.toBe(before);

    const stableAfterWrite = store.getProblemProgress("some-problem");
    expect(stableAfterWrite).toBe(after);
  });
});
