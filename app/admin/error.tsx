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
      title="O painel administrativo falhou"
      description="As métricas gerais e os blocos operacionais do admin não puderam ser carregados."
      error={error}
      unstable_retry={unstable_retry}
      reset={reset}
    />
  );
}
