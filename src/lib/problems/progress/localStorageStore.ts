import { EMPTY_PROGRESS, type ProblemAttempt, type ProblemProgress, type ProgressStore } from "./types";

const STORAGE_KEY_PREFIX = "studyquantum:problem-progress:";

/**
 * The pre-rename prefix. Every attempt, revealed hint and solved problem a
 * reader accumulated before the StudyQuantum rename lives under it, and this
 * site has no accounts, so the browser is the only copy. Renaming without a
 * migration would have silently emptied it.
 *
 * See `ensureLegacyKeysMigrated` below. Mirrors
 * src/lib/content/progress/localStorageStore.ts, which does the same thing for
 * lesson progress and carries the fuller version of this reasoning.
 */
const LEGACY_STORAGE_KEY_PREFIX = "quantumlearn:problem-progress:";

/**
 * `useSyncExternalStore` requires `getSnapshot` to return a referentially
 * stable value when nothing has changed — otherwise React sees a "new"
 * snapshot on every render and re-renders forever (an infinite loop, a
 * real bug caught by browser-testing this feature, not a hypothetical).
 * `localStorage.getItem` + `JSON.parse` produces a fresh object on every
 * call, so reads are cached here and only replaced on an actual write.
 */
const cache = new Map<string, ProblemProgress>();

/**
 * How much of a submission is kept, and how many submissions.
 *
 * The attempt log is written on every Submit and grows forever, and
 * `attempt.submitted` is the reader's raw text with no bound on its length.
 * That combination is a storage bomb, and it was reachable by accident rather
 * than only by an attacker: a conceptual problem's answer box takes a paste,
 * and pasting a 100KB block and pressing Submit twenty times (a plausible
 * "why is this still wrong" session with an essay in the clipboard) wrote
 * **2.07 MB** into one problem's record. Measured in headless Chrome: 52 such
 * submissions exhaust the origin's ~5MB `localStorage` quota outright.
 *
 * What makes that a data-loss bug rather than a waste of disk is the catch in
 * `writeToStorage` below, and the identical one in the lesson store. Once the
 * origin is full, every subsequent `setItem` throws `QuotaExceededError`, both
 * stores swallow it by design (the alternative is a white screen), and from
 * that moment the reader's lesson completions and problem progress silently
 * stop persisting — on a site whose whole record of a reader's work is this
 * one origin's storage, with no account to fall back on and nothing on screen
 * to say anything went wrong.
 *
 * The caps are deliberately generous, and behaviour-neutral for every current
 * reader of this data: `attempts` is consumed in exactly two places
 * (`ProblemViewClient`'s `attempted` and `ProblemsCatalog`'s "started" filter)
 * and both ask only whether the array is non-empty, while `attempt.submitted`
 * is written here and read by nothing at all. Truncating rather than dropping
 * the field keeps the record useful for the "show me my last answer" feature
 * the type was clearly shaped for, at a bounded 500 characters per attempt and
 * a bounded 50 attempts per problem — about 25KB worst case per problem
 * instead of unbounded.
 */
const MAX_STORED_SUBMISSION_CHARS = 500;
const MAX_STORED_ATTEMPTS = 50;

/**
 * The attempt list to persist: the newest `MAX_STORED_ATTEMPTS` entries, each
 * with its submission truncated. Shared by both store implementations so the
 * in-memory SSR stand-in cannot drift from the real one.
 */
export function appendBoundedAttempt(
  attempts: readonly ProblemAttempt[],
  attempt: ProblemAttempt
): ProblemAttempt[] {
  const bounded: ProblemAttempt =
    attempt.submitted.length > MAX_STORED_SUBMISSION_CHARS
      ? { ...attempt, submitted: attempt.submitted.slice(0, MAX_STORED_SUBMISSION_CHARS) }
      : attempt;
  const next = [...attempts, bounded];
  return next.length > MAX_STORED_ATTEMPTS ? next.slice(next.length - MAX_STORED_ATTEMPTS) : next;
}

let legacyMigrationAttempted = false;

/**
 * Copies every `quantumlearn:problem-progress:*` record forward to the
 * `studyquantum:` prefix, once per page load, before the first read.
 *
 * Keys are collected before any write, because `localStorage.key(i)` is
 * index-based and inserting mid-loop reshuffles the indices. An existing
 * new-prefix record always wins, so this restores history and never overwrites
 * work done since. `legacyMigrationAttempted` is set before the work so a
 * browser where `localStorage` itself throws (private mode, blocked site data)
 * pays for the failure once instead of on every read, and every caller still
 * gets a correct empty answer from its own try/catch. The legacy keys are left
 * in place: they are a few KB, and keeping them means a rollback does not
 * strand a reader's progress under a prefix the previous build cannot see.
 */
function ensureLegacyKeysMigrated() {
  if (legacyMigrationAttempted) return;
  legacyMigrationAttempted = true;
  try {
    const pending: [string, string][] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (!key || !key.startsWith(LEGACY_STORAGE_KEY_PREFIX)) continue;
      const value = window.localStorage.getItem(key);
      if (value !== null) {
        pending.push([STORAGE_KEY_PREFIX + key.slice(LEGACY_STORAGE_KEY_PREFIX.length), value]);
      }
    }
    for (const [key, value] of pending) {
      if (window.localStorage.getItem(key) === null) window.localStorage.setItem(key, value);
    }
  } catch {
    // Storage unavailable or full — nothing is copied forward, every read
    // below sees no stored progress, and the page renders exactly as it does
    // for a first-time visitor.
  }
}

/** Parses one raw `localStorage` value the same way regardless of whether it came from `getItem` (this tab) or a `storage` event's `newValue` (another tab) — shared so the two paths can't drift apart. */
function parseProgress(raw: string | null): ProblemProgress {
  if (!raw) return EMPTY_PROGRESS;
  try {
    const parsed = { ...EMPTY_PROGRESS, ...(JSON.parse(raw) as ProblemProgress) };
    // Guard against a corrupted or previous-schema record whose fields
    // don't match this shape — e.g. `attempts` not being an array would
    // otherwise throw downstream in recordAttempt's `[...current.attempts]`.
    // The tail cap is applied on read as well as on write, so a record an
    // earlier build already grew past the cap shrinks the first time it is
    // touched instead of staying bloated until the reader clears site data.
    // Only the count is ever read (see `appendBoundedAttempt`), so dropping
    // the oldest entries changes nothing a reader can observe.
    const attempts = Array.isArray(parsed.attempts) ? parsed.attempts : EMPTY_PROGRESS.attempts;
    return {
      ...parsed,
      attempts:
        attempts.length > MAX_STORED_ATTEMPTS ? attempts.slice(attempts.length - MAX_STORED_ATTEMPTS) : attempts,
      hintsRevealed: typeof parsed.hintsRevealed === "number" ? parsed.hintsRevealed : EMPTY_PROGRESS.hintsRevealed,
      // Same guard for the booleans: a corrupted truthy string (e.g.
      // `solved: "false"`) would otherwise mark the problem solved / the
      // solution revealed everywhere these are read as booleans.
      solved: typeof parsed.solved === "boolean" ? parsed.solved : EMPTY_PROGRESS.solved,
      solutionRevealed:
        typeof parsed.solutionRevealed === "boolean" ? parsed.solutionRevealed : EMPTY_PROGRESS.solutionRevealed,
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

function readFromStorage(slug: string): ProblemProgress {
  const cached = cache.get(slug);
  if (cached) return cached;

  ensureLegacyKeysMigrated();

  let progress: ProblemProgress;
  try {
    progress = parseProgress(window.localStorage.getItem(STORAGE_KEY_PREFIX + slug));
  } catch {
    progress = EMPTY_PROGRESS;
  }

  cache.set(slug, progress);
  return progress;
}

/**
 * Applies a native `storage` event (fired only in *other* tabs/windows that
 * share this origin, never the tab that made the write) to this tab's
 * module-level `cache`, keeping it from going stale when progress is
 * recorded elsewhere. Returns whether the event was actually relevant to
 * this store, so the caller (`useProblemProgress`) only re-notifies React
 * subscribers when something it owns actually changed.
 */
export function handleExternalStorageChange(event: StorageEvent): boolean {
  if (event.key === null) {
    // `localStorage.clear()` in another tab — nothing keyed is safe to assume anymore.
    cache.clear();
    return true;
  }
  if (!event.key.startsWith(STORAGE_KEY_PREFIX)) return false;

  const slug = event.key.slice(STORAGE_KEY_PREFIX.length);
  cache.set(slug, parseProgress(event.newValue));
  return true;
}

function writeToStorage(slug: string, progress: ProblemProgress) {
  cache.set(slug, progress);
  // Every write on this store is preceded by a `readFromStorage`, which has
  // already run the sweep — but `resetProblem` writes without reading, so the
  // guard belongs here too rather than relying on the caller.
  ensureLegacyKeysMigrated();
  try {
    window.localStorage.setItem(STORAGE_KEY_PREFIX + slug, JSON.stringify(progress));
  } catch {
    // Storage unavailable (private browsing, quota, etc.) — the cache
    // above still makes progress work within the session; it just won't
    // survive a reload.
  }
}

/** Backed by `window.localStorage`. Only ever constructed client-side. */
class LocalStorageProgressStore implements ProgressStore {
  getProblemProgress(slug: string): ProblemProgress {
    return readFromStorage(slug);
  }

  recordAttempt(slug: string, attempt: ProblemAttempt): ProblemProgress {
    const current = readFromStorage(slug);
    const next: ProblemProgress = {
      ...current,
      attempts: appendBoundedAttempt(current.attempts, attempt),
      solved: current.solved || attempt.status === "correct",
    };
    writeToStorage(slug, next);
    return next;
  }

  revealHint(slug: string, hintsRevealed: number): ProblemProgress {
    const current = readFromStorage(slug);
    const next: ProblemProgress = {
      ...current,
      hintsRevealed: Math.max(current.hintsRevealed, hintsRevealed),
    };
    writeToStorage(slug, next);
    return next;
  }

  revealSolution(slug: string): ProblemProgress {
    const current = readFromStorage(slug);
    const next: ProblemProgress = { ...current, solutionRevealed: true };
    writeToStorage(slug, next);
    return next;
  }

  resetProblem(slug: string): ProblemProgress {
    writeToStorage(slug, EMPTY_PROGRESS);
    return EMPTY_PROGRESS;
  }
}

/** No-op store used when `window` isn't available (SSR) — never persists. */
class InMemoryProgressStore implements ProgressStore {
  private data = new Map<string, ProblemProgress>();

  getProblemProgress(slug: string): ProblemProgress {
    return this.data.get(slug) ?? EMPTY_PROGRESS;
  }

  recordAttempt(slug: string, attempt: ProblemAttempt): ProblemProgress {
    const current = this.getProblemProgress(slug);
    const next: ProblemProgress = {
      ...current,
      attempts: appendBoundedAttempt(current.attempts, attempt),
      solved: current.solved || attempt.status === "correct",
    };
    this.data.set(slug, next);
    return next;
  }

  revealHint(slug: string, hintsRevealed: number): ProblemProgress {
    const current = this.getProblemProgress(slug);
    const next: ProblemProgress = { ...current, hintsRevealed: Math.max(current.hintsRevealed, hintsRevealed) };
    this.data.set(slug, next);
    return next;
  }

  revealSolution(slug: string): ProblemProgress {
    const current = this.getProblemProgress(slug);
    const next: ProblemProgress = { ...current, solutionRevealed: true };
    this.data.set(slug, next);
    return next;
  }

  resetProblem(slug: string): ProblemProgress {
    this.data.delete(slug);
    return EMPTY_PROGRESS;
  }
}

let store: ProgressStore | null = null;

/** The active `ProgressStore` — localStorage-backed in the browser, an in-memory stand-in during SSR. */
export function getProgressStore(): ProgressStore {
  if (!store) {
    store = typeof window === "undefined" ? new InMemoryProgressStore() : new LocalStorageProgressStore();
  }
  return store;
}
