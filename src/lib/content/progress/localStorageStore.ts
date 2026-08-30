import { EMPTY_LESSON_PROGRESS, type LessonProgress, type LessonProgressStore } from "./types";

const STORAGE_KEY_PREFIX = "studyquantum:lesson-progress:";

/**
 * The pre-rename prefix. Every lesson a reader had finished before the
 * StudyQuantum rename is stored under it, and progress is the one thing on
 * this site a visitor cannot get back: there are no accounts, so the browser
 * *is* the record. Renaming the prefix without this would have read as "the
 * site forgot everything I did."
 *
 * See `ensureLegacyKeysMigrated` below for the copy-forward. Kept, not
 * deleted, once copied — see the note there.
 */
const LEGACY_STORAGE_KEY_PREFIX = "quantumlearn:lesson-progress:";

/**
 * Cached the same way as `lib/problems/progress/localStorageStore` — reads
 * must return a referentially stable value for `useSyncExternalStore`.
 */
const cache = new Map<string, LessonProgress>();

let legacyMigrationAttempted = false;

/**
 * Copies every `quantumlearn:lesson-progress:*` record forward to the
 * `studyquantum:` prefix, once per page load, before the first read.
 *
 * A whole-namespace sweep rather than a per-slug fallback on read: the store
 * is read one slug at a time *and* enumerated wholesale by
 * `getAllCompletedLessonSlugs`, and a per-slug fallback would have to be
 * duplicated in both paths (and the enumeration one would have to de-duplicate
 * the two prefixes). Copying the namespace once means every path below this
 * line only ever knows about one prefix.
 *
 * Details that matter:
 *  - The keys are collected before anything is written. `localStorage.key(i)`
 *    is index-based and inserting during the loop reshuffles the indices, so
 *    writing inline would skip records.
 *  - An existing new-prefix record always wins. The copy is a restore of
 *    history, never an overwrite of something the reader has done since.
 *  - `legacyMigrationAttempted` is set *before* the work, so a browser where
 *    `localStorage` throws (private mode, blocked site data) pays the cost
 *    once rather than on every read, and every caller below still gets a
 *    correct empty answer from its own try/catch.
 *  - The legacy keys are left in place. Removing them is unnecessary (a few KB
 *    of JSON), and keeping them means rolling this build back does not strand
 *    a reader's progress under a prefix the old code cannot see.
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
    // Storage unavailable or full — nothing is copied forward and every read
    // below simply sees no stored progress, which is the same graceful state
    // a first-time visitor is in. The page still renders.
  }
}

/** Parses one raw `localStorage` value the same way regardless of whether it came from `getItem` (this tab) or a `storage` event's `newValue` (another tab) — shared so the two paths can't drift apart. */
function parseProgress(raw: string | null): LessonProgress {
  if (!raw) return EMPTY_LESSON_PROGRESS;
  try {
    const parsed = { ...EMPTY_LESSON_PROGRESS, ...(JSON.parse(raw) as LessonProgress) };
    // Guard against a corrupted or previous-schema record whose fields
    // don't match this shape — e.g. `completed: "false"` (a truthy string)
    // would otherwise count as a completed lesson everywhere `completed`
    // is read as a boolean.
    return {
      completed: typeof parsed.completed === "boolean" ? parsed.completed : EMPTY_LESSON_PROGRESS.completed,
      completedAt: typeof parsed.completedAt === "number" ? parsed.completedAt : EMPTY_LESSON_PROGRESS.completedAt,
    };
  } catch {
    return EMPTY_LESSON_PROGRESS;
  }
}

function readFromStorage(slug: string): LessonProgress {
  const cached = cache.get(slug);
  if (cached) return cached;

  ensureLegacyKeysMigrated();

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
  // Before the write, not after: completing a lesson can be the very first
  // storage touch of a page view, and the sweep must not land on top of the
  // record this call is about to make (it skips keys that already exist, so
  // ordering it after would be harmless but only by accident).
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

/**
 * The one object every "no slugs to report" answer returns, so that answer is
 * referentially stable too. `new Set()` per call is a *different* empty set
 * each time, which is the one thing a `useSyncExternalStore` snapshot may
 * never be — see the catch below.
 */
const NO_COMPLETED_SLUGS: Set<string> = new Set();

export function invalidateCompletedLessonSlugsCache() {
  completedSlugsCache = null;
}

/** Enumerates every completed lesson slug — used for aggregate per-course progress. */
export function getAllCompletedLessonSlugs(): Set<string> {
  if (completedSlugsCache) return completedSlugsCache;
  if (typeof window === "undefined") return NO_COMPLETED_SLUGS;

  // The enumeration path. It scans keys by prefix, so it only sees a
  // pre-rename reader's history once that history has been copied forward.
  ensureLegacyKeysMigrated();

  const slugs = new Set<string>();
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (!key || !key.startsWith(STORAGE_KEY_PREFIX)) continue;
      const slug = key.slice(STORAGE_KEY_PREFIX.length);
      if (readFromStorage(slug).completed) slugs.add(slug);
    }
  } catch {
    // Storage blocked outright — `window.localStorage` itself throws a
    // SecurityError when a browser is set to block site data, and this
    // function IS `useCompletedLessonSlugs`'s `getSnapshot`. Returning a
    // fresh `new Set()` here meant every call produced a snapshot React's
    // `Object.is` check read as changed, so every component reading lesson
    // progress — `PrerequisiteReadout` (every lesson AND every problem
    // page), `CourseTimeline`, `ProblemsCatalog`, `ConceptMapExplorer`,
    // `ContinueLearning` — re-rendered forever and the tab hung with
    // "Maximum update depth exceeded". Caching the failure the same way
    // `readFromStorage` already caches its own makes the unavailable case
    // stable instead of fatal; a later successful write still calls
    // `invalidateCompletedLessonSlugsCache`, so this is not a permanent
    // latch.
    completedSlugsCache = NO_COMPLETED_SLUGS;
    return completedSlugsCache;
  }

  completedSlugsCache = slugs;
  return slugs;
}
