import { EMPTY_PROGRESS, type ProblemAttempt, type ProblemProgress, type ProgressStore } from "./types";

const STORAGE_KEY_PREFIX = "quantumlearn:problem-progress:";

/**
 * `useSyncExternalStore` requires `getSnapshot` to return a referentially
 * stable value when nothing has changed — otherwise React sees a "new"
 * snapshot on every render and re-renders forever (an infinite loop, a
 * real bug caught by browser-testing this feature, not a hypothetical).
 * `localStorage.getItem` + `JSON.parse` produces a fresh object on every
 * call, so reads are cached here and only replaced on an actual write.
 */
const cache = new Map<string, ProblemProgress>();

/** Parses one raw `localStorage` value the same way regardless of whether it came from `getItem` (this tab) or a `storage` event's `newValue` (another tab) — shared so the two paths can't drift apart. */
function parseProgress(raw: string | null): ProblemProgress {
  if (!raw) return EMPTY_PROGRESS;
  try {
    const parsed = { ...EMPTY_PROGRESS, ...(JSON.parse(raw) as ProblemProgress) };
    // Guard against a corrupted or previous-schema record whose fields
    // don't match this shape — e.g. `attempts` not being an array would
    // otherwise throw downstream in recordAttempt's `[...current.attempts]`.
    return {
      ...parsed,
      attempts: Array.isArray(parsed.attempts) ? parsed.attempts : EMPTY_PROGRESS.attempts,
      hintsRevealed: typeof parsed.hintsRevealed === "number" ? parsed.hintsRevealed : EMPTY_PROGRESS.hintsRevealed,
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

function readFromStorage(slug: string): ProblemProgress {
  const cached = cache.get(slug);
  if (cached) return cached;

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
      attempts: [...current.attempts, attempt],
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
      attempts: [...current.attempts, attempt],
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
