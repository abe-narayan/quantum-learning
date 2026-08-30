#!/usr/bin/env node
/**
 * Runs a production build and reports its PEAK memory, so the Vercel
 * out-of-memory failure cannot come back unnoticed.
 *
 * Usage:
 *   node scripts/audit/build-memory.mjs [--cold] [--budget-mb 5000]
 *
 * WHY THIS EXISTS
 * ---------------
 * `docs/DEPLOYMENT.md` records a build that died on Vercel with SIGKILL and
 * silent stalls. The cause was the KaTeX-inflated compile graph: 3.4MB of MDX
 * source became ~82MB of JS, and Turbopack held the whole graph in one
 * process at ~6.3GB peak, inside a hard-capped 8GB container. The fix
 * (`src/lib/mdx/rehypeKatexHtml.mjs`, one HTML string per equation instead of
 * an element tree) cut it to roughly 2.5-3.5GB.
 *
 * Every existing guard rail protects the *shape* of that fix: the 30-entry cap
 * on the global MDX component mapping, the generated metadata registries, the
 * client-bundle ceiling. **Nothing measures the thing that actually killed the
 * build, which is peak resident memory, and nothing notices the corpus simply
 * getting bigger.** On 2026-08-30 the lesson corpus went from 3.59MB to
 * 5.50MB in a single sprint, a 53% increase, purely from adding worked
 * answers. That is the same input that drove the original OOM, and no test in
 * the repo would have said a word about it.
 *
 * So this measures the output directly. It is not a vitest test because it
 * needs a real multi-minute build and Vercel-like conditions; run it before a
 * release, and after any change to the corpus size, the math pipeline, or the
 * bundler config.
 *
 * ON THE NUMBER
 * -------------
 * Peak memory on a contended workstation is noisy. `DEPLOYMENT.md` records
 * three cold runs hours apart at 3451MB, 2875MB and 2544MB, and says
 * explicitly that the band, not the reading, is the fact. Treat a single run
 * here the same way: it is a smoke alarm, not a benchmark. The default budget
 * is deliberately generous, set to catch a return to the multi-gigabyte
 * regime rather than to police normal drift.
 *
 * `--cold` clears `.next/cache` first. Vercel's Standard build cache cannot
 * round-trip node_modules plus the Turbopack cache for a corpus this size, so
 * **Vercel builds are effectively always cold** and the warm number you get
 * locally never happens there. Use `--cold` for any figure you intend to act
 * on.
 */
import { spawn } from "node:child_process";
import { rmSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const COLD = args.includes("--cold");
const budgetIndex = args.indexOf("--budget-mb");
const BUDGET_MB = budgetIndex === -1 ? 5000 : Number(args[budgetIndex + 1]);

const ROOT = process.cwd();

/**
 * Working set of the build's OWN process tree, in MB.
 *
 * Summing every `node.exe` on the box would be much simpler and would be
 * wrong. This repo is developed with several agents running vitest and audit
 * scripts concurrently, and each of those is a node process of a few hundred
 * MB. A machine-wide sum silently attributes all of them to the build and can
 * easily double the reported peak, which is worse than no measurement:
 * it would either raise a false alarm or, if someone then relaxed the budget
 * to compensate, hide a real regression behind a padded threshold.
 *
 * So walk the tree from the build's own PID and count only its descendants.
 */
async function sampleTreeMemoryMb(rootPid) {
  return new Promise((resolve) => {
    const script =
      "$all = Get-CimInstance Win32_Process | Select-Object ProcessId,ParentProcessId,WorkingSetSize; " +
      `$want = New-Object System.Collections.Generic.HashSet[int]; [void]$want.Add(${rootPid}); ` +
      "$changed = $true; " +
      "while ($changed) { $changed = $false; foreach ($p in $all) { " +
      "if ($want.Contains([int]$p.ParentProcessId) -and -not $want.Contains([int]$p.ProcessId)) " +
      "{ [void]$want.Add([int]$p.ProcessId); $changed = $true } } } " +
      "$sel = $all | Where-Object { $want.Contains([int]$_.ProcessId) }; " +
      "'{0} {1}' -f (($sel | Measure-Object -Property WorkingSetSize -Sum).Sum), ($sel | Measure-Object).Count";

    const proc = spawn("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script], {
      windowsHide: true,
    });
    let out = "";
    proc.stdout.on("data", (chunk) => (out += chunk));
    proc.on("close", () => {
      const match = out.trim().match(/^(\d+)\s+(\d+)$/m);
      if (!match) return resolve({ mb: 0, processes: 0 });
      resolve({ mb: Number(match[1]) / 1048576, processes: Number(match[2]) });
    });
    proc.on("error", () => resolve({ mb: 0, processes: 0 }));
  });
}

async function main() {
  if (COLD) {
    console.log("clearing .next/cache for a cold build");
    try {
      rmSync(path.join(ROOT, ".next/cache"), { recursive: true, force: true });
    } catch {
      // Nothing cached yet, which is what we wanted anyway.
    }
  }

  const started = Date.now();
  let peakMb = 0;
  let peakProcesses = 0;
  let samples = 0;

  const build = spawn("npm", ["run", "build"], {
    cwd: ROOT,
    shell: true,
    stdio: ["ignore", "pipe", "pipe"],
  });

  let tail = "";
  build.stdout.on("data", (chunk) => {
    tail = (tail + chunk).slice(-4000);
    process.stdout.write(chunk);
  });
  build.stderr.on("data", (chunk) => {
    tail = (tail + chunk).slice(-4000);
    process.stderr.write(chunk);
  });

  let sampling = false;
  const sampler = setInterval(async () => {
    // A PowerShell sample takes longer than the interval on a loaded box, so
    // skip rather than pile up overlapping queries that would themselves
    // contend for the CPU being measured.
    if (sampling) return;
    sampling = true;
    try {
      const { mb, processes } = await sampleTreeMemoryMb(build.pid);
      samples += 1;
      if (mb > peakMb) {
        peakMb = mb;
        peakProcesses = processes;
      }
    } finally {
      sampling = false;
    }
  }, 700);

  const exitCode = await new Promise((resolve) => build.on("close", resolve));
  clearInterval(sampler);

  const seconds = ((Date.now() - started) / 1000).toFixed(1);
  console.log("\n" + "=".repeat(58));
  console.log(`build            ${exitCode === 0 ? "PASSED" : `FAILED (exit ${exitCode})`}`);
  console.log(`mode             ${COLD ? "cold (.next/cache cleared)" : "warm"}`);
  console.log(`wall clock       ${seconds}s`);
  console.log(`peak node memory ${peakMb.toFixed(0)} MB across ${peakProcesses} processes`);
  console.log(`samples          ${samples} at 500ms`);
  console.log(`budget           ${BUDGET_MB} MB`);
  console.log("=".repeat(58));

  if (samples < 10) {
    console.error("\nToo few samples to trust the peak. Did the build run at all?");
    process.exit(2);
  }
  if (exitCode !== 0) process.exit(1);
  if (peakMb > BUDGET_MB) {
    console.error(
      `\nPeak ${peakMb.toFixed(0)} MB is over the ${BUDGET_MB} MB budget.\n` +
        "Vercel's Standard build machine is a hard-capped 8GB container and the\n" +
        "kernel OOM-killer does not always say so: it can present as a silent\n" +
        "stall to the 45-minute timeout. Read docs/DEPLOYMENT.md before raising\n" +
        "this budget, and prefer shrinking the compile graph."
    );
    process.exit(1);
  }
  console.log("\nWithin budget.");
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
