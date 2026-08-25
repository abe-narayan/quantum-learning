import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Regression coverage for the cross-tab staleness gap: the native `storage`
 * event fires only in *other* tabs/windows on this origin, never the one
 * that made the write, so `handleExternalStorageChange` is what lets a
 * second tab pick up a write made by the first. Mirrors the stubbing style
 * of `lib/problems/__tests__/progressStore.test.ts` — a plain `window`
 * object (no real DOM needed) with an in-memory `localStorage` fake.
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

const KEY = "quantumlearn:problem-progress:some-problem";

describe("handleExternalStorageChange (problem progress)", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("window", { localStorage: makeFakeLocalStorage() });
  });

  it("ignores keys outside this store's prefix and returns false", async () => {
    const { getProgressStore, handleExternalStorageChange } = await import("./localStorageStore");
    const store = getProgressStore();

    const relevant = handleExternalStorageChange({
      key: "some-other-app:setting",
      newValue: "1",
    } as StorageEvent);

    expect(relevant).toBe(false);
    expect(store.getProblemProgress("some-problem").solved).toBe(false);
  });

  it("updates the cache for a matching key written by another tab", async () => {
    const { getProgressStore, handleExternalStorageChange } = await import("./localStorageStore");
    const store = getProgressStore();

    // Prime this tab's cache with the empty snapshot, as a real subscriber would.
    const before = store.getProblemProgress("some-problem");
    expect(before.solved).toBe(false);

    const written = {
      attempts: [{ timestamp: 1, submitted: "42", status: "correct" }],
      solved: true,
      hintsRevealed: 1,
      solutionRevealed: false,
    };
    const relevant = handleExternalStorageChange({ key: KEY, newValue: JSON.stringify(written) } as StorageEvent);

    expect(relevant).toBe(true);
    const after = store.getProblemProgress("some-problem");
    expect(after).toEqual(written);
    expect(after).not.toBe(before);
  });

  it("resets to EMPTY_PROGRESS when a key is removed in another tab (newValue: null)", async () => {
    const { getProgressStore, handleExternalStorageChange } = await import("./localStorageStore");
    const store = getProgressStore();

    handleExternalStorageChange({
      key: KEY,
      newValue: JSON.stringify({ attempts: [], solved: true, hintsRevealed: 2, solutionRevealed: true }),
    } as StorageEvent);
    expect(store.getProblemProgress("some-problem").solved).toBe(true);

    handleExternalStorageChange({ key: KEY, newValue: null } as StorageEvent);
    expect(store.getProblemProgress("some-problem")).toEqual({
      attempts: [],
      solved: false,
      hintsRevealed: 0,
      solutionRevealed: false,
    });
  });

  it("falls back to EMPTY_PROGRESS for corrupted JSON instead of throwing", async () => {
    const { getProgressStore, handleExternalStorageChange } = await import("./localStorageStore");
    const store = getProgressStore();

    expect(() => handleExternalStorageChange({ key: KEY, newValue: "{not json" } as StorageEvent)).not.toThrow();
    expect(store.getProblemProgress("some-problem").solved).toBe(false);
  });

  it("clears the whole cache on a `key: null` event, so the next read reflects underlying storage again", async () => {
    const fakeStorage = makeFakeLocalStorage();
    vi.stubGlobal("window", { localStorage: fakeStorage });

    const { getProgressStore, handleExternalStorageChange } = await import("./localStorageStore");
    const store = getProgressStore();

    // Populate the cache (and persist) via a normal write.
    store.revealHint("some-problem", 1);
    expect(store.getProblemProgress("some-problem").hintsRevealed).toBe(1);

    // Simulate another tab writing directly to the shared backing storage —
    // this tab's cache doesn't know about it yet.
    fakeStorage.setItem(
      KEY,
      JSON.stringify({ attempts: [], solved: false, hintsRevealed: 9, solutionRevealed: false })
    );
    expect(store.getProblemProgress("some-problem").hintsRevealed).toBe(1); // still stale, cache wins

    const relevant = handleExternalStorageChange({ key: null, newValue: null } as StorageEvent);
    expect(relevant).toBe(true);

    // Cache is now empty, so the read falls through to storage and picks up the new value.
    expect(store.getProblemProgress("some-problem").hintsRevealed).toBe(9);
  });
});
