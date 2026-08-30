import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * The StudyQuantum rename moved every `localStorage` key from a
 * `quantumlearn:` prefix to a `studyquantum:` one. Both progress stores copy
 * the old namespace forward on first read, and until this file existed
 * nothing verified that they do.
 *
 * That gap mattered more than a normal untested branch. There are no accounts
 * on this site, so the browser *is* the record of what a reader has finished,
 * and the migration runs exactly once per returning reader, at launch, with no
 * way to notice it failed and no way to recover if it did. A regression here
 * does not show up as an error: it shows up as a reader opening the site and
 * finding that it forgot everything they had done.
 *
 * The stores keep `legacyMigrationAttempted` at module scope, so every test
 * below resets the module registry and re-stubs `window`, matching the style
 * of `localStorageStore.test.ts` next door.
 */
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
    get length() {
      return data.size;
    },
    key: (i: number) => Array.from(data.keys())[i] ?? null,
  };
}

const done = (at: number) => JSON.stringify({ completed: true, completedAt: at });

describe("lesson progress survives the StudyQuantum rename", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("reads a lesson finished before the rename", async () => {
    vi.stubGlobal("window", {
      localStorage: makeFakeLocalStorage({
        "quantumlearn:lesson-progress:what-is-a-qubit": done(111),
      }),
    });
    const { getLessonProgressStore } = await import("./localStorageStore");

    const progress = getLessonProgressStore().getLessonProgress("what-is-a-qubit");
    expect(progress.completed).toBe(true);
    expect(progress.completedAt).toBe(111);
  });

  /**
   * The store copies the whole namespace in one sweep rather than falling back
   * per slug, precisely so the enumeration path cannot drift from the
   * single-slug path. `getAllCompletedLessonSlugs` is that enumeration path,
   * and it is what every progress readout on the site counts.
   */
  it("counts pre-rename lessons in the whole-corpus enumeration too", async () => {
    vi.stubGlobal("window", {
      localStorage: makeFakeLocalStorage({
        "quantumlearn:lesson-progress:what-is-a-qubit": done(1),
        "quantumlearn:lesson-progress:quantum-gates": done(2),
        "quantumlearn:lesson-progress:dirac-notation": done(3),
      }),
    });
    const { getAllCompletedLessonSlugs } = await import("./localStorageStore");

    expect(getAllCompletedLessonSlugs()).toEqual(
      new Set(["what-is-a-qubit", "quantum-gates", "dirac-notation"]),
    );
  });

  /**
   * The hazard the implementation comment calls out by name: `localStorage.key(i)`
   * is index-based, so writing inside the collection loop reshuffles the
   * indices and silently skips records. Five keys, because the bug drops
   * roughly every other one and a two-key fixture can pass by luck.
   */
  it("copies every record, not just the ones the index walk happened to reach", async () => {
    const seed: Record<string, string> = {};
    for (let i = 0; i < 5; i++) seed[`quantumlearn:lesson-progress:lesson-${i}`] = done(i);
    vi.stubGlobal("window", { localStorage: makeFakeLocalStorage(seed) });
    const { getAllCompletedLessonSlugs } = await import("./localStorageStore");

    expect(getAllCompletedLessonSlugs().size).toBe(5);
  });

  /** A restore of history must never overwrite something done since. */
  it("lets an existing post-rename record win over the legacy one", async () => {
    vi.stubGlobal("window", {
      localStorage: makeFakeLocalStorage({
        "quantumlearn:lesson-progress:what-is-a-qubit": done(111),
        "studyquantum:lesson-progress:what-is-a-qubit": done(999),
      }),
    });
    const { getLessonProgressStore } = await import("./localStorageStore");

    expect(getLessonProgressStore().getLessonProgress("what-is-a-qubit").completedAt).toBe(999);
  });

  it("leaves keys belonging to other apps alone", async () => {
    const storage = makeFakeLocalStorage({ "someone-else:lesson-progress:x": done(1) });
    vi.stubGlobal("window", { localStorage: storage });
    const { getAllCompletedLessonSlugs } = await import("./localStorageStore");

    expect(getAllCompletedLessonSlugs().size).toBe(0);
    expect(storage.data.size).toBe(1);
  });

  /**
   * Private browsing, blocked site data, and a full quota all throw here. The
   * page must still render, and a reader in that state must look exactly like
   * a first-time visitor rather than like a crash.
   */
  it("degrades to an empty record when storage throws", async () => {
    vi.stubGlobal("window", {
      localStorage: {
        get length(): number {
          throw new Error("SecurityError: storage is blocked");
        },
        getItem() {
          throw new Error("SecurityError: storage is blocked");
        },
        setItem() {
          throw new Error("SecurityError: storage is blocked");
        },
        removeItem() {
          throw new Error("SecurityError: storage is blocked");
        },
        key() {
          throw new Error("SecurityError: storage is blocked");
        },
      },
    });
    const { getLessonProgressStore, getAllCompletedLessonSlugs } = await import("./localStorageStore");

    expect(() => getLessonProgressStore().getLessonProgress("what-is-a-qubit")).not.toThrow();
    expect(getLessonProgressStore().getLessonProgress("what-is-a-qubit").completed).toBe(false);
    expect(getAllCompletedLessonSlugs().size).toBe(0);
  });
});

describe("problem progress survives the StudyQuantum rename", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("reads a problem attempted before the rename", async () => {
    const legacy = JSON.stringify({
      attempts: [{ correct: true, at: 5 }],
      hintsRevealed: 2,
      solutionRevealed: true,
    });
    vi.stubGlobal("window", {
      localStorage: makeFakeLocalStorage({
        "quantumlearn:problem-progress:born-rule-probability": legacy,
      }),
    });
    const { getProgressStore } = await import("@/lib/problems/progress/localStorageStore");

    const progress = getProgressStore().getProblemProgress("born-rule-probability");
    expect(progress.hintsRevealed).toBe(2);
    expect(progress.solutionRevealed).toBe(true);
    expect(progress.attempts.length).toBe(1);
  });

  it("lets an existing post-rename record win over the legacy one", async () => {
    const old = JSON.stringify({ attempts: [], hintsRevealed: 3, solutionRevealed: false });
    const current = JSON.stringify({ attempts: [], hintsRevealed: 0, solutionRevealed: false });
    vi.stubGlobal("window", {
      localStorage: makeFakeLocalStorage({
        "quantumlearn:problem-progress:born-rule-probability": old,
        "studyquantum:problem-progress:born-rule-probability": current,
      }),
    });
    const { getProgressStore } = await import("@/lib/problems/progress/localStorageStore");

    expect(getProgressStore().getProblemProgress("born-rule-probability").hintsRevealed).toBe(0);
  });

  it("degrades to an empty record when storage throws", async () => {
    vi.stubGlobal("window", {
      localStorage: {
        get length(): number {
          throw new Error("SecurityError: storage is blocked");
        },
        getItem() {
          throw new Error("SecurityError: storage is blocked");
        },
        setItem() {
          throw new Error("SecurityError: storage is blocked");
        },
        removeItem() {
          throw new Error("SecurityError: storage is blocked");
        },
        key() {
          throw new Error("SecurityError: storage is blocked");
        },
      },
    });
    const { getProgressStore } = await import("@/lib/problems/progress/localStorageStore");

    expect(() => getProgressStore().getProblemProgress("born-rule-probability")).not.toThrow();
    expect(getProgressStore().getProblemProgress("born-rule-probability").attempts).toEqual([]);
  });
});
