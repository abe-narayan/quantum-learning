"use client";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  buildConceptGraph,
  getPrerequisitePath,
  type ConceptGraph,
  type ConceptNode,
} from "@/lib/content/concepts";
import { useCompletedLessonSlugs } from "@/lib/content/progress";
import { PILLARS } from "@/lib/content/curriculum";
import { DifficultyMark } from "@/components/curriculum/DifficultyMark";
import type { Difficulty } from "@/lib/content/types";
import { cn } from "@/lib/utils";
import { ConceptDetailPanel } from "./ConceptDetailPanel";
import { ConceptListView } from "./ConceptListView";
// Every zoom path in this file — pinch, wheel, the +/- buttons — goes
// through these, so the scale bounds and the anchor math are defined in
// exactly one place (and unit-tested in ./__tests__/pinch.test.ts).
import {
  applyPinch,
  beginPinch,
  clampScale,
  pinchMatchesPointers,
  zoomAbout,
  type PinchState,
  type Point,
  type Transform,
} from "./pinch";

const NODE_WIDTH = 152;
// Tall enough for a title line plus a compact `DifficultyMark` line below it
// (was 52, title-only) — ROW_HEIGHT in lib/content/concepts.ts is 160, so
// there's ample headroom before this risks colliding with the next depth row.
const NODE_HEIGHT = 68;
/** Padding added around each pillar's node cluster to draw its background
 *  "region" band — wide enough that the band reads as a zone, not a hug. */
const BAND_PADDING = 70;
/** Pointer travel (CSS px) past which a press is treated as a pan, not a tap,
 *  so dragging the canvas from on top of a node doesn't also select it. */
const DRAG_SLOP = 6;
/** Remembers the graph/list choice across visits — the two views are equal
 *  first-class ways to read the same map, so whichever one a reader picked
 *  should still be there next time. Namespaced like the other client stores. */
const VIEW_STORAGE_KEY = "quantumlearn:map-view";

function readStoredViewMode(): "graph" | "list" {
  try {
    const stored = window.localStorage.getItem(VIEW_STORAGE_KEY);
    if (stored === "graph" || stored === "list") return stored;
  } catch {
    // Private mode / storage disabled: fall through to the default.
  }
  return "graph";
}

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
  rootIds,
  pathRank,
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
  /** Concepts with no prerequisites — the map's genuine entry point(s). Only
   *  one exists in the current data ("Superposition"), but this stays
   *  general rather than hardcoding an id. */
  rootIds: Set<string>;
  /** concept id -> its 1-based position in the selected concept's
   *  prerequisite route, when "prerequisite path" is on. `null` otherwise.
   *  Rendering the step number on the node itself is what turns a dimmed
   *  sub-graph into a readable "do these in this order" instruction. */
  pathRank: Map<string, number> | null;
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
        const isRoot = rootIds.has(node.id);
        const step = pathRank?.get(node.id);

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
              "absolute flex -translate-x-1/2 -translate-y-1/2 flex-col justify-center gap-1 rounded-(--radius-tight) border bg-surface px-3 py-2 text-left text-xs font-medium shadow-sm transition-[opacity,box-shadow,border-color] duration-(--dur-fast) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted",
              isSelected ? "border-pillar ring-2 ring-pillar/40" : "border-border hover:border-pillar/60",
              dimmed ? "opacity-30" : "opacity-100"
            )}
          >
            <span className="flex items-center gap-2">
              {step ? (
                <span
                  aria-hidden="true"
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-pillar-edge bg-pillar-wash font-mono text-[0.5625rem] tabular-nums text-pillar-text"
                >
                  {step}
                </span>
              ) : (
                <span className="h-2 w-2 shrink-0 rounded-full bg-pillar" aria-hidden="true" />
              )}
              <span className="text-foreground">{node.title}</span>
              {isCompleted ? (
                // The tick is decorative and the word is real text, rather
                // than the reverse. `aria-label` on this bare `<span>` did
                // nothing: no `role` means the implicit `generic` role, which
                // ARIA prohibits naming, so screen readers dropped it and the
                // node button announced only "✓" — a character AT reads
                // inconsistently (some say "check mark", some skip it
                // entirely) and which in no reading means "you have finished
                // every lesson behind this concept". Matches the identical
                // fix in ConceptListView and LessonCompletionMark.
                <span className="ml-auto shrink-0 text-pillar-text" title="Completed">
                  <span aria-hidden="true">✓</span>
                  <span className="sr-only">Completed</span>
                </span>
              ) : null}
            </span>
            <span className="flex flex-wrap items-center gap-1.5 pl-3.5">
              {difficulty ? <DifficultyMark difficulty={difficulty} /> : null}
              {isRoot ? (
                <span className="rounded-full border border-pillar-edge bg-pillar-wash px-1.5 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-pillar-text">
                  Start here
                </span>
              ) : null}
            </span>
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

  // Concepts with no prerequisites — the map's genuine entry point(s), so a
  // beginner has an answer to "where do I start" instead of an alphabetical
  // or pillar-first guess. Currently exactly one ("Superposition"), but this
  // stays general rather than hardcoding that id.
  const rootIds = useMemo(
    () => new Set(graph.nodes.filter((node) => node.prerequisiteIds.length === 0).map((node) => node.id)),
    [graph.nodes]
  );
  const firstRootId = useMemo(() => {
    const sorted = graph.nodes
      .filter((node) => rootIds.has(node.id))
      .sort((a, b) => a.depth - b.depth || a.title.localeCompare(b.title));
    return sorted[0]?.id ?? null;
  }, [graph.nodes, rootIds]);

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

  // A deep link from the glossary (`/map?concept=<id>`) selects that concept
  // on load instead of starting with nothing selected — see
  // ConceptDetailPanel's "Full glossary entry" link and GlossaryFilter's
  // matching link the other way. Safe to read via useSearchParams without a
  // Suspense boundary: this component is only ever mounted client-side
  // (LazyConceptMapExplorer dynamically imports it with ssr disabled), the
  // same pattern every simulator's URL-synced control already uses.
  const searchParams = useSearchParams();
  const initialConceptId = searchParams.get("concept");

  // Safe to read storage in the initializer rather than in an effect: this
  // component is only ever mounted client-side (LazyConceptMapExplorer
  // imports it with `ssr: false`), so there is no server render to mismatch
  // and no flash of the wrong view.
  const [viewMode, setViewMode] = useState<"graph" | "list">(readStoredViewMode);
  const [selectedId, setSelectedId] = useState<string | null>(() =>
    initialConceptId && nodesById.has(initialConceptId) ? initialConceptId : null
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  // Whether selecting a concept lights up its whole prerequisite chain back
  // to a root. On by default: "what do I need to learn before this?" is the
  // question a beginner actually arrives with, and it's the one thing a
  // dependency graph can answer that a list of lessons cannot.
  const [showPath, setShowPath] = useState(true);

  const viewportRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // 480 (half of a ~960px desktop viewport) is only a first-paint fallback,
  // used before the viewport's real width is known — resetView() and the
  // mount effect below both replace it with the actual measured width, so
  // narrower (e.g. mobile) viewports don't stay centered on a desktop guess.
  const defaultTransform = (viewportWidth: number): Transform => ({
    x: -graph.width / 2 + viewportWidth / 2,
    y: 40,
    scale: 0.85,
  });
  const [transform, setTransform] = useState<Transform>(() => defaultTransform(960));
  // Every gesture seeds itself from the *current* transform, and pointer
  // handlers can fire between a `setTransform` and the render that commits
  // it. Mirroring the value into a ref at each write means a pinch that
  // starts mid-pan, a finger lifting mid-pinch, or the wheel listener
  // (registered once, with an empty dep array) all read the live value
  // rather than one render's stale closure.
  const transformRef = useRef<Transform>(transform);
  const commitTransform = useCallback((next: Transform) => {
    transformRef.current = next;
    setTransform(next);
  }, []);

  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number; pointerId: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  // Set once a press travels past DRAG_SLOP so the click that follows a pan
  // is swallowed instead of selecting whatever node the drag started on —
  // the difference between "I moved the map" and "I picked this concept",
  // which matters most on a phone where the whole canvas is under a thumb.
  const draggedRef = useRef(false);
  // Active pointers (mouse + all simultaneous touches), keyed by pointerId —
  // the input to both single-finger panning (dragRef, above) and two-finger
  // pinch-to-zoom (pinchRef, below). A plain ref rather than state: every
  // pointermove would otherwise trigger a render just to update bookkeeping
  // no view depends on directly. Insertion-ordered, so "the first two" is a
  // stable notion within a gesture.
  const pointersRef = useRef<Map<number, Point>>(new Map());
  const pinchRef = useRef<PinchState | null>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const width = viewport.clientWidth;
    const requested = initialConceptId ? nodesById.get(initialConceptId) : undefined;
    const scale = 0.85;
    commitTransform(
      requested
        ? { x: width / 2 - requested.x * scale, y: viewport.clientHeight / 2 - requested.y * scale, scale }
        : defaultTransform(width)
    );
    // Only correct the initial desktop-width guess (and center any deep
    // link resolved above) once, on mount — this must not re-run on every
    // graph/render change or it would fight the user's own pan/zoom.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The full prerequisite route to the selected concept: every idea that has
  // to come first, in an order where nothing appears before its own
  // prerequisites. Also the highlight set for the graph, so the map answers
  // "what do I need before this" visually and in the panel from one source.
  const path = useMemo(
    () => (selectedId ? getPrerequisitePath(selectedId) : []),
    [selectedId]
  );
  const pathRank = useMemo(() => {
    if (!showPath || path.length < 2) return null;
    return new Map(path.map((node, index) => [node.id, index + 1]));
  }, [showPath, path]);

  const highlighted = useMemo(() => {
    // Hovering is a momentary "what touches this one" probe and takes
    // precedence; with nothing hovered, the standing prerequisite route (if
    // any) stays lit so the answer doesn't vanish the moment you look away.
    if (hoveredId) {
      const set = new Set<string>([hoveredId]);
      const hoveredNode = nodesById.get(hoveredId);
      hoveredNode?.prerequisiteIds.forEach((id) => set.add(id));
      (dependentsOf.get(hoveredId) ?? []).forEach((id) => set.add(id));
      return set;
    }
    if (pathRank) return new Set(pathRank.keys());
    return null;
  }, [hoveredId, nodesById, dependentsOf, pathRank]);

  const highlightPillar = hoveredId
    ? nodesById.get(hoveredId)?.pillar
    : pathRank && selectedId
      ? nodesById.get(selectedId)?.pillar
      : undefined;

  const centerOnNode = useCallback(
    (id: string) => {
      const node = nodesById.get(id);
      const viewport = viewportRef.current;
      if (!node || !viewport) return;
      const { clientWidth, clientHeight } = viewport;
      const { scale } = transformRef.current;
      commitTransform({
        x: clientWidth / 2 - node.x * scale,
        y: clientHeight / 2 - node.y * scale,
        scale,
      });
    },
    [nodesById, commitTransform]
  );

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedId(id);
      if (viewMode === "graph") centerOnNode(id);
    },
    [centerOnNode, viewMode]
  );

  // Below `lg` the detail panel stacks *under* the map instead of beside it,
  // so on a phone a tap would otherwise open a panel entirely off-screen.
  // Bring it into view on selection — and only there; on desktop the panel
  // is already visible and scrolling the page would be an unasked-for jump.
  useEffect(() => {
    if (!selectedId || typeof window === "undefined" || !window.matchMedia) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth";

    // In list view, `centerOnNode` doesn't apply — but a concept chosen from
    // the "Show me the path to" menu can sit anywhere in a 90-row scroller,
    // so bring the selected row into view the same way the graph re-centres.
    const row = listRef.current?.querySelector<HTMLElement>('[aria-current="true"]');
    if (row) row.scrollIntoView({ block: "nearest", behavior });

    // Below `lg` the detail panel stacks *under* the map instead of beside
    // it, so on a phone a tap would otherwise open a panel entirely
    // off-screen. On desktop the panel is already visible and scrolling the
    // page would be an unasked-for jump.
    const panel = detailRef.current;
    if (!panel || window.matchMedia("(min-width: 1024px)").matches) return;
    panel.scrollIntoView({ block: "nearest", behavior });
  }, [selectedId]);

  const changeViewMode = useCallback((mode: "graph" | "list") => {
    setViewMode(mode);
    try {
      window.localStorage.setItem(VIEW_STORAGE_KEY, mode);
    } catch {
      // Storage unavailable — the choice just won't survive a reload.
    }
  }, []);

  // "Where do I start" is a real question this map couldn't answer before —
  // jumps straight to the map's genuine entry point and opens its detail
  // panel, in whichever view is active.
  const handleStartHere = useCallback(() => {
    if (firstRootId) handleSelect(firstRootId);
  }, [firstRootId, handleSelect]);

  // The other half of the beginner's question: pick any idea by name and the
  // map draws the route to it. A native <select> rather than a bespoke
  // combobox — it is keyboard-complete for free, and on a phone it opens the
  // OS picker instead of a cramped custom dropdown.
  const conceptsByTitle = useMemo(
    () => [...graph.nodes].sort((a, b) => a.title.localeCompare(b.title)),
    [graph.nodes]
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

  // Pan (one pointer, mouse or touch) and pinch-zoom (two touches) share one
  // set of handlers so a phone gets genuine two-finger zoom, not just the
  // toolbar's +/- buttons. Pointer Events unify mouse/touch/pen, so the same
  // drag path already handled desktop click-drag and single-finger panning;
  // this adds the second-finger case on top of it. The math itself lives in
  // ./pinch.ts and is unit-tested there.

  /** The two pointers a pinch is currently defined by: the first two in
   *  insertion order. Returning the ids alongside the points is what lets
   *  `handlePointerMove` notice that the pair changed (a third finger, or
   *  one of the two lifting) and re-seed instead of measuring this frame's
   *  distance against a `startDist` captured from different fingers. */
  function activePinchPair() {
    const entries = [...pointersRef.current.entries()];
    if (entries.length < 2) return null;
    return {
      ids: [entries[0][0], entries[1][0]] as const,
      a: entries[0][1],
      b: entries[1][1],
    };
  }

  function beginDragFrom(pointerId: number, point: Point) {
    const current = transformRef.current;
    dragRef.current = {
      startX: point.x,
      startY: point.y,
      originX: current.x,
      originY: current.y,
      pointerId,
    };
    setIsDragging(true);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    // Touch and pen report button 0 on pointerdown; this only filters
    // secondary *mouse* buttons, which must not start a pan.
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    draggedRef.current = false;

    const pair = activePinchPair();
    if (pair) {
      // A second finger landed mid-drag: hand off from panning to pinching
      // rather than fighting over the same transform.
      dragRef.current = null;
      setIsDragging(false);
      const rect = event.currentTarget.getBoundingClientRect();
      pinchRef.current = beginPinch(pair.a, pair.b, pair.ids, rect, transformRef.current);
      return;
    }

    beginDragFrom(event.pointerId, { x: event.clientX, y: event.clientY });
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!pointersRef.current.has(event.pointerId)) return;
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    const pair = activePinchPair();
    if (pair) {
      draggedRef.current = true;
      if (!pinchMatchesPointers(pinchRef.current, pair.ids)) {
        // The pair changed since the gesture was seeded. Re-seed from the
        // live transform so the scale continues from exactly where it is,
        // and skip this frame rather than applying a bogus ratio.
        const rect = event.currentTarget.getBoundingClientRect();
        pinchRef.current = beginPinch(pair.a, pair.b, pair.ids, rect, transformRef.current);
        return;
      }
      commitTransform(applyPinch(pinchRef.current!, pair.a, pair.b));
      return;
    }

    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.hypot(dx, dy) > DRAG_SLOP) draggedRef.current = true;
    commitTransform({
      x: drag.originX + dx,
      y: drag.originY + dy,
      scale: transformRef.current.scale,
    });
  }

  /** Shared by pointerup, pointercancel and lostpointercapture — any of the
   *  three can be the last thing we hear about a pointer, and missing one is
   *  exactly how a canvas ends up stuck mid-gesture. */
  function releasePointer(pointerId: number) {
    if (!pointersRef.current.delete(pointerId)) return;

    if (pointersRef.current.size < 2) pinchRef.current = null;
    if (dragRef.current?.pointerId === pointerId) {
      dragRef.current = null;
      setIsDragging(false);
    }
    // Lifting one of two fingers should resume panning with whichever finger
    // is still down, rather than requiring a full lift-and-repress. Seeding
    // from `transformRef` (not a render closure) means the pan continues from
    // wherever the pinch just left the map, with no snap-back.
    if (pointersRef.current.size === 1 && !dragRef.current) {
      const [[remainingId, point]] = [...pointersRef.current];
      beginDragFrom(remainingId, point);
    }
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    releasePointer(event.pointerId);
  }

  // A press that turned into a pan must not also register as a tap on the
  // node underneath it. Capture phase, so this runs before the node button's
  // own onClick.
  function handleClickCapture(event: ReactMouseEvent<HTMLDivElement>) {
    if (!draggedRef.current) return;
    draggedRef.current = false;
    event.preventDefault();
    event.stopPropagation();
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
      const rect = viewport!.getBoundingClientRect();
      const delta = event.deltaY > 0 ? -0.08 : 0.08;
      const current = transformRef.current;
      // Anchored under the cursor, and clamped by the same `clampScale` the
      // pinch and the +/- buttons use, so the three can't disagree.
      commitTransform(
        zoomAbout(current, current.scale + delta, event.clientX - rect.left, event.clientY - rect.top)
      );
    }
    viewport.addEventListener("wheel", handleWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", handleWheel);
  }, [commitTransform]);

  function zoomBy(delta: number) {
    const viewport = viewportRef.current;
    const current = transformRef.current;
    // Anchored on the viewport's centre so the +/- buttons zoom into what
    // you are already looking at, instead of drifting toward the top-left
    // transform origin the way a bare scale change does.
    const anchorX = (viewport?.clientWidth ?? 0) / 2;
    const anchorY = (viewport?.clientHeight ?? 0) / 2;
    commitTransform(zoomAbout(current, current.scale + delta, anchorX, anchorY));
  }

  function resetView() {
    commitTransform(defaultTransform(viewportRef.current?.clientWidth ?? 960));
    setSelectedId(null);
  }

  const zoomPercent = Math.round(clampScale(transform.scale) * 100);

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
        {/* Orientation. A newcomer's first ten seconds on this page used to be
            spent working out what the picture even was; the plain sentence and
            the two concrete first actions below it are the whole fix. Nothing
            here simplifies the map — it just says what it is and offers a
            place to put the first click. */}
        <div className="border-b border-border px-4 py-4">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
            <p className="max-w-prose text-sm leading-relaxed text-foreground">
              Every box is one idea, and a line means you should learn the idea it comes from
              first. The map reads top to bottom: foundations at the top, what they unlock below.
            </p>

            {/* The graph and the list are two equal readings of the same data,
                so the switch sits here at the top — not tucked in with the
                zoom controls, where it read as a fallback for when the graph
                failed you. The choice is remembered for next visit. */}
            <div
              role="group"
              aria-label="Map view"
              className="flex shrink-0 items-center gap-1 rounded-(--radius-tight) border border-border-strong bg-surface p-0.5"
            >
              {(
                [
                  { mode: "graph", label: "Graph" },
                  { mode: "list", label: "List" },
                ] as const
              ).map(({ mode, label }) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => changeViewMode(mode)}
                  aria-pressed={viewMode === mode}
                  className={cn(
                    "min-h-11 rounded-(--radius-tight) px-4 text-xs font-medium transition-colors duration-(--dur-fast)",
                    viewMode === mode
                      ? "bg-pillar-wash text-pillar-text shadow-[inset_0_0_0_1px_var(--pillar-edge)]"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {firstRootId ? (
              <button
                type="button"
                onClick={handleStartHere}
                className="inline-flex min-h-11 items-center gap-2 rounded-(--radius-tight) border border-pillar-edge bg-pillar-wash px-4 text-sm font-medium text-pillar-text transition-colors duration-(--dur-fast) hover:border-pillar"
              >
                Start at the beginning
                <span aria-hidden="true">→</span>
              </button>
            ) : null}

            {/* `max-w-full` on the label and `min-w-0` on the select are what
                keep this control inside the panel at 320px. A `<select>`
                takes its automatic minimum size from its widest `<option>`,
                and these options are concept titles — so with `max-w-[13rem]`
                alone the label's minimum width was 24px of padding + the
                wrapped caption + 208px of select ≈ 280px, against the 256px
                the instrument's `px-4` leaves inside a 320px viewport. The
                overflow was invisible rather than scrollable: the wrapping
                `.instrument` is `overflow-hidden`, so the right edge of the
                concept name was simply cut off with nothing to indicate it.
                `min-w-0` restores the select's ability to shrink, and
                `truncate` (already here) then does what it was written to
                do. */}
            <label className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-(--radius-tight) border border-border bg-surface px-3">
              <span className="text-xs text-muted-foreground">Show me the path to</span>
              <select
                value={selectedId ?? ""}
                onChange={(event) => {
                  const id = event.target.value;
                  setShowPath(true);
                  if (id) handleSelect(id);
                  else setSelectedId(null);
                }}
                // `text-base` below `sm` (like AnswerInput): iOS Safari zooms
                // the whole page on focusing any field under 16px.
                className="min-h-11 min-w-0 max-w-[13rem] truncate border-0 bg-transparent py-0 pr-1 text-base font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar sm:text-sm"
              >
                <option value="">a concept…</option>
                {conceptsByTitle.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border px-4 py-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {PILLARS.map((pillar) => (
              <span key={pillar.slug} data-pillar={pillar.slug} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-pillar" aria-hidden="true" />
                {pillar.title}
              </span>
            ))}
          </div>

          {viewMode === "graph" ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowPath((current) => !current)}
                aria-pressed={showPath}
                className={cn(
                  "min-h-11 rounded-full border px-4 py-1 text-xs font-medium transition-colors duration-(--dur-fast)",
                  showPath
                    ? "border-pillar-edge bg-pillar-wash text-pillar-text"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                Prerequisite path
              </button>
              <button
                type="button"
                onClick={() => zoomBy(-0.15)}
                aria-label="Zoom out"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground hover:bg-surface-muted"
              >
                −
              </button>
              <span aria-hidden="true" className="w-11 text-center font-mono text-[0.6875rem] tabular-nums text-muted-foreground">
                {zoomPercent}%
              </span>
              <button
                type="button"
                onClick={() => zoomBy(0.15)}
                aria-label="Zoom in"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground hover:bg-surface-muted"
              >
                +
              </button>
              <button
                type="button"
                onClick={resetView}
                className="min-h-11 rounded-full border border-border px-4 py-1 text-xs font-medium text-foreground hover:bg-surface-muted"
              >
                Reset view
              </button>
            </div>
          ) : null}
        </div>

        {/* The answer, stated in words as well as drawn — the graph dims to the
            route, and this says how long the route is and where it starts. */}
        <p
          role="status"
          className={cn(
            "border-b border-border px-4 py-2 text-xs",
            pathRank && selectedNode ? "bg-pillar-wash/40 text-pillar-text" : "text-muted-foreground"
          )}
        >
          {pathRank && selectedNode
            ? `Path to ${selectedNode.title}: ${pathRank.size} concepts, starting at ${path[0]?.title}.${
                viewMode === "graph" ? " Everything off that path is dimmed." : ""
              } The full route is listed in the panel.`
            : selectedNode
              ? `${selectedNode.title} selected — its definition, lessons and prerequisites are in the panel.`
              : "Nothing selected yet. Pick a concept above, or choose any box to see what it is and what it needs first."}
        </p>

        {viewMode === "graph" ? (
          <>
            <p id="concept-map-instructions" className="sr-only">
              A map of every concept on the site, drawn as boxes joined by lines, where a line
              runs from a concept to the concepts that build on it. Drag or pinch with two
              fingers to pan and zoom, or use the zoom buttons. Tab moves between concepts and
              keeps the focused one centred; press Enter to see a concept&rsquo;s details, its
              lessons, and the full list of what to learn before it. Use &ldquo;Start at the
              beginning&rdquo; for the map&rsquo;s entry point, or the &ldquo;Show me the path
              to&rdquo; menu to pick any concept by name. List view above presents the same map
              as plain, grouped text.
            </p>
            <div
              ref={viewportRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onLostPointerCapture={endDrag}
              onClickCapture={handleClickCapture}
              role="group"
              aria-label="Concept map"
              aria-describedby="concept-map-instructions"
              className={cn(
                // `touch-none` hands every touch to the pinch/pan handlers
                // rather than to the browser's own scroll-and-zoom; the page
                // still scrolls normally everywhere outside this box, and the
                // List view above needs no gesture at all.
                "relative h-[420px] touch-none select-none overflow-hidden bg-surface-muted/30 sm:h-[560px]",
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
                  rootIds={rootIds}
                  pathRank={pathRank}
                  onSelect={handleSelect}
                  onHover={handleHover}
                  onHoverEnd={handleHoverEnd}
                  onFocusNode={handleFocusNode}
                />
              </div>
            </div>
          </>
        ) : (
          <div ref={listRef}>
            <ConceptListView
              nodes={graph.nodes}
              completedLessonSlugs={completedLessonSlugs}
              nodeDifficulty={nodeDifficulty}
              rootIds={rootIds}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          </div>
        )}
      </div>

      <div ref={detailRef} className="instrument overflow-hidden lg:max-h-[652px]">
        {selectedNode ? (
          <ConceptDetailPanel
            node={selectedNode}
            path={path}
            dependents={selectedDependents}
            lessonTitles={lessonTitles}
            difficulty={nodeDifficulty.get(selectedNode.id)}
            dependentDifficulty={nodeDifficulty}
            onSelectConcept={handleSelect}
            onClose={() => setSelectedId(null)}
          />
        ) : (
          <div className="flex h-full min-h-[200px] flex-col justify-center gap-2 p-6">
            <p className="text-sm font-medium text-foreground">Select a concept</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              You&rsquo;ll get a plain-language definition, every lesson on the site that teaches
              it, the full list of what to learn first, and what it leads to next. New here?
              &ldquo;Start at the beginning&rdquo; opens the one concept with no prerequisites.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
