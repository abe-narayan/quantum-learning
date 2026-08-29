"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";
import { buildTunnelingTrajectory, TOTAL_FRAMES } from "./tunnelingTrajectory";
import { TunnelingIntroCanvas } from "./TunnelingIntroCanvas";

/** Milliseconds between displayed frames during autoplay — 90 frames at this rate is a ~4s pass, long enough to read as the packet actually crossing the barrier, short enough to stay a brief companion rather than a looping background animation (same "brief, not a loop" framing as WavefunctionHeroExplorer's AUTOPLAY_FRAME_LIMIT comment). */
const FRAME_INTERVAL_MS = 45;

function describeFrame(transmittedFraction: number, reflectedFraction: number, frameIndex: number): string {
  const transmittedPct = Math.round(transmittedFraction * 100);
  const reflectedPct = Math.round(reflectedFraction * 100);

  if (frameIndex >= TOTAL_FRAMES) {
    return `Wavefunction packet has finished interacting with the barrier: about ${transmittedPct}% of the probability transmitted through to the far side, ${reflectedPct}% reflected back, a nonzero fraction on the classically forbidden side's far edge.`;
  }
  if (transmittedFraction > 0.002) {
    return "Wavefunction packet partially transmitted through the barrier; interaction with the classically forbidden region is in progress.";
  }
  if (frameIndex > 0) {
    return "Wavefunction packet approaching the potential barrier, which is taller than the packet's energy.";
  }
  return "Wavefunction packet starting on the left, about to approach a potential barrier taller than its energy.";
}

/**
 * A brief, motion-forward companion to the full Wavefunction Explorer's
 * "Tunneling Through a Barrier" preset (`LazyWavefunctionExplorer`,
 * embedded later in this lesson): a short, real trajectory — not a
 * scripted sketch — of a Gaussian packet hitting a barrier taller than
 * its energy, computed once with the exact same split-operator engine
 * (`SplitOperatorEvolver`) and then played back frame by frame. Meant to
 * sit near the top of the lesson, in the Motivation/Intuition area,
 * before the reader has seen any of the math — "watch this happen," not
 * "here is a tool to explore."
 *
 * Deliberately much lighter than the full explorer: no sliders, no
 * preset picker, no comparison panel — just the one scenario, autoplayed
 * once, with a Replay button for a second look.
 */
export function TunnelingIntroVisual() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const trajectory = useMemo(() => buildTunnelingTrajectory(), []);

  const [frameIndex, setFrameIndex] = useState(prefersReducedMotion ? TOTAL_FRAMES : 0);
  const [isPlaying, setIsPlaying] = useState(!prefersReducedMotion);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (prefersReducedMotion || !isPlaying) return;

    intervalRef.current = setInterval(() => {
      setFrameIndex((prev) => {
        if (prev >= TOTAL_FRAMES) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, FRAME_INTERVAL_MS);

    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [isPlaying, prefersReducedMotion]);

  function handleReplay() {
    setFrameIndex(0);
    setIsPlaying(true);
  }

  const frame = trajectory.frames[Math.min(frameIndex, trajectory.frames.length - 1)];
  const ariaLabel = describeFrame(frame.transmittedFraction, frame.reflectedFraction, frameIndex);
  const hasFinished = frameIndex >= TOTAL_FRAMES;

  return (
    <div className="not-prose panel p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <Badge tone="brand">What we&rsquo;re watching</Badge>
        {prefersReducedMotion ? (
          <Badge tone="neutral">Reduced motion — showing the settled outcome</Badge>
        ) : (
          // `aria-disabled` rather than the native `disabled` prop. This is the
          // one and only control in the figure, and it disables itself *as the
          // direct result of being pressed*: handleReplay sets `isPlaying` true
          // and `frameIndex` 0, which is precisely the `isPlaying && !hasFinished`
          // condition that greyed it out. A natively-disabled button stops being
          // focusable while it currently holds focus, so a keyboard reader who
          // pressed Replay had focus dropped to <body> by their own keystroke —
          // and then spent the four-second playback with no focus at all, their
          // next Tab restarting from the top of the page rather than continuing
          // past the figure. `aria-disabled` announces the same "dimmed,
          // unavailable" state while keeping the button focusable, so focus is
          // still on Replay when the run finishes and it becomes live again.
          // The handler no-ops while a pass is in flight, and
          // `aria-disabled:pointer-events-none` reproduces the dead-to-the-mouse
          // behaviour `disabled` gave.
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              if (isPlaying && !hasFinished) return;
              handleReplay();
            }}
            aria-disabled={isPlaying && !hasFinished}
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
          >
            Replay
          </Button>
        )}
      </div>

      <div className="overflow-hidden panel-inset p-3">
        <TunnelingIntroCanvas
          grid={trajectory.grid}
          frame={frame}
          maxDensity={trajectory.maxDensity}
          barrierLeftEdge={trajectory.barrierLeftEdge}
          barrierRightEdge={trajectory.barrierRightEdge}
          barrierHeight={trajectory.barrierHeight}
          ariaLabel={ariaLabel}
        />
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {prefersReducedMotion
          ? "This is the exact result of a real split-operator time evolution run to completion, not a video — the same physics the interactive Explorer below computes live."
          : "A real numerical simulation — an actual split-operator time evolution, precomputed once and played back — using the same engine as the interactive Explorer below, not a scripted animation."}
      </p>
    </div>
  );
}
