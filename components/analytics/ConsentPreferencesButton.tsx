"use client";

import { openConsentPreferences } from "@/lib/analytics/consent";

export function ConsentPreferencesButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={openConsentPreferences} className="font-semibold underline underline-offset-4">
      {label}
    </button>
  );
}
