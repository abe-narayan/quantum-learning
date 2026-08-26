import { PILLARS } from "@/lib/content/curriculum";
import { DifficultyMark } from "@/components/curriculum/DifficultyMark";
import { cn } from "@/lib/utils";
import type { ConceptGraph } from "@/lib/content/concepts";
import type { Difficulty } from "@/lib/content/types";

/**
 * The text alternative to the pannable/zoomable graph: every concept, grouped
 * by pillar and ordered by prerequisite depth, as a plain reachable list.
 * A drag-to-pan canvas is a poor fit for keyboard and screen-reader use even
 * when every node is technically focusable (finding "where" a focused node
 * sits, or discovering it at all without scanning absolute positions, is the
 * real barrier) — this is the equivalent required by docs/DESIGN_SYSTEM.md
 * §9: the same graph, same prerequisite structure, as a real list.
 */
export function ConceptListView({
  nodes,
  completedLessonSlugs,
  nodeDifficulty,
  selectedId,
  onSelect,
}: {
  nodes: ConceptGraph["nodes"];
  completedLessonSlugs: ReadonlySet<string>;
  /** concept id -> resolved difficulty. Empty when the caller hasn't wired
   *  lesson difficulty data up yet — see `ConceptMapExplorer`'s prop doc. */
  nodeDifficulty: Map<string, Difficulty>;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));

  return (
    <div className="max-h-[560px] overflow-y-auto p-4 sm:p-5">
      {PILLARS.map((pillar) => {
        const pillarNodes = nodes
          .filter((node) => node.pillar === pillar.slug)
          .sort((a, b) => a.depth - b.depth || a.title.localeCompare(b.title));
        if (pillarNodes.length === 0) return null;

        return (
          <section key={pillar.slug} data-pillar={pillar.slug} aria-labelledby={`map-list-${pillar.slug}`} className="mb-6 last:mb-0">
            <h3 id={`map-list-${pillar.slug}`} className="tech-label text-pillar-text">
              {pillar.title}
            </h3>
            <ol className="mt-2 space-y-1.5">
              {pillarNodes.map((node) => {
                const completedCount = node.lessonSlugs.filter((slug) => completedLessonSlugs.has(slug)).length;
                const isCompleted = completedCount > 0 && completedCount === node.lessonSlugs.length;
                const isSelected = node.id === selectedId;
                const difficulty = nodeDifficulty.get(node.id);
                const prereqTitles = node.prerequisiteIds
                  .map((id) => nodesById.get(id)?.title)
                  .filter((title): title is string => Boolean(title));

                return (
                  <li key={node.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(node.id)}
                      aria-current={isSelected ? "true" : undefined}
                      className={cn(
                        "flex w-full flex-col gap-0.5 rounded-[--radius-tight] border px-3 py-2 text-left transition-colors duration-[--dur-fast]",
                        isSelected
                          ? "border-pillar-accent bg-pillar-wash"
                          : "border-border bg-surface hover:border-pillar-edge hover:bg-surface-muted"
                      )}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-foreground">{node.title}</span>
                        <span className="flex shrink-0 items-center gap-2">
                          {difficulty ? <DifficultyMark difficulty={difficulty} /> : null}
                          <span className="tech-label text-[0.625rem]">Step {node.depth + 1}</span>
                          {isCompleted ? (
                            <span className="text-pillar-text" aria-label="Completed" title="Completed">
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                <path d="M2 6.2 5 9l5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                          ) : null}
                        </span>
                      </span>
                      {prereqTitles.length > 0 ? (
                        <span className="text-xs text-muted-foreground">Requires: {prereqTitles.join(", ")}</span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
