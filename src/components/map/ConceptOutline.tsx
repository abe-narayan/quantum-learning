import Link from "next/link";
import { PILLARS } from "@/lib/content/curriculum";
import { DifficultyMark } from "@/components/curriculum/DifficultyMark";
import { buildConceptGraph } from "@/lib/content/concepts";
import type { Difficulty } from "@/lib/content/types";

/**
 * The server-rendered form of the concept map.
 *
 * WHY THIS EXISTS
 * ---------------
 * `/map` renders its graph through `LazyConceptMapExplorer`, which is a
 * `next/dynamic` import with `ssr: false`. That is the right call for the
 * canvas itself (it is a pointer-driven, `localStorage`-backed, pan-and-zoom
 * surface with no server meaning), but it meant the route's entire `<main>`
 * shipped as one 2.4KB box reading "Loading concept map…" with zero links in
 * it, while every other index page on the site server-renders its full
 * inventory (`/glossary` 550 links, `/problems` 793, `/lessons` 270,
 * `/simulators` 49). The page's own orientation copy promises the reader
 * "Read it as a graph or as a plain list, whichever you prefer" and, without
 * JavaScript, neither one existed. `ConceptListView` is that plain list, but
 * it lives *inside* the client-only explorer, so it was never the fallback it
 * was written to be: 59 concepts, their prerequisite structure and their
 * ~120 lesson links were reachable only by running the explorer.
 *
 * So this renders the same graph, from the same `buildConceptGraph()` data,
 * as plain server HTML: real headings, a real ordered list per pillar, and a
 * real `<a>` per lesson. It costs nothing in client JavaScript (it is a
 * server component, and `concepts.ts` is already in the explorer's bundle
 * either way), and it is what a crawler, a reader with JavaScript off, and a
 * reader on a slow connection see before the explorer chunk lands.
 *
 * WHAT IT IS NOT
 * --------------
 * Not a second interactive view. It has no selection, no detail panel and no
 * `onSelect`; picking a concept here means following a link to a lesson or to
 * the glossary entry, which is exactly what a document can do. The moment the
 * explorer is ready, `ConceptMapSurface` swaps it out for the real thing.
 * Keep the two in step in one respect only: both group by pillar and order by
 * prerequisite depth, so a reader who sees this first and the explorer second
 * is looking at the same map in the same order.
 */
export function ConceptOutline({
  lessonTitles,
  lessonDifficulty,
}: {
  /** lesson slug -> title, so each concept can name the lessons that teach it
   *  rather than linking a bare slug. Built on the server by `/map`'s page. */
  lessonTitles: Record<string, string>;
  /** lesson slug -> difficulty. A concept shows the hardest difficulty among
   *  the lessons that teach it, matching how `ConceptMapExplorer` resolves a
   *  node's difficulty for the graph and the list view. */
  lessonDifficulty: Record<string, Difficulty>;
}) {
  const graph = buildConceptGraph();
  const nodesById = new Map(graph.nodes.map((node) => [node.id, node]));
  const rank: Record<Difficulty, number> = {
    foundational: 0,
    intermediate: 1,
    advanced: 2,
    master: 3,
  };

  return (
    <div className="not-prose rounded-panel border border-border bg-surface">
      <p className="border-b border-border px-4 py-3 text-sm leading-relaxed text-muted-foreground sm:px-5">
        Every concept on the map, grouped by track and ordered so that nothing
        appears before the concepts it depends on. Each one links to the lessons
        that teach it.
      </p>
      {/* Deliberately not height-capped with `overflow-y-auto`, the way
          `ConceptListView` caps its own list inside the explorer's fixed
          panel. This is the document form of the map, and a document flows:
          a reader without JavaScript would otherwise get a nested scroll
          region holding 59 concepts, and the page would gain a scroll
          container whose children are all links (see
          lib/design/__tests__/scrollRegions.test.ts on why a tab stop there
          is noise and no tab stop there is a WCAG 2.1.1 failure, a choice
          worth not having to make). Nothing below this on the page but the
          footer, so letting it run its natural height costs no layout
          stability when the explorer takes over. */}
      <div className="p-4 sm:p-5">
        {PILLARS.map((pillar) => {
          const pillarNodes = graph.nodes
            .filter((node) => node.pillar === pillar.slug)
            .sort((a, b) => a.depth - b.depth || a.title.localeCompare(b.title));
          if (pillarNodes.length === 0) return null;

          return (
            <section
              key={pillar.slug}
              data-pillar={pillar.slug}
              aria-labelledby={`map-outline-${pillar.slug}`}
              className="mb-6 last:mb-0"
            >
              {/* `h2` for the same reason `ConceptListView` uses one: these six
                  pillar groups are the top-level structure of /map's main
                  content, directly under the page's single `h1`. */}
              <h2 id={`map-outline-${pillar.slug}`} className="tech-label text-pillar-text">
                {pillar.title}
              </h2>
              <ol className="mt-2 space-y-1.5">
                {pillarNodes.map((node) => {
                  const difficulty = node.lessonSlugs
                    .map((slug) => lessonDifficulty[slug])
                    .filter((value): value is Difficulty => Boolean(value))
                    .sort((a, b) => rank[b] - rank[a])[0];
                  const prereqTitles = node.prerequisiteIds
                    .map((id) => nodesById.get(id)?.title)
                    .filter((title): title is string => Boolean(title));

                  return (
                    <li
                      key={node.id}
                      className="rounded-(--radius-tight) border border-border bg-surface px-3 py-2"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                        <h3 className="text-sm font-medium text-foreground">{node.title}</h3>
                        <span className="flex shrink-0 items-center gap-2">
                          {difficulty ? <DifficultyMark difficulty={difficulty} /> : null}
                          <span className="tech-label text-micro">Step {node.depth + 1}</span>
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {node.definition}
                      </p>
                      {node.prerequisiteIds.length === 0 ? (
                        <p className="mt-1.5 w-fit rounded-full border border-pillar-edge bg-pillar-wash px-1.5 py-0.5 text-micro font-semibold uppercase tracking-meta text-pillar-text">
                          Start here: no prerequisites
                        </p>
                      ) : prereqTitles.length > 0 ? (
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          Requires: {prereqTitles.join(", ")}
                        </p>
                      ) : null}
                      {node.lessonSlugs.length > 0 ? (
                        <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                          {node.lessonSlugs.map((slug) => (
                            <li key={slug}>
                              <Link
                                href={`/lessons/${slug}`}
                                // `hover:decoration-pillar`, not
                                // `hover:decoration-current`: `current` is not
                                // one of the registered `decoration-*` values
                                // in this theme, so that class compiles to
                                // nothing at all. Same idiom as
                                // GlossaryFilter's term links.
                                className="text-xs text-pillar-text underline decoration-border underline-offset-2 hover:decoration-pillar"
                              >
                                {lessonTitles[slug] ?? slug}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
