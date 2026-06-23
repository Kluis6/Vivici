import type { DevelopmentStage, Property, PropertyLifecycleStatus, PropertyType, Region, State } from "@/generated/prisma/client";

import {
  developmentStageOptions,
  propertyStatusOptions,
  propertyTypeOptions,
} from "@/lib/catalog";

const fieldClassName =
  "h-11 w-full rounded-2xl border border-border bg-white/6 px-4 text-sm text-foreground outline-none transition focus:border-[var(--border-strong)]";
const textareaClassName =
  "min-h-32 w-full rounded-2xl border border-border bg-white/6 px-4 py-3 text-sm text-foreground outline-none transition focus:border-[var(--border-strong)]";

type PropertyFormProps = {
  title: string;
  submitLabel: string;
  action: (formData: FormData) => Promise<void>;
  states: State[];
  regions: Region[];
  property?: Pick<
    Property,
    | "id"
    | "title"
    | "slug"
    | "sourceUrl"
    | "stateCode"
    | "regionId"
    | "neighborhood"
    | "propertyType"
    | "status"
    | "developmentStage"
    | "bedroomsLabel"
    | "highlightText"
    | "descriptionText"
    | "coverImageUrl"
    | "heroImageDesktopUrl"
    | "heroImageMobileUrl"
    | "videoTourUrl"
    | "presentationVideoUrl"
    | "isFeatured"
    | "isSoldOut"
    | "hidePrice"
  >;
};

export function PropertyForm({
  title,
  submitLabel,
  action,
  states,
  regions,
  property,
}: PropertyFormProps) {
  return (
    <form action={action} className="space-y-8 rounded-[2rem] border border-border bg-surface/82 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
        <p className="text-sm leading-7 text-muted-foreground">
          Cadastre ou ajuste os dados principais do imóvel para uso público e comercial.
        </p>
      </div>

      {property?.id ? <input type="hidden" name="id" value={property.id} /> : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Nome do imóvel</span>
          <input name="title" required defaultValue={property?.title ?? ""} className={fieldClassName} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Slug</span>
          <input name="slug" required defaultValue={property?.slug ?? ""} className={fieldClassName} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">URL de origem</span>
          <input name="sourceUrl" defaultValue={property?.sourceUrl ?? ""} className={fieldClassName} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Bairro</span>
          <input
            name="neighborhood"
            required
            defaultValue={property?.neighborhood ?? ""}
            className={fieldClassName}
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Estado</span>
          <select name="stateCode" required defaultValue={property?.stateCode ?? "SP"} className={fieldClassName}>
            {states.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Região</span>
          <select name="regionId" defaultValue={property?.regionId ?? ""} className={fieldClassName}>
            <option value="">Sem região vinculada</option>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name} ({region.stateCode})
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Tipo</span>
          <select
            name="propertyType"
            defaultValue={(property?.propertyType as PropertyType | null) ?? ""}
            className={fieldClassName}
          >
            <option value="">Não definido</option>
            {propertyTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Status do imóvel</span>
          <select
            name="status"
            required
            defaultValue={(property?.status as PropertyLifecycleStatus | null) ?? "DRAFT"}
            className={fieldClassName}
          >
            {propertyStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Fase do empreendimento</span>
          <select
            name="developmentStage"
            defaultValue={(property?.developmentStage as DevelopmentStage | null) ?? ""}
            className={fieldClassName}
          >
            <option value="">Não definida</option>
            {developmentStageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Dormitórios</span>
          <input
            name="bedroomsLabel"
            defaultValue={property?.bedroomsLabel ?? ""}
            placeholder="Ex.: 2 dorms. com suíte"
            className={fieldClassName}
          />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-foreground">Chamada comercial</span>
          <input
            name="highlightText"
            defaultValue={property?.highlightText ?? ""}
            placeholder="Ex.: 2 dorms com varanda e rooftop"
            className={fieldClassName}
          />
        </label>
      </div>

      <label className="space-y-2">
        <span className="text-sm font-medium text-foreground">Descrição</span>
        <textarea
          name="descriptionText"
          defaultValue={property?.descriptionText ?? ""}
          className={textareaClassName}
        />
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Imagem de capa</span>
          <input name="coverImageUrl" defaultValue={property?.coverImageUrl ?? ""} className={fieldClassName} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Hero desktop</span>
          <input
            name="heroImageDesktopUrl"
            defaultValue={property?.heroImageDesktopUrl ?? ""}
            className={fieldClassName}
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Hero mobile</span>
          <input
            name="heroImageMobileUrl"
            defaultValue={property?.heroImageMobileUrl ?? ""}
            className={fieldClassName}
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Vídeo tour</span>
          <input name="videoTourUrl" defaultValue={property?.videoTourUrl ?? ""} className={fieldClassName} />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-foreground">Vídeo de apresentação</span>
          <input
            name="presentationVideoUrl"
            defaultValue={property?.presentationVideoUrl ?? ""}
            className={fieldClassName}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { name: "isFeatured", label: "Exibir como destaque", checked: property?.isFeatured ?? false },
          { name: "isSoldOut", label: "Marcar como vendido", checked: property?.isSoldOut ?? false },
          { name: "hidePrice", label: "Ocultar preço", checked: property?.hidePrice ?? false },
        ].map((item) => (
          <label
            key={item.name}
            className="flex items-center gap-3 rounded-2xl border border-border bg-white/4 px-4 py-3 text-sm text-foreground"
          >
            <input type="checkbox" name={item.name} defaultChecked={item.checked} />
            {item.label}
          </label>
        ))}
      </div>

      <button type="submit" className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
        {submitLabel}
      </button>
    </form>
  );
}
