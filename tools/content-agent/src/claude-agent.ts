/**
 * Capable agent runner — runs `claude -p` with the FULL toolset enabled: every
 * built-in tool plus every MCP server registered for the Claude CLI (the
 * repository map via codebase-memory, RAG, memory, and the account connectors).
 *
 * This is the counterpart to claudeCli() in generate.ts. claudeCli locks tools
 * OFF (--max-turns 1 + --disallowedTools) for deterministic, cheap text
 * generation; that mode also flakes on large prompts because the model reaches
 * for a tool and hits the turn cap. This runner instead lets the agent USE its
 * tools (explore the codebase, read files, query the graph) across many turns —
 * more capable and more robust. Used by agents that benefit from grounding in
 * the real code (review, analysis).
 *
 * Runs on the Claude Max subscription (no API key), like the rest of the fleet:
 * ANTHROPIC_API_KEY is stripped so the subscription login is used. Tools are on
 * via --dangerously-skip-permissions; no --strict-mcp-config, so the CLI's
 * registered MCP servers (e.g. codebase-memory) are available.
 */
import { spawn } from "node:child_process";

export interface CapableAgentResult {
  text: string; // the agent's final message (raw)
  model: string;
  ok: boolean;
}

/**
 * Prepended to every capable-mode agent's system prompt so it KNOWS what it can
 * reach. The tools themselves are wired at the CLI level (built-ins on via
 * --dangerously-skip-permissions; MCP servers registered for the Claude CLI —
 * the repository map via codebase-memory, plus the account connectors). This
 * just makes the agent aware and inclined to use them.
 */
export const CAPABILITY_PREAMBLE = `You are a Digilist agent with FULL tool access. Use the tools actively before you conclude:
- Repository map (codebase-memory MCP): search_graph / get_code_snippet / get_architecture / trace_path / query_graph — to find symbols, callers, data flow and architecture in the actual code (faster and more precise than grep).
- Docs-RAG (docs-rag MCP): docs_search / docs_get — authoritative Digilist documentation (product, compliance/SSA-L, architecture, operations). Use it for facts about what Digilist does and how.
- File tools: Read / Grep / Glob / Bash — read the actual files, tests and config.
- Skills: invoke the relevant Digilist skills for established procedures when they exist.
- Account connectors (when needed): Linear, Gmail, Calendar, Drive, Notion.
- Memory/context: the agent brains live in tools/*-agent/brain and content-memory; read them for prior learnings when relevant.
Don't guess when you can look it up. Work read-only unless the task explicitly asks for changes.`;

export interface AgentRunOptions {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  cwd?: string; // run in a repo checkout so the repo map + Read target it
  maxTurns?: number;
  /** Idle watchdog: kill if NO output for this many minutes (genuinely stuck,
   *  not just slow). Default 25; 0 disables. Preferred over a total timeout so
   *  legitimate multi-hour migrations aren't cut off. */
  idleMin?: number;
  /** Absolute safety cap in minutes. Default 0 = none (rely on the idle watchdog). */
  timeoutMin?: number;
  /** Emit a progress heartbeat every N minutes (elapsed · turns · idle). Default 3; 0 disables. */
  heartbeatMin?: number;
  /** Label for heartbeat/log lines. */
  label?: string;
}

/** Extract the final result from a stream-json transcript (newline-delimited
 *  events); the `type:"result"` event carries `result` + `is_error`. */
export function parseStreamResult(stream: string): { result?: string; is_error?: boolean } | null {
  let found: { result?: string; is_error?: boolean } | null = null;
  for (const line of stream.split("\n")) {
    const t = line.trim();
    if (!t.startsWith("{")) continue;
    try {
      const ev = JSON.parse(t) as { type?: string; result?: string; is_error?: boolean };
      if (ev.type === "result") found = { result: ev.result, is_error: ev.is_error };
    } catch {
      /* skip partial/non-JSON lines */
    }
  }
  return found;
}

/**
 * The shared fleet agent runner. Runs `claude -p` in streaming mode with an
 * IDLE WATCHDOG (kill only on genuine stalls, not slowness), a progress
 * HEARTBEAT, and a configurable MODEL — used by every agentic agent (capable
 * review/analysis, the self-implementing coder) so they all behave consistently
 * and can run for hours. Tools on (--dangerously-skip-permissions) + all MCP.
 */
export function runClaudeAgent(opts: AgentRunOptions): Promise<CapableAgentResult> {
  const model = opts.model ?? "claude-opus-4-8";
  const label = opts.label ?? "agent";
  const args = [
    "-p",
    "--output-format", "stream-json", "--verbose",
    "--model", model,
    "--dangerously-skip-permissions",
    "--max-turns", String(opts.maxTurns ?? 30),
  ];
  if (opts.systemPrompt) args.push("--append-system-prompt", opts.systemPrompt);
  const env = { ...process.env };
  delete env.ANTHROPIC_API_KEY; // use the Max login, not a key
  delete env.ANTHROPIC_AUTH_TOKEN;
  // The fleet runs as root on the VPS; Claude blocks --dangerously-skip-
  // permissions as root unless it believes it's sandboxed. Dedicated host → opt in.
  env.IS_SANDBOX = "1";

  return new Promise<CapableAgentResult>((resolve) => {
    const child = spawn("claude", args, { cwd: opts.cwd, env, stdio: ["pipe", "pipe", "pipe"] });
    let out = "";
    let err = "";
    let killedFor = "";
    let turns = 0;
    const startedAt = Date.now();
    let lastActivity = Date.now();

    const idleMin = opts.idleMin ?? 25;
    let idleTimer: NodeJS.Timeout | null = null;
    const bumpIdle = () => {
      lastActivity = Date.now();
      if (idleMin <= 0) return;
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => { killedFor = "idle"; child.kill("SIGKILL"); }, idleMin * 60_000);
    };
    bumpIdle();
    const tmoMin = opts.timeoutMin ?? 0;
    const timer = tmoMin > 0 ? setTimeout(() => { killedFor = "timeout"; child.kill("SIGKILL"); }, tmoMin * 60_000) : null;
    const hbMin = opts.heartbeatMin ?? 3;
    const heartbeat = hbMin > 0 ? setInterval(() => {
      const elapsed = Math.round((Date.now() - startedAt) / 60_000);
      const idleSec = Math.round((Date.now() - lastActivity) / 1000);
      console.log(`     ♥ ${label}: ${elapsed}m · ${turns} turns · idle ${idleSec}s`);
    }, hbMin * 60_000) : null;
    const cleanup = () => { if (idleTimer) clearTimeout(idleTimer); if (timer) clearTimeout(timer); if (heartbeat) clearInterval(heartbeat); };

    child.stdout.on("data", (d) => {
      out += d;
      const s = String(d);
      for (const _ of s.matchAll(/"type"\s*:\s*"(assistant|user)"/g)) turns++;
      bumpIdle();
    });
    child.stderr.on("data", (d) => { err += d; bumpIdle(); });
    child.on("error", (e) => { cleanup(); resolve({ text: String(e), model, ok: false }); });
    child.on("close", (code) => {
      cleanup();
      if (killedFor) {
        resolve({ text: `BLOCKED: ${label} was stopped (${killedFor === "idle" ? `no activity for ${idleMin} min` : "time limit reached"}). Partial work may remain in the worktree.`, model: `${model} (max-cli)`, ok: false });
        return;
      }
      const r = parseStreamResult(out);
      if (r?.result) resolve({ text: String(r.result), model: `${model} (max-cli)`, ok: code === 0 && !r.is_error });
      else resolve({ text: (out || err).slice(-2000), model: `${model} (max-cli)`, ok: false });
    });
    child.stdin.write(opts.prompt);
    child.stdin.end();
  });
}

/** Capable review/analysis agent — the shared runner + the capability preamble.
 *  Shorter idle window (12 min) since these are bounded read/reason passes. */
export function runCapableAgent(opts: {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  cwd?: string;
  maxTurns?: number;
  timeoutMin?: number;
  idleMin?: number;
  label?: string;
}): Promise<CapableAgentResult> {
  const sys = opts.systemPrompt ? `${CAPABILITY_PREAMBLE}\n\n${opts.systemPrompt}` : CAPABILITY_PREAMBLE;
  return runClaudeAgent({
    prompt: opts.prompt,
    systemPrompt: sys,
    model: opts.model,
    cwd: opts.cwd,
    maxTurns: opts.maxTurns ?? 30,
    idleMin: opts.idleMin ?? 12,
    timeoutMin: opts.timeoutMin ?? 0,
    label: opts.label ?? "capable",
  });
}
