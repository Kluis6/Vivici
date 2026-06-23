import Link from "next/link";

import { getPrisma } from "@/lib/prisma";

export default async function AdminPropertiesPage() {
  const prisma = getPrisma();
  const properties = await prisma.property.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      region: true,
    },
  });

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            Cadastro de imóveis
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-foreground">
            Listagem administrativa
          </h2>
        </div>
        <Link
          href="/admin/imoveis/novo"
          className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          Novo imóvel
        </Link>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-border bg-surface/82">
        <div className="grid grid-cols-[1.6fr_1fr_0.8fr_0.8fr] gap-4 border-b border-border px-6 py-4 text-xs uppercase tracking-[0.24em] text-muted">
          <span>Imóvel</span>
          <span>Região</span>
          <span>Status</span>
          <span>Ação</span>
        </div>
        {properties.map((property) => (
          <div
            key={property.id}
            className="grid grid-cols-[1.6fr_1fr_0.8fr_0.8fr] gap-4 border-b border-border/60 px-6 py-4 text-sm text-muted-foreground last:border-b-0"
          >
            <div>
              <p className="font-medium text-foreground">{property.title}</p>
              <p className="mt-1">{property.slug}</p>
            </div>
            <div>
              {property.neighborhood}
              {property.region ? ` • ${property.region.name}` : ""}
            </div>
            <div>{property.status}</div>
            <div>
              <Link href={`/admin/imoveis/${property.id}`} className="text-accent-soft">
                Editar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
