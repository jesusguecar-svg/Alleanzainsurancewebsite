"use client";

import { useRef } from "react";
import { errorCategoryFor, trackFormError, trackFormStart, trackLeadGenerated, type FormType, type ProductLine } from "./index";

/**
 * form_start on the first change inside the form (once per filled-in form), generate_lead only
 * for a successful server response, form_error with a generic category. Attach `onStart` with
 * `onChangeCapture` on the <form>.
 */
export function useLeadFormTracking(formType: FormType) {
  const started = useRef(false);
  return {
    onStart(productLine?: ProductLine) {
      if (started.current) return;
      started.current = true;
      trackFormStart(formType, productLine);
    },
    success(productLine?: ProductLine) {
      started.current = false;
      trackLeadGenerated(formType, productLine);
    },
    error(status: number | "network" | "validation") {
      trackFormError(formType, errorCategoryFor(status));
    },
  };
}
