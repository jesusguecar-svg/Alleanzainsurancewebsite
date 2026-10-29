import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * A model of the canonical ledger receiver contract (docs/measurement/lead-ledger.md), used by
 * the route and multi-instance tests. Verifies the HMAC over the exact payload string, then for an
 * existing lead_id compares the decoded record field by field, excluding only created_at:
 * equal → duplicate (the stored created_at stays), any other difference → id_conflict.
 */
export type ReceiverResult = "created" | "duplicate" | "id_conflict" | "unauthorized";

export function createReceiver(secret: string) {
  const stored = new Map<string, Record<string, unknown>>();
  const results: ReceiverResult[] = [];

  function sameLead(a: Record<string, unknown>, b: Record<string, unknown>) {
    const fields = new Set([...Object.keys(a), ...Object.keys(b)]);
    fields.delete("created_at");
    return [...fields].every((field) => a[field] === b[field]);
  }

  function receive(body: string): { result: ReceiverResult; response: Record<string, unknown>; record?: Record<string, unknown> } {
    const done = (result: ReceiverResult, response: Record<string, unknown>, record?: Record<string, unknown>) => {
      results.push(result);
      return { result, response, record };
    };
    let envelope: { version?: unknown; payload?: unknown; signature?: unknown };
    try {
      envelope = JSON.parse(body);
    } catch {
      return done("unauthorized", { ok: false, code: "unauthorized" });
    }
    const expected = typeof envelope.payload === "string" ? createHmac("sha256", secret).update(envelope.payload).digest() : undefined;
    const given = typeof envelope.signature === "string" ? Buffer.from(envelope.signature.replace(/=+$/, ""), "base64url") : undefined;
    if (envelope.version !== 1 || !expected || !given || given.length !== expected.length || !timingSafeEqual(given, expected)) {
      return done("unauthorized", { ok: false, code: "unauthorized" });
    }
    const record = JSON.parse(Buffer.from(envelope.payload as string, "base64url").toString("utf8")) as Record<string, unknown>;
    const leadId = record.lead_id as string;
    const prior = stored.get(leadId);
    if (!prior) {
      stored.set(leadId, record);
      return done("created", { ok: true, result: "created", lead_id: leadId }, record);
    }
    if (sameLead(prior, record)) return done("duplicate", { ok: true, result: "duplicate", lead_id: leadId }, record);
    return done("id_conflict", { ok: false, code: "id_conflict", lead_id: leadId }, record);
  }

  return { receive, stored, results };
}
