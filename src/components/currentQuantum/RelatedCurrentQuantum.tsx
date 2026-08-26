import Link from "next/link";
import { Eyebrow } from "@/components/ui/Typography";
import { getEntriesForLesson } from "@/lib/content/currentQuantum/registry";
import { CurrentQuantumCard } from "./CurrentQuantumCard";

/**
 * Reverse link from a lesson to the "Current Quantum" entries that cite it
 * (see `getEntriesForLesson`) — the moment a lesson stops being a closed
 * document and becomes "here's what's happening with this, right now."
 *
 * Deliberately self-contained: this is embedded at the bottom of every
 * lesson by `LessonLayout` (owned by another agent, currently mid-redesign
 * itself), so it makes no assumptions about its surroundings beyond sitting
 * in a normal content column — it renders nothing for the lessons with no
 * matching entry, and doesn't wrap itself in `PillarScope` (that would paint
 * a second atmosphere layer inside a page that already has one from the
 * lesson's own pillar). Each entry still gets its own `data-pillar` — via
 * the shared `CurrentQuantumCard` — for the curriculum area *that entry*
 * connects to, which is usually but not always this lesson's own pillar.
 *
 * `lessonTitle` is passed as `undefined` to `CurrentQuantumCard`: every
 * entry here is, by construction, already the one connected to *this*
 * lesson, so the card's "explained in" link back to it would be a
 * redundant self-link.
 */
export function RelatedCurrentQuantum({ lessonSlug }: { lessonSlug: string }) {
  const entries = getEntriesForLesson(lessonSlug);
  if (entries.length === 0) return null;

  return (
    <section aria-labelledby="current-quantum-heading" className="mt-12 max-w-3xl border-t border-border pt-10">
      <Eyebrow>Current Quantum</Eyebrow>
      <h2
        id="current-quantum-heading"
        className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground"
      >
        Real research connected to this lesson
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        {entries.length === 1
          ? "One dated, sourced development that leans on exactly what this lesson explains."
          : `${entries.length} dated, sourced developments that lean on exactly what this lesson explains.`}
      </p>

      <div className="mt-6 space-y-6">
        {entries.map((entry) => (
          <CurrentQuantumCard key={entry.slug} entry={entry} lessonTitle={undefined} headingLevel={3} />
        ))}
      </div>

      <p className="mt-5">
        <Link href="/current-quantum" className="text-sm font-medium text-pillar-text hover:underline">
          See every development in Current Quantum &rarr;
        </Link>
      </p>
    </section>
  );
}
