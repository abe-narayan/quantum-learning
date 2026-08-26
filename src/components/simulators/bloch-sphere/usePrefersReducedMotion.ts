// Moved to src/components/motion/usePrefersReducedMotion.ts — the hook is no
// longer simulator-specific (the background field, the scroll-reveal system
// and the narrative components all need it), and nothing outside the
// simulators should be importing from a sibling simulator's folder.
//
// Kept as a re-export rather than deleted so the existing import sites across
// the simulators and visualizations keep working unchanged; new code should
// import from "@/components/motion/usePrefersReducedMotion".
export { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";
