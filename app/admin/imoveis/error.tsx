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
      title="A listagem de imóveis falhou"
      description="A tabela administrativa de imóveis não retornou os registros ou regiões esperadas."
      error={error}
      unstable_retry={unstable_retry}
      reset={reset}
    />
  );
}
