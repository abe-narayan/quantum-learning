import { buildSearchIndex } from "@/lib/search";

/**
 * How many simulators the site has, derived rather than asserted.
 *
 * There is no programmatic registry of simulators: `/simulators` builds its
 * bench from a hand-written `SIMULATOR_INDEX` in its own page module, which a
 * homepage section cannot import without dragging every explorer's client
 * component along with it. `buildSearchIndex` in `src/lib/search/index.ts`
 * carries one `type: "simulator"` entry per real section on that page, kept
 * honest by `src/lib/search/__tests__`, so counting those entries is the
 * closest thing to a source of truth that exists here. Passing empty inputs
 * for every other content kind builds only the simulator entries, so this
 * costs nothing and touches no registry.
 *
 * This used to read `"16+"`, a hand-kept figure whose comment justified the
 * extra two as the concept map and "the density-matrix pillar's dedicated
 * mixture explorer". Both were already counted: the density-matrix explorer
 * is one of the fourteen on the bench, and the concept map is listed as its
 * own destination in `ExploreSection` two rows below the simulator row that
 * was quietly counting it a second time. The result was a homepage claiming
 * more instruments than `/simulators` ("Fourteen live instruments") and
 * `/about` (which has always derived it) will show you.
 *
 * The empty arrays are positional, so a future parameter added to
 * `buildSearchIndex` has to be added here too: a compile error rather than a
 * silent wrong number, which is the trade this file makes on purpose.
 *
 * Server-only by construction. Both readers (`Hero`, `ExploreSection`) are
 * Server Components, and `lib/search` is type-only in its imports, so nothing
 * here crosses the client boundary. See
 * `src/lib/design/__tests__/clientBoundary.test.ts`.
 */
export const SIMULATOR_COUNT = buildSearchIndex([], [], [], []).filter(
  (entry) => entry.type === "simulator"
).length;
