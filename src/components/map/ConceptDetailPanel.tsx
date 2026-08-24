import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getConcept, type ConceptNode, type SimulatorId } from "@/lib/content/concepts";

const PILLAR_LABEL: Record<ConceptNode["pillar"], string> = {
  "quantum-mechanics": "Quantum Mechanics",
  "quantum-computing": "Quantum Computing",
  "quantum-hardware": "Quantum Hardware",
  "quantum-software": "Quantum Software",
};

const PILLAR_TONE: Record<ConceptNode["pillar"], "brand" | "accent" | "neutral" | "warning"> = {
  "quantum-mechanics": "brand",
  "quantum-computing": "accent",
  "quantum-hardware": "warning",
  "quantum-software": "neutral",
};

function simulatorHref(simulatorId: SimulatorId) {
  return `/simulators#${simulatorId}`;
}

export function ConceptDetailPanel({
  node,
  lessonTitles,
  onSelectConcept,
  onClose,
}: {
  node: ConceptNode;
  /** Real lesson slug -> real lesson title, sourced from getAllLessonsMeta() on the server. */
  lessonTitles: Record<string, string>;
  onSelectConcept: (id: string) => void;
  onClose: () => void;
}) {
  const prerequisites = node.prerequisiteIds
    .map((id) => getConcept(id))
    .filter((concept): concept is ConceptNode => concept !== undefined);

  const coveredIn = node.lessonSlugs
    .map((slug) => ({ slug, title: lessonTitles[slug] }))
    .filter((lesson): lesson is { slug: string; title: string } => Boolean(lesson.title));

  return (
    <div className="flex h-full flex-col overflow-y-auto p-5">
      <div className="flex items-start justify-between gap-3">
        <Badge tone={PILLAR_TONE[node.pillar]}>{PILLAR_LABEL[node.pillar]}</Badge>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close concept details"
          className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <h2 className="mt-3 text-xl font-semibold tracking-tight text-foreground">{node.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{node.definition}</p>

      {node.simulatorId ? (
        <Button href={simulatorHref(node.simulatorId)} variant="secondary" size="sm" className="mt-4 self-start">
          Try the simulator
        </Button>
      ) : null}

      <div className="mt-6">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Covered in</h3>
        {coveredIn.length > 0 ? (
          <ul className="mt-2 space-y-1.5">
            {coveredIn.map((lesson) => (
              <li key={lesson.slug}>
                <Link
                  href={`/lessons/${lesson.slug}`}
                  className="text-sm text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
                >
                  {lesson.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">No linked lesson found.</p>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Prerequisites</h3>
        {prerequisites.length > 0 ? (
          <ul className="mt-2 space-y-1.5">
            {prerequisites.map((prereq) => (
              <li key={prereq.id}>
                <button
                  type="button"
                  onClick={() => onSelectConcept(prereq.id)}
                  className="text-sm text-foreground underline decoration-border underline-offset-2 hover:text-brand hover:decoration-brand"
                >
                  {prereq.title}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">No prerequisites — this is a starting point.</p>
        )}
      </div>
    </div>
  );
}
