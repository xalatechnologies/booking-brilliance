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

  async createIssue(input: {
    teamId: string;
    projectId: string;
    title: string;
    description: string;
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
}
