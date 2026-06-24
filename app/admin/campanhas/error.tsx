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
      title="A listagem de campanhas falhou"
      description="O painel de promoções não conseguiu montar a tabela com campanhas e vínculos."
      error={error}
      unstable_retry={unstable_retry}
      reset={reset}
    />
  );
}
