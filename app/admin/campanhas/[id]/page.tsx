import { notFound } from "next/navigation";

import { CampaignForm } from "@/components/admin/campaign-form";
import { getPrisma } from "@/lib/prisma";

import { saveCampaignAction } from "../actions";

type EditCampaignPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCampaignPage({ params }: EditCampaignPageProps) {
  const { id } = await params;
  const prisma = getPrisma();

  const [campaign, properties] = await Promise.all([
    prisma.campaign.findUnique({
      where: { id },
      include: {
        properties: {
          select: {
            propertyId: true,
          },
        },
      },
    }),
    prisma.property.findMany({
      where: {
        status: {
          not: "ARCHIVED",
        },
      },
      orderBy: {
        title: "asc",
      },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    }),
  ]);

  if (!campaign) {
    notFound();
  }

  return (
    <CampaignForm
      title={`Editar campanha: ${campaign.name}`}
      submitLabel="Salvar campanha"
      action={saveCampaignAction}
      properties={properties}
      campaign={campaign}
    />
  );
}
