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
import { cn } from "@/lib/utils";
import { ConceptDetailPanel } from "./ConceptDetailPanel";

const PILLAR_DOT: Record<ConceptNode["pillar"], string> = {
  "quantum-mechanics": "bg-brand",
  "quantum-computing": "bg-accent",
  "quantum-hardware": "bg-warning",
  "quantum-software": "bg-muted-foreground",
  "quantum-mastery": "bg-danger",
  apex: "bg-brand",
};

const PILLAR_LABEL: Record<ConceptNode["pillar"], string> = {
  "quantum-mechanics": "Quantum Mechanics",
  "quantum-computing": "Quantum Computing",
  "quantum-hardware": "Quantum Hardware",
  "quantum-software": "Quantum Software",
  "quantum-mastery": "Quantum Mastery",
  apex: "Apex",
};

const NODE_WIDTH = 152;
const NODE_HEIGHT = 52;
const MIN_SCALE = 0.4;
const MAX_SCALE = 1.75;

/**
 * The edges + node buttons, split into their own memoized component so
 * panning/zooming (which updates `transform` on every pointermove/wheel
 * tick) only re-renders the cheap transform wrapper below, not this list —
 * without the split, every drag pixel recreated all ~24 node buttons and
 * ~30 SVG paths.
 */
const ConceptMapGraph = memo(function ConceptMapGraph({
  graph,
  nodesById,
  highlighted,
  selectedId,
  completedLessonSlugs,
  onSelect,
  onHover,
  onHoverEnd,
}: {
  graph: ConceptGraph;
  nodesById: Map<string, ConceptGraph["nodes"][number]>;
  highlighted: Set<string> | null;
  selectedId: string | null;
  completedLessonSlugs: ReadonlySet<string>;
  onSelect: (id: string) => void;
  onHover: (id: string) => void;
  onHoverEnd: (id: string) => void;
}) {
  return (
    <>
      <svg
        width={graph.width}
        height={graph.height}
        className="pointer-events-none absolute left-0 top-0"
        aria-hidden="true"
      >
        {graph.edges.map((edge) => {
          const from = nodesById.get(edge.from);
          const to = nodesById.get(edge.to);
          if (!from || !to) return null;
          const dimmed = highlighted ? !(highlighted.has(edge.from) && highlighted.has(edge.to)) : false;
          const midY = (from.y + to.y) / 2;
          return (
            <path
              key={`${edge.from}-${edge.to}`}
              d={`M ${from.x} ${from.y + NODE_HEIGHT / 2} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y - NODE_HEIGHT / 2}`}
              fill="none"
              stroke={dimmed ? "var(--border)" : "var(--brand)"}
              strokeWidth={dimmed ? 1 : 1.5}
              strokeOpacity={dimmed ? 0.4 : 0.8}
            />
          );
        })}
      </svg>

      {graph.nodes.map((node) => {
        const completedCount = node.lessonSlugs.filter((slug) => completedLessonSlugs.has(slug)).length;
        const isCompleted = completedCount > 0 && completedCount === node.lessonSlugs.length;
        const dimmed = highlighted ? !highlighted.has(node.id) : false;
        const isSelected = node.id === selectedId;

        return (
          <button
            key={node.id}
            type="button"
            onClick={() => onSelect(node.id)}
            onMouseEnter={() => onHover(node.id)}
            onMouseLeave={() => onHoverEnd(node.id)}
            onFocus={() => onHover(node.id)}
            onBlur={() => onHoverEnd(node.id)}
            style={{
              left: node.x,
              top: node.y,
              width: NODE_WIDTH,
              minHeight: NODE_HEIGHT,
            }}
            className={cn(
              "absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-lg border bg-surface px-3 py-2 text-left text-xs font-medium shadow-sm transition-[opacity,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
              isSelected ? "border-brand ring-2 ring-brand/40" : "border-border hover:border-brand/50",
              dimmed ? "opacity-30" : "opacity-100"
            )}
          >
            <span className={cn("h-2 w-2 shrink-0 rounded-full", PILLAR_DOT[node.pillar])} aria-hidden="true" />
            <span className="text-foreground">{node.title}</span>
            {isCompleted ? (
              <span className="ml-auto shrink-0 text-brand" aria-label="Completed" title="Completed">
                ✓
              </span>
            ) : null}
          </button>
        );
      })}
    </>
  );
});

export function ConceptMapExplorer({ lessonTitles }: { lessonTitles: Record<string, string> }) {
  const graph = useMemo(() => buildConceptGraph(), []);
  const nodesById = useMemo(() => new Map(graph.nodes.map((node) => [node.id, node])), [graph.nodes]);

  // Direct dependents (the reverse of prerequisiteIds), derived from edges
  // once so hover highlighting doesn't recompute it per node.
  const dependentsOf = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const edge of graph.edges) {
      if (!map.has(edge.from)) map.set(edge.from, []);
      map.get(edge.from)!.push(edge.to);
    }
    return map;
  }, [graph.edges]);

  const completedLessonSlugs = useCompletedLessonSlugs();

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
      centerOnNode(id);
    },
    [centerOnNode]
  );

  // Stable references so the memoized ConceptMapGraph subcomponent below
  // doesn't re-render on every pan/zoom transform change.
  const handleHover = useCallback((id: string) => setHoveredId(id), []);
  const handleHoverEnd = useCallback(
    (id: string) => setHoveredId((current) => (current === id ? null : current)),
    []
  );

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

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <div className="rounded-2xl border border-border bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="flex flex-wrap items-center gap-4">
            {(Object.keys(PILLAR_LABEL) as ConceptNode["pillar"][]).map((pillar) => (
              <span key={pillar} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={cn("h-2 w-2 rounded-full", PILLAR_DOT[pillar])} aria-hidden="true" />
                {PILLAR_LABEL[pillar]}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => zoomBy(-0.15)}
              aria-label="Zoom out"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground hover:bg-surface-muted"
            >
              −
            </button>
            <button
              type="button"
              onClick={() => zoomBy(0.15)}
              aria-label="Zoom in"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground hover:bg-surface-muted"
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
        </div>

        <div
          ref={viewportRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className={cn(
            "relative h-[420px] overflow-hidden rounded-b-2xl bg-surface-muted/30 touch-none sm:h-[560px]",
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
              highlighted={highlighted}
              selectedId={selectedId}
              completedLessonSlugs={completedLessonSlugs}
              onSelect={handleSelect}
              onHover={handleHover}
              onHoverEnd={handleHoverEnd}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface lg:max-h-[652px]">
        {selectedNode ? (
          <ConceptDetailPanel
            node={selectedNode}
            lessonTitles={lessonTitles}
            onSelectConcept={handleSelect}
            onClose={() => setSelectedId(null)}
          />
        ) : (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-2 p-6 text-center">
            <p className="text-sm font-medium text-foreground">Click a concept to see details</p>
            <p className="text-sm text-muted-foreground">
              Hover a node to highlight its prerequisites and dependents. Drag to pan, scroll to zoom.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
