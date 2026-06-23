import { CampaignForm } from "@/components/admin/campaign-form";
import { getPrisma } from "@/lib/prisma";

import { saveCampaignAction } from "../actions";

export default async function NewCampaignPage() {
  const prisma = getPrisma();
  const properties = await prisma.property.findMany({
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
  });

  return (
    <CampaignForm
      title="Nova campanha"
      submitLabel="Criar campanha"
      action={saveCampaignAction}
      properties={properties}
    />
  );
}
