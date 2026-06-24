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
      title="Falha ao abrir o cadastro de imóvel"
      description="Os dados auxiliares para criação do imóvel, como estados e regiões, não foram carregados."
      error={error}
      unstable_retry={unstable_retry}
      reset={reset}
    />
  );
}
