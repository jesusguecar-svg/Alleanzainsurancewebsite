import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { promisify } from "node:util";
import { after, before, beforeEach, test } from "node:test";
import { leadIdPattern } from "@/lib/server/lead-id";
import { createReceiver } from "./fake-receiver";

/**
 * Independent server instances: separate Node processes with no shared memory, each loading the
 * contact route and handling the same submission. Resend is mocked inside each process; the
 * ledger post goes over real HTTP to the canonical receiver model in this process. The lead ID
 * must come only from LEAD_ID_SECRET + submission_id.
 */

const instance = `
const realFetch = globalThis.fetch;
const emails = [];
globalThis.fetch = async (url, init) => {
  if (String(url) === "https://api.resend.com/emails") { emails.push(JSON.parse(init.body)); return Response.json({ id: "x" }); }
  return realFetch(url, init);
};
console.info = () => {};
const { POST } = await import("@/app/api/contacto/route");
const response = await POST(new Request("https://alleanzainsurance.org/api/contacto", {
  method: "POST",
  headers: { "content-type": "application/json", origin: "https://alleanzainsurance.org" },
  body: JSON.stringify({ name: "PRUEBA Instancia", phone: "214 555 0199", email: "", productId: "cancer", message: "", consent: true,
    source: "/contacto", company_fax_hp: "", form_type: "contact", submission_id: process.env.SUBMISSION_ID,
    attribution: { consent: "granted", last: { source: "google", medium: "organic", landing_page: "/contacto" } } }),
}));
const text = emails[0]?.text ?? "";
process.stdout.write(JSON.stringify({ status: response.status, body: await response.json(),
  leadId: text.match(/^ID de lead: (\\S+)$/m)?.[1], createdAt: text.match(/^Fecha: (\\S+)$/m)?.[1] }));
// The process exits once the ledger post (run after the response) has finished.
`;

const receiverSecret = "instances-webhook-secret";
let receiver = createReceiver(receiverSecret);
let endpoint = "";
const server = createServer((request, response) => {
  let body = "";
  request.on("data", (chunk) => (body += chunk));
  request.on("end", () => {
    response.setHeader("content-type", "application/json");
    response.end(JSON.stringify(receiver.receive(body).response));
  });
});

before(async () => {
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  endpoint = `http://127.0.0.1:${(server.address() as AddressInfo).port}/leads`;
});
after(() => server.close());
beforeEach(() => (receiver = createReceiver(receiverSecret)));

type Run = { status: number; body: unknown; leadId?: string; createdAt?: string; stderr: string };

async function runInstance(env: Record<string, string>): Promise<Run> {
  const { stdout, stderr } = await promisify(execFile)(process.execPath, ["--import", "./tests/register.mjs", "--input-type=module", "-e", instance], {
    env: {
      ...process.env,
      NODE_OPTIONS: "",
      RESEND_API_KEY: "test-only",
      RESEND_FROM: "Alleanza <test@forms.alleanzainsurance.org>",
      LEAD_LEDGER_ENDPOINT: endpoint,
      LEAD_LEDGER_WEBHOOK_SECRET: receiverSecret,
      ...env,
    },
    encoding: "utf8",
  });
  return { ...JSON.parse(stdout), stderr };
}

const submission = "8c1d2e3f-4a5b-4c6d-8e7f-9a0b1c2d3e4f";
const shared = { LEAD_ID_SECRET: "shared-secret", SUBMISSION_ID: submission };

test("cross-instance retry: same lead_id, different created_at, receiver answers duplicate (not id_conflict)", async () => {
  const first = await runInstance(shared);
  await new Promise((resolve) => setTimeout(resolve, 25)); // the retry is handled later, elsewhere
  const retry = await runInstance(shared);
  for (const run of [first, retry]) {
    assert.equal(run.status, 200);
    assert.deepEqual(run.body, { ok: true });
    assert.match(run.leadId ?? "", leadIdPattern);
    assert.doesNotMatch(run.stderr, /id_conflict|did not record|unauthorized/);
  }
  assert.equal(first.leadId, retry.leadId);
  assert.notEqual(first.createdAt, retry.createdAt);
  assert.deepEqual(receiver.results, ["created", "duplicate"]);
  // The original created_at stays authoritative.
  assert.equal(receiver.stored.size, 1);
  assert.equal(receiver.stored.get(first.leadId!)?.created_at, first.createdAt);
});

test("a real difference under the same lead_id is still id_conflict", async () => {
  const first = await runInstance(shared);
  const id = first.leadId!;
  // Same ID, different product line: a true collision, not a retry.
  const stored = receiver.stored.get(id)!;
  receiver.stored.set(id, { ...stored, product_line: "life" });
  const retry = await runInstance(shared);
  assert.equal(retry.leadId, id);
  assert.deepEqual(receiver.results, ["created", "id_conflict"]);
  assert.match(retry.stderr, new RegExp(`Lead ledger: id_conflict for ${id}\\.`));
  assert.deepEqual(retry.body, { ok: true });
});

test("a different submission on another instance is a different lead", async () => {
  const a = await runInstance(shared);
  const c = await runInstance({ ...shared, SUBMISSION_ID: "11111111-2222-4333-8444-555555555555" });
  assert.notEqual(c.leadId, a.leadId);
  assert.deepEqual(receiver.results, ["created", "created"]);
});

test("rotating LEAD_LEDGER_WEBHOOK_SECRET does not change the lead ID; changing LEAD_ID_SECRET does", async () => {
  const before = await runInstance({ ...shared, LEAD_LEDGER_WEBHOOK_SECRET: "webhook-2026-q4" });
  const rotated = await runInstance({ ...shared, LEAD_LEDGER_WEBHOOK_SECRET: "webhook-2027-q1" });
  assert.equal(before.leadId, rotated.leadId);
  const otherIdSecret = await runInstance({ ...shared, LEAD_ID_SECRET: "another-secret" });
  assert.notEqual(otherIdSecret.leadId, before.leadId);
});

test("without LEAD_ID_SECRET, instances do not agree, so nothing is sent to the ledger", async () => {
  const a = await runInstance({ ...shared, LEAD_ID_SECRET: "", VERCEL_ENV: "production" });
  const b = await runInstance({ ...shared, LEAD_ID_SECRET: "", VERCEL_ENV: "production" });
  assert.match(a.leadId ?? "", leadIdPattern);
  assert.notEqual(a.leadId, b.leadId);
  assert.deepEqual([a.status, b.status], [200, 200]);
  assert.deepEqual(receiver.results, []);
  for (const run of [a, b]) {
    const lines = run.stderr.trim().split("\n").filter(Boolean);
    assert.deepEqual(lines, ["LEAD_ID_SECRET is not set; lead IDs are not stable across server instances and leads are not sent to the lead ledger."]);
  }
});
