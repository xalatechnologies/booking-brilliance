/**
 * /admin/intelligence/etterlevelse — ISO 27001:2022 + SOC 2 + GDPR
 * control registry, evidence inbox, RoPA, risk register, asset inventory.
 *
 * Reads the compliance.state.dashboard query (one round-trip) and
 * surfaces five tabs: Kontroller / Bevis / RoPA / Risiko / Aktiva.
 */
import { useMemo, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import {
  CheckCircle2,
  Circle,
  ClipboardList,
  HardDrive,
  Loader2,
  Plus,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { adminToken } from "./intelligence-shared";
import { cn } from "@/lib/utils";

type Tab = "controls" | "evidence" | "ropa" | "risks" | "assets";

const FRAMEWORK_LABEL: Record<string, string> = {
  iso27001: "ISO 27001:2022",
  soc2: "SOC 2",
  gdpr: "GDPR",
};

const STATUS_LABEL: Record<string, string> = {
  implemented: "Implementert",
  partial: "Delvis",
  missing: "Mangler",
  not_applicable: "Ikke-aktuell",
  planned: "Planlagt",
};

const STATUS_TONE: Record<string, string> = {
  implemented: "bg-green-50 text-green-700 border-green-700/40",
  partial: "bg-amber-50 text-amber-700 border-amber-700/40",
  missing: "bg-red-50 text-red-700 border-red-700/40",
  not_applicable: "bg-paper-deep text-ink-faint border-hairline",
  planned: "bg-paper text-ink-soft border-hairline",
};

const EVIDENCE_STATUS_TONE: Record<string, string> = {
  pass: "text-green-700",
  warn: "text-amber-700",
  fail: "text-red-700",
  info: "text-ink-soft",
};

export default function IntelligenceCompliance() {
  const token = adminToken();
  const data = useQuery(
    api.compliance.state.dashboard,
    token ? { adminToken: token } : "skip",
  );

  const runCollectors = useAction(api.compliance.collectors.collectAll);
  const seedAll = useMutation(api.compliance.seed.upsertAll);
  const updateStatus = useMutation(api.compliance.mutations.updateControlStatus);

  const [tab, setTab] = useState<Tab>("controls");
  const [framework, setFramework] = useState<string>("iso27001");
  const [running, setRunning] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  if (!data) {
    return (
      <div className="px-8 xl:px-12 py-12 flex items-center gap-3 text-ink-faint">
        <Loader2 className="h-4 w-4 animate-spin" />
        Henter etterlevelsesdata …
      </div>
    );
  }

  const visibleControls = data.controls
    .filter((c) => c.framework === framework)
    .filter((c) => filterStatus === "all" || c.status === filterStatus);

  const themeGroups = useMemo(() => {
    const map = new Map<string, typeof visibleControls>();
    for (const c of visibleControls) {
      const arr = map.get(c.theme) ?? [];
      arr.push(c);
      map.set(c.theme, arr);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [visibleControls]);

  const handleCollect = async () => {
    if (!token) return;
    setRunning(true);
    try {
      await runCollectors({ adminToken: token });
    } finally {
      setRunning(false);
    }
  };

  const handleReseed = async () => {
    if (!token) return;
    await seedAll({ adminToken: token });
  };

  const handleStatusCycle = async (id: string, current: string) => {
    if (!token) return;
    const order = ["planned", "partial", "implemented", "missing", "not_applicable"];
    const next = order[(order.indexOf(current) + 1) % order.length];
    await updateStatus({
      adminToken: token,
      id: id as unknown as Parameters<typeof updateStatus>[0]["id"],
      status: next,
    });
  };

  return (
    <div className="px-8 xl:px-12 py-8">
      <header className="mb-8">
        <p className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-faint">
          Etterlevelse
        </p>
        <h1
          className="font-serif text-[2.25rem] text-ink mt-2 leading-tight"
          style={{ fontVariationSettings: '"opsz" 48, "wght" 540' }}
        >
          Kontroller, bevis & RoPA
        </h1>
        <p className="text-sm text-ink-soft mt-2 max-w-3xl">
          Sentralisert register over alle kontroller vi opererer: ISO/IEC
          27001:2022 (Annex A, 93 kontroller), SOC 2 Common Criteria (33
          kontroller) og GDPR (12 kjerneartikler). Automatisk innsamlede
          bevis kommer fra TLS-skann, audit-funn, alarm-MTTR og oppetid.
        </p>
      </header>

      {/* Framework summary cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule mb-8">
        {data.summaries.map((s) => (
          <div key={s.framework} className="bg-paper px-5 py-4">
            <p className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-faint">
              {FRAMEWORK_LABEL[s.framework] ?? s.framework}
            </p>
            <div className="flex items-baseline gap-3 mt-2">
              <span
                className={cn(
                  "font-serif text-3xl leading-none tabular-nums",
                  s.implementation_pct >= 80
                    ? "text-green-700"
                    : s.implementation_pct >= 40
                      ? "text-amber-700"
                      : "text-red-700",
                )}
              >
                {s.implementation_pct}%
              </span>
              <span className="text-xs text-ink-soft">
                av {s.total} kontroller
              </span>
            </div>
            <div className="flex gap-3 mt-2 text-[0.7rem] font-mono uppercase tracking-widest text-ink-soft">
              <span className="text-green-700">
                {s.by_status.implemented ?? 0} impl
              </span>
              <span className="text-amber-700">
                {s.by_status.partial ?? 0} delvis
              </span>
              <span className="text-red-700">
                {s.by_status.missing ?? 0} mangler
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* Tab bar + actions */}
      <div className="flex items-center justify-between border-b border-hairline-strong mb-6">
        <div className="flex gap-1">
          {(
            [
              { id: "controls", label: "Kontroller", icon: ShieldCheck },
              { id: "evidence", label: "Bevis", icon: ClipboardList },
              { id: "ropa", label: "RoPA", icon: HardDrive },
              { id: "risks", label: "Risiko", icon: ShieldAlert },
              { id: "assets", label: "Aktiva", icon: Circle },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-3 text-sm font-mono uppercase tracking-widest border-b-2 -mb-px transition-colors",
                tab === id
                  ? "border-navy text-ink"
                  : "border-transparent text-ink-faint hover:text-ink",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReseed}
            className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-ink-soft hover:text-ink border border-hairline rounded-sm px-3 py-1.5 transition-colors"
          >
            Synk katalog
          </button>
          <button
            type="button"
            onClick={handleCollect}
            disabled={running}
            className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-on-navy bg-navy hover:bg-navy/90 rounded-sm px-3 py-1.5 transition-colors disabled:opacity-60"
          >
            {running ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            Kjør samling
          </button>
        </div>
      </div>

      {/* Tab content */}
      {tab === "controls" && (
        <ControlsTab
          themeGroups={themeGroups}
          framework={framework}
          setFramework={setFramework}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          onStatusCycle={handleStatusCycle}
        />
      )}
      {tab === "evidence" && <EvidenceTab evidence={data.evidence} />}
      {tab === "ropa" && <RoPATab ropa={data.processing_activities} />}
      {tab === "risks" && <RisksTab risks={data.risks} />}
      {tab === "assets" && <AssetsTab assets={data.assets} />}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
 * Controls tab — filterable matrix grouped by theme.
 * ────────────────────────────────────────────────────────────── */

function ControlsTab({
  themeGroups,
  framework,
  setFramework,
  filterStatus,
  setFilterStatus,
  onStatusCycle,
}: {
  themeGroups: Array<[string, any[]]>;
  framework: string;
  setFramework: (f: string) => void;
  filterStatus: string;
  setFilterStatus: (s: string) => void;
  onStatusCycle: (id: string, status: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <span className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-faint">
          Rammeverk
        </span>
        {["iso27001", "soc2", "gdpr"].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFramework(f)}
            className={cn(
              "font-mono text-[0.65rem] uppercase tracking-widest border rounded-sm px-3 py-1.5",
              framework === f
                ? "bg-navy text-on-navy border-navy"
                : "text-ink-soft border-hairline hover:text-ink",
            )}
          >
            {FRAMEWORK_LABEL[f]}
          </button>
        ))}
        <span className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-faint ml-4">
          Filter
        </span>
        {["all", "implemented", "partial", "missing", "planned"].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilterStatus(s)}
            className={cn(
              "font-mono text-[0.6rem] uppercase tracking-widest border rounded-sm px-2 py-1",
              filterStatus === s
                ? "bg-ink text-paper border-ink"
                : "text-ink-soft border-hairline hover:text-ink",
            )}
          >
            {s === "all" ? "Alle" : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      {themeGroups.length === 0 && (
        <p className="text-sm text-ink-faint py-8">
          Ingen kontroller matcher filtre.
        </p>
      )}

      {themeGroups.map(([theme, controls]) => (
        <section key={theme} className="mb-8">
          <h2 className="font-mono text-[0.7rem] uppercase tracking-widest text-ink-faint mb-3">
            {theme} · {controls.length} kontroller
          </h2>
          <div className="border border-hairline">
            {controls.map((c) => (
              <div
                key={c._id}
                className="grid grid-cols-[100px_1fr_120px_140px] gap-4 px-4 py-3 border-b border-hairline last:border-b-0 hover:bg-paper-deep/40"
              >
                <span className="font-mono text-xs text-ink-faint mt-0.5">
                  {c.ref}
                </span>
                <div>
                  <p className="text-sm text-ink font-medium">{c.title}</p>
                  <p className="text-xs text-ink-soft mt-1">{c.description}</p>
                  {c.automation_signal && (
                    <p className="font-mono text-[0.6rem] uppercase tracking-widest text-blue-700 mt-1">
                      auto: {c.automation_signal}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-faint">
                    Bevis
                  </span>
                  <p
                    className={cn(
                      "font-serif text-lg tabular-nums",
                      c.evidence_count > 0 ? "text-ink" : "text-ink-faint",
                    )}
                  >
                    {c.evidence_count}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onStatusCycle(c._id, c.status)}
                  className={cn(
                    "self-start inline-flex items-center gap-1 font-mono text-[0.65rem] uppercase tracking-widest border rounded-sm px-2 py-1 transition-colors",
                    STATUS_TONE[c.status] ?? "border-hairline",
                  )}
                  title="Klikk for å syklere status"
                >
                  {c.status === "implemented" && (
                    <CheckCircle2 className="h-3 w-3" />
                  )}
                  {STATUS_LABEL[c.status] ?? c.status}
                </button>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
 * Evidence tab — chronological feed.
 * ────────────────────────────────────────────────────────────── */

function EvidenceTab({ evidence }: { evidence: any[] }) {
  if (evidence.length === 0) {
    return (
      <p className="text-sm text-ink-faint py-8">
        Ingen bevis registrert ennå. Klikk «Kjør samling» øverst for å
        utløse automatisk innsamling, eller legg til manuelt fra
        kontroll-matrisen.
      </p>
    );
  }

  return (
    <ul className="border border-hairline">
      {evidence.slice(0, 100).map((e) => (
        <li
          key={e._id}
          className="grid grid-cols-[120px_1fr_140px_160px] gap-4 px-4 py-3 border-b border-hairline last:border-b-0"
        >
          <span className="font-mono text-xs text-ink-faint">
            {e.control_ref}
          </span>
          <div>
            <p className="text-sm text-ink">{e.title}</p>
            <p className="text-xs text-ink-soft mt-1">{e.summary}</p>
            {e.link && (
              <a
                href={e.link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[0.65rem] uppercase tracking-widest text-blue-700 mt-1 inline-block"
              >
                Åpne lenke →
              </a>
            )}
          </div>
          <span
            className={cn(
              "font-mono text-[0.65rem] uppercase tracking-widest self-start",
              EVIDENCE_STATUS_TONE[e.status] ?? "text-ink-soft",
            )}
          >
            {e.status.toUpperCase()} · {e.source}
          </span>
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-faint self-start">
            {new Date(e.collected_at).toLocaleString("nb-NO", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ──────────────────────────────────────────────────────────────
 * RoPA tab — GDPR Art. 30 records.
 * ────────────────────────────────────────────────────────────── */

function RoPATab({ ropa }: { ropa: any[] }) {
  const upsert = useMutation(api.compliance.mutations.upsertProcessingActivity);
  const del = useMutation(api.compliance.mutations.deleteProcessingActivity);
  const [form, setForm] = useState({
    name: "",
    purpose: "",
    lawful_basis: "contract",
    retention_period: "12 måneder",
    controller: "Xala Technologies AS",
    security_measures: "TLS, kryptering at-rest, RBAC, MFA, hendelseslogging.",
  });
  const token = adminToken();

  if (ropa.length === 0) {
    return (
      <div>
        <p className="text-sm text-ink-soft mb-6 max-w-2xl">
          Ingen behandlingsaktiviteter registrert. GDPR art. 30 krever
          skriftlig protokoll over hver behandling. Legg til de vanligste
          aktivitetene under for å komme i gang.
        </p>
        <button
          type="button"
          onClick={async () => {
            if (!token) return;
            // Seed three core activities Digilist actually performs
            const seeds = [
              {
                name: "Kundekontoer og innlogging",
                purpose: "Identifisere kunder og levere bestillingstjenester.",
                lawful_basis: "contract",
                retention_period: "Så lenge kundeforhold består + 3 år.",
              },
              {
                name: "Markedsføringsanalyser",
                purpose: "Forstå bruk av digilist.no og forbedre opplevelsen.",
                lawful_basis: "legitimate_interest",
                retention_period: "26 måneder.",
              },
              {
                name: "Driftsstatistikk (RUM)",
                purpose: "Sikre yteevne og oppdage forringelse for sluttbrukere.",
                lawful_basis: "legitimate_interest",
                retention_period: "13 måneder.",
              },
            ];
            for (const s of seeds) {
              await upsert({
                adminToken: token,
                name: s.name,
                purpose: s.purpose,
                lawful_basis: s.lawful_basis,
                data_categories_json: JSON.stringify([
                  "Identifikasjon",
                  "Kontakt",
                  "Bruksdata",
                ]),
                data_subject_categories_json: JSON.stringify([
                  "Kunder",
                  "Besøkende",
                ]),
                recipients_json: JSON.stringify([
                  "Convex (USA/EU)",
                  "Resend (EU)",
                  "Hostinger (EU)",
                ]),
                transfers_outside_eea_json: JSON.stringify([]),
                retention_period: s.retention_period,
                security_measures:
                  "TLS, kryptering at-rest, RBAC, MFA, hendelseslogging.",
                controller: "Xala Technologies AS",
                dpia_required: false,
              });
            }
          }}
          className="inline-flex items-center gap-2 bg-navy text-on-navy rounded-sm px-4 py-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          Seed kjerneaktiviteter
        </button>
      </div>
    );
  }

  return (
    <div className="border border-hairline">
      <div className="grid grid-cols-[1fr_1fr_120px_140px_40px] gap-4 px-4 py-2 bg-paper-deep/40 font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint">
        <span>Aktivitet</span>
        <span>Formål</span>
        <span>Lovlig grunnlag</span>
        <span>Lagring</span>
        <span />
      </div>
      {ropa.map((p) => (
        <div
          key={p._id}
          className="grid grid-cols-[1fr_1fr_120px_140px_40px] gap-4 px-4 py-3 border-t border-hairline items-start"
        >
          <span className="text-sm text-ink">{p.name}</span>
          <span className="text-xs text-ink-soft">{p.purpose}</span>
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-soft">
            {p.lawful_basis}
          </span>
          <span className="text-xs text-ink-soft">{p.retention_period}</span>
          <button
            type="button"
            onClick={async () => {
              if (!token) return;
              await del({ adminToken: token, id: p._id });
            }}
            className="text-ink-faint hover:text-red-700"
            aria-label="Slett aktivitet"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
 * Risks tab — placeholder with seed action.
 * ────────────────────────────────────────────────────────────── */

function RisksTab({ risks }: { risks: any[] }) {
  if (risks.length === 0) {
    return (
      <p className="text-sm text-ink-faint py-8">
        Risikoregister er tomt. ISO 27001 klausul 6.1.2 krever en
        dokumentert risikovurdering. Legg inn de viktigste risikoene
        her med sannsynlighet × konsekvens.
      </p>
    );
  }
  return (
    <ul className="border border-hairline">
      {risks.map((r) => (
        <li
          key={r._id}
          className="grid grid-cols-[1fr_100px_100px_100px] gap-4 px-4 py-3 border-b border-hairline last:border-b-0"
        >
          <div>
            <p className="text-sm text-ink">{r.title}</p>
            <p className="text-xs text-ink-soft mt-1">{r.description}</p>
          </div>
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-soft">
            {r.category}
          </span>
          <span className="font-serif text-lg tabular-nums text-ink">
            {r.inherent_score}
          </span>
          <span className="font-mono text-[0.65rem] uppercase tracking-widest">
            {r.status}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ──────────────────────────────────────────────────────────────
 * Assets tab — inventory.
 * ────────────────────────────────────────────────────────────── */

function AssetsTab({ assets }: { assets: any[] }) {
  if (assets.length === 0) {
    return (
      <p className="text-sm text-ink-faint py-8">
        Aktivainventar er tomt. ISO 27001 A.5.9 krever inventar over
        informasjonsaktiva. Legg inn domener, tjenester og databehandlere.
      </p>
    );
  }
  return (
    <ul className="border border-hairline">
      {assets.map((a) => (
        <li
          key={a._id}
          className="grid grid-cols-[100px_1fr_120px_120px] gap-4 px-4 py-3 border-b border-hairline last:border-b-0"
        >
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-soft">
            {a.kind}
          </span>
          <div>
            <p className="text-sm text-ink">{a.name}</p>
            <p className="text-xs text-ink-soft mt-1">{a.description}</p>
          </div>
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-soft">
            {a.classification}
          </span>
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-soft">
            {a.location}
          </span>
        </li>
      ))}
    </ul>
  );
}
