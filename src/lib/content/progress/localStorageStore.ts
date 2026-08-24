import { EMPTY_LESSON_PROGRESS, type LessonProgress, type LessonProgressStore } from "./types";

const STORAGE_KEY_PREFIX = "quantumlearn:lesson-progress:";

/**
 * Cached the same way as `lib/problems/progress/localStorageStore` — reads
 * must return a referentially stable value for `useSyncExternalStore`.
 */
const cache = new Map<string, LessonProgress>();

function readFromStorage(slug: string): LessonProgress {
  const cached = cache.get(slug);
  if (cached) return cached;

  let progress = EMPTY_LESSON_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_PREFIX + slug);
    if (raw) progress = { ...EMPTY_LESSON_PROGRESS, ...(JSON.parse(raw) as LessonProgress) };
  } catch {
    progress = EMPTY_LESSON_PROGRESS;
  }

  cache.set(slug, progress);
  return progress;
}

function writeToStorage(slug: string, progress: LessonProgress) {
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
class LocalStorageLessonProgressStore implements LessonProgressStore {
  getLessonProgress(slug: string): LessonProgress {
    return readFromStorage(slug);
  }

  setCompleted(slug: string, completed: boolean): LessonProgress {
    const next: LessonProgress = { completed, completedAt: completed ? Date.now() : null };
    writeToStorage(slug, next);
    invalidateCompletedLessonSlugsCache();
    return next;
  }
}

/** No-op store used when `window` isn't available (SSR) — never persists. */
class InMemoryLessonProgressStore implements LessonProgressStore {
  private data = new Map<string, LessonProgress>();

  getLessonProgress(slug: string): LessonProgress {
    return this.data.get(slug) ?? EMPTY_LESSON_PROGRESS;
  }

  setCompleted(slug: string, completed: boolean): LessonProgress {
    const next: LessonProgress = { completed, completedAt: completed ? Date.now() : null };
    this.data.set(slug, next);
    return next;
  }
}

let store: LessonProgressStore | null = null;

/** The active `LessonProgressStore` — localStorage-backed in the browser, an in-memory stand-in during SSR. */
export function getLessonProgressStore(): LessonProgressStore {
  if (!store) {
    store = typeof window === "undefined" ? new InMemoryLessonProgressStore() : new LocalStorageLessonProgressStore();
  }
  return store;
}

/**
 * Referentially stable (per the same rule as `cache` above) so it can back
 * a `useSyncExternalStore` snapshot directly. Recomputed lazily and
 * invalidated on every write.
 */
let completedSlugsCache: Set<string> | null = null;

export function invalidateCompletedLessonSlugsCache() {
  completedSlugsCache = null;
}

/** Enumerates every completed lesson slug — used for aggregate per-course progress. */
export function getAllCompletedLessonSlugs(): Set<string> {
  if (completedSlugsCache) return completedSlugsCache;
  if (typeof window === "undefined") return new Set();

  const slugs = new Set<string>();
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (!key || !key.startsWith(STORAGE_KEY_PREFIX)) continue;
      const slug = key.slice(STORAGE_KEY_PREFIX.length);
      if (readFromStorage(slug).completed) slugs.add(slug);
    }
  } catch {
    return new Set();
  }

  completedSlugsCache = slugs;
  return slugs;
}
