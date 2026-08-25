import Link from "next/link";
import { getEntriesForLesson } from "@/lib/content/currentQuantum/registry";

/**
 * Entries may record only a year+month ("1994-11") when a more precise date
 * isn't confirmable; parsing as UTC and formatting with those two fields
 * keeps both "1994-11" and "2024-12-09" rendering sensibly. Mirrors
 * `formatDate` in `CurrentQuantumCard.tsx` — kept local rather than shared
 * since it's a small, self-contained formatting rule.
 */
function formatDate(iso: string): string {
  const parts = iso.split("-").map(Number);
  const [year, month, day] = parts;
  const date = new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: day ? "numeric" : undefined,
    timeZone: "UTC",
  });
}

/**
 * Reverse link from a lesson to the "Current Quantum" entries that cite it
 * (see `getEntriesForLesson`). No authoring required on the lesson side —
 * this renders nothing for the ~170 lessons with zero matching entries, and
 * a compact card per match otherwise.
 *
 * `/current-quantum`'s entries have no stable per-entry DOM id (the catalog
 * is a client-filtered list, see `CurrentQuantumCatalog.tsx`), so links here
 * point at the catalog page itself rather than an unreliable anchor.
 */
export function RelatedCurrentQuantum({ lessonSlug }: { lessonSlug: string }) {
  const entries = getEntriesForLesson(lessonSlug);
  if (entries.length === 0) return null;

  return (
    <div className="mt-10 max-w-3xl border-t border-border pt-8">
      <h2 className="text-sm font-semibold text-foreground">Connected to real, recent research</h2>
      <ul className="mt-4 space-y-3">
        {entries.map((entry) => (
          <li key={entry.slug} className="rounded-2xl border border-border bg-surface-muted/60 p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {formatDate(entry.date)}
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">{entry.title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{entry.whyThisMatters}</p>
            <Link href="/current-quantum" className="mt-2 inline-block text-sm text-brand hover:underline">
              See {entry.title} in Current Quantum
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
