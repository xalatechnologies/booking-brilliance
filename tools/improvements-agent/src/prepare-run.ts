/**
 * improvements:prepare — polls the Linear improvements project for issues in the
 * approval state and prepares an isolated implementation branch for each (see
 * prepare.ts). Meant to run frequently (e.g. hourly) on the logged-in machine.
 *
 * Env: LINEAR_API_KEY, LINEAR_TEAM_KEY (default XAL), IMPROVEMENTS_LINEAR_PROJECT
 *   (default "Digilist - Improvements Agent"), IMPROVEMENTS_APPROVE_STATE
 *   (default "Todo"). Flag: --dry-run.
 */
import { LinearClient } from "../../content-agent/src/linear";
import { OpenBrain } from "./brain";
import { implementPending } from "./implement-run";
import { prepareApproved } from "./prepare";

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const linearKey = process.env.LINEAR_API_KEY ?? "";
  if (!linearKey) throw new Error("LINEAR_API_KEY required");
  const projectName = process.env.IMPROVEMENTS_LINEAR_PROJECT ?? "Digilist - Improvements Agent";
  const approveState = process.env.IMPROVEMENTS_APPROVE_STATE ?? "Todo";

  const client = new LinearClient(linearKey);
  const team = await client.resolveTeam(process.env.LINEAR_TEAM_KEY ?? "XAL");
  const project = await client.ensureProject(projectName, team.id);
  const brain = OpenBrain.load();

  console.log(`[prepare] project "${project.name}", approval state "${approveState}"${dryRun ? " (dry run)" : ""}`);
  const n = await prepareApproved(client, project.id, approveState, brain, dryRun, team.id);
  brain.save(new Date().toISOString());
  console.log(`[prepare] done — ${n} issue(s) prepared.`);

  // Fully hands-off: after preparing, code them too. Opt-in so prepare stays a
  // pure "set up a branch" step by default. `moving an issue to Todo` then runs
  // the whole Todo → branch → implement → PR pipeline unattended.
  if (!dryRun && process.env.IMPROVEMENTS_AUTO_IMPLEMENT === "1") {
    console.log(`[prepare] auto-implement enabled — building prepared issues…`);
    await implementPending({});
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
