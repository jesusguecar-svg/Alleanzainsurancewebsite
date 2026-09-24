"use client";

import { useEffect, useState } from "react";
import { healthScenes } from "./health-scene-data";
import a from "./scene-actions.module.css";

type SceneId = (typeof healthScenes)[number]["id"];
const files = ["clean", "props", "giver", "receiver", "cash", "toast"] as const;
const texture = (name: string) => `/cinematic/people/decision-${name}-v1.webp`;

/** Keep the original image until every transparent composition layer is decoded. */
export function useSceneAssets() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    Promise.all(files.map(name => {
      const image = new window.Image(); image.src = texture(name);
      return image.decode();
    })).then(() => { if (!cancelled) setReady(true); }).catch(() => { /* Original artwork remains available. */ });
    return () => { cancelled = true; };
  }, []);
  return ready;
}

function ImageLayer({ name }: { name: string }) {
  return <image href={texture(name)} width="1671" height="941" preserveAspectRatio="none" />;
}
function Props({ id }: { id: SceneId }) {
  return <g clipPath={`url(#prop-source-${id})`}><ImageLayer name="props" /></g>;
}

/** Native CSS timelines move separate photographic objects, not the flat scene.
 * Unmounting cancels every timeline, so re-entry always starts at the first beat. */
export function HealthSceneActions({ id }: { id: SceneId }) {
  const scene = healthScenes.find(item => item.id === id)!;
  return <g className={a.action} data-scene-action={id}>
    <defs><clipPath id={`prop-source-${id}`}><path d={scene.path} /></clipPath></defs>
    <ImageLayer name="clean" />
    {id === "loans" && <g data-action="cash-handoff">
      <g className={a.receiver} data-piece="receiver"><g transform="translate(210 376) scale(.38)"><ImageLayer name="receiver" /></g></g>
      <g className={a.cash} data-piece="cash"><g transform="translate(166 377) scale(.32)"><ImageLayer name="cash" /></g></g>
      <g className={a.giver} data-piece="giver"><g transform="translate(-140 30) scale(.9)"><ImageLayer name="giver" /></g></g>
    </g>}
    {id === "family" && <g data-action="family-toast">
      <defs><clipPath id="toast-left"><rect width="835" height="941" /></clipPath><clipPath id="toast-right"><rect x="835" width="836" height="941" /></clipPath></defs>
      <g className={a.leftGlass} data-piece="left-glass"><g transform="translate(1133 126) scale(.25)"><g clipPath="url(#toast-left)"><ImageLayer name="toast" /></g></g></g>
      <g className={a.rightGlass} data-piece="right-glass"><g transform="translate(1133 126) scale(.25)"><g clipPath="url(#toast-right)"><ImageLayer name="toast" /></g></g></g>
    </g>}
    {id === "bills" && <g data-action="unpaid-bills">
      <g className={a.invoice} data-piece="invoice"><Props id={id} /></g>
      <g className={a.stamp}><g transform="rotate(-12 390 731)"><rect x="250" y="695" width="285" height="62" rx="3" fill="#f7efe5" fillOpacity=".94" stroke="#be2927" strokeWidth="3" /><text x="392" y="734" textAnchor="middle" fill="#ad2023" fontSize="24" fontFamily="Arial" fontWeight="700">PAGO PENDIENTE</text></g></g>
    </g>}
    {id === "uncertainty" && <g data-action="financial-pressure">
      <g className={a.newspaper} data-piece="newspaper"><Props id={id} /></g>
      <path className={a.chart} d="M4 49 L24 43 L45 84 L72 75 L89 103 L116 87 L146 127 L168 108 L190 147" fill="none" stroke="#f83c43" strokeWidth="7" pathLength="1" />
    </g>}
    {id === "help" && <g data-action="request-for-help">
      <g className={a.phone} data-piece="phone"><Props id={id} /></g>
      {[0, 1, 2].map(i => <g className={a.notification} key={i} style={{ animationDelay: `${i * .7}s` }}><g transform={`translate(${60 + i * 115} 310)`}><rect width="38" height="33" rx="9" fill="#ce3e62" /><path d="M19 25 L9 15 C2 6 14 3 19 11 C24 3 36 6 29 15Z" fill="white" /></g></g>)}
    </g>}
    {id === "medical" && <g data-action="present-medical-card"><g className={a.card} data-piece="insurance-card"><Props id={id} /></g></g>}
    {id === "benefits" && <g data-action="present-benefit-check"><g className={a.check} data-piece="benefit-check"><Props id={id} /></g></g>}
    {id === "dental" && <g data-action="dental-demonstration">
      <defs><clipPath id="dental-upper"><rect x="1004" y="339" width="112" height="47" /></clipPath><clipPath id="dental-lower"><rect x="945" y="386" width="178" height="111" /></clipPath></defs>
      <g className={a.dental} data-piece="dental-model">
        <g clipPath="url(#dental-lower)"><Props id={id} /></g>
        <g className={a.jaw} data-piece="upper-jaw"><g clipPath="url(#dental-upper)"><Props id={id} /></g></g>
      </g>
    </g>}
  </g>;
}
