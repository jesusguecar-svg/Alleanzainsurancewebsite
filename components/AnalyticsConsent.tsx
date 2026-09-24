"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const storageKey = "alleanza-analytics-consent";
const pixelScope = "biz_36KJ2dEIlKiSlt";

type Consent = "granted" | "denied";

function readConsent(): Consent | null {
  try {
    const value = window.localStorage.getItem(storageKey);
    if (value === "granted" || value === "denied") return value;
  } catch {
    return null;
  }
  return null;
}

function loadWhopPixel() {
  const w = window as Window & { whop?: { setScope: (id: string) => void; track: (event: string) => void } };
  if (w.whop || document.getElementById("whop-pixel")) return;
  const script = document.createElement("script");
  script.id = "whop-pixel";
  script.text = `!function(w,d,s,u,n,a,b){if(w[n])return;a=w[n]={q:[],t:+new Date,s:[],o:u,track:function(){a.q.push([+new Date].concat([].slice.call(arguments)))},setScope:function(){a.s=[].slice.call(arguments).filter(function(x){return typeof x==="string"});a.q.push([+new Date,"setScope"].concat(a.s))},scope:function(){var c=[].slice.call(arguments);return{track:function(){a.q.push([+new Date].concat([].slice.call(arguments)).concat([{__scope:c}]))}}}};b=d.createElement(s);b.async=1;b.src=u+"/s.js";d.getElementsByTagName(s)[0].parentNode.insertBefore(b,d.getElementsByTagName(s)[0])}(window,document,"script","https://t.whop.tw","whop");whop.setScope("${pixelScope}");whop.track("page");`;
  document.head.appendChild(script);
}

export function AnalyticsConsent() {
  const pathname = usePathname();
  const english = pathname.startsWith("/employers");
  const [consent, setConsent] = useState<Consent | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    setConsent(stored);
    setReady(true);
    if (stored === "granted") loadWhopPixel();
  }, []);

  function choose(next: Consent) {
    try {
      window.localStorage.setItem(storageKey, next);
    } catch {
      /* private mode: still honor the choice for this visit */
    }
    setConsent(next);
    if (next === "granted") loadWhopPixel();
  }

  if (!ready || consent) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[120] px-4 pb-4">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl border border-navy/10 bg-white/95 p-5 shadow-[0_18px_50px_-28px_rgba(6,20,49,.55)] backdrop-blur md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-relaxed text-navy/70">
          {english
            ? "We use an optional measurement tool to understand how the site is used. It loads only if you accept. See our "
            : "Usamos una herramienta opcional de medición para entender cómo se usa el sitio. Solo se carga si aceptas. Consulta la "}
          <a href="/privacidad" className="font-semibold underline-offset-4 hover:underline">
            {english ? "Privacy policy" : "política de privacidad"}
          </a>
          {english ? "." : "."}
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="rounded-full border border-navy/20 px-5 py-2.5 text-xs font-semibold text-navy"
          >
            {english ? "Decline" : "Rechazar"}
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="rounded-full bg-cyan px-5 py-2.5 text-xs font-semibold text-navy"
          >
            {english ? "Accept" : "Aceptar"}
          </button>
        </div>
      </div>
    </div>
  );
}
