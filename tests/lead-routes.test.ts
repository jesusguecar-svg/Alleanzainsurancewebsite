import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { leadIdPattern } from "@/lib/server/lead-id";
import { createReceiver } from "./fake-receiver";

/**
 * The lead API routes end to end, with Resend and the ledger replaced by an in-process fetch.
 * Checks the lead ID in the email, the ledger record, idempotent retries, and that neither a
 * missing nor a failing ledger changes what the visitor gets back.
 */

process.env.RESEND_API_KEY = "test-only";
process.env.RESEND_FROM = "Alleanza <test@forms.alleanzainsurance.org>";
process.env.LEAD_LEDGER_CAMPAIGN_IDS = "aca_2027,aca_search,aca_oe_2027";
process.env.LEAD_ID_SECRET = "test-lead-id-secret";
process.env.LEAD_LEDGER_ENDPOINT = "https://ledger.example.test/leads";
process.env.LEAD_LEDGER_WEBHOOK_SECRET = "test-webhook-secret";

type Email = { subject: string; text: string };
let emails: Email[] = [];
/** The canonical receiver model; its secret is fixed, whatever the website is configured with. */
const receiver = createReceiver("test-webhook-secret");
/** Records the receiver decoded after verifying the HMAC, like the Apps Script ledger will. */
let ledger: Array<{ body: Record<string, unknown>; headers: Record<string, string> }> = [];
let ledgerCalls = 0;
let resendStatus = 200;
let ledgerMode: "receiver" | "down" = "receiver";
const logs: string[] = [];

globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = String(input);
  if (url === "https://api.resend.com/emails") {
    if (resendStatus !== 200) return new Response("{}", { status: resendStatus });
    emails.push(JSON.parse(init!.body as string));
    return Response.json({ id: `email-${emails.length}` });
  }
  if (url.startsWith("https://ledger.example.test/")) {
    ledgerCalls++;
    if (ledgerMode === "down") throw new TypeError("fetch failed");
    const { response, record } = receiver.receive(init!.body as string);
    if (record) ledger.push({ body: record, headers: init!.headers as Record<string, string> });
    return Response.json(response);
  }
  throw new Error(`unexpected fetch ${url}`);
}) as typeof fetch;
console.error = (...args: unknown[]) => void logs.push(args.join(" "));
console.info = () => {};

const contact = await import("@/app/api/contacto/route");
const health = await import("@/app/api/health/contact/route");

let ip = 0;
function post(path: string, body: unknown) {
  return new Request(`https://alleanzainsurance.org${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://alleanzainsurance.org", "x-real-ip": `10.0.0.${++ip}` },
    body: JSON.stringify(body),
  });
}

const person = { name: "PRUEBA Maria Lopez", email: "maria.prueba@example.com", phone: "214 555 0199" };
const attribution = {
  consent: "granted",
  first: { source: "meta", medium: "paid_social", campaign: "aca_2027", landing_page: "/" },
  last: { source: "google", medium: "cpc", campaign: "aca_search", landing_page: "/contacto" },
};
const contactBody = (extra: Record<string, unknown> = {}) => ({
  ...person, productId: "", message: "Quiero cotizar", consent: true, source: "/contacto", company_fax_hp: "", attribution,
  form_type: "contact", submission_id: crypto.randomUUID(), ...extra,
});
const healthBody = (extra: Record<string, unknown> = {}) => ({
  ...person, state: "12", service: "guidance", consent: true, company_fax_hp: "", locale: "es", attribution,
  submission_id: crypto.randomUUID(), ...extra,
});

/** The ledger post runs after the response; wait for it (or for the retries to give up). */
async function settle(ms = 200) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function emailLeadId(email: Email) {
  const id = email.text.match(/^ID de lead: (LD-\S+)$/m)?.[1];
  assert.ok(id, "email has an ID de lead line");
  assert.match(id, leadIdPattern);
  assert.ok(email.subject.endsWith(` · ${id}`), "subject carries the lead ID");
  return id;
}

function assertNoPii(value: unknown) {
  const json = JSON.stringify(value);
  for (const pii of ["Maria", "Lopez", "maria.prueba", "@", "555", "0199", "Quiero"]) assert.ok(!json.includes(pii), `${pii} in ${json}`);
}

beforeEach(() => {
  emails = [];
  ledger = [];
  ledgerCalls = 0;
  resendStatus = 200;
  ledgerMode = "receiver";
  logs.length = 0;
  process.env.LEAD_LEDGER_ENDPOINT = "https://ledger.example.test/leads";
  process.env.LEAD_LEDGER_WEBHOOK_SECRET = "test-webhook-secret";
});

test("contact: the email carries the lead ID, the ledger gets a PII-free record, the browser gets neither", async () => {
  const response = await contact.POST(post("/api/contacto", contactBody({ productId: "cancer" })));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.deepEqual(body, { ok: true });
  await settle();
  assert.equal(emails.length, 1);
  const id = emailLeadId(emails[0]);
  assert.match(emails[0].text, /Atribución \(uso interno\)/);
  assert.equal(ledger.length, 1);
  assert.deepEqual(ledger[0].headers, { "Content-Type": "application/json" });
  assertNoPii(ledger[0].body);
  assert.deepEqual(ledger[0].body, {
    schema_version: 1,
    lead_id: id,
    created_at: ledger[0].body.created_at,
    channel_of_entry: "web_form",
    form_type: "contact",
    product_line: "health",
    language: "es",
    first_source: "meta",
    first_medium: "paid_social",
    first_campaign: "aca_2027",
    first_landing_page: "/",
    last_source: "google",
    last_medium: "cpc",
    last_campaign: "aca_search",
    last_landing_page: "/contacto",
  });
  assert.ok(emails[0].text.includes(`Fecha: ${ledger[0].body.created_at}`));
});

test("employer: product_line employer, English", async () => {
  const response = await contact.POST(post("/api/contacto", contactBody({ source: "/employers", product_line: "employer", attribution: { consent: "denied", last: { source: "linkedin", medium: "paid_social", landing_page: "/employers" } } })));
  assert.equal(response.status, 200);
  await settle();
  assert.equal(ledger.length, 1);
  assert.equal(ledger[0].body.product_line, "employer");
  assert.equal(ledger[0].body.language, "en");
  assert.equal(ledger[0].body.first_source, undefined);
  assert.equal(ledger[0].body.last_source, "linkedin");
  assertNoPii(ledger[0].body);
});

test("web form after ChatGPT: channel stays web_form, AI origin in the ledger attribution", async () => {
  const response = await health.POST(post("/api/health/contact", healthBody({
    attribution: { consent: "granted", first: { source: "chatgpt", medium: "ai_assistant", campaign: "aca_oe_2027", landing_page: "/health" }, last: { source: "chatgpt", medium: "ai_assistant", campaign: "aca_oe_2027", landing_page: "/health" }, referrer: "chatgpt.com" },
  })));
  assert.deepEqual(await response.json(), { ok: true });
  await settle();
  const record = ledger[0].body;
  assert.equal(record.channel_of_entry, "web_form");
  assert.deepEqual([record.first_source, record.last_source, record.last_medium, record.last_campaign], ["chatgpt", "chatgpt", "ai_assistant", "aca_oe_2027"]);
  assert.equal("ai_platform" in record, false);
  assertNoPii(record);
});

test("a retry of the same submission returns success without a second email or ledger record", async () => {
  const body = contactBody();
  assert.equal((await contact.POST(post("/api/contacto", body))).status, 200);
  assert.equal((await contact.POST(post("/api/contacto", body))).status, 200);
  await settle();
  assert.equal(emails.length, 1);
  assert.equal(ledger.length, 1);
  // A new submission is a new lead.
  assert.equal((await contact.POST(post("/api/contacto", contactBody()))).status, 200);
  await settle();
  assert.equal(emails.length, 2);
  assert.notEqual(emailLeadId(emails[0]), emailLeadId(emails[1]));
});

test("an email failure is retried under the same lead ID, and only the delivered lead reaches the ledger", async () => {
  const body = healthBody();
  resendStatus = 500;
  assert.equal((await health.POST(post("/api/health/contact", body))).status, 502);
  await settle();
  assert.equal(ledger.length, 0);
  resendStatus = 200;
  assert.equal((await health.POST(post("/api/health/contact", body))).status, 200);
  await settle();
  assert.equal(emails.length, 1);
  assert.equal(ledger.length, 1);
  assert.equal(ledger[0].body.lead_id, emailLeadId(emails[0]));
});

test("health: state as USPS code, language, product line; no PII", async () => {
  const response = await health.POST(post("/api/health/contact", healthBody({ locale: "en", state: "48" })));
  assert.deepEqual(await response.json(), { ok: true });
  await settle();
  const id = emailLeadId(emails[0]);
  assert.deepEqual(
    [ledger[0].body.lead_id, ledger[0].body.form_type, ledger[0].body.product_line, ledger[0].body.state, ledger[0].body.language],
    [id, "health", "health", "TX", "en"],
  );
  assertNoPii(ledger[0].body);
});

test("an unapproved campaign is left out of the ledger; the lead goes through normally", async () => {
  const response = await contact.POST(post("/api/contacto", contactBody({ attribution: { consent: "denied", last: { source: "chatgpt", medium: "ai_assistant", campaign: "diabetes", landing_page: "/contacto" } } })));
  assert.deepEqual(await response.json(), { ok: true });
  await settle();
  assert.equal(emails.length, 1);
  assert.equal(ledger.length, 1);
  assert.equal(ledger[0].body.last_source, "chatgpt");
  assert.equal(ledger[0].body.last_campaign, undefined);
  assert.ok(!JSON.stringify(ledger[0].body).includes("diabetes"));
});

test("an unapproved source (e.g. diabetes.info) is omitted from the ledger without blocking the lead", async () => {
  const response = await health.POST(post("/api/health/contact", healthBody({ attribution: { consent: "granted", first: { source: "diabetes.info", medium: "referral", campaign: "aca_oe_2027", landing_page: "/health" }, last: { source: "my_prompt", medium: "ai_assistant", landing_page: "/health" } } })));
  assert.deepEqual(await response.json(), { ok: true });
  await settle();
  assert.equal(emails.length, 1);
  assert.equal(ledger.length, 1);
  const record = ledger[0].body;
  assert.deepEqual([record.first_source, record.first_medium, record.first_campaign, record.first_landing_page], [undefined, undefined, undefined, "/health"]);
  assert.deepEqual([record.last_source, record.last_medium, record.last_landing_page], [undefined, undefined, "/health"]);
  assert.ok(!JSON.stringify(record).includes("diabetes") && !JSON.stringify(record).includes("my_prompt"));
});

test("missing ledger config: forms work exactly as before", async () => {
  delete process.env.LEAD_LEDGER_ENDPOINT;
  assert.equal((await contact.POST(post("/api/contacto", contactBody()))).status, 200);
  process.env.LEAD_LEDGER_ENDPOINT = "https://ledger.example.test/leads";
  delete process.env.LEAD_LEDGER_WEBHOOK_SECRET;
  assert.equal((await health.POST(post("/api/health/contact", healthBody()))).status, 200);
  await settle();
  assert.equal(emails.length, 2);
  emails.forEach(emailLeadId);
  assert.equal(ledger.length, 0);
});

test("production without LEAD_ID_SECRET: the visitor succeeds and is emailed, nothing reaches the ledger, one safe warning", async () => {
  delete process.env.LEAD_ID_SECRET;
  process.env.VERCEL_ENV = "production";
  try {
    assert.deepEqual(await (await contact.POST(post("/api/contacto", contactBody()))).json(), { ok: true });
    assert.deepEqual(await (await health.POST(post("/api/health/contact", healthBody()))).json(), { ok: true });
    assert.deepEqual(await (await contact.POST(post("/api/contacto", contactBody({ source: "/employers", product_line: "employer" })))).json(), { ok: true });
    await settle();
    assert.equal(emails.length, 3);
    emails.forEach(emailLeadId);
    assert.equal(ledgerCalls, 0);
    assert.deepEqual(logs, ["LEAD_ID_SECRET is not set; lead IDs are not stable across server instances and leads are not sent to the lead ledger."]);
    assertNoPii(logs);
    assert.ok(!logs.join(" ").includes("test-webhook-secret"));
  } finally {
    process.env.LEAD_ID_SECRET = "test-lead-id-secret";
    delete process.env.VERCEL_ENV;
  }
});

test("ledger unavailable: the visitor's response is unchanged", async () => {
  ledgerMode = "down";
  const response = await contact.POST(post("/api/contacto", contactBody()));
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(emails.length, 1);
  await settle(3_000); // default retries: 500 ms + 2 s
  const failure = logs.find((line) => line.includes("Lead ledger did not record"));
  assert.ok(failure);
  assert.match(failure, /LD-\w{5}-\w{5} \(network_error\)/);
  assert.ok(!failure.includes("Maria") && !failure.includes("test-webhook-secret"));
});

test("wrong webhook secret: receiver answers unauthorized, the visitor still succeeds", async () => {
  process.env.LEAD_LEDGER_WEBHOOK_SECRET = "not-the-receiver-secret";
  const response = await contact.POST(post("/api/contacto", contactBody()));
  assert.deepEqual(await response.json(), { ok: true });
  await settle();
  assert.equal(ledger.length, 0);
  assert.equal(logs.filter((line) => line.includes("unauthorized")).length, 1);
  assert.ok(!logs.join(" ").includes("not-the-receiver-secret"));
});

test("the email's lead ID is the deterministic one for the submission", async () => {
  const body = contactBody();
  await contact.POST(post("/api/contacto", body));
  const { createLeadId } = await import("@/lib/server/lead-id");
  assert.equal(emailLeadId(emails[0]), createLeadId({ key: body.submission_id as string, secret: "test-lead-id-secret" }));
});

test("/work recruiting applications get no lead ID and no ledger record", async () => {
  const response = await contact.POST(post("/api/contacto", contactBody({ source: "/work", form_type: "work", product_line: "work" })));
  assert.equal(response.status, 200);
  await settle();
  assert.equal(emails.length, 1);
  assert.doesNotMatch(emails[0].text, /ID de lead|LD-\w{5}-\w{5}/);
  assert.doesNotMatch(emails[0].subject, /LD-\w{5}-\w{5}/);
  assert.equal(ledger.length, 0);
  // Even an older /work page that does not send form_type.
  await contact.POST(post("/api/contacto", contactBody({ source: "/work", form_type: undefined })));
  await settle();
  assert.equal(ledger.length, 0);
});

test("invalid submissions get no lead ID", async () => {
  assert.equal((await contact.POST(post("/api/contacto", contactBody({ email: "bad" })))).status, 422);
  assert.equal((await health.POST(post("/api/health/contact", healthBody({ consent: false })))).status, 422);
  await settle();
  assert.equal(emails.length + ledger.length, 0);
});
