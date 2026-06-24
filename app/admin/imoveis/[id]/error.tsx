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
      title="Falha ao carregar este imóvel"
      description="O registro selecionado ou os dados auxiliares de edição não responderam corretamente."
      error={error}
      unstable_retry={unstable_retry}
      reset={reset}
    />
  );
}
