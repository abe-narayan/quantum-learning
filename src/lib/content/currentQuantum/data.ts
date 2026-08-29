import type { CurrentQuantumEntryBody } from "./types";
import type { CurrentQuantumSlug } from "./metaRegistry";

/**
 * The prose half of the hand-maintained "Current Quantum" collection: for
 * each entry slug, its summary, source citation, "why this matters" line,
 * difficulty and optional figure — plus the editorial provenance comment
 * recording where every fact came from.
 *
 * SERVER-ONLY. This module must never be reachable from a `"use client"`
 * component; `src/lib/design/__tests__/clientBoundary.test.ts` enforces that
 * from the source graph. The lightweight half every entry also has — slug,
 * date, title, category, related lesson — lives in `metaRegistry.ts`, which
 * *is* client-importable and carries the full explanation of why the two are
 * separate files and what silently breaks if they are merged back. Read that
 * before touching this one.
 *
 * There is no `npm run generate:*` step for this file and no generated twin:
 * both halves are authored by hand, and no field appears in both, so there
 * is nothing here that can drift out of sync with something else. What the
 * two halves must agree on is the *set of slugs*, and that is enforced by
 * the `Record<CurrentQuantumSlug, ...>` annotation below (a missing body is
 * a compile error, an orphan body is an excess-property error) and re-checked
 * at runtime by `__tests__/registry.test.ts`.
 *
 * TO ADD AN ENTRY: verify the date/facts against the cited source, verify
 * the entry's `relatedLessonSlug` is a real file under `src/content/lessons/`,
 * append the meta to `CURRENT_QUANTUM_META` in `metaRegistry.ts`, and append
 * the body below with a comment linking to where you got it. Order here is
 * for human readability only — display order comes from the meta's `date`
 * (see `getAllCurrentQuantumMeta`), so an entry filed out of chronological
 * order is untidy, never incorrect.
 */
export const CURRENT_QUANTUM_BODIES: Record<CurrentQuantumSlug, CurrentQuantumEntryBody> = {
  // Source: P. W. Shor, "Polynomial-Time Algorithms for Prime Factorization
  // and Discrete Logarithms on a Quantum Computer," SIAM J. Comput. 26
  // (1997) 1484 (first presented at IEEE FOCS, Nov. 1994; preprint
  // arXiv:quant-ph/9508027). Date recorded as the 1994 conference result,
  // which is the historically cited "Shor's algorithm" moment.
  "shors-algorithm-1994": {
    summary:
      "Mathematician Peter Shor showed that a quantum computer could factor large integers exponentially faster than any known classical method, by turning factoring into a period-finding problem solvable with the quantum Fourier transform. Because the security of RSA encryption rests on factoring being classically hard, this single theoretical result is what turned quantum computing from a physics curiosity into something governments and companies actively plan around — decades before a machine large enough to run it on cryptographically relevant numbers existed.",
    source: {
      name: "arXiv (SIAM J. Comput. 26, 1997)",
      url: "https://arxiv.org/abs/quant-ph/9508027",
    },
    whyThisMatters:
      "This lesson derives the exact period-finding circuit Shor's algorithm depends on, the same construction that made this 1994 result a threat real enough to justify a new generation of cryptography.",
    difficulty: "advanced",
    // Image verified via WebFetch on the Commons file page (author "International
    // Centre for Theoretical Physics", license CC BY 3.0) and via `curl -sI` on
    // the upload.wikimedia.org URL (200, image/png).
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Peter_Shor_2017_Dirac_Medal_Award_Ceremony.png",
    imageAlt: "Peter Shor speaking at a lectern after receiving the 2017 Dirac Medal from the ICTP",
    imageCaption:
      "Peter Shor in 2017, more than two decades after the 1994 result this entry describes, receiving the ICTP's Dirac Medal for exactly that work.",
    imageAttribution: {
      credit: "International Centre for Theoretical Physics",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Peter_Shor_2017_Dirac_Medal_Award_Ceremony.png",
      license: "CC BY 3.0",
    },
  },
  // Source: D. Bouwmeester et al., "Experimental quantum teleportation,"
  // Nature 390, 575-579 (11 Dec. 1997). https://www.nature.com/articles/37539
  "first-quantum-teleportation-1997": {
    summary:
      "A team led by Anton Zeilinger in Innsbruck, Austria used entangled photon pairs and a joint (Bell-state) measurement to transfer an unknown photon's polarization state onto a distant photon, without the state ever traveling through the space in between and without violating the no-cloning theorem. It was the first time the teleportation protocol — proposed theoretically in 1993 — had actually been carried out, confirming it works with real photons and real detectors, not just on paper.",
    source: {
      name: "Nature",
      url: "https://www.nature.com/articles/37539",
    },
    whyThisMatters:
      "This lesson derives the exact three-qubit protocol — entangle, Bell-measure, classically communicate, correct — that this 1997 experiment was the first to actually run with real photons.",
    difficulty: "intermediate",
  },
  // Source: L. M. K. Vandersypen et al., "Experimental realization of Shor's
  // quantum factoring algorithm using nuclear magnetic resonance," Nature
  // 414, 883-887 (20 Dec. 2001). https://www.nature.com/articles/414883a
  "ibm-nmr-factors-15-2001": {
    summary:
      "Researchers at IBM's Almaden lab, together with Stanford, built a 7-qubit quantum computer out of a custom molecule read out by nuclear magnetic resonance and used it to run Shor's algorithm end to end, correctly factoring 15 into 3 x 5. It was a tiny number that a child could factor by hand, but the point wasn't the arithmetic — it was the first time every step of a real quantum algorithm (superposition, entanglement, interference, measurement) had been executed together on physical hardware rather than just simulated.",
    source: {
      name: "Nature",
      url: "https://www.nature.com/articles/414883a",
    },
    whyThisMatters:
      "This lesson walks through factoring 15 with a=7 step by step (the exact instance IBM's 2001 experiment ran on real hardware), including the lesson's own honest note about what part of that pipeline actually needed a quantum computer.",
    difficulty: "advanced",
  },
  // Source: J. Yin et al., "Satellite-based entanglement distribution over
  // 1200 kilometers," Science 356, 1140-1144 (15 June 2017).
  // https://www.science.org/doi/10.1126/science.aan3211
  "micius-satellite-entanglement-2017": {
    summary:
      "The Micius satellite generated pairs of entangled photons in orbit and beamed one photon of each pair down to two ground stations in China separated by 1,200 km, far beyond what optical fiber loss allows. Measurements at the two stations violated a CHSH-type Bell inequality by several standard deviations, confirming the photons were still entangled after traveling through the atmosphere from space — a key proof that entanglement can survive real-world, long-distance channels needed for a future quantum internet.",
    source: {
      name: "Science",
      url: "https://www.science.org/doi/10.1126/science.aan3211",
    },
    whyThisMatters:
      "This lesson derives the S = 2√2 quantum CHSH value by hand for an ideal Bell state; Micius measured a real (noisier, but still classically-impossible) violation of that same inequality across 1,200 km of space.",
    difficulty: "advanced",
  },
  // Source: F. Arute et al., "Quantum supremacy using a programmable
  // superconducting processor," Nature 574, 505-510 (23 Oct. 2019).
  // https://www.nature.com/articles/s41586-019-1666-5
  "google-sycamore-quantum-supremacy-2019": {
    summary:
      "Google's 53-qubit Sycamore chip sampled the output of a pseudo-random quantum circuit a million times in about 200 seconds, a task Google estimated would take the best classical supercomputer of the day roughly 10,000 years to reproduce (a figure IBM publicly disputed at the time, arguing a better classical algorithm could do it in days). That estimate did not hold for long: in 2022, Feng Pan, Keyang Chen, and Pan Zhang (Institute of Theoretical Physics, Chinese Academy of Sciences) published a tensor-network method that generated a million correlated bitstrings from the identical circuit in about 15 hours on a 512-GPU cluster, at a fidelity (~0.0037) comparable to Sycamore's own, and argued an exascale supercomputer could do the same task in seconds (Phys. Rev. Lett. 129, 090502). Google's underlying hardware result — that Sycamore does sample from the circuit's quantum distribution — was never shown to be wrong, but the '10,000 years, unreachable classically' framing was: this was the first widely reported claim of a task supposedly beyond brute-force classical simulation, and also an early, concrete lesson that a classical-hardness claim is only as good as the best classical algorithm known at the time it's made.",
    source: {
      name: "Nature",
      url: "https://www.nature.com/articles/s41586-019-1666-5",
    },
    whyThisMatters:
      "This capstone is explicit that 'quantum speedup' needs a precise, defensible comparison to a real classical algorithm — exactly the argument Google and IBM publicly disagreed about over Sycamore's claimed 10,000-year classical runtime, and exactly what the 2022 Pan-Chen-Zhang classical simulation later demonstrated concretely: the 'best classical algorithm' a quantum-advantage claim is measured against is a moving target, not a fixed constant.",
    difficulty: "advanced",
    // Image verified via WebFetch on the Commons file page (author "Google",
    // license CC BY 3.0, sourced from Google's own Oct. 2019 YouTube release)
    // and via `curl -sI` on the upload.wikimedia.org URL (200, image/png).
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/07/Google_Sycamore_Chip_001.png",
    imageAlt: "Close-up of Google's Sycamore superconducting quantum processor chip",
    imageCaption:
      "The Sycamore processor itself, from Google's own October 2019 release — the 53-qubit chip behind this entry's 10,000-year classical-runtime claim and its later challenge.",
    imageAttribution: {
      credit: "Google",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Google_Sycamore_Chip_001.png",
      license: "CC BY 3.0",
    },
  },
  // Source: The Nobel Prize in Physics 2022, press release, NobelPrize.org
  // (4 Oct. 2022).
  // https://www.nobelprize.org/prizes/physics/2022/press-release/
  "nobel-prize-2022-bell-tests": {
    summary:
      "The 2022 Nobel Prize in Physics went jointly to John Clauser, Alain Aspect, and Anton Zeilinger for decades of experiments testing Bell's inequality with entangled photons. Clauser built the first practical test in the 1970s; Aspect closed a major loophole in the 1980s by switching measurement settings after the photons were already in flight; Zeilinger pushed the techniques further, enabling later work like entanglement swapping and teleportation. Together their experiments repeatedly confirmed that entangled particles show correlations no theory built on locality and pre-existing hidden values can explain, cementing entanglement as a real, exploitable physical resource rather than a philosophical puzzle.",
    source: {
      name: "NobelPrize.org",
      url: "https://www.nobelprize.org/prizes/physics/2022/press-release/",
    },
    whyThisMatters:
      "This lesson proves the |S| ≤ 2 bound that every local hidden-variable theory must obey; Clauser, Aspect, and Zeilinger are the three physicists whose experiments actually measured real entangled particles violating it.",
    difficulty: "intermediate",
    // Image verified via WebFetch on the Commons file page (author "Jacqueline
    // Godany", license CC BY 4.0) and via `curl -sI` on the upload.wikimedia.org
    // URL (200, image/jpeg). Only one of the three 2022 laureates is pictured —
    // no free group photo of all three was found — so the caption names him
    // specifically rather than implying the photo covers all three.
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8b/Anton_Zeilinger_2021_%28profile_cropped%29.jpg",
    imageAlt: "Portrait of physicist Anton Zeilinger at the Institute for Quantum Optics and Quantum Information, Vienna",
    imageCaption:
      "Anton Zeilinger, photographed in 2021 — one of the three physicists, with John Clauser and Alain Aspect, who jointly won the 2022 Nobel Prize this entry describes.",
    imageAttribution: {
      credit: "Jacqueline Godany",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Anton_Zeilinger_2021_(profile_cropped).jpg",
      license: "CC BY 4.0",
    },
  },
  // Source: Y. Kim et al., "Evidence for the utility of quantum computing
  // before fault tolerance," Nature 618, 500-505 (14 June 2023).
  // https://www.nature.com/articles/s41586-023-06096-3
  "ibm-quantum-utility-2023": {
    summary:
      "Using a 127-qubit Eagle processor, an IBM-led team simulated the dynamics of a 2D transverse-field Ising model at a circuit size IBM argued was too large to verify against the best classical tensor-network methods available in mid-2023. That framing didn't hold for long: within months, Joseph Tindall, Matt Fishman, Miles Stoudenmire, and Dries Sels published a tensor-network simulation (PRX Quantum 5, 010308, 2024; posted to arXiv in June 2023) that exploited the near-tree structure of IBM's heavy-hexagon qubit layout via belief-propagation contraction, and reported results that were 'significantly more accurate and precise' than IBM's own error-mitigated quantum results — not just feasible, but better. Several other independent groups published comparably efficient classical simulations of the same circuit around the same time. IBM's raw hardware data itself was never shown to be wrong, but the implicit claim that no classical method could match it collapsed almost immediately. The key trick on IBM's side was never full quantum error correction (which real hardware still can't do at this scale) but error mitigation — techniques like zero-noise extrapolation that run the same noisy circuit at different noise levels and extrapolate back to what a noiseless result would look like.",
    source: {
      name: "Nature",
      url: "https://www.nature.com/articles/s41586-023-06096-3",
    },
    whyThisMatters:
      "This lesson derives zero-noise extrapolation's linear-in-noise-level formula from scratch — the exact technique IBM's 2023 paper leaned on to get a checkable answer out of noisy hardware without full error correction. The Tindall et al. rebuttal that followed within months is the sharpest real instance of the 'compared to what classical algorithm' problem: IBM's utility claim rested on the best classical method available in mid-2023, and a better one arrived before the year was out.",
    difficulty: "advanced",
    // Image verified via WebFetch on the Commons file page (author "Onri Jay
    // Benally" / OJB Quantum, license CC BY 4.0) and via `curl -sI` on the
    // upload.wikimedia.org URL (200, image/jpeg). This is a Quantum System One
    // at IBM's own Yorktown Heights research center, not the specific machine
    // this 2023 result ran on, but IBM's 127-qubit Eagle processor (used here)
    // is exactly the kind of chip that housing was built for — the caption
    // says so explicitly.
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/91/IBM_Quantum_System_One.jpg",
    imageAlt: "An IBM Quantum System One installation, its qubit chip enclosed in a hexagonal glass-and-steel chandelier housing",
    imageCaption:
      "An IBM Quantum System One at IBM's Yorktown Heights research center — the same chandelier-style enclosure IBM's 127-qubit Eagle processor (used in this 2023 result) runs inside, though not this specific machine.",
    imageAttribution: {
      credit: "Onri Jay Benally (OJB Quantum)",
      creditUrl: "https://commons.wikimedia.org/wiki/File:IBM_Quantum_System_One.jpg",
      license: "CC BY 4.0",
    },
  },
  // Source: L. McCuller et al., "Broadband Quantum Enhancement of the LIGO
  // Detectors with Frequency-Dependent Squeezing," Phys. Rev. X 13, 041021
  // (30 Oct. 2023). https://doi.org/10.1103/PhysRevX.13.041021
  //
  // NOTE: this entry previously sat near the end of the array (after two
  // 2025 entries), which contradicted its own 2023 date. Moved here, next
  // to its correct chronological neighbors, since the array is short enough
  // that this placement stays easy to eyeball-verify by date.
  "ligo-squeezed-light-quantum-sensing-2023": {
    summary:
      "Ahead of its fourth observing run, the LIGO gravitational-wave detectors were upgraded with a 300-meter filter cavity that produces 'frequency-dependent squeezed' light, injected into the interferometer to reduce quantum measurement noise across the entire detection band rather than just at high frequencies as in earlier squeezing setups. The result was a broadband sensitivity improvement of 15-18%, which increases LIGO's astrophysical detection rate for events like black hole and neutron star mergers by as much as 65% — a direct, deployed application of squeezed-state quantum optics that trades uncertainty in one observable for less uncertainty in the one the experiment actually measures.",
    source: {
      name: "Physical Review X",
      url: "https://doi.org/10.1103/PhysRevX.13.041021",
    },
    whyThisMatters:
      "This lesson derives exactly how a squeezed state trades a narrower Δx for a wider Δp while keeping their product at the Heisenberg minimum — the mechanism LIGO's 2023 upgrade uses in its interferometer to beat the ordinary quantum noise floor.",
    difficulty: "advanced",
    // Image verified via WebFetch on the Commons file page (author "Umptanum",
    // license CC BY-SA 3.0 / GFDL) and via `curl -sI` on the upload.wikimedia.org
    // URL (200, image/jpeg).
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/4/43/Northern_leg_of_LIGO_interferometer_on_Hanford_Reservation.JPG",
    imageAlt: "The vacuum tube of LIGO's northern interferometer arm extending across the Hanford, Washington site",
    imageCaption:
      "One arm of LIGO's Hanford interferometer — this entry's 2023 squeezed-light upgrade was installed into detectors exactly like this one, at both the Hanford and Livingston sites.",
    imageAttribution: {
      credit: "Umptanum",
      creditUrl:
        "https://commons.wikimedia.org/wiki/File:Northern_leg_of_LIGO_interferometer_on_Hanford_Reservation.JPG",
      license: "CC BY-SA 3.0",
    },
  },
  // Source: D. Bluvstein et al., "Logical quantum processor based on
  // reconfigurable atom arrays," Nature 626, 58-65 (6 Dec. 2023).
  // https://www.nature.com/articles/s41586-023-06927-3
  "harvard-quera-logical-qubits-2023": {
    summary:
      "A Harvard/QuEra/MIT collaboration used 280 individually-trapped neutral rubidium atoms, held and moved with optical tweezers, to encode 48 error-corrected logical qubits and run hundreds of logical gate operations across them — the largest logical-qubit processor demonstrated at the time. The result leaned on a distinctive feature of the neutral-atom platform: atoms can be physically shuttled between separate storage, entangling, and readout zones mid-circuit, which let the team implement error-correcting codes that would be far harder to wire up on a fixed, non-reconfigurable qubit grid.",
    source: {
      name: "Nature",
      url: "https://www.nature.com/articles/s41586-023-06927-3",
    },
    whyThisMatters:
      "This lesson explains how optical tweezers trap and rearrange neutral atoms into reconfigurable 2D/3D arrays — the exact hardware trick that let this 2023 experiment move atoms between zones to implement 48 logical qubits.",
    difficulty: "advanced",
  },
  // Source: NIST, "NIST Releases First 3 Finalized Post-Quantum Encryption
  // Standards" (13 Aug. 2024).
  // https://www.nist.gov/news-events/news/2024/08/nist-releases-first-3-finalized-post-quantum-encryption-standards
  "nist-post-quantum-cryptography-standards-2024": {
    summary:
      "After an eight-year public competition, NIST published three finalized standards for cryptography designed to resist attacks from a future large-scale quantum computer: FIPS 203 (ML-KEM, for general encryption/key exchange), FIPS 204 (ML-DSA, for digital signatures), and FIPS 205 (SLH-DSA, a hash-based backup signature scheme). None of these algorithms rely on the integer-factoring or discrete-log problems that Shor's algorithm breaks; instead they're built on different hard problems (structured lattices, and for SLH-DSA, hash functions) believed to resist both classical and quantum attack.",
    source: {
      name: "NIST",
      url: "https://www.nist.gov/news-events/news/2024/08/nist-releases-first-3-finalized-post-quantum-encryption-standards",
    },
    whyThisMatters:
      "This is the direct policy response to the threat this lesson derives mathematically: because Shor's algorithm breaks RSA's factoring assumption, NIST standardized replacement algorithms built on problems it doesn't touch.",
    difficulty: "intermediate",
    // Image verified via WebFetch on https://www.nist.gov/image/post-quantum-cryptography-algorithms
    // (credit "N. Hanacek/NIST") and via `curl -sI` on the nist.gov URL itself
    // (200, image/png) — hosted directly on www.nist.gov, an allow-listed CSP
    // host. License per NIST's own copyright policy
    // (https://www.nist.gov/oism/copyrights): NIST content is public
    // information unless explicitly marked otherwise, and this image carries
    // no such marking.
    imageUrl: "https://www.nist.gov/sites/default/files/images/2022/04/05/Crypto-rev1.png",
    imageAlt: "NIST illustration for its post-quantum cryptography program, depicting a branching tree alongside lattice imagery",
    imageCaption:
      "NIST's own illustration for its post-quantum cryptography program — the multi-year effort that produced the three standards this entry describes.",
    imageAttribution: {
      credit: "N. Hanacek/NIST",
      creditUrl: "https://www.nist.gov/image/post-quantum-cryptography-algorithms",
      license: "Public domain (U.S. government work)",
    },
  },
  // Source: Google Quantum AI blog, "Meet Willow, our state-of-the-art
  // quantum chip" (9 Dec. 2024); underlying paper R. Acharya et al.,
  // "Quantum error correction below the surface code threshold," Nature
  // 638, 920-926 (2025). https://blog.google/technology/research/google-willow-quantum-chip/
  "google-willow-below-threshold-2024": {
    summary:
      "Google's 105-qubit Willow processor ran surface-code memories at increasing code distances (3x3, 5x5, 7x7 grids of physical qubits per logical qubit) and showed the logical error rate roughly halving each time the grid got bigger, rather than growing worse — the long-sought 'below threshold' behavior where adding more physical qubits per logical qubit actually helps instead of hurts. The larger memory's logical qubit also outlived its best individual physical qubit, a 'beyond breakeven' result that is a necessary (though not by itself sufficient) condition for building a large, fault-tolerant quantum computer.",
    source: {
      name: "Google Quantum AI",
      url: "https://blog.google/technology/research/google-willow-quantum-chip/",
    },
    whyThisMatters:
      "This lesson explains why real roadmaps build toward surface codes because their distance can grow just by making the 2D grid bigger — precisely the 3x3-to-7x7 scaling Willow used to demonstrate below-threshold behavior.",
    difficulty: "advanced",
  },
  // Source: J. M. Thomas et al., "Quantum teleportation coexisting with
  // classical communications in optical fiber," Optica 11(12), 1700 (20
  // Dec. 2024). https://doi.org/10.1364/OPTICA.540362
  "northwestern-teleportation-over-internet-fiber-2024": {
    summary:
      "A Northwestern University team led by Prem Kumar teleported a photonic qubit's quantum state across a 30.2 km fiber that was simultaneously carrying 400 Gbps of ordinary internet traffic, by carefully separating the quantum photons' wavelength channel from the classical data channels sharing the same physical cable. It's the first demonstration that quantum teleportation doesn't require its own dedicated dark fiber — it can, with the right filtering, share existing telecom infrastructure with live data traffic, a practical prerequisite for any real-world quantum network.",
    source: {
      name: "Optica",
      url: "https://doi.org/10.1364/OPTICA.540362",
    },
    whyThisMatters:
      "This lesson notes that a photonic qubit's defining property is that it travels rather than sitting still — exactly the property this 2024 experiment exploited to send a teleported qubit down a live, shared internet fiber.",
    difficulty: "intermediate",
  },
  // Source: IBM Newsroom, "IBM Delivers New Quantum Processors, Software,
  // and Algorithm Breakthroughs on Path to Advantage and Fault Tolerance"
  // (12 Nov. 2025).
  // https://newsroom.ibm.com/2025-11-12-ibm-delivers-new-quantum-processors,-software,-and-algorithm-breakthroughs-on-path-to-advantage-and-fault-tolerance
  "ibm-nighthawk-loon-2025": {
    summary:
      "IBM introduced two new superconducting processors with different jobs: Nighthawk, a 120-qubit chip built for running larger, more complex circuits en route to a 2026 quantum-advantage claim, and Loon, a testbed where each qubit connects to six neighbors (including vertically) rather than the usual four, a denser 3D-style connectivity aimed at implementing more efficient quantum low-density parity-check (qLDPC) error-correcting codes. IBM also reported decoding Loon's error syndromes on classical hardware in under 480 nanoseconds, fast enough to keep up with the error-correction cycle in real time.",
    source: {
      name: "IBM Newsroom",
      url: "https://newsroom.ibm.com/2025-11-12-ibm-delivers-new-quantum-processors,-software,-and-algorithm-breakthroughs-on-path-to-advantage-and-fault-tolerance",
    },
    whyThisMatters:
      "This lesson's whole point is the physical-to-logical qubit overhead real roadmaps have to pay; Loon's six-way connectivity is IBM's specific hardware bet for shrinking that overhead with more efficient error-correcting codes.",
    difficulty: "advanced",
  },
  // Source: IonQ, "IonQ Achieves Landmark Result, Setting New World Record
  // in Quantum Computing Performance" (21 Oct. 2025).
  // https://www.ionq.com/news/ionq-achieves-landmark-result-setting-new-world-record-in-quantum-computing
  "ionq-record-two-qubit-fidelity-2025": {
    summary:
      "IonQ announced a two-qubit gate fidelity of 99.99% using what it calls Electronic Qubit Control, surpassing the previous published trapped-ion record of 99.97% (set by Oxford Ionics, since acquired by IonQ, in 2024). Two-qubit gate fidelity matters more than almost any other single number for near-term quantum hardware: fault-tolerant error correction needs gate error rates well below the error-correcting code's threshold, so pushing fidelity from 99.9% to 99.99% represents roughly a 10x cut in the physical error a logical qubit has to correct for.",
    source: {
      name: "IonQ",
      url: "https://www.ionq.com/news/ionq-achieves-landmark-result-setting-new-world-record-in-quantum-computing",
    },
    whyThisMatters:
      "This lesson explains why trapped ions' shared vibrational mode lets any pair of ions interact directly; two-qubit gate fidelity on exactly that mechanism is the number IonQ pushed to a record 99.99% in 2025.",
    difficulty: "intermediate",
    // Image verified via WebFetch on the Commons file page (credit "Y.
    // Colombe/NIST", public domain as a US federal government work) and via
    // `curl -sI` on the upload.wikimedia.org URL (200, image/jpeg). This is
    // NIST's own beryllium-ion apparatus from 2011, not IonQ's hardware — the
    // caption is explicit that it illustrates the trapped-ion platform in
    // general, not this specific 2025 result.
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Quantum_Computing%3B_Ion_Trapping_%285941055642%29.jpg",
    imageAlt:
      "A NIST trapped-ion apparatus with beryllium ions held roughly 40 micrometers above a gold-plated ion-trap chip, surrounded by copper shielding",
    imageCaption:
      "A NIST trapped-ion apparatus (2011) — not IonQ's own hardware, but the same general trapped-ion platform IonQ's 2025 fidelity record was set on.",
    imageAttribution: {
      credit: "Y. Colombe/NIST",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Quantum_Computing;_Ion_Trapping_(5941055642).jpg",
      license: "Public domain (U.S. government work)",
    },
  },
  // Source: J. S. Bell, "On the Einstein Podolsky Rosen Paradox,"
  // Physics Physique Fizika 1, 195-200 (Nov. 1964).
  // https://link.aps.org/doi/10.1103/PhysicsPhysiqueFizika.1.195
  "bell-1964-epr-paradox-inequality": {
    summary:
      "Responding to the 1935 Einstein-Podolsky-Rosen argument that quantum mechanics must be incomplete, physicist John Bell proved something the EPR paper's authors never attempted: a concrete, numerical inequality that any theory completing quantum mechanics with pre-existing 'hidden variables' (and no faster-than-light influence) would have to obey. Quantum mechanics itself predicts this inequality can be violated for an entangled pair. Bell's paper turned a decades-old philosophical disagreement about whether particles have definite properties before measurement into a question a real experiment could settle, which is exactly what happened starting with Clauser's apparatus in the 1970s.",
    source: {
      name: "Physics Physique Fizika",
      url: "https://link.aps.org/doi/10.1103/PhysicsPhysiqueFizika.1.195",
    },
    whyThisMatters:
      "This lesson's |S| ≤ 2 bound for any local hidden-variable theory is the direct mathematical descendant of the inequality Bell first derived in this 1964 paper, years before Clauser, Aspect, or Zeilinger could actually test it in a lab.",
    difficulty: "advanced",
    // Image verified via WebFetch on the Commons file page (credit "CERN",
    // license CC BY 4.0) and via `curl -sI` on the upload.wikimedia.org URL
    // (200, image/jpeg).
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/b/b9/John_Bell_commenting_the_famous_Bell%27s_inequalities_%288206241%29.jpg",
    imageAlt: "John Stewart Bell photographed at CERN in June 1982, standing at a blackboard",
    imageCaption:
      "John Bell at CERN in 1982, where he worked as a theoretical physicist for most of his career, roughly eighteen years after deriving the inequality this entry describes.",
    imageAttribution: {
      credit: "CERN",
      creditUrl:
        "https://commons.wikimedia.org/wiki/File:John_Bell_commenting_the_famous_Bell%27s_inequalities_(8206241).jpg",
      license: "CC BY 4.0",
    },
  },
  // Source: R. P. Feynman, "Simulating Physics with Computers,"
  // International Journal of Theoretical Physics 21 (6/7), 467-488
  // (1982); delivered as the keynote at MIT's Physics of Computation
  // Conference, May 1981. https://doi.org/10.1007/BF02650179
  "feynman-simulating-physics-with-computers-1981": {
    summary:
      "At a keynote talk at MIT, Richard Feynman pointed out that simulating quantum mechanics on an ordinary classical computer seems to require resources that grow exponentially with the number of particles involved, since a quantum state's description has exponentially many independent numbers. His proposed fix was direct: build a computer out of quantum-mechanical elements that obey quantum rules natively, so it could simulate other quantum systems without paying that exponential penalty. The idea took over a decade to formalize into concrete algorithms and decades more to run on real hardware, but this talk (published the following year) is the historical origin of quantum simulation as a research field.",
    source: {
      name: "International Journal of Theoretical Physics",
      url: "https://doi.org/10.1007/BF02650179",
    },
    whyThisMatters:
      "This lesson turns Feynman's 1981 observation, that classical computers need exponential resources to simulate quantum systems while a quantum system could simulate another one directly, into the exact, quantitative Trotter error bound derived here.",
    difficulty: "master",
    // Image verified via WebFetch on the Commons file page (public domain,
    // published in Caltech's "The Big T" yearbook 1931-1977 without a
    // copyright notice) and via `curl -sI` on the upload.wikimedia.org URL
    // (200, image/png).
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/06/Richard_Feynman_1959.png",
    imageAlt: "Richard Feynman at a blackboard, photographed in 1959",
    imageCaption:
      "Richard Feynman in 1959, roughly two decades before the 1981 MIT talk this entry describes, in which he proposed quantum simulation.",
    imageAttribution: {
      credit: "Caltech (\"The Big T\" yearbook, via Wikimedia Commons)",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Richard_Feynman_1959.png",
      license: "Public domain",
    },
  },
  // Source: A. Kandala et al., "Hardware-efficient variational quantum
  // eigensolver for small molecules and quantum magnets," Nature 549,
  // 242-246 (14 Sept. 2017). https://www.nature.com/articles/nature23879
  "ibm-vqe-beh2-kandala-2017": {
    summary:
      "An IBM-led team ran the variational quantum eigensolver on a six-qubit superconducting processor, optimizing a hardware-tailored ansatz circuit against a classical optimizer to find the ground-state energy of increasingly large molecules, up to BeH2 with more than one hundred Pauli terms in its Hamiltonian, the largest quantum chemistry calculation run on real quantum hardware at the time. The experiment mattered less for the specific molecule (still small enough for classical methods) than for showing the full hybrid quantum-classical loop, gradient-free optimization over a real noisy device, actually converges to a physically meaningful answer rather than getting stuck or drifting.",
    source: {
      name: "Nature",
      url: "https://www.nature.com/articles/nature23879",
    },
    whyThisMatters:
      "This lesson runs VQE's hybrid optimization loop to convergence on a one-qubit toy Hamiltonian; this 2017 experiment is the first time the identical loop structure was scaled onto real hardware and converged on the ground-state energy of an actual molecule.",
    difficulty: "advanced",
  },
  // Source: Google AI Quantum and collaborators (F. Arute et al.),
  // "Hartree-Fock on a superconducting qubit quantum computer," Science
  // 369, 1084-1089 (28 Aug. 2020).
  // https://www.science.org/doi/10.1126/science.abb9811
  "google-hartree-fock-chemistry-2020": {
    summary:
      "Google's quantum AI team used up to a dozen qubits and a parameterized ansatz circuit implementing Givens rotations to prepare Hartree-Fock wavefunctions, then modeled the isomerization mechanism of diazene (a real chemical reaction pathway) on a superconducting processor, combined with an error-mitigation scheme based on the physical constraint that the simulated electron count must stay fixed. It was, at the time, the largest chemical simulation run on quantum hardware, and a concrete demonstration that variational ansatz circuits can track a real reaction's energy landscape, not just a single fixed molecule's ground state.",
    source: {
      name: "Science",
      url: "https://www.science.org/doi/10.1126/science.abb9811",
    },
    whyThisMatters:
      "This lesson defines an ansatz circuit and asks what 'expressive enough' means in the abstract; Google's 2020 experiment is a concrete answer, using a Givens-rotation ansatz expressive enough to track a real reaction's energy landscape across a dozen qubits.",
    difficulty: "advanced",
  },
  // Source: Y.-A. Chen, Q. Zhang, T.-Y. Chen et al., "An integrated
  // space-to-ground quantum communication network over 4,600
  // kilometres," Nature 589, 214-219 (6 Jan. 2021).
  // https://www.nature.com/articles/s41586-020-03093-8
  "china-integrated-quantum-communication-network-2021": {
    summary:
      "A USTC-led team combined more than 700 km of trusted-node fiber QKD links across four Chinese cities with two ground-to-satellite links to the Micius satellite, forming a single integrated network that let over 150 users exchange BB84-based quantum keys across a total distance of 4,600 km. The satellite links also had their key generation rate raised roughly 40x over earlier work, to 47.8 kilobits per second. It was the first time fiber-based metropolitan QKD and satellite-based long-distance QKD had been operated together as one practical, multi-user network rather than as separate lab demonstrations.",
    source: {
      name: "Nature",
      url: "https://www.nature.com/articles/s41586-020-03093-8",
    },
    whyThisMatters:
      "This lesson derives BB84's key exchange for a single Alice and Bob; China's 2021 network runs the identical protocol at the scale of a real multi-user infrastructure, stitching together fiber links and the Micius satellite link into one 4,600 km system.",
    difficulty: "intermediate",
  },
  // Source: D. H. Meyer, P. D. Kunz, K. C. Cox (DEVCOM Army Research
  // Laboratory), "Waveguide-Coupled Rydberg Spectrum Analyzer from 0 to
  // 20 GHz," Phys. Rev. Applied 15, 014053 (27 Jan. 2021).
  // https://link.aps.org/doi/10.1103/PhysRevApplied.15.014053
  "army-rydberg-spectrum-analyzer-2021": {
    summary:
      "Researchers at the U.S. Army Research Laboratory coupled a vapor cell of Rydberg atoms to a microwave waveguide and used it as a spectrum analyzer that continuously covers frequencies from near zero up to 20 GHz, detecting real-world AM/FM radio, Bluetooth, and Wi-Fi signals, a far broader single-device bandwidth than a conventional antenna and receiver chain typically covers. The sensor works because an atom driven to a highly excited Rydberg state has an electron in a hugely expanded orbit, which makes its energy levels (and therefore its response to an external electric field) exceptionally sensitive across a wide range of frequencies, an SI-traceable measurement calibrated directly against atomic physics rather than an antenna's geometry.",
    source: {
      name: "Physical Review Applied",
      url: "https://link.aps.org/doi/10.1103/PhysRevApplied.15.014053",
    },
    whyThisMatters:
      "This lesson explains Rydberg blockade as exciting an atom to a huge, strongly-interacting orbit to build a two-qubit gate; the Army's 2021 sensor exploits the exact same giant-orbit sensitivity in the opposite direction, as an ultra-broadband electric-field antenna instead of a gate.",
    difficulty: "intermediate",
  },
  // Source: D. Gong et al., "Quantum walks on a programmable
  // two-dimensional 62-qubit superconducting processor," Science 372,
  // 948-952 (28 May 2021). https://doi.org/10.1126/science.abg7812
  "ustc-62-qubit-quantum-walk-2021": {
    summary:
      "A USTC-led team fabricated an 8x8 grid of 62 superconducting qubits and used it to run genuine quantum walks: single- and two-particle 'walkers' spreading across the 2D lattice by quantum interference rather than classical random hopping, including a Mach-Zehnder-style interferometer where a walker coherently splits into two paths before recombining. The measured spreading matched the quadratically-faster-than-classical variance growth quantum walk theory predicts, on real hardware large enough that no straightforward classical simulation of the full 62-qubit dynamics was feasible to check it against directly.",
    source: {
      name: "Science",
      url: "https://doi.org/10.1126/science.abg7812",
    },
    whyThisMatters:
      "This lesson computes the Hadamard walk's variance growing quadratically faster than the classical random walk's; USTC's 2021 experiment measured exactly that quantum-versus-classical spreading gap directly, on a real 62-qubit lattice too large to simulate classically.",
    difficulty: "master",
  },
  // Source: C. M. Knaut et al. (Harvard University, with AWS Center for
  // Quantum Networking and MIT), "Entanglement of nanophotonic quantum
  // memory nodes in a telecom network," Nature 629, 573-578 (15 May
  // 2024). https://www.nature.com/articles/s41586-024-07252-z
  "harvard-telecom-quantum-memory-network-2024": {
    summary:
      "A Harvard-led team built two independent quantum network nodes, each a silicon-vacancy color center in a nanophotonic diamond cavity holding both an electron spin and a nuclear spin, connected by telecom-wavelength optical fiber (including a 35 km loop deployed through real Boston-area infrastructure). Using heralded spin-photon entangling operations and quantum frequency conversion to telecom wavelengths, they entangled the two remote nodes' electron spins and, using the more error-resistant nuclear spins with built-in error detection, kept that remote entanglement alive for up to a full second, long enough to be useful rather than a fleeting correlation.",
    source: {
      name: "Nature",
      url: "https://www.nature.com/articles/s41586-024-07252-z",
    },
    whyThisMatters:
      "This lesson derives the Bell state (|00⟩+|11⟩)/√2 from a two-qubit circuit sitting on one chip; Harvard's 2024 experiment generated that same kind of entanglement between two physically separate matter-qubit memories over real telecom fiber, the building block a quantum repeater network needs.",
    difficulty: "intermediate",
  },
  // Source: N. Sekiguchi et al. (Tokyo Institute of Technology),
  // "Diamond quantum magnetometer with dc sensitivity of sub-10 pT
  // Hz^-1/2 toward measurement of biomagnetic field," Phys. Rev. Applied
  // 21, 064010 (5 June 2024).
  // https://doi.org/10.1103/PhysRevApplied.21.064010
  "tokyo-tech-diamond-magnetometer-meg-2024": {
    summary:
      "A Tokyo Institute of Technology team built a diamond magnetometer using an ensemble of nitrogen-vacancy centers, negatively-charged defects whose electron spin can be optically read out, and pushed its DC magnetic field sensitivity below 10 picotesla per root-hertz using continuous-wave optically detected magnetic resonance. That sensitivity level puts it within reach of magnetoencephalography, mapping the brain's tiny magnetic fields, at room temperature with millimeter-scale spatial resolution, a genuine improvement over the centimeter-scale resolution of conventional (and far bulkier, cryogenically-cooled) MEG hardware.",
    source: {
      name: "Physical Review Applied",
      url: "https://doi.org/10.1103/PhysRevApplied.21.064010",
    },
    whyThisMatters:
      "This lesson notes T1 and T2 weren't invented for qubits, they're the same spin-relaxation constants Bloch defined for MRI in 1946; this 2024 diamond magnetometer is a direct descendant of that same physics, where a longer coherence time directly buys higher magnetic-field sensitivity.",
    difficulty: "advanced",
  },
  // Source: Microsoft Azure Quantum / Quantinuum, "Advancing science:
  // Microsoft and Quantinuum demonstrate the most reliable logical
  // qubits on record with an error rate 800x better than physical
  // qubits" (3 Apr. 2024).
  // https://blogs.microsoft.com/blog/2024/04/03/advancing-science-microsoft-and-quantinuum-demonstrate-the-most-reliable-logical-qubits-on-record-with-an-error-rate-800x-better-than-physical-qubits/
  "quantinuum-microsoft-reliable-logical-qubits-2024": {
    summary:
      "Using Microsoft's qubit-virtualization error-diagnostics software on Quantinuum's H2 trapped-ion processor, the two companies built four error-corrected logical qubits out of just 30 physical qubits and ran more than 14,000 individual circuit instances with zero uncorrected errors, a logical error rate they reported as roughly 800 times lower than the underlying physical qubits' error rate, the largest such gap reported at the time. The demonstration also included active syndrome extraction, repeatedly diagnosing and correcting errors mid-circuit without collapsing the encoded logical information, moving the hardware from Microsoft's 'Level 1: Foundational' to 'Level 2: Resilient' benchmark for fault-tolerant progress.",
    source: {
      name: "Microsoft Azure Quantum Blog",
      url: "https://blogs.microsoft.com/blog/2024/04/03/advancing-science-microsoft-and-quantinuum-demonstrate-the-most-reliable-logical-qubits-on-record-with-an-error-rate-800x-better-than-physical-qubits/",
    },
    whyThisMatters:
      "This capstone cites literature figures of hundreds to thousands of physical qubits per logical qubit; Microsoft and Quantinuum's 2024 result cut that overhead dramatically, building four reliable logical qubits from only 30 physical ones on a real trapped-ion device.",
    difficulty: "advanced",
  },
  // Source: AWS, "Amazon's new Ocelot chip brings us closer to building
  // a practical quantum computer" (27 Feb. 2025).
  // https://www.aboutamazon.com/news/aws/quantum-computing-aws-ocelot-chip
  "aws-ocelot-cat-qubits-2025": {
    summary:
      "AWS introduced Ocelot, a nine-qubit chip built from superconducting 'cat qubits,' oscillators encoded so that the two logical states are far apart in phase space, which passively suppresses bit-flip errors exponentially well while leaving phase-flip errors mostly untouched. Because only one error type needs active correction, a simple repetition-style code layered on top can handle it with far fewer physical qubits than a general-purpose code needs, and AWS reported this approach could cut the physical-to-logical qubit overhead by up to 90% compared to conventional, unbiased approaches, while measuring logical error rates as low as 1.65% at code distance 5.",
    source: {
      name: "AWS (About Amazon)",
      url: "https://www.aboutamazon.com/news/aws/quantum-computing-aws-ocelot-chip",
    },
    whyThisMatters:
      "This lesson shows that correcting X and Z errors separately is enough to handle any single-qubit error; Ocelot is built around deliberately making that asymmetric, passively suppressing X (bit-flip) errors in hardware so only the Z (phase-flip) half needs active, qubit-expensive correction.",
    difficulty: "advanced",
  },
  // Source: D. Main, P. Drmota, D. P. Nadlinger et al. (University of
  // Oxford), "Distributed quantum computing across an optical network
  // link," Nature 638, 383-388 (5 Feb. 2025).
  // https://www.nature.com/articles/s41586-024-08404-x
  "oxford-distributed-quantum-computing-2025": {
    summary:
      "An Oxford team connected two separate trapped-ion processing modules with a photonic fiber link, used it to generate entanglement between an ion in each module, and then teleported not just a qubit's state but an entire two-qubit logic gate across that link, running a small quantum algorithm that spanned both modules as though they were one connected machine. It's a direct answer to quantum computing's scaling problem: rather than building one ever-larger chip, link many smaller, more manufacturable modules together with photonic interconnects and let teleportation carry gates (not just data) across the network.",
    source: {
      name: "Nature",
      url: "https://www.nature.com/articles/s41586-024-08404-x",
    },
    whyThisMatters:
      "This lesson derives teleportation's entangle, Bell-measure, classically-communicate, correct protocol for moving a single qubit's state; Oxford's 2025 experiment runs the same structure to teleport an entire two-qubit gate between separate processors, linking them into one larger machine.",
    difficulty: "intermediate",
  },
  // Source: Quantinuum, JPMorganChase, Argonne National Laboratory, Oak
  // Ridge National Laboratory, and UT Austin, "Certified randomness
  // using a trapped-ion quantum processor," Nature 640, 343-348 (10
  // Apr. 2025). https://www.nature.com/articles/s41586-025-08737-1
  "quantinuum-certified-randomness-2025": {
    summary:
      "A team spanning Quantinuum, JPMorganChase, and three U.S. research institutions used a 56-qubit trapped-ion processor to run a protocol where a classical client sends deliberately hard-to-simulate random circuits to the quantum computer, which executes them and returns results a classical supercomputer (in this case, several combined, exceeding a quintillion floating-point operations per second) then verifies against. Because generating a convincing fake response would have required classically simulating circuits believed to be beyond any current supercomputer's reach, a successful, timely response effectively certifies the returned bits are random and were not predictable in advance, a real cryptographic protocol turned into a commercial product rather than a lab curiosity.",
    source: {
      name: "Nature",
      url: "https://www.nature.com/articles/s41586-025-08737-1",
    },
    whyThisMatters:
      "This lesson explains why quantum-advantage experiments deliberately target circuits beyond any classical simulator's reach; Quantinuum's 2025 protocol leans on that exact classical-hardness gap, turning 'a classical computer can't keep up' into a cryptographic certificate that a random number was quantum-generated rather than guessed in advance.",
    difficulty: "intermediate",
  },
  // Source: QuEra Computing press release, "QuEra Computing Marks Record
  // 2025 as the Year of Fault Tolerance and Over $230M of New Capital to
  // Accelerate Industrial Deployment" (9 Dec. 2025); underlying paper
  // D. Bluvstein et al., "A fault-tolerant neutral-atom architecture for
  // universal quantum computation," Nature 649, 39-46 (2026), published
  // online 10 Nov. 2025, https://doi.org/10.1038/s41586-025-09848-5,
  // arXiv:2506.20661. (Citation re-verified Aug. 2026 against the Nature
  // article page and NIST's publication record for the paper.)
  // https://www.quera.com/press-releases/quera-computing-marks-record-2025-as-the-year-of-fault-tolerance-and-over-230m-of-new-capital-to-accelerate-industrial-deployment
  "harvard-quera-96-logical-qubits-2025": {
    summary:
      "Two years after their 48-logical-qubit demonstration, the same Harvard/QuEra/MIT collaboration (with Markus Greiner and Vladan Vuletic joining Mikhail Lukin's group) used up to 448 individually-trapped neutral rubidium atoms to run up to 96 error-corrected logical qubits simultaneously, encoded with both the [[7,1,3]] Steane code and a higher-rate [[16,6,4]] code. The result folded together, for the first time on one integrated architecture, physical entanglement, logical entanglement, logical 'magic state' generation for universal gates, and mid-circuit entropy removal via atom re-use — and directly measured 'below-threshold' behavior again, this time reporting roughly a 2.14x reduction in logical error rate in a four-round characterization circuit as the code scaled up, rather than the error rate growing worse.",
    source: {
      name: "QuEra Computing",
      url: "https://www.quera.com/press-releases/quera-computing-marks-record-2025-as-the-year-of-fault-tolerance-and-over-230m-of-new-capital-to-accelerate-industrial-deployment",
    },
    whyThisMatters:
      "This capstone's whole point is that code distance only helps below a critical physical error rate, and that physical-to-logical qubit overhead is a real, citable number, not an abstraction; this 2025 result is a direct, newer data point on exactly that overhead curve, doubling the logical-qubit count this file's 2023 QuEra entry reported two years earlier while again demonstrating below-threshold scaling.",
    difficulty: "advanced",
  },
  // Source: D-Wave Quantum Inc., "D-Wave Demonstrates First Scalable,
  // On-Chip Cryogenic Control of Gate-Model Qubits," press release (6 Jan.
  // 2026).
  // https://www.dwavequantum.com/company/newsroom/press-release/d-wave-demonstrates-first-scalable-on-chip-cryogenic-control-of-gate-model-qubits/
  "dwave-onchip-cryogenic-control-2026": {
    summary:
      "D-Wave built a multichip package that bump-bonds a high-coherence superconducting fluxonium qubit chip directly to a multilayer cryogenic control chip, using multiplexed digital-to-analog converters (with key fabrication steps done at NASA's Jet Propulsion Laboratory) to generate and route each qubit's control signals right next to the qubit itself, rather than piping a separate room-temperature wire down to every qubit through the dilution refrigerator. D-Wave says the same multiplexing scheme already controls tens of thousands of qubits and couplers in its commercial annealing processors with only about 200 bias wires, and that the same on-chip approach can cut gate-model wiring complexity by a similar factor without degrading qubit fidelity — attacking the 'wiring problem' that limits how many physical qubits a dilution refrigerator's fixed number of cryostat feedthroughs can practically support.",
    source: {
      name: "D-Wave Quantum Inc.",
      url: "https://www.dwavequantum.com/company/newsroom/press-release/d-wave-demonstrates-first-scalable-on-chip-cryogenic-control-of-gate-model-qubits/",
    },
    whyThisMatters:
      "This lesson explains that every gate is, physically, a classical control system generating a precisely-shaped pulse and sending it to the qubit; D-Wave's 2026 chip moves that pulse generation from room-temperature electronics onto a chip bonded right next to the qubits, the specific hardware bet aimed at the wiring bottleneck that lesson's control system faces at scale.",
    difficulty: "intermediate",
    // Image verified via WebFetch on the Commons file page (credit "UCL
    // Mathematical & Physical Sciences", photo by Pavlos Apostolidis at the
    // London Centre for Nanotechnology, license CC BY 2.0) and via `curl -sI`
    // on the upload.wikimedia.org URL (200, image/jpeg). This is a UCL
    // dilution refrigerator, not D-Wave's own hardware — the caption is
    // explicit that it illustrates the general wiring/cryostat problem this
    // entry's chip targets, not a photo of D-Wave's device.
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Dilution_Refrigerator_%2839016294284%29.jpg",
    imageAlt: "The interior of a dilution refrigerator at the London Centre for Nanotechnology, showing its cryogenic wiring stages",
    imageCaption:
      "A dilution refrigerator at UCL's London Centre for Nanotechnology — not D-Wave's own hardware, but the kind of cryostat wiring this entry's on-chip control chip is designed to reduce.",
    imageAttribution: {
      credit: "UCL Mathematical & Physical Sciences (photo: Pavlos Apostolidis, London Centre for Nanotechnology)",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Dilution_Refrigerator_(39016294284).jpg",
      license: "CC BY 2.0",
    },
  },
  // Source: S. Dasu et al. (Quantinuum), "Computing with many encoded
  // logical qubits beyond break-even," arXiv:2602.22211 (submitted 25 Feb.
  // 2026). https://arxiv.org/abs/2602.22211 — details verified against the
  // arXiv abstract (48-94 logical qubits, iceberg codes, Helios hardware).
  "quantinuum-helios-iceberg-logical-qubits-2026": {
    summary:
      "Quantinuum researchers used the company's 98-qubit Helios trapped-ion processor to run computations on between 48 and 94 logical qubits, reporting beyond-break-even performance: the encoded circuits outperformed their unencoded physical equivalents across benchmarks including GHZ-state preparation and quantum simulation of three-dimensional magnetic systems. The striking number is the overhead. Instead of the hundreds of physical qubits per logical qubit that surface-code estimates assume, the team used high-rate [[k+2, k, 2]] 'iceberg' error-detecting codes, which spend only two extra physical qubits regardless of how many logical qubits they protect, plus a two-level concatenated iceberg construction for full error correction. The trade is real: iceberg codes have distance 2 (detection) or 4 (correction), far weaker protection than a large surface code, so this is a bet that trapped-ion fidelities are already good enough that thin codes beat thick ones at today's machine sizes.",
    source: {
      name: "arXiv (Quantinuum)",
      url: "https://arxiv.org/abs/2602.22211",
    },
    whyThisMatters:
      "This capstone treats physical-to-logical overhead as the central budget line of fault tolerance; Quantinuum's iceberg-code result is a live data point at the opposite extreme of that trade-off, buying dozens of weakly-protected logical qubits for almost no overhead rather than a few strongly-protected ones for hundreds of physical qubits each.",
    difficulty: "advanced",
  },
  // Source: "Improved quantum processor logical error rates via correction
  // and detection," Nature 654 (issue 8118), published 10 June 2026,
  // https://www.nature.com/articles/s41586-026-10628-y (Microsoft Quantum
  // and Quantinuum). Figures cross-checked against Microsoft's companion
  // blog post (quantum.microsoft.com, "Microsoft's application of error
  // correction to trapped-ion qubits published in Nature").
  "microsoft-quantinuum-carbon-tesseract-nature-2026": {
    summary:
      "Two years after their 2024 press-release claim of logical error rates 800x below physical ones, Microsoft and Quantinuum published the peer-reviewed version: running Microsoft's qubit-virtualization software on Quantinuum's trapped-ion hardware, with two codes tailored to the platform, a 12-qubit 'carbon' code encoding two logical qubits and a 16-qubit 'tesseract' color code encoding four. Across circuits of up to 12 logical qubits they measured logical error rates 11x to 800x below matched physical baselines, with the headline number coming from Bell-state preparation (roughly 0.8% physical error down to 0.001% logical, with post-selection), plus a 51x per-round improvement under repeated mid-circuit error correction. The same collaboration also demonstrated an end-to-end hybrid chemistry workflow, combining the logical qubits with classical HPC and AI models to estimate a catalytic intermediate's ground-state energy to chemical accuracy.",
    source: {
      name: "Nature",
      url: "https://www.nature.com/articles/s41586-026-10628-y",
    },
    whyThisMatters:
      "This lesson builds the syndrome-measure-then-recover cycle one step at a time; the repeated mid-circuit correction rounds in this 2026 paper are that exact cycle running on real trapped ions, now with peer-reviewed numbers for how much each round of it actually buys.",
    difficulty: "advanced",
  },
  // Source: V. Sivak et al. (Google Quantum AI), "Reinforcement learning
  // control of quantum error correction," Nature 655, 879-884 (8 July
  // 2026). https://www.nature.com/articles/s41586-026-10759-2 — figures
  // verified against the Nature article page.
  "google-rl-control-error-correction-2026": {
    summary:
      "Google Quantum AI showed that the error-detection events a surface code already produces every cycle can be reused as a training signal: a reinforcement-learning agent watches them and continuously adjusts more than 1,000 physical control parameters on the Willow processor, so the machine recalibrates itself while computing instead of stopping for scheduled calibration. On top of Google's standard calibration the agent suppressed the logical error rate by a further 20%, reaching a record 7.72 x 10^-4 per round for a distance-7 surface code, and it made the system 2.4x more stable against deliberately injected control drift (3.5x when the decoder was steered as well). Simulations in the paper indicate the approach scales to distance-15 codes with around 40,000 parameters without the convergence rate degrading.",
    source: {
      name: "Nature",
      url: "https://www.nature.com/articles/s41586-026-10759-2",
    },
    whyThisMatters:
      "This lesson warns that treating calibration as a one-time setup step is a mistake because real hardware drifts and production systems recalibrate routinely; Google's 2026 result attacks that exact problem by letting the error-correction cycle itself retune the controls continuously, instead of pausing the machine to recalibrate.",
    difficulty: "advanced",
  },
};
