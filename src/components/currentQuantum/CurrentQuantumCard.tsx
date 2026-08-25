import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { CurrentQuantumEntry } from "@/lib/content/currentQuantum/registry";

const CATEGORY_LABEL: Record<CurrentQuantumEntry["category"], string> = {
  algorithms: "Algorithms",
  "hardware milestone": "Hardware Milestone",
  "error correction": "Error Correction",
  "quantum networking": "Quantum Networking",
  sensing: "Sensing",
  "historical experiment": "Historical Experiment",
  cryptography: "Cryptography",
};

function formatDate(iso: string): string {
  // Entries may record only a year+month ("1994-11") when a more precise
  // date isn't confirmable; parsing as UTC and formatting with those two
  // fields keeps both "1994-11" and "2024-12-09" rendering sensibly.
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

export function CurrentQuantumCard({
  entry,
  lessonTitle,
}: {
  entry: CurrentQuantumEntry;
  /** Real lesson title for entry.relatedLessonSlug, sourced from getAllLessonsMeta() on the server. */
  lessonTitle: string | undefined;
}) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {formatDate(entry.date)}
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">{entry.title}</h2>
        </div>
        <Badge tone="brand">{CATEGORY_LABEL[entry.category]}</Badge>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{entry.summary}</p>

      <p className="mt-3 text-xs text-muted-foreground">
        Source:{" "}
        <a
          href={entry.source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-border underline-offset-2 hover:text-foreground"
        >
          {entry.source.name}
        </a>
      </p>

      <div className="mt-4 rounded-lg border border-brand/20 bg-brand/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">Why this matters</p>
        <p className="mt-1 text-sm text-foreground">{entry.whyThisMatters}</p>
        {lessonTitle ? (
          <Link
            href={`/lessons/${entry.relatedLessonSlug}`}
            className="mt-2 inline-block text-sm font-medium text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
          >
            Read the lesson: {lessonTitle}
          </Link>
        ) : null}
      </div>
    </Card>
  );
}
