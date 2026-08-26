"use client";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { buildConceptGraph, type ConceptGraph, type ConceptNode } from "@/lib/content/concepts";
import { useCompletedLessonSlugs } from "@/lib/content/progress";
import { PILLARS } from "@/lib/content/curriculum";
import { DifficultyMark } from "@/components/curriculum/DifficultyMark";
import type { Difficulty } from "@/lib/content/types";
import { cn } from "@/lib/utils";
import { ConceptDetailPanel } from "./ConceptDetailPanel";
import { ConceptListView } from "./ConceptListView";

const NODE_WIDTH = 152;
// Tall enough for a title line plus a compact `DifficultyMark` line below it
// (was 52, title-only) — ROW_HEIGHT in lib/content/concepts.ts is 160, so
// there's ample headroom before this risks colliding with the next depth row.
const NODE_HEIGHT = 68;
const MIN_SCALE = 0.4;
const MAX_SCALE = 1.75;
/** Padding added around each pillar's node cluster to draw its background
 *  "region" band — wide enough that the band reads as a zone, not a hug. */
const BAND_PADDING = 70;

const DIFFICULTY_RANK: Record<Difficulty, number> = {
  foundational: 0,
  intermediate: 1,
  advanced: 2,
  master: 3,
};

/**
 * A concept can cite lessons of different difficulty; the map shows the
 * hardest one a reader will need, not an average — the honest "how hard does
 * this concept get" signal. Returns `undefined` (rendering nothing) when
 * `lessonDifficulty` wasn't supplied or none of the concept's lessons appear
 * in it, so a caller that hasn't wired the data up yet degrades cleanly
 * instead of showing a wrong or invented level. See the prop doc on
 * `ConceptMapExplorer` for exactly what the caller needs to pass.
 */
function resolveNodeDifficulty(
  node: ConceptNode,
  lessonDifficulty: Record<string, Difficulty> | undefined
): Difficulty | undefined {
  if (!lessonDifficulty) return undefined;
  let result: Difficulty | undefined;
  for (const slug of node.lessonSlugs) {
    const candidate = lessonDifficulty[slug];
    if (!candidate) continue;
    if (!result || DIFFICULTY_RANK[candidate] > DIFFICULTY_RANK[result]) result = candidate;
  }
  return result;
}

/**
 * The edges + node buttons + pillar region bands, split into their own
 * memoized component so panning/zooming (which updates `transform` on every
 * pointermove/wheel tick) only re-renders the cheap transform wrapper below,
 * not this list — without the split, every drag pixel recreated all ~60 node
 * buttons and ~60 SVG paths.
 */
const ConceptMapGraph = memo(function ConceptMapGraph({
  graph,
  nodesById,
  bands,
  highlighted,
  highlightPillar,
  selectedId,
  completedLessonSlugs,
  nodeDifficulty,
  onSelect,
  onHover,
  onHoverEnd,
  onFocusNode,
}: {
  graph: ConceptGraph;
  nodesById: Map<string, ConceptGraph["nodes"][number]>;
  bands: { pillar: ConceptNode["pillar"]; left: number; width: number }[];
  highlighted: Set<string> | null;
  /** The pillar whose accent color the currently-highlighted edges should
   *  borrow (the hovered/focused node's pillar) — `undefined` when nothing
   *  is highlighted, in which case edges use the neutral baseline stroke. */
  highlightPillar: ConceptNode["pillar"] | undefined;
  selectedId: string | null;
  completedLessonSlugs: ReadonlySet<string>;
  /** concept id -> resolved difficulty, from `resolveNodeDifficulty`. Empty
   *  when the caller hasn't supplied lesson difficulty data yet. */
  nodeDifficulty: Map<string, Difficulty>;
  onSelect: (id: string) => void;
  onHover: (id: string) => void;
  onHoverEnd: (id: string) => void;
  onFocusNode: (id: string) => void;
}) {
  return (
    <>
      {bands.map((band) => (
        <div
          key={band.pillar}
          data-pillar={band.pillar}
          aria-hidden="true"
          data-decorative=""
          className="absolute top-0 bg-pillar-wash"
          style={{ left: band.left, width: band.width, height: graph.height }}
        />
      ))}

      <svg
        width={graph.width}
        height={graph.height}
        className="pointer-events-none absolute left-0 top-0"
        aria-hidden="true"
        {...(highlightPillar ? { "data-pillar": highlightPillar } : null)}
      >
        {graph.edges.map((edge) => {
          const from = nodesById.get(edge.from);
          const to = nodesById.get(edge.to);
          if (!from || !to) return null;
          const isHighlighted = highlighted ? highlighted.has(edge.from) && highlighted.has(edge.to) : false;
          const dimmed = highlighted ? !isHighlighted : false;
          const midY = (from.y + to.y) / 2;
          return (
            <path
              key={`${edge.from}-${edge.to}`}
              d={`M ${from.x} ${from.y + NODE_HEIGHT / 2} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y - NODE_HEIGHT / 2}`}
              fill="none"
              stroke={isHighlighted ? "var(--pillar-accent)" : dimmed ? "var(--border)" : "var(--border-strong)"}
              strokeWidth={isHighlighted ? 1.75 : 1}
              strokeOpacity={isHighlighted ? 0.95 : dimmed ? 0.3 : 0.65}
            />
          );
        })}
      </svg>

      {graph.nodes.map((node) => {
        const completedCount = node.lessonSlugs.filter((slug) => completedLessonSlugs.has(slug)).length;
        const isCompleted = completedCount > 0 && completedCount === node.lessonSlugs.length;
        const dimmed = highlighted ? !highlighted.has(node.id) : false;
        const isSelected = node.id === selectedId;
        const difficulty = nodeDifficulty.get(node.id);

        return (
          <button
            key={node.id}
            type="button"
            data-pillar={node.pillar}
            onClick={() => onSelect(node.id)}
            onMouseEnter={() => onHover(node.id)}
            onMouseLeave={() => onHoverEnd(node.id)}
            onFocus={() => {
              onHover(node.id);
              onFocusNode(node.id);
            }}
            onBlur={() => onHoverEnd(node.id)}
            style={{
              left: node.x,
              top: node.y,
              width: NODE_WIDTH,
              minHeight: NODE_HEIGHT,
            }}
            className={cn(
              "absolute flex -translate-x-1/2 -translate-y-1/2 flex-col justify-center gap-1 rounded-[--radius-tight] border bg-surface px-3 py-2 text-left text-xs font-medium shadow-sm transition-[opacity,box-shadow,border-color] duration-[--dur-fast] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted",
              isSelected ? "border-pillar-accent ring-2 ring-pillar-accent/40" : "border-border hover:border-pillar-accent/60",
              dimmed ? "opacity-30" : "opacity-100"
            )}
          >
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-pillar-accent" aria-hidden="true" />
              <span className="text-foreground">{node.title}</span>
              {isCompleted ? (
                <span className="ml-auto shrink-0 text-pillar-text" aria-label="Completed" title="Completed">
                  ✓
                </span>
              ) : null}
            </span>
            {difficulty ? <DifficultyMark difficulty={difficulty} className="pl-3.5" /> : null}
          </button>
        );
      })}
    </>
  );
});

export function ConceptMapExplorer({
  lessonTitles,
  lessonDifficulty,
}: {
  lessonTitles: Record<string, string>;
  /**
   * Real lesson slug -> that lesson's authored `Difficulty`, sourced from
   * `getAllLessonsMeta()` exactly like `lessonTitles` is — optional so this
   * component still renders correctly if the caller hasn't wired it up.
   * `src/app/map/page.tsx` (owned by another agent, not editable here) needs
   * one more line alongside its existing `lessonTitles` computation:
   *
   *   const lessonDifficulty = Object.fromEntries(
   *     lessons.map((lesson) => [lesson.slug, lesson.difficulty])
   *   );
   *   <LazyConceptMapExplorer lessonTitles={lessonTitles} lessonDifficulty={lessonDifficulty} />
   *
   * Until that lands, nodes simply render without a difficulty mark rather
   * than showing an invented or stale value. See docs/UX_REVIEW.md P0-3.
   */
  lessonDifficulty?: Record<string, Difficulty>;
}) {
  const graph = useMemo(() => buildConceptGraph(), []);
  const nodesById = useMemo(() => new Map(graph.nodes.map((node) => [node.id, node])), [graph.nodes]);
  const nodeDifficulty = useMemo(() => {
    const map = new Map<string, Difficulty>();
    for (const node of graph.nodes) {
      const difficulty = resolveNodeDifficulty(node, lessonDifficulty);
      if (difficulty) map.set(node.id, difficulty);
    }
    return map;
  }, [graph.nodes, lessonDifficulty]);

  // Direct dependents (the reverse of prerequisiteIds), derived from edges
  // once so hover highlighting — and the detail panel's "Leads to" list —
  // don't recompute it per node.
  const dependentsOf = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const edge of graph.edges) {
      if (!map.has(edge.from)) map.set(edge.from, []);
      map.get(edge.from)!.push(edge.to);
    }
    return map;
  }, [graph.edges]);

  // One background "region" per pillar, sized to that pillar's node cluster
  // — derived from the graph's own node positions rather than re-deriving
  // concepts.ts's private column geometry, so it can't drift out of sync.
  const bands = useMemo(() => {
    const bounds = new Map<ConceptNode["pillar"], { minX: number; maxX: number }>();
    for (const node of graph.nodes) {
      const current = bounds.get(node.pillar);
      if (!current) {
        bounds.set(node.pillar, { minX: node.x, maxX: node.x });
      } else {
        current.minX = Math.min(current.minX, node.x);
        current.maxX = Math.max(current.maxX, node.x);
      }
    }
    return PILLARS.map((pillar) => bounds.get(pillar.slug))
      .map((bound, index) =>
        bound
          ? {
              pillar: PILLARS[index].slug,
              left: bound.minX - NODE_WIDTH / 2 - BAND_PADDING,
              width: bound.maxX - bound.minX + NODE_WIDTH + BAND_PADDING * 2,
            }
          : null
      )
      .filter((band): band is { pillar: ConceptNode["pillar"]; left: number; width: number } => band !== null);
  }, [graph.nodes]);

  const completedLessonSlugs = useCompletedLessonSlugs();

  const [viewMode, setViewMode] = useState<"graph" | "list">("graph");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const viewportRef = useRef<HTMLDivElement>(null);
  // 480 (half of a ~960px desktop viewport) is only a first-paint fallback,
  // used before the viewport's real width is known — resetView() and the
  // mount effect below both replace it with the actual measured width, so
  // narrower (e.g. mobile) viewports don't stay centered on a desktop guess.
  const defaultTransform = (viewportWidth: number) => ({
    x: -graph.width / 2 + viewportWidth / 2,
    y: 40,
    scale: 0.85,
  });
  const [transform, setTransform] = useState(defaultTransform(960));
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number; pointerId: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    setTransform(defaultTransform(viewport.clientWidth));
    // Only correct the initial desktop-width guess once, on mount — this
    // must not re-run on every graph/render change or it would fight the
    // user's own pan/zoom.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const highlighted = useMemo(() => {
    if (!hoveredId) return null;
    const set = new Set<string>([hoveredId]);
    const hoveredNode = nodesById.get(hoveredId);
    hoveredNode?.prerequisiteIds.forEach((id) => set.add(id));
    (dependentsOf.get(hoveredId) ?? []).forEach((id) => set.add(id));
    return set;
  }, [hoveredId, nodesById, dependentsOf]);

  const highlightPillar = hoveredId ? nodesById.get(hoveredId)?.pillar : undefined;

  const centerOnNode = useCallback(
    (id: string) => {
      const node = nodesById.get(id);
      const viewport = viewportRef.current;
      if (!node || !viewport) return;
      const { clientWidth, clientHeight } = viewport;
      setTransform((prev) => ({
        x: clientWidth / 2 - node.x * prev.scale,
        y: clientHeight / 2 - node.y * prev.scale,
        scale: prev.scale,
      }));
    },
    [nodesById]
  );

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedId(id);
      if (viewMode === "graph") centerOnNode(id);
    },
    [centerOnNode, viewMode]
  );

  // Stable references so the memoized ConceptMapGraph subcomponent below
  // doesn't re-render on every pan/zoom transform change.
  const handleHover = useCallback((id: string) => setHoveredId(id), []);
  const handleHoverEnd = useCallback(
    (id: string) => setHoveredId((current) => (current === id ? null : current)),
    []
  );
  // Tabbing to a node that pan/zoom has left off-screen would otherwise
  // focus something invisible — a real keyboard-accessibility gap on a
  // canvas like this. Re-centering (without changing the zoom level or the
  // selection) on every focus keeps the focused node visible at all times;
  // there's no CSS transition on the transform, so this is an instant
  // reposition, not motion that needs a reduced-motion guard.
  const handleFocusNode = useCallback((id: string) => centerOnNode(id), [centerOnNode]);

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: transform.x,
      originY: transform.y,
      pointerId: event.pointerId,
    };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setTransform((prev) => ({
      ...prev,
      x: drag.originX + (event.clientX - drag.startX),
      y: drag.originY + (event.clientY - drag.startY),
    }));
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
      setIsDragging(false);
    }
  }

  // Attached as a native, non-passive listener (rather than JSX `onWheel`)
  // because React registers wheel handlers passively by default — a
  // passive listener's `event.preventDefault()` is a silent no-op (plus a
  // console warning), so the JSX-prop version would zoom the map while
  // also letting the page scroll underneath it.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    function handleWheel(event: WheelEvent) {
      event.preventDefault();
      const delta = event.deltaY > 0 ? -0.08 : 0.08;
      setTransform((prev) => ({
        ...prev,
        scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.scale + delta)),
      }));
    }
    viewport.addEventListener("wheel", handleWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", handleWheel);
  }, []);

  function zoomBy(delta: number) {
    setTransform((prev) => ({ ...prev, scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.scale + delta)) }));
  }

  function resetView() {
    setTransform(defaultTransform(viewportRef.current?.clientWidth ?? 960));
    setSelectedId(null);
  }

  const selectedNode = selectedId ? nodesById.get(selectedId) ?? null : null;
  const selectedDependents = useMemo(() => {
    if (!selectedId) return [];
    return (dependentsOf.get(selectedId) ?? [])
      .map((id) => nodesById.get(id))
      .filter((n): n is ConceptGraph["nodes"][number] => Boolean(n));
  }, [selectedId, dependentsOf, nodesById]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <div className="instrument overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="flex flex-wrap items-center gap-4">
            {PILLARS.map((pillar) => (
              <span key={pillar.slug} data-pillar={pillar.slug} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-pillar-accent" aria-hidden="true" />
                {pillar.title}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div role="group" aria-label="Map view" className="flex items-center gap-1 rounded-full border border-border p-0.5">
              {(["graph", "list"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  aria-pressed={viewMode === mode}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors",
                    viewMode === mode ? "bg-pillar-wash text-pillar-text" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>

            {viewMode === "graph" ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => zoomBy(-0.15)}
                  aria-label="Zoom out"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground hover:bg-surface-muted"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={() => zoomBy(0.15)}
                  aria-label="Zoom in"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground hover:bg-surface-muted"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={resetView}
                  className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground hover:bg-surface-muted"
                >
                  Reset view
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {viewMode === "graph" ? (
          <>
            <p id="concept-map-instructions" className="sr-only">
              Drag to pan, scroll or use the zoom buttons to zoom. Tab moves between concepts and
              keeps the focused one centered; press Enter to see its details. Switch to List view
              above for a non-graphical version of the same map.
            </p>
            <div
              ref={viewportRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              role="group"
              aria-label="Concept map"
              aria-describedby="concept-map-instructions"
              className={cn(
                "relative h-[420px] overflow-hidden bg-surface-muted/30 touch-none sm:h-[560px]",
                isDragging ? "cursor-grabbing" : "cursor-grab"
              )}
            >
              <div
                className="absolute left-0 top-0 origin-top-left"
                style={{
                  width: graph.width,
                  height: graph.height,
                  transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                }}
              >
                <ConceptMapGraph
                  graph={graph}
                  nodesById={nodesById}
                  bands={bands}
                  highlighted={highlighted}
                  highlightPillar={highlightPillar}
                  selectedId={selectedId}
                  completedLessonSlugs={completedLessonSlugs}
                  nodeDifficulty={nodeDifficulty}
                  onSelect={handleSelect}
                  onHover={handleHover}
                  onHoverEnd={handleHoverEnd}
                  onFocusNode={handleFocusNode}
                />
              </div>
            </div>
          </>
        ) : (
          <ConceptListView
            nodes={graph.nodes}
            completedLessonSlugs={completedLessonSlugs}
            nodeDifficulty={nodeDifficulty}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        )}
      </div>

      <div className="instrument overflow-hidden lg:max-h-[652px]">
        {selectedNode ? (
          <ConceptDetailPanel
            node={selectedNode}
            dependents={selectedDependents}
            lessonTitles={lessonTitles}
            difficulty={nodeDifficulty.get(selectedNode.id)}
            dependentDifficulty={nodeDifficulty}
            onSelectConcept={handleSelect}
            onClose={() => setSelectedId(null)}
          />
        ) : (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-2 p-6 text-center">
            <p className="text-sm font-medium text-foreground">Select a concept to see details</p>
            <p className="text-sm text-muted-foreground">
              Hover or focus a node to highlight its prerequisites and dependents. Drag to pan,
              scroll to zoom — or switch to List view for a non-graphical browse.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
