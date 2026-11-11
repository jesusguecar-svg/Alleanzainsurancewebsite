import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { calendarDate, openEnrollmentCopy, openEnrollmentDates, openEnrollmentPhaseForDate, serverOpenEnrollmentPhase } from "@/lib/content/open-enrollment";

test("the published 2027 dates: Nov 1 start, Dec 15 for Jan 1 coverage, Jan 15 end (all inclusive)", () => {
  assert.deepEqual({ ...openEnrollmentDates }, { start: "2026-11-01", januaryCoverageDeadline: "2026-12-15", end: "2027-01-15" });
  assert.equal(openEnrollmentPhaseForDate("2026-10-31"), null);
  assert.equal(openEnrollmentPhaseForDate("2026-11-01"), "january");
  assert.equal(openEnrollmentPhaseForDate("2026-12-15"), "january");
  assert.equal(openEnrollmentPhaseForDate("2026-12-16"), "february");
  assert.equal(openEnrollmentPhaseForDate("2027-01-15"), "february");
  assert.equal(openEnrollmentPhaseForDate("2027-01-16"), null);
});

test("each reader gets the phase of their own calendar date on Dec 15/16 and Jan 15/16", () => {
  const phaseIn = (iso: string, zone: string) => openEnrollmentPhaseForDate(calendarDate(new Date(iso), zone));
  // 12:30 AM Dec 16 in New York = 9:30 PM Dec 15 in Los Angeles = 7:30 PM Dec 15 in Honolulu.
  const justAfterEasternMidnight = "2026-12-16T05:30:00Z";
  assert.equal(phaseIn(justAfterEasternMidnight, "America/New_York"), "february");
  assert.equal(phaseIn(justAfterEasternMidnight, "America/Chicago"), "january");
  assert.equal(phaseIn(justAfterEasternMidnight, "America/Los_Angeles"), "january");
  assert.equal(phaseIn(justAfterEasternMidnight, "Pacific/Honolulu"), "january");
  // 11:59 PM Dec 15 in New York: still the January deadline there.
  assert.equal(phaseIn("2026-12-16T04:59:00Z", "America/New_York"), "january");
  // 12:01 AM Dec 16 in Honolulu: February everywhere in the US.
  for (const zone of ["America/New_York", "America/Chicago", "America/Denver", "America/Phoenix", "America/Los_Angeles", "America/Anchorage", "Pacific/Honolulu"]) {
    assert.equal(phaseIn("2026-12-16T10:01:00Z", zone), "february", zone);
  }
  // Jan 16, 12:30 AM in New York: the notice is gone there, still shown in Los Angeles (Jan 15, 9:30 PM).
  assert.equal(phaseIn("2027-01-16T05:30:00Z", "America/New_York"), null);
  assert.equal(phaseIn("2027-01-16T05:30:00Z", "America/Los_Angeles"), "february");
});

test("the server never renders a deadline that has passed for some US reader", () => {
  assert.equal(serverOpenEnrollmentPhase(new Date("2026-11-11T18:00:00Z")), "january");
  assert.equal(serverOpenEnrollmentPhase(new Date("2026-12-16T04:59:00Z")), "january"); // 11:59 PM Dec 15 Eastern
  assert.equal(serverOpenEnrollmentPhase(new Date("2026-12-16T05:00:00Z")), "pending"); // midnight Eastern
  assert.equal(serverOpenEnrollmentPhase(new Date("2026-12-16T09:59:00Z")), "pending"); // 11:59 PM Dec 15 Hawaii
  assert.equal(serverOpenEnrollmentPhase(new Date("2026-12-16T10:00:00Z")), "february"); // midnight Hawaii
  assert.equal(serverOpenEnrollmentPhase(new Date("2027-01-16T07:00:00Z")), "pending");
  assert.equal(serverOpenEnrollmentPhase(new Date("2027-01-16T10:00:00Z")), null);
  assert.equal(serverOpenEnrollmentPhase(new Date("2026-10-31T12:00:00Z")), null);
});

test("the browser re-checks the phase at local midnight and when the tab is shown again", () => {
  const source = readFileSync("components/health/OpenEnrollmentNotice.tsx", "utf8");
  assert.match(source, /readerOpenEnrollmentPhase\(\)/);
  assert.match(source, /nextMidnight/);
  assert.match(source, /visibilitychange/);
  assert.match(source, /phase === "pending"\) return null/);
  assert.match(source, /useState\(serverPhase\)/, "first render uses the server's phase, so hydration matches");
  for (const page of ["app/(es)/health/page.tsx", "app/(en)/en/health/page.tsx"]) {
    assert.match(readFileSync(page, "utf8"), /openEnrollmentPhase=\{serverOpenEnrollmentPhase\(\)\}/, page);
  }
});

test("each phase states the right deadline and start date in both languages, with the required caveats", () => {
  const { es, en } = openEnrollmentCopy;
  assert.match(es.january.message, /a más tardar el 15 de diciembre.*1 de enero/);
  assert.match(en.january.message, /by December 15.*January 1/);
  assert.match(es.february.message, /a más tardar el 15 de enero.*1 de febrero/);
  assert.match(en.february.message, /by January 15.*February 1/);
  for (const copy of [es.january, es.february]) assert.match(copy.note, /CuidadoDeSalud\.gov.*primera prima.*propio mercado, confirma las fechas/);
  for (const copy of [en.january, en.february]) assert.match(copy.note, /HealthCare\.gov.*first premium.*own marketplace, confirm the dates/);
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
