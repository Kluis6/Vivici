"use client";

import { motion } from "motion/react";
import { ArrowRightIcon, Building2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";

const highlights = [
  "Captação de imóveis",
  "Gestão de leads",
  "Operação comercial",
  "Base preparada para Vercel e Supabase",
];

const stats = [
  { label: "Stack", value: "Next 16 + Prisma 7" },
  { label: "Banco", value: "Supabase PostgreSQL" },
  { label: "Validação", value: "Zod" },
  { label: "UI Motion", value: "Motion" },
];

export function HomeHero() {
  return (
    <main className="noise-bg flex-1">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-between px-6 py-8 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between border-b border-border pb-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
              Vivici
            </p>
            <h1 className="mt-2 text-xl font-semibold text-foreground">
              Plataforma Imobiliária
            </h1>
          </div>
          <div className="rounded-full border border-border bg-white/60 px-4 py-2 text-sm text-muted backdrop-blur">
            Fundacão inicial pronta para evoluir
          </div>
        </header>

        <div className="grid gap-10 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="space-y-6"
            >
              <p className="max-w-fit rounded-full border border-border bg-surface px-4 py-2 font-mono text-xs uppercase tracking-[0.25em] text-accent-strong">
                Next.js + Supabase + Prisma
              </p>

              <div className="space-y-4">
                <h2 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl">
                  A base da Vivici começa enxuta, rápida e preparada para vender.
                </h2>
                <p className="max-w-2xl text-lg leading-8 text-muted sm:text-xl">
                  Estrutura inicial criada para uma corretora digital com foco em
                  catálogo, atendimento, captação e escala operacional.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
              className="flex flex-col gap-4 sm:flex-row sm:flex-wrap"
            >
              <Button
                size="lg"
                className="h-11 rounded-full px-5"
              >
                <Building2Icon data-icon="inline-start" />
                Estruturar catálogo inicial
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-11 rounded-full px-5"
              >
                Definir autenticação e CRM
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
              {highlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground"
                >
                  {item}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.aside
            initial={{ opacity: 0, scale: 0.98, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14, ease: "easeOut" }}
            className="rounded-[2rem] border border-border bg-surface p-6 shadow-[0_24px_80px_rgba(31,41,55,0.08)]"
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
                  Estado Atual
                </p>
                <span className="rounded-full bg-surface-strong px-3 py-1 text-xs font-medium text-accent-strong">
                  Ready to build
                </span>
              </div>

              <div className="grid gap-3">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: 0.22 + index * 0.06,
                      ease: "easeOut",
                    }}
                    className="rounded-2xl border border-border bg-white/70 p-4"
                  >
                    <p className="text-sm text-muted">{stat.label}</p>
                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {stat.value}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      </section>
    </main>
  );
}
