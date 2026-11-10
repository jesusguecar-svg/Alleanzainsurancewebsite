import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { openEnrollmentCopy, openEnrollmentPhase } from "@/lib/content/open-enrollment";

test("the notice follows the HealthCare.gov 2027 calendar, ending each phase at 23:59 Pacific", () => {
  assert.equal(openEnrollmentPhase(new Date("2026-10-31T23:59:59Z")), null);
  assert.equal(openEnrollmentPhase(new Date("2026-11-01T00:00:00Z")), "january");
  assert.equal(openEnrollmentPhase(new Date("2026-11-10T15:00:00Z")), "january");
  // Dec 15, 11:30 PM Pacific is still Dec 15 for a California reader.
  assert.equal(openEnrollmentPhase(new Date("2026-12-16T07:30:00Z")), "january");
  assert.equal(openEnrollmentPhase(new Date("2026-12-16T08:00:00Z")), "february");
  assert.equal(openEnrollmentPhase(new Date("2027-01-16T07:59:59Z")), "february");
  assert.equal(openEnrollmentPhase(new Date("2027-01-16T08:00:00Z")), null);
});

test("each phase states the right deadline and start date in both languages, with the required caveats", () => {
  const { es, en } = openEnrollmentCopy;
  assert.match(es.january.message, /a más tardar el 15 de diciembre.*1 de enero/);
  assert.match(en.january.message, /by December 15.*January 1/);
  assert.match(es.february.message, /a más tardar el 15 de enero.*1 de febrero/);
  assert.match(en.february.message, /by January 15.*February 1/);
  for (const copy of [es.january, es.february]) assert.match(copy.note, /CuidadoDeSalud\.gov.*primera prima.*mercado propio/);
  for (const copy of [en.january, en.february]) assert.match(copy.note, /HealthCare\.gov.*first premium.*own marketplace/);
});

test("the notice promises no savings, prices or approval", () => {
  const promise = /\b(gratis|free|\$0|garantiz|guarantee|subsid|ahorr|savings|aprobad|approved)\w*/i;
  assert.doesNotMatch(JSON.stringify(openEnrollmentCopy), promise);
});

test("the notice links only to the existing form, phone line and WhatsApp, with tracked CTAs", () => {
  const source = readFileSync("components/health/OpenEnrollmentNotice.tsx", "utf8");
  const hrefs = [...source.matchAll(/href=([^\s>]+)/g)].map((match) => match[1]);
  assert.deepEqual(hrefs, ['"#contacto"', "{`tel:${primaryPhone.href}`}", "{getHealthWhatsapp(locale)}"]);
  assert.match(source, /data-cta="health_oe_advisor"/);
  assert.match(source, /data-cta-location="oe_notice"/);
  // No new form, field, script or tracking call.
  assert.doesNotMatch(source, /<form|<input|<script|dataLayer|gtag|fetch\(/);
  const page = readFileSync("components/health/HealthExperience.tsx", "utf8");
  assert.ok(page.indexOf("<OpenEnrollmentNotice") < page.indexOf("<CinematicHealthHero"), "notice renders before the hero");
  assert.match(page, /<CompareSection locale=\{locale\} \/>/, "comparison experience kept");
});
