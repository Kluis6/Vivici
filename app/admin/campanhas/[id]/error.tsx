"use client";

import { SegmentErrorState } from "@/components/segment-error-state";

export default function Error({
  error,
  unstable_retry,
  reset,
}: {
  error: Error & { digest?: string };
  unstable_retry?: () => void;
  reset?: () => void;
}) {
  return (
    <SegmentErrorState
      title="Falha ao carregar esta campanha"
      description="A campanha selecionada ou a lista de imóveis vinculáveis não foi carregada corretamente."
      error={error}
      unstable_retry={unstable_retry}
      reset={reset}
    />
  );
}
