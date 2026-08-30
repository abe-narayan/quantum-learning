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

/**
 * The attempt log is a storage bomb unless it is bounded, and the bomb is
 * reachable by accident rather than only by an attacker.
 *
 * `recordAttempt` runs on every Submit and stored the reader's raw text with
 * no bound on its length or on the number of entries. A conceptual problem's
 * answer box takes a paste, so pasting a 100KB block and pressing Submit
 * twenty times — a plausible "why is this still wrong" session with an essay
 * in the clipboard — wrote 2.07 MB into a single problem's record. Measured in
 * headless Chrome against the running site: 52 such submissions exhaust the
 * origin's ~5MB `localStorage` quota outright.
 *
 * What turns that from wasted disk into silent data loss is the `catch` in
 * `writeToStorage`, and the identical one in the lesson store. Once the origin
 * is full every `setItem` throws `QuotaExceededError`, both stores swallow it
 * by design (the alternative is a white screen), and from that moment the
 * reader's lesson completions and problem progress stop persisting — on a site
 * with no accounts, where this origin's storage *is* the entire record of
 * their work, with nothing on screen to say anything went wrong.
 *
 * The caps cost nothing observable: `attempts` is consumed in exactly two
 * places (`ProblemViewClient`'s `attempted`, `ProblemsCatalog`'s "started"
 * filter) and both only ask whether it is non-empty, while `attempt.submitted`
 * is written here and read by no code at all.
 */
describe("LocalStorageProgressStore — the attempt log is bounded", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("window", { localStorage: makeFakeLocalStorage() });
  });

  const attempt = (submitted: string) => ({
    timestamp: 1,
    submitted,
    status: "incorrect" as const,
  });

  it("truncates a pasted submission instead of persisting all of it", async () => {
    const { getProgressStore } = await import("../progress/localStorageStore");
    const store = getProgressStore();

    const paste = "x".repeat(100_000);
    const after = store.recordAttempt("some-problem", attempt(paste));

    expect(after.attempts).toHaveLength(1);
    expect(after.attempts[0].submitted.length).toBeLessThan(paste.length);
    // The kept prefix is still the reader's own text, not a placeholder.
    expect(paste.startsWith(after.attempts[0].submitted)).toBe(true);
  });

  it("keeps one problem's whole record small enough that the origin quota survives it", async () => {
    const { getProgressStore } = await import("../progress/localStorageStore");
    const store = getProgressStore();

    for (let i = 0; i < 200; i++) store.recordAttempt("some-problem", attempt("x".repeat(100_000)));

    const serialized = JSON.stringify(store.getProblemProgress("some-problem"));
    // 200 unbounded submissions was 20MB, four times the whole origin quota,
    // from one problem. The ceiling here is deliberately loose — it is a
    // statement that the record cannot grow without limit, not a byte budget.
    expect(serialized.length).toBeLessThan(100_000);
  });

  it("bounds the number of attempts while still recording that the reader attempted it", async () => {
    const { getProgressStore } = await import("../progress/localStorageStore");
    const store = getProgressStore();

    for (let i = 0; i < 500; i++) store.recordAttempt("some-problem", attempt(`try ${i}`));

    const progress = store.getProblemProgress("some-problem");
    expect(progress.attempts.length).toBeGreaterThan(0);
    expect(progress.attempts.length).toBeLessThan(500);
    // The tail is what is kept: the newest attempt must survive, because the
    // oldest is the one with the least to say.
    expect(progress.attempts[progress.attempts.length - 1].submitted).toBe("try 499");
  });

  it("does not lose `solved` when older attempts are dropped", async () => {
    const { getProgressStore } = await import("../progress/localStorageStore");
    const store = getProgressStore();

    store.recordAttempt("some-problem", { timestamp: 1, submitted: "0.5", status: "correct" });
    for (let i = 0; i < 300; i++) store.recordAttempt("some-problem", attempt(`later ${i}`));

    expect(store.getProblemProgress("some-problem").solved).toBe(true);
  });

  it("shrinks a record an earlier build already grew past the cap", async () => {
    const bloated = {
      attempts: Array.from({ length: 400 }, (_, i) => attempt(`old ${i}`)),
      solved: true,
      hintsRevealed: 2,
      solutionRevealed: false,
    };
    const storage = makeFakeLocalStorage();
    storage.setItem("studyquantum:problem-progress:legacy-bloat", JSON.stringify(bloated));
    vi.stubGlobal("window", { localStorage: storage });

    const { getProgressStore } = await import("../progress/localStorageStore");
    const progress = getProgressStore().getProblemProgress("legacy-bloat");

    expect(progress.attempts.length).toBeLessThan(400);
    // Everything the UI actually reads survives the trim.
    expect(progress.attempts.length).toBeGreaterThan(0);
    expect(progress.solved).toBe(true);
    expect(progress.hintsRevealed).toBe(2);
  });
});
