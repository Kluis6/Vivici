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
    <main className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10">
      <SegmentErrorState
        title="A busca de imóveis falhou"
        description="Os filtros e a listagem administrativa do catálogo público não puderam ser carregados agora."
        error={error}
        unstable_retry={unstable_retry}
        reset={reset}
      />
    </main>
  );
}
