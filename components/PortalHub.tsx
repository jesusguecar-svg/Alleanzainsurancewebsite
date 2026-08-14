"use client";

import { motion } from "framer-motion";
import { ArrowRight, Briefcase, GraduationCap, HeartPulse, Home, Users } from "lucide-react";
import { SiteFooter } from "./layout/SiteFooter";
import { SiteHeader } from "./layout/SiteHeader";
import { Logo } from "./Logo";
import { portalRoutes, portalNavLinks } from "@/lib/config/routes";
import { phones } from "@/lib/config/contact";
import { ease, useEntrance, useReveal } from "@/lib/motion";

const icons = {
  health: HeartPulse,
  life: Users,
  "property-casualty": Home,
  academy: GraduationCap,
  work: Briefcase,
} as const;

/** Health leads the grid; the rest follow at equal weight. */
const featuredId = "health";

export default function PortalHub() {
  const reveal = useReveal({ y: 40 });
  const entranceTitle = useEntrance({ opacity: 0, y: 40 });
  const entranceLede = useEntrance({ opacity: 0 });

  const featured = portalRoutes.find((route) => route.id === featuredId)!;
  const rest = portalRoutes.filter((route) => route.id !== featuredId);
  const FeaturedIcon = icons[featured.id];

  return (
    <main>
      <div className="noise" />
      <SiteHeader links={portalNavLinks} cta={{ href: "/health", label: "Orientación en salud" }} />

      <section className="relative overflow-hidden bg-navy px-5 pb-24 pt-40 text-white md:pb-32 md:pt-48">
        <div className="absolute inset-0 grid-lines" aria-hidden="true" />
        <div className="absolute left-[58%] top-[10%] h-[420px] w-[420px] rounded-full bg-cyan/15 blur-[130px]" aria-hidden="true" />

        <div className="relative mx-auto max-w-5xl text-center">
          <motion.div {...entranceLede} transition={{ duration: .8 }} className="mx-auto mb-10 w-fit">
            <Logo light width={260} />
          </motion.div>

          <motion.h1 {...entranceTitle} transition={{ delay: .15, duration: 1, ease }} className="font-display text-[clamp(2.6rem,5.6vw,4.6rem)] font-bold leading-[1.03] tracking-[-.03em]">
            Elige el camino correcto para proteger lo que más importa.
          </motion.h1>

          <motion.p {...entranceLede} transition={{ delay: .5, duration: 1 }} className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
            Alleanza conecta a familias, clientes y futuros agentes con orientación clara en salud,
            vida, propiedad, academia y carrera.
          </motion.p>
        </div>
      </section>

      <section className="bg-white px-5 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.a
            {...reveal}
            href={featured.href}
            className="group relative flex flex-col gap-6 overflow-hidden rounded-[2rem] border border-navy/10 bg-mist p-8 transition duration-300 hover:-translate-y-1 hover:border-cyan/40 hover:shadow-[0_30px_70px_-40px_rgba(6,20,49,.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan md:flex-row md:items-center md:justify-between md:p-12"
          >
            <div className="max-w-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-cyan">
                <FeaturedIcon aria-hidden="true" size={26} />
              </div>
              <h2 className="mt-7 font-display text-4xl font-bold tracking-tight md:text-5xl">{featured.title}</h2>
              <p className="mt-3 text-lg leading-relaxed text-navy/60">{featured.description}</p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-cyan px-7 py-4 text-sm font-semibold text-navy">
              Explorar salud <ArrowRight aria-hidden="true" size={16} className="transition group-hover:translate-x-1" />
            </span>
          </motion.a>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {rest.map((route, i) => {
              const Icon = icons[route.id];
              return (
                <motion.a
                  key={route.id}
                  {...reveal}
                  transition={{ duration: .7, delay: Math.min(i, 3) * .08, ease }}
                  href={route.href}
                  className="group flex h-full flex-col rounded-[1.75rem] border border-navy/10 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-cyan/40 hover:shadow-[0_25px_60px_-35px_rgba(6,20,49,.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan/12 text-navy">
                    <Icon aria-hidden="true" size={22} />
                  </div>
                  <h2 className="mt-6 font-display text-2xl font-semibold">{route.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/55">{route.description}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
                    Ver más <ArrowRight aria-hidden="true" size={15} className="transition group-hover:translate-x-1" />
                  </span>
                </motion.a>
              );
            })}
          </div>

          <motion.p {...reveal} className="mt-12 text-center text-sm text-navy/55">
            ¿Prefieres hablar directamente?{" "}
            <a href={`tel:${phones[0].href}`} className="font-semibold text-navy underline-offset-4 hover:underline">
              {phones[0].label}
            </a>
          </motion.p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
