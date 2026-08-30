/**
 * Real intrinsic aspect ratio for each Current Quantum entry's verified
 * image, keyed by `entry.slug`.
 *
 * `ExternalFigure` reserves a fixed-ratio box before the image loads (so
 * nothing shifts on arrival) and defaults that box to 16:9 (`aspect-video`)
 * when no `aspect` is given, a reasonable default for landscape scientific
 * photography, but wrong for most of what this page actually links to: of
 * the ten entries with images, only the Sycamore chip photo is genuinely
 * 16:9. Seven are portrait or near-square (a lectern photo, two profile
 * portraits, a full-height System One installation, a blackboard portrait,
 * a dilution-fridge interior), which `object-contain` inside a 16:9 box
 * would still render correctly but heavily letterboxed, the image
 * shrunk into a strip in the middle of a mostly-empty gray box, reading as
 * broken rather than as a deliberate figure.
 *
 * These values are each image's real, measured pixel dimensions (fetched
 * and decoded directly, a PNG/JPEG header read, not a guess) reduced to a
 * `width/height` pair, so the reserved box always matches the image
 * exactly: no letterboxing, no shift, whatever the image's real shape. Omit
 * an entry here to keep `ExternalFigure`'s 16:9 default (correct for the
 * Sycamore chip photo, and for any future entry that is genuinely
 * widescreen).
 */
export const ENTRY_IMAGE_ASPECT: Record<string, string> = {
  // Peter Shor at a lectern, 2017 Dirac Medal ceremony, 759 x 977.
  "shors-algorithm-1994": "aspect-[759/977]",
  // Anton Zeilinger profile portrait, 2021, 1248 x 1668.
  "nobel-prize-2022-bell-tests": "aspect-[1248/1668]",
  // IBM Quantum System One, full installation photo, 6144 x 8160.
  "ibm-quantum-utility-2023": "aspect-[6144/8160]",
  // LIGO Hanford interferometer arm, 1984 x 1488 (an exact 4:3 frame).
  "ligo-squeezed-light-quantum-sensing-2023": "aspect-[4/3]",
  // NIST's post-quantum cryptography program illustration, 2917 x 2084.
  "nist-post-quantum-cryptography-standards-2024": "aspect-[2917/2084]",
  // NIST trapped-ion apparatus photo, 3756 x 2564.
  "ionq-record-two-qubit-fidelity-2025": "aspect-[3756/2564]",
  // John Bell at a CERN blackboard, 1982, 3033 x 3193, near-square.
  "bell-1964-epr-paradox-inequality": "aspect-[3033/3193]",
  // Richard Feynman at a blackboard, 1959, 1364 x 1366, effectively square.
  "feynman-simulating-physics-with-computers-1981": "aspect-square",
  // Dilution refrigerator interior, London Centre for Nanotechnology, 3480 x 4640 (an exact 3:4 frame).
  "dwave-onchip-cryogenic-control-2026": "aspect-[3/4]",
  // "google-sycamore-quantum-supremacy-2019" omitted deliberately: 1920 x
  // 1080 is exactly 16:9, so ExternalFigure's own default already matches.
};
