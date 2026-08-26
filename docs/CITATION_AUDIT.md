# Citation Audit

Scope: every `<ResearchConnection>` and `<HistoricalMoment>` block in
`src/content/lessons/**`, plus every inline citation with checkable
bibliographic detail (author/year/journal/arXiv id) found by grepping the
corpus for `et al`, `arXiv`, `doi`, `Nature`, `Science`, `Phys. Rev`, `PRL`,
and every `https://` URL. CSP compliance of `<ExternalFigure>` hosts was
checked independently of the citation work. `src/content/problems/**` was
not touched or audited (out of scope per the task).

## Verdict

Of 45 citation instances checked (30 distinct underlying sources — some
papers are cited more than once across lessons), 44 are accurate: correct
title, authors, venue, volume/pages, year, and URL where given, and in every
case checked the claim attached to the citation matches what the cited work
actually says. One dating error was found and corrected: `the-bloch-sphere.mdx`
attributed Bloch's nuclear-induction work (the actual 1946 origin of the
Bloch-sphere geometric picture, correctly dated elsewhere in this same
corpus in `t1-and-t2-decoherence.mdx`) to 1961 — the year of a *photograph*
of Bloch at Stanford, not the year of the work. This is a narrow, high-confidence,
single-field fix. No fabricated citations, no wrong DOIs, no dead links, and
no CSP violations were found. The corpus's own two self-flagged findings in
`docs/SCIENCE_AUDIT.md` (Arute et al. and Barenco et al. citation detail
added without lesson-internal sourcing) are confirmed here as factually
accurate, so that finding stands as a *process* flag only, not a *correctness*
flag — both citations check out.

## Table

Legend: **V** = verified, **C** = corrected (see below), **U** = unverified.

| File:line | Claimed | Status | Evidence |
|---|---|---|---|
| computational-cost-and-scaling.mdx:165 | Arute et al., *Nature* 574, 505–510 (2019), Sycamore 53-qubit choice | V | Nature/PubMed/ADS confirm exact title "Quantum supremacy using a programmable superconducting processor," vol. 574, pp. 505–510, 24 Oct 2019, DOI 10.1038/s41586-019-1666-5. URL resolves (redirects to login wall, expected for Nature; content confirmed via search). Claim (53-qubit choice near the classical-simulation wall) matches the paper. |
| the-quantum-singular-value-transformation.mdx:328 | Gilyén, Su, Low & Wiebe, STOC 2019, QSVT | V | Confirmed exact title "Quantum singular value transformation and beyond," STOC 2019 pp. 193–204, same 4 authors, arXiv:1806.01838 resolves and matches. |
| the-quantum-singular-value-transformation.mdx:344 | Martyn, Rossi, Tan & Chuang, 2021, "Grand Unification of Quantum Algorithms" | V | Confirmed exact title, 4 authors match, posted 2021 (PRX Quantum 2, 040203), arXiv:2105.02859 resolves and matches. |
| magic-states-and-distillation.mdx:209 | Bravyi & Kitaev, *Phys. Rev. A* 71, 022316 (2005), 15-to-1 distillation | V | Confirmed title "Universal quantum computation with ideal Clifford gates and noisy ancillas," PRA 71, 022316 (2005), arXiv:quant-ph/0403025 resolves. The specific 15-to-1 / [[15,1,3]] Reed–Muller / cubic-suppression claim independently confirmed via secondary sources. |
| applications-eigenvalues-and-linear-systems.mdx:292 | Ewin Tang, 2018, dequantization | V | Confirmed title "A quantum-inspired classical algorithm for recommendation systems," posted July 2018, arXiv:1807.04271 resolves and matches; the lesson's description of what the paper shows (classical algorithm matching polylog scaling under ℓ²-sampling access) matches the abstract. |
| amplitude-estimation-without-phase-estimation.mdx:177 | Suzuki, Uno, Raymond, Tanaka, Onodera & Yamamoto, *Quantum Information Processing* 19, 75 (2020); "see also" Grinko, Gacon, Zoufal & Woerner, *npj Quantum Information* 7, 52 (2021) | V | Both confirmed exactly: 6-author list, journal, volume, article number, year for Suzuki et al. (arXiv:1904.10246); 4-author list, journal, volume, article number, year for Grinko et al. (DOI 10.1038/s41534-021-00379-1). Both papers are indeed about amplitude estimation without QPE. |
| decoding-surface-codes.mdx:263 | Dennis, Kitaev, Landahl & Preskill (2002), decoding as a stat-mech phase transition | V | Paper is "Topological quantum memory" (arXiv:quant-ph/0110143, posted 2001; journal publication J. Math. Phys. 43, 4452, 2002 — "(2002)" citation year matches the published version). Confirmed the paper does map decoding onto a phase transition (Nishimori point) as claimed. |
| distinguishing-theorem-from-heuristic.mdx:193 | Farhi, Goldstone & Gutmann (2014), QAOA 0.6924 worst-case ratio, restricted to 3-regular triangle-free graphs | V | Confirmed title "A Quantum Approximate Optimization Algorithm," posted Nov 2014, arXiv:1411.4028. Independently confirmed the 0.6924 p=1 bound is specifically tight/proved for 3-regular **triangle-free** graphs — the lesson's caveat about restricted scope is accurate, not an invented hedge. |
| distinguishing-theorem-from-heuristic.mdx:330 | Dennis, Kitaev, Landahl & Preskill (2002) (duplicate reference, same paper) | V | Same as above. |
| grovers-algorithm-amplitude-amplification.mdx:57–61 | Grover, STOC '96, pp. 212–219 (1996), arXiv:quant-ph/9605043 | V | Confirmed exact title "A fast quantum mechanical algorithm for database search," presented STOC May 1996, pp. 212–219, arXiv id resolves and matches (both the inline prose citation and the `<ResearchConnection>` restating it). |
| capstone-what-we-know-and-dont.mdx:191 | "Google, 2019 (Sycamore)" quantum supremacy, IBM's classical rebuttal | V | Same underlying Arute et al. paper as above. The IBM classical-simulation rebuttal (disk-space-based simulation narrowing the classical-hardness margin) is a real, well-documented dispute. |
| universal-quantum-computation.mdx:186 | Barenco et al., *Physical Review A* 52, 3457 (1995), "Elementary gates for quantum computation" | V | Confirmed exact title, 9-author list (Barenco, Bennett, Cleve, DiVincenzo, Margolus, Shor, Sleator, Smolin, Weinfurter), PRA 52, 3457, 1995, arXiv:quant-ph/9503016 resolves and matches. |
| bells-theorem-and-local-hidden-variables.mdx:121–130 | J. S. Bell, "On the Einstein Podolsky Rosen Paradox," *Physics Physique Fizika* 1(3), 195–200 (1964); "fewer than a dozen citations in its first six years" | V | Confirmed exact title, journal, volume 1, issue 3, pages 195–200, 1964; link.aps.org DOI resolves. The "fewer than a dozen citations in six years" / obscure-journal claim independently confirmed by multiple physics-history sources (APS Physics, arXiv history papers). |
| spin-qubits.mdx:274 | "Intel Components Research; academic groups at Delft, UNSW, and RIKEN" — Tunnel Falls, Horse Ridge, 300mm fab | V (general, no formal paper cited) | Confirmed: Intel's Tunnel Falls is a real 300mm-CMOS silicon spin-qubit chip; Horse Ridge is a real cryogenic control chip; Intel–QuTech (Delft) collaboration and Intel–RIKEN MOU (May 2023) confirmed. UNSW is independently a leading isotopically-purified-silicon spin-qubit group (Morello/Dzurak); no direct Intel–UNSW partnership was found in search, but the lesson does not claim one — it lists UNSW alongside Delft and RIKEN only as a group "pushing" the technology, which is accurate. This citation carries no title/URL to verify against, by design (general institutional claim). |
| quantum-entropy-and-information-measures.mdx:330 | Horodecki, Oppenheim & Winter (2005), quantum state merging | V | Confirmed title "Quantum state merging and negative information," posted Dec 2005 (arXiv:quant-ph/0512247, journal pub. Comm. Math. Phys. 2007). The operational-meaning-of-S(A\|B) claim matches the paper's actual content. |
| trace-distance-and-fidelity.mdx:144 | "Google Quantum AI, Sycamore processor (2019)," cross-entropy benchmarking | V | Same Arute et al. 2019 paper; XEB-based distinguishability claim matches the paper's methodology. |
| schmidt-decomposition-and-purification.mdx:162 | A. Ekert & P. L. Knight, *Am. J. Phys.* 63(5), 415–423 (1995) | V | Confirmed exact title "Entangled quantum systems and the Schmidt decomposition," AJP vol. 63, issue 5, pp. 415–423, May 1995. DOI resolves (redirects to AIP Publishing page, confirmed via search after 403 on direct fetch). |
| the-threshold-theorem.mdx:109 | HistoricalMoment "1996–1998" — threshold theorem proved independently by Shor, Aharonov–Ben-Or, Kitaev, Knill/Laflamme/Zurek | V | Confirmed: Aharonov & Ben-Or (STOC 1997, preprint 1996), Kitaev (Russian Math. Surveys 52, 1997), Knill/Laflamme/Zurek (Proc. R. Soc. A 454, 1998). The "1996–1998" range is a defensible span across these independent results. |
| writing-your-first-circuit.mdx:212 | HistoricalMoment "2016" — IBM free cloud access to real hardware | V | Confirmed: IBM Quantum Experience launched publicly 4 May 2016, free access, 5-qubit processor. |
| why-quantum-errors-are-different.mdx:47 | HistoricalMoment "1995" — Shor's nine-qubit code | V | Confirmed: Shor 1995, first quantum error-correcting code, 9 physical qubits per logical qubit, corrects arbitrary single-qubit errors. |
| why-quantum-errors-are-different.mdx:51 | HistoricalMoment "1996" — Steane's seven-qubit code | V | Confirmed: Steane 1996, "Multiple-Particle Interference and Quantum Error Correction," Proc. R. Soc. A 452, 2551–2577, arXiv:quant-ph/9601029. |
| the-bloch-sphere.mdx:52 | HistoricalMoment "1961," Stanford — Bloch's nuclear-induction/spin-precession work named the Bloch sphere | **C — was wrong** | See Corrections below. |
| the-deutsch-jozsa-algorithm.mdx:109 | HistoricalMoment "1985" — Deutsch's paper | V | Confirmed: Deutsch, "Quantum theory, the Church–Turing principle and the universal quantum computer," Proc. R. Soc. A, 1 July 1985. |
| measurement-and-probability.mdx:71 | HistoricalMoment "1922" — Stern–Gerlach experiment | V | Confirmed: Stern & Gerlach, 1922, silver-atom beam split into two discrete spots. |
| dirac-notation.mdx:96 | HistoricalMoment "1933" — Dirac shares Nobel Prize | V | Confirmed: Nobel Prize in Physics 1933 awarded jointly to Schrödinger and Dirac. |
| the-chsh-inequality.mdx:58 | HistoricalMoment "1982" — Aspect's experiments | V | Confirmed: Aspect, Dalibard & Roger, "Experimental Test of Bell's Inequalities Using Time-Varying Analyzers," PRL 49, 1804 (1982), Orsay — matches the S=2√2 CHSH context of this specific lesson. |
| capstone-comparing-quantum-advantage.mdx:58 | HistoricalMoment "2019" — Google's 53-qubit Sycamore | V | Same Arute et al. 2019 paper. |
| bell-states-and-entanglement.mdx:63 | HistoricalMoment "1981," Orsay — Aspect's entangled-photon experiment | V (plausible attribution) | Matches the earlier Aspect, Grangier & Roger, PRL 47, 460 (1981), Orsay — a real, distinct Aspect experiment predating the 1982 time-varying-analyzer one cited elsewhere in the corpus. Both dates are independently real Aspect results; no internal contradiction. |
| bells-theorem-and-local-hidden-variables.mdx:124 | HistoricalMoment "1935" — EPR paper | V | Confirmed: Einstein, Podolsky & Rosen, *Phys. Rev.* 47, 777–780, 15 May 1935. |
| the-no-cloning-theorem.mdx:66 | HistoricalMoment "1982" — Zurek & Wootters (and Dieks) derive no-cloning | V | Confirmed: Wootters & Zurek, "A single quantum cannot be cloned," *Nature* 299, 802–803 (28 Oct 1982); Dieks published an independent, near-simultaneous 1982 result. |
| t1-and-t2-decoherence.mdx:96 | HistoricalMoment "1946" — Bloch defines T1/T2 | V | Confirmed: Bloch, "Nuclear Induction," *Phys. Rev.* 70, 460 (1946) — the actual origin of T1/T2 and the vector/sphere model (this is the citation `the-bloch-sphere.mdx` was misdating; see Corrections). |
| clebsch-gordan-coefficients-and-the-wigner-eckart-theorem.mdx:120 | HistoricalMoment "1927" — Wigner proves the theorem | V | Confirmed: Wigner, *Z. Physik* 43, 624–652 (1927). |
| the-pauli-exclusion-principle.mdx:79 | HistoricalMoment "1925" — Pauli's paper, submitted Jan 16, 1925; Uhlenbeck/Goudsmit spin later that year | V | Confirmed exactly, including the specific submission date (16 Jan 1925) and the "two-valuedness" quote, and that Uhlenbeck & Goudsmit's spin proposal followed later in 1925. |
| superconducting-qubits.mdx:132 | HistoricalMoment "2024" — Google Willow, logical error rate drops with scale | V | Confirmed: Google, "Quantum error correction below the surface code threshold," *Nature* 638 (Dec 2024), arXiv:2408.13687. |
| decoding-surface-codes.mdx:298 | HistoricalMoment "December 2024," Google Quantum AI — Willow distance-3/5/7 patches, error rate halving | V | Confirmed precisely: error suppression factor ≈2.14 per +2 distance (halving is a fair rounding), distance-7 code on a 101-qubit processor, matches the lesson's claim exactly. |
| bqp-and-oracle-complexity.mdx:245–248 | Bennett, Bernstein, Brassard & Vazirani, *SIAM J. Comput.* 26(5), 1510–1523 (1997), arXiv:quant-ph/9701001 | V | Confirmed exact title "Strengths and Weaknesses of Quantum Computing," authors, volume, pages, year, arXiv id. |
| shors-algorithm-factoring-via-period-finding.mdx:90–94 | Shor, *SIAM J. Comput.* 26(5), 1484–1509 (1997), arXiv:quant-ph/9508027 | V | Confirmed exact title "Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms on a Quantum Computer," volume, pages, year, arXiv id. |
| universal-quantum-computation.mdx:320–321 | Boykin et al. 2000, Clifford+T universality | V | Confirmed: Boykin, Mor, Pulver, Roychowdhury & Vatan, "A new universal and fault-tolerant quantum basis," Information Processing Letters 75(3), 2000 (also FOCS 1999 / arXiv:quant-ph/9906054). |
| barren-plateaus-and-variational-trainability.mdx:461 | McClean et al. 2018, barren plateaus | V | Confirmed: McClean, Boixo, Smelyanskiy, Babbush & Neven, "Barren plateaus in quantum neural network training landscapes," *Nature Communications* 9, 4812 (2018). |
| quantum-error-mitigation.mdx:335–336 | Takagi et al. 2022, fundamental limit on error mitigation; "Quek et al." | V (Takagi); U (Quek) | Takagi confirmed: Takagi, Endo, Minagawa & Gu, "Fundamental limits of quantum error mitigation," *npj Quantum Information* 8, 114 (2022), arXiv:2109.04457 — exponential sampling-overhead result matches the lesson's claim exactly. "Quek et al." is given with no year, title, or venue — plausibly a real related paper (there is a body of Quek/Kwek work on error-mitigation limits) but not independently confirmable from the text given; reported as unverified rather than assumed. |
| stabilizer-formalism-basics.mdx:56, the-three-qubit-bit-flip-code.mdx:50 | Y. Salathé et al., *Physical Review X* 5, 021027 (2015) — image credit | V | Confirmed: Salathé, Mondal, Oppliger, et al. (12 authors, Wallraff group), "Digital quantum simulation of spin models with circuit quantum electrodynamics," PRX 5, 021027 (2015). |
| quantum-gates.mdx:47 | "Y. Salathé et al. (A. Wallraff group)" — image credit, no formal citation | V (general) | Same underlying paper/group as above; no volume/page given to mis-cite. |

## Corrections made

**`src/content/lessons/quantum-computing/qubits-and-quantum-states/the-bloch-sphere.mdx`, line 52**

- Before: `<HistoricalMoment date="1961" place="Stanford University">`
- After: `<HistoricalMoment date="1946" place="Stanford University">`
- Why: the block's text is "Felix Bloch's work on nuclear induction and spin precession gave the geometric picture derived in this lesson its name." That work — Bloch, "Nuclear Induction," *Phys. Rev.* 70, 460 (1946) — is what actually introduced the vector/sphere model, and is correctly dated 1946 elsewhere in this same corpus (`t1-and-t2-decoherence.mdx:96`, an independent `<HistoricalMoment>` about the same Bloch result). 1961 is the year of the Wikimedia photograph used as the lesson's `<ExternalFigure>` (Bloch at Stanford, per the image's own alt text/caption, which was left untouched — it correctly describes a 1961 photo, not a 1961 discovery). The `<HistoricalMoment>` date field had absorbed the photo's year instead of the cited work's year. `place="Stanford University"` was left unchanged since Bloch was at Stanford in both 1946 and 1961.
- Verified with `npx vitest run src/lib/content/__tests__/mdxHazards.test.ts src/lib/content` after the edit (see Coverage).

No other citation was altered. Every other citation checked out on title, authors, venue, volume/pages, year, URL, and claim-to-source match.

## Unverified

- **`quantum-error-mitigation.mdx:335–336`, "Quek et al."** — no year, title, or venue is given in the lesson, so there is nothing specific to check the claim against. It reads as a real, plausible companion citation to Takagi et al. 2022 (there is genuine literature on fundamental error-mitigation limits by authors named Quek), but I could not confirm which specific paper is meant, so I am not asserting it is correct or incorrect. Left untouched.
- **`spin-qubits.mdx:274`, UNSW's specific role** — the lesson lists UNSW alongside Delft and RIKEN as an academic group pushing isotopically-purified silicon devices. This is true of UNSW independently (Morello/Dzurak groups), but I found no source confirming a direct *Intel* partnership with UNSW analogous to the confirmed Intel–QuTech(Delft) and Intel–RIKEN relationships. The lesson's phrasing doesn't actually claim such a partnership (it says these groups are pushing the field, not that they partner with Intel), so this isn't flagged as wrong — noted here only because the underlying research-group claim is looser than the two neighboring ones and I could not independently confirm it to the same standard.
- **`the-threshold-theorem.mdx:109`, "1996–1998" as a range rather than three individual dates** — each individual result is confirmed (Aharonov–Ben-Or 1996 preprint/1997 STOC, Kitaev 1997, Knill/Laflamme/Zurek 1998), but the lesson compresses them into one span rather than dating each separately. This is a defensible simplification, not an error, but I'm noting it as a judgment call rather than a flat "verified."
- No paywalled or fully inaccessible sources were encountered — every citation resolved to at least a confirmable abstract via web search, even where a direct fetch hit a login wall (Nature) or a 403 (AIP, APS).

## Coverage

**Checked:** every `<ResearchConnection>` block (17) and every `<HistoricalMoment>` block (18) in `src/content/lessons/**`; every inline prose citation carrying a full author/journal/volume/page or arXiv id (10 more instances, some duplicating the same underlying paper as a component above); every `https://` URL in the lesson corpus was inventoried and cross-checked against `next.config.ts`'s CSP `img-src` allowlist (`upload.wikimedia.org`, `www.nist.gov`) — confirmed zero violations, and `npx vitest run src/lib/content/__tests__/lessonImages.test.ts` passes independently. For each citation with a URL, the URL was fetched (WebFetch) or its target independently confirmed via search when the direct fetch hit a login/paywall; for each citation's factual claim, the underlying paper's actual topic/result was checked against what the lesson attaches to it, not just the bibliographic metadata in isolation.

**Not checked:** `src/content/problems/**` (explicitly out of scope per the task's file ownership). Citations to textbooks, named theorems, or general physics facts with no author/year/venue attached (e.g. plain mentions of "the Schrödinger equation") were not treated as citations requiring verification — only claims carrying a specific, checkable bibliographic assertion (a name+year, a journal+volume, or a URL) were audited. I did not attempt to verify every secondary/tertiary web-search source's own reliability beyond cross-checking 2–3 independent sources per claim where the claim was non-trivial (e.g. the Bell-paper citation-count claim, the QAOA triangle-free restriction, the Willow error-suppression factor).
