/**
 * Security headers + exposed-file audit. Lightweight — no Playwright, no
 * pentest. Each target gets one HEAD against the origin and a small list of
 * sensitive-path probes; per-page checks scan a sample of HTML pages for
 * mixed content + exposed source maps.
 */

import type { Target } from "../targets";
import type { AuditFinding, AuditResult, Severity } from "../types";
import { SEVERITY_WEIGHT } from "../types";
import { Fetcher } from "../fetcher";
import { discoverUrls } from "../discover";

// Required security headers — present + the basic policy values
const REQUIRED_HEADERS: Array<{
  header: string;
  severity: Severity;
  reason: string;
  validate?: (value: string) => string | null;
}> = [
  {
    header: "strict-transport-security",
    severity: "error",
    reason: "HSTS missing — TLS downgrade attack surface",
    validate: (v) => {
      const m = v.match(/max-age=(\d+)/i);
      if (!m) return "missing max-age";
      const n = Number(m[1]);
      if (n < 15552000) return `max-age=${n} (recommend ≥15552000 / 180d)`;
      return null;
    },
  },
  {
    header: "content-security-policy",
    severity: "warn",
    reason: "CSP missing — no in-browser policy guard",
  },
  {
    header: "x-frame-options",
    severity: "warn",
    reason: "X-Frame-Options missing — clickjacking risk",
  },
  {
    header: "x-content-type-options",
    severity: "warn",
    reason: "X-Content-Type-Options missing (nosniff)",
  },
  {
    header: "referrer-policy",
    severity: "warn",
    reason: "Referrer-Policy missing — referrer leakage risk",
  },
  {
    header: "permissions-policy",
    severity: "info",
    reason: "Permissions-Policy missing (formerly Feature-Policy)",
  },
];

// Files we never want to find publicly
const SENSITIVE_PROBES = [
  "/.env",
  "/.git/HEAD",
  "/.git/config",
  "/.DS_Store",
  "/config.json",
  "/wp-config.php",
];

/**
 * True when a 200 response is really a single-page-app's index.html
 * catch-all rather than the probed file. SPA hosts return 200 + text/html
 * for unknown paths, so /.env, /.git/HEAD etc. appear to "exist" with an
 * HTML body. None of the sensitive probes are legitimately served as HTML,
 * so an HTML content-type — or an HTML-document body — means "not exposed".
 */
function isSpaFallback(probe: { contentType: string | null; html: string }): boolean {
  const ct = (probe.contentType ?? "").toLowerCase();
  if (ct.includes("text/html")) return true;
  const head = probe.html.trimStart().slice(0, 120).toLowerCase();
  return head.startsWith("<!doctype html") || head.startsWith("<html");
}

export async function runSecurityAudit(target: Target): Promise<AuditResult> {
  const fetcher = new Fetcher();
  const findings: AuditFinding[] = [];
  const pages: AuditResult["pages"] = [];

  // ── 1. HEADER + TLS check on the origin (single GET against /)
  const root = await fetcher.fetch(target.origin, "GET");
  const headerFindings = evaluateHeaders(root.headers, root.url);
  findings.push(...headerFindings);

  if (!target.origin.startsWith("https://")) {
    findings.push({
      url: target.origin,
      rule: "security.https",
      severity: "error",
      message: "Target origin is not HTTPS",
    });
  }

  // ── 2. Sensitive-file probes
  //
  // A 200 alone is NOT an exposure. Single-page-app surfaces serve their
  // index.html catch-all (200 + text/html) for ANY unknown path — including
  // /.env — so this used to raise a false "exposed file" ERROR on every scan
  // of the SPA surfaces. Only flag a probe when the 200 body is actually the
  // sensitive file, not the SPA fallback: none of these artefacts are ever
  // legitimately served as HTML.
  for (const path of SENSITIVE_PROBES) {
    const probe = await fetcher.fetch(target.origin + path, "GET");
    if (probe.status !== 200) continue;
    if (isSpaFallback(probe)) continue;
    findings.push({
      url: probe.url,
      rule: "security.exposed-file",
      severity: "error",
      message: `Sensitive path returns 200 with a non-HTML body: ${path}`,
    });
  }

  // ── 3. Mixed content + source maps on a sample of HTML pages
  const urls = await discoverUrls(target.origin, target.seeds);
  const seen = new Set<string>();
  for (const url of urls.slice(0, 40)) {
    const fp = await fetcher.fetch(url);
    if (!fp.contentType?.includes("text/html")) continue;
    if (fp.status !== 200) continue;
    if (seen.has(fp.url)) continue;
    seen.add(fp.url);
    const pf = scanPage(fp.html, fp.url, target.origin);
    findings.push(...pf);
    pages.push({
      url: fp.url,
      score: scoreFindings(pf),
      metrics: { findings: pf.length },
    });
  }

  // Origin-level findings show up on the origin page so dashboard groups them.
  // Only push if we haven't already scanned that URL above.
  const originUrl = root.url || target.origin;
  if (!seen.has(originUrl)) {
    pages.push({
      url: originUrl,
      score: scoreFindings(headerFindings),
      metrics: { headers: Object.keys(root.headers).length },
    });
  }

  return { auditType: "security", pages, findings };
}

function scoreFindings(findings: AuditFinding[]): number {
  const penalty = findings.reduce(
    (s, f) => s + SEVERITY_WEIGHT[f.severity],
    0,
  );
  return Math.max(0, 100 - penalty);
}

function evaluateHeaders(
  headers: Record<string, string>,
  url: string,
): AuditFinding[] {
  const out: AuditFinding[] = [];
  for (const rule of REQUIRED_HEADERS) {
    const value = headers[rule.header];
    if (!value) {
      out.push({
        url,
        rule: `security.header.${rule.header}`,
        severity: rule.severity,
        message: rule.reason,
      });
      continue;
    }
    if (rule.validate) {
      const problem = rule.validate(value);
      if (problem) {
        out.push({
          url,
          rule: `security.header.${rule.header}.weak`,
          severity: rule.severity,
          message: `${rule.header}: ${problem}`,
        });
      }
    }
  }
  return out;
}

function scanPage(
  html: string,
  pageUrl: string,
  origin: string,
): AuditFinding[] {
  const out: AuditFinding[] = [];

  // Mixed content (http:// resources on an https page)
  if (origin.startsWith("https://")) {
    const mixed = [
      ...html.matchAll(
        /\b(?:src|href|action)\s*=\s*["'](http:\/\/[^"']+)["']/gi,
      ),
    ];
    if (mixed.length > 0) {
      out.push({
        url: pageUrl,
        rule: "security.mixed-content",
        severity: "warn",
        message: `${mixed.length} http:// resource(s) on https page`,
      });
    }
  }

  // Exposed source maps — sourceMappingURL comment that points to a .map URL
  const mapMatches = [
    ...html.matchAll(/sourceMappingURL\s*=\s*([^\s"'>]+\.map)/gi),
  ];
  if (mapMatches.length > 0) {
    out.push({
      url: pageUrl,
      rule: "security.source-map",
      severity: "info",
      message: `Inline reference to .map files (${mapMatches.length}) — verify map files are 404 in prod`,
    });
  }

  return out;
}
