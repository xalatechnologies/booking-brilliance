/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agents_fixProposals from "../agents/fixProposals.js";
import type * as audits_alerts from "../audits/alerts.js";
import type * as audits_performance from "../audits/performance.js";
import type * as audits_public from "../audits/public.js";
import type * as audits_rum from "../audits/rum.js";
import type * as audits_runs from "../audits/runs.js";
import type * as audits_state from "../audits/state.js";
import type * as audits_targets from "../audits/targets.js";
import type * as auth from "../auth.js";
import type * as compliance_baseline from "../compliance/baseline.js";
import type * as compliance_collectors from "../compliance/collectors.js";
import type * as compliance_mutations from "../compliance/mutations.js";
import type * as compliance_seed from "../compliance/seed.js";
import type * as compliance_state from "../compliance/state.js";
import type * as content_agents from "../content/agents.js";
import type * as content_drafts from "../content/drafts.js";
import type * as content_keywords from "../content/keywords.js";
import type * as content_publish from "../content/publish.js";
import type * as content_runs from "../content/runs.js";
import type * as content_state from "../content/state.js";
import type * as seo_runs from "../seo/runs.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "agents/fixProposals": typeof agents_fixProposals;
  "audits/alerts": typeof audits_alerts;
  "audits/performance": typeof audits_performance;
  "audits/public": typeof audits_public;
  "audits/rum": typeof audits_rum;
  "audits/runs": typeof audits_runs;
  "audits/state": typeof audits_state;
  "audits/targets": typeof audits_targets;
  auth: typeof auth;
  "compliance/baseline": typeof compliance_baseline;
  "compliance/collectors": typeof compliance_collectors;
  "compliance/mutations": typeof compliance_mutations;
  "compliance/seed": typeof compliance_seed;
  "compliance/state": typeof compliance_state;
  "content/agents": typeof content_agents;
  "content/drafts": typeof content_drafts;
  "content/keywords": typeof content_keywords;
  "content/publish": typeof content_publish;
  "content/runs": typeof content_runs;
  "content/state": typeof content_state;
  "seo/runs": typeof seo_runs;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
