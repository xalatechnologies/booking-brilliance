import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Convex schema mirroring tools/content-agent/src/db.ts and
// tools/site-intelligence/src/db.ts. Field names match the SQLite
// columns 1:1 so the migration script (scripts/migrate-sqlite-to-convex.ts)
// can copy rows verbatim and so the existing dashboard TypeScript types
// keep working unchanged.
//
// Numeric ids (INTEGER PRIMARY KEY in SQLite) become Convex string Ids,
// but we also keep the original integer in `legacyId` for the migration
// window so cross-table references (e.g. drafts.brief_id) can be remapped.

export default defineSchema({
  // ─────────────────────────────────────────────────────────────
  // content-agent tables

  keywords: defineTable({
    term: v.string(),
    normalized: v.string(),
    source: v.string(),
    sampled_at: v.string(),
    score: v.number(),
    region: v.string(),
    language: v.string(),
    metadata_json: v.string(),
    legacyId: v.optional(v.number()),
  })
    .index("by_normalized_source", ["normalized", "source"])
    .index("by_sampled_at", ["sampled_at"])
    .index("by_legacyId", ["legacyId"]),

  keyword_clusters: defineTable({
    label: v.string(),
    centroid_term: v.string(),
    member_ids_json: v.string(),
    composite_score: v.number(),
    topic_summary: v.string(),
    created_at: v.string(),
    legacyId: v.optional(v.number()),
  }).index("by_legacyId", ["legacyId"]),

  coverage: defineTable({
    cluster_id: v.id("keyword_clusters"),
    gap_score: v.number(),
    best_match_url: v.union(v.string(), v.null()),
    best_match_score: v.number(),
    computed_at: v.string(),
  }).index("by_cluster", ["cluster_id"]),

  briefs: defineTable({
    cluster_id: v.id("keyword_clusters"),
    channel: v.string(),
    audience: v.string(),
    angle: v.string(),
    outline_json: v.string(),
    cta: v.string(),
    created_at: v.string(),
    model: v.string(),
    legacyId: v.optional(v.number()),
  })
    .index("by_cluster", ["cluster_id"])
    .index("by_legacyId", ["legacyId"]),

  drafts: defineTable({
    brief_id: v.id("briefs"),
    channel: v.string(), // "blog" | "linkedin" | "x"
    title: v.string(),
    body: v.string(),
    frontmatter_json: v.string(),
    hashtags_json: v.string(),
    status: v.string(), // "pending" | "approved" | "rejected" | "published" | "failed"
    reviewer_notes: v.string(),
    created_at: v.string(),
    approved_at: v.union(v.string(), v.null()),
    published_at: v.union(v.string(), v.null()),
    published_url: v.union(v.string(), v.null()),
    external_id: v.union(v.string(), v.null()),
    model: v.string(),
    legacyId: v.optional(v.number()),
  })
    .index("by_status", ["status"])
    .index("by_channel", ["channel"])
    .index("by_status_created", ["status", "created_at"])
    .index("by_legacyId", ["legacyId"]),

  publish_connections: defineTable({
    provider: v.string(), // "linkedin" | "x"
    status: v.string(), // "disconnected" | "connected" | "expired"
    account_handle: v.string(),
    account_urn: v.string(),
    scopes: v.string(),
    token_expires_at: v.union(v.string(), v.null()),
    last_checked_at: v.string(),
  }).index("by_provider", ["provider"]),

  content_runs: defineTable({
    phase: v.string(),
    started_at: v.string(),
    finished_at: v.union(v.string(), v.null()),
    trigger: v.string(),
    status: v.string(),
    keywords_discovered: v.number(),
    clusters_created: v.number(),
    drafts_generated: v.number(),
    drafts_published: v.number(),
    log: v.string(),
    legacyId: v.optional(v.number()),
  })
    .index("by_status", ["status"])
    .index("by_started", ["started_at"])
    .index("by_legacyId", ["legacyId"]),

  agents: defineTable({
    slug: v.string(),
    name: v.string(),
    role: v.string(),
    description: v.string(),
    status: v.string(), // active | paused | deferred
    tier: v.string(), // v1 | v1plus | deferred
    owner: v.string(),
    allowed_tools_json: v.string(),
    reports_to: v.string(),
    budget_usd_month: v.number(),
    risk_default: v.string(), // low | med | high
    source: v.string(),
    created_at: v.string(),
    updated_at: v.string(),
  }).index("by_slug", ["slug"]),

  agent_actions: defineTable({
    agent_slug: v.string(),
    run_id: v.union(v.id("content_runs"), v.null()),
    kind: v.string(),
    tool: v.string(),
    input_summary: v.string(),
    output_summary: v.string(),
    trace_ref: v.string(),
    risk: v.string(),
    requires_review: v.boolean(),
    reviewed_at: v.union(v.string(), v.null()),
    reviewed_by: v.union(v.string(), v.null()),
    cost_usd: v.number(),
    tokens_in: v.number(),
    tokens_out: v.number(),
    created_at: v.string(),
  })
    .index("by_agent_created", ["agent_slug", "created_at"])
    .index("by_review", ["requires_review", "reviewed_at"])
    .index("by_created", ["created_at"]),

  tasks: defineTable({
    source_agent: v.string(),
    category: v.string(), // dev | content | security | wcag | seo
    title: v.string(),
    summary: v.string(),
    acceptance_json: v.string(),
    test_scenarios_json: v.string(),
    trace_ref: v.string(),
    priority: v.string(),
    status: v.string(), // open | in_progress | done | wontfix
    github_issue_url: v.union(v.string(), v.null()),
    created_at: v.string(),
    closed_at: v.union(v.string(), v.null()),
  })
    .index("by_status_category", ["status", "category"])
    .index("by_created", ["created_at"]),

  // ─────────────────────────────────────────────────────────────
  // site-intelligence tables

  audit_targets: defineTable({
    name: v.string(),
    label: v.string(),
    origin: v.string(),
    description: v.string(),
    is_active: v.boolean(),
    legacyId: v.optional(v.number()),
  })
    .index("by_name", ["name"])
    .index("by_legacyId", ["legacyId"]),

  audit_runs: defineTable({
    target_id: v.id("audit_targets"),
    audit_type: v.string(),
    started_at: v.string(),
    finished_at: v.union(v.string(), v.null()),
    pages_scanned: v.number(),
    findings_total: v.number(),
    avg_score: v.number(),
    trigger: v.string(),
    status: v.string(),
    legacyId: v.optional(v.number()),
  })
    .index("by_target_type", ["target_id", "audit_type"])
    .index("by_status", ["status"])
    .index("by_started", ["started_at"])
    .index("by_legacyId", ["legacyId"]),

  audit_pages: defineTable({
    run_id: v.id("audit_runs"),
    url: v.string(),
    score: v.number(),
    metrics_json: v.string(),
  }).index("by_run_url", ["run_id", "url"]),

  audit_findings: defineTable({
    run_id: v.id("audit_runs"),
    url: v.string(),
    rule: v.string(),
    severity: v.string(),
    message: v.string(),
  })
    .index("by_run", ["run_id"])
    .index("by_severity", ["severity"]),

  // SEO agent — one summary row per seo-agent run (crawl score + SERP + AEO
  // baselines), mirrored from the fleet for the /admin/intelligence SEO history
  // view. AEO metrics are nullable because a run may skip the AEO stage.
  seo_runs: defineTable({
    origin: v.string(),
    run_at: v.string(),
    avg_score: v.number(),
    pages_scanned: v.number(),
    findings_total: v.number(),
    serp_keywords_tracked: v.number(),
    serp_our_top10: v.number(),
    aeo_brand_mention_rate: v.union(v.number(), v.null()),
    aeo_citation_rate: v.union(v.number(), v.null()),
    aeo_share_of_voice: v.union(v.number(), v.null()),
    aeo_queries: v.union(v.number(), v.null()),
  })
    .index("by_origin_time", ["origin", "run_at"])
    .index("by_run_at", ["run_at"]),

  /*
   * Real-User Monitoring beacons — one row per Web Vitals metric
   * reported by a real visitor on a real device. Aggregations (p75
   * per surface, etc.) are computed at query time.
   *
   * Privacy: we keep visitor_id (a random per-session UUID stored in
   * sessionStorage, NOT persistent) for dedup within a session, but
   * never IP, never user agent beyond a coarse bucket (mobile/desktop),
   * never Referer. GDPR-defensible without consent because there is
   * no personal data being collected.
   */
  /*
   * AI-generated fix proposals — closed-loop "Foreslå fiks" flow.
   * Each row is one specialist agent's remediation suggestion for a
   * specific finding (or score-drop alert). Persisted so an admin can
   * review later, accept (→ eventually opens a GitHub PR), or reject.
   *
   * The agent is chosen by audit_type: sikkerhet/seo/wcag/ytelse/triage.
   * The proposal payload mirrors what a senior eng would write in a PR:
   * rationale, files-touched, code diff, verification steps, risk.
   */
  fix_proposals: defineTable({
    /* Reference back to what triggered this proposal. Either a
       specific audit_findings row OR an alerts row — we use kind
       to disambiguate. */
    finding_ref: v.string(), // "finding:<id>" or "alert:<id>"
    surface: v.string(),
    audit_type: v.string(),
    rule: v.optional(v.string()),
    agent_slug: v.string(), // which specialist generated this
    model: v.string(),
    rationale: v.string(),
    files_touched: v.string(), // JSON array of paths
    diff: v.string(), // unified diff or pseudo-diff
    verification: v.string(),
    risk: v.string(), // "low" | "med" | "high"
    status: v.string(), // "proposed" | "accepted" | "rejected" | "applied"
    reviewer_notes: v.union(v.string(), v.null()),
    cost_usd: v.number(),
    tokens_in: v.number(),
    tokens_out: v.number(),
    created_at: v.string(),
    reviewed_at: v.union(v.string(), v.null()),
    reviewed_by: v.union(v.string(), v.null()),
  })
    .index("by_finding_ref", ["finding_ref"])
    .index("by_status", ["status"])
    .index("by_surface", ["surface"])
    .index("by_created", ["created_at"]),

  rum_events: defineTable({
    surface: v.string(), // "marketing" | "docs" | "status" | …
    pathname: v.string(),
    metric: v.string(), // "LCP" | "CLS" | "INP" | "FCP" | "TTFB"
    value: v.number(),
    rating: v.string(), // "good" | "needs-improvement" | "poor"
    nav_type: v.optional(v.string()), // "navigate" | "reload" | "back-forward"
    device: v.string(), // "mobile" | "desktop"
    visitor_id: v.string(),
    received_at: v.string(),
  })
    .index("by_surface_metric_received", ["surface", "metric", "received_at"])
    .index("by_received", ["received_at"])
    .index("by_visitor_metric", ["visitor_id", "metric"]),

  // Regression alerts emitted when a new error finding appears, an
  // existing finding count jumps, OR a per-(target, audit_type) score
  // drops past the configured threshold. Fingerprint enables dedup so
  // the same regression doesn't fire on every cron tick — first hit
  // creates a row, repeat hits bump `occurrence_count` + `last_seen_at`
  // and route to sinks only if previously resolved. Resolution is
  // automatic when the underlying finding disappears.
  /*
   * Compliance — ISO 27001:2022 + SOC 2 + GDPR evidence platform.
   *
   * compliance_controls: registry of every control we claim to operate.
   * Seeded with ISO 27001:2022 Annex A (93 controls across 4 themes)
   * plus SOC 2 Common Criteria (CC1–CC9). Status reflects current
   * implementation state, not historical. ref is the canonical
   * control number (e.g. "A.5.1", "CC6.1").
   *
   * compliance_evidence: proofs that a control is operating. Either
   * manual (admin uploads a link/text/file ref) or automated
   * (collected by convex/compliance/collectors.ts on a schedule).
   * Multiple evidence rows per control — audit trail of operation.
   *
   * compliance_risks: ISO 27001 Clause 6.1.2 risk register entries.
   *
   * compliance_assets: ISO 27001 A.5.9 asset inventory — domains,
   * services, third-party processors. Each asset can link to controls.
   *
   * processing_activities: GDPR Art. 30 RoPA. One row per processing
   * purpose with lawful basis, data categories, retention.
   */
  compliance_controls: defineTable({
    framework: v.string(), // "iso27001" | "soc2" | "gdpr"
    ref: v.string(), // "A.5.1" | "CC6.1" | "GDPR-Art-30"
    theme: v.string(), // ISO theme or SOC TSC
    title: v.string(), // Norwegian
    description: v.string(), // Norwegian
    status: v.string(), // "implemented" | "partial" | "missing" | "not_applicable" | "planned"
    owner: v.string(),
    last_reviewed_at: v.union(v.string(), v.null()),
    next_review_at: v.union(v.string(), v.null()),
    notes: v.string(),
    automation_signal: v.union(v.string(), v.null()), // key into collectors map
    created_at: v.string(),
    updated_at: v.string(),
  })
    .index("by_framework_ref", ["framework", "ref"])
    .index("by_framework_status", ["framework", "status"])
    .index("by_status", ["status"])
    .index("by_automation_signal", ["automation_signal"]),

  compliance_evidence: defineTable({
    control_ref: v.string(), // matches compliance_controls.ref
    framework: v.string(),
    source: v.string(), // "auto" | "manual"
    collector: v.union(v.string(), v.null()), // e.g. "tls-expiry", "audit-findings-rollup"
    title: v.string(),
    summary: v.string(),
    payload_json: v.string(), // structured data
    link: v.union(v.string(), v.null()),
    status: v.string(), // "pass" | "warn" | "fail" | "info"
    valid_from: v.string(),
    valid_until: v.union(v.string(), v.null()),
    collected_at: v.string(),
    collected_by: v.string(),
  })
    .index("by_control", ["control_ref"])
    .index("by_collector", ["collector"])
    .index("by_collected", ["collected_at"])
    .index("by_status", ["status"]),

  compliance_risks: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(), // "confidentiality" | "integrity" | "availability" | "privacy" | "compliance"
    likelihood: v.string(), // "very_low" | "low" | "med" | "high" | "very_high"
    impact: v.string(),
    inherent_score: v.number(), // 1–25
    treatment: v.string(), // "mitigate" | "accept" | "transfer" | "avoid"
    residual_score: v.number(),
    mitigations_json: v.string(), // list of control refs + action plan
    owner: v.string(),
    status: v.string(), // "open" | "monitoring" | "closed"
    created_at: v.string(),
    updated_at: v.string(),
    next_review_at: v.union(v.string(), v.null()),
  })
    .index("by_status", ["status"])
    .index("by_category", ["category"])
    .index("by_inherent", ["inherent_score"]),

  compliance_assets: defineTable({
    kind: v.string(), // "domain" | "service" | "processor" | "data_store" | "endpoint"
    name: v.string(),
    description: v.string(),
    owner: v.string(),
    classification: v.string(), // "public" | "internal" | "confidential" | "restricted"
    location: v.string(), // jurisdiction / region
    processor_dpa_url: v.union(v.string(), v.null()),
    linked_controls_json: v.string(), // JSON array of control refs
    created_at: v.string(),
    updated_at: v.string(),
  })
    .index("by_kind", ["kind"])
    .index("by_classification", ["classification"]),

  processing_activities: defineTable({
    name: v.string(), // GDPR Art. 30 (1)(b) purpose
    purpose: v.string(),
    lawful_basis: v.string(), // "consent" | "contract" | "legal_obligation" | "vital_interest" | "public_task" | "legitimate_interest"
    data_categories_json: v.string(), // JSON array
    data_subject_categories_json: v.string(),
    recipients_json: v.string(),
    transfers_outside_eea_json: v.string(),
    retention_period: v.string(),
    security_measures: v.string(),
    controller: v.string(),
    processor: v.union(v.string(), v.null()),
    dpia_required: v.boolean(),
    dpia_link: v.union(v.string(), v.null()),
    created_at: v.string(),
    updated_at: v.string(),
  })
    .index("by_lawful_basis", ["lawful_basis"])
    .index("by_dpia", ["dpia_required"]),

  // Regression alerts emitted when a new error finding appears, an
  // existing finding count jumps, OR a per-(target, audit_type) score
  // drops past the configured threshold. Fingerprint enables dedup so
  // the same regression doesn't fire on every cron tick — first hit
  // creates a row, repeat hits bump `occurrence_count` + `last_seen_at`
  // and route to sinks only if previously resolved. Resolution is
  // automatic when the underlying finding disappears.
  alerts: defineTable({
    kind: v.string(), // "score-drop" | "new-error" | "uptime-down" | "ssl-expiring"
    surface: v.string(),
    audit_type: v.string(),
    rule: v.optional(v.string()),
    severity: v.string(), // "error" | "warn"
    title: v.string(),
    detail: v.string(),
    fingerprint: v.string(), // surface + audit_type + rule (or score-drop)
    first_seen_at: v.string(),
    last_seen_at: v.string(),
    occurrence_count: v.number(),
    resolved_at: v.union(v.string(), v.null()),
    notified_sinks: v.string(), // JSON array of "slack" | "email" | "github"
  })
    .index("by_fingerprint", ["fingerprint"])
    .index("by_resolved", ["resolved_at"])
    .index("by_last_seen", ["last_seen_at"])
    .index("by_surface", ["surface"]),
});
