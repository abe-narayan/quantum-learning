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
    get length() {
      return data.size;
    },
    key: (i: number) => Array.from(data.keys())[i] ?? null,
  };
}

const KEY = "studyquantum:lesson-progress:some-lesson";

describe("handleExternalStorageChange (lesson progress)", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("window", { localStorage: makeFakeLocalStorage() });
  });

  it("ignores keys outside this store's prefix and returns false", async () => {
    const { getLessonProgressStore, handleExternalStorageChange } = await import("./localStorageStore");
    const store = getLessonProgressStore();

    const relevant = handleExternalStorageChange({
      key: "some-other-app:setting",
      newValue: "1",
    } as StorageEvent);

    expect(relevant).toBe(false);
    expect(store.getLessonProgress("some-lesson").completed).toBe(false);
  });

  it("updates the cache for a matching key written by another tab", async () => {
    const { getLessonProgressStore, handleExternalStorageChange } = await import("./localStorageStore");
    const store = getLessonProgressStore();

    const before = store.getLessonProgress("some-lesson");
    expect(before.completed).toBe(false);

    const written = { completed: true, completedAt: 12345 };
    const relevant = handleExternalStorageChange({ key: KEY, newValue: JSON.stringify(written) } as StorageEvent);

    expect(relevant).toBe(true);
    const after = store.getLessonProgress("some-lesson");
    expect(after).toEqual(written);
    expect(after).not.toBe(before);
  });

  it("falls back to EMPTY_LESSON_PROGRESS for corrupted JSON instead of throwing", async () => {
    const { getLessonProgressStore, handleExternalStorageChange } = await import("./localStorageStore");
    const store = getLessonProgressStore();

    expect(() => handleExternalStorageChange({ key: KEY, newValue: "{not json" } as StorageEvent)).not.toThrow();
    expect(store.getLessonProgress("some-lesson").completed).toBe(false);
  });

  it("coerces corrupted field values (truthy non-booleans) back to safe defaults", async () => {
    // Valid JSON, wrong shape: `"false"` is a truthy string, so without the
    // per-field type guard it would count as a completed lesson.
    const { getLessonProgressStore, handleExternalStorageChange } = await import("./localStorageStore");
    const store = getLessonProgressStore();

    handleExternalStorageChange({
      key: KEY,
      newValue: JSON.stringify({ completed: "false", completedAt: "yesterday" }),
    } as StorageEvent);

    expect(store.getLessonProgress("some-lesson")).toEqual({ completed: false, completedAt: null });
  });

  it("reads a corrupted record straight from storage as safe defaults too (getItem path)", async () => {
    const fakeStorage = makeFakeLocalStorage();
    vi.stubGlobal("window", { localStorage: fakeStorage });
    fakeStorage.setItem(KEY, JSON.stringify({ completed: 1, completedAt: null }));

    const { getLessonProgressStore, getAllCompletedLessonSlugs } = await import("./localStorageStore");
    expect(getLessonProgressStore().getLessonProgress("some-lesson").completed).toBe(false);
    expect(getAllCompletedLessonSlugs().has("some-lesson")).toBe(false);
  });

  it("invalidates the completed-slugs aggregate cache so a completion from another tab is picked up", async () => {
    // A real browser's localStorage is one shared, synchronous store across
    // tabs on the same origin — by the time tab B's `storage` event fires,
    // tab B's own `window.localStorage.getItem`/`.key()` already reflect tab
    // A's write. Model that by writing directly into the same fake storage
    // instance before firing the synthetic event, rather than relying on
    // `handleExternalStorageChange` (which only ever touches the in-memory
    // cache, matching the real event's `newValue` payload) to also persist it.
    const fakeStorage = makeFakeLocalStorage();
    vi.stubGlobal("window", { localStorage: fakeStorage });

    const { getAllCompletedLessonSlugs, handleExternalStorageChange } = await import("./localStorageStore");

    expect(getAllCompletedLessonSlugs().has("some-lesson")).toBe(false);

    const written = { completed: true, completedAt: 1 };
    fakeStorage.setItem(KEY, JSON.stringify(written));
    handleExternalStorageChange({ key: KEY, newValue: JSON.stringify(written) } as StorageEvent);

    expect(getAllCompletedLessonSlugs().has("some-lesson")).toBe(true);
  });

  it("clears the whole cache on a `key: null` event, so the next read reflects underlying storage again", async () => {
    const fakeStorage = makeFakeLocalStorage();
    vi.stubGlobal("window", { localStorage: fakeStorage });

    const { getLessonProgressStore, handleExternalStorageChange } = await import("./localStorageStore");
    const store = getLessonProgressStore();

    store.setCompleted("some-lesson", true);
    expect(store.getLessonProgress("some-lesson").completed).toBe(true);

    // Simulate another tab writing directly to the shared backing storage —
    // this tab's cache doesn't know about it yet.
    fakeStorage.setItem(KEY, JSON.stringify({ completed: false, completedAt: null }));
    expect(store.getLessonProgress("some-lesson").completed).toBe(true); // still stale, cache wins

    const relevant = handleExternalStorageChange({ key: null, newValue: null } as StorageEvent);
    expect(relevant).toBe(true);

    expect(store.getLessonProgress("some-lesson").completed).toBe(false);
  });
});
