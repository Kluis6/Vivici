"use client";

import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const ALL_VALUE = "__all__";

export function PropertySearchForm({
  params,
  states,
  regions,
  stageOptions,
}: PropertySearchFormProps) {
  const selectTriggerClassName =
    "!h-12 w-full rounded-none border-border bg-white/6 px-4 text-sm text-foreground";
  const [selectedState, setSelectedState] = useState<string | null>(
    params.state ?? null,
  );
  const [selectedRegion, setSelectedRegion] = useState<string | null>(
    params.region ?? null,
  );
  const [selectedStage, setSelectedStage] = useState<string | null>(
    params.stage ?? null,
  );

  const filteredRegions = selectedState
    ? regions.filter((region) => region.stateCode === selectedState)
    : regions;

  useEffect(() => {
    if (
      selectedRegion &&
      !filteredRegions.some((region) => region.slug === selectedRegion)
    ) {
      setSelectedRegion(null);
    }
  }, [filteredRegions, selectedRegion]);

  return (
    <form className="flex w-full flex-col gap-4 border border-border bg-[rgba(255,255,255,0.04)] p-4 md:flex-row">
      {selectedState ? (
        <input type="hidden" name="state" className="" value={selectedState} />
      ) : null}
      {selectedRegion ? (
        <input type="hidden" name="region" value={selectedRegion} />
      ) : null}
      {selectedStage ? (
        <input type="hidden" name="stage" value={selectedStage} />
      ) : null}

      <Select
        value={selectedState}
        
        onValueChange={(value) =>
          setSelectedState(value === ALL_VALUE ? null : value)
        }
      >
        <SelectTrigger className={selectTriggerClassName}>
          <SelectValue placeholder="Todos os estados" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={ALL_VALUE}>Todos os estados</SelectItem>
            {states.map((state) => (
              <SelectItem key={state.code} value={state.code}>
                {state.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={selectedRegion}
        onValueChange={(value) =>
          setSelectedRegion(value === ALL_VALUE ? null : value)
        }
      >
        <SelectTrigger className={selectTriggerClassName}>
          <SelectValue
            placeholder={
              selectedState
                ? "Todas as regiões do estado"
                : "Todas as regiões"
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={ALL_VALUE}>
              {selectedState
                ? "Todas as regiões do estado"
                : "Todas as regiões"}
            </SelectItem>
            {filteredRegions.map((region) => (
              <SelectItem key={region.id} value={region.slug}>
                {region.name} ({region.stateCode})
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={selectedStage}
        onValueChange={(value) =>
          setSelectedStage(value === ALL_VALUE ? null : value)
        }
      >
        <SelectTrigger className={selectTriggerClassName}>
          <SelectValue placeholder="Todas as fases" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={ALL_VALUE}>Todas as fases</SelectItem>
            {stageOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

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
