/**
 * Guide dates are calendar days (YYYY-MM-DD) in the office's time zone. Structured data needs a full
 * ISO 8601 datetime with an offset, so a day becomes local midnight in America/Chicago:
 * "2026-11-14" → "2026-11-14T00:00:00-06:00" (CST), "2026-07-01" → "2026-07-01T00:00:00-05:00" (CDT).
 *
 * The sitemap lastmod keeps the plain day; both come from the same updatedDate.
 */
export const guideTimeZone = "America/Chicago";

/** "-06:00" or "-05:00": the Central offset in force at local midnight on that day. */
export function centralOffset(day: string) {
  // US clocks change at 02:00 local time, so midnight still has the previous day's offset.
  // 06:00Z is 00:00 CST or 01:00 CDT: always before the change, never across a day boundary.
  const instant = new Date(`${day}T06:00:00Z`);
  const name = new Intl.DateTimeFormat("en-US", { timeZone: guideTimeZone, timeZoneName: "longOffset" })
    .formatToParts(instant)
    .find((part) => part.type === "timeZoneName")?.value;
  const offset = name?.match(/^GMT([+-]\d{2}:\d{2})$/)?.[1];
  if (!offset) throw new Error(`No Central offset for ${day} (${name})`);
  return offset;
}

/** "2026-11-14" → "2026-11-14T00:00:00-06:00". */
export function centralDateTime(day: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new Error(`Expected YYYY-MM-DD, got ${day}`);
  return `${day}T00:00:00${centralOffset(day)}`;
}
