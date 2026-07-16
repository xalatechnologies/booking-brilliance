# XAL-447: Title is 67 chars (recommend ≤65) (title.long)

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop In the marketing repo (digilist.no) fix the SEO 'title.long' warning: several blog post titles exceed the recommended 65-character limit and get truncated in search results.

Scope: src/content/blog/*.md frontmatter `title:` field only.

Steps:
1. Scan all posts: for each src/content/blog/*.md, measure the length of the `title:` value (strip surrounding quotes). List every post where the title is >65 chars. Current offenders include: idrettshall-ledige-tider-booking-innbygger.md (73), hva-er-bookingsystem-kommunale-lokaler.md (71), leie-kommunalt-lokale-pris-guide.md (70), idrettshall-ledige-tider-booking-hele-livssyklusen.md (70), bryllupslokale-kommune-prosess-fra-sok-til-kontrakt.md (70), bryllupslokale-kommune-krav-kapasitet-sammenligning.md (69), m-terom.md (68), bookingsystem-kommune-sammenligning-matrise-tco.md (67), leie-lokale-kommune-vilkar-depositum-avbestilling.md (66), kapasitetsstyring-idrettsanlegg-driftsleder.md (66), compliance-sikkerhet-og-datavern.md (66). Re-derive the exact set at runtime rather than trusting this list.
2. Rewrite each offending `title:` to ≤65 chars in Norwegian Bokmål. Keep the primary keyword (usually derivable from the slug and the first `keywords[]` entry) and the meaning; tighten wording, drop filler, use a colon subtitle if helpful. Do NOT change the slug, filename, description, keywords, or body content.
3. Only edit the `title:` line; leave all other frontmatter and prose untouched.
4. Add a regression guard: in scripts/verify-live.mjs (which already extracts <title> via extractTitle/expectedTitle) or an equivalent content lint, assert every blog title is ≤65 chars and fail if not.

Acceptance criteria:
- Every src/content/blog/*.md frontmatter title is ≤65 chars (verify with a length scan; 0 offenders).
- Titles remain unique, keyword-relevant, and grammatical Bokmål; no slug/filename/description/keywords/body changes.
- Existing build/lint/test suite is green (run the repo's build + any content verify/lint script before opening the PR).
- Open a PR only after checks pass.`

## Implementation contract — complete this before writing code
- **Problem:** In the marketing repo (digilist.no) fix the SEO 'title.long' warning: several blog post titles exceed the recommended 65-character limit and get truncated in search results.

Scope: src/content/blog/*.md frontmatter `title:` field only.

Steps:
1. Scan all posts: for each src/content/blog/*.md, measure the length of the `title:` value (strip surrounding quotes). List every post where the title is >65 chars. Current offenders include: idrettshall-ledige-tider-booking-innbygger.md (73), hva-er-bookingsystem-kommunale-lokaler.md (71), leie-kommunalt-lokale-pris-guide.md (70), idrettshall-ledige-tider-booking-hele-livssyklusen.md (70), bryllupslokale-kommune-prosess-fra-sok-til-kontrakt.md (70), bryllupslokale-kommune-krav-kapasitet-sammenligning.md (69), m-terom.md (68), bookingsystem-kommune-sammenligning-matrise-tco.md (67), leie-lokale-kommune-vilkar-depositum-avbestilling.md (66), kapasitetsstyring-idrettsanlegg-driftsleder.md (66), compliance-sikkerhet-og-datavern.md (66). Re-derive the exact set at runtime rather than trusting this list.
2. Rewrite each offending `title:` to ≤65 chars in Norwegian Bokmål. Keep the primary keyword (usually derivable from the slug and the first `keywords[]` entry) and the meaning; tighten wording, drop filler, use a colon subtitle if helpful. Do NOT change the slug, filename, description, keywords, or body content.
3. Only edit the `title:` line; leave all other frontmatter and prose untouched.
4. Add a regression guard: in scripts/verify-live.mjs (which already extracts <title> via extractTitle/expectedTitle) or an equivalent content lint, assert every blog title is ≤65 chars and fail if not.

Acceptance criteria:
- Every src/content/blog/*.md frontmatter title is ≤65 chars (verify with a length scan; 0 offenders).
- Titles remain unique, keyword-relevant, and grammatical Bokmål; no slug/filename/description/keywords/body changes.
- Existing build/lint/test suite is green (run the repo's build + any content verify/lint script before opening the PR).
- Open a PR only after checks pass.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-447-title-is-67-chars-recommend-65-title-long`
- **Scope:** _the one change this branch delivers_
- **Out of scope:** _what you will NOT touch — no opportunistic refactor, no formatting sweeps_
- **Acceptance criteria:** _observable, demonstrable outcomes_
- **Architecture constraints:** _boundaries + patterns to follow_
- **Files likely affected:** _list them; if this grows well beyond the list, escalate_
- **Testing requirements:** _what proves it works_
- **Security considerations:** _secrets, RBAC, injection, dependencies_
- **Rollback strategy:** _how to revert safely_
- **Definition of done:** compiled · tests green · acceptance demonstrated with evidence · one reviewable change · no attribution

## Delivery rules
- One issue → one branch (`agent/xal-447-title-is-67-chars-recommend-65-title-long`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

Linear: https://linear.app/xala-technologies/issue/XAL-447/title-is-67-chars-recommend-65-titlelong
