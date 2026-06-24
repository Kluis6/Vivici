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
        title="Não foi possível abrir este imóvel"
        description="Os dados detalhados do imóvel, a galeria ou os relacionamentos vinculados não responderam como esperado."
        error={error}
        unstable_retry={unstable_retry}
        reset={reset}
      />
    </main>
  );
}
