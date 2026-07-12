/**
 * cto:loop - the heartbeat. Runs runCycle on a fixed interval so the fleet keeps
 * building the approved queue without a person poking it. In production a
 * systemd timer normally drives a single cto:run every 15-30 min (see README);
 * this loop is the equivalent for a long-lived process or local use.
 *
 * Env: CTO_INTERVAL_MIN (default 20; <=0 runs a single cycle and exits),
 *   CTO_MAX_CYCLES (default 0 = unbounded). Passes --dry-run / --no-reason /
 *   --limit through to each cycle.
 */
import { runCycle, type CycleOptions } from "./run";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const argv = process.argv.slice(2);
  const li = argv.indexOf("--limit");
  const opts: CycleOptions = {
    dryRun: argv.includes("--dry-run"),
    noReason: argv.includes("--no-reason"),
    limit: li >= 0 ? Number(argv[li + 1]) || undefined : undefined,
  };
  const intervalMin = Number(process.env.CTO_INTERVAL_MIN ?? 20);
  const maxCycles = Number(process.env.CTO_MAX_CYCLES ?? 0) || 0;

  if (!Number.isFinite(intervalMin) || intervalMin <= 0) {
    await runCycle(opts);
    return;
  }

  console.log(`[cto-loop] heartbeat every ${intervalMin} minutes${maxCycles ? `, max ${maxCycles} cycles` : ""}`);
  let n = 0;
  for (;;) {
    n++;
    const started = Date.now();
    try {
      await runCycle(opts);
    } catch (e) {
      console.error(`[cto-loop] cycle ${n} failed: ${String(e).slice(0, 200)}`);
    }
    if (maxCycles && n >= maxCycles) {
      console.log(`[cto-loop] reached ${maxCycles} cycles, stopping.`);
      return;
    }
    const elapsed = Date.now() - started;
    const wait = Math.max(0, intervalMin * 60_000 - elapsed);
    console.log(`[cto-loop] cycle ${n} done in ${Math.round(elapsed / 1000)}s, waiting ${Math.round(wait / 1000)}s…`);
    await sleep(wait);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
