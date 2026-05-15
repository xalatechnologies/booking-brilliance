/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as audits_public from "../audits/public.js";
import type * as audits_runs from "../audits/runs.js";
import type * as audits_state from "../audits/state.js";
import type * as audits_targets from "../audits/targets.js";
import type * as auth from "../auth.js";
import type * as content_agents from "../content/agents.js";
import type * as content_drafts from "../content/drafts.js";
import type * as content_keywords from "../content/keywords.js";
import type * as content_publish from "../content/publish.js";
import type * as content_runs from "../content/runs.js";
import type * as content_state from "../content/state.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "audits/public": typeof audits_public;
  "audits/runs": typeof audits_runs;
  "audits/state": typeof audits_state;
  "audits/targets": typeof audits_targets;
  auth: typeof auth;
  "content/agents": typeof content_agents;
  "content/drafts": typeof content_drafts;
  "content/keywords": typeof content_keywords;
  "content/publish": typeof content_publish;
  "content/runs": typeof content_runs;
  "content/state": typeof content_state;
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
