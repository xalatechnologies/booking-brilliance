/**
 * Uptime + SSL auditor. Cheap, runs against every surface — no Playwright,
 * no Lighthouse, no Docker. Three signals:
 *
 *   1. Reachability — single GET against origin/. Non-2xx/3xx → error.
 *   2. Response time — TTFB-ish via Fetcher timing. >2s → warn, >5s → error.
 *   3. TLS cert expiry — tls.connect handshake → notBefore/notAfter.
 *      <14 days = error, <25 days = warn (certbot renews at 30d, so <25d
 *      means renewal is overdue — a real signal, not fresh-cert noise).
 *
 * One AuditResult page per target (the origin). Findings get rolled up
 * into the dashboard "What Went Wrong" panel by severity.
 */

import tls from "node:tls";
import type { Target } from "../targets";
import type { AuditFinding, AuditResult, Severity } from "../types";
import { SEVERITY_WEIGHT } from "../types";
import { Fetcher } from "../fetcher";

interface CertSummary {
  validFrom: string;
  validTo: string;
  issuer: string;
  subject: string;
  daysToExpiry: number;
}

export async function runUptimeAudit(target: Target): Promise<AuditResult> {
  const fetcher = new Fetcher();
  const findings: AuditFinding[] = [];

  const t0 = Date.now();
  const root = await fetcher.fetch(target.origin, "GET");
  const elapsed = Date.now() - t0;

  // ── HTTP reachability
  if (root.status === 0) {
    findings.push({
      url: target.origin,
      rule: "uptime.unreachable",
      severity: "error",
      message: "Origin did not respond (network error / DNS failure)",
    });
  } else if (root.status >= 500) {
    findings.push({
      url: target.origin,
      rule: "uptime.5xx",
      severity: "error",
      message: `Origin returned ${root.status}`,
    });
  } else if (root.status >= 400) {
    // For auth-gated surfaces (api, app, dashboard internals), 401/403 on the
    // anonymous root probe is *expected* behavior, not an outage signal.
    const isAuthExpected =
      target.requiresAuth && (root.status === 401 || root.status === 403);
    if (!isAuthExpected) {
      findings.push({
        url: target.origin,
        rule: "uptime.4xx",
        severity: "warn",
        message: `Origin returned ${root.status}`,
      });
    }
  }

  // ── Response time
  if (elapsed > 5000) {
    findings.push({
      url: target.origin,
      rule: "uptime.slow",
      severity: "error",
      message: `Origin response time ${elapsed}ms (>5s)`,
    });
  } else if (elapsed > 2000) {
    findings.push({
      url: target.origin,
      rule: "uptime.slow",
      severity: "warn",
      message: `Origin response time ${elapsed}ms (>2s)`,
    });
  }

  // ── HTTPS / TLS cert (only meaningful on https://)
  let cert: CertSummary | null = null;
  if (target.origin.startsWith("https://")) {
    try {
      cert = await inspectCert(target.origin);
      if (cert.daysToExpiry < 14) {
        findings.push({
          url: target.origin,
          rule: "uptime.ssl.expiry",
          severity: "error",
          message: `SSL cert expires in ${cert.daysToExpiry}d (${cert.validTo})`,
        });
      } else if (cert.daysToExpiry < 25) {
        // certbot renews at 30 days, so a healthy cert is never below ~30d
        // for long. Only warn below 25d — that means renewal is overdue
        // (likely failing), a real signal — instead of flagging every
        // freshly-issued cert during the 30–60d window (pure noise).
        findings.push({
          url: target.origin,
          rule: "uptime.ssl.expiry",
          severity: "warn",
          message: `SSL cert expires in ${cert.daysToExpiry}d (${cert.validTo})`,
        });
      }
    } catch (err) {
      findings.push({
        url: target.origin,
        rule: "uptime.ssl.handshake",
        severity: "error",
        message: `TLS handshake failed: ${String((err as Error)?.message || err)}`,
      });
    }
  } else {
    findings.push({
      url: target.origin,
      rule: "uptime.no-https",
      severity: "error",
      message: "Origin is not HTTPS",
    });
  }

  return {
    auditType: "uptime",
    pages: [
      {
        url: target.origin,
        score: scoreFindings(findings),
        metrics: {
          status: root.status,
          responseMs: elapsed,
          certExpiresInDays: cert?.daysToExpiry ?? null,
          certIssuer: cert?.issuer ?? null,
          certValidTo: cert?.validTo ?? null,
        },
      },
    ],
    findings,
  };
}

function scoreFindings(findings: AuditFinding[]): number {
  const penalty = findings.reduce(
    (s, f) => s + SEVERITY_WEIGHT[f.severity as Severity],
    0,
  );
  return Math.max(0, 100 - penalty);
}

function inspectCert(originUrl: string): Promise<CertSummary> {
  return new Promise((resolve, reject) => {
    const { hostname, port } = new URL(originUrl);
    const socket = tls.connect(
      {
        host: hostname,
        port: Number(port) || 443,
        servername: hostname,
        rejectUnauthorized: true,
      },
      () => {
        const c = socket.getPeerCertificate();
        socket.end();
        if (!c || Object.keys(c).length === 0) {
          reject(new Error("No certificate returned"));
          return;
        }
        const validTo = new Date(c.valid_to);
        const days = Math.floor(
          (validTo.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
        );
        resolve({
          validFrom: c.valid_from,
          validTo: c.valid_to,
          issuer:
            (c.issuer && (c.issuer.CN || c.issuer.O || c.issuer.OU)) || "",
          subject: (c.subject && (c.subject.CN || c.subject.O)) || "",
          daysToExpiry: days,
        });
      },
    );
    socket.on("error", reject);
    socket.setTimeout(10_000, () => {
      socket.destroy();
      reject(new Error("TLS handshake timeout"));
    });
  });
}
