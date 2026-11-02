"use client";

import { useState } from "react";
import { HealthContact } from "@/components/health/HealthContact";
import s from "@/components/health/health.module.css";
import p from "@/components/health/platform.module.css";
import f from "./guide-form.module.css";

/** The English guides' lead form: the health page's form, unchanged. */
export function GuideContactForm() {
  const [state, setState] = useState("");
  const [service, setService] = useState("guidance");
  return <div className={`${s.page} ${p.platform} ${f.form}`}><div className={p.advisor}><HealthContact locale="en" selectedState={state} onState={setState} selectedService={service} onService={setService} /></div></div>;
}
