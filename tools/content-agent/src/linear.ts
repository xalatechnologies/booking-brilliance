/**
 * Shared Linear (GraphQL) client. Used by the improvements agent to file
 * code-grounded goals into a project and to detect approval-state transitions.
 * Reads LINEAR_API_KEY from the environment (personal API key → Authorization
 * header without a "Bearer" prefix).
 */
const ENDPOINT = "https://api.linear.app/graphql";

export interface LinearTeam {
  id: string;
  key: string;
  name: string;
}
export interface LinearProject {
  id: string;
  name: string;
  url: string;
}
export interface LinearIssue {
  id: string;
  identifier: string;
  title: string;
  url: string;
  state?: { name: string; type: string };
}

export class LinearClient {
  constructor(private apiKey: string) {
    if (!apiKey) throw new Error("LinearClient: LINEAR_API_KEY required");
  }

  async gql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
    const r = await fetch(ENDPOINT, {
      method: "POST",
      headers: { Authorization: this.apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    const json = (await r.json()) as { data?: T; errors?: { message: string }[] };
    if (json.errors?.length) throw new Error(`linear: ${json.errors.map((e) => e.message).join("; ")}`);
    return json.data as T;
  }

  async resolveTeam(teamKey?: string): Promise<LinearTeam> {
    const { teams } = await this.gql<{ teams: { nodes: LinearTeam[] } }>(
      `query { teams(first: 50) { nodes { id key name } } }`,
    );
    const team = (teamKey && teams.nodes.find((t) => t.key === teamKey)) || teams.nodes[0];
    if (!team) throw new Error("linear: no team found");
    return team;
  }

  /** Find a project by (case-insensitive, punctuation-loose) name. */
  async findProject(name: string): Promise<LinearProject | null> {
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    const { projects } = await this.gql<{ projects: { nodes: LinearProject[] } }>(
      `query { projects(first: 200) { nodes { id name url } } }`,
    );
    return projects.nodes.find((p) => norm(p.name) === norm(name)) ?? null;
  }

  async ensureProject(name: string, teamId: string, description = ""): Promise<LinearProject> {
    const existing = await this.findProject(name);
    if (existing) return existing;
    const res = await this.gql<{ projectCreate: { project: LinearProject } }>(
      `mutation($input: ProjectCreateInput!) { projectCreate(input: $input) { project { id name url } } }`,
      { input: { name, teamIds: [teamId], description } },
    );
    return res.projectCreate.project;
  }

  async issuesInProject(projectId: string): Promise<LinearIssue[]> {
    const { issues } = await this.gql<{ issues: { nodes: LinearIssue[] } }>(
      `query($id: ID!) { issues(filter: { project: { id: { eq: $id } } }, first: 250) {
        nodes { id identifier title url state { name type } } } }`,
      { id: projectId },
    );
    return issues.nodes;
  }

  /** Issues in a project currently in a given workflow-state name (approval gate). */
  async issuesInState(projectId: string, stateName: string): Promise<LinearIssue[]> {
    return (await this.issuesInProject(projectId)).filter(
      (i) => (i.state?.name ?? "").toLowerCase() === stateName.toLowerCase(),
    );
  }

  /** Find-or-create workspace labels; returns a name→id map (case-insensitive). */
  async ensureLabels(
    labels: { name: string; color: string }[],
    teamId: string,
  ): Promise<Record<string, string>> {
    const { issueLabels } = await this.gql<{ issueLabels: { nodes: { id: string; name: string }[] } }>(
      `query { issueLabels(first: 250) { nodes { id name } } }`,
    );
    const byName = new Map(issueLabels.nodes.map((l) => [l.name.toLowerCase(), l.id]));
    const out: Record<string, string> = {};
    for (const l of labels) {
      let id = byName.get(l.name.toLowerCase());
      if (!id) {
        const res = await this.gql<{ issueLabelCreate: { issueLabel: { id: string } } }>(
          `mutation($input: IssueLabelCreateInput!) { issueLabelCreate(input: $input) { issueLabel { id } } }`,
          { input: { name: l.name, color: l.color, teamId } },
        ).catch(() => null);
        id = res?.issueLabelCreate?.issueLabel?.id;
      }
      if (id) out[l.name] = id;
    }
    return out;
  }

  async createIssue(input: {
    teamId: string;
    projectId: string;
    title: string;
    description: string;
    priority?: number; // Linear native: 0 none, 1 urgent, 2 high, 3 normal, 4 low
    labelIds?: string[];
  }): Promise<LinearIssue> {
    const res = await this.gql<{ issueCreate: { success: boolean; issue: LinearIssue } }>(
      `mutation($input: IssueCreateInput!) { issueCreate(input: $input) {
        success issue { id identifier title url } } }`,
      { input },
    );
    if (!res.issueCreate.success) throw new Error(`linear: issueCreate failed for "${input.title}"`);
    return res.issueCreate.issue;
  }

  async addComment(issueId: string, body: string): Promise<void> {
    await this.gql(
      `mutation($input: CommentCreateInput!) { commentCreate(input: $input) { success } }`,
      { input: { issueId, body } },
    );
  }

  /** Ensure a label exists (by name) and attach it to an issue (additive). */
  async addLabel(issueId: string, teamId: string, name: string, color = "#eb5757"): Promise<void> {
    const map = await this.ensureLabels([{ name, color }], teamId);
    const labelId = map[name];
    if (!labelId) return;
    await this.gql(
      `mutation($id: String!, $labelId: String!) { issueAddLabel(id: $id, labelId: $labelId) { success } }`,
      { id: issueId, labelId },
    ).catch(() => {});
  }

  /** Remove a label from an issue by name (best-effort; no-op if absent). */
  async removeLabel(issueId: string, teamId: string, name: string): Promise<void> {
    const { issueLabels } = await this.gql<{ issueLabels: { nodes: { id: string; name: string }[] } }>(
      `query { issueLabels(first: 250) { nodes { id name } } }`,
    );
    const labelId = issueLabels.nodes.find((l) => l.name.toLowerCase() === name.toLowerCase())?.id;
    if (!labelId) return;
    await this.gql(
      `mutation($id: String!, $labelId: String!) { issueRemoveLabel(id: $id, labelId: $labelId) { success } }`,
      { id: issueId, labelId },
    ).catch(() => {});
  }

  /** Workflow states for a team (id, name, type). */
  async teamStates(teamId: string): Promise<{ id: string; name: string; type: string }[]> {
    const { team } = await this.gql<{ team: { states: { nodes: { id: string; name: string; type: string }[] } } }>(
      `query($id: String!) { team(id: $id) { states { nodes { id name type } } } }`,
      { id: teamId },
    );
    return team.states.nodes;
  }

  /** Move an issue to a workflow state by name (case/punctuation-insensitive). */
  async moveIssue(issueId: string, teamId: string, stateName: string): Promise<boolean> {
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const states = await this.teamStates(teamId);
    const state = states.find((s) => norm(s.name) === norm(stateName));
    if (!state) return false;
    await this.gql(
      `mutation($id: String!, $stateId: String!) { issueUpdate(id: $id, input: { stateId: $stateId }) { success } }`,
      { id: issueId, stateId: state.id },
    );
    return true;
  }
}
