"use client";

import { useRef } from "react";

/**
 * One key per lead the visitor sends: created on the first submit, reused by every retry of that
 * lead, replaced after a success. The server derives the internal lead ID from it, so a retry after
 * a lost response is recognised instead of becoming a second lead. It is never sent to analytics.
 */
export function useSubmissionId() {
  const key = useRef<string | null>(null);
  return {
    current() {
      key.current ??= newKey();
      return key.current;
    },
    reset() {
      key.current = null;
    },
  };
}

function newKey() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
