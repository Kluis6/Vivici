import { PropertyForm } from "@/components/admin/property-form";
import { getPrisma } from "@/lib/prisma";

import { savePropertyAction } from "../actions";

export default async function NewPropertyPage() {
  const prisma = getPrisma();
  const [states, regions] = await Promise.all([
    prisma.state.findMany({ orderBy: { name: "asc" } }),
    prisma.region.findMany({ orderBy: [{ stateCode: "asc" }, { name: "asc" }] }),
  ]);

  return (
    <PropertyForm
      title="Novo imóvel"
      submitLabel="Criar imóvel"
      action={savePropertyAction}
      states={states}
      regions={regions}
    />
  );
}
