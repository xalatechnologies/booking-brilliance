# XAL-651: Content gap: Småkommuner og kostnadseffektive løsninger

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Write and publish SEO content for "Småkommuner og kostnadseffektive løsninger". Cover Smaller municipalities seek cost-effective, often open-source booking solutions, representing an underserved market opportunity.. Goal: satisfy search intent for "småkommuner" on digilist.no. The blog post itself must be in Norwegian Bokmål.`

## Implementation contract — complete this before writing code
- **Problem:** Write and publish SEO content for "Småkommuner og kostnadseffektive løsninger". Cover Smaller municipalities seek cost-effective, often open-source booking solutions, representing an underserved market opportunity.. Goal: satisfy search intent for "småkommuner" on digilist.no. The blog post itself must be in Norwegian Bokmål.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-651-content-gap-smakommuner-og-kostnadseffektive-los`
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
- One issue → one branch (`agent/xal-651-content-gap-smakommuner-og-kostnadseffektive-los`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

## Full issue — from Linear (the source of truth for scope & acceptance)
> The Linear MCP in this environment may be bound to the WRONG workspace, so
> do NOT rely on it to read this ticket — everything you need is below. If
> something essential is genuinely missing here (e.g. a screenshot), STOP and
> end with "CLARIFICATION:" rather than guessing.

<!-- xaheen-triage -->

## Problem Statement

There is no content on [digilist.no](<http://digilist.no>) targeting "Småkommuner og kostnadseffektive løsninger" (small municipalities seeking cost-effective, often open-source booking solutions). The improvements agent flagged this as a content gap (confidence 95%, no direct code hits) from the search-demand cluster 'bookingløsning små kommuner'. The ask is to create or expand a Norwegian Bokmål SEO article covering this topic to satisfy search intent for "småkommuner".

## Scope

**Innenfor:**

* A blog/marketing article on booking-brilliance covering "Småkommuner og kostnadseffektive løsninger", written in Norwegian Bokmål
* Targeting search intent around "småkommuner" and cost-effective booking solutions for smaller municipalities

**Utenfor:**

* Changes outside the marketing repository
* Unrelated refactors or drive-by fixes
* Direct merges to main / scope creep beyond this content piece

## Acceptance Criteria

- [ ] A published article exists on the marketing site whose subject is cost-effective booking solutions for small municipalities ("småkommuner"), written in Norwegian Bokmål
- [ ] The article targets the keyword/topic "småkommuner" and cost-effective/open-source booking solutions (verifiable in the copy and metadata)
- [ ] CI is green: all relevant tests and the build pass
- [ ] No regression in existing user-facing behaviour or existing published content

## Testing Scenario

* Given the marketing site, When a reader searches/navigates for "småkommuner", Then the new article is present and its body is in Norwegian Bokmål
* Given the article, When its content is read, Then it addresses cost-effective (and open-source) booking solutions for smaller municipalities as described in the issue
* Given the branch, When CI runs, Then build and tests pass with no regression to existing pages

## Verdi: unknown — ingen prioritet satt; et menneske vurderer verdien

unknown because the issue only asserts "search demand" and an "underserved market opportunity" from an auto-generated cluster — it gives no keyword volume, no named prospect, and no revenue or commitment to value the article against.

## Målrepo: `marketing`

*Valgt av triage fra sakens innhold; ruter forberedelsen dit.*

## Åpne spørsmål

* What is the actual search volume / keyword data behind the 'bookingløsning små kommuner' cluster that justifies this piece?
* Who is the target reader (municipal procurement, small-kommune administrators?) — the issue does not name them.
* The issue claims small municipalities seek 'open-source' solutions — should the article position Digilist as open-source / cost-effective, and is that claim accurate for Digilist?
* Are there required format constraints (word count, internal-linking targets, CTA) or is this a standard blog article?

---

*Strukturert av triage-agenten. Originalteksten er bevart under.*

<details><summary>Opprinnelig beskrivelse</summary>

**SEO route:** content → `content-agent` · repo `marketing`

**Classification:** feature · severity major · priority P1

## Problem statement

Product gap: Content gap: Småkommuner og kostnadseffektive løsninger. Smaller municipalities seek cost-effective, often open-source booking solutions, representing an underserved market opportunity. Current assessment: gap (feature, major).

## Scope

Create or expand content covering "Småkommuner og kostnadseffektive løsninger" aligned with Smaller municipalities seek cost-effective, often open-source booking solutions, representing an underserved market opportunity.

## Out of scope

Changes outside the target repository for this issue. Unrelated refactors, drive-by fixes, or direct merges to main. Scope creep beyond the stated feature or improvement goal.

## Acceptance criteria

- [ ] Create or expand content covering "Småkommuner og kostnadseffektive løsninger" aligned with Smaller municipalities seek cost-effective, often open-source booking solutions, representing an underserved market opportunity.
- [ ] All relevant tests and build pass (green CI).
- [ ] No regression in existing user-facing behaviour.

## Code analysis (evidence, marketing @ seo-run)

Status: **gap** (confidence 95%)

* (no direct code hits; see details)

## Source

Product idea (cluster:bookingløsning små kommuner), from search demand

## Run as Claude loop (in `/root/booking-brilliance`, on a new branch)

```
/loop Write and publish SEO content for "Småkommuner og kostnadseffektive løsninger". Cover Smaller municipalities seek cost-effective, often open-source booking solutions, representing an underserved market opportunity.. Goal: satisfy search intent for "småkommuner" on digilist.no. The blog post itself must be in Norwegian Bokmål.
```

---

*Auto-generated by Digilist Improvements Agent (Linear specialist) from cluster:bookingløsning små kommuner + code analysis (graph @ seo-run). Move to the approval state to prepare an implementation branch.*

</details>

Linear: https://linear.app/xala-technologies/issue/XAL-651/content-gap-smakommuner-og-kostnadseffektive-losninger
