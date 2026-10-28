"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/analytics";
import { consentChoice, openPreferencesEvent, saveConsent } from "@/lib/analytics/consent";

/**
 * Asks once whether analytics may run. Necessary storage (this choice, form protection) needs no
 * consent; nothing optional loads before the visitor accepts. The privacy policy's
 * "Cambiar mis preferencias de medición" button reopens it.
 */
export function ConsentBanner({ ready }: { ready: boolean }) {
  const pathname = usePathname();
  const english = pathname.startsWith("/employers") || pathname.startsWith("/en/");
  const [open, setOpen] = useState(false);
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    if (ready && !consentChoice()) setOpen(true);
  }, [ready]);

  useEffect(() => {
    const reopen = () => {
      setReopened(true);
      setOpen(true);
    };
    window.addEventListener(openPreferencesEvent, reopen);
    return () => window.removeEventListener(openPreferencesEvent, reopen);
  }, []);

  function choose(analytics: boolean) {
    saveConsent({ analytics });
    // Counts the page the visitor is on once analytics is allowed; a no-op otherwise.
    trackPageView();
    setOpen(false);
    setReopened(false);
  }

  if (!open) return null;

  const accepted = consentChoice()?.analytics === true;
  const t = english
    ? {
        intro: "We use only the storage the site needs to work, such as remembering this choice. With your permission we also use analytics (Google Analytics) to understand, in aggregate, how the site is used. It never receives your form answers. See our ",
        policy: "Privacy policy",
        status: accepted ? "Current choice: analytics accepted." : "Current choice: analytics declined.",
        reject: "Decline analytics",
        accept: "Accept analytics",
      }
    : {
        intro: "Solo usamos el almacenamiento necesario para que el sitio funcione, como recordar esta elección. Con tu permiso también usamos analítica (Google Analytics) para entender, de forma agregada, cómo se usa el sitio. Nunca recibe las respuestas de tus formularios. Consulta la ",
        policy: "política de privacidad",
        status: accepted ? "Tu elección actual: analítica aceptada." : "Tu elección actual: analítica rechazada.",
        reject: "Rechazar analítica",
        accept: "Aceptar analítica",
      };

  const button = "rounded-full px-5 py-2.5 text-xs font-semibold";

  return (
    <div className="fixed inset-x-0 bottom-0 z-[120] px-4 pb-4" role="dialog" aria-live="polite" aria-label={english ? "Measurement preferences" : "Preferencias de medición"}>
      <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl border border-navy/10 bg-white/95 p-5 shadow-[0_18px_50px_-28px_rgba(6,20,49,.55)] backdrop-blur md:flex-row md:items-center md:justify-between">
        <div className="text-sm leading-relaxed text-navy/70">
          <p>
            {t.intro}
            <a href="/privacidad" className="font-semibold underline-offset-4 hover:underline">{t.policy}</a>.
          </p>
          {reopened && <p className="mt-2 font-semibold text-navy">{t.status}</p>}
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <button type="button" onClick={() => choose(false)} className={`${button} border border-navy/20 text-navy`}>{t.reject}</button>
          <button type="button" onClick={() => choose(true)} className={`${button} bg-cyan text-navy`}>{t.accept}</button>
        </div>
      </div>
    </div>
  );
}
