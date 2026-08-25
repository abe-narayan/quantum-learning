"use client";

import { useMemo, useState } from "react";
import { ProblemFilters } from "@/components/problems/ProblemFilters";
import { CurrentQuantumCard } from "./CurrentQuantumCard";
import type { CurrentQuantumEntry } from "@/lib/content/currentQuantum/registry";

type CategoryFilter = "all" | CurrentQuantumEntry["category"];

const CATEGORY_OPTIONS: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "hardware milestone", label: "Hardware Milestone" },
  { id: "algorithms", label: "Algorithms" },
  { id: "error correction", label: "Error Correction" },
  { id: "quantum networking", label: "Quantum Networking" },
  { id: "sensing", label: "Sensing" },
  { id: "historical experiment", label: "Historical Experiment" },
  { id: "cryptography", label: "Cryptography" },
];

export function CurrentQuantumCatalog({
  entries,
  lessonTitles,
}: {
  entries: CurrentQuantumEntry[];
  /** Real lesson slug -> real lesson title, sourced from getAllLessonsMeta() on the server. */
  lessonTitles: Record<string, string>;
}) {
  const [category, setCategory] = useState<CategoryFilter>("all");

  const filtered = useMemo(() => {
    if (category === "all") return entries;
    return entries.filter((entry) => entry.category === category);
  }, [entries, category]);

  return (
    <div>
      <ProblemFilters label="Category" options={CATEGORY_OPTIONS} selected={category} onChange={setCategory} />

      <p className="mt-6 text-sm text-muted-foreground">
        {filtered.length} development{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length > 0 ? (
        <div className="mt-4 space-y-6">
          {filtered.map((entry) => (
            <CurrentQuantumCard key={entry.slug} entry={entry} lessonTitle={lessonTitles[entry.relatedLessonSlug]} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">No developments match this category yet.</p>
      )}
    </div>
  );
}
