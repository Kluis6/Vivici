import { CampaignStatus } from "@/generated/prisma/client";
import { CampaignCard } from "@/components/campaign-card";
import { SiteShell } from "@/components/site-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getPrisma } from "@/lib/prisma";

export default async function PromotionsPage() {
  const prisma = getPrisma();
  const campaigns = await prisma.campaign.findMany({
    where: {
      status: {
        in: [CampaignStatus.ACTIVE, CampaignStatus.SCHEDULED],
      },
    },
    orderBy: [{ isHighlighted: "desc" }, { startsAt: "asc" }, { updatedAt: "desc" }],
    include: {
      properties: {
        orderBy: {
          position: "asc",
        },
        include: {
          property: {
            include: {
              region: true,
            },
          },
        },
      },
    },
  });

  return (
    <SiteShell>
      <main className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10">
        <Card className="overflow-hidden rounded-[2.5rem] border border-border bg-[linear-gradient(160deg,rgba(10,23,40,0.96),rgba(7,21,37,0.88))] py-0 shadow-[0_30px_100px_rgba(0,0,0,0.24)] ring-0">
          <CardContent className="flex flex-col gap-6 p-7 sm:p-9">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Promotion Feed</Badge>
              <Badge variant="outline">{campaigns.length} campanhas</Badge>
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
                Promoções
              </p>
              <h1 className="text-5xl font-semibold tracking-[-0.04em] text-foreground">
                Campanhas promocionais ativas
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
                Centralize lançamentos, chamadas promocionais e oportunidades com
                imóveis vinculados diretamente ao catálogo.
              </p>
            </div>
          </CardContent>
        </Card>

        <section className="mt-10 grid gap-6">
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))
          ) : (
            <div className="rounded-[2rem] border border-border bg-surface/80 p-8 text-muted-foreground">
              Nenhuma campanha ativa no momento.
            </div>
          )}
        </section>
      </main>
    </SiteShell>
  );
}
