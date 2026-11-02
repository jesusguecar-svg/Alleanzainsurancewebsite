import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { test } from "node:test";

/**
 * Severity of the "not configured" log. It is written once per server instance, so each case runs
 * the contact route in a fresh Node process: a real first request with Resend mocked.
 */

const instance = `
const calls = [];
const emails = [];
globalThis.fetch = async (url, init) => {
  calls.push(String(url));
  if (String(url) === "https://api.resend.com/emails") emails.push(JSON.parse(init.body));
  return Response.json({ id: "x" });
};
const logs = { error: [], info: [] };
console.error = (...args) => logs.error.push(args.join(" "));
console.info = (...args) => logs.info.push(args.join(" "));
const { POST } = await import("@/app/api/contacto/route");
const response = await POST(new Request("https://alleanzainsurance.org/api/contacto", {
  method: "POST",
  headers: { "content-type": "application/json", origin: "https://alleanzainsurance.org" },
  body: JSON.stringify({ name: "PRUEBA Instancia", phone: "214 555 0199", email: "", productId: "cancer", message: "", consent: true,
    source: "/contacto", company_fax_hp: "", form_type: "contact", submission_id: "3f0e7c1a-1d7e-4b8e-9a51-6f4f2a6c9b10" }),
}));
await new Promise((resolve) => setTimeout(resolve, 100));
process.stdout.write(JSON.stringify({ status: response.status, emails: emails.length, calls, logs }));
`;

const secrets = { LEAD_ID_SECRET: "test-lead-id-secret", LEAD_LEDGER_WEBHOOK_SECRET: "test-webhook-secret" };
const message = "Lead ledger is not configured; leads are emailed only.";

async function run(env: Record<string, string>) {
  const clean = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith("LEAD_") && key !== "VERCEL_ENV"));
  const { stdout } = await promisify(execFile)(process.execPath, ["--import", "./tests/register.mjs", "--input-type=module", "-e", instance], {
    env: { ...clean, NODE_ENV: "test", RESEND_API_KEY: "test-only", RESEND_FROM: "Alleanza <test@forms.alleanzainsurance.org>", NODE_NO_WARNINGS: "1", ...env },
  });
  return JSON.parse(stdout) as { status: number; emails: number; calls: string[]; logs: { error: string[]; info: string[] } };
}

for (const [missing, env] of [
  ["LEAD_LEDGER_ENDPOINT", { LEAD_ID_SECRET: secrets.LEAD_ID_SECRET, LEAD_LEDGER_WEBHOOK_SECRET: secrets.LEAD_LEDGER_WEBHOOK_SECRET }],
  ["LEAD_LEDGER_WEBHOOK_SECRET", { LEAD_ID_SECRET: secrets.LEAD_ID_SECRET, LEAD_LEDGER_ENDPOINT: "https://ledger.example.test/leads" }],
] as const) {
  test(`production without ${missing}: console.error, the lead is emailed, no ledger request`, async () => {
    const result = await run({ ...env, VERCEL_ENV: "production" });
    assert.equal(result.status, 200);
    assert.equal(result.emails, 1);
    assert.deepEqual(result.calls, ["https://api.resend.com/emails"]);
    assert.deepEqual(result.logs, { error: [message], info: [] });
    for (const secret of Object.values(secrets)) assert.ok(!JSON.stringify(result.logs).includes(secret));
  });

  test(`outside production without ${missing}: stays at info level`, async () => {
    const result = await run({ ...env, VERCEL_ENV: "preview" });
    assert.equal(result.status, 200);
    assert.deepEqual(result.calls, ["https://api.resend.com/emails"]);
    assert.deepEqual(result.logs, { error: [], info: [message] });
  });
}
