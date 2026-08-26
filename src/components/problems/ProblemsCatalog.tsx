"use client";

import { useMemo, useState } from "react";
import { ProblemFilters } from "./ProblemFilters";
import { ProblemCard } from "./ProblemCard";
import { getCourse } from "@/lib/content/curriculum";
import type { Pillar } from "@/lib/content/types";
import type { ProblemDifficulty, ProblemMeta, ProblemType } from "@/lib/problems/types";

type PillarFilter = "all" | Pillar;
type DifficultyFilter = "all" | ProblemDifficulty;
type TypeFilter = "all" | ProblemType;

const PILLAR_OPTIONS: { id: PillarFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "quantum-mechanics", label: "Quantum Mechanics" },
  { id: "quantum-computing", label: "Quantum Computing" },
  { id: "quantum-hardware", label: "Quantum Hardware" },
  { id: "quantum-software", label: "Quantum Software" },
  { id: "quantum-mastery", label: "Quantum Mastery" },
  { id: "apex", label: "Apex" },
];

const DIFFICULTY_OPTIONS: { id: DifficultyFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

const TYPE_OPTIONS: { id: TypeFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "multiple-choice", label: "Multiple Choice" },
  { id: "numeric", label: "Numeric" },
  { id: "conceptual", label: "Short Answer" },
];

export function ProblemsCatalog({ problems }: { problems: ProblemMeta[] }) {
  const [pillar, setPillar] = useState<PillarFilter>("all");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [type, setType] = useState<TypeFilter>("all");

  const filtered = useMemo(() => {
    return problems.filter((problem) => {
      const course = getCourse(problem.course);
      const matchesPillar = pillar === "all" || course?.pillar === pillar;
      const matchesDifficulty = difficulty === "all" || problem.difficulty === difficulty;
      const matchesType = type === "all" || problem.problemType === type;
      return matchesPillar && matchesDifficulty && matchesType;
    });
  }, [problems, pillar, difficulty, type]);

  return (
    <div>
      <div className="flex flex-wrap gap-x-8 gap-y-4">
        <ProblemFilters label="Topic" options={PILLAR_OPTIONS} selected={pillar} onChange={setPillar} />
        <ProblemFilters label="Difficulty" options={DIFFICULTY_OPTIONS} selected={difficulty} onChange={setDifficulty} />
        <ProblemFilters label="Type" options={TYPE_OPTIONS} selected={type} onChange={setType} />
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        {filtered.length} problem{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length > 0 ? (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((problem) => (
            <ProblemCard key={problem.slug} problem={problem} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">No problems match these filters yet.</p>
      )}
    </div>
  );
}
