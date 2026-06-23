import { notFound } from "next/navigation";

import { PropertyForm } from "@/components/admin/property-form";
import { getPrisma } from "@/lib/prisma";

import { savePropertyAction } from "../actions";

type EditPropertyPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params;
  const prisma = getPrisma();

  const [property, states, regions] = await Promise.all([
    prisma.property.findUnique({
      where: { id },
    }),
    prisma.state.findMany({ orderBy: { name: "asc" } }),
    prisma.region.findMany({ orderBy: [{ stateCode: "asc" }, { name: "asc" }] }),
  ]);

  if (!property) {
    notFound();
  }

  return (
    <PropertyForm
      title={`Editar imóvel: ${property.title}`}
      submitLabel="Salvar imóvel"
      action={savePropertyAction}
      states={states}
      regions={regions}
      property={property}
    />
  );
}
