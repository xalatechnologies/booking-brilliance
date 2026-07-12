# CTO / orchestrator-agent

The technical lead of the Digilist agent fleet. Runs on a HEARTBEAT: reads the
fleet state, drives the human-approved work queue toward PRs, reasons about
priorities with Opus, and assigns work to the right specialist.

It does not rebuild code: it reuses the existing primitives (`runClaudeAgent`,
`OpenBrain`, `LinearClient`, and especially `prepareApproved` +
`implementPending` from the improvements agent). The CTO is the conductor, not a
new implementer.

## The heartbeat loop

Each cycle (`cto:run`, or `cto:loop` with an interval):

1. **Todo driver (the active part).** Read Linear "Todo" - everything you have
   approved. Sort by Linear priority (Urgent=1 first, then High=2, Normal=3,
   Low=4, ties by `createdAt`). For EVERY Todo issue, in priority order:
   - **Enhance first** when the issue is thin or lacks a `/loop` goal (the
     normal case: a human drops a one-line issue into Todo). The CTO builds an
     item from title + description, runs the analyze stage (`analyzeItem`,
     grounded in the code graph via codebase-memory), and writes a properly
     detailed description + a self-contained `/loop` GOAL back onto the Linear
     issue in the agent format (`Run as a Claude loop (in <repo>)` + \`\`\``/loop …`\`\`\`).
     A Todo issue is never skipped for lacking a goal: it gets one.
   - **Drive it:** `prepareApproved` creates the branch and moves Todo -> In
     Progress, `implementPending` runs the coding agent on the shared runner,
     opens a PR and moves it -> In Review (or leaves a BLOCKED/CLARIFICATION
     comment + label if it gets stuck).
2. **Read the rest of the fleet state** into a `FleetState` object: Linear
   issues (all states, labels, priority), Open Brain (items/verdicts/prepared/
   learnings), open PRs across the Digilist repos via `gh` (checks, review
   decision).
3. **Reasoning (Opus via `runClaudeAgent`).** Decide what matters now, which
   specialist should own each non-Todo issue, suggested priority/severity, and
   blockers that need you. Returns a structured plan
   `{ assignments, blockers, summary }`.
4. **Actions - only the safe parts.** Set Linear priority/labels, write a CTO
   briefing, save the plan + learnings to Open Brain, and raise blockers up to
   you. It drives Todo -> PR, but **never merges or deploys**, and never moves
   anything INTO Todo (that is your decision) unless `CTO_AUTOPILOT=1`.

## Advisory vs autopilot

- **Advisory (default):** safe by design. Todo is the human approval gate. The
  CTO drives approved work to a PR you review, and advises on everything else
  (assignments, priority, blockers) without moving anything into the queue
  itself.
- **Autopilot (`CTO_AUTOPILOT=1`):** the CTO is additionally allowed to move
  issues it recommends into Todo (`promote`). It still never merges or deploys -
  the outcome is always a PR.

## Commands

```bash
pnpm cto:run                 # one cycle
pnpm cto:run -- --dry-run    # read + reason, change nothing
pnpm cto:run -- --no-reason  # only drive the Todo queue (skip the Opus pass)
pnpm cto:run -- --limit 1    # build at most 1 issue this cycle
pnpm cto:loop                # heartbeat (CTO_INTERVAL_MIN, default 20)
pnpm cto:test                # unit tests (normalization + plan parsing)
```

## Environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `LINEAR_API_KEY` | (required) | Personal Linear key |
| `LINEAR_TEAM_KEY` | `XAL` | Team |
| `IMPROVEMENTS_LINEAR_PROJECT` | `Digilist - Improvements Agent` | The project the CTO manages |
| `IMPROVEMENTS_APPROVE_STATE` | `Todo` | The approval gate |
| `LLM_PROVIDER` | `api` | Set `claude-cli` for the Claude Max subscription |
| `CTO_REASON_MODEL` | the review model (Opus) | Model for the reasoning pass |
| `CTO_INTERVAL_MIN` | `20` | Heartbeat interval (`<=0` = one cycle) |
| `CTO_MAX_CYCLES` | `0` | Max number of cycles in the loop (0 = unbounded) |
| `CTO_AUTOPILOT` | (off) | `1` lets the CTO move issues into Todo |
| `CTO_REPOS` | `xalatechnologies/booking-brilliance,xalatechnologies/Digilist` | Repos it scans for open PRs |
| `CTO_BRIEFING_ISSUE` | (off) | Linear issue (id/identifier) to post the briefing summary as a comment on |
| `DIGILIST_REPO_PATH` | `/root/Digilist` | Digilist checkout for prepare/implement |

Briefings are written to `tools/orchestrator-agent/state/briefing-<sha>.md` (and
`briefing-latest.md`). The directory is gitignored.

## Running on the VPS + systemd timer

The runner mirrors the other VPS runners (git reset origin/main, `load-env.sh`,
`LLM_PROVIDER=claude-cli`, `unset ANTHROPIC_API_KEY`):

```bash
tools/orchestrator-agent/vps-cto-runner.sh run
tools/orchestrator-agent/vps-cto-runner.sh loop
```

Run the Todo driver heartbeat frequently with a systemd timer, e.g. every 20
minutes:

```ini
# /etc/systemd/system/digilist-cto.service
[Unit]
Description=Digilist CTO / orchestrator heartbeat
After=network-online.target

[Service]
Type=oneshot
ExecStart=/root/booking-brilliance/tools/orchestrator-agent/vps-cto-runner.sh run
TimeoutStartSec=0
```

```ini
# /etc/systemd/system/digilist-cto.timer
[Unit]
Description=Run the Digilist CTO heartbeat every 20 minutes

[Timer]
OnBootSec=5min
OnUnitActiveSec=20min
Persistent=true

[Install]
WantedBy=timers.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now digilist-cto.timer
```

### Relationship to the improvements timers

This heartbeat drives the whole Todo -> prepare -> implement -> PR chain itself,
and can therefore **replace** the separate `digilist-improvements-prepare` and
`digilist-improvements-implement` timers: when the CTO runs every 20 minutes, it
picks up approved issues, prepares the branches and builds them, exactly as the
two timers did separately.

This PR does not uninstall them. Running the old
`digilist-improvements-implement` timer alongside the CTO heartbeat is now safe:
`implementPending` holds a cross-process lock, so the two serialize and never
double-build. Once you have verified the CTO heartbeat does the job in
production, disable the old improvements-implement timer so the CTO is the single
driver:

```bash
sudo systemctl disable --now digilist-improvements-prepare.timer
sudo systemctl disable --now digilist-improvements-implement.timer
```

`digilist-improvements-run.timer` (analysis + archiving of new proposals) is a
separate step and should stay.

## Design

- `src/state.ts` - gathers `FleetState` (Linear + Open Brain + `gh` PRs) and
  normalizes it. Pure helpers (`normalizeIssue`, `sortIssuesByPriority`,
  `classifyChecks`, `normalizePr`) are unit-tested with no network.
- `src/drive.ts` - the Todo -> enhance -> prepare -> implement loop. Reuses
  `analyzeItem`, `goalMarkdown`, `prepareApproved` and `implementPending`.
- `src/orchestrate.ts` - Opus reasoning -> plan. `buildReasoningPrompt` and
  `parsePlan` are pure and tested.
- `src/briefing.ts` - writes the human-readable briefing.
- `src/run.ts` - `cto:run`, one cycle. `src/loop.ts` - `cto:loop`, the heartbeat.
