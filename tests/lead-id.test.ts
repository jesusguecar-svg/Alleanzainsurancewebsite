import assert from "node:assert/strict";
import { test } from "node:test";
import { createLeadId, leadIdPattern, leadIdSecret } from "@/lib/server/lead-id";
import { alreadyDelivered, deliverLeadOnce, submissionKey, type Lead } from "@/lib/server/lead-intake";

test("lead IDs have the LD-XXXXX-XXXXX format with an unambiguous alphabet", () => {
  for (let i = 0; i < 2_000; i++) assert.match(createLeadId(), leadIdPattern);
  assert.match("LD-A7K4P-9Q2RM", leadIdPattern);
  for (const bad of ["LD-A7K4P-9Q2R", "LD-A7K4P9Q2RM", "LD-A7K4P-9Q2RO", "LD-a7k4p-9q2rm", "LD-A7K4P-9Q2R1", "LD-261101-A7K4P9", "XX-A7K4P-9Q2RM"]) {
    assert.doesNotMatch(bad, leadIdPattern);
  }
});

test("the ID carries no date", () => {
  const ids = Array.from({ length: 500 }, () => createLeadId());
  // No shared prefix: the first symbol varies freely instead of encoding a day.
  assert.ok(new Set(ids.map((id) => id.slice(3, 5))).size > 200);
});

test("symbols are uniform over the 31 characters; no collisions in 50k IDs", () => {
  const ids = Array.from({ length: 50_000 }, () => createLeadId());
  const counts = new Map<string, number>();
  for (const id of ids) for (const symbol of id.replaceAll("-", "").slice(2)) counts.set(symbol, (counts.get(symbol) ?? 0) + 1);
  assert.equal(counts.size, 31);
  const expected = (50_000 * 10) / 31;
  for (const [symbol, count] of counts) assert.ok(Math.abs(count - expected) < expected * 0.05, `${symbol}: ${count}`);
  // 31¹⁰ ≈ 8.2 × 10¹⁴: 50k IDs expect ~1.5 × 10⁻⁶ collisions.
  assert.equal(new Set(ids).size, ids.length);
});

test("with LEAD_ID_SECRET the same submission key always yields the same ID", () => {
  const secret = leadIdSecret({ LEAD_ID_SECRET: "test-lead-id-secret" });
  assert.equal(secret, "test-lead-id-secret");
  const key = "3f0e7c1a-1d7e-4b8e-9a51-6f4f2a6c9b10";
  assert.equal(createLeadId({ key, secret }), createLeadId({ key, secret }));
  assert.match(createLeadId({ key, secret }), leadIdPattern);
  assert.notEqual(createLeadId({ key, secret }), createLeadId({ key: `${key.slice(0, -1)}1`, secret }));
  // A different secret (or none) gives an unrelated ID, so the browser cannot compute it.
  assert.notEqual(createLeadId({ key, secret }), createLeadId({ key, secret: "other-secret" }));
  assert.notEqual(createLeadId({ key }), createLeadId({ key }));
});

test("the lead-ID secret is LEAD_ID_SECRET only, independent of the ledger webhook secret", () => {
  assert.equal(leadIdSecret({}), undefined);
  assert.equal(leadIdSecret({ LEAD_LEDGER_WEBHOOK_SECRET: "webhook" }), undefined);
  // The retired LEAD_LEDGER_TOKEN is ignored.
  assert.equal(leadIdSecret({ LEAD_LEDGER_TOKEN: "old-token" }), undefined);
  const key = "3f0e7c1a-1d7e-4b8e-9a51-6f4f2a6c9b10";
  const before = createLeadId({ key, secret: leadIdSecret({ LEAD_ID_SECRET: "s", LEAD_LEDGER_WEBHOOK_SECRET: "webhook-v1" }) });
  const after = createLeadId({ key, secret: leadIdSecret({ LEAD_ID_SECRET: "s", LEAD_LEDGER_WEBHOOK_SECRET: "webhook-v2" }) });
  assert.equal(before, after);
});

test("submission keys are validated", () => {
  assert.equal(submissionKey("3f0e7c1a-1d7e-4b8e-9a51-6f4f2a6c9b10"), "3f0e7c1a-1d7e-4b8e-9a51-6f4f2a6c9b10");
  for (const bad of [undefined, 42, "", "short", "has spaces in it here", "x".repeat(65), "<script>alert(1)</script>"]) {
    assert.equal(submissionKey(bad), undefined);
  }
});

const key = () => submissionKey(crypto.randomUUID())!;
const secret = "test-lead-id-secret";

test("one lead ID per successful submission; a retry after success is not delivered again", async () => {
  const k = key();
  const delivered: Lead[] = [];
  const first = await deliverLeadOnce(k, async (lead) => (delivered.push(lead), true), secret);
  assert.equal(first.delivered, true);
  assert.equal(first.replayed, false);
  assert.equal(first.lead.id, createLeadId({ key: k, secret }));
  assert.ok(alreadyDelivered(k));

  const retry = await deliverLeadOnce(k, async (lead) => (delivered.push(lead), true), secret);
  assert.deepEqual(retry, { lead: first.lead, delivered: true, replayed: true });
  assert.equal(delivered.length, 1);

  const other = await deliverLeadOnce(key(), async () => true, secret);
  assert.notEqual(other.lead.id, first.lead.id);
});

test("a failed delivery is retried under the same lead ID", async () => {
  const k = key();
  const seen: string[] = [];
  const failed = await deliverLeadOnce(k, async (lead) => (seen.push(lead.id), false), secret);
  assert.equal(failed.delivered, false);
  assert.equal(alreadyDelivered(k), false);
  const thrown = await deliverLeadOnce(k, async (lead) => { seen.push(lead.id); throw new Error("boom"); }, secret);
  assert.equal(thrown.delivered, false);
  const ok = await deliverLeadOnce(k, async (lead) => (seen.push(lead.id), true), secret);
  assert.equal(ok.delivered, true);
  assert.equal(ok.replayed, false);
  assert.equal(new Set(seen).size, 1);
  assert.equal(ok.lead.createdAt, failed.lead.createdAt);
});

test("concurrent requests with the same key deliver once", async () => {
  const k = key();
  let calls = 0;
  const deliver = async () => {
    calls++;
    await new Promise((resolve) => setTimeout(resolve, 30));
    return true;
  };
  const results = await Promise.all([deliverLeadOnce(k, deliver, secret), deliverLeadOnce(k, deliver, secret), deliverLeadOnce(k, deliver, secret)]);
  assert.equal(calls, 1);
  assert.equal(new Set(results.map((r) => r.lead.id)).size, 1);
  assert.equal(results.filter((r) => !r.replayed).length, 1);
  assert.ok(results.every((r) => r.delivered));
});

test("without a submission key (an older page) each request is a new lead", async () => {
  const a = await deliverLeadOnce(undefined, async () => true, secret);
  const b = await deliverLeadOnce(undefined, async () => true, secret);
  assert.notEqual(a.lead.id, b.lead.id);
  assert.equal(a.replayed || b.replayed, false);
});
