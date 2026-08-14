"use client";

import { ArrowRight, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Product } from "@/lib/content/products";
import { policyDisclosure } from "@/lib/content/products";

type ProductDialogProps = {
  product: Product | null;
  onClose: () => void;
};

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ProductDialog({ product, onClose }: ProductDialogProps) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!product) return;

    previousFocusRef.current = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 0);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => !element.hasAttribute("disabled"));
      if (!focusable.length) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      previousFocusRef.current?.focus();
    };
  }, [product, onClose]);

  if (!mounted || !product) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-navy/70 p-0 backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-[2rem] bg-white shadow-2xl outline-none sm:rounded-[2rem]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-navy/10 bg-white/95 px-6 py-4 backdrop-blur md:px-10">
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-cyan">{product.eyebrow}</p>
          <button ref={closeRef} type="button" onClick={onClose} aria-label={`Cerrar detalles de ${product.name}`} className="flex h-11 w-11 items-center justify-center rounded-full border border-navy/15 bg-white transition hover:bg-navy hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan">
            <X aria-hidden="true" size={20} />
          </button>
        </div>
        <div className="px-6 pb-10 pt-8 md:px-10 md:pb-12">
          <h2 id={titleId} className="font-display text-4xl leading-tight tracking-tight md:text-6xl font-bold">{product.name}</h2>
          <p id={descriptionId} className="mt-5 text-base leading-relaxed text-navy/65 md:text-lg">{product.overview}</p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <section className="rounded-2xl bg-white p-6 shadow-sm" aria-labelledby={`${titleId}-example`}>
              <h3 id={`${titleId}-example`} className="text-sm font-bold">Un ejemplo sencillo</h3>
              <p className="mt-3 text-sm leading-relaxed text-navy/60">{product.useCase}</p>
              <p className="mt-3 text-xs italic text-navy/45">Ejemplo ilustrativo, no es una promesa de cobertura ni expresa un monto de beneficio.</p>
            </section>
            <section className="rounded-2xl border border-cyan/30 bg-cyan/10 p-6" aria-labelledby={`${titleId}-eligibility`}>
              <h3 id={`${titleId}-eligibility`} className="text-sm font-bold">Elegibilidad — confirmar con la compañía aseguradora</h3>
              <p className="mt-3 text-sm leading-relaxed text-navy/60">{product.eligibility}</p>
            </section>
          </div>

          <section className="mt-6 rounded-2xl border border-navy/10 p-6" aria-labelledby={`${titleId}-disclosure`}>
            <h3 id={`${titleId}-disclosure`} className="text-sm font-bold">Divulgación de la póliza</h3>
            <p className="mt-3 text-xs leading-relaxed text-navy/55">{policyDisclosure}</p>
          </section>

          <div className="mt-8 rounded-2xl bg-navy p-6 text-white md:flex md:items-center md:justify-between md:gap-8">
            <div><h3 className="text-xl font-bold">Confirma qué opción es adecuada para ti.</h3><p className="mt-2 text-sm text-white/60">Recibe orientación personal de un agente de seguros con licencia.</p></div>
            <a href="#contacto" onClick={onClose} className="mt-5 inline-flex shrink-0 items-center gap-2 rounded-full bg-cyan px-6 py-4 text-sm font-semibold text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:mt-0">Contactar a un agente con licencia <ArrowRight aria-hidden="true" size={16} /></a>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
