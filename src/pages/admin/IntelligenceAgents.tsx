/**
 * /admin/intelligence/agenter — Specialist AI agents.
 *
 * Five role-scoped agents (Sikkerhet, SEO, WCAG, Ytelse, Triage). The user
 * picks an agent, then chats. Each agent has its own scoped system prompt
 * server-side; the client just routes the agent id with each message.
 *
 * Optionally passes a slice of the current snapshot (top errors + scores)
 * as `context` so the agent can reference real findings.
 */
import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Bot,
  Brain,
  Code2,
  Eye,
  Gauge,
  Loader2,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AUTH_KEY,
  type AgentSummary,
  type IntelligenceCtx,
} from "./intelligence-shared";

interface ToolTraceItem {
  tool: string;
  input: Record<string, unknown>;
  resultPreview: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  model?: string;
  thinking?: string | null;
  toolTrace?: ToolTraceItem[];
}

const HISTORY_KEY = "digilist-agent-history-v1";

function loadHistory(): Record<string, Message[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function saveHistory(history: Record<string, Message[]>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    /* quota exceeded — ignore */
  }
}

// Static fallback if /api/agents is slow — keeps the page responsive.
const AGENT_FALLBACK: Array<{
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    id: "triage",
    name: "Triage-agent",
    description: "Klassifiserer og prioriterer funn. Start her hvis du er usikker.",
    icon: Sparkles,
  },
  {
    id: "sikkerhet",
    name: "Sikkerhets-rådgiver",
    description: "OWASP, headers, secrets, supply chain, ISO 27001.",
    icon: ShieldCheck,
  },
  {
    id: "seo",
    name: "SEO-strateg",
    description: "Kommune-søk, SSA-L, AI-search, llms.txt, Schema.org.",
    icon: Search,
  },
  {
    id: "wcag",
    name: "WCAG-revisor",
    description: "Universell utforming, WCAG 2.1 AA, Digdir Designsystemet.",
    icon: Eye,
  },
  {
    id: "ytelse",
    name: "Ytelses-ingeniør",
    description: "Core Web Vitals, bundle size, caching, CDN.",
    icon: Gauge,
  },
];

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  triage: Sparkles,
  sikkerhet: ShieldCheck,
  seo: Search,
  wcag: Eye,
  ytelse: Gauge,
};

const SAMPLE_PROMPTS: Record<string, string[]> = {
  triage: [
    "Hvilke 3 funn bør jeg fikse først?",
    "Er noen av disse en compliance-blokker for SSA-L?",
    "Lag en handlingsplan for de neste 2 ukene.",
    "Hva er forskjellen på warn og error i denne kategorien?",
  ],
  sikkerhet: [
    "Hvilke security headers mangler vi?",
    "Vurder CSP-en min. Er den trygg å stramme inn?",
    "Hvordan kommer jeg fra B til A+ på Mozilla Observatory?",
    "Hvilke OWASP topp 10 risikoer ser du i økosystemet?",
  ],
  seo: [
    "Hvordan rangerer jeg bedre for 'bookingsystem kommune'?",
    "Lag et JSON-LD-skjema for /transparens-siden.",
    "Hvilke sider bør vi optimalisere først for GEO?",
    "Skriv en bedre meta description for /bruksomrader/moterom.",
  ],
  wcag: [
    "Hva er kontrastkravet for body-tekst på paper bakgrunn?",
    "Hvilke feilkilder gir flest WCAG-issues i økosystemet?",
    "Sjekk skip-to-main implementasjonen min mot SC 2.4.1.",
    "Hvordan kvalifiserer vi for tilsyn etter UU-loven?",
  ],
  ytelse: [
    "Hva er våre største ytelsesbottlenecks?",
    "Hvordan reduserer jeg JS-bundle med 30%?",
    "Anbefal en cache-strategi for /transparens.",
    "Hva bør LCP være for å score grønt i Core Web Vitals?",
  ],
};

export default function IntelligenceAgents() {
  const { snap } = useOutletContext<IntelligenceCtx>();
  const [agents, setAgents] = useState<AgentSummary[] | null>(null);
  const [history, setHistory] = useState<Record<string, Message[]>>(() =>
    loadHistory(),
  );
  const [activeAgent, setActiveAgent] = useState<string>("triage");
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const messages = history[activeAgent] ?? [];

  const updateMessages = (next: Message[]) => {
    setHistory((prev) => {
      const updated = { ...prev, [activeAgent]: next };
      saveHistory(updated);
      return updated;
    });
  };

  const clearActive = () => {
    setHistory((prev) => {
      const updated = { ...prev };
      delete updated[activeAgent];
      saveHistory(updated);
      return updated;
    });
    setError(null);
  };

  // Fetch agent catalog from API; fall back to static list if API is down.
  useEffect(() => {
    const auth = localStorage.getItem(AUTH_KEY);
    fetch("/api/agents", {
      headers: auth ? { Authorization: `Basic ${auth}` } : {},
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = (await r.json()) as { agents: AgentSummary[] };
        setAgents(data.agents);
      })
      .catch(() =>
        setAgents(
          AGENT_FALLBACK.map(({ id, name, description }) => ({
            id,
            name,
            description,
          })),
        ),
      );
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  // Build a rich context envelope: ecosystem rollup, per-target latest
  // scores, top errors + warnings, surface inventory. Server caps at 4000 chars.
  const buildContext = (): string => {
    if (!snap) return "";
    const lines: string[] = [];

    if (snap.ecosystemSummary) {
      const s = snap.ecosystemSummary;
      lines.push(
        `# Økosystem-rollup`,
        `Aktive overflater: ${s.surfacesTotal} (${s.surfacesHealthy} sunne, ${s.surfacesWithErrors} med feil)`,
        `Snittscore: ${Math.round(s.avgScore)}/100`,
        `Feil: ${s.errorCount} · Advarsler: ${s.warnCount} · Info: ${s.infoCount}`,
        "",
      );
    }

    if (snap.targets.length > 0) {
      lines.push(`# Overflater (live)`);
      for (const t of snap.targets.filter((x) => x.is_active)) {
        const runs = (snap.latest || []).filter(
          (r) => r.target_name === t.name,
        );
        const scoreSummary =
          runs.length === 0
            ? "ingen data"
            : runs
                .map((r) => `${r.audit_type}=${Math.round(r.avg_score)}`)
                .join(" ");
        lines.push(`- ${t.name} (${t.origin}): ${scoreSummary}`);
      }
      lines.push("");
    }

    const errs = (snap.issues || [])
      .filter((i) => i.severity === "error")
      .slice(0, 8);
    if (errs.length > 0) {
      lines.push(`# Topp errors (${errs.length})`);
      for (const e of errs) {
        lines.push(
          `- [${e.surface}/${e.auditType}/${e.rule}] ${e.message} (${e.affected} berørte)`,
        );
      }
      lines.push("");
    }

    const warns = (snap.issues || [])
      .filter((i) => i.severity === "warn")
      .slice(0, 5);
    if (warns.length > 0) {
      lines.push(`# Topp warnings (${warns.length})`);
      for (const w of warns) {
        lines.push(
          `- [${w.surface}/${w.auditType}/${w.rule}] ${w.message} (${w.affected} berørte)`,
        );
      }
    }

    return lines.join("\n");
  };

  const send = async () => {
    const text = input.trim();
    if (!text || pending) return;
    setInput("");
    setError(null);
    const next: Message[] = [...messages, { role: "user", content: text }];
    updateMessages(next);
    setPending(true);
    try {
      const auth = localStorage.getItem(AUTH_KEY);
      const res = await fetch("/api/agents/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(auth ? { Authorization: `Basic ${auth}` } : {}),
        },
        body: JSON.stringify({
          agent: activeAgent,
          messages: next.map(({ role, content }) => ({ role, content })),
          context: buildContext(),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as {
        text: string;
        model?: string;
        thinking?: string | null;
        toolTrace?: ToolTraceItem[];
      };
      updateMessages([
        ...next,
        {
          role: "assistant",
          content: data.text,
          model: data.model,
          thinking: data.thinking ?? null,
          toolTrace: data.toolTrace ?? [],
        },
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setPending(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  const activeMeta =
    agents?.find((a) => a.id === activeAgent) ??
    AGENT_FALLBACK.find((a) => a.id === activeAgent);

  const switchAgent = (id: string) => {
    if (id === activeAgent) return;
    setActiveAgent(id);
    setError(null);
  };

  return (
    <div>
      <header className="mb-10">
        <p className="editorial-mono-caption text-accent-text mb-2">
          MULTI-AGENT
        </p>
        <h2
          className="font-serif text-4xl lg:text-5xl xl:text-6xl text-ink leading-[1.04]"
          style={{ fontVariationSettings: '"opsz" 96, "wght" 480' }}
        >
          AI-agenter
        </h2>
        <p className="text-base text-ink mt-3 max-w-prose leading-relaxed">
          Spesialiserte AI-agenter med dyp domenekunnskap. Hver agent har
          egen systemprompt og kontekst. Velg en agent som matcher
          problemstillingen din. Skift agent for å nullstille samtalen.
        </p>
      </header>
      <div className="grid lg:grid-cols-[280px_1fr] gap-px bg-rule border border-rule min-h-[70vh]">
      {/* Agent list */}
      <aside className="bg-paper p-5">
        <header className="mb-4">
          <p className="editorial-mono-caption text-accent-text flex items-center gap-1.5">
            <Bot className="h-3.5 w-3.5" /> AGENTER
          </p>
          <h2 className="font-serif text-2xl text-ink mt-1 leading-tight">
            Spesialister
          </h2>
        </header>
        <ul className="space-y-2">
          {(agents ?? AGENT_FALLBACK).map((a) => {
            const Icon = ICONS[a.id] ?? Code2;
            const isActive = a.id === activeAgent;
            const isExpert =
              "tier" in a && (a as AgentSummary).tier === "expert";
            const msgCount = history[a.id]?.length ?? 0;
            return (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => switchAgent(a.id)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-sm border transition-colors",
                    isActive
                      ? "border-navy bg-navy/5"
                      : "border-hairline hover:bg-paper-deep/60",
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        isActive ? "text-navy" : "text-ink-soft",
                      )}
                    />
                    <span
                      className={cn(
                        "font-serif text-base font-medium flex-1",
                        isActive ? "text-navy" : "text-ink",
                      )}
                    >
                      {a.name}
                    </span>
                    {isExpert && (
                      <span className="font-mono text-[0.5rem] uppercase tracking-widest bg-navy text-on-navy rounded-sm px-1.5 py-0.5 leading-none">
                        EKSPERT
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-soft leading-snug">
                    {a.description}
                  </p>
                  {msgCount > 0 && (
                    <p className="font-mono text-[0.55rem] uppercase tracking-widest text-accent-text mt-1.5">
                      {Math.ceil(msgCount / 2)} samtale
                      {Math.ceil(msgCount / 2) === 1 ? "" : "r"}
                    </p>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint mt-6">
          Samtaler lagres lokalt per agent, tilgjengelig neste gang du
          besøker.
        </p>
      </aside>

      {/* Chat */}
      <section className="bg-paper flex flex-col">
        <header className="px-6 py-4 border-b border-rule flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="editorial-mono-caption text-accent-text">SAMTALE</p>
            <h3 className="font-serif text-xl text-ink mt-0.5">
              {activeMeta?.name || activeAgent}
            </h3>
            <p className="text-xs text-ink-soft truncate">
              {activeMeta?.description}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {snap?.ecosystemSummary && (
              <div className="hidden md:block text-right">
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint">
                  Kontekst
                </p>
                <p className="text-xs text-ink-soft">
                  {snap.ecosystemSummary.errorCount} errors ·{" "}
                  {snap.ecosystemSummary.warnCount} warns
                </p>
              </div>
            )}
            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearActive}
                className="inline-flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-widest text-ink hover:bg-paper-deep border border-hairline rounded-sm px-2.5 py-1.5 transition-colors"
                title="Nullstill denne samtalen"
              >
                Tøm samtale
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 lg:px-8 py-6 space-y-4 min-h-[40vh] max-h-[64vh]">
          {messages.length === 0 ? (
            <div className="py-10">
              <p className="editorial-mono-caption text-accent-text mb-3">
                START SAMTALE
              </p>
              <h4
                className="font-serif text-3xl lg:text-4xl text-ink leading-tight mb-3 max-w-prose"
                style={{ fontVariationSettings: '"opsz" 72, "wght" 480' }}
              >
                Hva trenger du hjelp med?
              </h4>
              <p className="text-base text-ink max-w-prose leading-relaxed mb-8">
                Spør om et funn, en compliance-vurdering eller en fiks-strategi.{" "}
                {activeMeta?.name} har tilgang til dagens skanning som kontekst.
              </p>

              <div className="border-t border-rule pt-6">
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint mb-3">
                  EKSEMPELSPØRSMÅL
                </p>
                <div className="grid sm:grid-cols-2 gap-px bg-rule border border-rule">
                  {(SAMPLE_PROMPTS[activeAgent] ?? SAMPLE_PROMPTS.triage).map(
                    (q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setInput(q)}
                        className="bg-paper p-4 text-left text-sm text-ink hover:bg-paper-deep/40 leading-snug"
                      >
                        <span className="font-mono text-[0.6rem] uppercase tracking-widest text-accent-text block mb-1">
                          PROMPT
                        </span>
                        {q}
                      </button>
                    ),
                  )}
                </div>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint mt-4">
                  Klikk for å fylle inn. Rediger før du sender.
                </p>
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[90%]",
                  m.role === "user" ? "ml-auto" : "mr-auto",
                )}
              >
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint mb-1">
                  {m.role === "user" ? "Du" : activeMeta?.name || "Agent"}
                </p>

                {/* Tool trace — show which tools the agent invoked */}
                {m.role === "assistant" &&
                  m.toolTrace &&
                  m.toolTrace.length > 0 && (
                    <div className="mb-2 space-y-1">
                      {m.toolTrace.map((t, ti) => (
                        <div
                          key={ti}
                          className="border-l-2 border-accent-text/60 bg-paper-deep/30 px-3 py-1.5 text-xs"
                        >
                          <div className="flex items-center gap-1.5">
                            <Wrench className="h-3 w-3 text-accent-text" />
                            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-accent-text">
                              {t.tool}
                            </span>
                            <span className="font-mono text-[0.6rem] text-ink-faint truncate">
                              {Object.entries(t.input)
                                .map(([k, v]) => `${k}=${v}`)
                                .join(" · ")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                {/* Thinking — collapsible reasoning trace */}
                {m.role === "assistant" && m.thinking && (
                  <details className="mb-2">
                    <summary className="cursor-pointer inline-flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-widest text-ink-soft hover:text-ink border border-hairline rounded-sm px-2 py-1">
                      <Brain className="h-3 w-3" />
                      Vis resonnement ({m.thinking.length.toLocaleString("nb-NO")}{" "}
                      tegn)
                    </summary>
                    <div className="mt-2 px-3 py-2 bg-paper-deep/40 border-l-2 border-navy text-xs text-ink-soft whitespace-pre-wrap leading-relaxed">
                      {m.thinking}
                    </div>
                  </details>
                )}

                <div
                  className={cn(
                    "rounded-sm px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                    m.role === "user"
                      ? "bg-navy text-on-navy"
                      : "bg-paper-deep/40 border border-rule text-ink",
                  )}
                >
                  {m.content}
                </div>
                {m.role === "assistant" && m.model && (
                  <p className="font-mono text-[0.55rem] uppercase tracking-widest text-ink-faint mt-1 px-1">
                    {m.model.includes("sonnet")
                      ? "Drevet av Claude Sonnet 4.6 · utvidet resonering"
                      : m.model.includes("haiku")
                        ? "Drevet av Claude Haiku 4.5"
                        : `Powered by ${m.model}`}
                  </p>
                )}
              </div>
            ))
          )}
          {pending && (
            <div className="flex items-center gap-2 text-ink-soft">
              <Loader2 className="h-4 w-4 animate-spin" /> Agenten skriver…
            </div>
          )}
          {error && (
            <div className="border-l-2 border-red-700 bg-paper-deep/60 px-4 py-3">
              <p className="editorial-mono-caption text-red-700 mb-1">FEIL</p>
              <p className="text-sm text-ink">{error}</p>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <footer className="border-t border-rule p-4 bg-paper">
          <div className="flex gap-2 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={`Spør ${activeMeta?.name || "agenten"}…`}
              rows={2}
              className="flex-1 border border-hairline rounded-sm px-3 py-2 text-sm bg-paper text-ink resize-none focus:outline-none focus:border-navy"
              disabled={pending}
            />
            <button
              type="button"
              onClick={() => void send()}
              disabled={pending || !input.trim()}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-sm px-4 py-2 text-xs uppercase tracking-widest font-medium h-fit",
                pending || !input.trim()
                  ? "bg-paper-deep text-ink-faint cursor-not-allowed"
                  : "bg-navy text-on-navy hover:bg-navy/90",
              )}
            >
              <Send className="h-3.5 w-3.5" />
              Send
            </button>
          </div>
          <p className="text-[0.65rem] text-ink-faint mt-2 font-mono uppercase tracking-widest">
            Enter sender · Shift+Enter ny linje
          </p>
        </footer>
      </section>
      </div>
    </div>
  );
}
