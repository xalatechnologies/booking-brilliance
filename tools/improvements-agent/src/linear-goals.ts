/**
 * Turns an actionable verdict into a Linear issue written as a runnable Claude
 * `/loop` goal, and files it into the improvements project (deduped).
 */
import type { LinearClient, LinearIssue } from "../../content-agent/src/linear";
import type { Verdict } from "./analyze";
import { REPOS, type Item } from "./inputs";

const norm = (s: string) => s.toLowerCase().replace(/[^a-zæøå0-9 ]/gi, "").replace(/\s+/g, " ").trim();

export function goalMarkdown(item: Item, verdict: Verdict, codeSha: string): string {
  const repo = REPOS[item.target_repo];
  const evidence = verdict.code_evidence.length
    ? verdict.code_evidence.map((e) => `- \`${e.ref}\` — ${e.note}`).join("\n")
    : "- (ingen direkte kodetreff; se detaljer)";
  const kilde =
    item.kind === "idea"
      ? `Produktidé (${item.source_ref}), fra søkeetterspørsel`
      : `Skann-funn: ${item.category}/${item.severity}${item.url ? ` — ${item.url}` : ""}`;
  return [
    `## Mål`,
    verdict.fix || item.title,
    ``,
    `## Kilde`,
    kilde,
    ``,
    `## Kodeanalyse (bevis, ${item.target_repo} @ ${codeSha.slice(0, 8)})`,
    `Status: **${verdict.status}** (konfidens ${(verdict.confidence * 100).toFixed(0)} %)`,
    evidence,
    ``,
    `## Akseptansekriterier`,
    `- [ ] ${verdict.fix || "Implementer som beskrevet i målet"}`,
    `- [ ] Tester og bygg grønne`,
    `- [ ] Ingen regresjon i eksisterende funksjonalitet`,
    ``,
    `## Kjør som Claude-loop (i \`${repo.path}\`, på en ny branch)`,
    "```",
    `/loop ${verdict.goal_prompt || item.title}`,
    "```",
    ``,
    `---`,
    `_Auto-generert av Digilist Improvements Agent fra ${item.source_ref} + kodeanalyse (graf @ ${codeSha.slice(0, 8)}). Flytt til godkjenningstilstand for å klargjøre en implementasjons-branch._`,
  ].join("\n");
}

export async function fileGoal(
  client: LinearClient,
  ctx: { teamId: string; projectId: string; existingTitles: Set<string> },
  item: Item,
  verdict: Verdict,
  codeSha: string,
): Promise<LinearIssue | null> {
  const title = item.title.length > 120 ? `${item.title.slice(0, 117)}…` : item.title;
  if (ctx.existingTitles.has(norm(title))) return null; // deduped
  const issue = await client.createIssue({
    teamId: ctx.teamId,
    projectId: ctx.projectId,
    title,
    description: goalMarkdown(item, verdict, codeSha),
  });
  ctx.existingTitles.add(norm(title));
  return issue;
}
