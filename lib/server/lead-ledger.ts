import { createHmac } from "node:crypto";
import { after } from "next/server";
import { controlledMediums, controlledSources, sanitizeLeadAttribution, type Touch } from "@/lib/analytics/attribution";
import { leadIdSecret, warnMissingLeadIdSecret } from "./lead-id";
import type { Lead } from "./lead-intake";

/**
 * Server-side client for the internal lead ledger. The ledger holds no consumer PII: no name,
 * email, phone, date of birth, income, medical or immigration data, and no free text the visitor
 * typed. Each record is built field by field from allowlisted values below.
 * Contract: docs/measurement/lead-ledger.md.
 */

export const ledgerSchemaVersion = 1;

export type LedgerFormType = "contact" | "health";
export type LedgerProductLine = "health" | "life" | "property" | "employer" | "academy";
export const ledgerProductLines: readonly LedgerProductLine[] = ["health", "life", "property", "employer", "academy"];

export type LedgerLeadRecord = {
  schema_version: typeof ledgerSchemaVersion;
  lead_id: string;
  created_at: string;
  channel_of_entry: "web_form";
  form_type: LedgerFormType;
  product_line?: LedgerProductLine;
  state?: string;
  language: "es" | "en";
  first_source?: string;
  first_medium?: string;
  first_campaign?: string;
  first_landing_page?: string;
  last_source?: string;
  last_medium?: string;
  last_campaign?: string;
  last_landing_page?: string;
};

/** Census FIPS codes used by the health form's state picker → USPS codes. */
const uspsByFips: Record<string, string> = Object.fromEntries(
  "01AL 02AK 04AZ 05AR 06CA 08CO 09CT 10DE 11DC 12FL 13GA 15HI 16ID 17IL 18IN 19IA 20KS 21KY 22LA 23ME 24MD 25MA 26MI 27MN 28MS 29MO 30MT 31NE 32NV 33NH 34NJ 35NM 36NY 37NC 38ND 39OH 40OK 41OR 42PA 44RI 45SC 46SD 47TN 48TX 49UT 50VT 51VA 53WA 54WV 55WI 56WY"
    .split(" ")
    .map((pair) => [pair.slice(0, 2), pair.slice(2)]),
);

/**
 * Ledger attribution is controlled business data, never a raw copy of a UTM or referrer (the lead
 * email keeps the raw values):
 * - source: a built-in controlled source (search engine, social network, AI platform, §8
 *   convention) or one registered in `LEAD_LEDGER_SOURCE_IDS`. Looking like a domain is not enough.
 *   A touch with an unapproved source keeps only its landing page: its medium and campaign are not
 *   trusted either;
 * - medium: one of the controlled mediums;
 * - campaign: only an approved campaign ID from `LEAD_LEDGER_CAMPAIGN_IDS`. Shape alone cannot tell
 *   "aca_oe_2027" from "diabetes", so unknown campaigns are left out.
 * The lead itself is never affected.
 */
const registryId = /^[a-z0-9_-]{1,64}$/;
const hostName = /^(?=.{4,100}$)[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/;

function registry(value: string | undefined, valid: (id: string) => boolean): ReadonlySet<string> {
  const ids = (value ?? "").split(",").map((id) => id.trim().toLowerCase());
  return new Set(ids.filter(valid));
}

/** Approved campaign IDs: comma-separated `LEAD_LEDGER_CAMPAIGN_IDS` (not a secret), lowercase. */
export function ledgerCampaignIds(env: Record<string, string | undefined> = process.env) {
  return registry(env.LEAD_LEDGER_CAMPAIGN_IDS, (id) => registryId.test(id));
}

/** Registered custom sources: comma-separated `LEAD_LEDGER_SOURCE_IDS` (not a secret): IDs or referral host names. */
export function ledgerSourceIds(env: Record<string, string | undefined> = process.env) {
  return registry(env.LEAD_LEDGER_SOURCE_IDS, (id) => registryId.test(id) || hostName.test(id));
}

function ledgerMedium(value?: string) {
  const medium = value?.toLowerCase();
  return medium && controlledMediums.has(medium) ? medium : undefined;
}

export function ledgerLeadRecord(input: {
  lead: Lead;
  formType: LedgerFormType;
  productLine?: unknown;
  stateFips?: string;
  language: "es" | "en";
  attribution: unknown;
}): LedgerLeadRecord {
  const attribution = sanitizeLeadAttribution(input.attribution);
  const campaigns = ledgerCampaignIds();
  const sources = ledgerSourceIds();
  const ledgerCampaign = (value?: string) => (value && campaigns.has(value.toLowerCase()) ? value.toLowerCase() : undefined);
  const touch = (prefix: "first" | "last", t?: Touch) => {
    const source = t?.source.toLowerCase();
    const trusted = source !== undefined && (controlledSources.has(source) || sources.has(source));
    return {
      [`${prefix}_source`]: trusted ? source : undefined,
      [`${prefix}_medium`]: trusted ? ledgerMedium(t?.medium) : undefined,
      [`${prefix}_campaign`]: trusted ? ledgerCampaign(t?.campaign) : undefined,
      [`${prefix}_landing_page`]: t?.landing_page,
    };
  };
  const record = {
    schema_version: ledgerSchemaVersion,
    lead_id: input.lead.id,
    created_at: input.lead.createdAt,
    channel_of_entry: "web_form",
    form_type: input.formType,
    product_line: ledgerProductLines.find((line) => line === input.productLine),
    state: input.stateFips ? uspsByFips[input.stateFips] : undefined,
    language: input.language,
    // First touch needs cross-visit storage, so it only exists when the visitor allowed analytics.
    ...touch("first", attribution?.consent === "granted" ? attribution.first : undefined),
    ...touch("last", attribution?.last),
  };
  return Object.fromEntries(Object.entries(record).filter(([, value]) => value !== undefined)) as LedgerLeadRecord;
}

export type LedgerConfig = { endpoint: string; webhookSecret: string };

let warnedUnconfigured = false;

/**
 * `LEAD_LEDGER_ENDPOINT` (https; http only for localhost) and `LEAD_LEDGER_WEBHOOK_SECRET`, or
 * undefined. Delivery also requires `LEAD_ID_SECRET`: without it lead IDs are random per
 * instance, and those unstable identities must not enter the ledger. The lead is still emailed.
 */
export function ledgerConfig(env: Record<string, string | undefined> = process.env): LedgerConfig | undefined {
  const endpoint = env.LEAD_LEDGER_ENDPOINT?.trim();
  const webhookSecret = env.LEAD_LEDGER_WEBHOOK_SECRET?.trim();
  if (!endpoint || !webhookSecret) {
    if (!warnedUnconfigured) console.info("Lead ledger is not configured; leads are emailed only.");
    warnedUnconfigured = true;
    return undefined;
  }
  if (!leadIdSecret(env)) {
    warnMissingLeadIdSecret();
    return undefined;
  }
  try {
    const url = new URL(endpoint);
    const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (url.protocol === "https:" || (local && url.protocol === "http:")) return { endpoint: url.toString(), webhookSecret };
  } catch {}
  console.error("LEAD_LEDGER_ENDPOINT is not a valid https URL; leads are emailed only.");
  return undefined;
}

/**
 * The signed request body: {version: 1, payload, signature}. `payload` is base64url (no padding)
 * of the record's UTF-8 JSON; `signature` is base64url (no padding) of HMAC-SHA256 keyed by the
 * webhook secret (UTF-8) over the exact `payload` string. The secret itself is never sent.
 */
export function ledgerEnvelope(record: LedgerLeadRecord, webhookSecret: string) {
  const payload = Buffer.from(JSON.stringify(record), "utf8").toString("base64url");
  const signature = createHmac("sha256", webhookSecret).update(payload).digest("base64url");
  return { version: 1 as const, payload, signature };
}

export type LedgerResult = "created" | "duplicate" | "id_conflict" | "unauthorized" | "failed";

/** The receiver's JSON body is authoritative, whatever the HTTP status. */
function readReceipt(body: unknown, leadId: string): LedgerResult | "invalid" {
  if (!body || typeof body !== "object") return "invalid";
  const receipt = body as Record<string, unknown>;
  if (receipt.ok === true && (receipt.result === "created" || receipt.result === "duplicate") && receipt.lead_id === leadId) return receipt.result;
  if (receipt.ok === false && receipt.code === "id_conflict" && receipt.lead_id === leadId) return "id_conflict";
  if (receipt.ok === false && receipt.code === "unauthorized") return "unauthorized";
  return "invalid";
}

/**
 * Delivers the record (three attempts, 0.5 s then 2 s apart). Created and duplicate (the same
 * record apart from created_at, e.g. a retry on another instance) both count as delivered. Network errors, timeouts and unreadable or unexpected responses
 * are retried with the identical body; id_conflict and unauthorized are final (retrying the same
 * signed body cannot change them). Never throws. Logs only the lead ID and a generic code.
 */
export async function sendToLedger(
  record: LedgerLeadRecord,
  config: LedgerConfig,
  { fetchImpl = fetch, retryDelaysMs = [500, 2_000], timeoutMs = 10_000 }: { fetchImpl?: typeof fetch; retryDelaysMs?: number[]; timeoutMs?: number } = {},
): Promise<LedgerResult> {
  const body = JSON.stringify(ledgerEnvelope(record, config.webhookSecret));
  let outcome = "no response";
  for (let attempt = 0; attempt <= retryDelaysMs.length; attempt++) {
    if (attempt > 0) await new Promise((resolve) => setTimeout(resolve, retryDelaysMs[attempt - 1]));
    try {
      const response = await fetchImpl(config.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        signal: AbortSignal.timeout(timeoutMs),
      });
      const result = readReceipt(await response.json().catch(() => undefined), record.lead_id);
      if (result === "created" || result === "duplicate") return result;
      if (result === "id_conflict") {
        console.error(`Lead ledger: id_conflict for ${record.lead_id}.`);
        return result;
      }
      if (result === "unauthorized") {
        console.error(`Lead ledger: unauthorized for ${record.lead_id}; check LEAD_LEDGER_WEBHOOK_SECRET.`);
        return result;
      }
      outcome = `invalid_response, status ${response.status}`;
    } catch (error) {
      outcome = error instanceof Error && error.name === "TimeoutError" ? "timeout" : "network_error";
    }
  }
  console.error(`Lead ledger did not record ${record.lead_id} (${outcome}); the lead email was sent.`);
  return "failed";
}

/**
 * Sends the record after the response, so the ledger never delays or fails the visitor's
 * submission. Does nothing when the ledger is not configured.
 */
export function recordLeadInLedger(record: LedgerLeadRecord) {
  const config = ledgerConfig();
  if (!config) return;
  const task = sendToLedger(record, config).catch(() => "failed" as const);
  try {
    after(task);
  } catch {
    // Outside a request scope (scripts, tests) the promise simply runs on its own.
  }
}
