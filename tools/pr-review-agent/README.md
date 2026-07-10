# PR-review agent

An autonomous reviewer for the Digilist fleet. It finds open pull requests,
reviews the diff with Claude (best model, on the Max subscription), and posts an
**advisory `COMMENT` review** to GitHub. It closes the self-improving loop: the
[improvements agent](../improvements-agent) opens PRs, this agent reviews them.

## What it does

1. **Scans GitHub** for open PRs (no local checkout needed — `gh --repo
   owner/name`). By default it scans `xalatechnologies/booking-brilliance` and
   `Xala-Technologies/Digilist`; `PR_REVIEW_ORGS`/`--org` discovers every repo
   in an org that has open PRs. Bot PRs (dependabot etc.) are skipped by default.
2. For each PR not yet reviewed at its current head commit: pulls the diff +
   metadata and asks Claude for a senior review (correctness, security/RBAC,
   a11y, performance, tests, does-it-do-what-it-says).
3. Renders the structured verdict as markdown and posts it with
   `gh pr review --comment`.

## Safety

- **Advisory only.** It posts a `COMMENT` review — never `--approve`,
  `--request-changes`, or a merge. A human still decides.
- **Diff-based & read-only.** It reviews the patch; it does not run the code.
- **Idempotent.** Dedupes on the PR head commit (re-reviews only when new
  commits land) and on a hidden marker in its own prior review.
- `--dry-run` prints the review and posts nothing.

## Run

```bash
# LLM_PROVIDER=claude-cli uses the Max login (no ANTHROPIC_API_KEY)
pnpm pr-review:run -- --dry-run                    # preview, post nothing
pnpm pr-review:run                                 # review + post (default repos)
pnpm pr-review:run -- --repo Digilist --pr 42      # one specific PR
pnpm pr-review:run -- --org xalatechnologies       # discover + review org-wide
```

Env: `GH_TOKEN` (repo access) · `PR_REVIEW_REPOS` (comma slugs `owner/name`) ·
`PR_REVIEW_ORGS` (comma orgs to auto-discover) · `PR_REVIEW_ONLY_AGENT=1` (only
`agent/*` branches) · `PR_REVIEW_INCLUDE_BOTS=1` (also review dependabot etc.) ·
`PR_REVIEW_MULTILENS=1` (multi-agent review). Flags: `--dry-run`, `--limit N`,
`--all` (drafts), `--repo <slug|name>`, `--org <owner>`, `--pr N`,
`--include-bots`, `--multi-lens`.

## Capabilities

On `LLM_PROVIDER=claude-cli` the reviewer runs in **capable mode** (full tools),
grounded in the repo checkout, with:
- **Repository map** (`codebase-memory` MCP) — verify callers/types/RBAC in real code.
- **Docs-RAG** (`docs-rag` MCP) — `docs_search`/`docs_get` over the Digilist docs.
- **Skill** — the `digilist-code-review` rubric.
- **`--multi-lens`** — one capable agent per lens (correctness, security/RBAC,
  WCAG/UX, tests/CI) runs in parallel, findings merged. More thorough; ~4× the
  work per PR (fine on the flat Max subscription).

## On the VPS

`vps-pr-review-runner.sh` is invoked by `digilist-pr-review.timer`; state lives
in `state/reviews.json` (gitignored, survives `git reset --hard`).
