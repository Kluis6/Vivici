import type {
  Campaign,
  CampaignChannel,
  CampaignPlacement,
  CampaignProperty,
  CampaignStatus,
  PromotionType,
  Property,
} from "@/generated/prisma/client";

import {
  campaignChannelOptions,
  campaignPlacementOptions,
  campaignStatusOptions,
  promotionTypeOptions,
} from "@/lib/catalog";

const fieldClassName =
  "h-11 w-full rounded-2xl border border-border bg-white/6 px-4 text-sm text-foreground outline-none transition focus:border-[var(--border-strong)]";
const textareaClassName =
  "min-h-32 w-full rounded-2xl border border-border bg-white/6 px-4 py-3 text-sm text-foreground outline-none transition focus:border-[var(--border-strong)]";

type CampaignFormProps = {
  title: string;
  submitLabel: string;
  action: (formData: FormData) => Promise<void>;
  properties: Pick<Property, "id" | "title" | "slug">[];
  campaign?: Pick<
    Campaign,
    | "id"
    | "slug"
    | "name"
    | "headline"
    | "description"
    | "status"
    | "channel"
    | "placement"
    | "promotionType"
    | "ctaLabel"
    | "ctaUrl"
    | "rulesText"
    | "budgetInCents"
    | "startsAt"
    | "endsAt"
    | "isHighlighted"
  > & {
    properties: Pick<CampaignProperty, "propertyId">[];
  };
};

export function CampaignForm({
  title,
  submitLabel,
  action,
  properties,
  campaign,
}: CampaignFormProps) {
  const selectedPropertyIds = new Set(campaign?.properties.map((item) => item.propertyId) ?? []);

  return (
    <form action={action} className="space-y-8 rounded-[2rem] border border-border bg-surface/82 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
        <p className="text-sm leading-7 text-muted-foreground">
          Configure campanhas promocionais e conecte os imóveis que devem aparecer em promoções públicas.
        </p>
      </div>

      {campaign?.id ? <input type="hidden" name="id" value={campaign.id} /> : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Nome interno</span>
          <input name="name" required defaultValue={campaign?.name ?? ""} className={fieldClassName} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Slug</span>
          <input name="slug" required defaultValue={campaign?.slug ?? ""} className={fieldClassName} />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-foreground">Headline pública</span>
          <input
            name="headline"
            required
            defaultValue={campaign?.headline ?? ""}
            className={fieldClassName}
          />
        </label>
      </div>

      <label className="space-y-2">
        <span className="text-sm font-medium text-foreground">Descrição</span>
        <textarea name="description" defaultValue={campaign?.description ?? ""} className={textareaClassName} />
      </label>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Status</span>
          <select
            name="status"
            required
            defaultValue={(campaign?.status as CampaignStatus | null) ?? "DRAFT"}
            className={fieldClassName}
          >
            {campaignStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Canal</span>
          <select
            name="channel"
            defaultValue={(campaign?.channel as CampaignChannel | null) ?? "SITE"}
            className={fieldClassName}
          >
            {campaignChannelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Posição</span>
          <select
            name="placement"
            defaultValue={(campaign?.placement as CampaignPlacement | null) ?? "HIGHLIGHT"}
            className={fieldClassName}
          >
            {campaignPlacementOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Tipo promocional</span>
          <select
            name="promotionType"
            defaultValue={(campaign?.promotionType as PromotionType | null) ?? "OTHER"}
            className={fieldClassName}
          >
            {promotionTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">CTA label</span>
          <input name="ctaLabel" defaultValue={campaign?.ctaLabel ?? ""} className={fieldClassName} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">CTA URL</span>
          <input name="ctaUrl" defaultValue={campaign?.ctaUrl ?? ""} className={fieldClassName} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Início</span>
          <input
            type="datetime-local"
            name="startsAt"
            defaultValue={campaign?.startsAt ? new Date(campaign.startsAt.getTime() - campaign.startsAt.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""}
            className={fieldClassName}
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Fim</span>
          <input
            type="datetime-local"
            name="endsAt"
            defaultValue={campaign?.endsAt ? new Date(campaign.endsAt.getTime() - campaign.endsAt.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""}
            className={fieldClassName}
          />
        </label>
      </div>

      <label className="space-y-2">
        <span className="text-sm font-medium text-foreground">Regras ou observações</span>
        <textarea name="rulesText" defaultValue={campaign?.rulesText ?? ""} className={textareaClassName} />
      </label>

      <div className="grid gap-5 md:grid-cols-[1fr_auto]">
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Orçamento em centavos</span>
          <input
            name="budgetInCents"
            defaultValue={campaign?.budgetInCents?.toString() ?? ""}
            className={fieldClassName}
          />
        </label>
        <label className="flex items-center gap-3 rounded-2xl border border-border bg-white/4 px-4 py-3 text-sm text-foreground md:self-end">
          <input type="checkbox" name="isHighlighted" defaultChecked={campaign?.isHighlighted ?? false} />
          Exibir em destaque
        </label>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Imóveis vinculados</h2>
        <div className="grid max-h-96 gap-3 overflow-y-auto rounded-[1.5rem] border border-border bg-white/4 p-4 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <label
              key={property.id}
              className="flex items-start gap-3 rounded-2xl border border-border bg-surface/60 px-4 py-3 text-sm text-foreground"
            >
              <input
                type="checkbox"
                name="propertyIds"
                value={property.id}
                defaultChecked={selectedPropertyIds.has(property.id)}
              />
              <span>
                <span className="block font-medium">{property.title}</span>
                <span className="block text-xs text-muted-foreground">{property.slug}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <button type="submit" className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
        {submitLabel}
      </button>
    </form>
  );
}
