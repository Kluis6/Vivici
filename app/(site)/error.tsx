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
    <main className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-10">
      <SegmentErrorState
        title="Não foi possível carregar a vitrine inicial"
        description="A página principal não concluiu o carregamento do catálogo e dos destaques. Tente refazer a consulta."
        error={error}
        unstable_retry={unstable_retry}
        reset={reset}
      />
    </main>
  );
}
