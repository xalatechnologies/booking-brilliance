/**
 * Smaller pages for the intelligence dashboard:
 *  - Scans (run history)
 *  - Surfaces (domain inventory editor — read-only, today)
 *  - Settings (env config, basic-auth credential management)
 *  - TransparensPreview (preview of the public /transparens page)
 */
import { useOutletContext } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AUDIT_LABEL,
  AUTH_KEY,
  ENV_LABEL,
  SURFACE_LABEL,
  type IntelligenceCtx,
  scoreClass,
} from "./intelligence-shared";

const HEADING_STYLE = '"opsz" 96, "wght" 480';

function PageHeader({
  caption,
  title,
  description,
}: {
  caption: string;
  title: string;
  description: React.ReactNode;
}) {
  return (
    <header className="mb-10">
      <p className="editorial-mono-caption text-accent-text mb-2">{caption}</p>
      <h2
        className="font-serif text-4xl lg:text-5xl xl:text-6xl text-ink leading-[1.04]"
        style={{ fontVariationSettings: HEADING_STYLE }}
      >
        {title}
      </h2>
      <p className="text-base text-ink mt-3 max-w-prose leading-relaxed">
        {description}
      </p>
    </header>
  );
}

export function IntelligenceScans() {
  const { snap } = useOutletContext<IntelligenceCtx>();
  if (!snap) {
    return (
      <div className="flex items-center gap-2 text-ink-soft">
        <Loader2 className="h-4 w-4 animate-spin" /> Henter…
      </div>
    );
  }
  return (
    <div>
      <PageHeader
        caption="HISTORIKK"
        title="Skanninger"
        description={`De ${snap.recent.length} siste skanningene på tvers av kategorier og overflater, sortert kronologisk.`}
      />
      <div className="border border-rule rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-paper-deep/40">
            <tr>
              <th className="text-left px-4 py-3 editorial-mono-caption text-ink">
                Mål
              </th>
              <th className="text-left px-4 py-3 editorial-mono-caption text-ink">
                Type
              </th>
              <th className="text-left px-4 py-3 editorial-mono-caption text-ink">
                Trigger
              </th>
              <th className="text-left px-4 py-3 editorial-mono-caption text-ink">
                Startet
              </th>
              <th className="text-right px-4 py-3 editorial-mono-caption text-ink">
                Sider
              </th>
              <th className="text-right px-4 py-3 editorial-mono-caption text-ink">
                Funn
              </th>
              <th className="text-right px-4 py-3 editorial-mono-caption text-ink">
                Score
              </th>
              <th className="text-left px-4 py-3 editorial-mono-caption text-ink">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {snap.recent.map((r) => (
              <tr
                key={r.id}
                className="border-t border-rule hover:bg-paper-deep/40"
              >
                <td className="px-4 py-3 font-mono text-xs text-ink">
                  {r.target_name}
                </td>
                <td className="px-4 py-3 text-ink">
                  {AUDIT_LABEL[r.audit_type]}
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-[0.6rem] uppercase tracking-widest border border-hairline rounded-sm px-1.5 py-0.5 text-ink">
                    {r.trigger}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-[0.65rem] text-ink-soft">
                  {new Date(r.started_at).toLocaleString("nb-NO", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </td>
                <td className="px-4 py-3 text-right font-mono text-xs text-ink tabular-nums">
                  {r.pages_scanned}
                </td>
                <td
                  className={cn(
                    "px-4 py-3 text-right font-mono text-xs tabular-nums",
                    r.findings_total === 0 ? "text-ink-faint" : "text-ink",
                  )}
                >
                  {r.findings_total}
                </td>
                <td
                  className={cn(
                    "px-4 py-3 text-right font-serif text-xl font-medium tabular-nums",
                    scoreClass(r.avg_score),
                  )}
                >
                  {Math.round(r.avg_score)}
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  {r.status === "ok" ? (
                    <span className="text-green-700 inline-flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> ok
                    </span>
                  ) : r.status === "error" ? (
                    <span className="text-red-700 inline-flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" /> error
                    </span>
                  ) : (
                    <span className="text-ink-faint">{r.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function IntelligenceSurfaces() {
  const { snap } = useOutletContext<IntelligenceCtx>();
  if (!snap) {
    return (
      <div className="flex items-center gap-2 text-ink-soft">
        <Loader2 className="h-4 w-4 animate-spin" /> Henter…
      </div>
    );
  }
  return (
    <div>
      <PageHeader
        caption="DOMAIN-INVENTAR"
        title="Overflater"
        description={
          <>
            Hver Digilist-overflate, dens type, miljø, og hvilke audits som er
            aktivert. Redigeres i{" "}
            <code className="font-mono text-xs bg-paper-deep px-1.5 py-0.5 rounded-sm">
              tools/site-intelligence/src/targets.ts
            </code>
            . UI-redigering kommer i en senere fase.
          </>
        }
      />
      <div className="border border-rule rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-paper-deep/40">
            <tr>
              <th className="text-left px-4 py-3 editorial-mono-caption text-ink">
                Navn
              </th>
              <th className="text-left px-4 py-3 editorial-mono-caption text-ink">
                Type
              </th>
              <th className="text-left px-4 py-3 editorial-mono-caption text-ink">
                Miljø
              </th>
              <th className="text-left px-4 py-3 editorial-mono-caption text-ink">
                Origin
              </th>
              <th className="text-left px-4 py-3 editorial-mono-caption text-ink">
                Audits
              </th>
              <th className="text-left px-4 py-3 editorial-mono-caption text-ink">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {snap.targets.map((t) => (
              <tr
                key={t.name}
                className="border-t border-rule hover:bg-paper-deep/40"
              >
                <td className="px-4 py-3">
                  <div className="font-mono text-xs text-ink font-medium">
                    {t.name}
                  </div>
                  <div className="text-xs text-ink-soft mt-0.5">{t.label}</div>
                </td>
                <td className="px-4 py-3 text-ink">
                  {t.type ? SURFACE_LABEL[t.type] : "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "font-mono text-[0.6rem] tracking-widest uppercase border rounded-sm px-1.5 py-0.5",
                      t.environment === "production"
                        ? "border-green-700 text-green-700"
                        : t.environment === "staging"
                          ? "border-amber-700 text-amber-700"
                          : "border-hairline text-ink-faint",
                    )}
                  >
                    {t.environment ? ENV_LABEL[t.environment] : "?"}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  <a
                    href={t.origin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-text hover:underline inline-flex items-center gap-1"
                  >
                    {t.origin.replace("https://", "")}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </td>
                <td className="px-4 py-3 font-mono text-[0.6rem] uppercase tracking-widest text-ink">
                  <div className="flex flex-wrap gap-1">
                    {t.checks.map((c) => (
                      <span
                        key={c}
                        className="border border-hairline rounded-sm px-1.5 py-0.5"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "font-mono text-[0.6rem] tracking-widest uppercase inline-flex items-center gap-1",
                      t.is_active ? "text-green-700" : "text-ink-faint",
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        t.is_active ? "bg-green-700" : "bg-ink-faint",
                      )}
                    />
                    {t.is_active ? "AKTIV" : "INAKTIV"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function IntelligenceSettings() {
  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    window.location.reload();
  };
  return (
    <div>
      <PageHeader
        caption="KONFIGURASJON"
        title="Innstillinger"
        description="Konfigurasjon av Intelligence Center. RBAC + audit-logg kommer i en senere fase. I dag bruker vi basic-auth."
      />

      <div className="grid lg:grid-cols-2 gap-px bg-rule border border-rule">
        <section className="bg-paper p-7">
          <p className="editorial-mono-caption text-accent-text mb-2">SESJON</p>
          <h3 className="font-serif text-2xl text-ink mb-3">Innlogging</h3>
          <p className="text-base text-ink mb-5 leading-relaxed">
            Tilgang er beskyttet av basic-auth, satt i{" "}
            <code className="font-mono text-xs bg-paper-deep px-1.5 py-0.5 rounded-sm">
              /etc/digilist-api.env
            </code>{" "}
            på VPS-en. Logger du ut må du logge inn på nytt for å se data.
          </p>
          <button
            type="button"
            onClick={logout}
            className="rounded-sm border border-hairline-strong px-4 py-2 text-xs uppercase tracking-widest font-mono hover:bg-paper-deep"
          >
            Logg ut
          </button>
        </section>

        <section className="bg-paper p-7">
          <p className="editorial-mono-caption text-accent-text mb-2">
            PLANLAGTE SKANNINGER
          </p>
          <h3 className="font-serif text-2xl text-ink mb-3">Cron</h3>
          <dl className="text-sm space-y-2 mb-4">
            <div className="flex justify-between border-b border-rule pb-2">
              <dt className="text-ink">Oppetid + SSL</dt>
              <dd className="font-mono text-xs text-ink">hver 15. min</dd>
            </div>
            <div className="flex justify-between border-b border-rule pb-2">
              <dt className="text-ink">Full skanning</dt>
              <dd className="font-mono text-xs text-ink">daglig 03:15 UTC</dd>
            </div>
          </dl>
          <p className="text-xs text-ink-faint font-mono uppercase tracking-widest leading-relaxed">
            systemd-timer · digilist-audit-uptime.timer +
            digilist-audit-full.timer
          </p>
        </section>

        <section className="bg-paper p-7 lg:col-span-2">
          <p className="editorial-mono-caption text-accent-text mb-2">
            ENDPOINTS
          </p>
          <h3 className="font-serif text-2xl text-ink mb-4">API</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 text-sm font-mono text-xs">
            {[
              ["GET /api/audits/state", "snapshot (auth)"],
              ["POST /api/audits/run", "trigger scan (auth)"],
              ["POST /api/audits/recommend", "AI fix-anbefaling (auth)"],
              ["POST /api/agents/chat", "specialist chat (auth)"],
              ["GET /api/agents", "agent-katalog (auth)"],
              ["GET /api/audits/public-summary", "public scores (no auth)"],
            ].map(([endpoint, hint]) => (
              <div key={endpoint} className="border-l-2 border-hairline pl-3">
                <code className="text-ink block">{endpoint}</code>
                <span className="text-[0.65rem] text-ink-faint uppercase tracking-widest">
                  {hint}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export function IntelligenceTransparensPreview() {
  return (
    <div>
      <PageHeader
        caption="OFFENTLIG FORHÅNDSVISNING"
        title="Offentlig rapport"
        description={
          <>
            Forhåndsvisning av den offentlige transparens-siden på{" "}
            <code className="font-mono text-xs bg-paper-deep px-1.5 py-0.5 rounded-sm">
              /transparens
            </code>
            . Den viser rolled-up scores per overflate uten finnings-detaljer
            eller URLs, trygg å dele med kommune-CIOer.
          </>
        }
      />
      <div className="flex items-center gap-3 mb-4">
        <a
          href="/transparens"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1.5 rounded-sm bg-navy text-on-navy px-3 py-1.5 text-[0.65rem] uppercase tracking-widest font-medium hover:bg-navy/90"
        >
          Åpne i ny fane
          <ExternalLink className="h-3 w-3" />
        </a>
        <p className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-faint">
          Live, no-auth, scrubbed
        </p>
      </div>
      <iframe
        src="/transparens"
        title="Offentlig rapport"
        className="w-full h-[80vh] border border-rule rounded-sm bg-paper"
      />
      <p className="text-sm text-ink mt-3 max-w-prose leading-relaxed">
        Sender du denne lenken til en kommune-CIO er den åpen. Ingen
        innlogging kreves. Hvis du vil endre hva som vises, rediger{" "}
        <code className="font-mono text-xs bg-paper-deep px-1.5 py-0.5 rounded-sm">
          src/pages/Transparens.tsx
        </code>
        .
      </p>
    </div>
  );
}
