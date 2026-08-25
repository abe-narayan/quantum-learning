import { EMPTY_LESSON_PROGRESS, type LessonProgress, type LessonProgressStore } from "./types";

const STORAGE_KEY_PREFIX = "quantumlearn:lesson-progress:";

/**
 * Cached the same way as `lib/problems/progress/localStorageStore` — reads
 * must return a referentially stable value for `useSyncExternalStore`.
 */
const cache = new Map<string, LessonProgress>();

/** Parses one raw `localStorage` value the same way regardless of whether it came from `getItem` (this tab) or a `storage` event's `newValue` (another tab) — shared so the two paths can't drift apart. */
function parseProgress(raw: string | null): LessonProgress {
  if (!raw) return EMPTY_LESSON_PROGRESS;
  try {
    return { ...EMPTY_LESSON_PROGRESS, ...(JSON.parse(raw) as LessonProgress) };
  } catch {
    return EMPTY_LESSON_PROGRESS;
  }
}

function readFromStorage(slug: string): LessonProgress {
  const cached = cache.get(slug);
  if (cached) return cached;

  let progress: LessonProgress;
  try {
    progress = parseProgress(window.localStorage.getItem(STORAGE_KEY_PREFIX + slug));
  } catch {
    progress = EMPTY_LESSON_PROGRESS;
  }

  cache.set(slug, progress);
  return progress;
}

/**
 * Applies a native `storage` event (fired only in *other* tabs/windows that
 * share this origin, never the tab that made the write) to this tab's
 * module-level `cache`, keeping it from going stale when a lesson is
 * completed elsewhere. Returns whether the event was actually relevant to
 * this store, so the caller (`useLessonProgress`) only re-notifies React
 * subscribers when something it owns actually changed.
 */
export function handleExternalStorageChange(event: StorageEvent): boolean {
  if (event.key === null) {
    // `localStorage.clear()` in another tab — nothing keyed is safe to assume anymore.
    cache.clear();
    invalidateCompletedLessonSlugsCache();
    return true;
  }
  if (!event.key.startsWith(STORAGE_KEY_PREFIX)) return false;

  const slug = event.key.slice(STORAGE_KEY_PREFIX.length);
  cache.set(slug, parseProgress(event.newValue));
  invalidateCompletedLessonSlugsCache();
  return true;
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
