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
    <main className="noise-bg flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-md">
        <SegmentErrorState
          title="Falha ao abrir o login"
          description="A validação da sessão ou a preparação do acesso administrativo não concluiu corretamente."
          error={error}
          unstable_retry={unstable_retry}
          reset={reset}
        />
      </section>
    </main>
  );
}
