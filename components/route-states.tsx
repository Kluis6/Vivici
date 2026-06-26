import { Skeleton } from "@/components/ui/skeleton";
import { GoHomeFill } from "react-icons/go";

function Block({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        className ??
        "rounded-[2rem] border border-border bg-surface/82 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.14)]"
      }
    >
      {children}
    </div>
  );
}

export function SiteHomeLoadingState() {
  return (
    <main className="mx-auto container flex justify-center items-center w-full h-[80vh] p-4">
      <div className="flex flex-col gap-4">
        <div className="flex size-12 items-center justify-center  bg-accent-soft text-sm font-semibold text-primary-foreground animate-pulse">
          <GoHomeFill className="size-7" />
        </div>
      </div>
    </main>
  );
}

export function SiteCatalogLoadingState() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10">
      <Block className="overflow-hidden rounded-[2.5rem] border border-border bg-[linear-gradient(160deg,rgba(10,23,40,0.96),rgba(7,21,37,0.88))] p-7 shadow-[0_30px_100px_rgba(0,0,0,0.24)] sm:p-9">
        <div className="space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Skeleton className="h-8 w-36 rounded-full" />
                <Skeleton className="h-8 w-28 rounded-full" />
              </div>
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-12 w-[34rem] max-w-full rounded-3xl" />
              <Skeleton className="h-5 w-[30rem] max-w-full" />
            </div>
            <div className="grid gap-3 rounded-[1.8rem] border border-border bg-[rgba(255,241,207,0.08)] p-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div>
                <Skeleton className="h-3 w-16" />
                <Skeleton className="mt-3 h-8 w-12" />
              </div>
              <Skeleton className="hidden h-12 w-px sm:block" />
              <div>
                <Skeleton className="h-3 w-16" />
                <Skeleton className="mt-3 h-8 w-12" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 rounded-[2rem] border border-border bg-[rgba(255,255,255,0.04)] p-5 md:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </Block>

      <section className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Block key={index}>
            <Skeleton className="aspect-[4/3] w-full rounded-[1.6rem]" />
            <Skeleton className="mt-5 h-5 w-28" />
            <Skeleton className="mt-3 h-8 w-5/6" />
            <Skeleton className="mt-3 h-4 w-2/3" />
          </Block>
        ))}
      </section>
    </main>
  );
}

export function SitePromotionsLoadingState() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10">
      <Block className="overflow-hidden rounded-[2.5rem] border border-border bg-[linear-gradient(160deg,rgba(10,23,40,0.96),rgba(7,21,37,0.88))] p-7 shadow-[0_30px_100px_rgba(0,0,0,0.24)] sm:p-9">
        <div className="space-y-6">
          <div className="flex gap-2">
            <Skeleton className="h-8 w-36 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-12 w-[28rem] max-w-full rounded-3xl" />
          <Skeleton className="h-5 w-[34rem] max-w-full" />
        </div>
      </Block>

      <section className="mt-10 grid gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Block key={index}>
            <Skeleton className="h-6 w-52" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-4/5" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((__, innerIndex) => (
                <Skeleton
                  key={innerIndex}
                  className="aspect-[4/3] w-full rounded-[1.4rem]"
                />
              ))}
            </div>
          </Block>
        ))}
      </section>
    </main>
  );
}

export function SitePropertyDetailsLoadingState() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-[2.4rem] border border-border bg-surface/92 shadow-[0_26px_90px_rgba(0,0,0,0.22)]">
            <Skeleton className="aspect-[16/10] w-full rounded-none" />
          </div>
          <Block>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-5 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-5/6" />
          </Block>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                className="aspect-[4/3] w-full rounded-[1.6rem]"
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Block key={index}>
              <Skeleton className="h-8 w-36" />
              <div className="mt-5 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </Block>
          ))}
        </div>
      </section>

      <section className="mt-14 space-y-5">
        <Skeleton className="h-9 w-56" />
        <div className="grid gap-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <Block key={index}>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="mt-4 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-4/5" />
            </Block>
          ))}
        </div>
      </section>
    </main>
  );
}

export function LoginLoadingState() {
  return (
    <main className="noise-bg flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-md rounded-[2rem] border border-border bg-surface/90 p-8 shadow-[0_28px_90px_rgba(0,0,0,0.22)] backdrop-blur">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-4 h-10 w-52" />
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-5/6" />

        <div className="mt-8 space-y-5">
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </section>
    </main>
  );
}

export function AdminOverviewLoadingState() {
  return (
    <section className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Block
            key={index}
            className="rounded-[1.5rem] border border-border bg-surface/82 p-6"
          >
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-4 h-10 w-16" />
          </Block>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        {Array.from({ length: 2 }).map((_, index) => (
          <Block key={index}>
            <Skeleton className="h-3 w-32" />
            <Skeleton className="mt-5 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-5/6" />
            <Skeleton className="mt-2 h-4 w-3/4" />
            <div className="mt-6 grid gap-3">
              {Array.from({ length: 3 }).map((__, innerIndex) => (
                <Skeleton
                  key={innerIndex}
                  className="h-12 w-full rounded-2xl"
                />
              ))}
            </div>
          </Block>
        ))}
      </div>
    </section>
  );
}

export function AdminTableLoadingState({
  eyebrow,
  title,
  actionWidth = "w-32",
}: {
  eyebrow: string;
  title: string;
  actionWidth?: string;
}) {
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-semibold text-foreground">{title}</h2>
        </div>
        <Skeleton className={`h-12 rounded-full ${actionWidth}`} />
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-border bg-surface/82">
        <div className="grid grid-cols-4 gap-4 border-b border-border px-6 py-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-3 w-20" />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-4 gap-4 border-b border-border/60 px-6 py-4 last:border-b-0"
          >
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function AdminPropertyFormLoadingState({ title }: { title: string }) {
  return (
    <div className="space-y-8 rounded-[2rem] border border-border bg-surface/82 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
        <p className="text-sm leading-7 text-muted-foreground">
          Cadastre ou ajuste os dados principais do imóvel para uso público e
          comercial.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className={index === 9 ? "md:col-span-2" : undefined}
          >
            <Skeleton className="mb-2 h-4 w-32" />
            <Skeleton className="h-11 w-full rounded-2xl" />
          </div>
        ))}
      </div>

      <div>
        <Skeleton className="mb-2 h-4 w-24" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className={index === 4 ? "md:col-span-2" : undefined}
          >
            <Skeleton className="mb-2 h-4 w-32" />
            <Skeleton className="h-11 w-full rounded-2xl" />
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-14 w-full rounded-2xl" />
        ))}
      </div>

      <Skeleton className="h-12 w-36 rounded-full" />
    </div>
  );
}

export function AdminCampaignFormLoadingState({ title }: { title: string }) {
  return (
    <div className="space-y-8 rounded-[2rem] border border-border bg-surface/82 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
        <p className="text-sm leading-7 text-muted-foreground">
          Configure campanhas promocionais e conecte os imóveis que devem
          aparecer em promoções públicas.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className={index === 2 ? "md:col-span-2" : undefined}
          >
            <Skeleton className="mb-2 h-4 w-32" />
            <Skeleton className="h-11 w-full rounded-2xl" />
          </div>
        ))}
      </div>

      <div>
        <Skeleton className="mb-2 h-4 w-24" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index}>
            <Skeleton className="mb-2 h-4 w-24" />
            <Skeleton className="h-11 w-full rounded-2xl" />
          </div>
        ))}
      </div>

      <div>
        <Skeleton className="mb-2 h-4 w-40" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>

      <div className="grid gap-5 md:grid-cols-[1fr_auto]">
        <div>
          <Skeleton className="mb-2 h-4 w-40" />
          <Skeleton className="h-11 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-14 w-full rounded-2xl md:w-48 md:self-end" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <div className="grid max-h-96 gap-3 overflow-y-auto rounded-[1.5rem] border border-border bg-white/4 p-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      </div>

      <Skeleton className="h-12 w-40 rounded-full" />
    </div>
  );
}
