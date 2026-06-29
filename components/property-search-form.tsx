"use client";

import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";

type PropertySearchFormProps = {
  params: {
    q?: string;
    state?: string;
    region?: string; 
    stage?: string;
    bedrooms?: string;
  };
  states: ReadonlyArray<{ code: string; name: string }>;
  regions: ReadonlyArray<{ id: string; slug: string; name: string; stateCode: string }>;
  stageOptions: ReadonlyArray<{ value: string; label: string }>;
};

export function PropertySearchForm({
  params,
  states,
  regions,
  stageOptions,
}: PropertySearchFormProps) {
  const [selectedState, setSelectedState] = useState(params.state ?? "");
  const [selectedRegion, setSelectedRegion] = useState(params.region ?? "");

  const filteredRegions = selectedState
    ? regions.filter((region) => region.stateCode === selectedState)
    : regions;

  useEffect(() => {
    if (
      selectedRegion &&
      !filteredRegions.some((region) => region.slug === selectedRegion)
    ) {
      setSelectedRegion("");
    }
  }, [filteredRegions, selectedRegion]);

  return (
    <form className="flex w-full flex-col gap-4 border border-border bg-[rgba(255,255,255,0.04)] p-4 md:flex-row">
      <select
        name="state"
        value={selectedState}
        onChange={(event) => setSelectedState(event.target.value)}
        className="h-12 w-full rounded-none border border-border bg-white/6 px-4 text-sm text-foreground outline-none"
      >
        <option value="">Todos os estados</option>
        {states.map((state) => (
          <option key={state.code} value={state.code}>
            {state.name}
          </option>
        ))}
      </select>

      <select
        name="region"
        value={selectedRegion}
        onChange={(event) => setSelectedRegion(event.target.value)}
        className="h-12 w-full rounded-none border border-border bg-white/6 px-4 text-sm text-foreground outline-none"
      >
        <option value="">
          {selectedState ? "Todas as regiões do estado" : "Todas as regiões"}
        </option>
        {filteredRegions.map((region) => (
          <option key={region.id} value={region.slug}>
            {region.name} ({region.stateCode})
          </option>
        ))}
      </select>

      <select
        name="stage"
        defaultValue={params.stage ?? ""}
        className="h-12 w-full rounded-none border border-border bg-white/6 px-4 text-sm text-foreground outline-none"
      >
        <option value="">Todas as fases</option>
        {stageOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <Input
        type="text"
        name="bedrooms"
        defaultValue={params.bedrooms ?? ""}
        placeholder="Dormitórios"
        className="h-12 w-full rounded-none border-border bg-white/6 px-4"
      />
      <button
        type="submit"
        className="h-12 w-full rounded-none bg-accent-soft px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary"
      >
        Filtrar
      </button>
    </form>
  );
}
