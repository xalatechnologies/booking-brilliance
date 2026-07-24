# XAL-654: Content gap: Frivillige organisasjoner og lag-tilgang

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Write and publish SEO content for "Frivillige organisasjoner og lag-tilgang". Cover Non-profit organizations and clubs need member-specific access controls and streamlined booking workflows for their facilities.. Goal: satisfy search intent for "frivillige" on digilist.no. The blog post itself must be in Norwegian Bokmål.`

## Implementation contract — complete this before writing code
- **Problem:** Write and publish SEO content for "Frivillige organisasjoner og lag-tilgang". Cover Non-profit organizations and clubs need member-specific access controls and streamlined booking workflows for their facilities.. Goal: satisfy search intent for "frivillige" on digilist.no. The blog post itself must be in Norwegian Bokmål.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-654-content-gap-frivillige-organisasjoner-og-lag-til`
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
- One issue → one branch (`agent/xal-654-content-gap-frivillige-organisasjoner-og-lag-til`) → one independently reviewable change. Never main.
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

An SEO content-gap was auto-detected for the Norwegian keyword cluster 'frivillig organisasjon bookingssystem' / 'frivillige organisasjoner og lag-tilgang' (94% gap confidence, no existing content hits). [digilist.no](<http://digilist.no>) currently has no content aimed at volunteer organizations and clubs booking their facilities with member-specific access. The issue asks for new Norwegian Bokmål content to satisfy that search intent. Nothing is broken — this is net-new/expanded marketing content.

## Scope

**Innenfor:**

* Create or expand Norwegian Bokmål SEO content on the marketing site (booking-brilliance) targeting the 'frivillige' / 'frivillig organisasjon bookingssystem' search intent
* Cover facility/lokale booking workflows for non-profit organizations and clubs (lag og foreninger)
* Cover member-specific access to booking, grounded in what Digilist actually offers (docs show rbac, tenant team-medlemskap, and sesongleie/fordelingsregler for lag og foreninger)

**Utenfor:**

* Any product/code change to access controls or booking behaviour (that would be the app repo, not marketing)
* Changes outside the marketing repository
* Unrelated refactors, drive-by fixes, or direct merges to main
* Claiming product capabilities that are not verified to exist

## Acceptance Criteria

- [ ] A Norwegian Bokmål article or page targeting the keyword cluster is created (or existing content expanded) and published on the marketing site
- [ ] The content addresses volunteer organizations and clubs booking their facilities, and member access to booking
- [ ] Every product capability claimed in the content is verified against Digilist docs/product before publishing (no invented features)
- [ ] Marketing build and all relevant tests pass (green CI)
- [ ] No regression in existing marketing pages or content

## Testing Scenario

* Given the new content is published, When a reader searches 'frivillige organisasjoner booking' / 'frivillig organisasjon bookingssystem', Then a live, indexable [digilist.no](<http://digilist.no>) page covering this topic is returned
* Given the article, When a reviewer reads it, Then it is written in Norwegian Bokmål and every stated product capability (e.g. member access, fordelingsregler) can be traced to Digilist docs or product
* Given the branch, When CI runs on the marketing repo, Then build and tests are green with no regression to existing pages

## Verdi: low

Enhancement, so no severity. Value is low, not higher: the only evidence is an auto-generated search-demand cluster with 94% gap confidence — a real but weak demand signal with no search-volume figure, no named user, no revenue or commitment. Not 'unknown' because a demand source is cited; not medium/high because nothing quantifies the demand or names who is blocked.

## Målrepo: `marketing`

*Valgt av triage fra sakens innhold; ruter forberedelsen dit.*

## Åpne spørsmål

* What is the actual search volume and the primary/secondary target keywords for this cluster? The issue gives none.
* Should this be a new blog post, a dedicated landing page, or an expansion of existing content? The issue says 'create or expand' without deciding.
* Does Digilist market 'member-specific access controls' for non-profits as a distinct feature, or is that framing aspirational? Docs show rbac + tenant team-medlemskap + fordelingsregler for lag/foreninger, but the exact claim should be confirmed before writing.
* Who is the target reader — volunteer-org administrators, club leaders, or municipal contacts serving them? The issue asserts 'non-profits and clubs' but no persona.
* What defines 'satisfy search intent' as done — a ranking target, minimum length, required internal links, or CTA? No measurable target is given.

---

*Strukturert av triage-agenten. Originalteksten er bevart under.*

<details><summary>Opprinnelig beskrivelse</summary>

**SEO route:** content → `content-agent` · repo `marketing`

**Classification:** feature · severity major · priority P1

## Problem statement

Product gap: Content gap: Frivillige organisasjoner og lag-tilgang. Non-profit organizations and clubs need member-specific access controls and streamlined booking workflows for their facilities. Current assessment: gap (feature, major).

## Scope

Create or expand content covering "Frivillige organisasjoner og lag-tilgang" aligned with Non-profit organizations and clubs need member-specific access controls and streamlined booking workflows for their facilities.

## Out of scope

Changes outside the target repository for this issue. Unrelated refactors, drive-by fixes, or direct merges to main. Scope creep beyond the stated feature or improvement goal.

## Acceptance criteria

- [ ] Create or expand content covering "Frivillige organisasjoner og lag-tilgang" aligned with Non-profit organizations and clubs need member-specific access controls and streamlined booking workflows for their facilities.
- [ ] All relevant tests and build pass (green CI).
- [ ] No regression in existing user-facing behaviour.

## Code analysis (evidence, marketing @ seo-run)

Status: **gap** (confidence 94%)

* (no direct code hits; see details)

## Source

Product idea (cluster:frivillig organisasjon bookingssystem), from search demand

## Run as Claude loop (in `/root/booking-brilliance`, on a new branch)

```
/loop Write and publish SEO content for "Frivillige organisasjoner og lag-tilgang". Cover Non-profit organizations and clubs need member-specific access controls and streamlined booking workflows for their facilities.. Goal: satisfy search intent for "frivillige" on digilist.no. The blog post itself must be in Norwegian Bokmål.
```

---

*Auto-generated by Digilist Improvements Agent (Linear specialist) from cluster:frivillig organisasjon bookingssystem + code analysis (graph @ seo-run). Move to the approval state to prepare an implementation branch.*

</details>

Linear: https://linear.app/xala-technologies/issue/XAL-654/content-gap-frivillige-organisasjoner-og-lag-tilgang
