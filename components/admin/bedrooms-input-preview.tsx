"use client";

import { useState } from "react";

import { normalizeBedroomsLabel } from "@/lib/property";

type BedroomsInputPreviewProps = {
  className: string;
  defaultValue?: string | null;
};

export function BedroomsInputPreview({
  className,
  defaultValue,
}: BedroomsInputPreviewProps) {
  const [value, setValue] = useState(defaultValue ?? "");
  const bedroomItems = normalizeBedroomsLabel(value);

  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-foreground">Dormitórios</span>
      <input
        name="bedroomsLabel"
        defaultValue={defaultValue ?? ""}
        placeholder="Ex.: 2 dorms. com suíte"
        className={className}
        onChange={(event) => setValue(event.target.value)}
      />
      <p className="text-xs leading-6 text-muted-foreground">
        Use separadores como <code>,</code>, <code>;</code>, <code>/</code> ou{" "}
        <code>e</code> para múltiplas tipologias.
      </p>
      {bedroomItems.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {bedroomItems.map((item) => (
            <span
              key={item}
              className="rounded-full border border-border bg-white/6 px-3 py-1 text-xs font-medium text-foreground"
            >
              {item}
            </span>
          ))}
        </div>
      ) : null}
    </label>
  );
}
