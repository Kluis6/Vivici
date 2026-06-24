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
      title="Falha ao abrir a criação de campanha"
      description="Os imóveis disponíveis para vínculo e a estrutura do formulário não puderam ser preparados."
      error={error}
      unstable_retry={unstable_retry}
      reset={reset}
    />
  );
}
