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

function readFromStorage(slug: string): ProblemProgress {
  const cached = cache.get(slug);
  if (cached) return cached;

  let progress = EMPTY_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_PREFIX + slug);
    if (raw) progress = { ...EMPTY_PROGRESS, ...(JSON.parse(raw) as ProblemProgress) };
  } catch {
    progress = EMPTY_PROGRESS;
  }

  cache.set(slug, progress);
  return progress;
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
