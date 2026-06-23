import Link from "next/link";

import { getPrisma } from "@/lib/prisma";

export default async function AdminCampaignsPage() {
  const prisma = getPrisma();
  const campaigns = await prisma.campaign.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      properties: true,
    },
  });

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            Campanhas
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-foreground">
            Promoções e distribuição
          </h2>
        </div>
        <Link
          href="/admin/campanhas/nova"
          className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          Nova campanha
        </Link>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-border bg-surface/82">
        <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr] gap-4 border-b border-border px-6 py-4 text-xs uppercase tracking-[0.24em] text-muted">
          <span>Campanha</span>
          <span>Status</span>
          <span>Imóveis</span>
          <span>Ação</span>
        </div>
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr] gap-4 border-b border-border/60 px-6 py-4 text-sm text-muted-foreground last:border-b-0"
          >
            <div>
              <p className="font-medium text-foreground">{campaign.name}</p>
              <p className="mt-1">{campaign.headline}</p>
            </div>
            <div>{campaign.status}</div>
            <div>{campaign.properties.length}</div>
            <div>
              <Link href={`/admin/campanhas/${campaign.id}`} className="text-accent-soft">
                Editar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
