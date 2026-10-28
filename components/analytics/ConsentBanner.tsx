"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/analytics";
import { consentChoice, openPreferencesEvent, saveConsent, type ConsentChoice } from "@/lib/analytics/consent";

/**
 * Asks once for the two optional categories. Nothing optional loads before a choice; the
 * privacy policy's "Preferencias de medición" button reopens it.
 */
export function ConsentBanner({ ready }: { ready: boolean }) {
  const pathname = usePathname();
  const english = pathname.startsWith("/employers") || pathname.startsWith("/en/");
  const [open, setOpen] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [draft, setDraft] = useState<ConsentChoice>({ analytics: false, marketing: false });

  useEffect(() => {
    if (ready && !consentChoice()) setOpen(true);
  }, [ready]);

  useEffect(() => {
    const reopen = () => {
      setDraft(consentChoice() ?? { analytics: false, marketing: false });
      setCustomize(true);
      setOpen(true);
    };
    window.addEventListener(openPreferencesEvent, reopen);
    return () => window.removeEventListener(openPreferencesEvent, reopen);
  }, []);

  function choose(choice: ConsentChoice) {
    saveConsent(choice);
    // Counts the page the visitor is on once analytics is allowed; a no-op otherwise.
    trackPageView();
    setOpen(false);
    setCustomize(false);
  }

  if (!open) return null;

  const t = english
    ? {
        intro: "We use optional tools that load only if you allow them: analytics (Google Analytics) to understand how the site is used, and a marketing pixel (Whop). See our ",
        policy: "Privacy policy",
        reject: "Decline",
        settings: "Choose",
        accept: "Accept all",
        save: "Save choices",
        analytics: "Analytics: Google Analytics measures visits and form completions, without your form answers.",
        marketing: "Marketing: Whop pixel.",
      }
    : {
        intro: "Usamos herramientas opcionales que solo se cargan si las permites: analítica (Google Analytics) para entender cómo se usa el sitio y un píxel de marketing (Whop). Consulta la ",
        policy: "política de privacidad",
        reject: "Rechazar",
        settings: "Elegir",
        accept: "Aceptar todo",
        save: "Guardar selección",
        analytics: "Analítica: Google Analytics mide visitas y solicitudes enviadas, sin las respuestas de tus formularios.",
        marketing: "Marketing: píxel de Whop.",
      };

  const button = "rounded-full px-5 py-2.5 text-xs font-semibold";

  return (
    <div className="fixed inset-x-0 bottom-0 z-[120] px-4 pb-4" role="dialog" aria-live="polite" aria-label={english ? "Privacy choices" : "Preferencias de privacidad"}>
      <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl border border-navy/10 bg-white/95 p-5 shadow-[0_18px_50px_-28px_rgba(6,20,49,.55)] backdrop-blur">
        <p className="text-sm leading-relaxed text-navy/70">
          {t.intro}
          <a href="/privacidad" className="font-semibold underline-offset-4 hover:underline">{t.policy}</a>.
        </p>
        {customize && (
          <div className="grid gap-3 text-sm text-navy/80">
            {(["analytics", "marketing"] as const).map((key) => (
              <label key={key} className="flex items-start gap-3">
                <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-navy" checked={draft[key]} onChange={(event) => setDraft({ ...draft, [key]: event.target.checked })} />
                <span>{t[key]}</span>
              </label>
            ))}
          </div>
        )}
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" onClick={() => choose({ analytics: false, marketing: false })} className={`${button} border border-navy/20 text-navy`}>{t.reject}</button>
          {customize ? (
            <button type="button" onClick={() => choose(draft)} className={`${button} border border-navy/20 text-navy`}>{t.save}</button>
          ) : (
            <button type="button" onClick={() => setCustomize(true)} className={`${button} border border-navy/20 text-navy`}>{t.settings}</button>
          )}
          <button type="button" onClick={() => choose({ analytics: true, marketing: true })} className={`${button} bg-cyan text-navy`}>{t.accept}</button>
        </div>
      </div>
    </div>
  );
}
