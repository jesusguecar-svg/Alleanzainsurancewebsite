"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, GraduationCap, Home, Users } from "lucide-react";
import { SiteFooter } from "./layout/SiteFooter";
import { SiteHeader } from "./layout/SiteHeader";
import { portalNavLinks } from "@/lib/config/routes";
import { phones } from "@/lib/config/contact";
import { ease, useEntrance, useReveal } from "@/lib/motion";

/**
 * Icons are resolved here by key rather than passed in as props: the route files
 * are server components, and React cannot serialise a component across the
 * server/client boundary.
 */
const icons = {
  life: Users,
  "property-casualty": Home,
  academy: GraduationCap,
} as const;

export type PlaceholderIcon = keyof typeof icons;

export type PlaceholderCta = {
  href: string;
  label: string;
  external?: boolean;
};

/**
 * Branded shell for a spoke that does not have a full page yet.
 *
 * Deliberately makes no product claims: it says what the line of business is
 * about and offers a way to talk to a licensed agent. No figures, testimonials
 * or carrier names — those stay behind the verified-facts gate.
 */
export function PlaceholderPage({
  eyebrow,
  title,
  intro,
  points,
  icon,
  primaryCta,
  secondaryCta,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  points: string[];
  icon: PlaceholderIcon;
  primaryCta: PlaceholderCta;
  secondaryCta?: PlaceholderCta;
}) {
  const reveal = useReveal({ y: 40 });
  const entranceTitle = useEntrance({ opacity: 0, y: 40 });
  const entranceLede = useEntrance({ opacity: 0 });
  const Icon = icons[icon];

  const ctaProps = (cta: PlaceholderCta) =>
    cta.external ? { target: "_blank", rel: "noopener noreferrer" as const } : {};

  return (
    <main>
      <div className="noise" />
      <SiteHeader links={portalNavLinks} cta={{ href: "/health", label: "Orientación en salud" }} />

      <section className="relative overflow-hidden bg-navy px-5 pb-24 pt-40 text-white md:pb-32 md:pt-48">
        <div className="absolute inset-0 grid-lines" aria-hidden="true" />
        <div className="absolute left-[60%] top-[12%] h-96 w-96 rounded-full bg-cyan/12 blur-[130px]" aria-hidden="true" />

        <div className="relative mx-auto max-w-3xl">
          <motion.div {...entranceLede} transition={{ duration: .8 }} className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan text-navy">
            <Icon aria-hidden="true" size={26} />
          </motion.div>

          <motion.p {...entranceLede} transition={{ delay: .1, duration: .8 }} className="mt-8 text-xs font-semibold uppercase tracking-[.22em] text-cyan">
            {eyebrow}
          </motion.p>

          <motion.h1 {...entranceTitle} transition={{ delay: .2, duration: 1, ease }} className="mt-5 font-display text-[clamp(2.4rem,5.2vw,4rem)] font-bold leading-[1.05] tracking-[-.03em]">
            {title}
          </motion.h1>

          <motion.p {...entranceLede} transition={{ delay: .5, duration: 1 }} className="mt-7 text-lg leading-relaxed text-white/65">
            {intro}
          </motion.p>
        </div>
      </section>

      <section className="bg-white px-5 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <motion.ul {...reveal} className="grid gap-3 sm:grid-cols-2">
            {points.map((point) => (
              <li key={point} className="rounded-2xl border border-navy/10 bg-mist/60 p-6 text-sm leading-relaxed text-navy/65">
                {point}
              </li>
            ))}
          </motion.ul>

          <motion.div {...reveal} className="mt-10 rounded-[2rem] border border-navy/10 bg-mist p-8 md:p-10">
            <h2 className="font-display text-2xl font-semibold md:text-3xl">Esta sección está en preparación.</h2>
            <p className="mt-3 text-sm leading-relaxed text-navy/60">
              Mientras tanto, puedes hablar con un agente de seguros con licencia y resolver tus
              dudas sin compromiso.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={primaryCta.href}
                {...ctaProps(primaryCta)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan px-7 py-4 text-sm font-semibold text-navy transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
              >
                {primaryCta.label} <ArrowRight aria-hidden="true" size={16} />
              </a>

              {secondaryCta && (
                <a
                  href={secondaryCta.href}
                  {...ctaProps(secondaryCta)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-navy/20 px-7 py-4 text-sm font-semibold text-navy transition hover:border-navy/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
                >
                  {secondaryCta.label}
                </a>
              )}
            </div>

            <p className="mt-6 text-sm text-navy/55">
              También puedes llamarnos:{" "}
              <a href={`tel:${phones[0].href}`} className="font-semibold text-navy underline-offset-4 hover:underline">
                {phones[0].label}
              </a>
            </p>
          </motion.div>

          <motion.a {...reveal} href="/" className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-navy transition hover:text-cyan">
            <ArrowLeft aria-hidden="true" size={16} /> Volver al portal
          </motion.a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
