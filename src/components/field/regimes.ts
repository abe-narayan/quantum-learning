import type { FieldRegime } from "@/lib/design/pillars";

/**
 * ============================================================
 * Background environments
 * ============================================================
 * Six regimes, one per curriculum pillar; a seventh ("journey") that
 * crossfades through all six as the homepage scrolls; and an eighth
 * ("atlas") for pages that survey the whole curriculum rather than standing
 * inside one pillar's physics.
 *
 * The rule every one of these follows — and the reason there is not a single
 * generic particle system in this file — is that **the background depicts the
 * physics of the pillar you are standing in**:
 *
 *   wave      A real Gaussian wave packet, psi(x,t), with its |psi|^2 envelope.
 *             It propagates *and disperses* — the envelope genuinely widens
 *             with time, because a free packet's width grows as
 *             sqrt(1 + (t/tau)^2). Scrolling advances t.
 *   state     A Bloch sphere in orthographic projection with a state vector
 *             precessing about z (Larmor precession) and its equatorial
 *             shadow — the projection that measurement in the z basis sees.
 *   lattice   A coupled-qubit lattice with control lines running in from the
 *             edge; pulses travel along them at finite speed and light the
 *             qubit they reach. That is what "control and readout" looks like.
 *   graph     Circuit rails carrying gates right to left, including two-qubit
 *             connectors — a circuit executing, not decoration.
 *   operator  The magnitude structure |U_jk| of a Fourier-like unitary drawn
 *             as a matrix heat grid, slowly rotating in phase. Mastery is
 *             where operators stop being notation and start being objects.
 *   frontier  Apex. A horizon: dense, ordered, dim points below it (settled
 *             results) and sparse, bright, tentatively-connected points above
 *             (open problems). The horizon rises as you scroll.
 *   atlas     The neutral default for pages with no single pillar (Learn,
 *             Glossary, the concept Map, the Problems catalog, About): a
 *             faint reference grid — an atlas's own meridians and parallels
 *             — behind the six curriculum pillars themselves, drawn as a
 *             slowly-orbiting hexagon of nodes in curriculum order and
 *             joined edge to edge. It depicts the real thing these pages
 *             are actually showing (the shape of the whole six-pillar
 *             curriculum, held at a calm remove) rather than borrowing one
 *             pillar's narrative or crossfading through all of them.
 *
 * Everything is drawn in CSS pixels (the caller has already applied the
 * device-pixel-ratio transform), at low alpha, behind content. No regime may
 * draw at an alpha high enough to compete with body text — that ceiling is
 * enforced by the caller's `intensity` multiplier, not by trust.
 */

export type FieldFrame = {
  ctx: CanvasRenderingContext2D;
  /** Viewport size in CSS pixels. */
  width: number;
  height: number;
  /** Seconds since the field started. Frozen for reduced motion. */
  time: number;
  /** Document scroll progress, 0-1. */
  scroll: number;
  /** Raw scroll offset in px, for parallax that shouldn't normalise. */
  scrollY: number;
  /** Resolved pillar colors, ready for fillStyle/strokeStyle. */
  accent: string;
  dim: string;
  foreground: string;
  /**
   * Global opacity ceiling, 0-1. The caller lowers it on small screens and
   * raises it slightly for Apex. Every alpha in this file is multiplied by
   * it, so no regime can shout over the text.
   */
  intensity: number;
  /**
   * Detail scale, 0-1. Drives point counts and grid resolution so a phone
   * draws a genuinely lighter scene rather than the same scene at a lower
   * frame rate.
   */
  detail: number;
};

/** Deterministic hash-based pseudo-random in [0,1). Used instead of
 *  Math.random so a given point keeps its position across frames (and across
 *  resizes) without allocating and retaining an array of particles. */
function rand(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function withAlpha(ctx: CanvasRenderingContext2D, alpha: number, draw: () => void) {
  const previous = ctx.globalAlpha;
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  draw();
  ctx.globalAlpha = previous;
}

/* -------------------------------------------------------------------------
   wave — Quantum Mechanics
   ------------------------------------------------------------------------- */
function drawWave(frame: FieldFrame) {
  const { ctx, width, height, time, scroll, accent, dim, intensity, detail } = frame;

  // Free-particle Gaussian packet. sigma(t) = sigma0 * sqrt(1 + (t/tau)^2) is
  // the actual spreading law; using it (rather than a fixed-width envelope
  // that just slides) is the whole point — a reader who later meets wave
  // packet dispersion in Wave Mechanics has already watched it happen here.
  const tau = 26;
  const t = time * 0.55 + scroll * 22;
  const sigma0 = width * 0.09;
  const sigma = sigma0 * Math.sqrt(1 + (t / tau) ** 2);
  const centre = (width * 0.5 + t * width * 0.012) % (width * 1.6) - width * 0.3;

  const k = 0.055 + scroll * 0.02;
  const omega = 1.6;
  const baseline = height * (0.62 - scroll * 0.12);
  const amplitude = height * 0.11 * (sigma0 / sigma);

  const step = Math.max(2, Math.round(5 - detail * 3));

  // |psi|^2 envelope, filled.
  ctx.beginPath();
  ctx.moveTo(0, baseline);
  for (let x = 0; x <= width; x += step) {
    const g = Math.exp(-(((x - centre) / sigma) ** 2) / 2);
    ctx.lineTo(x, baseline - g * amplitude * 1.55);
  }
  ctx.lineTo(width, baseline);
  ctx.closePath();
  withAlpha(ctx, 0.1 * intensity, () => {
    ctx.fillStyle = accent;
    ctx.fill();
  });

  // Re(psi): the carrier under the envelope.
  ctx.beginPath();
  for (let x = 0; x <= width; x += step) {
    const g = Math.exp(-(((x - centre) / sigma) ** 2) / 2);
    const y = baseline - g * amplitude * Math.cos(k * (x - centre) - omega * time);
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.lineWidth = 1.25;
  withAlpha(ctx, 0.5 * intensity, () => {
    ctx.strokeStyle = accent;
    ctx.stroke();
  });

  // A second, slower packet lower down, out of phase — enough to suggest the
  // interference these two would produce without drawing a busy pattern.
  const centre2 = width - ((t * width * 0.008 + width * 0.2) % (width * 1.4));
  const baseline2 = height * 0.86;
  ctx.beginPath();
  for (let x = 0; x <= width; x += step) {
    const g = Math.exp(-(((x - centre2) / (sigma0 * 1.4)) ** 2) / 2);
    const y = baseline2 - g * amplitude * 0.6 * Math.cos(k * 0.8 * (x - centre2) + omega * 0.7 * time);
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.lineWidth = 1;
  withAlpha(ctx, 0.26 * intensity, () => {
    ctx.strokeStyle = dim;
    ctx.stroke();
  });

  // Position axis with ticks — this is a plot, not an ornament.
  withAlpha(ctx, 0.18 * intensity, () => {
    ctx.strokeStyle = dim;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, baseline);
    ctx.lineTo(width, baseline);
    ctx.stroke();
    const tickCount = Math.round(6 + detail * 8);
    for (let i = 0; i <= tickCount; i += 1) {
      const x = (i / tickCount) * width;
      ctx.beginPath();
      ctx.moveTo(x, baseline - 4);
      ctx.lineTo(x, baseline + 4);
      ctx.stroke();
    }
  });
}

/* -------------------------------------------------------------------------
   state — Quantum Computing
   ------------------------------------------------------------------------- */
function drawState(frame: FieldFrame) {
  const { ctx, width, height, time, scroll, accent, dim, intensity, detail } = frame;

  const cx = width * (0.72 - scroll * 0.06);
  const cy = height * (0.42 + scroll * 0.1);
  const r = Math.min(width, height) * 0.3;

  // Three great circles in orthographic projection: the equator (an ellipse
  // squashed by the viewing tilt) and two meridians.
  const tilt = 0.42;
  withAlpha(ctx, 0.22 * intensity, () => {
    ctx.strokeStyle = dim;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(cx, cy, r, r * tilt, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * tilt, r, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Axes.
  withAlpha(ctx, 0.16 * intensity, () => {
    ctx.strokeStyle = dim;
    ctx.setLineDash([3, 5]);
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 1.12);
    ctx.lineTo(cx, cy + r * 1.12);
    ctx.moveTo(cx - r * 1.12, cy);
    ctx.lineTo(cx + r * 1.12, cy);
    ctx.stroke();
    ctx.setLineDash([]);
  });

  // The state vector: polar angle set by scroll (the reader "rotates" the
  // qubit as they descend the page), azimuth precessing about z at a fixed
  // rate — Larmor precession, the thing a detuned drive actually does.
  const theta = 0.55 + scroll * 1.9;
  const phi = time * 0.6;
  const sx = Math.sin(theta) * Math.cos(phi);
  const sy = Math.sin(theta) * Math.sin(phi);
  const sz = Math.cos(theta);

  // Orthographic projection with the same tilt as the equator above.
  const px = cx + sx * r;
  const py = cy - sz * r + sy * r * tilt;

  // Equatorial shadow: where the Bloch vector projects onto the x-y plane,
  // i.e. the phase a z-basis measurement is blind to.
  const shadowX = cx + sx * r;
  const shadowY = cy + sy * r * tilt;

  withAlpha(ctx, 0.3 * intensity, () => {
    ctx.strokeStyle = dim;
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(shadowX, shadowY);
    ctx.stroke();
    ctx.setLineDash([]);
  });

  withAlpha(ctx, 0.7 * intensity, () => {
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.75;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, py);
    ctx.stroke();
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Amplitude readout: |a0|^2 and |a1|^2 as two bars in the far margin. These
  // are the real Born probabilities for the vector above, cos^2(theta/2) and
  // sin^2(theta/2), so the bars and the vector always agree.
  const p0 = Math.cos(theta / 2) ** 2;
  const barX = width * 0.08;
  const barBase = height * 0.78;
  const barH = height * 0.22;
  withAlpha(ctx, 0.3 * intensity, () => {
    ctx.fillStyle = accent;
    ctx.fillRect(barX, barBase - p0 * barH, 14, p0 * barH);
    ctx.fillStyle = dim;
    ctx.fillRect(barX + 26, barBase - (1 - p0) * barH, 14, (1 - p0) * barH);
  });

  // Sparse basis-state points drifting in the background, thinned on small
  // screens via `detail`.
  const count = Math.round(18 * detail) + 6;
  withAlpha(ctx, 0.22 * intensity, () => {
    ctx.fillStyle = dim;
    for (let i = 0; i < count; i += 1) {
      const x = rand(i * 3.1) * width;
      const y = (rand(i * 7.7) * height + time * 6 * (0.3 + rand(i) * 0.7)) % height;
      ctx.beginPath();
      ctx.arc(x, y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

/* -------------------------------------------------------------------------
   lattice — Quantum Hardware
   ------------------------------------------------------------------------- */
function drawLattice(frame: FieldFrame) {
  const { ctx, width, height, time, scroll, accent, dim, intensity, detail } = frame;

  const spacing = Math.max(78, 150 - detail * 55);
  const cols = Math.ceil(width / spacing) + 1;
  const rows = Math.ceil(height / spacing) + 1;
  const offsetY = -((scroll * height * 0.25) % spacing);

  // Couplers first, so qubits sit on top of them.
  withAlpha(ctx, 0.16 * intensity, () => {
    ctx.strokeStyle = dim;
    ctx.lineWidth = 1;
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const x = c * spacing;
        const y = r * spacing + offsetY;
        if (c < cols - 1) {
          ctx.beginPath();
          ctx.moveTo(x + 7, y);
          ctx.lineTo(x + spacing - 7, y);
          ctx.stroke();
        }
        if (r < rows - 1) {
          ctx.beginPath();
          ctx.moveTo(x, y + 7);
          ctx.lineTo(x, y + spacing - 7);
          ctx.stroke();
        }
      }
    }
  });

  // Control pulses: each row has a pulse travelling in from the left at a
  // finite speed, and a qubit brightens as the pulse passes it. That delay
  // between "signal sent" and "qubit responds" is the actual content of a
  // control chain, and it is visible here rather than implied.
  for (let r = 0; r < rows; r += 1) {
    const speed = 0.16 + rand(r * 5.5) * 0.1;
    const pulseX = ((time * speed + rand(r) ) % 1.6) * width - width * 0.3;
    const y = r * spacing + offsetY;

    withAlpha(ctx, 0.4 * intensity, () => {
      const gradient = ctx.createLinearGradient(pulseX - 90, 0, pulseX, 0);
      gradient.addColorStop(0, "rgba(0,0,0,0)");
      gradient.addColorStop(1, accent);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(Math.max(0, pulseX - 90), y);
      ctx.lineTo(Math.max(0, pulseX), y);
      ctx.stroke();
    });

    for (let c = 0; c < cols; c += 1) {
      const x = c * spacing;
      const distance = Math.abs(x - pulseX);
      const excitation = Math.max(0, 1 - distance / 70);
      // Capped well below the alpha ceiling the regime tests enforce: a
      // fully-excited qubit is the single brightest mark any regime draws,
      // and at higher alpha it pulled the eye off the text in front of it.
      withAlpha(ctx, (0.14 + excitation * 0.4) * intensity, () => {
        ctx.fillStyle = excitation > 0.05 ? accent : dim;
        ctx.beginPath();
        ctx.arc(x, y, 2.4 + excitation * 3.2, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }
}

/* -------------------------------------------------------------------------
   graph — Quantum Software
   ------------------------------------------------------------------------- */
function drawGraph(frame: FieldFrame) {
  const { ctx, width, height, time, scroll, accent, dim, intensity, detail } = frame;

  const railCount = Math.max(3, Math.round(3 + detail * 3));
  const top = height * 0.2;
  const gap = (height * 0.6) / (railCount - 1);

  withAlpha(ctx, 0.18 * intensity, () => {
    ctx.strokeStyle = dim;
    ctx.lineWidth = 1;
    for (let i = 0; i < railCount; i += 1) {
      const y = top + i * gap;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  });

  // Gates stream right-to-left, i.e. the circuit is executing past a fixed
  // read head. Every ~5th column is a two-qubit gate with a real control dot
  // and target, so the stream reads as a circuit rather than as blocks.
  const columnGap = 150;
  const travel = (time * 26 + scroll * 900) % columnGap;
  const columns = Math.ceil(width / columnGap) + 2;

  for (let c = 0; c < columns; c += 1) {
    const x = width - (c * columnGap - travel);
    if (x < -60 || x > width + 60) continue;
    const seed = Math.floor((c * columnGap - travel) / columnGap) + c;
    const isTwoQubit = rand(seed * 2.3) > 0.62;
    const wire = Math.floor(rand(seed * 9.1) * railCount);
    const y = top + wire * gap;

    if (isTwoQubit && railCount > 1) {
      const target = (wire + 1 + Math.floor(rand(seed * 4.4) * (railCount - 1))) % railCount;
      const ty = top + target * gap;
      withAlpha(ctx, 0.45 * intensity, () => {
        ctx.strokeStyle = accent;
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, ty);
        ctx.stroke();
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(x, y, 3.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, ty, 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x - 7, ty);
        ctx.lineTo(x + 7, ty);
        ctx.moveTo(x, ty - 7);
        ctx.lineTo(x, ty + 7);
        ctx.stroke();
      });
    } else {
      withAlpha(ctx, 0.36 * intensity, () => {
        ctx.strokeStyle = accent;
        ctx.lineWidth = 1.25;
        ctx.strokeRect(x - 11, y - 11, 22, 22);
      });
    }
  }
}

/* -------------------------------------------------------------------------
   operator — Quantum Mastery
   ------------------------------------------------------------------------- */
function drawOperator(frame: FieldFrame) {
  const { ctx, width, height, time, scroll, accent, dim, intensity, detail } = frame;

  // |U_jk| for a Fourier-like unitary, phase-rotated in time. The magnitude
  // pattern of a real structured operator has visible bands; a random grid
  // does not, and the difference is exactly what Mastery is about.
  const n = Math.max(6, Math.round(6 + detail * 6));
  const size = Math.min(width, height) * 0.46;
  const cell = size / n;
  const ox = width * 0.58 - size * 0.2;
  const oy = height * 0.24 + scroll * height * 0.1;

  for (let j = 0; j < n; j += 1) {
    for (let k = 0; k < n; k += 1) {
      const phase = (2 * Math.PI * j * k) / n + time * 0.35;
      const magnitude = Math.abs(Math.cos(phase)) * 0.5 + 0.5;
      withAlpha(ctx, magnitude * 0.16 * intensity, () => {
        ctx.fillStyle = accent;
        ctx.fillRect(ox + k * cell, oy + j * cell, cell - 1.5, cell - 1.5);
      });
    }
  }

  withAlpha(ctx, 0.2 * intensity, () => {
    ctx.strokeStyle = dim;
    ctx.lineWidth = 1;
    ctx.strokeRect(ox, oy, size, size);
    // Bra-ket style corner brackets, so the grid reads as an operator
    // written between bars rather than as a heatmap.
    const b = size * 0.12;
    ctx.beginPath();
    ctx.moveTo(ox - 10, oy + b);
    ctx.lineTo(ox - 10, oy - 6);
    ctx.lineTo(ox + b, oy - 6);
    ctx.moveTo(ox + size - b, oy + size + 6);
    ctx.lineTo(ox + size + 10, oy + size + 6);
    ctx.lineTo(ox + size + 10, oy + size - b);
    ctx.stroke();
  });

  // A faint Hilbert-space basis lattice behind it: orthogonal axes receding.
  withAlpha(ctx, 0.1 * intensity, () => {
    ctx.strokeStyle = dim;
    ctx.lineWidth = 1;
    const lines = Math.round(5 + detail * 5);
    for (let i = 0; i <= lines; i += 1) {
      const f = i / lines;
      ctx.beginPath();
      ctx.moveTo(0, height * f);
      ctx.lineTo(width * 0.34, height * (0.28 + f * 0.4));
      ctx.stroke();
    }
  });
}

/* -------------------------------------------------------------------------
   frontier — Apex
   ------------------------------------------------------------------------- */
function drawFrontier(frame: FieldFrame) {
  const { ctx, width, height, time, scroll, accent, dim, intensity, detail } = frame;

  // The horizon rises as the reader descends: the settled region grows, and
  // the open region above it is what remains. It is a deliberately literal
  // metaphor, and it is the only regime that changes shape with scroll rather
  // than merely translating.
  const horizon = height * (0.78 - scroll * 0.34);

  withAlpha(ctx, 0.34 * intensity, () => {
    const gradient = ctx.createLinearGradient(0, horizon - 1, width, horizon + 1);
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(0.5, accent);
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, horizon);
    ctx.lineTo(width, horizon);
    ctx.stroke();
  });

  // Below: settled results. A dense, regular, dim lattice — order, closed.
  const spacing = Math.max(34, 60 - detail * 24);
  withAlpha(ctx, 0.13 * intensity, () => {
    ctx.fillStyle = dim;
    for (let y = horizon + spacing * 0.5; y < height; y += spacing) {
      for (let x = spacing * 0.5; x < width; x += spacing) {
        const depth = (y - horizon) / Math.max(1, height - horizon);
        ctx.globalAlpha = 0.13 * intensity * (0.35 + depth * 0.65);
        ctx.fillRect(x - 1, y - 1, 2, 2);
      }
    }
  });

  // Above: open problems. Sparse, brighter, irregular — and the links between
  // them form and fade, because which results connect to which is exactly
  // what is not yet known.
  const openCount = Math.round(14 + detail * 18);
  const points: Array<{ x: number; y: number; b: number }> = [];
  for (let i = 0; i < openCount; i += 1) {
    const x = rand(i * 1.7) * width;
    const y = rand(i * 4.3) * horizon * 0.92;
    // Slow independent breathing so the field never pulses in lockstep.
    const b = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(time * 0.5 + rand(i * 8.9) * Math.PI * 2));
    points.push({ x, y, b });
  }

  withAlpha(ctx, 0.14 * intensity, () => {
    ctx.strokeStyle = accent;
    ctx.lineWidth = 0.75;
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 > 190 * 190) continue;
        const link = Math.sin(time * 0.35 + i * 1.3 + j * 0.7);
        if (link < 0.45) continue;
        ctx.globalAlpha = 0.14 * intensity * (link - 0.45) * 1.8;
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[j].x, points[j].y);
        ctx.stroke();
      }
    }
  });

  // Open-problem points draw in `accent`, like every other regime's brightest
  // marks — not `--foreground` (docs/UX_REVIEW.md P1-13). Apex is the pillar
  // with the densest text and the strongest `--atmosphere-strength`; drawing
  // these in the body-text color would have made them the single brightest
  // marks anywhere in the background system, on the page least able to
  // afford it. The rising horizon and the sparse link structure above
  // already carry the "known below, open above" metaphor — point brightness
  // was never doing the teaching, so capping it here costs nothing.
  for (const point of points) {
    withAlpha(ctx, 0.3 * intensity * point.b, () => {
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 1.35, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}

/* -------------------------------------------------------------------------
   atlas — neutral default for cross-cutting, whole-curriculum pages
   ------------------------------------------------------------------------- */
function drawAtlas(frame: FieldFrame) {
  const { ctx, width, height, time, scroll, accent, dim, intensity, detail } = frame;

  // A quiet reference grid — the literal furniture of an atlas — rather than
  // any single pillar's phenomenon. Drift is slow and vertical only; nothing
  // here pretends to be "descending" anything the way `journey` genuinely
  // is, because these pages have no one curriculum position to descend
  // through.
  const gridSpacing = Math.max(64, 120 - detail * 40);
  const driftY = ((time * 3 + scroll * height * 0.05) % gridSpacing + gridSpacing) % gridSpacing;
  withAlpha(ctx, 0.07 * intensity, () => {
    ctx.strokeStyle = dim;
    ctx.lineWidth = 1;
    for (let y = driftY - gridSpacing; y < height + gridSpacing; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    const vSpacing = gridSpacing * 1.6;
    for (let x = 0; x < width + vSpacing; x += vSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
  });

  // Six nodes, one per curriculum pillar (Mechanics through Apex, the same
  // order as `journey`'s sequence), held in a slow orbit around the page
  // centre and joined in that order — the curriculum's own path, not an
  // arbitrary hexagon. This is what these pages are actually about: the
  // whole six-pillar structure, seen from outside any one of them, rather
  // than a phenomenon borrowed from a pillar they aren't standing in.
  const cx = width * 0.5;
  const cy = height * 0.46;
  const radius = Math.min(width, height) * 0.3;
  const nodeCount = 6;
  const spin = time * 0.015 + scroll * 0.12;

  const nodes: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < nodeCount; i += 1) {
    const angle = spin + (i / nodeCount) * Math.PI * 2;
    nodes.push({
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius * 0.7,
    });
  }

  withAlpha(ctx, 0.16 * intensity, () => {
    ctx.strokeStyle = dim;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(nodes[0].x, nodes[0].y);
    for (let i = 1; i < nodes.length; i += 1) ctx.lineTo(nodes[i].x, nodes[i].y);
    ctx.closePath();
    ctx.stroke();
  });

  nodes.forEach((node, i) => {
    // Slow, independent breathing (as `frontier`'s open-problem points do),
    // so the six nodes never pulse in lockstep like a loading indicator.
    const pulse = 0.5 + 0.5 * Math.sin(time * 0.3 + i * 1.7);
    withAlpha(ctx, (0.16 + pulse * 0.16) * intensity, () => {
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 2.6 + pulse * 1.4, 0, Math.PI * 2);
      ctx.fill();
    });
  });
}

/* -------------------------------------------------------------------------
   journey — the homepage
   ------------------------------------------------------------------------- */
const JOURNEY_SEQUENCE: Exclude<FieldRegime, "journey">[] = [
  "wave",
  "state",
  "lattice",
  "graph",
  "operator",
  "frontier",
];

/**
 * Crossfades the six pillar environments in curriculum order across the
 * document's scroll range, so scrolling the homepage is literally a descent
 * through the curriculum: waves, then qubits, then hardware, then software,
 * then operators, then the frontier. Two regimes are live at any moment
 * (never more), so the cost is bounded at twice a single regime.
 */
function drawJourney(frame: FieldFrame) {
  const segments = JOURNEY_SEQUENCE.length - 1;
  const position = Math.min(0.999, Math.max(0, frame.scroll)) * segments;
  const index = Math.floor(position);
  const blend = position - index;

  // Smoothstep so the handover has no visible seam at the segment boundary.
  const eased = blend * blend * (3 - 2 * blend);

  const from = JOURNEY_SEQUENCE[index];
  const to = JOURNEY_SEQUENCE[Math.min(segments, index + 1)];

  if (eased < 0.995) {
    REGIME_RENDERERS[from]({ ...frame, intensity: frame.intensity * (1 - eased) });
  }
  if (eased > 0.005 && to !== from) {
    REGIME_RENDERERS[to]({ ...frame, intensity: frame.intensity * eased });
  }
}

/**
 * Every renderer divides by, or takes a modulus of, some fraction of the
 * viewport size. A zero-size viewport therefore produces NaN coordinates,
 * which canvas silently accepts and then drops the rest of the path for — a
 * blank background with nothing in the console. Zero-size is not
 * hypothetical: a phone reports it mid-orientation-change, and so does a
 * canvas measured before layout has settled.
 *
 * Guarding once here rather than at the top of six renderers keeps the rule
 * in one place, and covers `journey` (which dispatches back through this same
 * table) for free.
 */
function guarded(render: (frame: FieldFrame) => void) {
  return (frame: FieldFrame) => {
    if (!(frame.width > 0) || !(frame.height > 0)) return;
    render(frame);
  };
}

export const REGIME_RENDERERS: Record<FieldRegime, (frame: FieldFrame) => void> = {
  wave: guarded(drawWave),
  state: guarded(drawState),
  lattice: guarded(drawLattice),
  graph: guarded(drawGraph),
  operator: guarded(drawOperator),
  frontier: guarded(drawFrontier),
  journey: guarded(drawJourney),
  atlas: guarded(drawAtlas),
};

/** Short, human-readable description of what a regime depicts. Surfaced as
 *  the field's accessible description so the environment is not information
 *  that only sighted visitors receive. */
export const REGIME_DESCRIPTIONS: Record<FieldRegime, string> = {
  wave: "Background animation: a Gaussian wave packet propagating and spreading, drawn with its probability-density envelope.",
  state: "Background animation: a state vector precessing on the Bloch sphere, with its measurement probabilities shown as two bars.",
  lattice:
    "Background animation: a lattice of coupled qubits with control pulses travelling along wiring and exciting each qubit in turn.",
  graph: "Background animation: a quantum circuit executing, with single- and two-qubit gates streaming along the qubit rails.",
  operator:
    "Background animation: the magnitude structure of a Fourier-like unitary matrix, drawn as a grid of cells whose brightness tracks each entry.",
  frontier:
    "Background animation: a horizon separating a dense lattice of settled results below from sparse, tentatively-connected open problems above.",
  journey:
    "Background animation: the six curriculum environments in sequence — wave packets, Bloch-sphere states, qubit hardware, circuits, operators, and the research frontier — crossfading as the page scrolls.",
  atlas:
    "Background animation: a faint reference grid behind six slowly orbiting nodes representing the curriculum's six pillars, joined in learning order.",
};
