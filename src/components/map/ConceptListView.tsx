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
 * real barrier), this is the equivalent required by docs/DESIGN_SYSTEM.md
 * §9: the same graph, same prerequisite structure, as a real list.
 */
export function ConceptListView({
  nodes,
  completedLessonSlugs,
  nodeDifficulty,
  rootIds,
  selectedId,
  onSelect,
}: {
  nodes: ConceptGraph["nodes"];
  completedLessonSlugs: ReadonlySet<string>;
  /** concept id -> resolved difficulty. Empty when the caller hasn't wired
   *  lesson difficulty data up yet, see `ConceptMapExplorer`'s prop doc. */
  nodeDifficulty: Map<string, Difficulty>;
  /** Concepts with no prerequisites, the map's genuine entry point(s). */
  rootIds: Set<string>;
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
            {/* `h2`, not `h3`. These six pillar headings are the top-level
                grouping of /map's main content, nothing on that page sits
                between them and its single `h1` ("The concept map", emitted by
                app/map/page.tsx). As `h3` the default state of the page (list
                view, nothing selected) produced an outline of h1 → h3 × 6 with
                no h2 at all, so a screen-reader user navigating by heading
                level, or reading the generated document outline, was told
                every pillar was a subsection of a section that does not
                exist. Selecting a concept made it worse rather than better:
                ConceptDetailPanel's own `h2` (the concept title) is a sibling
                region in the grid, so it arrives *after* these in DOM order,
                giving h1 → h3 × 6 → h2, a level jump forwards and then
                backwards. At h2 both readings are correct: the pillar groups
                and the detail panel are peers, which is exactly what they are
                on screen.

                Purely a semantic change, with no visual consequence: the
                heading's size, weight, colour and letterspacing all come from
                `.tech-label` (globals.css §"The technical voice"), and
                Tailwind's preflight resets every `h1`–`h6` to
                `font-size: inherit; font-weight: inherit; margin: 0`, so the
                tag name contributes nothing to how this renders. */}
            <h2 id={`map-list-${pillar.slug}`} className="tech-label text-pillar-text">
              {pillar.title}
            </h2>
            <ol className="mt-2 space-y-1.5">
              {pillarNodes.map((node) => {
                const completedCount = node.lessonSlugs.filter((slug) => completedLessonSlugs.has(slug)).length;
                const isCompleted = completedCount > 0 && completedCount === node.lessonSlugs.length;
                const isSelected = node.id === selectedId;
                const difficulty = nodeDifficulty.get(node.id);
                const isRoot = rootIds.has(node.id);
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
                        "flex min-h-11 w-full flex-col justify-center gap-0.5 rounded-(--radius-tight) border px-3 py-2 text-left transition-colors duration-(--dur-fast)",
                        isSelected
                          ? "border-pillar bg-pillar-wash"
                          : "border-border bg-surface hover:border-pillar-edge hover:bg-surface-muted"
                      )}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-foreground">{node.title}</span>
                        <span className="flex shrink-0 items-center gap-2">
                          {difficulty ? <DifficultyMark difficulty={difficulty} /> : null}
                          <span className="tech-label text-micro">Step {node.depth + 1}</span>
                          {isCompleted ? (
                            // "Completed" as a real `sr-only` text node, not an
                            // `aria-label` on this span: a `<span>` with no
                            // `role` is `generic`, ARIA prohibits naming a
                            // generic element, and every major screen reader
                            // drops the attribute, so the label was invisible
                            // to assistive tech while the only other child was
                            // an `aria-hidden` tick. In list view that is the
                            // *only* completion signal on the row, so without
                            // this a screen-reader user reading the text
                            // alternative to the graph could not tell which
                            // concepts they had finished. Same treatment as
                            // `LessonCompletionMark` and the graph node's tick
                            // in ConceptMapExplorer, deliberately identical so
                            // the three announce the same word.
                            <span className="text-pillar-text" title="Completed">
                              <span className="sr-only">Completed</span>
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                <path d="M2 6.2 5 9l5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                          ) : null}
                        </span>
                      </span>
                      {isRoot ? (
                        <span className="w-fit rounded-full border border-pillar-edge bg-pillar-wash px-1.5 py-0.5 text-micro font-semibold uppercase tracking-meta text-pillar-text">
                          Start here: no prerequisites
                        </span>
                      ) : prereqTitles.length > 0 ? (
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
